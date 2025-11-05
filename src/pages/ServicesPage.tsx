import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock, Users, Award, CheckCircle, Calendar, Phone, MapPin, ChevronRight, Sparkles, Shield } from 'lucide-react';
import { createAppointment } from '../services/airtable';

interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  calendlyUrl: string;
}

declare global {
  interface Window {
    Calendly: {
      initPopupWidget: (options: {
        url: string;
        prefill?: {
          name?: string;
          email?: string;
          customAnswers?: Record<string, string>;
        };
      }) => void;
    };
  }
}

const storeLocations: StoreLocation[] = [
  {
    id: 'manhattan',
    name: 'Manhattan Flagship',
    address: '123 Fifth Avenue, New York, NY 10001',
    phone: '(212) 555-0101',
    hours: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM',
    image: 'https://antdisplay.com/pub/media/magefan_blog/4_1_3.jpg',
    calendlyUrl: 'https://calendly.com/eyeoptical007/eye-care-appointment-1'
  },
  {
    id: 'brooklyn',
    name: 'Brooklyn Heights',
    address: '456 Court Street, Brooklyn, NY 11231',
    phone: '(718) 555-0202',
    hours: 'Mon-Sat: 9AM-7PM, Sun: 11AM-5PM',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrOEoKkJZTc-aa_taK0LB9H21kbFwTUQht8w&s',
    calendlyUrl: 'https://calendly.com/eyeoptical007/brooklyn-appointment'
  },
  {
    id: 'queens',
    name: 'Queens Center',
    address: '789 Queens Blvd, Queens, NY 11374',
    phone: '(718) 555-0303',
    hours: 'Mon-Sat: 10AM-8PM, Sun: 10AM-6PM',
    image: 'https://i.pinimg.com/originals/3e/c1/41/3ec141fb4407ad0d429a23247f899adb.jpg',
    calendlyUrl: 'https://calendly.com/eyeoptical007/queens-appointment'
  },
  {
    id: 'bronx',
    name: 'Bronx Plaza',
    address: '321 Fordham Road, Bronx, NY 10458',
    phone: '(718) 555-0404',
    hours: 'Mon-Sat: 9AM-7PM, Sun: 11AM-5PM',
    image: 'https://d3995ea24pmi7m.cloudfront.net/media/stores/store-images/TDRA/mobile/TDRA_2.webp',
    calendlyUrl: 'https://calendly.com/eyeoptical007/bronx-appointment'
  }
];

