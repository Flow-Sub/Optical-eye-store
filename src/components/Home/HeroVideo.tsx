import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ShoppingBag } from 'lucide-react';

interface HeroVideoProps {
  videoUrl: string;
}

export function HeroVideo({ videoUrl }: HeroVideoProps) {
  return (
    <section className="relative bg-black min-h-screen flex items-center pt-20">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Buttons - Bottom Centered */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-2xl px-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="bg-white text-gray-900 px-8 py-4 font-medium hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Shop All Frames</span>
          </Link>
          <Link
            to="/appointments"
            className="border-2 border-white text-white px-8 py-4 font-light hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm"
          >
            <Calendar className="h-5 w-5" />
            <span>Book Eye Test</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

