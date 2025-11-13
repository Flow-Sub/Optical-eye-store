import { useState, useCallback, useEffect, useRef } from 'react';
import { StoreLocation } from '../../types';
import { BookingData, BookingStep } from './types';
import { createAppointment } from '../../services/airtable';
import { CalendlyEvent } from '../../types/calendly';

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
  const calendlyEventReceived = useRef(false);
  const appointmentIdRef = useRef<string | null>(null);

  const updateAppointmentWithTime = useCallback(async (appointmentId: string, date: string, time: string, eventUri: string) => {
    try {
      const { updateAppointment } = await import('../../services/airtable');
      await updateAppointment(appointmentId, {
        appointmentDate: date,
        appointmentTime: time,
        calendlyEventUri: eventUri
      });
    } catch (err) {
      console.error('Failed to update appointment with time:', err);
    }
  }, []);

  // Set up Calendly event listener
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      // Calendly sends events via postMessage
      // Check if it's a Calendly event
      if (e.origin !== 'https://calendly.com' && e.origin !== 'https://assets.calendly.com') {
        return;
      }

      // Handle different Calendly event formats
      if (e.data.event) {
        const eventName = e.data.event;
        
        // Listen for scheduled event
        if (eventName === 'calendly.event_scheduled' || eventName === 'calendly.event_type_viewed') {
          try {
            const calendlyEvent = e.data as CalendlyEvent;
            
            if (calendlyEvent.event === 'calendly.event_scheduled' && calendlyEvent.payload?.event) {
              calendlyEventReceived.current = true;
              
              // Extract date and time from the event
              const startTime = new Date(calendlyEvent.payload.event.start_time);
              const endTime = new Date(calendlyEvent.payload.event.end_time);
              
              // Format date as YYYY-MM-DD
              const dateStr = startTime.toISOString().split('T')[0];
              
              // Format time as HH:MM AM/PM
              const timeStr = startTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
              
              const endTimeStr = endTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
              
              // Update booking data with selected time
              setBookingData(prev => ({
                ...prev,
                selectedDate: dateStr,
                selectedTime: `${timeStr} - ${endTimeStr}`,
                calendlyEventUri: calendlyEvent.payload.event.uri
              }));
              
              // If appointment was already created, update it
              if (appointmentIdRef.current) {
                updateAppointmentWithTime(appointmentIdRef.current, dateStr, `${timeStr} - ${endTimeStr}`, calendlyEvent.payload.event.uri);
              }
            }
          } catch (err) {
            console.error('Error processing Calendly event:', err);
          }
        }
      }
    };

    window.addEventListener('message', handleCalendlyEvent);
    
    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
    };
  }, [updateAppointmentWithTime]);

  const openBookingFlow = useCallback((location?: StoreLocation) => {
    if (location) {
      setSelectedLocation(location);
      setBookingStep('service');
    } else {
      setBookingStep('location');
    }
    setShowBookingModal(true);
    setError(null);
    calendlyEventReceived.current = false;
    appointmentIdRef.current = null;
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
      calendlyEventReceived.current = false;
      appointmentIdRef.current = null;
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

    // If time is already selected, save to Airtable
    if (bookingData.selectedDate && bookingData.selectedTime) {
      setIsSubmitting(true);
      setError(null);

      try {
        // Save to Airtable with actual selected time
        const appointment = await createAppointment({
          customerName: bookingData.name,
          customerEmail: bookingData.email,
          customerPhone: bookingData.phone,
          storeLocation: selectedLocation.name,
          serviceType: selectedService,
          appointmentDate: bookingData.selectedDate,
          appointmentTime: bookingData.selectedTime,
          calendlyEventUri: bookingData.calendlyEventUri,
          status: 'Scheduled',
          notes: bookingData.notes
        });

        appointmentIdRef.current = appointment.id;

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
    } else {
      // Open Calendly first, then wait for event
      setIsSubmitting(false);
      openCalendly();
      
      // Show message to user
      setError(null);
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

