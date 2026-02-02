# Register your models here.
from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_active', 'is_priority', 'added_at')
    list_filter = ('category', 'is_active', 'is_priority')
    search_fields = ('name', 'category', 'description')