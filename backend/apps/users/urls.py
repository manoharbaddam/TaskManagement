from django.urls import path
from .views import RegisterView,LoginView
from rest_framework_simplejwt.views import TokenRefreshView #for JWT refresh token

app_name = 'users'

urlpatterns = [
    #for Registration
    path('register/', RegisterView.as_view(), name='register'),
    #for Login
    path('login/', LoginView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]