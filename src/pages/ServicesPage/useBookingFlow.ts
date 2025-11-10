import { useState, useCallback } from 'react';
import { StoreLocation } from '../../types';
import { BookingData, BookingStep } from './types';
import { createAppointment } from '../../services/airtable';

const INITIAL_BOOKING_DATA: BookingData = {
  name: '',
  email: '',
  phone: '',
  notes: ''
};

export function useBookingFlow() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<StoreLocation | null>(null);
  const [selectedService, setSelectedService] = useState('');
  const [bookingStep, setBookingStep] = useState<BookingStep>('location');
  const [bookingData, setBookingData] = useState<BookingData>(INITIAL_BOOKING_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openBookingFlow = useCallback((location?: StoreLocation) => {
    if (location) {
      setSelectedLocation(location);
      setBookingStep('service');
    } else {
      setBookingStep('location');
    }
    setShowBookingModal(true);
    setError(null);
  }, []);

  const closeBookingFlow = useCallback(() => {
    setShowBookingModal(false);
    // Reset after animation completes
    setTimeout(() => {
      setSelectedLocation(null);
      setSelectedService('');
      setBookingStep('location');
      setBookingData(INITIAL_BOOKING_DATA);
      setError(null);
    }, 300);
  }, []);

  const handleLocationSelect = useCallback((location: StoreLocation) => {
    setSelectedLocation(location);
    setBookingStep('service');
  }, []);

  const handleServiceSelect = useCallback((serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setBookingStep('calendly');
  }, []);

  const goBackToLocation = useCallback(() => {
    setBookingStep('location');
  }, []);

  const goBackToService = useCallback(() => {
    setBookingStep('service');
  }, []);

  const updateBookingData = useCallback((updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  }, []);

  const openCalendly = useCallback(() => {
    if (!selectedLocation || !window.Calendly) return;
    
    window.Calendly.initPopupWidget({
      url: selectedLocation.calendlyUrl
    });
  }, [selectedLocation]);

  const handleBookingSubmit = useCallback(async () => {
    if (!selectedLocation || !bookingData.name || !bookingData.email) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Open Calendly first
      openCalendly();

      // Save to Airtable
      await createAppointment({
        customerName: bookingData.name,
        customerEmail: bookingData.email,
        customerPhone: bookingData.phone,
        storeLocation: selectedLocation.name,
        serviceType: selectedService,
        appointmentDate: new Date().toISOString().split('T')[0],
        appointmentTime: 'TBD',
        status: 'Scheduled',
        notes: bookingData.notes
      });

      // Close modal after successful submission
      setTimeout(() => {
        closeBookingFlow();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save appointment');
      console.error('Failed to save appointment:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedLocation, bookingData, selectedService, openCalendly, closeBookingFlow]);

  const getStepIndex = useCallback((): number => {
    switch (bookingStep) {
      case 'location':
        return 0;
      case 'service':
        return 1;
      case 'calendly':
        return 2;
      default:
        return 0;
    }
  }, [bookingStep]);

  return {
    // State
    showBookingModal,
    selectedLocation,
    selectedService,
    bookingStep,
    bookingData,
    isSubmitting,
    error,
    
    // Actions
    openBookingFlow,
    closeBookingFlow,
    handleLocationSelect,
    handleServiceSelect,
    goBackToLocation,
    goBackToService,
    updateBookingData,
    handleBookingSubmit,
    getStepIndex
  };
}

