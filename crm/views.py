from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Company, Contact, ActivityLog
from .serializers import CompanySerializer, ContactSerializer, ActivityLogSerializer
from .permissions import RoleBasedAccessPermission

class BaseMultiTenantViewSet(viewsets.ModelViewSet):
    permission_classes = [RoleBasedAccessPermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]

    def get_queryset(self):
        # Isolation: Filter by User's Org + Hide Soft-Deleted items
        return self.queryset.filter(
            organization=self.request.user.organization, 
            is_deleted=False
        ).order_by('-created_timestamp')

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)

    def perform_destroy(self, instance):
        # Soft Delete Implementation
        instance.is_deleted = True
        instance.save()

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
    def get_queryset(self):
        return ActivityLog.objects.filter(organization=self.request.user.organization).order_by('-timestamp')