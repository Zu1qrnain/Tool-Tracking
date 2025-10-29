from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from .models import Tool, Issuance, Calibration, Maintenance
from accounts.serializers import RegisterSerializer
from .serializers import (
    ToolSerializer,
    IssuanceSerializer,
    RegisterSerializer,
    CalibrationSerializer,
    MaintenanceSerializer
)


# ===============================
# Tool List View (Filtered by Department)
# ===============================
class ToolListView(generics.ListAPIView):
    serializer_class = ToolSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        """Return tools only from the user's department."""
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Tool.objects.all()  # Admin sees all tools
        elif user.department:
            return Tool.objects.filter(department=user.department)  # Normal user sees own dept tools
        return Tool.objects.none()  # If user has no department, show nothing


# ===============================
# Borrow a Tool
# ===============================
class BorrowToolView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        tool_id = request.data.get('tool_id')

        try:
            tool = Tool.objects.get(id=tool_id)
        except Tool.DoesNotExist:
            return Response({'error': 'Tool not found'}, status=404)

        # ✅ Check if tool belongs to user's department
        if request.user.department and tool.department != request.user.department:
            return Response({'error': 'You are not allowed to borrow this department’s tool.'}, status=403)

        if tool.quantity_available < 1:
            return Response({'error': 'No tool available'}, status=400)

        issuance = Issuance.objects.create(
            user=request.user,
            tool=tool,
            status='borrowed'
        )

        tool.quantity_available -= 1
        tool.save()

        serializer = IssuanceSerializer(issuance)
        return Response(serializer.data)


# ===============================
# My Issuances
# ===============================
class MyIssuancesView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        issuances = Issuance.objects.filter(user=request.user)
        serializer = IssuanceSerializer(issuances, many=True)
        return Response(serializer.data)


# ===============================
# Return Tool
# ===============================
class ReturnToolView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, issuance_id):
        try:
            issuance = Issuance.objects.get(pk=issuance_id, user=request.user)
        except Issuance.DoesNotExist:
            return Response({'error': 'Issuance not found'}, status=404)

        if issuance.status != "returned":
            issuance.status = "returned"
            issuance.return_date = timezone.now()
            issuance.save()

            # Increase available count
            tool = issuance.tool
            tool.quantity_available += 1
            tool.save()

        return Response({"message": "Tool returned successfully."})


# ===============================
# Register new user
# ===============================
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# ===============================
# Calibration List
# ===============================
class CalibrationListView(generics.ListAPIView):
    serializer_class = CalibrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Calibration.objects.all()
        elif user.department:
            return Calibration.objects.filter(tool__department=user.department)
        return Calibration.objects.none()


# ===============================
# Maintenance List
# ===============================
class MaintenanceListView(generics.ListAPIView):
    serializer_class = MaintenanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Maintenance.objects.all()
        elif user.department:
            return Maintenance.objects.filter(tool__department=user.department)
        return Maintenance.objects.none()
