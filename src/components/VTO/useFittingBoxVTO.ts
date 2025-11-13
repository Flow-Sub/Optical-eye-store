import { useState, useEffect, useRef } from 'react';
import { VTO_CONFIG } from './config';
import type { FitMixInstance } from './types';

interface UseFittingBoxVTOProps {
  eanCode: string;
  apiKey: string;
  isOpen: boolean;
}

interface UseFittingBoxVTOReturn {
  isLoading: boolean;
  error: string | null;
  status: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * FittingBox VTO Hook - Industry Best Practice Pattern
 * 
 * Key Principles:
 * 1. Destroy and recreate widget each time (no reuse)
 * 2. Proper cleanup on unmount
 * 3. Simple state management
 * 4. Clear error handling
 */
export function useFittingBoxVTO({
  eanCode,
  apiKey,
  isOpen,
}: UseFittingBoxVTOProps): UseFittingBoxVTOReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<FitMixInstance | null>(null);
  const isInitializingRef = useRef(false);

  // Main effect: Create widget when modal opens, destroy when it closes
  useEffect(() => {
    // Skip if not open or already initializing
    if (!isOpen || isInitializingRef.current) {
      return;
    }

    // Check prerequisites
    if (!containerRef.current) {
      console.error('[VTO] Container not ready');
      return;
    }

    if (!window.FitMix) {
      console.error('[VTO] FitMix SDK not loaded');
      setError('Virtual Try-On SDK not loaded. Please refresh the page.');
      return;
    }

    // Initialize widget
    const initializeWidget = async () => {
      isInitializingRef.current = true;
      setIsLoading(true);
      setError(null);
      setStatus('Initializing Virtual Try-On...');

      console.log('[VTO] Creating fresh widget instance...');
      console.log('[VTO] API Key:', apiKey);
      console.log('[VTO] EAN Code:', eanCode);

      try {
        // Double-check FitMix is available
        if (!window.FitMix) {
          throw new Error('FitMix SDK not available');
        }

        // Create widget
        const widget = window.FitMix.createWidget(
          VTO_CONFIG.CONTAINER_ID,
          {
            apiKey,
            frame: eanCode,
            
            // Callbacks
            onStopVto: () => {
              console.log('[VTO] onStopVto callback');
              setIsLoading(false);
              setStatus('');
            },
            
            onIssue: (data: any) => {
              console.log('[VTO] onIssue:', data);
              
              // Check if there's actually an issue (any flag is true)
              const hasActualIssue = 
                data.frameNotFound ||
                data.cameraAccessDenied ||
                data.noCameraFound ||
                data.licenseNotFound ||
                data.detectionFailed ||
                data.liveIncompatibleBrowser ||
                data.liveIncompatibleOS ||
                data.protocolFailed ||
                data.serverNotResponding;
              
              // Ignore if all flags are false (FittingBox calls this for logging)
              if (!hasActualIssue) {
                console.log('[VTO] onIssue called but no actual issue - ignoring');
                return;
              }
              
              // Handle actual errors
              console.error('[VTO] Actual issue detected:', data);
              
              if (data.frameNotFound) {
                setError('Frame not available. Please try a different product.');
              } else if (data.cameraAccessDenied || data.noCameraFound) {
                setError('Camera access denied. Please allow camera access and try again.');
              } else if (data.licenseNotFound) {
                setError('Invalid license. Please contact support.');
              } else if (data.detectionFailed) {
                setError('Face detection failed. Please ensure good lighting.');
              } else if (data.liveIncompatibleBrowser || data.liveIncompatibleOS) {
                setError('Browser not supported. Please use Chrome, Firefox, Safari, or Edge.');
              } else if (data.protocolFailed) {
                setError('VTO protocol failed. Please refresh and try again.');
              } else if (data.serverNotResponding) {
                setError('Server not responding. Please check your internet connection.');
              } else {
                setError('Unable to start Virtual Try-On. Please try again.');
              }
              
              setIsLoading(false);
            },
            
            onOpenStream: (result: any) => {
              if (result.success) {
                console.log('[VTO] Camera stream opened successfully');
                setStatus('Camera ready! Position your face in the frame...');
                setIsLoading(false);
              }
            },
            
            onLiveStatus: (data: any) => {
              // Log live status for debugging
              if (data.faceTracking && data.glassesReady) {
                console.log('[VTO] Face tracked and glasses ready');
                setStatus(''); // Clear status when fully ready
                setIsLoading(false);
              } else if (data.hasStream && !data.faceTracking) {
                setStatus('Looking for your face...');
              } else if (data.faceTracking && !data.glassesReady) {
                setStatus('Loading glasses...');
              }
            },
          },
          () => {
            // Widget ready callback
            console.log('[VTO] Widget created, starting VTO...');
            setStatus('Starting Virtual Try-On...');
            
            if (widget) {
              widgetRef.current = widget;
              
              // Start VTO immediately
              setTimeout(() => {
                try {
                  widget.startVto('live');
                  console.log('[VTO] VTO started');
                  setStatus('Requesting camera access...');
                } catch (err) {
                  console.error('[VTO] Error starting VTO:', err);
                  setError('Failed to start Virtual Try-On.');
                  setIsLoading(false);
                  setStatus('');
                }
              }, 500);
            }
            
            isInitializingRef.current = false;
          }
        );

      } catch (err: any) {
        console.error('[VTO] Widget creation error:', err);
        setError(err.message || 'Failed to initialize Virtual Try-On.');
        setIsLoading(false);
        isInitializingRef.current = false;
      }
    };

    initializeWidget();

    // Cleanup function - runs when modal closes or component unmounts
    return () => {
      console.log('[VTO] Cleanup: Destroying widget...');
      
      if (widgetRef.current) {
        try {
          // Stop VTO
          if (widgetRef.current.stopVto) {
            widgetRef.current.stopVto();
          }
          
          // Clear reference
          widgetRef.current = null;
          
          console.log('[VTO] Widget destroyed successfully');
        } catch (err) {
          console.error('[VTO] Cleanup error:', err);
        }
      }
      
      // Reset states
      setIsLoading(false);
      setError(null);
      setStatus('');
      isInitializingRef.current = false;
    };
  }, [isOpen, eanCode, apiKey]);

  return {
    isLoading,
    error,
    status,
    containerRef,
  };
}
