import React, { useState } from 'react';
import { X, Plus, Shield, DollarSign, FileText, Save, Trash2 } from 'lucide-react';
import { createCoatingOption, updateCoatingOption, deleteCoatingOption } from '../services/airtable';
import { useCoatingOptions } from '../hooks/useCoatingOptions';

interface CreateCoatingOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateCoatingOptionsModal({ isOpen, onClose, onSuccess }: CreateCoatingOptionsModalProps) {
  const { coatingOptions, refetch } = useCoatingOptions();
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price < 0) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await updateCoatingOption(editingId, formData);
      } else {
        await createCoatingOption(formData);
      }
      
      // Reset form
      setFormData({
        name: '',
        price: 0,
        description: '',
        isActive: true
      });
      setEditingId(null);
      
      await refetch();
      onSuccess();
    } catch (error) {
      console.error('Error saving coating option:', error);
      alert('Failed to save coating option');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (option: any) => {
    setFormData({
      name: option.name,
      price: option.price,
      description: option.description,
      isActive: option.isActive
    });
    setEditingId(option.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coating option?')) return;
    
    setLoading(true);
    try {
      await deleteCoatingOption(id);
      await refetch();
      onSuccess();
    } catch (error) {
      console.error('Error deleting coating option:', error);
      alert('Failed to delete coating option');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Manage Coating Options
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {editingId ? 'Edit Coating Option' : 'Add New Coating Option'}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Shield className="h-4 w-4" />
                  <span>Name *</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                  placeholder="e.g., Anti-Reflective"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Price *</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                  placeholder="49.99"
                  min="0"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Description</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900"
                  placeholder="Reduces glare and reflections for clearer vision"
                  rows={3}
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActiveCoating"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                />
                <label htmlFor="isActiveCoating" className="text-sm font-medium text-gray-700">
                  Active (visible to customers)
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        name: '',
                        price: 0,
                        description: '',
                        isActive: true
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
                      <span>{editingId ? 'Update' : 'Add'} Coating Option</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Existing Options List */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Existing Coating Options</h4>
            <div className="space-y-3">
              {coatingOptions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No coating options yet</p>
              ) : (
                coatingOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-4 ${
                      option.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-gray-900">{option.name}</h5>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            option.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {option.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                        <p className="text-lg font-semibold text-gray-900">+${option.price.toFixed(2)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(option)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(option.id)}
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

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 font-light"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}