export function ServicesPage() {
  const [selectedLocation, setSelectedLocation] = useState<StoreLocation | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState<'location' | 'service' | 'calendly'>('location');
  const [selectedService, setSelectedService] = useState('');
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  // Load Calendly popup widget
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingLink = document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]');
      if (existingLink) document.head.removeChild(existingLink);
      
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []);

  const openBookingFlow = () => {
    setShowBookingModal(true);
    setBookingStep('location');
  };

  const handleLocationSelect = (location: StoreLocation) => {
    setSelectedLocation(location);
    setBookingStep('service');
  };

  const handleServiceSelect = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setBookingStep('calendly');
  };

  const openCalendly = () => {
    if (!selectedLocation) return;
    
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: selectedLocation.calendlyUrl
      });
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedLocation || !bookingData.name || !bookingData.email) {
      alert('Please fill in all required fields');
      return;
    }

    openCalendly();

    // Save to Airtable
    try {
      await createAppointment({
        customerName: bookingData.name,
        customerEmail: bookingData.email,
        customerPhone: bookingData.phone,
        storeLocation: selectedLocation.name,
        serviceType: selectedService,
        appointmentDate: new Date().toISOString().split('T')[0],
        appointmentTime: 'TBD',
        status: 'Scheduled',
        notes: bookingData.notes
      });
    } catch (error) {
      console.error('Failed to save appointment:', error);
    }
  };

  const services = [
    {
      id: 'comprehensive-exam',
      title: 'Comprehensive Eye Examinations',
      duration: '45-60 min',
      price: '$120',
      description: 'Complete eye health evaluation with advanced diagnostic technology.',
      features: [
        'Visual acuity testing',
        'Refraction assessment',
        'Eye pressure measurement',
        'Retinal photography',
        'Peripheral vision testing',
        'Color vision screening'
      ],
      image: 'https://images.pexels.com/photos/5752254/pexels-photo-5752254.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 'contact-lens',
      title: 'Contact Lens Services',
      duration: '30-45 min',
      price: '$95',
      description: 'Professional fitting and training for optimal comfort and vision.',
      features: [
        'Initial fitting consultation',
        'Lens insertion/removal training',
        'Care instruction guidance',
        'Follow-up appointments',
        'Specialty lens fitting',
        'Dry eye management'
      ],
      image: 'https://images.pexels.com/photos/6608312/pexels-photo-6608312.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 'frame-styling',
      title: 'Frame Selection & Styling',
      duration: '30 min',
      price: 'Complimentary',
      description: 'Personalized frame selection with our expert stylists.',
      features: [
        'Face shape analysis',
        'Lifestyle consultation',
        'Color matching',
        'Frame adjustment',
        'Style recommendations',
        'Virtual try-on technology'
      ],
      image: 'https://images.pexels.com/photos/1187999/pexels-photo-1187999.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const whyChooseUs = [
    { icon: Award, title: 'Expert Optometrists', description: 'Licensed professionals with years of experience.' },
    { icon: Eye, title: 'Advanced Technology', description: 'State-of-the-art diagnostic equipment.' },
    { icon: Users, title: 'Personalized Care', description: 'Tailored solutions for your unique needs.' },
    { icon: Shield, title: 'Quality Guarantee', description: 'Satisfaction guaranteed on all services.' }
  ];

  return (
    <div className="min-h-screen bg-white pt-28">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center space-x-2 text-xs uppercase tracking-wider text-gray-500 mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Professional Eye Care</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6">
              Expert Vision Care Services
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Comprehensive eye examinations and personalized care from our experienced team of optometrists.
            </p>
            <button
              onClick={openBookingFlow}
              className="bg-gray-900 text-white px-8 py-4 font-light hover:bg-gray-800 transition-all duration-300 inline-flex items-center space-x-3 group"
            >
              <Calendar className="h-5 w-5" />
              <span>Schedule Appointment</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">Visit Our Locations</h2>
            <p className="text-gray-600">Four convenient locations across New York</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {storeLocations.map((location) => (
              <div
                key={location.id}
                className="group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-light text-lg text-gray-900 mb-3">{location.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-5">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                      <span className="font-light">{location.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="font-light text-xs">{location.hours}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLocation(location);
                      openBookingFlow();
                    }}
                    className="w-full border border-gray-900 text-gray-900 py-2.5 font-light text-sm hover:bg-gray-900 hover:text-white transition-all duration-300"
                  >
                    Book Here
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional eye care services tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-light text-lg text-gray-900">{service.title}</h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium text-gray-900">{service.price}</span>
                    <span className="text-gray-400">•</span>
                    <span className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {service.duration}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-700">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="font-light text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 font-light">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-gray-900 to-black p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-light">Book Your Appointment</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-white/80 hover:text-white p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Progress Steps */}
              <div className="flex items-center justify-between mt-6">
                {['Location', 'Service', 'Schedule'].map((step, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-light
                      ${idx === ['location', 'service', 'calendly'].indexOf(bookingStep) 
                        ? 'bg-white text-gray-900' 
                        : 'bg-white/20 text-white/60'}`}>
                      {idx + 1}
                    </div>
                    <span className="ml-2 text-sm font-light hidden sm:inline">{step}</span>
                    {idx < 2 && <div className="w-12 sm:w-20 h-px bg-white/20 ml-4" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8">
              {/* Location Step */}
              {bookingStep === 'location' && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-light text-gray-900 mb-6">Choose Your Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {storeLocations.map((location) => (
                      <div
                        key={location.id}
                        onClick={() => handleLocationSelect(location)}
                        className={`border rounded-lg p-5 cursor-pointer transition-all duration-200 hover:shadow-md
                          ${selectedLocation?.id === location.id
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'}`}
                      >
                        <h4 className="font-light text-gray-900 mb-2">{location.name}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-3.5 w-3.5 mt-0.5" />
                            <span className="font-light text-xs">{location.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3.5 w-3.5" />
                            <span className="font-light text-xs">{location.phone}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Step */}
              {bookingStep === 'service' && (
                <div className="animate-fadeIn">
                  <button
                    onClick={() => setBookingStep('location')}
                    className="text-gray-600 hover:text-gray-900 mb-4 text-sm font-light flex items-center"
                  >
                    ← Back to locations
                  </button>
                  <h3 className="text-2xl font-light text-gray-900 mb-6">Select Service Type</h3>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => handleServiceSelect(service.title)}
                        className={`border rounded-lg p-5 cursor-pointer transition-all duration-200 hover:shadow-md
                          ${selectedService === service.title
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-light text-gray-900 mb-1">{service.title}</h4>
                            <p className="text-sm text-gray-600 font-light">{service.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-light text-gray-900">{service.price}</div>
                            <div className="text-xs text-gray-500">{service.duration}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule Step */}
              {bookingStep === 'calendly' && (
                <div className="animate-fadeIn">
                  <button
                    onClick={() => setBookingStep('service')}
                    className="text-gray-600 hover:text-gray-900 mb-4 text-sm font-light flex items-center"
                  >
                    ← Back to services
                  </button>
                  <h3 className="text-2xl font-light text-gray-900 mb-6">Your Information</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-600 font-light">Location</p>
                        <p className="text-gray-900">{selectedLocation?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 font-light">Service</p>
                        <p className="text-gray-900">{selectedService}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-2">Additional Notes</label>
                      <textarea
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light"
                        placeholder="Any special requirements..."
                      />
                    </div>
                    
                    <button
                      onClick={handleBookingSubmit}
                      disabled={!bookingData.name || !bookingData.email}
                      className="w-full bg-gray-900 text-white py-4 px-6 font-light hover:bg-gray-800 
                               disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors 
                               flex items-center justify-center space-x-2"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Continue to Schedule</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}