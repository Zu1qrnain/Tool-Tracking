from django.db import models
from accounts.models import User, Department

# ---------------- Tool Model ----------------
class Tool(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    quantity_total = models.PositiveIntegerField(default=0)
    quantity_available = models.PositiveIntegerField(default=0)
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='tools',
        default=1  # default department ID (make sure a department with ID=1 exists)
    )

    def __str__(self):
        return f"{self.name} ({self.department})"


# ---------------- Issuance Model ----------------
class Issuance(models.Model):
    STATUS_CHOICES = [
        ('borrowed', 'Borrowed'),
        ('returned', 'Returned'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='issuances')
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, related_name='issuances')
    borrow_date = models.DateField(auto_now_add=True)
    return_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='borrowed')

    def __str__(self):
        return f"{self.user.username} borrowed {self.tool.name}"


# ---------------- Maintenance Model ----------------
class Maintenance(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, related_name='maintenance_records')
    maintenance_date = models.DateField()
    performed_by = models.CharField(max_length=100, default="System")  # default value
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Maintenance for {self.tool.name} on {self.maintenance_date}"


# ---------------- Calibration Model ----------------
class Calibration(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, related_name='calibration_records')
    calibration_date = models.DateField()
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Calibration for {self.tool.name} on {self.calibration_date}"
