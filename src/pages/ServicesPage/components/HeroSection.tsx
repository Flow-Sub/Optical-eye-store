import React from 'react';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onBookClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBookClick }) => {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center space-x-2 text-xs uppercase tracking-wider text-gray-500 mb-6 bg-white px-4 py-2 rounded-full shadow-sm">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>Professional Eye Care Excellence</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
            Expert Vision Care <br />
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Services
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            Comprehensive eye examinations and personalized care from our experienced team of
            optometrists.
          </p>
          <button
            onClick={onBookClick}
            className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-10 py-4 rounded-full font-light hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center space-x-3 group"
            aria-label="Schedule an appointment"
          >
            <Calendar className="h-5 w-5" />
            <span>Schedule Appointment</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

