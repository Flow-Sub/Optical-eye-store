import { useState } from 'react';
import { useFittingBoxVTO } from './useFittingBoxVTO';
import { VTOButton } from './VTOButton';
import { VTOModal } from './VTOModal';
import { VTO_CONFIG } from './config';
import type { VTOComponentProps } from './types';

/**
 * FittingBox Virtual Try-On Component
 * 
 * A complete VTO solution that handles:
 * - Dynamic script loading
 * - Widget initialization
 * - Modal UI
 * - Error handling
 * - Cleanup
 * 
 * @example
 * ```tsx
 * <FittingBoxVTO 
 *   productName="Ray-Ban Classic"
 *   eanCode="8056597149013"
 * />
 * ```
 */
export function FittingBoxVTO({
  productName,
  eanCode = VTO_CONFIG.DEFAULT_EAN_CODE,
  apiKey = VTO_CONFIG.DEFAULT_API_KEY,
  onClose,
}: VTOComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isLoading,
    error,
    isWidgetReady,
    containerRef,
    stopVTO,
  } = useFittingBoxVTO({
    eanCode,
    apiKey,
    isOpen: isModalOpen,
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    stopVTO();
    setIsModalOpen(false);
    onClose?.();
  };

  return (
    <>
      <VTOButton onClick={handleOpenModal} />
      
      <VTOModal
        isOpen={isModalOpen}
        productName={productName}
        isLoading={isLoading}
        error={error}
        isWidgetReady={isWidgetReady}
        containerRef={containerRef}
        onClose={handleCloseModal}
      />
    </>
  );
}

