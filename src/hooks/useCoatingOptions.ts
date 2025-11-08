import { useState, useEffect } from 'react';
import { LensCoating } from '../types';
import { fetchCoatingOptions } from '../services/airtable';

export function useCoatingOptions() {
  const [coatingOptions, setCoatingOptions] = useState<LensCoating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCoatingOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCoatingOptions();
      setCoatingOptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load coating options');
      console.error('Error loading coating options:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoatingOptions();
  }, []);

  return { coatingOptions, loading, error, refetch: loadCoatingOptions };
}