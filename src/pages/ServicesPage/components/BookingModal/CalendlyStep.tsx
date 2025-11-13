import React from 'react';
import { ChevronRight, Calendar, ArrowRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';
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
  const hasSelectedTime = bookingData.selectedDate && bookingData.selectedTime;

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
        
        {/* Selected Time Slot Display */}
        {hasSelectedTime && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start space-x-3 bg-green-50 border border-green-200 rounded-xl p-4">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-green-700 font-medium mb-1 uppercase tracking-wider">
                  Selected Time Slot
                </p>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-semibold text-gray-900">
                    {bookingData.selectedDate && new Date(bookingData.selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-semibold text-gray-900">{bookingData.selectedTime}</p>
                </div>
              </div>
            </div>
          </div>
        )}
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

        {!hasSelectedTime ? (
          <>
            <button
              onClick={onSubmit}
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white py-4 px-6 rounded-xl font-light hover:shadow-xl transform hover:-translate-y-0.5
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 
                       flex items-center justify-center space-x-3"
              aria-busy={isSubmitting}
            >
              <Calendar className="h-5 w-5" />
              <span>Open Calendar to Select Time</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-center text-xs text-gray-500">
              Click the button above to open Calendly and select your preferred date and time
            </p>
          </>
        ) : (
          <>
            <button
              onClick={onSubmit}
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-light hover:shadow-xl transform hover:-translate-y-0.5
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 
                       flex items-center justify-center space-x-3"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Confirming Appointment...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Confirm & Book Appointment</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500">
              Review your selected time above and click to confirm your appointment
            </p>
          </>
        )}
      </div>
    </div>
  );
};

