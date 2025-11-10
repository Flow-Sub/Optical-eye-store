import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-28">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 font-light mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-light hover:bg-gray-800 transition-all duration-300"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

