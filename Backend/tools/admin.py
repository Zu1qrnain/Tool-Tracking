from django.contrib import admin

# Register your models here.
from .models import Department, User, Tool, Issuance, Maintenance, Calibration
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ('username', 'email', 'role', 'department', 'is_staff', 'is_active')
    list_filter = ('role', 'department', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('role', 'department', 'is_staff', 'is_active', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'role', 'department', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )


@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'quantity_total', 'quantity_available')
    list_filter = ('category',)
    search_fields = ('name',)



@admin.register(Issuance)
class IssuanceAdmin(admin.ModelAdmin):
    list_display = ('tool', 'user', 'borrow_date', 'return_date', 'status')
    list_filter = ('status',)
    search_fields = ('tool__name', 'user__username')

@admin.register(Maintenance)
class MaintenanceAdmin(admin.ModelAdmin):
    list_display = ('tool', 'maintenance_date', 'performed_by')
    search_fields = ('tool__name', 'performed_by__username')


@admin.register(Calibration)
class CalibrationAdmin(admin.ModelAdmin):
    list_display = ('tool', 'calibration_date', 'performed_by')
    search_fields = ('tool__name', 'performed_by__username')