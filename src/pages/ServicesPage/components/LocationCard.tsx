import React from 'react';
import { Calendar, Clock, MapPin, Phone, ArrowRight } from 'lucide-react';
import { LocationCardProps } from '../types';

export const LocationCard: React.FC<LocationCardProps> = ({ location, onBookClick }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={location.image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={location.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <h3 className="font-medium text-xl text-gray-900 mb-3">{location.name}</h3>
        <div className="space-y-3 text-sm text-gray-600 mb-6">
          <div className="flex items-start space-x-3">
            <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
            <span className="font-light leading-tight">{location.address}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="font-light text-xs">{location.hours}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="font-light">{location.phone}</span>
          </div>
        </div>
        <button
          onClick={() => onBookClick(location)}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-light hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 group"
          aria-label={`Book appointment at ${location.name}`}
        >
          <Calendar className="h-4 w-4" />
          <span>Book Here</span>
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-1 group-hover:ml-0" />
        </button>
      </div>
    </div>
  );
};

