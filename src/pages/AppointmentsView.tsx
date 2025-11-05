import React, { useState } from 'react';
import { Calendar, MapPin, Phone, Mail, Clock, CheckCircle, XCircle, AlertCircle, Filter, Search, Download, Send, Sparkles } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { updateAppointmentStatus } from '../services/airtable';
import { sendAppointmentEmail } from '../services/email';

export function AppointmentsView() {
  const { appointments, loading, error, refetch } = useAppointments();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  

  const handleStatusChange = async (id: string, status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show') => {
    try {
        await updateAppointmentStatus(id, status);
        refetch();
    } catch (error) {
        alert('Failed to update status');
    }
  };

  const handleSendEmail = async (apt: any) => {
    setSendingEmail(apt.id);
    
    const storePhones: Record<string, string> = {
        'Manhattan Flagship Store': '(212) 555-0101',
        'Brooklyn Heights': '(718) 555-0202',
        'Queens Center': '(718) 555-0303',
        'Bronx Plaza': '(718) 555-0404'
    };

    const emailData = {
        customer_name: apt.customerName,
        customer_email: apt.customerEmail,
        customer_phone: apt.customerPhone || 'Not provided',
        store_location: apt.storeLocation,
        store_phone: storePhones[apt.storeLocation] || '(555) 123-4567',
        service_type: apt.serviceType,
        appointment_date: apt.appointmentDate,
        appointment_time: apt.appointmentTime,
        notes: apt.notes || 'No additional notes'
    };

    const success = await sendAppointmentEmail(emailData);
    
    setSendingEmail(null);
    
    if (success) {
        alert(`✅ Confirmation email sent successfully to ${apt.customerEmail}`);
    } else {
        alert('❌ Failed to send email. Please check console for errors.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'No-show': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Scheduled': return <Clock className="h-3.5 w-3.5" />;
      case 'Completed': return <CheckCircle className="h-3.5 w-3.5" />;
      case 'Cancelled': return <XCircle className="h-3.5 w-3.5" />;
      case 'No-show': return <AlertCircle className="h-3.5 w-3.5" />;
      default: return <Clock className="h-3.5 w-3.5" />;
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesSearch = 
      apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.storeLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'Scheduled').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-800 font-medium">{error}</p>
        <button onClick={refetch} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-light">
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
            <h2 className="text-3xl font-bold mb-2">Appointments</h2>
            <p className="text-gray-400 font-light">Track and manage all customer appointments</p>
          </div>
          <Calendar className="h-10 w-10 opacity-20" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-semibold">{stats.total}</div>
            <div className="text-xs text-gray-400 font-light mt-1">Total</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-semibold">{stats.scheduled}</div>
            <div className="text-xs text-gray-400 font-light mt-1">Scheduled</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-semibold">{stats.completed}</div>
            <div className="text-xs text-gray-400 font-light mt-1">Completed</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-semibold">{stats.cancelled}</div>
            <div className="text-xs text-gray-400 font-light mt-1">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No-show">No-show</option>
            </select>

            <button className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-light">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 font-light">
          Showing {filteredAppointments.length} of {appointments.length} appointments
        </div>
      </div>

      {/* Appointments Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar className="h-14 w-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600 font-light">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters'
              : 'No appointments have been scheduled yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAppointments.map((apt) => (
            <div 
              key={apt.id} 
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{apt.customerName}</h3>
                    <div className="flex items-center text-sm text-gray-600 font-light mt-1">
                      <Mail className="h-3.5 w-3.5 mr-1.5" />
                      {apt.customerEmail}
                    </div>
                    {apt.customerPhone && (
                      <div className="flex items-center text-sm text-gray-600 font-light mt-1">
                        <Phone className="h-3.5 w-3.5 mr-1.5" />
                        {apt.customerPhone}
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${getStatusColor(apt.status)}`}>
                    {getStatusIcon(apt.status)}
                    <span>{apt.status}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-medium mb-1">Location</div>
                    <div className="flex items-center text-sm text-gray-900 font-light">
                      <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                      {apt.storeLocation}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-medium mb-1">Service</div>
                    <div className="text-sm text-gray-900 font-light">{apt.serviceType}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-medium mb-1">Date</div>
                    <div className="flex items-center text-sm text-gray-900 font-light">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                      {apt.appointmentDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-medium mb-1">Time</div>
                    <div className="flex items-center text-sm text-gray-900 font-light">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                      {apt.appointmentTime}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {apt.notes && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-medium mb-1">Notes</div>
                    <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 font-light">
                      {apt.notes}
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 uppercase font-medium mb-3">Update Status</div>
                  <div className="grid grid-cols-4 gap-2">
                    {['Scheduled', 'Completed', 'Cancelled', 'No-show'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(apt.id, status as any)}
                        disabled={apt.status === status}
                        className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          apt.status === status
                            ? `${getStatusColor(status)} cursor-default`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Send Email Button */}
                <button
                  onClick={() => handleSendEmail(apt)}
                  disabled={sendingEmail === apt.id}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-light"
                >
                  {sendingEmail === apt.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Confirmation Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}