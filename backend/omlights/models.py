from django.db import models

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(
        max_digits = 10,
        decimal_places=2
    )
    is_active = models.BooleanField(default=True)
    is_priority = models.BooleanField(default=False)
    category=models.CharField(
        max_length=100
    )
    added_at=models.DateTimeField(auto_now_add=True)

