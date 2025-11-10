import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

interface VideoImageGridProps {
  videoUrl: string;
  imageUrl: string;
  productId: string;
}

export function VideoImageGrid({ videoUrl, imageUrl, productId }: VideoImageGridProps) {
  return (
    <section className="bg-white">
      <div className="w-full">
        <div className="grid md:grid-cols-2 gap-0">
          {/* First Container - Video with Text Overlay */}
          <div className="relative group">
            <div className="aspect-[4/5] bg-white overflow-hidden shadow-sm group-hover:shadow-md transition-shadow relative">
              {/* Video Loading State */}
              <div className="absolute bottom-4 right-4 z-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                onLoadedData={(e) => {
                  const loader = e.currentTarget.parentElement?.querySelector('.animate-spin')?.parentElement;
                  if (loader) loader.style.display = 'none';
                }}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
              {/* Text Overlay - Left Bottom */}
              <div className="absolute bottom-8 left-8 flex flex-col items-start text-white z-10 pointer-events-none">
                <h3 className="text-4xl md:text-5xl font-bold mb-2 tracking-wider">PRESCRIPTION</h3>
                <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider">GLASSES</h3>
                <p className="text-lg md:text-xl font-light mb-8">Clear Vision Meets Style</p>
                <Link
                  to="/products"
                  className="border-2 border-white text-white px-8 py-3 font-medium hover:bg-white hover:text-gray-900 transition-all duration-300 pointer-events-auto"
                >
                  SHOP
                </Link>
              </div>
            </div>
          </div>

          {/* Second Container - Image with Button */}
          <div className="relative group">
            <div className="aspect-[4/5] bg-white overflow-hidden shadow-sm group-hover:shadow-md transition-shadow relative">
              <Link to={`/products/${productId}`}>
                <img
                  src={imageUrl}
                  alt="Eye care"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
            </div>
            
            {/* Book an eye test button */}
            <Link
              to="/appointments"
              className="absolute bottom-8 left-4 bg-gray-900 text-white px-4 py-2 text-sm font-light hover:bg-gray-800 transition-all duration-300 flex items-center space-x-2 shadow-lg z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <Calendar className="h-4 w-4" />
              <span>Book an eye test</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

