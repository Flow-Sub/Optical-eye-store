import { X } from 'lucide-react';
import { VTO_CONFIG } from './config';

interface VTOModalProps {
  isOpen: boolean;
  productName: string;
  isLoading: boolean;
  error: string | null;
  status: string;
  containerRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
}

/**
 * VTO Modal Component - Clean presentational component
 * Shows status messages for better UX
 */
export function VTOModal({
  isOpen,
  productName,
  error,
  status,
  containerRef,
  onClose,
}: VTOModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-modal-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Virtual Try-On</h2>
            <p className="text-sm text-gray-600 mt-1">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/80 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-white relative">
          {/* Status Banner - Shows what's happening */}
          {status && !error && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-40 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg flex items-center space-x-3 animate-pulse">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">{status}</span>
            </div>
          )}

          {/* Error Overlay - Only show for actual errors */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-30">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-red-600 text-lg font-medium text-center px-4 max-w-md">{error}</p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* VTO Container - Always visible so FittingBox can show its own UI and camera permission prompts */}
          <div
            ref={containerRef}
            id={VTO_CONFIG.CONTAINER_ID}
            className="w-full rounded-xl overflow-hidden bg-gray-50"
            style={{ minHeight: '500px', height: '70vh' }}
          />
        </div>

        {/* Footer Tip */}
        {!error && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600 text-center">
              💡 Tip: Make sure you're in a well-lit area for the best experience
            </p>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
