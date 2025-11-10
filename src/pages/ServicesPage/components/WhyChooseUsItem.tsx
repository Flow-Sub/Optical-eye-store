import React from 'react';
import { WhyChooseUsItemProps } from '../types';

export const WhyChooseUsItem: React.FC<WhyChooseUsItemProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="text-center group">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md">
        <Icon className="h-7 w-7 text-gray-700" />
      </div>
      <h3 className="font-medium text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 font-light leading-relaxed">{description}</p>
    </div>
  );
};

