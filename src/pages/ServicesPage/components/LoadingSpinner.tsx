import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-28">
      <div className="text-center">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"
          role="status"
          aria-label="Loading"
        ></div>
        <p className="text-gray-600 font-light">{message}</p>
      </div>
    </div>
  );
};

