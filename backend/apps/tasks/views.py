from rest_framework import viewsets
from rest_framework import generics, status
from rest_framework.response import Response

#Task Creation
from .models import Task
from .serializers import TaskSerializer
from rest_framework.exceptions import PermissionDenied


# Create your views here.
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    # We don't need to explicitly define permission_classes = [IsAuthenticated] 
    # because we set it as the global default in base.py!

    def get_queryset(self):
        """
        Business Rule: Users can only see their own tasks.
        Admins can see all tasks.
        """
        user = self.request.user
        if user.role=="ADMIN":
            return Task.objects.all()
        
        #standard users can view only task they are assigned to
        return Task.objects.filter(assigned_to=user)
    
    def perform_create(self, serializer):
        if self.request.user.role != 'ADMIN':
        # Raising an exception correctly stops the process and returns an error to the client
            raise PermissionDenied("Authorization restricted")

        serializer.save(assigned_by=self.request.user)

    