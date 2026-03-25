from rest_framework import permissions

class RoleBasedAccessPermission(permissions.BasePermission):
    """
    Custom permission to enforce exam RBAC rules:
    - Admin: Full access (including DELETE)
    - Manager: Read, Create, Update (No DELETE)
    - Staff: Read, Create (No UPDATE or DELETE)
    """
    
    def has_permission(self, request, view):
        # Must be authenticated
        if not request.user or not request.user.is_authenticated:
            return False
            
        # Everyone authenticated can list/retrieve (GET)
        if request.method in permissions.SAFE_METHODS:
            return True
            
        role = getattr(request.user, 'role', 'STAFF') # Default to lowest permission
        
        # DELETE operations
        if request.method == 'DELETE':
            return role == 'ADMIN'
            
        # UPDATE operations (PUT, PATCH)
        if request.method in ['PUT', 'PATCH']:
            return role in ['ADMIN', 'MANAGER']
            
        # CREATE operations (POST)
        if request.method == 'POST':
            return role in ['ADMIN', 'MANAGER', 'STAFF']
            
        return False