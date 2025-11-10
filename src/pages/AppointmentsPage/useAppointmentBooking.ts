import { useState, useCallback } from 'react';
import { StoreLocation } from '../../types';

export type BookingStep = 'location' | 'service' | 'booking';

export interface SelectedService {
  _id: string;
  serviceName: string;
  description: string;
  duration: number;
  price: number;
}

export function useAppointmentBooking() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('location');
  const [selectedLocation, setSelectedLocation] = useState<StoreLocation | null>(null);
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null);

  const handleLocationSelect = useCallback((location: StoreLocation) => {
    setSelectedLocation(location);
    setCurrentStep('service');
  }, []);

  const handleServiceSelect = useCallback((service: SelectedService) => {
    setSelectedService(service);
    setCurrentStep('booking');
  }, []);

  const goBackToLocation = useCallback(() => {
    setCurrentStep('location');
    setSelectedService(null);
  }, []);

  const goBackToService = useCallback(() => {
    setCurrentStep('service');
  }, []);

  const reset = useCallback(() => {
    setCurrentStep('location');
    setSelectedLocation(null);
    setSelectedService(null);
  }, []);

  const getStepIndex = useCallback((): number => {
    switch (currentStep) {
      case 'location':
        return 0;
      case 'service':
        return 1;
      case 'booking':
        return 2;
      default:
        return 0;
    }
  }, [currentStep]);

  return {
    currentStep,
    selectedLocation,
    selectedService,
    handleLocationSelect,
    handleServiceSelect,
    goBackToLocation,
    goBackToService,
    reset,
    getStepIndex
  };
}

