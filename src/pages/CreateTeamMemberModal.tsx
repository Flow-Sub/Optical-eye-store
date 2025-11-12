import React, { useState, useEffect } from 'react';
import { X, Upload, User, Briefcase, Award, FileText, Save, Sparkles } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface CreateTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingMember?: any;
}

export function CreateTeamMemberModal({ isOpen, onClose, onSuccess, editingMember }: CreateTeamMemberModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    specialization: '',
    experience: '',
    about: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name || '',
        designation: editingMember.designation || '',
        specialization: editingMember.specialization || '',
        experience: editingMember.experience || '',
        about: editingMember.about || '',
        status: editingMember.status || 'active',
      });
      setImagePreview(editingMember.image || null);
      setUploadedImageUrl(editingMember.image || null);
    } else {
      resetForm();
    }
  }, [editingMember, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      designation: '',
      specialization: '',
      experience: '',
      about: '',
      status: 'active',
    });
    setImagePreview(null);
    setUploadedImageUrl(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/digitalOceanRoutes/uploadImage`, {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success && result.data?.url) {
        setUploadedImageUrl(result.data.url);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image: ' + (result.message || 'Unknown error'));
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.warning('Please enter a name');
      return;
    }
    if (!formData.designation.trim()) {
      toast.warning('Please enter a designation');
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        name: formData.name,
        designation: formData.designation,
        specialization: formData.specialization,
        experience: formData.experience,
        about: formData.about,
        status: formData.status,
        image: uploadedImageUrl || '', // Include uploaded image URL if available
    };

    const url = editingMember
    ? `${import.meta.env.VITE_API_BASE_URL}/teamMemberRoutes/updateTeamMember?id=${editingMember._id}`
    : `${import.meta.env.VITE_API_BASE_URL}/teamMemberRoutes/createTeamMember`;

    const method = editingMember ? 'PUT' : 'POST';

    const response = await fetch(url, {
    method,
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    });

      const result = await response.json();

      if (result.success) {
        onSuccess();
        onClose();
        resetForm();
        toast.success(editingMember ? 'Team member updated!' : 'Team member added!');
      } else {
        toast.error(result.message || 'Failed to save team member');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('Failed to save team member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-black text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-gray-400 mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{editingMember ? 'Edit' : 'Add'} Team Member</span>
              </div>
              <h2 className="text-2xl font-bold">
                {editingMember ? 'Update Team Member' : 'Add New Team Member'}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Sarah Johnson"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-light"
                required
              />
            </div>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="Lead Optometrist"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-light"
                required
              />
            </div>
          </div>

          {/* Experience & Specialization Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="15+ years"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-light"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Eye Surgery"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-light"
              />
            </div>
          </div>

          {/* About */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About
            </label>
            <textarea
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              placeholder="Brief bio..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-light resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' })}
                  className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-sm font-light text-gray-700">Active</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'inactive' })}
                  className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-sm font-light text-gray-700">Inactive</span>
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="flex items-center justify-center w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Upload className="h-4 w-4" />
                    <span className="font-light text-sm">
                      {uploadingImage ? 'Uploading...' : 'Choose photo'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
              {imagePreview && (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setUploadedImageUrl(null);
                    }}
                    disabled={uploadingImage}
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
            {uploadingImage && (
              <p className="mt-2 text-xs text-blue-600 font-light">⏳ Uploading...</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-light transition-colors"
              disabled={loading || uploadingImage}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 flex items-center justify-center space-x-2 font-light transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{editingMember ? 'Updating...' : 'Adding...'}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{editingMember ? 'Update' : 'Add'} Member</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}