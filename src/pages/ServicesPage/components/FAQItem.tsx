import React from 'react';
import { FAQItemProps } from '../types';

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <div className="border-b border-gray-200 pb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {question}
      </h3>
      <p className="text-gray-600 font-light leading-relaxed">
        {answer}
      </p>
    </div>
  );
};

