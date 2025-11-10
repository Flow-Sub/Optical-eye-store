import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
  steps: string[];
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center flex-1">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                ${idx <= currentStep
                  ? 'bg-white text-gray-900 shadow-lg scale-110'
                  : 'bg-white/20 text-white/70 scale-100'}`}
            >
              {idx < currentStep ? <Check className="h-5 w-5" /> : idx + 1}
            </div>
            <span
              className={`ml-3 text-sm font-light transition-all duration-300 ${
                idx <= currentStep ? 'text-white' : 'text-white/50'
              }`}
            >
              {step}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex-1 mx-4">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: idx < currentStep ? '100%' : '0%' }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

