from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.SerializerMethodField()
    class Meta :
        model = Task
        fields = (
            'id','title','description','status','assigned_by','assignee_name','assigned_to','due_date','priority'
            ,'created_at','updated_at'
        )
        read_only_fields = ('id','assigned_by','created_at','updated_at')

    def get_assignee_name(self, obj):
        if obj.assigned_to:
            # Tries to return "First Last", falls back to Email if names are blank
            full_name = f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}".strip()
            return full_name if full_name else obj.assigned_to.email
        return "Unassigned"