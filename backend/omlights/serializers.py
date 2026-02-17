from rest_framework import serializers
from .models import Product, Customer, Order, OrderItem

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "is_active",
            "category",
            "is_priority",
            "image",
            "in_stock"
        ]

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'email', 'phone', 'address']
        extra_kwargs = {
            'email': {'validators': []}
        }

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer = CustomerSerializer()

    class Meta:
        model = Order
        fields = ['id', 'customer', 'items', 'total_price', 'payment_method', 'payment_status', 'status', 'created_at']

    def create(self, validated_data):
        customer_data = validated_data.pop('customer')
        items_data = validated_data.pop('items')

        # Create or update customer
        customer, created = Customer.objects.update_or_create(
            email=customer_data.get('email'),
            defaults=customer_data
        )

        order = Order.objects.create(customer=customer, **validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order