import React from 'react';
import { ChevronLeft, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { StoreLocation } from '../../../types';
import { SelectedService } from '../useAppointmentBooking';
import { formatCurrency } from '../../../lib/currency';

interface ServiceSelectionStepProps {
  services: Array<{
    _id: string;
    serviceName: string;
    description: string;
    duration: number;
    price: number;
    image?: string;
  }>;
  selectedLocation: StoreLocation;
  onSelectService: (service: SelectedService) => void;
  onBack: () => void;
}

export const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
  services,
  selectedLocation,
  onSelectService,
  onBack
}) => {
  return (
    <div className="animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="text-gray-600 hover:text-gray-900 mb-6 font-light flex items-center transition-colors"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Change Location
      </button>

      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Select Your Service
        </h2>
        <p className="text-gray-600 font-light mb-4">
          Choose the service you'd like to book
        </p>
        
        {/* Selected Location Badge */}
        <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-gray-700">
            <span className="font-medium">{selectedLocation.name}</span>
          </span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {services.map((service) => (
          <div
            key={service._id}
            onClick={() => onSelectService(service)}
            className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-900 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectService(service);
              }
            }}
          >
            {/* Service Image */}
            {service.image && (
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.serviceName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Service Info */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.serviceName}
              </h3>
              
              <p className="text-sm text-gray-600 font-light mb-4 line-clamp-2">
                {service.description}
              </p>

              {/* Price and Duration */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration} min</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {service.price === 0 ? 'Free' : formatCurrency(service.price)}
                </div>
              </div>

              {/* CTA */}
              <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-light hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 group-hover:shadow-md">
                <span>Select Service</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

