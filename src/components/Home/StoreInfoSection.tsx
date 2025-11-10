import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const STORE_IMAGE = 'https://images.adsttc.com/media/images/5012/a2fe/28ba/0d14/7d00/00b0/newsletter/stringio.jpg?1414224052';

export function StoreInfoSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">Visit Our Store</h2>
            <p className="text-gray-600 mb-6">
              Your new favourite, family-friendly eye care specialist! Led by a consultant ophthalmologist, 
              our experienced team is proud to offer exceptional & affordable eye care for you and your family.
            </p>
            <div className="space-y-2 text-gray-600 mb-8">
              <p><strong>Address:</strong> 1 Regent Rd, Altrincham WA14 1RY</p>
              <p><strong>Phone:</strong> 0161 928 1891</p>
              <p><strong>Email:</strong> info@optieyecare.co.uk</p>
            </div>
            <Link
              to="/appointments"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-light hover:bg-gray-800 transition-colors inline-flex items-center space-x-2 text-sm"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Appointment</span>
            </Link>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img src={STORE_IMAGE} alt="Store interior" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

