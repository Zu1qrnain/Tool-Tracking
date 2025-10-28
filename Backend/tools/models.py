from django.db import models
from django.contrib.auth.models import AbstractUser



class Department(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name



class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


class Tool(models.Model):
    CATEGORY_CHOICES = (
        ('mechanical', 'Mechanical'),
        ('electrical', 'Electrical'),
    )
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    quantity_total = models.PositiveIntegerField()
    quantity_available = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.name} ({self.category})"



class Issuance(models.Model):
    STATUS_CHOICES = (
        ('borrowed', 'Borrowed'),
        ('returned', 'Returned'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE)
    borrow_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='borrowed')

    def __str__(self):
        return f"{self.tool.name} issued to {self.user.username}"




class Maintenance(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE)
    maintenance_date = models.DateTimeField()
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Maintenance for {self.tool.name} on {self.maintenance_date.date()}"


class Calibration(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE)
    calibration_date = models.DateTimeField()
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Calibration for {self.tool.name} on {self.calibration_date.date()}"


