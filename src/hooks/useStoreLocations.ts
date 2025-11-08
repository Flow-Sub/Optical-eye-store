import { useState, useEffect } from 'react';
import { fetchStoreLocations } from '../services/airtable';
import { StoreLocation } from '../types';

export function useStoreLocations() {
  const [locations, setLocations] = useState<StoreLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStoreLocations();
      setLocations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { locations, loading, error, refetch };
}