/* src/pages/HomePage.jsx */
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Star, Shield, Truck, Calendar, ShoppingBag, ChevronRight } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/Product/ProductCard';

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=80',
  // newArr1: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
  newArr1: 'https://img01.ztat.net/article/spp-media-p1/81ec8d9b0b8d436f8b932b32a1cc69f7/905c99d2a74b42a6a29644d6035f0e46.jpg?imwidth=762',
  newArr2: 'https://tuzzut.com/cdn/shop/files/InShot-20250107_104356623_800x.jpg?v=1736236753',
  bestSell1: 'https://t3.ftcdn.net/jpg/15/50/58/70/360_F_1550587027_Fp2eCN1WWDnVKCzN6F3rCOHnlkMSziZh.jpg',
  bestSell2: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
  storeInterior: 'https://images.adsttc.com/media/images/5012/a2fe/28ba/0d14/7d00/00b0/newsletter/stringio.jpg?1414224052',
  eyeTest: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80'
};

export function HomePage() {
    const { products, loading } = useProducts();
    const featuredProducts = products.slice(0, 4);
    const newArrivals = products.slice(0, 2);
    const bestsellers = products.slice(2, 4);

    // ADD THIS - Hero Slider State
    const [currentSlide, setCurrentSlide] = React.useState(0);
    
    const heroSlides = [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1920&q=80',
      'https://i.shgcdn.com/f2d5f37c-1280-41fe-ae6d-f9bd80a11448/-/format/auto/-/quality/normal/',
      'https://image5.cdnsbg.com/cms.smartbuyglasses.com/wp-content/uploads/2023/12/Models-1.png',
      'https://www.nifties-eyewear.com/media/uwqf055u/ni8560_col6621_2_medres.jpg?width=1000&format=webp&quality=85&v=1dc052d2b0f6a50'
    ];

    // Auto-slide effect
    React.useEffect(() => {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000); // Change slide every 5 seconds
      
      return () => clearInterval(timer);
    }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative bg-black min-h-screen flex items-center pt-20">
        {/* Background Slider */}
        <div className="absolute inset-0 overflow-hidden">
          {heroSlides.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
        </div>

        {/* Content - Centered */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 animate-fadeIn">
              Time to Sharpen Up
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Premium eyewear designed for modern life. Discover frames that combine
              exceptional craftsmanship with contemporary style.
            </p>
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
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <ChevronRight className="h-6 w-6 text-white rotate-90" />
        </div> */}
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900">New Arrivals</h2>
            <Link to="/products?filter=new" className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1">
              <span>View all</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-12">
              {newArrivals.map((_, i) => (
                <div key={i} className="group">
                  <div className="aspect-[4/5] bg-white rounded-lg overflow-hidden mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={i === 0 ? IMAGES.newArr1 : IMAGES.newArr2}
                      alt="New arrival"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-light text-gray-900 text-lg">{i === 0 ? 'Aurora – Light Tortoise' : 'Reed – Matte Black'}</h3>
                    <p className="text-gray-600 mt-1">${i === 0 ? '169' : '149'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900">Bestsellers</h2>
            <Link to="/products?filter=bestsellers" className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1">
              <span>View all</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {bestsellers.map((_, i) => (
              <div key={i} className="group">
                <div className="aspect-[4/5] bg-white rounded-lg overflow-hidden mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src={i === 0 ? IMAGES.bestSell1 : IMAGES.bestSell2}
                    alt="Bestseller"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-light text-gray-900 text-lg">{i === 0 ? 'Lennon – Transparent' : 'Grace – Champagne'}</h3>
                  <p className="text-gray-600 mt-1">${i === 0 ? '159' : '179'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive eye-care services tailored to your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Eye, title: 'Eye Examinations', desc: 'State-of-the-art equipment for accurate prescriptions.', link: '/appointments', cta: 'Book now' },
              { icon: Shield, title: 'Lens Care', desc: 'Professional cleaning, maintenance, and replacement.', link: '/services', cta: 'Learn more' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders over $150 with express options.', link: '/shipping', cta: 'View options' }
            ].map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-xl text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <service.icon className="h-7 w-7 text-gray-700" />
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{service.desc}</p>
                <Link to={service.link} className="text-sm font-light text-gray-900 hover:text-gray-700 flex items-center justify-center space-x-1">
                  <span>{service.cta}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">Featured Collection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Curated frames blending style, comfort, and quality</p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">Customer Reviews</h2>
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />)}
              <span className="text-sm text-gray-600 ml-2">4.9/5 from 500+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', comment: 'The perfect frames! Great quality and the team helped me find exactly what I was looking for.' },
              { name: 'Michael Chen', comment: 'Professional service and excellent eye care. My prescription is spot on and the frames are comfortable.' },
              { name: 'Emily Rodriguez', comment: 'Best optical-store experience. Beautiful frames, knowledgeable staff, and fair prices.' }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />)}</div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{t.comment}"</p>
                <p className="font-light text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">Verified customer</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-4">Stay in the loop</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">Subscribe for new collections, exclusive offers, and eye-care tips.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-5 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-white text-sm"
            />
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-light hover:bg-gray-100 transition-colors text-sm">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-4">By subscribing you agree to our Privacy Policy.</p>
        </div>
      </section>

      {/* STORE INFO */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">Visit Our Store</h2>
              <p className="text-gray-600 mb-6">Experience our premium eyewear in person. Our expert staff is ready to help you find the perfect frames.</p>
              <div className="space-y-2 text-gray-600 mb-8">
                <p><strong>Address:</strong> 123 Vision Street, City, ST 12345</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
                <p><strong>Email:</strong> hello@opticalstore.com</p>
              </div>
              <Link
                to="/appointments"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-light hover:bg-gray-800 transition-colors inline-flex items-center space-x-2 text-sm"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Appointment</span>
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src={IMAGES.storeInterior} alt="Store interior" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}