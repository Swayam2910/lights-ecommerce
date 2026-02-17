import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock, MapPin, Phone, User, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from "../config";

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        address: '',
        city: '',
        zip: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const zipRegex = /^\d{6}$/;
        const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile number validation

        if (!zipRegex.test(formData.zip)) {
            alert("Please enter a valid 6-digit ZIP code.");
            return false;
        }
        if (!mobileRegex.test(formData.mobile)) {
            alert("Please enter a valid 10-digit Mobile Number.");
            return false;
        }
        return true;
    };

    const handlePaymentSuccess = async (response, orderId) => {
        try {
            const verifyResponse = await fetch(`${API_BASE_URL}orders/verify_payment/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                }),
            });

            if (verifyResponse.ok) {
                alert("Payment Successful! Order Placed.");
                clearCart();
                window.location.href = '/';
            } else {
                alert("Payment Verification Failed. Please contact support.");
            }
        } catch (error) {
            console.error("Verification Error:", error);
            alert("Payment Verification Failed. Please contact support.");
        }
    };

    const handlePaymentFailure = async (response, razorpayOrderId) => {
        try {
            await fetch(`${API_BASE_URL}orders/mark_payment_failed/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    razorpay_order_id: razorpayOrderId,
                    error_description: response.error.description
                }),
            });
        } catch (error) {
            console.error("Error marking payment failed:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        const orderData = {
            customer: {
                name: formData.name,
                email: formData.email,
                phone: formData.mobile,
                address: `${formData.address}, ${formData.city}, ${formData.zip}`
            },
            items: cart.map(item => ({
                product: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            total_price: cartTotal,
            payment_method: paymentMethod
        };

        try {
            const response = await fetch(`${API_BASE_URL}orders/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            const result = await response.json();

            if (paymentMethod === 'online') {
                const options = {
                    key: result.razorpay_key_id,
                    amount: result.total_price * 100,
                    currency: "INR",
                    name: "Om Lights",
                    description: "Order Payment",
                    order_id: result.razorpay_order_id,
                    handler: function (response) {
                        handlePaymentSuccess(response, result.id);
                    },
                    prefill: {
                        name: formData.name,
                        email: formData.email,
                        contact: "+91" + formData.mobile
                    },
                    theme: {
                        color: "#D4AF37"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    alert("Payment Failed: " + response.error.description);
                    handlePaymentFailure(response, result.razorpay_order_id);
                });
                rzp1.open();
                setLoading(false); // Stop loading, let user pay
            } else {
                alert("Order placed successfully!");
                clearCart();
                window.location.href = '/';
            }

        } catch (error) {
            console.error("Order failed:", error);
            alert("Failed to place order. Please try again. " + error.message);
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-12 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                <Link to="/" className="inline-flex items-center text-gray-400 hover:text-gold-500 transition-colors mb-8">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Shopping
                </Link>

                <h1 className="text-4xl font-serif text-white mb-12">Secure Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left Column: Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-lg">
                            <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                                <MapPin className="text-gold-500" size={24} />
                                Shipping Information
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded py-3 pl-12 pr-4 text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded py-3 pl-12 pr-4 text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 000-0000"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded py-3 pl-12 pr-4 text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="123 Luxury Way"
                                        required
                                        rows="3"
                                        className="w-full bg-white/5 border border-white/10 rounded py-3 px-4 text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded py-3 px-4 text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">ZIP Code</label>
                                        <input
                                            type="text"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded py-3 px-4 text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm text-gray-400 mb-2">Payment Method</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'cod' ? 'bg-gold-500/10 border-gold-500 text-gold-500' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                                        >
                                            <span className="font-serif">Cash on Delivery</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('online')}
                                            className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'online' ? 'bg-gold-500/10 border-gold-500 text-gold-500' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                                        >
                                            <span className="font-serif">Online Payment</span>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || cart.length === 0}
                                    className="w-full mt-8 py-4 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-bold uppercase tracking-wider hover:from-gold-400 hover:to-amber-500 transition-all shadow-lg shadow-gold-500/20 rounded flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CreditCard size={20} className="group-hover:scale-110 transition-transform" />
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Right Column: Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-lg">
                            <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                                <CheckCircle className="text-gold-500" size={24} />
                                Order Review
                            </h2>

                            <div className="space-y-4 mb-8 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.length === 0 ? (
                                    <p className="text-gray-500">Your cart is empty.</p>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-gray-900 rounded overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs">No Image</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-medium text-sm">{item.name}</h4>
                                                <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-gold-500 font-medium">&#8377; {(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="border-t border-white/5 pt-6 space-y-3">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>&#8377; {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-white font-serif text-xl border-t border-white/5 pt-4">
                                    <span>Total</span>
                                    <span className="text-gold-500">&#8377; {cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-xs text-center">
                                <Lock size={12} />
                                Secure Encrypted SSL Payment
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
