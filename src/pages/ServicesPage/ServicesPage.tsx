import { useEffect } from 'react';
import { useStoreLocations } from '../../hooks/useStoreLocations';
import { useServices } from '../../hooks/useServices';
import { useBookingFlow } from './useBookingFlow';
import { formatServicesForUI, loadCalendlyScript } from './utils';
import {
  HeroSection,
  LocationsSection,
  ServicesSection,
  WhyChooseUsSection,
  FAQSection,
  BookingModal,
  LoadingSpinner,
  ErrorMessage
} from './components';

export function ServicesPage() {
  // Fetch data
  const { locations, loading: locationsLoading, error: locationsError } = useStoreLocations();
  const { 
    services: dynamicServices, 
    loading: servicesLoading, 
    error: servicesError,
    refetch: refetchServices 
  } = useServices(true);

  // Booking flow management
  const {
    showBookingModal,
    selectedLocation,
    selectedService,
    bookingStep,
    bookingData,
    isSubmitting,
    error: bookingError,
    openBookingFlow,
    closeBookingFlow,
    handleLocationSelect,
    handleServiceSelect,
    goBackToLocation,
    goBackToService,
    updateBookingData,
    handleBookingSubmit,
    getStepIndex
  } = useBookingFlow();

  // Load Calendly scripts on mount
  useEffect(() => {
    const cleanup = loadCalendlyScript();
    return cleanup;
  }, []);

  // Format services for UI
  const formattedServices = formatServicesForUI(dynamicServices);

  // Handle loading states
  if (locationsLoading || servicesLoading) {
    return <LoadingSpinner message="Loading services and locations..." />;
  }

  // Handle error states
  if (locationsError || servicesError) {
    return (
      <ErrorMessage
        message={locationsError || servicesError || 'Failed to load data'}
        onRetry={servicesError ? refetchServices : undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28">
      {/* Hero Section */}
      <HeroSection onBookClick={() => openBookingFlow()} />

      {/* Locations Section */}
      <LocationsSection locations={locations} onBookClick={openBookingFlow} />

      {/* Services Section */}
      <ServicesSection services={formattedServices} />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* FAQ Section */}
      <FAQSection onBookClick={() => openBookingFlow()} />

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={closeBookingFlow}
        locations={locations}
        services={formattedServices}
        bookingStep={bookingStep}
        selectedLocation={selectedLocation}
        selectedService={selectedService}
        bookingData={bookingData}
        isSubmitting={isSubmitting}
        error={bookingError}
        onLocationSelect={handleLocationSelect}
        onServiceSelect={handleServiceSelect}
        onBackToLocation={goBackToLocation}
        onBackToService={goBackToService}
        onBookingDataChange={updateBookingData}
        onSubmit={handleBookingSubmit}
        getStepIndex={getStepIndex}
      />

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

