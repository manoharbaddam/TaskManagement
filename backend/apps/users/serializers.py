from rest_framework import serializers
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer #for JWT authentication and Login Serializer creation

User = get_user_model()

class ResgistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type':'password'},
        min_length=8,
    )

    class Meta:
        model = User
        fields = ('id','email','first_name','last_name','password')
        read_only_fields = ('id',)

    def create(self,validated_data):
        user = User.objects.create_user(
            email = validated_data['email'],
            password = validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self,attrs):
        data = super().validate(attrs)

        data.update(
            {
                'user':{
                    'id':str(self.user.id),
                    'email':str(self.user.email),
                    'first_name':str(self.user.first_name),
                    'role' :self.user.role,
                }
        })

        return data
    
class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','first_name','last_name','email','role')