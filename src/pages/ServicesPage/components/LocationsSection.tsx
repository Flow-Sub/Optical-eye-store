import React from 'react';
import { StoreLocation } from '../../../types';
import { LocationCard } from './LocationCard';

interface LocationsSectionProps {
  locations: StoreLocation[];
  onBookClick: (location: StoreLocation) => void;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({ locations, onBookClick }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Visit Our Locations
          </h2>
          <p className="text-gray-600 text-lg">Four convenient locations across New York</p>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} onBookClick={onBookClick} />
          ))}
        </div>
      </div>
    </section>
  );
};

