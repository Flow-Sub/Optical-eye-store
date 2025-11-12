import { X } from 'lucide-react';
import { VTO_CONFIG } from './config';

interface VTOModalProps {
  isOpen: boolean;
  productName: string;
  isLoading: boolean;
  error: string | null;
  isWidgetReady: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
}

/**
 * VTO Modal Component - Presentational component for the VTO modal
 */
export function VTOModal({
  isOpen,
  productName,
  isLoading,
  error,
  isWidgetReady,
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
        <div className="p-6 bg-white">
          {/* Loading State */}
          {isLoading && !error && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-600 mt-6 text-lg font-medium">Initializing Virtual Try-On...</p>
              <p className="text-gray-500 text-sm mt-2">Please allow camera access when prompted</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-red-600 text-lg font-medium text-center px-4">{error}</p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* VTO Container */}
          <div
            ref={containerRef}
            id={VTO_CONFIG.CONTAINER_ID}
            className={`w-full rounded-xl overflow-hidden bg-gray-50 ${
              isLoading || error ? 'hidden' : 'block'
            }`}
            style={{ minHeight: '500px', height: '70vh' }}
          />
        </div>

        {/* Footer */}
        {isWidgetReady && !error && (
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

