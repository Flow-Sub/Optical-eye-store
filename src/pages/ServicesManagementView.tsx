import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, DollarSign, Power, Sparkles, Search, Settings } from 'lucide-react';
// ↑ Added Settings here
import { useServices } from '../hooks/useServices';
import { CreateServiceModal } from './CreateServiceModal';

export function ServicesManagementView() {
  const { services, loading, error, refetch } = useServices();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingService, setEditingService] = useState<any>(null);
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/serviceRoutes/deleteService?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        refetch();
      }
    } catch (error) {
      alert('Failed to delete service');
    }
  };

  const handleStatusToggle = async (service: any) => {
    try {
      const formData = new FormData();
      formData.append('status', service.status === 'active' ? 'inactive' : 'active');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/serviceRoutes/updateService?id=${service._id}`, {
        method: 'PUT',
        body: formData,
      });
      
      if (response.ok) {
        refetch();
      }
    } catch (error) {
      alert('Failed to update service status');
    }
  };

  const filteredServices = services.filter(service =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl p-8 text-white">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-gray-400 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Management</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Services</h2>
            <p className="text-gray-400 font-light">Manage appointment services</p>
          </div>
          <Settings className="h-10 w-10 opacity-20" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-semibold">{services.length}</div>
            <div className="text-xs text-gray-400 font-light mt-1">Total Services</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-semibold">
              {services.filter(s => s.status === 'active').length}
            </div>
            <div className="text-xs text-gray-400 font-light mt-1">Active</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-semibold">
              {services.filter(s => s.status === 'inactive').length}
            </div>
            <div className="text-xs text-gray-400 font-light mt-1">Inactive</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
              />
            </div>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-light transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{service.serviceName}</h3>
                <button
                  onClick={() => handleStatusToggle(service)}
                  className={`p-2 rounded-lg transition-colors ${
                    service.status === 'active' 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                  title={service.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  <Power className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-gray-600 font-light mb-4 line-clamp-2">
                {service.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    Duration
                  </span>
                  <span className="font-medium text-gray-900">{service.duration} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <DollarSign className="h-3.5 w-3.5 mr-1" />
                    Price
                  </span>
                  <span className="font-medium text-gray-900">
                    {service.price === 0 ? 'Free' : `$${service.price}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingService(service)}
                  className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-light"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-light"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <CreateServiceModal
        isOpen={isCreateModalOpen || !!editingService}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingService(null);
        }}
        onSuccess={refetch}
        editingService={editingService}
      />
    </div>
  );
}