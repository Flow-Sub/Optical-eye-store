/* src/pages/HomePage.tsx */
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Star, Shield, Truck, Calendar, ShoppingBag, ChevronRight } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/Product/ProductCard';
import { Carousel, Card } from '../components/ui/apple-cards-carousel';
import { gsap } from 'gsap'; // Added for FlowingMenu

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=80',
  newArr1: 'https://img01.ztat.net/article/spp-media-p1/81ec8d9b0b8d436f8b932b32a1cc69f7/905c99d2a74b42a6a29644d6035f0e46.jpg?imwidth=762',
  newArr2: 'https://tuzzut.com/cdn/shop/files/InShot-20250107_104356623_800x.jpg?v=1736236753',
  bestSell1: 'https://t3.ftcdn.net/jpg/15/50/58/70/360_F_1550587027_Fp2eCN1WWDnVKCzN6F3rCOHnlkMSziZh.jpg',
  bestSell2: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
  storeInterior: 'https://images.adsttc.com/media/images/5012/a2fe/28ba/0d14/7d00/00b0/newsletter/stringio.jpg?1414224052',
  eyeTest: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80'
};

// FlowingMenu Component (Added from your code)
interface MenuItemProps {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items?: MenuItemProps[];
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({ items = [] }) => {
  return (
    <div className="w-full h-full overflow-hidden">
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ link, text, image }) => {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const marqueeRef = React.useRef<HTMLDivElement>(null);
  const marqueeInnerRef = React.useRef<HTMLDivElement>(null);

  const animationDefaults = { duration: 0.6, ease: 'expo' };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): 'top' | 'bottom' => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    const tl = gsap.timeline({ defaults: animationDefaults });
    tl.set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' })
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' })
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' });
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    const tl = gsap.timeline({ defaults: animationDefaults }) as any; // Type assertion for TimelineMax
    tl.to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }).to(marqueeInnerRef.current, {
      y: edge === 'top' ? '101%' : '-101%'
    });
  };

  const repeatedMarqueeContent = React.useMemo(() => {
    return Array.from({ length: 4 }).map((_, idx) => (
      <React.Fragment key={idx}>
        <span className="text-[#060010] uppercase font-normal text-[4vh] leading-[1.2] p-[1vh_1vw_0]">{text}</span>
        <div
          className="w-[200px] h-[7vh] my-[2em] mx-[2vw] p-[1em_0] rounded-[50px] bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      </React.Fragment>
    ));
  }, [text, image]);

  return (
    <div className="flex-1 relative overflow-hidden text-center shadow-[0_-1px_0_0_#fff]" ref={itemRef}>
      <a
        className="flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-semibold text-white text-[4vh] hover:text-[#060010] focus:text-white focus-visible:text-[#060010]"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </a>
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none bg-white translate-y-[101%]"
        ref={marqueeRef}
      >
        <div className="h-full w-[200%] flex" ref={marqueeInnerRef}>
          <div className="flex items-center relative h-full w-[200%] will-change-transform animate-marquee">
            {repeatedMarqueeContent}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dummy content component for carousel cards (adapted to eyewear theme) - MOVED UP TO FIX HOISTING
const EyewearDummyContent = ({ title, description }: { title: string; description: string }) => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"eyewear-dummy" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                Discover {title}.
              </span>{" "}
              {description} Crafted with precision lenses and lightweight materials for all-day comfort.
              Schedule an eye test today to find your perfect pair.
            </p>
            <img
              src="https://images.unsplash.com/photo-1571019616233-50a6a467b9b3?q=80&w=1000&auto=format&fit=crop"
              alt={`${title} mockup`}
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-6"
            />
          </div>
        );
      })}
    </>
  );
};

