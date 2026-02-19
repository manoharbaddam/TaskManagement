from rest_framework import viewsets
from rest_framework import generics, status
from rest_framework.response import Response

#Task Creation
from .models import Task
from .serializers import TaskSerializer

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
        """
        When creating a task, automatically attach the user 
        who made the request (decoded from the JWT).
        """
        if self.request.user.role != 'ADMIN':
            return Response({
                "message":"Authorization restricted",

            },
            status=status.HTTP_401_UNAUTHORIZED
        )

        serializer.save(created_by=self.request.user)
    