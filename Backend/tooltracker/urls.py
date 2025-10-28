"""
URL configuration for tooltracker project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# main_project/urls.py
# main_project/urls.py
# tooltracker/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

def home(request):
    return HttpResponse("Welcome to the Tool Tracking System API")

# Swagger schema view with Bearer auth
schema_view = get_schema_view(
    openapi.Info(
        title="Tool Tracking System API",
        default_version='v1',
        description="API documentation for the Tool Tracking System project",
        contact=openapi.Contact(email="admin@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    authentication_classes=[],  # keep empty; views handle JWT auth
)

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/', include('tools.urls')),  # include your app URLs
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
