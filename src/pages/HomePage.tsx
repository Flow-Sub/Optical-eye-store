import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Star, Shield, Truck, Users, ArrowRight, Calendar, ShoppingBag } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/Product/ProductCard';

export function HomePage() {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                See the World
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                  Clearly
                </span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Premium eyewear, expert care, and personalized service. 
                Discover frames that match your style and lenses that enhance your vision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Shop Frames</span>
                </Link>
                <Link
                  to="/appointments"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Eye Exam</span>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 absolute -top-8 -left-8 w-32 h-32"></div>
              <div className="aspect-square bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-20 absolute -bottom-4 -right-4 w-24 h-24"></div>
              <img
                src="https://cdn.vectorstock.com/i/500p/27/46/optic-shop-composition-vector-44342746.jpg"
                alt="Premium Eyewear"
                className="rounded-2xl shadow-2xl relative z-10 -right-16"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose OpticalStore?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge technology with personalized care to deliver the best vision solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Eye,
                title: 'Expert Eye Care',
                description: 'Comprehensive eye exams by licensed optometrists with state-of-the-art equipment.'
              },
              {
                icon: Star,
                title: 'Premium Quality',
                description: 'Only the finest frames and lenses from trusted brands worldwide.'
              },
              {
                icon: Shield,
                title: 'Satisfaction Guarantee',
                description: '90-day satisfaction guarantee on all frames and lenses with easy returns.'
              },
              {
                icon: Truck,
                title: 'Fast Delivery',
                description: 'Free shipping on orders over $150 with express delivery options available.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Collection</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular frames, carefully selected for style, comfort, and quality.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading featured products...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/products"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <span>View All Products</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Complete Eye Care Services</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                From comprehensive eye exams to specialized fittings, our experienced team 
                provides personalized care for all your vision needs.
              </p>
              
              <div className="space-y-6">
                {[
                  'Comprehensive Eye Examinations',
                  'Contact Lens Fittings & Training',
                  'Frame Selection & Styling',
                  'Lens Replacement & Repairs',
                  'Vision Therapy Consultations'
                ].map((service, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">{service}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to="/appointments"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Schedule Appointment</span>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.pexels.com/photos/5752254/pexels-photo-5752254.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Eye Examination"
                  className="rounded-lg"
                />
                <img
                  src="https://t4.ftcdn.net/jpg/03/04/53/79/360_F_304537986_2fL7V8CIke4NpW6QCugihh3Vr5dmJl6C.jpg"
                  alt="Frame Selection"
                  className="rounded-lg mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
              <span className="text-gray-600 ml-2">4.9 out of 5 from 500+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                rating: 5,
                comment: 'Amazing service! The staff helped me find the perfect frames and my prescription glasses were ready in just 2 days.',
                avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
              },
              {
                name: 'Michael Chen',
                rating: 5,
                comment: 'The eye exam was thorough and the optometrist explained everything clearly. Great selection of frames too!',
                avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100'
              },
              {
                name: 'Emily Rodriguez',
                rating: 5,
                comment: 'Best optical store in town! Professional service, competitive prices, and beautiful frames. Highly recommended!',
                avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{testimonial.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}