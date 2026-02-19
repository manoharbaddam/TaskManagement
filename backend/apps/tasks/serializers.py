from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta :
        model = Task
        fields = (
            'id','title','description','status','assigned_by','assigned_to','due_date','priority'
            ,'created_at','updated_at'
        )
        read_only_fields = ('id','assigned_by','created_at','updated_at')

