import React from 'react';
import { Calendar, Phone } from 'lucide-react';
import { FAQ_ITEMS } from '../constants';
import { FAQItem } from './FAQItem';

interface FAQSectionProps {
  onBookClick: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onBookClick }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 font-light">
            Common questions about our services and appointments
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-8">
          {FAQ_ITEMS.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gray-50 rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Still have questions? We're here to help.
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button
              onClick={onBookClick}
              className="bg-gray-900 text-white px-8 py-3 font-light hover:bg-gray-800 transition-all duration-300 inline-flex items-center justify-center space-x-2"
              aria-label="Book an appointment"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Appointment</span>
            </button>
            <a
              href="tel:5551234567"
              className="border border-gray-900 text-gray-900 px-8 py-3 font-light hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center justify-center space-x-2"
            >
              <Phone className="h-4 w-4" />
              <span>Contact Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

