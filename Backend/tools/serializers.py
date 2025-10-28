from rest_framework import serializers
from .models import User, Tool, Issuance, Maintenance, Calibration, Department
from django.contrib.auth import get_user_model

User = get_user_model()

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'department']

class ToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tool
        fields = ['id', 'name', 'category', 'quantity_total', 'quantity_available']

class IssuanceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    tool = ToolSerializer(read_only=True)
    tool_id = serializers.PrimaryKeyRelatedField(
        queryset=Tool.objects.all(), source='tool', write_only=True
    )

    class Meta:
        model = Issuance
        fields = ['id', 'user', 'tool', 'tool_id', 'borrow_date', 'return_date', 'status']

class MaintenanceSerializer(serializers.ModelSerializer):
    tool = ToolSerializer(read_only=True)
    class Meta:
        model = Maintenance
        fields = ['id', 'tool', 'maintenance_date', 'performed_by', 'notes']

class CalibrationSerializer(serializers.ModelSerializer):
    tool = ToolSerializer(read_only=True)
    performed_by = serializers.StringRelatedField()

    class Meta:
        model = Calibration
        fields = ['id', 'tool', 'calibration_date', 'performed_by', 'notes']



# ------------------ New Serializer for Registration ------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user
