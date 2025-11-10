import React from 'react';
import { ChevronRight, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { StoreLocation } from '../../../../types';
import { BookingData, FormattedService } from '../../types';

interface CalendlyStepProps {
  bookingData: BookingData;
  selectedLocation: StoreLocation | null;
  selectedService: string;
  services: FormattedService[];
  isSubmitting: boolean;
  error: string | null;
  onBookingDataChange: (updates: Partial<BookingData>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const CalendlyStep: React.FC<CalendlyStepProps> = ({
  bookingData,
  selectedLocation,
  selectedService,
  services,
  isSubmitting,
  error,
  onBookingDataChange,
  onSubmit,
  onBack
}) => {
  const selectedServiceDetails = services.find((s) => s.title === selectedService);
  const isFormValid = bookingData.name && bookingData.email;

  return (
    <div className="animate-fadeIn">
      <button
        onClick={onBack}
        className="text-gray-500 hover:text-gray-900 mb-6 text-sm font-light flex items-center transition-colors"
      >
        <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
        Back to services
      </button>
      <h3 className="text-2xl font-light text-gray-900 mb-8">Your Information</h3>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 mb-8 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">
          Appointment Summary
        </h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-500 font-light mb-1">Location</p>
            <p className="text-gray-900 font-medium">{selectedLocation?.name}</p>
            <p className="text-xs text-gray-600 mt-1">{selectedLocation?.address}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-light mb-1">Service</p>
            <p className="text-gray-900 font-medium">{selectedService}</p>
            <p className="text-xs text-gray-600 mt-1">{selectedServiceDetails?.duration}</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bookingData.name}
              onChange={(e) => onBookingDataChange({ name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light transition-all"
              placeholder="John Doe"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={bookingData.phone}
              onChange={(e) => onBookingDataChange({ phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light transition-all"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={bookingData.email}
            onChange={(e) => onBookingDataChange({ email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light transition-all"
            placeholder="john@example.com"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={bookingData.notes}
            onChange={(e) => onBookingDataChange({ notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light transition-all resize-none"
            placeholder="Any special requirements or concerns..."
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={!isFormValid || isSubmitting}
          className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white py-4 px-6 rounded-xl font-light hover:shadow-xl transform hover:-translate-y-0.5
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 
                   flex items-center justify-center space-x-3"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Calendar className="h-5 w-5" />
              <span>Continue to Schedule</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-500">
          You'll be redirected to Calendly to pick your preferred date and time
        </p>
      </div>
    </div>
  );
};

