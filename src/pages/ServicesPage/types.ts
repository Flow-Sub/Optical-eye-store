import { StoreLocation } from '../../types';

export type BookingStep = 'location' | 'service' | 'calendly';

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  selectedDate?: string;
  selectedTime?: string;
  calendlyEventUri?: string;
}

export interface FormattedService {
  id: string;
  title: string;
  duration: string;
  price: string;
  description: string;
  image: string;
  features: string[];
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: StoreLocation[];
  services: FormattedService[];
  initialLocation?: StoreLocation | null;
}

export interface ServiceCardProps {
  service: FormattedService;
}

export interface LocationCardProps {
  location: StoreLocation;
  onBookClick: (location: StoreLocation) => void;
}

export interface FAQItemProps {
  question: string;
  answer: string;
}

export interface WhyChooseUsItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

