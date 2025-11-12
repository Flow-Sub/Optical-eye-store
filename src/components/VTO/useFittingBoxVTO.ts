import { useState, useEffect, useRef, useCallback } from 'react';
import { VTO_CONFIG } from './config';
import type { FitMixInstance, FitMixIssue } from './types';

interface UseFittingBoxVTOProps {
  eanCode: string;
  apiKey: string;
  isOpen: boolean;
}

interface UseFittingBoxVTOReturn {
  isLoading: boolean;
  error: string | null;
  isWidgetReady: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  startVTO: () => void;
  stopVTO: () => void;
}

/**
 * Custom hook to manage FittingBox VTO widget lifecycle
 * Handles script loading, widget initialization, and cleanup
 */
export function useFittingBoxVTO({
  eanCode,
  apiKey,
  isOpen,
}: UseFittingBoxVTOProps): UseFittingBoxVTOReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fitmixInstanceRef = useRef<FitMixInstance | null>(null);

  // Load FitMix script dynamically
  useEffect(() => {
    if (!isOpen) return;

    const existingScript = document.querySelector(`script[src="${VTO_CONFIG.SCRIPT_URL}"]`);

    if (existingScript) {
      console.log('[VTO] Script already loaded');
      setIsScriptLoaded(true);
      return;
    }

    console.log('[VTO] Loading script...');
    const script = document.createElement('script');
    script.src = VTO_CONFIG.SCRIPT_URL;
    script.type = 'text/javascript';
    script.id = VTO_CONFIG.SCRIPT_ID;
    
    script.onload = () => {
      console.log('[VTO] Script loaded successfully');
      setTimeout(() => {
        setIsScriptLoaded(true);
      }, 100);
    };
    
    script.onerror = (e) => {
      console.error('[VTO] Script load error:', e);
      setError(VTO_CONFIG.ERRORS.SCRIPT_LOAD_FAILED);
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (fitmixInstanceRef.current?.stopVto) {
        try {
          fitmixInstanceRef.current.stopVto();
        } catch (e) {
          console.error('[VTO] Cleanup error:', e);
        }
      }
    };
  }, [isOpen]);

  // Initialize FitMix widget
  useEffect(() => {
    if (!isScriptLoaded || !isOpen || !containerRef.current) return;

    setIsLoading(true);
    setError(null);

    let retryCount = 0;

    const initWidget = () => {
      try {
        console.log(`[VTO] Init attempt ${retryCount + 1}/${VTO_CONFIG.MAX_RETRIES}`);
        
        if (!window.FitMix) {
          if (retryCount < VTO_CONFIG.MAX_RETRIES) {
            retryCount++;
            setTimeout(initWidget, VTO_CONFIG.RETRY_DELAY);
            return;
          }
          throw new Error(VTO_CONFIG.ERRORS.SDK_NOT_LOADED);
        }

        console.log('[VTO] SDK detected, creating widget...');

        const params = {
          apiKey,
          frame: eanCode,
          onStopVto: () => {
            console.log('[VTO] Stopped');
            setIsLoading(false);
          },
          onIssue: (data: FitMixIssue) => {
            console.error('[VTO] Issue:', data);
            
            if (data.type === 'FRAME_NOT_FOUND' || data.message?.includes('not found')) {
              setError(VTO_CONFIG.ERRORS.FRAME_NOT_FOUND);
            } else {
              setError(VTO_CONFIG.ERRORS.GENERIC);
            }
            setIsLoading(false);
          },
        };

        const instance = window.FitMix.createWidget(
          VTO_CONFIG.CONTAINER_ID,
          params,
          () => {
            console.log('[VTO] Widget ready');
            setIsWidgetReady(true);
            setIsLoading(false);
            
            // Auto-start VTO
            setTimeout(() => {
              if (fitmixInstanceRef.current?.startVto) {
                console.log('[VTO] Auto-starting...');
                fitmixInstanceRef.current.startVto(VTO_CONFIG.DEFAULT_MODE);
              }
            }, VTO_CONFIG.AUTO_START_DELAY);
          }
        );

        fitmixInstanceRef.current = instance;
        window.fitmixInstance = instance;
        console.log('[VTO] Widget created');

      } catch (err: any) {
        console.error('[VTO] Init error:', err);
        setError(err.message || VTO_CONFIG.ERRORS.INIT_FAILED);
        setIsLoading(false);
      }
    };

    const timer = setTimeout(initWidget, VTO_CONFIG.INIT_DELAY);
    return () => clearTimeout(timer);
  }, [isScriptLoaded, isOpen, eanCode, apiKey]);

  // Manual start VTO
  const startVTO = useCallback(() => {
    if (fitmixInstanceRef.current?.startVto) {
      console.log('[VTO] Manual start');
      fitmixInstanceRef.current.startVto(VTO_CONFIG.DEFAULT_MODE);
    }
  }, []);

  // Manual stop VTO
  const stopVTO = useCallback(() => {
    if (fitmixInstanceRef.current?.stopVto) {
      console.log('[VTO] Manual stop');
      fitmixInstanceRef.current.stopVto();
      setIsWidgetReady(false);
    }
  }, []);

  return {
    isLoading,
    error,
    isWidgetReady,
    containerRef,
    startVTO,
    stopVTO,
  };
}

