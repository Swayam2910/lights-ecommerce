from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import ProductViewSet, OrderViewSet, validate_promocode

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('promo-codes/validate/', validate_promocode, name='validate_promocode'),
] + router.urls