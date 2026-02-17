from django.db import models

# Create your models here.

class CategoryChoices(models.TextChoices):
    CEILING_CHANDELIER = 'Ceiling Chandelier', 'Ceiling Chandelier'
    HANGING_LIGHTS = 'Hanging Lights', 'Hanging Lights'
    FANCY_WALL_LIGHTS = 'Fancy Wall Lights', 'Fancy Wall Lights'
    MIRROR_LIGHTS = 'Mirror Lights', 'Mirror Lights'
    MAGNETIC_TRACK = 'Magnetic Track', 'Magnetic Track'
    OUTDOOR_FOOT_LIGHTS = 'Outdoor Foot Lights', 'Outdoor Foot Lights'
    WALL_LAMPS = 'Wall Lamps', 'Wall Lamps'
    DOUBLE_HEIGHT_DUPLEX_CHANDELIER = 'Double Height Duplex Chandelier', 'Double Height Duplex Chandelier'
    WALL_FITTING_WATCHES = 'Wall Fitting Watches', 'Wall Fitting Watches'
    LED_LIGHTS = 'LED Lights', 'LED Lights'

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
        max_length=100,
        choices=CategoryChoices.choices
    )
    added_at=models.DateTimeField(auto_now_add=True)
    image=models.ImageField(upload_to='product_images/',null=True,blank=True)
    in_stock = models.BooleanField(default=True)

class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete = models.CASCADE)
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    payment_method = models.CharField(
        max_length=20,
        choices=[
            ('cod', 'Cash on Delivery'),
            ('online', 'Online Payment')
        ],
        default='cod'
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('shipped', 'Shipped'),
            ('delivered', 'Delivered'),
            ('cancelled', 'Cancelled')
        ],
        default='pending'
    )
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('paid', 'Paid'),
            ('failed', 'Failed')
        ],
        default='pending'
    )
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.status}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in {self.order}"