from rest_framework import permissions

class RoleBasedAccessPermission(permissions.BasePermission):
    """
    Custom permission to enforce RBAC rules:
    - Admin: Full access (including DELETE)
    - Manager: Read, Create, Update (No DELETE)
    - Staff: Read, Create (No UPDATE or DELETE)
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.method in permissions.SAFE_METHODS:
            return True
        
        role = getattr(request.user, 'role', 'Staff')
        
        if request.method == 'DELETE':
            return role == 'Admin'
        
        if request.method in ['PUT', 'PATCH']:
            return role in ['Admin', 'Manager']
        
        if request.method == 'POST':
            return role in ['Admin', 'Manager', 'Staff']
        
        return False
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        role = getattr(request.user, 'role', 'Staff')
        
        if request.method in ['PUT', 'PATCH']:
            return role in ['Admin', 'Manager']
        
        if request.method == 'DELETE':
            return role == 'Admin'
        
        return False