/* src/pages/HomePage.tsx */
import { useProducts } from '../hooks/useProducts';
import { HeroVideo } from '../components/Home/HeroVideo';
import { VideoImageGrid } from '../components/Home/VideoImageGrid';
import { FeaturedCollection } from '../components/Home/FeaturedCollection';
// import { FlowingMenuSection } from '../components/Home/FlowingMenuSection';
import { ServicesSection } from '../components/Home/ServicesSection';
import { TestimonialsSection } from '../components/Home/TestimonialsSection';
import { NewsletterSection } from '../components/Home/NewsletterSection';
import { StoreInfoSection } from '../components/Home/StoreInfoSection';

// FlowingMenu Demo Data (Eyewear-themed) - All navigate to products page
// const flowingMenuItems = [
//   { link: '/products', text: 'Classic', image: 'https://shopmachete.com/cdn/shop/files/Screenshot_2024-07-24_at_10.11.34_AM_01801631-cfe7-498b-819d-6468b7ff00ae.png?v=1723465917&width=2560' },
//   { link: '/products', text: 'Sunglasses', image: 'https://assets.ajio.com/medias/sys_master/root/h0a/h38/13549010223134/-473Wx593H-460387302-black-MODEL.jpg' },
//   { link: '/products', text: 'Reading', image: 'https://fashionrazor.com/cdn/shop/products/5_H2e55bf90248b4d359e02df908eca62d3k.jpg?v=1598084350' },
//   { link: '/products', text: 'Sports', image: 'https://cdn.thewirecutter.com/wp-content/media/2024/12/BEST-SPORT-SUNGLASSES-2048px-5885-3x2-1.jpg?auto=webp&quality=75&crop=4:3,smart&width=1024' }
// ];

export function HomePage() {
  const { products, loading } = useProducts();
  
  // Filter products for different sections
const targetProductNames = {
  newArrivals: ['Aurora – Light Tortoise', 'Reed – Matte Black'],
};

const newArrivals = products.filter(p => 
  targetProductNames.newArrivals.some(name => p.name.includes(name.split(' – ')[0]))
  ).slice(0, 2);

  const featuredProducts = products.slice(0, 4);

  // URLs for VideoImageGrid
  const videoUrl = 'https://sfo3.digitaloceanspaces.com/optica-stock-images-storage/1762735379725_framer.mp4';
  const imageUrl = 'https://optica-stock-images-storage.sfo3.digitaloceanspaces.com/1762714346077_navy-medicine-Dpjx9BiTftQ-unsplash.jpg';
  const heroVideoUrl = 'https://sfo3.digitaloceanspaces.com/optica-stock-images-storage/1762713612685_homepagevideo.mp4';

  // Get product ID for second container
  const secondProductId = newArrivals.length > 1 ? newArrivals[1].id : 'default';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Video Section */}
      <HeroVideo videoUrl={heroVideoUrl} />

      {/* Video & Image Grid Section - Always show */}
      <VideoImageGrid 
        videoUrl={videoUrl} 
        imageUrl={imageUrl} 
        productId={secondProductId}
      />

      {/* Featured Collection */}
      <FeaturedCollection products={featuredProducts} loading={loading} />

      {/* Flowing Menu Collections - COMMENTED OUT */}
      {/* <FlowingMenuSection items={flowingMenuItems} /> */}

      {/* Services */}
      <ServicesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Store Info */}
      <StoreInfoSection />
    </div>
  );
}
