import React, { useState } from 'react';
import { Package, Mail, Phone, MapPin, Calendar, DollarSign, Search, Filter, Eye, Truck, CheckCircle, Clock, XCircle, Box, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { updateOrderStatus } from '../services/airtable';

export function OrdersView() {
  const { orders, loading, error, refetch } = useOrders();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: any) => {
    setUpdatingStatus(id);
    try {
      await updateOrderStatus(id, status);
      await refetch();
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Box className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    processing: orders.filter(o => o.orderStatus === 'processing').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    revenue: orders.reduce((sum, o) => sum + o.orderTotal, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-900 mb-2">Error Loading Orders</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button onClick={refetch} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Package className="h-10 w-10" />
              Orders Management
            </h2>
            <p className="text-blue-100 text-lg">Track and manage all customer orders</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg transition-all">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
            <Package className="h-6 w-6 mb-2 opacity-80" />
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-sm text-blue-100 mt-1">Total Orders</div>
          </div>
          <div className="bg-amber-500/20 backdrop-blur-md rounded-xl p-5 border border-amber-300/30 hover:bg-amber-500/30 transition-all">
            <Clock className="h-6 w-6 mb-2" />
            <div className="text-3xl font-bold">{stats.pending}</div>
            <div className="text-sm text-amber-100 mt-1">Pending</div>
          </div>
          <div className="bg-blue-500/20 backdrop-blur-md rounded-xl p-5 border border-blue-300/30 hover:bg-blue-500/30 transition-all">
            <Box className="h-6 w-6 mb-2" />
            <div className="text-3xl font-bold">{stats.processing}</div>
            <div className="text-sm text-blue-100 mt-1">Processing</div>
          </div>
          <div className="bg-purple-500/20 backdrop-blur-md rounded-xl p-5 border border-purple-300/30 hover:bg-purple-500/30 transition-all">
            <Truck className="h-6 w-6 mb-2" />
            <div className="text-3xl font-bold">{stats.shipped}</div>
            <div className="text-sm text-purple-100 mt-1">Shipped</div>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-md rounded-xl p-5 border border-emerald-300/30 hover:bg-emerald-500/30 transition-all">
            <CheckCircle className="h-6 w-6 mb-2" />
            <div className="text-3xl font-bold">{stats.delivered}</div>
            <div className="text-sm text-emerald-100 mt-1">Delivered</div>
          </div>
          <div className="bg-green-500/20 backdrop-blur-md rounded-xl p-5 border border-green-300/30 hover:bg-green-500/30 transition-all">
            <DollarSign className="h-6 w-6 mb-2" />
            <div className="text-3xl font-bold">${(stats.revenue / 1000).toFixed(1)}k</div>
            <div className="text-sm text-green-100 mt-1">Revenue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium min-w-[160px]"
            >
              <option value="all">All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="processing">📦 Processing</option>
              <option value="shipped">🚚 Shipped</option>
              <option value="delivered">✅ Delivered</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> of <span className="font-semibold text-gray-900">{orders.length}</span> orders
          </p>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 text-center border border-gray-200">
          <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'No orders have been placed yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md border-2 border-gray-100 hover:border-blue-200 overflow-hidden transition-all duration-200"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-5 border-b-2 border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 rounded-lg p-3">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{order.orderId}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.orderDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <span className="text-gray-300">•</span>
                        <p className="text-sm font-medium text-gray-700">{order.numberOfItems} items</p>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-semibold ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    <span className="capitalize">{order.orderStatus}</span>
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Customer Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                    <h4 className="text-xs font-bold text-blue-900 uppercase mb-3 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Customer Details
                    </h4>
                    <p className="font-bold text-gray-900 text-lg mb-2">{order.customerName}</p>
                    <p className="text-sm text-gray-700 flex items-center gap-2 mb-1.5">
                      <Mail className="h-3.5 w-3.5 text-blue-600" />
                      {order.customerEmail}
                    </p>
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-blue-600" />
                      {order.customerPhone}
                    </p>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                    <h4 className="text-xs font-bold text-purple-900 uppercase mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Shipping Address
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{order.shippingAddress}</p>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                    <h4 className="text-xs font-bold text-green-900 uppercase mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Order Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold text-gray-900">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-semibold text-gray-900">
                          {order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-semibold text-gray-900">${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-2 border-t-2 border-green-200">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-green-700 text-xl">${order.orderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items Toggle */}
                <div className="border-t-2 border-gray-100 pt-5">
                  <button
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all mb-4"
                  >
                    <span className="flex items-center gap-2 font-semibold text-gray-900">
                      <Eye className="h-5 w-5 text-blue-600" />
                      {selectedOrder?.id === order.id ? 'Hide' : 'View'} Order Items ({order.numberOfItems})
                    </span>
                    {selectedOrder?.id === order.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </button>

                  {/* Order Items */}
                  {selectedOrder?.id === order.id && (
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 mb-5 border-2 border-blue-100 animate-slideDown">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {JSON.parse(order.orderItems).map((item: any, idx: number) => (
                          <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-lg">{item.productName}</p>
                                <p className="text-sm text-gray-600 mt-1">{item.brand}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                    Qty: {item.quantity}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    ${item.price.toFixed(2)} each
                                  </span>
                                </div>
                                {item.lensOption && (
                                  <p className="text-xs text-blue-600 mt-2 bg-blue-50 inline-block px-2 py-1 rounded">
                                    + {item.lensOption.name} (+${item.lensOption.price})
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Update Buttons */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-3">Update Order Status</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { value: 'pending', label: 'Pending', icon: Clock },
                        { value: 'processing', label: 'Processing', icon: Box },
                        { value: 'shipped', label: 'Shipped', icon: Truck },
                        { value: 'delivered', label: 'Delivered', icon: CheckCircle },
                        { value: 'cancelled', label: 'Cancelled', icon: XCircle }
                      ].map((status) => {
                        const Icon = status.icon;
                        const isActive = order.orderStatus === status.value;
                        const isUpdating = updatingStatus === order.id;
                        
                        return (
                          <button
                            key={status.value}
                            onClick={() => handleStatusChange(order.id, status.value)}
                            disabled={isActive || isUpdating}
                            className={`flex flex-col items-center justify-center px-3 py-3 rounded-xl font-medium transition-all border-2 ${
                              isActive
                                ? `${getStatusColor(status.value)} cursor-default shadow-md scale-105`
                                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                            } disabled:opacity-50`}
                          >
                            <Icon className="h-5 w-5 mb-1" />
                            <span className="text-xs">{status.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}