from django.db import models
from django.contrib.auth.models import AbstractUser

# ---------------- Department Model ----------------
class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# ---------------- Custom User Model ----------------
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.username
