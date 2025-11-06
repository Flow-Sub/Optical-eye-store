import React, { useState } from 'react';
import { Package, Calendar, Search, Filter, Eye, Truck, Download, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, Box, Sparkles, ShoppingBag } from 'lucide-react';
import { useUserOrders } from '../hooks/useUserOrders';
import { useNavigate } from 'react-router-dom';

export function MyOrdersPage() {
  const { orders, loading, error } = useUserOrders();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'processing': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3.5 w-3.5" />;
      case 'processing': return <Box className="h-3.5 w-3.5" />;
      case 'shipped': return <Truck className="h-3.5 w-3.5" />;
      case 'delivered': return <CheckCircle className="h-3.5 w-3.5" />;
      case 'cancelled': return <XCircle className="h-3.5 w-3.5" />;
      default: return <Package className="h-3.5 w-3.5" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    return statusFilter === 'all' || order.orderStatus === statusFilter;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'processing').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-900 mb-2">Error Loading Orders</h3>
          <p className="text-red-700 font-light">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header & Stats */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl p-8 text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-gray-400 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Account</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">My Orders</h1>
              <p className="text-gray-400 font-light">Track your purchases and order history</p>
            </div>
            <Package className="h-10 w-10 opacity-20" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
              <Package className="h-5 w-5 mb-2 opacity-60" />
              <div className="text-2xl font-semibold">{stats.total}</div>
              <div className="text-xs text-gray-400 font-light mt-1">Total Orders</div>
            </div>
            <div className="bg-amber-500/10 backdrop-blur rounded-lg p-4 border border-amber-500/20">
              <Clock className="h-5 w-5 mb-2 text-amber-400" />
              <div className="text-2xl font-semibold">{stats.pending}</div>
              <div className="text-xs text-amber-400 font-light mt-1">In Progress</div>
            </div>
            <div className="bg-purple-500/10 backdrop-blur rounded-lg p-4 border border-purple-500/20">
              <Truck className="h-5 w-5 mb-2 text-purple-400" />
              <div className="text-2xl font-semibold">{stats.shipped}</div>
              <div className="text-xs text-purple-400 font-light mt-1">Shipped</div>
            </div>
            <div className="bg-green-500/10 backdrop-blur rounded-lg p-4 border border-green-500/20">
              <CheckCircle className="h-5 w-5 mb-2 text-green-400" />
              <div className="text-2xl font-semibold">{stats.delivered}</div>
              <div className="text-xs text-green-400 font-light mt-1">Delivered</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span className="text-sm text-gray-600 font-light ml-auto">
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 font-light mb-6">
              {statusFilter !== 'all' 
                ? 'No orders with this status'
                : "You haven't placed any orders yet"}
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-light"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Start Shopping</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.orderId}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-600 font-light flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        <span className="text-gray-300">•</span>
                        <p className="text-sm text-gray-600 font-light">{order.numberOfItems} items</p>
                        <span className="text-gray-300">•</span>
                        <p className="text-sm font-semibold text-gray-900">${order.orderTotal.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      <span className="capitalize">{order.orderStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mb-4">
                    {(order.orderStatus === 'shipped' || order.orderStatus === 'delivered') && (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-light">
                        <Truck className="h-4 w-4" />
                        <span>Track Order</span>
                      </button>
                    )}
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-light">
                      <Download className="h-4 w-4" />
                      <span>Download Invoice</span>
                    </button>
                  </div>

                  {/* View Items Toggle */}
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Eye className="h-4 w-4" />
                      View Items
                    </span>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="h-4 w-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    )}
                  </button>

                  {/* Order Items */}
                  {expandedOrder === order.id && (
                    <div className="bg-gray-50 rounded-lg p-4 mt-4 space-y-3">
                      {JSON.parse(order.orderItems).map((item: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{item.productName}</p>
                              <p className="text-sm text-gray-600 font-light">{item.brand}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-sm text-gray-600 font-light">
                                  ${item.price.toFixed(2)} each
                                </span>
                              </div>
                            </div>
                            <p className="font-semibold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}