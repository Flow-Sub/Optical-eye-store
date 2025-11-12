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
  
  // Fetch general services for display on the page
  const { 
    services: generalServices, 
    loading: generalServicesLoading, 
    error: generalServicesError,
    refetch: refetchGeneralServices 
  } = useServices(true, 'general');
  
  // Fetch product services for booking modal
  const { 
    services: productServices, 
    loading: productServicesLoading, 
    error: productServicesError
  } = useServices(true, 'product');

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

  // Format services for UI - general services for display
  const formattedGeneralServices = formatServicesForUI(generalServices);
  
  // Format services for UI - product services for booking
  const formattedProductServices = formatServicesForUI(productServices);

  // Handle loading states
  if (locationsLoading || generalServicesLoading || productServicesLoading) {
    return <LoadingSpinner message="Loading services and locations..." />;
  }

  // Handle error states
  if (locationsError || generalServicesError || productServicesError) {
    return (
      <ErrorMessage
        message={locationsError || generalServicesError || productServicesError || 'Failed to load data'}
        onRetry={generalServicesError ? refetchGeneralServices : undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28">
      {/* Hero Section */}
      <HeroSection onBookClick={() => openBookingFlow()} />

      {/* Locations Section */}
      <LocationsSection locations={locations} onBookClick={openBookingFlow} />

      {/* Services Section - Display general services */}
      <ServicesSection services={formattedGeneralServices} />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* FAQ Section */}
      <FAQSection onBookClick={() => openBookingFlow()} />

      {/* Booking Modal - Use product services */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={closeBookingFlow}
        locations={locations}
        services={formattedProductServices}
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