// Eyewear-themed data for the Apple-style carousel - NOW AFTER COMPONENT
const eyewearCarouselData = [
  {
    category: "Classic Collection",
    title: "Timeless Aviators",
    src: "https://shopmachete.com/cdn/shop/files/Screenshot_2024-07-24_at_10.11.34_AM_01801631-cfe7-498b-819d-6468b7ff00ae.png?v=1723465917&width=2560",
    content: <EyewearDummyContent title="Aviators" description="Iconic design meets modern comfort. Perfect for everyday wear." />,
  },
  {
    category: "Sunglasses",
    title: "Polarized Wayfarers",
    src: "https://assets.ajio.com/medias/sys_master/root/h0a/h38/13549010223134/-473Wx593H-460387302-black-MODEL.jpg",
    content: <EyewearDummyContent title="Wayfarers" description="UV protection with style. Ideal for sunny adventures." />,
  },
  {
    category: "Reading Glasses",
    title: "Elegant Round Frames",
    src: "https://fashionrazor.com/cdn/shop/products/5_H2e55bf90248b4d359e02df908eca62d3k.jpg?v=1598084350",
    content: <EyewearDummyContent title="Round Frames" description="Sophisticated style for focused reading sessions." />,
  },
  {
    category: "Sports",
    title: "Active Wraparounds",
    src: "https://cdn.thewirecutter.com/wp-content/media/2024/12/BEST-SPORT-SUNGLASSES-2048px-5885-3x2-1.jpg?auto=webp&quality=75&crop=4:3,smart&width=1024",
    content: <EyewearDummyContent title="Wraparounds" description="Durable and lightweight for your active lifestyle." />,
  },
  {
    category: "Designer",
    title: "Luxury Cat-Eye",
    src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <EyewearDummyContent title="Cat-Eye" description="Elevate your look with premium craftsmanship." />,
  },
  {
    category: "Kids",
    title: "Fun Geometric Shapes",
    src: "https://static.zennioptical.com/marketing/campaign/back_to_school/2025/TLC/250808-back-to-school-LP-hero-xxs.png",
    content: <EyewearDummyContent title="Geometric" description="Colorful and safe for young explorers." />,
  },
];

// Carousel Demo Component
export function EyewearCardsCarouselDemo() {
  const cards = eyewearCarouselData.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-8">
      <Carousel items={cards} />
    </div>
  );
}

// FlowingMenu Demo Data (Eyewear-themed)
const flowingMenuItems = [
  { link: '/collections/classic', text: 'Classic', image: 'https://shopmachete.com/cdn/shop/files/Screenshot_2024-07-24_at_10.11.34_AM_01801631-cfe7-498b-819d-6468b7ff00ae.png?v=1723465917&width=2560' },
  { link: '/collections/sunglasses', text: 'Sunglasses', image: 'https://assets.ajio.com/medias/sys_master/root/h0a/h38/13549010223134/-473Wx593H-460387302-black-MODEL.jpg' },
  { link: '/collections/reading', text: 'Reading', image: 'https://fashionrazor.com/cdn/shop/products/5_H2e55bf90248b4d359e02df908eca62d3k.jpg?v=1598084350' },
  { link: '/collections/sports', text: 'Sports', image: 'https://cdn.thewirecutter.com/wp-content/media/2024/12/BEST-SPORT-SUNGLASSES-2048px-5885-3x2-1.jpg?auto=webp&quality=75&crop=4:3,smart&width=1024' }
];

