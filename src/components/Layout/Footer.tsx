import React from 'react';
import { Eye, Facebook, Twitter, Instagram, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
      {/* Glossy top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-sm"></div>
                <Eye className="h-8 w-8 text-white relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-light text-white tracking-wide">
                  OpticalStore
                </span>
                <span className="text-xs text-gray-400 -mt-1 font-light">Vision Perfected</span>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed font-light">
              Premium eyewear and professional eye care services. 
              Experience clarity and style with our curated collections.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
                  <Icon className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer transition-colors relative z-10" />
                </div>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-light text-white mb-6 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-3">
              {[
                { name: 'All Frames', href: '/products' },
                { name: 'New Arrivals', href: '/products?filter=new' },
                { name: 'Bestsellers', href: '/products?filter=bestsellers' },
                { name: 'Prescription Glasses', href: '/products?category=prescription' },
                { name: 'Sunglasses', href: '/products?category=sunglasses' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-sm text-gray-300 hover:text-white transition-colors font-light flex items-center group">
                    <span>{item.name}</span>
                    <ChevronRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-light text-white mb-6 uppercase tracking-wider">Services</h3>
            <ul className="space-y-3">
              {[
                'Eye Examinations',
                'Contact Lens Fitting',
                'Frame Adjustments',
                'Lens Replacement',
                'Repairs & Maintenance'
              ].map((service) => (
                <li key={service}>
                  <Link to="/services" className="text-sm text-gray-300 hover:text-white transition-colors font-light flex items-center group">
                    <span>{service}</span>
                    <ChevronRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h3 className="text-sm font-light text-white mb-6 uppercase tracking-wider">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-300 font-light">123 Vision Street, City, State 12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-300 font-light">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-300 font-light">info@opticalstore.com</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-300 font-light mb-2">
                <strong className="font-normal text-white">Store Hours</strong>
              </p>
              <div className="text-xs text-gray-400 space-y-1 font-light">
                <p>Mon-Fri: 9:00 AM - 7:00 PM</p>
                <p>Saturday: 9:00 AM - 6:00 PM</p>
                <p>Sunday: 11:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm font-light order-2 md:order-1 mt-4 md:mt-0">
            © 2024 OpticalStore. All rights reserved.
          </p>
          <div className="flex space-x-6 order-1 md:order-2">
            {['Privacy Policy', 'Terms of Service', 'Return Policy'].map((item) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase().replace(' ', '-')}`}
                className="text-gray-400 hover:text-white text-sm font-light transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}