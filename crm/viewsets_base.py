from rest_framework import viewsets

class TenantViewSet(viewsets.ModelViewSet):
    """
    A base viewset that automatically filters data 
    based on the logged-in user's organization.
    """
    def get_queryset(self):
        # 1. Get the normal data for this model
        queryset = super().get_queryset()
        
        # 2. Filter out deleted items (Soft Delete requirement)
        queryset = queryset.filter(is_deleted=False)
        
        # 3. CRITICAL: Only show data belonging to the user's organization
        user_org = self.request.user.organization
        return queryset.filter(organization=user_org)

    def perform_create(self, serializer):
        # When saving a new record, automatically attach the user's organization
        serializer.save(organization=self.request.user.organization)

    def perform_destroy(self, instance):
        # Instead of deleting from DB, we just flip the flag (Soft Delete)
        instance.is_deleted = True
        instance.save()