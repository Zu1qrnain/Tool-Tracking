from django.urls import path
from .views import (
    ToolListView, BorrowToolView, ReturnToolView, MyIssuancesView,
    RegisterView, CalibrationListView, MaintenanceListView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # JWT authentication endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API endpoints
    path('tools/', ToolListView.as_view()),
    path('borrow/', BorrowToolView.as_view()),
    path('return/<int:issuance_id>/', ReturnToolView.as_view()),
    path('issuances/my/', MyIssuancesView.as_view()),
    path('register/', RegisterView.as_view(), name='register'),
    path('calibration/', CalibrationListView.as_view(), name='calibration-list'),
    path('maintenance/', MaintenanceListView.as_view(), name='maintenance-list'),  # <-- added
]
