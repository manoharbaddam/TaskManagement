from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to users with the ADMIN role.
    """
    message = "You do not have permission to perform this action. Admins only."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ADMIN')

class TaskRolePermission(permissions.BasePermission):
    """
    Strict RBAC for Tasks:
    - Admins: Full access (Create, Read, Update, Delete)
    - Users: Can only view and update tasks assigned to them. Cannot create or delete.
    """

    def has_permission(self, request, view):
        if request.method == "POST":
            return request.user.role == "ADMIN"
        return True
    
    def  has_object_permission(self, request, view, obj):
        if request.user.role == "ADMIN":
            return True
        
        if request.method == "DELETE":
            return False
        
        return obj.assigned_to == request.user
    
    