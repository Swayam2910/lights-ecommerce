# Register your models here.
from django.contrib import admin
from .models import Product, Customer, Order, OrderItem

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'in_stock', 'is_active', 'is_priority', 'added_at')
    list_filter = ('category', 'in_stock', 'is_active', 'is_priority')
    search_fields = ('name', 'category', 'description')
    list_editable = ('in_stock', 'is_active', 'is_priority')

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at')
    search_fields = ('name', 'email', 'phone')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    raw_id_fields = ('product',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', 'updated_at', 'customer_info')
    
    def display_items(self, obj):
        return ", ".join([f"{item.quantity}x {item.product.name}" for item in obj.items.all()])
    display_items.short_description = 'Items'

    def customer_info(self, obj):
        return f"Name: {obj.customer.name}\nEmail: {obj.customer.email}\nPhone: {obj.customer.phone}\nAddress: {obj.customer.address}"
    customer_info.short_description = 'Customer Details'

    def customer_phone(self, obj):
        return obj.customer.phone
    customer_phone.short_description = 'Phone'

    def customer_address(self, obj):
        return obj.customer.address
    customer_address.short_description = 'Address'

    list_display = ('id', 'customer', 'customer_phone', 'customer_address', 'display_items', 'total_price', 'payment_method', 'payment_status', 'status', 'created_at')
    list_filter = ('status', 'payment_status', 'payment_method', 'created_at')
    search_fields = ('customer__name', 'customer__email', 'id', 'customer__phone')
    inlines = [OrderItemInline]
    readonly_fields = ('created_at', 'updated_at', 'customer_info')