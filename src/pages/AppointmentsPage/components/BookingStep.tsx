import React, { useEffect } from 'react';
import { ChevronLeft, MapPin, Clock, CheckCircle, Calendar, Phone } from 'lucide-react';
import { StoreLocation } from '../../../types';
import { SelectedService } from '../useAppointmentBooking';
import { formatCurrency } from '../../../lib/currency';

interface BookingStepProps {
  selectedLocation: StoreLocation;
  selectedService: SelectedService;
  onBack: () => void;
}

export const BookingStep: React.FC<BookingStepProps> = ({
  selectedLocation,
  selectedService,
  onBack
}) => {
  // Load Calendly script
  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    );
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup if needed (optional, as script can be reused)
    };
  }, []);

  return (
    <div className="animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="text-gray-600 hover:text-gray-900 mb-6 font-light flex items-center transition-colors"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Change Service
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Schedule Your Appointment
        </h2>
        <p className="text-gray-600 font-light">
          Select your preferred date and time below
        </p>
      </div>

      {/* Booking Summary */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 mb-8 max-w-4xl mx-auto">
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-4">
          Appointment Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-light mb-1">Location</p>
              <p className="font-semibold text-gray-900">{selectedLocation.name}</p>
              <p className="text-sm text-gray-600 mt-1">{selectedLocation.address}</p>
              <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                <Phone className="h-3 w-3" />
                <span>{selectedLocation.phone}</span>
              </div>
            </div>
          </div>

          {/* Service */}
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-light mb-1">Service</p>
              <p className="font-semibold text-gray-900">{selectedService.serviceName}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{selectedService.duration} min</span>
                </div>
                <div className="font-medium text-gray-900">
                  {selectedService.price === 0 ? 'Free' : formatCurrency(selectedService.price)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendly Widget */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Calendar className="h-6 w-6 text-gray-700" />
          <h3 className="text-xl font-semibold text-gray-900">Pick Your Time</h3>
        </div>

        <div
          className="calendly-inline-widget rounded-lg overflow-hidden"
          data-url={`${selectedLocation.calendlyUrl}?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=111827`}
          style={{ minWidth: '320px', height: '700px' }}
        />

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600 font-light">
            Need assistance? Call us at{' '}
            <a
              href={`tel:${selectedLocation.phone.replace(/\D/g, '')}`}
              className="text-gray-900 font-medium hover:text-gray-700 transition-colors"
            >
              {selectedLocation.phone}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

