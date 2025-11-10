import React from 'react';
import { BookingModalProps, BookingData } from '../../types';
import { ProgressSteps } from './ProgressSteps';
import { LocationStep } from './LocationStep';
import { ServiceStep } from './ServiceStep';
import { CalendlyStep } from './CalendlyStep';
import { StoreLocation } from '../../../../types';

interface BookingModalPropsExtended extends BookingModalProps {
  bookingStep: 'location' | 'service' | 'calendly';
  selectedLocation: StoreLocation | null;
  selectedService: string;
  bookingData: BookingData;
  isSubmitting: boolean;
  error: string | null;
  onLocationSelect: (location: StoreLocation) => void;
  onServiceSelect: (serviceTitle: string) => void;
  onBackToLocation: () => void;
  onBackToService: () => void;
  onBookingDataChange: (updates: Partial<BookingData>) => void;
  onSubmit: () => void;
  getStepIndex: () => number;
}

export const BookingModal: React.FC<BookingModalPropsExtended> = ({
  isOpen,
  onClose,
  locations,
  services,
  bookingStep,
  selectedLocation,
  selectedService,
  bookingData,
  isSubmitting,
  error,
  onLocationSelect,
  onServiceSelect,
  onBackToLocation,
  onBackToService,
  onBookingDataChange,
  onSubmit,
  getStepIndex
}) => {
  if (!isOpen) return null;

  const steps = ['Location', 'Service', 'Schedule'];
  const currentStepIndex = getStepIndex();

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h2 id="booking-modal-title" className="text-2xl font-light">
                Book Your Appointment
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Close booking modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Progress Steps */}
            <ProgressSteps currentStep={currentStepIndex} steps={steps} />
          </div>
        </div>

        <div className="p-8">
          {/* Location Step */}
          {bookingStep === 'location' && (
            <LocationStep
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationSelect={onLocationSelect}
            />
          )}

          {/* Service Step */}
          {bookingStep === 'service' && (
            <ServiceStep
              services={services}
              selectedService={selectedService}
              selectedLocation={selectedLocation}
              onServiceSelect={onServiceSelect}
              onBack={onBackToLocation}
            />
          )}

          {/* Calendly Step */}
          {bookingStep === 'calendly' && (
            <CalendlyStep
              bookingData={bookingData}
              selectedLocation={selectedLocation}
              selectedService={selectedService}
              services={services}
              isSubmitting={isSubmitting}
              error={error}
              onBookingDataChange={onBookingDataChange}
              onSubmit={onSubmit}
              onBack={onBackToService}
            />
          )}
        </div>
      </div>
    </div>
  );
};

