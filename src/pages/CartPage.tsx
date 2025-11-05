import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Sparkles, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 font-light mb-8">Add some amazing frames to get started</p>
          <Link
            to="/products"
            className="inline-block bg-gray-900 text-white px-8 py-3 font-light hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const getItemTotal = (item: any) => {
    const lensPrice = item.lensOption?.price || 0;
    const coatingsPrice = item.coatings?.reduce((sum: number, coating: any) => sum + coating.price, 0) || 0;
    return (item.product.price + lensPrice + coatingsPrice) * item.quantity;
  };

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-gray-500 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Shopping</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Your Cart</h1>
          <p className="text-gray-600 font-light mt-2">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-light">{item.product.brand}</p>
                      <p className="text-sm text-gray-900 font-medium mt-1">${item.product.price}</p>
                      
                      {item.lensOption && (
                        <div className="mt-3 space-y-1">
                          <p className="text-sm text-gray-900 font-medium flex items-center">
                            <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            {item.lensOption.name} (+${item.lensOption.price})
                          </p>
                          {item.coatings && item.coatings.length > 0 && (
                            <p className="text-xs text-gray-600 font-light ml-5">
                              Coatings: {item.coatings.map(c => c.name).join(', ')}
                            </p>
                          )}
                          {item.prescriptionData && (
                            <p className="text-xs text-gray-600 font-light ml-5">
                              With prescription
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Item Total */}
                      <p className="text-lg font-bold text-gray-900">
                        ${getItemTotal(item).toFixed(2)}
                      </p>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-32">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-light">Subtotal</span>
                  <span className="text-gray-900 font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-light">Shipping</span>
                  <span className="text-gray-900 font-medium">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>
              
              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="w-full bg-gray-900 text-white py-3.5 px-6 font-light hover:bg-gray-800 transition-colors text-center block"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/products"
                  className="w-full border border-gray-300 text-gray-900 py-3 px-6 font-light hover:bg-gray-50 transition-colors text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-xs text-gray-600 font-light">
                <p className="flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 mr-2 text-green-500" />
                  Free shipping on orders over $150
                </p>
                <p className="flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 mr-2 text-green-500" />
                  90-day satisfaction guarantee
                </p>
                <p className="flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 mr-2 text-green-500" />
                  Secure payment processing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}