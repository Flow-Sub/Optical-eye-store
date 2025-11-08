import { useState, useEffect } from 'react';
import { LensOption } from '../types';
import { fetchLensOptions } from '../services/airtable';

export function useLensOptions() {
  const [lensOptions, setLensOptions] = useState<LensOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLensOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLensOptions();
      setLensOptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lens options');
      console.error('Error loading lens options:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLensOptions();
  }, []);

  return { lensOptions, loading, error, refetch: loadLensOptions };
}