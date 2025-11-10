import React from 'react';
import { MapPin, Phone, Clock, Check } from 'lucide-react';
import { StoreLocation } from '../../../../types';

interface LocationStepProps {
  locations: StoreLocation[];
  selectedLocation: StoreLocation | null;
  onLocationSelect: (location: StoreLocation) => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({
  locations,
  selectedLocation,
  onLocationSelect
}) => {
  return (
    <div className="animate-fadeIn">
      <h3 className="text-2xl font-light text-gray-900 mb-8">Choose Your Location</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map((location) => (
          <div
            key={location.id}
            onClick={() => onLocationSelect(location)}
            className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden
              ${selectedLocation?.id === location.id
                ? 'border-gray-900 bg-gradient-to-br from-gray-50 to-white shadow-md'
                : 'border-gray-200 hover:border-gray-400 bg-white'}`}
            role="button"
            tabIndex={0}
            aria-pressed={selectedLocation?.id === location.id}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onLocationSelect(location);
              }
            }}
          >
            {selectedLocation?.id === location.id && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
            <h4 className="font-medium text-lg text-gray-900 mb-3">{location.name}</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                <span className="font-light leading-tight">{location.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="font-light">{location.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="font-light text-xs">{location.hours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

