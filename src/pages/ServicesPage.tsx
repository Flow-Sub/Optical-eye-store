import React, { useState } from 'react';
import { Eye, Clock, Users, Award, Calendar, Phone, MapPin, ChevronRight, Sparkles, Shield, ArrowRight, Check } from 'lucide-react';
import { createAppointment } from '../services/airtable';
import { useStoreLocations } from '../hooks/useStoreLocations';
import { useServices } from '../hooks/useServices';
import { StoreLocation } from '../types'; // Adjust path

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

  // NEW: Fetch dynamic locations
  const { locations, loading: locationsLoading } = useStoreLocations();
  
  // Fetch general services for display on the page
  const { services: generalServices, loading: generalServicesLoading } = useServices(true, 'general');
  
  // Fetch product services for booking modal
  const { services: productServices, loading: productServicesLoading } = useServices(true, 'product');

  // If loading, show spinner
  if (locationsLoading || generalServicesLoading || productServicesLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading services and locations...</p>
        </div>
      </div>
    );
  }

  // FIXED: Open booking flow - skip location if already selected
  const openBookingFlow = (location?: StoreLocation) => {
    if (location) {
      setSelectedLocation(location);
      setBookingStep('service'); // Skip directly to service selection
    } else {
      setBookingStep('location'); // Start from location selection
    }
    setShowBookingModal(true);
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
        url: selectedLocation.calendlyUrl // ✅ Dynamic
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

  // Format general services for display
  const generalServicesFormatted = (generalServices || []).map((service) => ({
    id: service._id,
    title: service.serviceName,
    duration: `${service.duration} min`,
    price: `£${service.price}`,
    description: service.description || '',
    image: service.image || 'https://images.pexels.com/photos/5752254/pexels-photo-5752254.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: [] // API doesn't provide features, so we'll handle this in UI
  }));
  
  // Format product services for booking modal
  const productServicesFormatted = (productServices || []).map((service) => ({
    id: service._id,
    title: service.serviceName,
    duration: `${service.duration} min`,
    price: `£${service.price}`,
    description: service.description || '',
    image: service.image || 'https://images.pexels.com/photos/5752254/pexels-photo-5752254.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: [] // API doesn't provide features, so we'll handle this in UI
  }));

  const whyChooseUs = [
    { icon: Award, title: 'Expert Optometrists', description: 'Licensed professionals with years of experience.' },
    { icon: Eye, title: 'Advanced Technology', description: 'State-of-the-art diagnostic equipment.' },
    { icon: Users, title: 'Personalized Care', description: 'Tailored solutions for your unique needs.' },
    { icon: Shield, title: 'Quality Guarantee', description: 'Satisfaction guaranteed on all services.' }
  ];

  // Helper to get step index
  const getStepIndex = () => {
    switch(bookingStep) {
      case 'location': return 0;
      case 'service': return 1;
      case 'calendly': return 2;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28">
      
      {/* HERO SECTION - Enhanced */}
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
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              Comprehensive eye examinations and personalized care from our experienced team of optometrists.
            </p>
            <button
              onClick={() => openBookingFlow()} // No location passed
              className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-10 py-4 rounded-full font-light hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center space-x-3 group"
            >
              <Calendar className="h-5 w-5" />
              <span>Schedule Appointment</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
            </button>
          </div>
        </div>
      </section>

      {/* LOCATIONS - Enhanced UI */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Visit Our Locations</h2>
            <p className="text-gray-600 text-lg">Four convenient locations across New York</p>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {locations.map((location) => (
              <div
                key={location.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={location.image || 'https://via.placeholder.com/400x300?text=No+Image'}  // Fallback
                    alt={location.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="font-medium text-xl text-gray-900 mb-3">{location.name}</h3>
                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span className="font-light leading-tight">{location.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="font-light text-xs">{location.hours}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="font-light">{location.phone}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openBookingFlow(location)} // Pass location directly
                    className="w-full bg-gray-900 text-white py-3 rounded-lg font-light hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Book Here</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-1 group-hover:ml-0" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES - Enhanced Cards */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Professional eye care services tailored to your needs
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {generalServicesFormatted.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-3 text-white">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {service.price}
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-light flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        {service.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-medium text-xl text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">{service.description}</p>
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2.5">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-700">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="font-light">{feature}</span>
                        </div>
                      ))}
                      {service.features.length > 3 && (
                        <p className="text-xs text-gray-500 pl-8 font-light">
                          +{service.features.length - 3} more features
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - Enhanced */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <item.icon className="h-7 w-7 text-gray-700" />
                </div>
                <h3 className="font-medium text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light">Book Your Appointment</h2>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Enhanced Progress Steps */}
                <div className="flex items-center justify-between">
                  {['Location', 'Service', 'Schedule'].map((step, idx) => (
                    <div key={idx} className="flex items-center flex-1">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                          ${idx <= getStepIndex() 
                            ? 'bg-white text-gray-900 shadow-lg scale-110' 
                            : 'bg-white/20 text-white/70 scale-100'}`}>
                          {idx < getStepIndex() ? <Check className="h-5 w-5" /> : idx + 1}
                        </div>
                        <span className={`ml-3 text-sm font-light transition-all duration-300 ${
                          idx <= getStepIndex() ? 'text-white' : 'text-white/50'
                        }`}>{step}</span>
                      </div>
                      {idx < 2 && (
                        <div className="flex-1 mx-4">
                          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-white rounded-full transition-all duration-500"
                              style={{ width: idx < getStepIndex() ? '100%' : '0%' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Location Step - Enhanced */}
              {bookingStep === 'location' && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-light text-gray-900 mb-8">Choose Your Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        onClick={() => handleLocationSelect(location)}
                        className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden
                          ${selectedLocation?.id === location.id
                            ? 'border-gray-900 bg-gradient-to-br from-gray-50 to-white shadow-md'
                            : 'border-gray-200 hover:border-gray-400 bg-white'}`}
                      >
                        {selectedLocation?.id === location.id && (
                          <div className="absolute top-4 right-4">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                        <h4 className="font-medium text-lg text-gray-900 mb-3">{location.name}</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-start space-x-3">
                            <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                            <span className="font-light leading-tight">{location.address}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="font-light">{location.phone}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="font-light text-xs">{location.hours}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Step - Enhanced */}
              {bookingStep === 'service' && (
                <div className="animate-fadeIn">
                  <button
                    onClick={() => setBookingStep('location')}
                    className="text-gray-500 hover:text-gray-900 mb-6 text-sm font-light flex items-center transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                    Back to locations
                  </button>
                  <h3 className="text-2xl font-light text-gray-900 mb-8">Select Service Type</h3>
                  
                  {/* Show selected location */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 mb-8 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500 font-light">Selected Location</p>
                        <p className="text-gray-900 font-medium">{selectedLocation?.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {productServicesFormatted.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => handleServiceSelect(service.title)}
                        className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg relative
                          ${selectedService === service.title
                            ? 'border-gray-900 bg-gradient-to-br from-gray-50 to-white shadow-md'
                            : 'border-gray-200 hover:border-gray-400 bg-white'}`}
                      >
                        {selectedService === service.title && (
                          <div className="absolute top-6 right-6">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-4">
                            <h4 className="font-medium text-lg text-gray-900 mb-2">{service.title}</h4>
                            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">{service.description}</p>
                            {service.features && service.features.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {service.features.slice(0, 2).map((feature, idx) => (
                                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-light">
                                    {feature}
                                  </span>
                                ))}
                                {service.features.length > 2 && (
                                  <span className="text-xs text-gray-500 px-2 py-1">
                                    +{service.features.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-6 flex-shrink-0">
                            <div className="text-2xl font-light text-gray-900">{service.price}</div>
                            <div className="text-xs text-gray-500 mt-1">{service.duration}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule Step - Enhanced */}
              {bookingStep === 'calendly' && (
                <div className="animate-fadeIn">
                  <button
                    onClick={() => setBookingStep('service')}
                    className="text-gray-500 hover:text-gray-900 mb-6 text-sm font-light flex items-center transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                    Back to services
                  </button>
                  <h3 className="text-2xl font-light text-gray-900 mb-8">Your Information</h3>
                  
                  {/* Summary Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 mb-8 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Appointment Summary</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 font-light mb-1">Location</p>
                        <p className="text-gray-900 font-medium">{selectedLocation?.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{selectedLocation?.address}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-light mb-1">Service</p>
                        <p className="text-gray-900 font-medium">{selectedService}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {productServicesFormatted.find(s => s.title === selectedService)?.duration}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={bookingData.name}
                          onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light transition-all"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light transition-all resize-none"
                        placeholder="Any special requirements or concerns..."
                      />
                    </div>
                    
                    <button
                      onClick={handleBookingSubmit}
                      disabled={!bookingData.name || !bookingData.email}
                      className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white py-4 px-6 rounded-xl font-light hover:shadow-xl transform hover:-translate-y-0.5
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 
                               flex items-center justify-center space-x-3"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Continue to Schedule</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    
                    <p className="text-center text-xs text-gray-500">
                      You'll be redirected to Calendly to pick your preferred date and time
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FAQ SECTION */}
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
            {/* Question 1 */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                How do I book an appointment?
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                You can book an appointment by visiting our booking page, calling any of our three clinics directly, or visiting us in person. We recommend booking online for the fastest service and to see real-time availability.
              </p>
            </div>

            {/* Question 2 */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                What should I bring to my appointment?
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Please bring your current glasses or contact lenses, any previous prescriptions, a list of current medications, your NHS card or insurance details, and a form of ID. If you're having an eye test, avoid wearing contact lenses for at least 2 hours before your appointment.
              </p>
            </div>

            {/* Question 3 */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                How long does an eye examination take?
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                A comprehensive eye examination typically takes 30-45 minutes. This includes time for preliminary tests, the main examination, and discussing your results. If you're also selecting frames or discussing contact lenses, allow an additional 15-30 minutes.
              </p>
            </div>

            {/* Question 4 */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Do you accept NHS and private insurance?
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Yes, we accept NHS vouchers and work with most major private insurance providers. We're happy to help you understand your coverage and can provide receipts for insurance claims. Please bring your insurance details to your appointment.
              </p>
            </div>

            {/* Question 5 */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                How often should I have an eye test?
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                We recommend annual eye tests for most adults. If you're over 60, have diabetes, a family history of glaucoma, or other risk factors, you may need more frequent examinations. Children should have their eyes tested regularly, typically every 1-2 years.
              </p>
            </div>

            {/* Question 6 */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Can you help with emergency eye problems?
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Yes, we offer emergency eye care services during business hours. For urgent issues like sudden vision loss, eye injuries, or severe pain, please call us immediately. For after-hours emergencies, we can advise you on the best course of action or direct you to appropriate emergency services.
              </p>
            </div>

            {/* Question 7 */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Do you offer home visits or mobile services?
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                We can arrange home visits for patients who are unable to visit our clinics due to mobility issues or health conditions. Please contact us to discuss your specific needs and arrange a convenient time. Additional charges may apply for home visits.
              </p>
            </div>

            {/* Question 8 */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                What makes Optieye Care different from other opticians?
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                We're clinically led by a consultant ophthalmologist and focus on building long-term relationships with our patients. Our bespoke approach means we take time to understand your individual needs, lifestyle, and preferences. We also offer advanced technology like the iWellness OCT scan and welcome you to drop in for a chat and cup of tea anytime.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Still have questions? We're here to help.
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <button
                onClick={() => openBookingFlow()}
                className="bg-gray-900 text-white px-8 py-3 font-light hover:bg-gray-800 transition-all duration-300 inline-flex items-center justify-center space-x-2"
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

      {/* Add animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}