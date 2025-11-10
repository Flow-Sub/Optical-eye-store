import React from 'react';
import { Clock, Check } from 'lucide-react';
import { ServiceCardProps } from '../types';

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      <div className="aspect-[16/10] overflow-hidden relative">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center space-x-3 text-white">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              {service.price}
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-light flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              {service.duration}
            </span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-medium text-xl text-gray-900 mb-3">{service.title}</h3>
        <p className="text-gray-600 text-sm mb-5 leading-relaxed">{service.description}</p>
        {service.features && service.features.length > 0 && (
          <div className="space-y-2.5">
            {service.features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center text-sm text-gray-700">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="font-light">{feature}</span>
              </div>
            ))}
            {service.features.length > 3 && (
              <p className="text-xs text-gray-500 pl-8 font-light">
                +{service.features.length - 3} more features
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

