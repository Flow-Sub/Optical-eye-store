import React, { useState } from 'react';
import { X, Plus, MapPin, Phone, Clock, Image, Calendar, Save, Trash2, Eye, Upload } from 'lucide-react';
import { createStoreLocation, updateStoreLocation, deleteStoreLocation } from '../services/airtable';
import { useStoreLocations } from '../hooks/useStoreLocations';
import { StoreLocation } from '../types';

interface StoreLocationsManagementViewProps {
  onSuccess: () => void;
}

export function StoreLocationsManagementView({ onSuccess }: StoreLocationsManagementViewProps) {
  const { locations, refetch } = useStoreLocations();
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  // Image upload states (single image for locations)
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImage, setUploadedImage] = useState('');  // URL from API
  const [imagePreview, setImagePreview] = useState('');    // Local preview
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    hours: '',
    image: '',
    calendlyUrl: '',
    isActive: true
  });

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      alert('Please fill in name and address');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await updateStoreLocation(editingId, { ...formData, image: uploadedImage || formData.image });  // ✅ Use uploaded or existing
      } else {
        await createStoreLocation({ ...formData, image: uploadedImage });
      }
      
      // Reset form & upload states
      setFormData({
        name: '',
        address: '',
        phone: '',
        hours: '',
        image: '',
        calendlyUrl: '',
        isActive: true
      });
      setUploadedImage('');
      setImagePreview('');
      setEditingId(null);
      
      await refetch();
      onSuccess();
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Failed to save location');
    } finally {
      setLoading(false);
    }
  };

    const handleEdit = (location: StoreLocation) => {
    setFormData({
      name: location.name,
      address: location.address,
      phone: location.phone,
      hours: location.hours,
      image: location.image,
      calendlyUrl: location.calendlyUrl,
      isActive: location.isActive
    });
    setUploadedImage(location.image);  // ✅ Load existing URL
    setImagePreview(location.image);   // ✅ Load preview (same as URL for now)
    setEditingId(location.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    
    setLoading(true);
    try {
      await deleteStoreLocation(id);
      await refetch();
      onSuccess();
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Failed to delete location');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading locations...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Store Locations</h2>
          <p className="text-gray-600 font-light mt-1">Manage your store locations and booking links</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {editingId ? 'Edit Location' : 'Add New Location'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4"> 
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4" />
                <span>Name *</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                placeholder="e.g., Manhattan Flagship"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4" />
                <span>Address *</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                placeholder="123 Fifth Avenue, New York, NY 10001"
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4" />
                  <span>Phone</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                  placeholder="(212) 555-0101"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Hours</span>
                </label>
                <input
                  type="text"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                  placeholder="Mon-Sat: 9AM-8PM, Sun: 10AM-6PM"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                            <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Image className="h-4 w-4" />
                  <span>Store Image</span>
                </label>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Upload className="h-4 w-4" />
                      <span className="font-light text-sm">
                        {uploadingImage ? 'Uploading...' : 'Choose image or drag & drop'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setUploadingImage(true);
                        // Create preview
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);

                        // Upload to API (same as CreateProductModal)
                        try {
                          const uploadFormData = new FormData();
                          uploadFormData.append('image', file);

                          const response = await fetch(`http://134.209.6.174:3000/api/digitalOceanRoutes/uploadImage`, {
                            method: 'POST',
                            body: uploadFormData,
                          });

                          const result = await response.json();

                          if (result.success && result.data?.url) {
                            setUploadedImage(result.data.url);  // ✅ Set API URL
                          } else {
                            alert(`Failed to upload ${file.name}`);
                          }
                        } catch (error) {
                          console.error('Image upload error:', error);
                          alert(`Failed to upload ${file.name}`);
                        } finally {
                          setUploadingImage(false);
                        }
                      }}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Store Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setUploadedImage('');
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    {uploadedImage 
                      ? `✅ Image uploaded successfully` 
                      : 'Upload a store image (recommended: 400x300px)'}
                  </p>
                </div>
              </div>
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Calendly URL</span>
                </label>
                <input
                  type="url"
                  value={formData.calendlyUrl}
                  onChange={(e) => setFormData({ ...formData, calendlyUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                  placeholder="https://calendly.com/your-store/appointment"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active (visible to customers)
              </label>
            </div>

            <div className="flex space-x-3">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: '', address: '', phone: '', hours: '', image: '', calendlyUrl: '', isActive: true
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    <span>{editingId ? 'Update' : 'Add'} Location</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Locations List */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Existing Locations ({locations.length})</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {locations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No locations yet</p>
            ) : (
              locations.map((location) => (
                <div
                  key={location.id}
                  className={`border rounded-lg p-4 ${
                    location.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-gray-900">{location.name}</h5>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          location.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {location.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                      <p className="text-sm font-light text-gray-900">${location.phone} • {location.hours}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(location)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(location.id)}
                        disabled={loading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}