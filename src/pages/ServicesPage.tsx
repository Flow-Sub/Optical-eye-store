import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock, Users, Award, CheckCircle, Calendar, Phone, MapPin } from 'lucide-react';

// Calendly Popup Handler
const openCalendlyPopup = () => {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url: 'https://calendly.com/eyeoptical007/30min' });
  }
  return false;
};

export function ServicesPage() {
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
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

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
              onClick={openCalendlyPopup}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>Schedule Your Appointment</span>
            </button>
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

      {/* Insurance & Payment */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Insurance & Payment Options</h2>
              <p className="text-xl text-gray-600 mb-8">
                We accept most major insurance plans and offer flexible payment options to make quality eye care accessible.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Most major insurance plans accepted</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Flexible payment plans available</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">HSA/FSA cards welcome</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Senior and student discounts</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h3>
              <div className="space-y-4">
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
                  <div className="text-gray-700">
                    <div>Mon-Fri: 9:00 AM - 7:00 PM</div>
                    <div>Sat: 9:00 AM - 6:00 PM</div>
                    <div>Sun: 11:00 AM - 5:00 PM</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={openCalendlyPopup}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}