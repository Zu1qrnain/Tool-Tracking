from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from .models import Tool, Issuance, Calibration, Maintenance
from .serializers import ToolSerializer, IssuanceSerializer, RegisterSerializer, CalibrationSerializer, MaintenanceSerializer


# List all tools
class ToolListView(generics.ListAPIView):
    queryset = Tool.objects.all()
    serializer_class = ToolSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]


# Borrow a tool
class BorrowToolView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        tool_id = request.data.get('tool_id')
        try:
            tool = Tool.objects.get(id=tool_id)
        except Tool.DoesNotExist:
            return Response({'error': 'Tool not found'}, status=404)

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


# My Issuances
class MyIssuancesView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        issuances = Issuance.objects.filter(user=request.user)
        serializer = IssuanceSerializer(issuances, many=True)
        return Response(serializer.data)


# Return Tool
# Return Tool
class ReturnToolView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, issuance_id):  # match urls.py
        try:
            issuance = Issuance.objects.get(pk=issuance_id, user=request.user)
        except Issuance.DoesNotExist:
            return Response({'error': 'Issuance not found'}, status=404)

        # Only update if not already returned
        if issuance.status != "returned":
            issuance.status = "returned"
            issuance.return_date = timezone.now()
            issuance.save()

            # Increase the tool quantity
            tool = issuance.tool
            tool.quantity_available += 1
            tool.save()

        return Response({"message": "Tool returned successfully."})



# Register new user
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# List Calibration data
class CalibrationListView(generics.ListAPIView):
    queryset = Calibration.objects.all()
    serializer_class = CalibrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]


# List Maintenance data
class MaintenanceListView(generics.ListAPIView):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
