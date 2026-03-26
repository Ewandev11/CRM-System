from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Company, Contact, ActivityLog
from .serializers import CompanySerializer, ContactSerializer, ActivityLogSerializer
from .permissions import RoleBasedAccessPermission
from .signals import get_current_user # Import helper to get user

class BaseMultiTenantViewSet(viewsets.ModelViewSet):
    permission_classes = [RoleBasedAccessPermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]

    def get_queryset(self):
        user = self.request.user
        
        if not user.is_authenticated:
            return self.queryset.none()
        
        if not hasattr(user, 'organization') or not user.organization:
            return self.queryset.none()
        
        return self.queryset.filter(
            organization=user.organization, 
            is_deleted=False
        ).order_by('-created_timestamp')

    def perform_create(self, serializer):
        user = self.request.user
        
        if not hasattr(user, 'organization') or not user.organization:
            raise PermissionError("User must belong to an organization to create records.")
            
        serializer.save(organization=user.organization)

    def perform_destroy(self, instance):
        """
        Soft Delete Implementation with Manual Activity Logging
        """
        # 1. Perform Soft Delete
        instance.is_deleted = True
        instance.save()
        
        # 2. Manually Create Activity Log (Since post_delete signal won't fire for soft deletes)
        user = get_current_user() or self.request.user
        
        if user and hasattr(instance, 'organization'):
            try:
                ActivityLog.objects.create(
                    organization=instance.organization,
                    user=user,
                    action="DELETE",
                    model_name=instance.__class__.__name__,
                    object_id=instance.id,
                    target=str(instance)
                )
            except Exception as e:
                # Log error but don't block the delete operation
                print(f"Failed to create activity log for delete: {e}")

class CompanyViewSet(BaseMultiTenantViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    search_fields = ['name', 'industry', 'country']

class ContactViewSet(BaseMultiTenantViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    search_fields = ['first_name', 'last_name', 'email']
    filterset_fields = ['company']

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActivityLogSerializer
    permission_classes = [RoleBasedAccessPermission]
    
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or not hasattr(user, 'organization'):
            return ActivityLog.objects.none()
        
        return ActivityLog.objects.filter(
            organization=user.organization
        ).order_by('-timestamp')