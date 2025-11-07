import React, { useState } from 'react';
import { Plus, Edit2, Trash2, User, Power, Sparkles, Search, Users } from 'lucide-react';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { CreateTeamMemberModal } from './CreateTeamMemberModal';

export function TeamManagementView() {
  const { teamMembers, loading, error, refetch } = useTeamMembers();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMember, setEditingMember] = useState<any>(null);
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/teamMemberRoutes/deleteTeamMember?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        refetch();
      }
    } catch (error) {
      alert('Failed to delete team member');
    }
  };

  const handleStatusToggle = async (member: any) => {
    try {
      const formData = new FormData();
      formData.append('status', member.status === 'active' ? 'inactive' : 'active');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/teamMemberRoutes/updateTeamMember?id=${member._id}`, {
        method: 'PUT',
        body: formData,
      });
      
      if (response.ok) {
        refetch();
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.specialization && member.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading team members...</p>
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
            <h2 className="text-3xl font-bold mb-2">Team Members</h2>
            <p className="text-gray-400 font-light">Manage your team on About page</p>
          </div>
          <Users className="h-10 w-10 opacity-20" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-semibold">{teamMembers.length}</div>
            <div className="text-xs text-gray-400 font-light mt-1">Total Members</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-semibold">
              {teamMembers.filter(m => m.status === 'active').length}
            </div>
            <div className="text-xs text-gray-400 font-light mt-1">Active</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-semibold">
              {teamMembers.filter(m => m.status === 'inactive').length}
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
                placeholder="Search team members..."
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
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="h-48 bg-gray-100 relative">
              {member.image ? (
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-300" />
                </div>
              )}
              <button
                onClick={() => handleStatusToggle(member)}
                className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur transition-colors ${
                  member.status === 'active' 
                    ? 'bg-green-100/80 text-green-600 hover:bg-green-200/80' 
                    : 'bg-gray-100/80 text-gray-400 hover:bg-gray-200/80'
                }`}
                title={member.status === 'active' ? 'Deactivate' : 'Activate'}
              >
                <Power className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{member.designation}</p>
              
              {member.experience && (
                <p className="text-xs text-gray-500 mb-3">{member.experience} experience</p>
              )}

              {member.specialization && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Specialization:</p>
                  <p className="text-sm text-gray-700 font-light">{member.specialization}</p>
                </div>
              )}

              {member.about && (
                <p className="text-sm text-gray-600 font-light mb-4 line-clamp-2">{member.about}</p>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingMember(member)}
                  className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-light"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
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

      {/* Modal */}
      <CreateTeamMemberModal
        isOpen={isCreateModalOpen || !!editingMember}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingMember(null);
        }}
        onSuccess={refetch}
        editingMember={editingMember}
      />
    </div>
  );
}