export function HomePage() {
  const { products, loading } = useProducts();
  // ✅ UPDATED: Filter specific products by name from Airtable
const targetProductNames = {
  newArrivals: ['Aurora – Light Tortoise', 'Reed – Matte Black'],
  bestsellers: ['Lennon – Transparent', 'Grace – Champagne']
};

const newArrivals = products.filter(p => 
  targetProductNames.newArrivals.some(name => p.name.includes(name.split(' – ')[0]))
).slice(0, 2); // Max 2

const bestsellers = products.filter(p => 
  targetProductNames.bestsellers.some(name => p.name.includes(name.split(' – ')[0]))
).slice(0, 2); // Max 2

const featuredProducts = products.slice(0, 4); // Keep original for Featured Collection

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  const heroSlides = [
    'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1920&q=80',
    'https://www.zennioptical.com/blog/wp-content/uploads/2017/09/black-and-white-glasses.jpg',
    'https://graziamagazine.com/us/wp-content/uploads/sites/15/2025/07/kylie-jenner-otra-eyewear-grandquist-collab-6.jpg',
    'https://media.oliverpeoples.com/LPdataCapture/2024/OP_JoinNewsletter_Overlay.jpg?impolicy=HB_parameters&sclw=0.4&sclh=0.4'
  ];

  // Auto-slide effect
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000); // Change slide every 5 seconds
    
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
      </section>

      {/* NEW ARRIVALS */}
      {/* NEW ARRIVALS */}
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12 animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">New Arrivals</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">Fresh styles just landed</p>
    </div>

    {loading ? (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    ) : newArrivals.length > 0 ? (
      <>
        <div className="grid md:grid-cols-2 gap-12">
          {newArrivals.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group">
              <div className="aspect-[4/5] bg-white rounded-lg overflow-hidden mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src={product.images[0] || 'https://via.placeholder.com/500'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-center">
                <h3 className="font-light text-gray-900 text-lg">{product.name}</h3>
                <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
        
        {/* ✅ ADD THIS - View All Link */}
        <div className="text-center mt-12">
          <Link
            to="/products?filter=new-arrivals"
            className="inline-flex items-center space-x-2 text-gray-900 font-medium hover:text-gray-600 transition-colors group"
          >
            <span>View All New Arrivals</span>
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </>
    ) : (
      <div className="text-center py-16 text-gray-500">
        <p>No new arrivals found. Add products named "Aurora" and "Reed" in Airtable.</p>
      </div>
    )}
  </div>
</section>

      {/* BESTSELLERS */}
{/* BESTSELLERS */}
<section className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12 animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">Bestsellers</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">Customer favorites</p>
    </div>

    <div className="grid md:grid-cols-2 gap-12">
      {bestsellers.length > 0 ? (
        bestsellers.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className="group">
            <div className="aspect-[4/5] bg-white rounded-lg overflow-hidden mb-6 shadow-sm group-hover:shadow-md transition-shadow">
              <img
                src={product.images[0] || 'https://via.placeholder.com/500'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="text-center">
              <h3 className="font-light text-gray-900 text-lg">{product.name}</h3>
              <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))
      ) : (
        <div className="col-span-2 text-center py-16 text-gray-500">
          <p>No bestsellers found. Add products named "Lennon" and "Grace" in Airtable.</p>
        </div>
      )}
    </div>
    
    {/* ✅ ADD THIS - View All Link */}
    {bestsellers.length > 0 && (
      <div className="text-center mt-12">
        <Link
          to="/products?filter=bestsellers"
          className="inline-flex items-center space-x-2 text-gray-900 font-medium hover:text-gray-600 transition-colors group"
        >
          <span>View All Bestsellers</span>
          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    )}
  </div>
</section>

      {/* NEW: Flowing Menu Collections (Added above SERVICES) */}
      <section className="py-20 bg-black"> {/* Updated: Changed bg-gray-50 to bg-black */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-3">Our Collections</h2> {/* Updated: text-gray-900 to text-white */}
            <p className="text-gray-300 max-w-2xl mx-auto">Hover over collections for a flowing preview of styles</p> {/* Updated: text-gray-600 to text-gray-300 */}
          </div>
          <div style={{ height: '600px', position: 'relative' }}>
            <FlowingMenu items={flowingMenuItems} />
          </div>
        </div>
      </section>

      {/* SERVICES */}
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
            {[
              { icon: Eye, title: 'Eye Examinations', desc: 'State-of-the-art equipment for accurate prescriptions.', link: '/appointments', cta: 'Book now', color: 'from-blue-500 to-blue-600' },
              { icon: Shield, title: 'Lens Care', desc: 'Professional cleaning, maintenance, and replacement.', link: '/services', cta: 'Learn more', color: 'from-green-500 to-green-600' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders over $150 with express options.', link: '/shipping', cta: 'View options', color: 'from-purple-500 to-purple-600' }
            ].map((service, i) => (
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

      {/* NEW: Apple-Style Eyewear Collections Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-4 font-sans">
              Explore Our Collections
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Dive into premium eyewear designs that blend style and function. Click to discover more.
            </p>
          </div>
          <EyewearCardsCarouselDemo />
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
              <p className="text-gray-600 mb-6">
                Your new favourite, family-friendly eye care specialist! Led by a consultant ophthalmologist, 
                our experienced team is proud to offer exceptional & affordable eye care for you and your family.
              </p>
              <div className="space-y-2 text-gray-600 mb-8">
                <p><strong>Address:</strong> 1 Regent Rd, Altrincham WA14 1RY</p>
                <p><strong>Phone:</strong> 0161 928 1891</p>
                <p><strong>Email:</strong> info@optieyecare.co.uk</p>
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