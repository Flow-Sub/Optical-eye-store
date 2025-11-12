import React from 'react';
import { Eye, Facebook, Twitter, Instagram, Mail, Phone, MapPin, ChevronRight, Clock } from 'lucide-react';
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
                  Opti Eye Care
                </span>
                <span className="text-xs text-gray-400 -mt-1 font-light">Vision Perfected</span>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed font-light">
              Your new favourite, family-friendly eye care specialist! Led by a consultant ophthalmologist, 
              offering exceptional & affordable eye care for you and your family.
            </p>
            <div className="flex space-x-4">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/optieyecareuk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative group"
                aria-label="Visit our Instagram page"
              >
                <div className="absolute inset-0 bg-white/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
                <Instagram className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer transition-colors relative z-10" />
              </a>

              {/* Facebook */}
              <a 
                href="https://www.facebook.com/optieye/?fref=ts#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative group"
                aria-label="Visit our Facebook page"
              >
                <div className="absolute inset-0 bg-white/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
                <Facebook className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer transition-colors relative z-10" />
              </a>

              {/* Twitter */}
              <a 
                href="https://twitter.com/optieyecare" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative group"
                aria-label="Visit our Twitter page"
              >
                <div className="absolute inset-0 bg-white/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
                <Twitter className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer transition-colors relative z-10" />
              </a>
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
                'Enhanced Eye Disease Screening',
                'OCT Scans',
                'Contact Lens Trials & Fitting',
                'Free NHS Sight Tests',
                'Home Visit Eye Tests',
                'Children\'s Consultations',
                'Private Consultations'
              ].map((service) => (
                <li key={service}>
                  <Link to="/services" className="text-sm text-gray-300 hover:text-white transition-colors font-light flex items-start group">
                    <ChevronRight className="h-3 w-3 mr-1 mt-1 opacity-70 group-hover:opacity-100 flex-shrink-0" />
                    <span>{service}</span>
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
                <a 
                  href="https://maps.google.com/?q=1+Regent+Rd,+Altrincham+WA14+1RY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white transition-colors font-light"
                >
                  1 Regent Rd, Altrincham<br />WA14 1RY, United Kingdom
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a href="tel:01619281891" className="text-sm text-gray-300 hover:text-white transition-colors font-light">
                  0161 928 1891
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a href="mailto:admin@optieye.com" className="text-sm text-gray-300 hover:text-white transition-colors font-light">
                  admin@optieye.com
                </a>
              </div>
            </div>
            
            {/* Store Hours */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-white font-normal">Store Hours</p>
              </div>
              <div className="text-xs text-gray-400 space-y-1.5 font-light">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sunday</span>
                  <span className="text-gray-400">Closed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Monday - Thursday</span>
                  <span className="text-white">10am - 4:30pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Friday</span>
                  <span className="text-white">10am - 4pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Saturday</span>
                  <span className="text-white">10am - 4pm</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 italic">
                *Free NHS sight tests for eligible patients, children & over 60's
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm font-light order-2 md:order-1 mt-4 md:mt-0">
            © 2024 Opti Eye Care. All rights reserved.
          </p>
          <div className="flex space-x-6 order-1 md:order-2">
            {['Privacy Policy', 'Terms of Service', 'Return Policy'].map((item) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase().replace(/ /g, '-')}`}
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