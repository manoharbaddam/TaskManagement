from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to users with the ADMIN role.
    """
    message = "You do not have permission to perform this action. Admins only."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ADMIN')

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Admins bypass this restriction.
    """
    message = "You can only view or edit your own tasks." 

    def has_object_permission(self, request, view, obj):
        # Admins can do whatever they want to any objec
        if request.user.role == 'ADMIN':
            return True
        # For standard users, the task's 'assigned_to' must match the user making the request
        return obj.assigned_to == request.user
