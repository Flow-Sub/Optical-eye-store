import React from 'react';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { StoreLocation } from '../../../types';

interface LocationSelectionStepProps {
  locations: StoreLocation[];
  onSelectLocation: (location: StoreLocation) => void;
}

export const LocationSelectionStep: React.FC<LocationSelectionStepProps> = ({
  locations,
  onSelectLocation
}) => {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Select Your Preferred Location
        </h2>
        <p className="text-gray-600 font-light">
          Choose the store location most convenient for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {locations.map((location) => (
          <div
            key={location.id}
            onClick={() => onSelectLocation(location)}
            className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-900 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectLocation(location);
              }
            }}
          >
            {/* Location Image */}
            {location.image && (
              <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Location Info */}
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{location.name}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600 font-light leading-tight">
                  {location.address}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600 font-light">{location.phone}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600 font-light">{location.hours}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-light hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 group-hover:shadow-md">
              <span>Book at This Location</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

