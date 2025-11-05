import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder, updateProductStock } from '../services/airtable';

export function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const shippingCost = total > 150 ? 0 : 15.99;
  const tax = total * 0.08;
  const finalTotal = total + shippingCost + tax;

  const handlePlaceOrder = async () => {
    try {
      const orderId = `ORD-${Date.now().toString().slice(-8)}`;
      
      const shippingAddress = `${shippingInfo.firstName} ${shippingInfo.lastName}
${shippingInfo.address}
${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}
${shippingInfo.country}
Phone: ${shippingInfo.phone}`;

      const orderItems = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        brand: item.product.brand,
        price: item.product.price,
        quantity: item.quantity,
        lensOption: item.lensOption ? {
          name: item.lensOption.name,
          price: item.lensOption.price
        } : null,
        coatings: item.coatings?.map(c => ({
          name: c.name,
          price: c.price
        })) || [],
        prescriptionData: item.prescriptionData || null
      }));

      await createOrder({
        orderId,
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone,
        shippingAddress,
        orderItems: JSON.stringify(orderItems),
        subtotal: total,
        shippingCost,
        tax,
        orderTotal: finalTotal,
        numberOfItems: items.reduce((sum, item) => sum + item.quantity, 0),
        orderStatus: 'pending',
        orderDate: new Date().toISOString(),
      });

      for (const item of items) {
        await updateProductStock(item.product.id, item.quantity);
      }

      setOrderPlaced(true);
      setStep('confirmation');
      
      setTimeout(() => {
        clearCart();
      }, 2000);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 font-light mb-8">Add some items to proceed with checkout</p>
          <Link
            to="/products"
            className="inline-block bg-gray-900 text-white px-8 py-3 font-light hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/cart"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 font-light transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-gray-500 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Secure Checkout</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
        </div>

        {step === 'confirmation' ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
            <p className="text-lg text-gray-600 font-light mb-8">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <p className="text-gray-700 font-light">
                <strong className="font-medium">Order Number:</strong> #ORD-{Date.now().toString().slice(-6)}
              </p>
              <p className="text-gray-700 font-light mt-2">
                <strong className="font-medium">Total:</strong> ${finalTotal.toFixed(2)}
              </p>
            </div>
            <Link
              to="/"
              className="inline-block bg-gray-900 text-white px-8 py-3 font-light hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                  <Truck className="h-5 w-5 text-gray-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.nameOnCard}
                      onChange={(e) => setPaymentInfo({...paymentInfo, nameOnCard: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-32">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-600 font-light">Qty: {item.quantity}</p>
                        {item.lensOption && (
                          <p className="text-xs text-gray-600 font-light">+ {item.lensOption.name}</p>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${((item.product.price + (item.lensOption?.price || 0) + 
                           (item.coatings?.reduce((sum, c) => sum + c.price, 0) || 0)) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-light">Subtotal</span>
                    <span className="text-gray-900 font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-light">Shipping</span>
                    <span className="text-gray-900 font-medium">
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-light">Tax</span>
                    <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-gray-900 text-white py-3.5 px-6 font-light hover:bg-gray-800 transition-colors"
                >
                  Place Order
                </button>

                <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center text-xs text-gray-600 font-light">
                  <Shield className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}