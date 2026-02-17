from rest_framework import viewsets, filters, serializers
from django_filters.rest_framework import DjangoFilterBackend
import django_filters
from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer

class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    category = django_filters.CharFilter(field_name="category", lookup_expr='iexact')

    class Meta:
        model = Product
        fields = ['category', 'min_price', 'max_price']

# Create your views here.
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).order_by('-is_priority', '-added_at')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'category', 'description']
    ordering_fields = ['price', 'added_at', 'is_priority']
    ordering = ['-is_priority', '-added_at']

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
import razorpay
from django.conf import settings

from django.db import transaction

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                # 1. Create the order in the database FIRST
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                order = serializer.instance
                headers = self.get_success_headers(serializer.data)

                # 2. If Payment Method is Online, create Razorpay Order
                if order.payment_method == 'online':
                    try:
                        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
                        payment_order = client.order.create({
                            "amount": int(order.total_price * 100),  # Amount in paise
                            "currency": "INR",
                            "receipt": str(order.id),
                            "payment_capture": 1
                        })
                        
                        order.razorpay_order_id = payment_order['id']
                        order.save()
                        
                        # Return data with Razorpay details
                        data = serializer.data
                        data['razorpay_order_id'] = payment_order['id']
                        data['razorpay_key_id'] = settings.RAZORPAY_KEY_ID
                        
                        return Response(data, status=status.HTTP_201_CREATED, headers=headers)
                    
                    except Exception as e:
                        # If Razorpay fails, Rollback transaction and return error
                        print(f"Razorpay Error: {e}")
                        raise serializers.ValidationError({"detail": f"Payment initialization failed: {str(e)}"})

                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except Exception as e:
             # Capture validation errors or other exceptions and return appropriate response
             if isinstance(e, serializers.ValidationError):
                 return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
             return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        data = request.data
        try:
            razorpay_order_id = data.get('razorpay_order_id')
            razorpay_payment_id = data.get('razorpay_payment_id')
            razorpay_signature = data.get('razorpay_signature')

            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

            # Verify Signature
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            
            # This will raise an error if verification fails
            client.utility.verify_payment_signature(params_dict)

            # If successful, find order and update
            order = Order.objects.get(razorpay_order_id=razorpay_order_id)
            order.payment_status = 'paid'
            order.razorpay_payment_id = razorpay_payment_id
            order.razorpay_signature = razorpay_signature
            order.save()

            return Response({'status': 'Payment verified'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def mark_payment_failed(self, request):
        data = request.data
        try:
            razorpay_order_id = data.get('razorpay_order_id')
            error_description = data.get('error_description', 'Payment Failed')

            # Find order and update status
            order = Order.objects.get(razorpay_order_id=razorpay_order_id)
            order.payment_status = 'failed'
            # Optionally store the error description in a note field if available, or just log it
            # For now just updating status
            order.save()

            return Response({'status': 'Payment marked as failed'}, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)