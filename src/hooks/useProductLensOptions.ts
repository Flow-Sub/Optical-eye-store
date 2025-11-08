import { useState, useEffect } from 'react';
import { LensOption, LensCoating } from '../types';
import { fetchLensOptions, fetchCoatingOptions } from '../services/airtable';

export function useProductLensOptions(allowedLensIds?: string[], allowedCoatingIds?: string[]) {
  const [lensOptions, setLensOptions] = useState<LensOption[]>([]);
  const [coatingOptions, setCoatingOptions] = useState<LensCoating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      setLoading(true);
      try {
        // Fetch all options
        const allLensOptions = await fetchLensOptions();
        const allCoatingOptions = await fetchCoatingOptions();
        
        // Filter based on allowed IDs
        if (allowedLensIds && allowedLensIds.length > 0) {
          const filtered = allLensOptions.filter(option => 
            allowedLensIds.includes(option.id)
          );
          setLensOptions(filtered);
        } else {
          // If no specific options linked, show all (or none)
          setLensOptions(allLensOptions);
        }
        
        if (allowedCoatingIds && allowedCoatingIds.length > 0) {
          const filtered = allCoatingOptions.filter(option => 
            allowedCoatingIds.includes(option.id)
          );
          setCoatingOptions(filtered);
        } else {
          setCoatingOptions(allCoatingOptions);
        }
      } catch (error) {
        console.error('Error loading product lens options:', error);
        // Fallback to empty arrays
        setLensOptions([]);
        setCoatingOptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [allowedLensIds?.join(','), allowedCoatingIds?.join(',')]);

  return { lensOptions, coatingOptions, loading };
}