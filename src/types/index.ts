export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'frames' | 'sunglasses' | 'accessories';
  price: number;
  description: string;
  images: string[];
  stock: number;
  isActive: boolean;
  features: string[];
  lensCompatible: boolean;
  allowedLensOptions?: string[];
  allowedCoatingOptions?: string[]; 
}

export interface LensOption {
  id: string;
  type: 'single-vision' | 'bifocal' | 'progressive';
  name: string;
  price: number;
  description: string;
}

export interface LensCoating {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  lensOption?: LensOption;
  coatings: LensCoating[];
  prescriptionData?: PrescriptionData;
}

export interface PrescriptionData {
  rightEye: {
    sphere: string;
    cylinder: string;
    axis: string;
  };
  leftEye: {
    sphere: string;
    cylinder: string;
    axis: string;
  };
  pd: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Appointment {
  id: string;
  userId: string;
  type: 'eye-exam' | 'frame-selection' | 'contact-fitting';
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface LensOption {
  id: string;
  name: string;
  type: 'single-vision' | 'bifocal' | 'progressive';
  price: number;
  description: string;
  isActive: boolean;
}

export interface LensCoating {
  id: string;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  calendlyUrl: string;
  isActive: boolean;
  createdBy?: string; // Maps to Collaborator field (email or name)
}