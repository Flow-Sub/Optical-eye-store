import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock, Users, Award, CheckCircle, Calendar, Phone, MapPin, Navigation } from 'lucide-react';
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
    name: 'Manhattan Flagship Store',
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
        appointmentDate: new Date().toISOString().split('T')[0], // Will be updated by Calendly webhook
        appointmentTime: 'TBD', // Will be updated by Calendly webhook
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
      duration: '45-60 minutes',
      price: 'From $120',
      description: 'Complete eye health evaluation including vision testing, glaucoma screening, and retinal examination.',
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
      duration: '30-45 minutes',
      price: 'From $95',
      description: 'Professional contact lens fitting, training, and ongoing care for optimal comfort and vision.',
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
      duration: '30 minutes',
      price: 'Complimentary',
      description: 'Personalized frame selection with our styling experts to find the perfect frames for your lifestyle.',
      features: [
        'Face shape analysis',
        'Lifestyle consultation',
        'Color matching',
        'Frame adjustment',
        'Style recommendations',
        'Virtual try-on technology'
      ],
      image: 'https://images.pexels.com/photos/1187999/pexels-photo-1187999.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 'lens-services',
      title: 'Lens Services & Coatings',
      duration: '15-30 minutes',
      price: 'Varies',
      description: 'Premium lens options and protective coatings to enhance your vision and protect your investment.',
      features: [
        'Progressive lenses',
        'Anti-reflective coating',
        'Blue light protection',
        'Photochromic lenses',
        'High-index materials',
        'Scratch-resistant coating'
      ],
      image: 'https://images.pexels.com/photos/6087368/pexels-photo-6087368.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 'repairs',
      title: 'Repairs & Adjustments',
      duration: '15-30 minutes',
      price: 'From $15',
      description: 'Professional repair services and adjustments to keep your eyewear in perfect condition.',
      features: [
        'Frame adjustments',
        'Nose pad replacement',
        'Screw tightening',
        'Temple repair',
        'Lens replacement',
        'Emergency repairs'
      ],
      image: 'https://images.pexels.com/photos/6087246/pexels-photo-6087246.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 'pediatric',
      title: 'Pediatric Eye Care',
      duration: '30-45 minutes',
      price: 'From $110',
      description: 'Specialized eye care for children with gentle, age-appropriate examination techniques.',
      features: [
        'Child-friendly environment',
        'Vision development assessment',
        'Learning-related vision problems',
        'Amblyopia screening',
        'Strabismus evaluation',
        'Sports vision assessment'
      ],
      image: 'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: 'Expert Optometrists',
      description: 'Licensed professionals with years of experience in comprehensive eye care.'
    },
    {
      icon: Eye,
      title: 'Advanced Technology',
      description: 'State-of-the-art equipment for accurate diagnosis and treatment.'
    },
    {
      icon: Users,
      title: 'Personalized Care',
      description: 'Individual attention and customized solutions for your unique needs.'
    },
    {
      icon: Clock,
      title: 'Convenient Hours',
      description: 'Flexible scheduling including evenings and weekends.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Professional Eye Care Services</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Comprehensive eye examinations, expert fittings, and personalized care from our experienced team of optometrists and eye care specialists.
            </p>
            <button
              onClick={openBookingFlow}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Locations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visit us at any of our convenient locations across New York
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {storeLocations.map((location) => (
              <div key={location.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{location.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{location.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{location.phone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{location.hours}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLocation(location);
                      openBookingFlow();
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Book Here</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From routine eye exams to specialized treatments, we provide comprehensive care for all your vision needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{service.price}</div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.duration}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="space-y-2">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                      {service.features.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{service.features.length - 3} more services included
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose OpticalStore?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional eye care with the latest technology and personalized service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Book Your Appointment</h2>
                <button onClick={() => setShowBookingModal(false)} className="text-white hover:bg-white/20 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <div className={`flex items-center ${bookingStep === 'location' ? 'text-white' : 'text-blue-200'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep === 'location' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}>1</div>
                  <span className="ml-2">Location</span>
                </div>
                <div className="flex-1 h-0.5 bg-blue-400"></div>
                <div className={`flex items-center ${bookingStep === 'service' ? 'text-white' : 'text-blue-200'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep === 'service' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}>2</div>
                  <span className="ml-2">Service</span>
                </div>
                <div className="flex-1 h-0.5 bg-blue-400"></div>
                <div className={`flex items-center ${bookingStep === 'calendly' ? 'text-white' : 'text-blue-200'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep === 'calendly' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}>3</div>
                  <span className="ml-2">Schedule</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Step 1: Select Location */}
              {bookingStep === 'location' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Preferred Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {storeLocations.map((location) => (
                      <div
                        key={location.id}
                        onClick={() => handleLocationSelect(location)}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                          selectedLocation?.id === location.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">{location.name}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 mt-0.5" />
                            <span>{location.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{location.phone}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Select Service */}
              {bookingStep === 'service' && (
                <div>
                  <button
                    onClick={() => setBookingStep('location')}
                    className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
                  >
                    ← Back to locations
                  </button>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Service Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => handleServiceSelect(service.title)}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                          selectedService === service.title
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{service.title}</h4>
                          <span className="text-blue-600 font-bold">{service.price}</span>
                        </div>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Enter Details & Schedule */}
              {bookingStep === 'calendly' && (
                <div>
                  <button
                    onClick={() => setBookingStep('service')}
                    className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
                  >
                    ← Back to services
                  </button>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h3>
                  
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold">{selectedLocation?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Service</p>
                        <p className="font-semibold">{selectedService}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                      <textarea
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any special requirements or questions..."
                      />
                    </div>

                    <button
                      onClick={handleBookingSubmit}
                      disabled={!bookingData.name || !bookingData.email}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      <Calendar className="h-5 w-5" />
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