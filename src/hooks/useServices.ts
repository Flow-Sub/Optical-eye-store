import { useState, useEffect } from 'react';

export interface Service {
  _id: string;
  serviceName: string;
  description: string;
  duration: number;
  price: number;
  status: 'active' | 'inactive';
  serviceTag?: 'general' | 'product';
  image?: string;
}

export function useServices(activeOnly = false, serviceTag?: 'general' | 'product') {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/serviceRoutes/getServices`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Safely access data.data with fallback
      let filteredServices = data?.data || [];
      
      // Ensure it's an array
      if (!Array.isArray(filteredServices)) {
        console.warn('Services data is not an array:', filteredServices);
        filteredServices = [];
      }
      
      if (activeOnly) {
        filteredServices = filteredServices.filter((s: Service) => s?.status === 'active');
      }
      
      if (serviceTag) {
        filteredServices = filteredServices.filter((s: Service) => s?.serviceTag === serviceTag);
      }
      
      setServices(filteredServices);
      setError(null);
    } catch (err) {
      console.error('Error fetching services:', err);
      setServices([]); // Set empty array on error
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [activeOnly, serviceTag]);

  return { services, loading, error, refetch: fetchServices };
}