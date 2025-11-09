import React from 'react';
import { Eye, Facebook, Twitter, Instagram, Mail, Phone, MapPin, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Subtle top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* BRAND SECTION - BIG BOLD MODERN */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="space-y-6">
            <Link to="/" className="block group">
              <div className="flex items-center space-x-3 mb-2">
                <Eye className="h-10 w-10 text-white" />
              </div>
              
              {/* BIG BOLD BRAND NAME */}
              <h2 className="text-5xl font-black text-white mb-2 leading-none tracking-tight">
                OPTI EYE CARE
              </h2>
              
              {/* TAGLINE */}
              <p className="text-sm text-gray-400 uppercase tracking-widest font-light">
                Vision Perfected
              </p>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed">
              Your new favourite, family-friendly eye care specialist! Led by a consultant ophthalmologist, 
              offering exceptional & affordable eye care for you and your family.
            </p>

            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/optieyecareuk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              {[Facebook, Twitter].map((Icon, index) => (
                <div 
                  key={index}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"
                >
                  <Icon className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wide">Shop</h3>
            <ul className="space-y-3">
              {[
                { name: 'All Frames', href: '/products' },
                { name: 'New Arrivals', href: '/products?filter=new' },
                { name: 'Bestsellers', href: '/products?filter=bestsellers' },
                { name: 'Prescription Glasses', href: '/products?category=prescription' },
                { name: 'Sunglasses', href: '/products?category=sunglasses' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <ChevronRight className="h-4 w-4 mr-1 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wide">Services</h3>
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
                  <Link 
                    to="/services" 
                    className="text-gray-400 hover:text-white transition-colors flex items-start group text-sm"
                  >
                    <span className="text-white mr-2">•</span>
                    <span>{service}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wide">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                <a 
                  href="https://maps.google.com/?q=1+Regent+Rd,+Altrincham+WA14+1RY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  1 Regent Rd, Altrincham<br />WA14 1RY, United Kingdom
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-white flex-shrink-0" />
                <a href="tel:01619281891" className="text-gray-400 hover:text-white transition-colors">
                  0161 928 1891
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-white flex-shrink-0" />
                <a href="mailto:info@optieyecare.co.uk" className="text-gray-400 hover:text-white transition-colors">
                  info@optieyecare.co.uk
                </a>
              </div>
            </div>
            
            {/* Store Hours */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-white" />
                <p className="text-white font-bold">Store Hours</p>
              </div>
              <div className="text-sm text-gray-400 space-y-2">
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-white">Closed</span>
                </div>
                <div className="flex justify-between">
                  <span>Mon - Thu</span>
                  <span className="text-white">10am - 4:30pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span className="text-white">10am - 4pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white">10am - 4pm</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 italic">
                *Free NHS sight tests for eligible patients, children & over 60's
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm order-2 md:order-1 mt-4 md:mt-0">
            © 2024 Opti Eye Care. All rights reserved.
          </p>
          <div className="flex space-x-6 order-1 md:order-2">
            {['Privacy Policy', 'Terms of Service', 'Return Policy'].map((item) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-gray-400 hover:text-white text-sm transition-colors"
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