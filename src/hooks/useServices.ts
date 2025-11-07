import { useState, useEffect } from 'react';

export interface Service {
  _id: string;
  serviceName: string;
  description: string;
  duration: number;
  price: number;
  status: 'active' | 'inactive';
  image?: string;
}

export function useServices(activeOnly = false) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/serviceRoutes/getServices`);
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      
      const filteredServices = activeOnly 
        ? data.data.filter((s: Service) => s.status === 'active')
        : data.data;
      
      setServices(filteredServices);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [activeOnly]);

  return { services, loading, error, refetch: fetchServices };
}