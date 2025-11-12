import { Service } from '../../hooks/useServices';
import { FormattedService } from './types';
import { DEFAULT_SERVICE_IMAGE, CALENDLY_CONFIG } from './constants';
import { formatCurrency } from '../../lib/currency';

/**
 * Validates if a service object has all required fields
 */
function isValidService(service: any): boolean {
  return (
    service &&
    typeof service._id === 'string' &&
    typeof service.serviceName === 'string' &&
    typeof service.duration === 'number' &&
    typeof service.price === 'number'
  );
}

/**
 * Formats raw service data from API for UI display
 */
export function formatServicesForUI(services: Service[]): FormattedService[] {
  if (!services || !Array.isArray(services)) {
    console.warn('formatServicesForUI: Invalid services input:', services);
    return [];
  }
  
  return services
    .filter(isValidService)
    .map((service) => ({
      id: service._id,
      title: service.serviceName,
      duration: `${service.duration} min`,
      price: formatCurrency(service.price),
      description: service.description || '',
      image: service.image || DEFAULT_SERVICE_IMAGE,
      features: [] // API doesn't provide features
    }));
}

/**
 * Loads Calendly scripts dynamically
 */
export function loadCalendlyScript(): () => void {
  const link = document.createElement('link');
  link.href = CALENDLY_CONFIG.cssUrl;
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = CALENDLY_CONFIG.scriptUrl;
  script.async = true;
  document.body.appendChild(script);

  // Return cleanup function
  return () => {
    const existingLink = document.querySelector(`link[href="${CALENDLY_CONFIG.cssUrl}"]`);
    if (existingLink) document.head.removeChild(existingLink);

    const existingScript = document.querySelector(`script[src="${CALENDLY_CONFIG.scriptUrl}"]`);
    if (existingScript) document.body.removeChild(existingScript);
  };
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

