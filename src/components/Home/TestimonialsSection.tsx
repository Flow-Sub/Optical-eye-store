import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  { name: 'Sarah Johnson', comment: 'The perfect frames! Great quality and the team helped me find exactly what I was looking for.' },
  { name: 'Michael Chen', comment: 'Professional service and excellent eye care. My prescription is spot on and the frames are comfortable.' },
  { name: 'Emily Rodriguez', comment: 'Best optical-store experience. Beautiful frames, knowledgeable staff, and fair prices.' }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">Customer Reviews</h2>
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />)}
            <span className="text-sm text-gray-600 ml-2">4.9/5 from 500+ reviews</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />)}</div>
              <p className="text-gray-600 mb-6 italic leading-relaxed">"{t.comment}"</p>
              <p className="font-light text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-500">Verified customer</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

