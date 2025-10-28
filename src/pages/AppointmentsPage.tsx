import React from 'react';
import { Calendar, Clock, MapPin, Phone, CheckCircle } from 'lucide-react';

export function AppointmentsPage() {
  const services = [
    {
      id: 'eye-exam',
      name: 'Comprehensive Eye Exam',
      duration: '45 minutes',
      price: '$120',
      description: 'Complete eye health examination including vision testing, glaucoma screening, and retinal evaluation.'
    },
    {
      id: 'frame-selection',
      name: 'Frame Selection & Styling',
      duration: '30 minutes',
      price: 'Free',
      description: 'Personalized frame selection with our styling experts to find the perfect frames for your face shape and lifestyle.'
    },
    {
      id: 'contact-fitting',
      name: 'Contact Lens Fitting',
      duration: '60 minutes',
      price: '$95',
      description: 'Professional contact lens fitting with training on proper insertion, removal, and care.'
    }
  ];

  // ✅ Load Calendly script
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // ✅ Real Calendly Embed Component
  const CalendlyEmbed = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-6">
        <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Schedule Your Appointment</h3>
        <p className="text-gray-600">
          Select your preferred date and time from our available slots below.
        </p>
      </div>
      
      {/* Real Calendly Widget */}
      <div 
        className="calendly-inline-widget" 
        data-url="https://calendly.com/eyeoptical007/30min?hide_event_type_details=1&hide_gdpr_banner=1"
        style={{ minWidth: '320px', height: '700px' }}
      />
      
      <div className="mt-6 text-sm text-gray-600 text-center">
        <p>
          Having trouble? Call us at <strong className="text-blue-600">(555) 123-4567</strong>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Schedule professional eye care services with our experienced optometrists and eye care specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Our Services</h2>
            
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{service.price}</div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}

            {/* Contact Info */}
            <div className="bg-blue-50 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">123 Vision Street, City, State 12345</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div className="text-gray-700 text-sm">
                    <div>Mon-Fri: 9:00 AM - 7:00 PM</div>
                    <div>Sat: 9:00 AM - 6:00 PM</div>
                    <div>Sun: 11:00 AM - 5:00 PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Expect</h3>
              <div className="space-y-3">
                {[
                  'Arrive 15 minutes early for check-in',
                  'Bring your current glasses and insurance card',
                  'Complete health history forms',
                  'Receive comprehensive eye examination',
                  'Discuss results and recommendations'
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="lg:sticky lg:top-8">
            <CalendlyEmbed />
          </div>
        </div>
      </div>
    </div>
  );
}