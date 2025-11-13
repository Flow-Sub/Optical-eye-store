import { useState } from 'react';
import { useFittingBoxVTO } from './useFittingBoxVTO';
import { VTOButton } from './VTOButton';
import { VTOModal } from './VTOModal';
import { VTO_CONFIG } from './config';
import type { VTOComponentProps } from './types';

/**
 * FittingBox Virtual Try-On Component
 * 
 * Clean, simple implementation:
 * - Opens modal on button click
 * - Creates fresh VTO widget each time
 * - Destroys widget on close
 * - No complex state management
 */
export function FittingBoxVTO({
  productName,
  eanCode = VTO_CONFIG.DEFAULT_EAN_CODE,
  apiKey = VTO_CONFIG.DEFAULT_API_KEY,
  onClose,
}: VTOComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isLoading, error, status, containerRef } = useFittingBoxVTO({
    eanCode,
    apiKey,
    isOpen: isModalOpen,
  });

  const handleOpen = () => {
    console.log('[VTO Component] Opening modal');
    setIsModalOpen(true);
  };

  const handleClose = () => {
    console.log('[VTO Component] Closing modal');
    setIsModalOpen(false);
    onClose?.();
  };

  return (
    <>
      <VTOButton onClick={handleOpen} />
      
      <VTOModal
        isOpen={isModalOpen}
        productName={productName}
        isLoading={isLoading}
        error={error}
        status={status}
        containerRef={containerRef}
        onClose={handleClose}
      />
    </>
  );
}
