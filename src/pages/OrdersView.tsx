import React, { useState } from 'react';
import { Package, Mail, Phone, MapPin, Calendar, DollarSign, Search, Filter, Eye, Truck, CheckCircle, Clock, XCircle, Box, ChevronDown, ChevronUp, Download, Sparkles } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { updateOrderStatus } from '../services/airtable';

export function OrdersView() {
  const { orders, loading, error, refetch } = useOrders();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-900 mb-2">Error Loading Orders</h3>
        <p className="text-red-700 font-light mb-4">{error}</p>
        <button onClick={refetch} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-light">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl p-8 text-white">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-gray-400 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Management</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Orders</h2>
            <p className="text-gray-400 font-light">Track and manage customer orders</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg transition-all font-light">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
            <Package className="h-5 w-5 mb-2 opacity-60" />
            <div className="text-2xl font-semibold">{stats.total}</div>
            <div className="text-xs text-gray-400 font-light mt-1">Total</div>
          </div>
          <div className="bg-amber-500/10 backdrop-blur rounded-lg p-4 border border-amber-500/20">
            <Clock className="h-5 w-5 mb-2 text-amber-400" />
            <div className="text-2xl font-semibold">{stats.pending}</div>
            <div className="text-xs text-amber-400 font-light mt-1">Pending</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
            <Box className="h-5 w-5 mb-2 opacity-60" />
            <div className="text-2xl font-semibold">{stats.processing}</div>
            <div className="text-xs text-gray-400 font-light mt-1">Processing</div>
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
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
            <DollarSign className="h-5 w-5 mb-2 opacity-60" />
            <div className="text-2xl font-semibold">${(stats.revenue / 1000).toFixed(1)}k</div>
            <div className="text-xs text-gray-400 font-light mt-1">Revenue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600 font-light">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 font-light">
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
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.orderId}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-600 font-light flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        <span className="text-gray-300">•</span>
                        <p className="text-sm text-gray-600 font-light">{order.numberOfItems} items</p>
                      </div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Customer Info */}
                  <div className="space-y-3">
                    <h4 className="text-xs text-gray-500 uppercase font-medium">Customer</h4>
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-600 font-light mt-1">{order.customerEmail}</p>
                      <p className="text-sm text-gray-600 font-light">{order.customerPhone}</p>
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="space-y-3">
                    <h4 className="text-xs text-gray-500 uppercase font-medium">Shipping</h4>
                    <p className="text-sm text-gray-700 font-light whitespace-pre-line">{order.shippingAddress}</p>
                  </div>

                  {/* Summary */}
                  <div className="space-y-3">
                    <h4 className="text-xs text-gray-500 uppercase font-medium">Summary</h4>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-light">Subtotal:</span>
                        <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-light">Shipping:</span>
                        <span className="font-medium">
                          {order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-light">Tax:</span>
                        <span className="font-medium">${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-900 font-medium">Total:</span>
                        <span className="font-semibold text-gray-900">${order.orderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items Toggle */}
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors mb-4"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <Eye className="h-4 w-4" />
                    View Items ({order.numberOfItems})
                  </span>
                  {expandedOrder === order.id ? (
                    <ChevronUp className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  )}
                </button>

                {/* Order Items */}
                {expandedOrder === order.id && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                    {JSON.parse(order.orderItems).map((item: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            <p className="text-sm text-gray-600 font-light">{item.brand}</p>
                            
                            {/* ✅ PRESCRIPTION INFO - PROFESSIONAL UI */}
                            {item.prescriptionData && (
                              <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
                                {/* Header */}
                                <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-blue-200">
                                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">Prescription Details</p>
                                    <p className="text-xs text-gray-600">Eye Measurement Values</p>
                                  </div>
                                </div>

                                {/* Prescription Data */}
                                <div className="space-y-2">
                                  {/* Right Eye (OD) */}
                                  {item.prescriptionData.rightEye?.sphere && (
                                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-blue-900 bg-blue-100 px-2 py-1 rounded">
                                          OD (Right Eye)
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div className="text-center">
                                          <p className="text-gray-500 font-medium mb-1">SPH</p>
                                          <p className="text-gray-900 font-semibold bg-gray-50 py-1 rounded">
                                            {item.prescriptionData.rightEye.sphere}
                                          </p>
                                        </div>
                                        <div className="text-center">
                                          <p className="text-gray-500 font-medium mb-1">CYL</p>
                                          <p className="text-gray-900 font-semibold bg-gray-50 py-1 rounded">
                                            {item.prescriptionData.rightEye.cylinder}
                                          </p>
                                        </div>
                                        <div className="text-center">
                                          <p className="text-gray-500 font-medium mb-1">AXIS</p>
                                          <p className="text-gray-900 font-semibold bg-gray-50 py-1 rounded">
                                            {item.prescriptionData.rightEye.axis}°
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Left Eye (OS) */}
                                  {item.prescriptionData.leftEye?.sphere && (
                                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-green-900 bg-green-100 px-2 py-1 rounded">
                                          OS (Left Eye)
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div className="text-center">
                                          <p className="text-gray-500 font-medium mb-1">SPH</p>
                                          <p className="text-gray-900 font-semibold bg-gray-50 py-1 rounded">
                                            {item.prescriptionData.leftEye.sphere}
                                          </p>
                                        </div>
                                        <div className="text-center">
                                          <p className="text-gray-500 font-medium mb-1">CYL</p>
                                          <p className="text-gray-900 font-semibold bg-gray-50 py-1 rounded">
                                            {item.prescriptionData.leftEye.cylinder}
                                          </p>
                                        </div>
                                        <div className="text-center">
                                          <p className="text-gray-500 font-medium mb-1">AXIS</p>
                                          <p className="text-gray-900 font-semibold bg-gray-50 py-1 rounded">
                                            {item.prescriptionData.leftEye.axis}°
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Pupillary Distance (PD) */}
                                  {item.prescriptionData.pd && (
                                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                          </div>
                                          <span className="text-xs font-medium text-gray-700">Pupillary Distance</span>
                                        </div>
                                        <span className="text-sm font-bold text-purple-900 bg-purple-50 px-3 py-1 rounded-lg">
                                          {item.prescriptionData.pd} mm
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
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
                    
                    {/* ✅ ADD PRESCRIPTION IMAGES */}
                    {order.prescriptionImages && order.prescriptionImages.length > 0 && (
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-sm font-medium text-gray-900 mb-2">📸 Prescription Images:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {order.prescriptionImages.map((url, i) => (
                            <a 
                              key={i} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block border rounded hover:opacity-75"
                            >
                              <img src={url} alt={`Prescription ${i+1}`} className="w-full h-24 object-cover rounded" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Status Update */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-xs text-gray-500 uppercase font-medium mb-3">Update Status</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(order.id, status)}
                        disabled={order.orderStatus === status || updatingStatus === order.id}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          order.orderStatus === status
                            ? `${getStatusColor(status)} cursor-default`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}