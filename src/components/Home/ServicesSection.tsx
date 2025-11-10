import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Shield, Truck, ChevronRight } from 'lucide-react';

const services = [
  { 
    icon: Eye, 
    title: 'Eye Examinations', 
    desc: 'State-of-the-art equipment for accurate prescriptions.', 
    link: '/appointments', 
    cta: 'Book now', 
    color: 'from-blue-500 to-blue-600' 
  },
  { 
    icon: Shield, 
    title: 'Lens Care', 
    desc: 'Professional cleaning, maintenance, and replacement.', 
    link: '/services', 
    cta: 'Learn more', 
    color: 'from-green-500 to-green-600' 
  },
  { 
    icon: Truck, 
    title: 'Fast Delivery', 
    desc: 'Free shipping on orders over £150 with express options.', 
    link: '/shipping', 
    cta: 'View options', 
    color: 'from-purple-500 to-purple-600' 
  }
];

export function ServicesSection() {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Optional: Subtle gradient overlay for modern depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 relative after:absolute after:left-1/2 after:transform after:-translate-x-1/2 after:bottom-0 after:w-16 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-purple-600">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Comprehensive eye-care services tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div 
              key={i} 
              className="group bg-white p-10 rounded-2xl text-center hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-500 transform hover:scale-[1.02] border border-transparent hover:border-gradient-to-r hover:from-blue-100 hover:to-transparent relative overflow-hidden animate-fadeIn"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icon Circle - Larger with gradient bg */}
              <div className={`w-20 h-20 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                <service.icon className="h-8 w-8 text-white" />
              </div>
              
              {/* Title - Bolder and larger */}
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              
              {/* Description - Larger text, better spacing */}
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
                {service.desc}
              </p>
              
              {/* CTA - Modern button style */}
              <Link 
                to={service.link} 
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-900 bg-transparent border-2 border-gray-200 rounded-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent hover:border-blue-300 hover:text-blue-600 transition-all duration-300 group-hover:underline underline-offset-4"
              >
                <span>{service.cta}</span>
                <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

