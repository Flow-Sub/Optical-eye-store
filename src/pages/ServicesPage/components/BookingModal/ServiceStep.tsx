import React from 'react';
import { ChevronRight, MapPin, Check } from 'lucide-react';
import { StoreLocation } from '../../../../types';
import { FormattedService } from '../../types';

interface ServiceStepProps {
  services: FormattedService[];
  selectedService: string;
  selectedLocation: StoreLocation | null;
  onServiceSelect: (serviceTitle: string) => void;
  onBack: () => void;
}

export const ServiceStep: React.FC<ServiceStepProps> = ({
  services,
  selectedService,
  selectedLocation,
  onServiceSelect,
  onBack
}) => {
  return (
    <div className="animate-fadeIn">
      <button
        onClick={onBack}
        className="text-gray-500 hover:text-gray-900 mb-6 text-sm font-light flex items-center transition-colors"
      >
        <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
        Back to locations
      </button>
      <h3 className="text-2xl font-light text-gray-900 mb-8">Select Service Type</h3>

      {/* Show selected location */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 mb-8 border border-gray-200">
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-xs text-gray-500 font-light">Selected Location</p>
            <p className="text-gray-900 font-medium">{selectedLocation?.name}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onServiceSelect(service.title)}
            className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg relative
              ${selectedService === service.title
                ? 'border-gray-900 bg-gradient-to-br from-gray-50 to-white shadow-md'
                : 'border-gray-200 hover:border-gray-400 bg-white'}`}
            role="button"
            tabIndex={0}
            aria-pressed={selectedService === service.title}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onServiceSelect(service.title);
              }
            }}
          >
            {selectedService === service.title && (
              <div className="absolute top-6 right-6">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h4 className="font-medium text-lg text-gray-900 mb-2">{service.title}</h4>
                <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
                  {service.description}
                </p>
                {service.features && service.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {service.features.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-light"
                      >
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 2 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{service.features.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right ml-6 flex-shrink-0">
                <div className="text-2xl font-light text-gray-900">{service.price}</div>
                <div className="text-xs text-gray-500 mt-1">{service.duration}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

