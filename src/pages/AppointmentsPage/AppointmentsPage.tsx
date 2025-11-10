import { Sparkles, AlertCircle } from 'lucide-react';
import { useStoreLocations } from '../../hooks/useStoreLocations';
import { useServices } from '../../hooks/useServices';
import { useAppointmentBooking } from './useAppointmentBooking';
import { ProgressIndicator } from './components/ProgressIndicator';
import { LocationSelectionStep } from './components/LocationSelectionStep';
import { ServiceSelectionStep } from './components/ServiceSelectionStep';
import { BookingStep } from './components/BookingStep';

export function AppointmentsPage() {
  // Fetch data
  const { locations, loading: locationsLoading, error: locationsError } = useStoreLocations();
  const { services, loading: servicesLoading, error: servicesError } = useServices(true);

  // Booking flow
  const {
    currentStep,
    selectedLocation,
    selectedService,
    handleLocationSelect,
    handleServiceSelect,
    goBackToLocation,
    goBackToService,
    getStepIndex
  } = useAppointmentBooking();

  // Loading state
  if (locationsLoading || servicesLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading appointment options...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (locationsError || servicesError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Appointments
          </h3>
          <p className="text-gray-600 font-light mb-6">
            {locationsError || servicesError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-light hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28">
      {/* HERO */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center space-x-2 text-xs uppercase tracking-wider text-gray-500 mb-6 bg-white px-4 py-2 rounded-full shadow-sm">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>Book Online</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
              Schedule Your <br />
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Eye Care Appointment
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Experience professional eye care with our team of expert optometrists.
              Select your location, choose a service, and book your preferred time.
            </p>
          </div>
        </div>
      </section>

      {/* BOOKING FLOW */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <ProgressIndicator currentStep={getStepIndex()} />

          {/* Step Content */}
          <div className="mt-12">
            {currentStep === 'location' && (
              <LocationSelectionStep
                locations={locations}
                onSelectLocation={handleLocationSelect}
              />
            )}

            {currentStep === 'service' && selectedLocation && (
              <ServiceSelectionStep
                services={services}
                selectedLocation={selectedLocation}
                onSelectService={handleServiceSelect}
                onBack={goBackToLocation}
              />
            )}

            {currentStep === 'booking' && selectedLocation && selectedService && (
              <BookingStep
                selectedLocation={selectedLocation}
                selectedService={selectedService}
                onBack={goBackToService}
              />
            )}
          </div>
        </div>
      </section>

      {/* INFO SECTION (shown only on initial step) */}
      {currentStep === 'location' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                What to Expect
              </h2>
              <p className="text-gray-600 font-light">
                We're here to provide you with exceptional eye care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Arrive Early',
                  description: 'Please arrive 15 minutes before your appointment for check-in and paperwork.'
                },
                {
                  step: '2',
                  title: 'Comprehensive Exam',
                  description: 'Receive a thorough examination using state-of-the-art diagnostic equipment.'
                },
                {
                  step: '3',
                  title: 'Personalized Care',
                  description: 'Discuss your results and receive tailored recommendations for your eye health.'
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 font-light text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Add animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

