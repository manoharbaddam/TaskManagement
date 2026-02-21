from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status
from rest_framework.response import Response

#Task Creation
from .models import Task
from .serializers import TaskSerializer
from rest_framework.exceptions import PermissionDenied

from apps.users.permissions import TaskRolePermission #permissions


# Create your views here.
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [TaskRolePermission]

    #1. Turn on the Filter, Search, and Ordering engines 
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    # Exact Match Filters (e.g., ?status=DONE)
    filterset_fields = ['status', 'priority']
    # Partial Match Search (e.g., ?search=meeting)
    search_fields = ['title', 'description']
    #Sorting (e.g., ?ordering=-due_date)
    ordering_fields = ['due_date', 'created_at']
    ordering = ['-created_at']

    # We don't need to explicitly define permission_classes = [IsAuthenticated] 
    # because we set it as the global default in base.py!

    def get_queryset(self):
        """
        Users can only see their own tasks.
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

    