import React from 'react';
import { Calendar, Clock, MapPin, Phone, CheckCircle, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { useServices } from '../hooks/useServices';

export function AppointmentsPage() {
  const { services, loading, error } = useServices(true); // Fetch only active services

  const formatPrice = (price: number) => {
    return price === 0 ? 'Complimentary' : `$${price}`;
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} minutes`;
  };

  // Load Calendly script
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // Load Calendly script
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const CalendlyEmbed = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-gray-700" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Schedule Your Visit</h3>
        <p className="text-gray-600 font-light text-sm">
          Select your preferred date and time below
        </p>
      </div>

      {/* Calendly Widget */}
      <div 
        className="calendly-inline-widget rounded-lg overflow-hidden"
        data-url="https://calendly.com/eyeoptical007/30min?hide_event_type_details=1&hide_gdpr_banner=1"
        style={{ minWidth: '320px', height: '630px' }}
      />

      <div className="mt-6 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600 font-light">
          Need assistance? Call us at{' '}
          <a href="tel:5551234567" className="text-gray-900 font-medium hover:text-gray-700">
            (555) 123-4567
          </a>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-28">
      
      {/* HERO */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-30"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center space-x-2 text-xs uppercase tracking-wider text-gray-500 mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Book Online</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Schedule Your Appointment
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Experience professional eye care with our team of expert optometrists. 
              Book your consultation today.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* LEFT COLUMN */}
            <div className="space-y-8">
              
              {/* Services */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Services</h2>
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <p className="text-red-700 font-light">Failed to load services</p>
                    </div>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 font-light">
                    No services available at the moment
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service._id}
                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-medium text-lg text-gray-900">{service.serviceName}</h3>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{formatPrice(service.price)}</div>
                            <div className="text-xs text-gray-500 flex items-center justify-end mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDuration(service.duration)}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 font-light leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    ))
                  }
                </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Visit Our Store</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div className="text-sm text-gray-700 font-light">
                      123 Vision Street<br />
                      City, State 12345
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 font-light">(555) 123-4567</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div className="text-sm text-gray-700 font-light">
                      Mon-Fri: 9:00 AM - 7:00 PM<br />
                      Sat: 9:00 AM - 6:00 PM<br />
                      Sun: 11:00 AM - 5:00 PM
                    </div>
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">What to Expect</h3>
                <div className="space-y-3">
                  {[
                    'Arrive 15 minutes early for paperwork',
                    'Bring current glasses and insurance card',
                    'Complete health history forms',
                    'Receive comprehensive examination',
                    'Discuss results and recommendations'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Booking Widget */}
            <div className="lg:sticky lg:top-28">
              <CalendlyEmbed />
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
            Have Questions?
          </h2>
          <p className="text-gray-600 mb-8 font-light">
            Our team is here to help you with any inquiries about our services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:5551234567"
              className="border border-gray-900 text-gray-900 px-8 py-3 font-light hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center justify-center space-x-2"
            >
              <Phone className="h-4 w-4" />
              <span>Call Us</span>
            </a>
            <a
              href="/contact"
              className="bg-gray-900 text-white px-8 py-3 font-light hover:bg-gray-800 transition-all duration-300 inline-flex items-center justify-center space-x-2 group"
            >
              <span>Contact Form</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}