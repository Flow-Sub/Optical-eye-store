import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Package, Edit2, Save, X, Sparkles, Camera, Shield, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { updateUserProfile } from '../services/airtable';

export function MyProfilePage() {
  const { user } = useAuth();
  const { profile, loading, error, refetch } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateUserProfile(profile.id, formData);
      await refetch();
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-900 mb-2">Error Loading Profile</h3>
          <p className="text-red-700 font-light">{error || 'Profile not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl p-8 text-white mb-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-gray-400 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Account</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-gray-400 font-light">Manage your personal information and preferences</p>
            </div>
            <User className="h-10 w-10 opacity-20" />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
              <Package className="h-5 w-5 mb-2 opacity-60" />
              <div className="text-2xl font-semibold">{profile.orderCount || 0}</div>
              <div className="text-xs text-gray-400 font-light mt-1">Orders</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
              <Award className="h-5 w-5 mb-2 opacity-60" />
              <div className="text-2xl font-semibold">Gold</div>
              <div className="text-xs text-gray-400 font-light mt-1">Member Status</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
              <Calendar className="h-5 w-5 mb-2 opacity-60" />
              <div className="text-2xl font-semibold">
                {new Date(profile.accountCreated).getFullYear()}
              </div>
              <div className="text-xs text-gray-400 font-light mt-1">Member Since</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
              <Shield className="h-5 w-5 mb-2 opacity-60" />
              <div className="text-2xl font-semibold">Verified</div>
              <div className="text-xs text-gray-400 font-light mt-1">Account Status</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Personal Information */}
          <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-light"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-light"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors font-light"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium mb-2 block">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                  />
                ) : (
                  <p className="text-gray-900 font-light">{profile.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium mb-2 block">Email Address</label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900 font-light">{profile.email}</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium mb-2 block">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="Add phone number"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900 font-light">
                      {profile.phoneNumber || 'Not provided'}
                    </p>
                  </div>
                )}
              </div>

              {/* Member Since */}
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium mb-2 block">Member Since</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900 font-light">
                    {new Date(profile.accountCreated).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Photo & Quick Actions */}
          <div className="space-y-6">
            {/* Profile Photo */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  {profile.profilePhoto ? (
                    <img src={profile.profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-light">
                  <Camera className="h-4 w-4" />
                  <span>Change Photo</span>
                </button>
              </div>
            </div>

            {/* Account Type */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Type</h3>
              <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                profile.isAdmin 
                  ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                  : 'bg-gray-100 text-gray-800 border border-gray-300'
              }`}>
                <Shield className="h-3.5 w-3.5" />
                <span>{profile.isAdmin ? 'Administrator' : 'Customer'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}