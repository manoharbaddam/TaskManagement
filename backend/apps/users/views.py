from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated

#for registration
from .serializers import ResgistrationSerializer

#for JWT login authentication
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer


#for users info
from .serializers import UserListSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()

    permission_classes = (AllowAny,)
    serializer_class = ResgistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "User registered successfully.",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name
                }
            }, 
            status=status.HTTP_201_CREATED
        )

class LoginView(TokenObtainPairView):
    """
    Takes an email and password and returns an access and refresh JSON web
    token, along with the user's basic profile data.
    """
    serializer_class = CustomTokenObtainPairSerializer

class UserListAPIView(generics.ListAPIView):
    """
    API endpoint that allows admins to view all users 
    so they can populate the 'Assign To' dropdown.
    """
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated] # Ensure only logged-in users can see this list