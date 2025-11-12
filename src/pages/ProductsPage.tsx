import React, { useState, useEffect } from 'react';
import { ProductGrid } from '../components/Product/ProductGrid';
import { ProductFilters } from '../components/Product/ProductFilters';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import { RefreshCw, AlertCircle, ShoppingBag, Package, Grid3x3, TrendingUp } from 'lucide-react';

export function ProductsPage() {
  const { products, loading, error, refetch } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 1000000,
    sortBy: 'name'
  });

  const filterOptions = {
    categories: Array.from(new Set(products.map(p => p.category))),
    brands: Array.from(new Set(products.map(p => p.brand))),
    priceRange: [0, 1000000] as [number, number]
  };

  useEffect(() => {
    let filtered = [...products];

    if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
    if (filters.brand) filtered = filtered.filter(p => p.brand === filters.brand);
    filtered = filtered.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    switch (filters.sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  /* ────────────────────── LOADING ────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-6"></div>
          <h3 className="text-2xl font-light text-gray-900">Loading Products</h3>
          <p className="text-gray-600 mt-2">Fetching the latest collection...</p>
        </div>
      </div>
    );
  }

  /* ────────────────────── ERROR ────────────────────── */
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-light text-gray-900 mb-4">Something Went Wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={refetch}
            className="bg-gray-900 text-white px-8 py-3.5 font-light hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-light text-gray-900 mb-4">No Products Yet</h2>
          <p className="text-gray-600 mb-6">Our collection is being curated. Check back soon!</p>
          <button
            onClick={refetch}
            className="bg-gray-900 text-white px-8 py-3.5 font-light hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* HERO - Full Width Video */}
      <section className="bg-white">
        {/* Video Hero - Full Width, No Padding */}
        <div className="relative w-full aspect-video overflow-hidden">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src="https://res.cloudinary.com/dfkbgktjy/video/upload/v1762918624/ETNIA_BNC_24_v3_16x9_refxc3.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* COMMENTED OUT - Original Text & Stats Section
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 mb-6">
              Shop Eyewear
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Discover our curated collection of premium frames, designer sunglasses, and exclusive accessories.
            </p>

            Stats
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <p className="text-3xl font-light text-gray-900">{products.length}</p>
                <p className="text-sm text-gray-600">Products</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-light text-gray-900">{filterOptions.categories.length}</p>
                <p className="text-sm text-gray-600">Categories</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-light text-gray-900">{filterOptions.brands.length}</p>
                <p className="text-sm text-gray-600">Brands</p>
              </div>
            </div>
          </div>
        </div>
        */}
      </section>

      {/* MAIN CONTENT */}
      {/* ───── FULL‑WIDTH FILTER + GRID ───── */}
      <section className="py-16 bg-gray-50">
        {/* Remove max-w-7xl → full width */}
        <div className="w-full">

          {/* Optional inner padding – keeps content from touching screen edges */}
          <div className="px-4 sm:px-6 lg:px-8">

            {/* Flex row – filters on left, grid on right */}
            <div className="flex flex-col lg:flex-row gap-12">

              {/* FILTERS – fixed width, sticky */}
              <aside className="lg:w-80">
                <div className="sticky top-24">
                  <ProductFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    options={filterOptions}
                    isOpen={isFiltersOpen}
                    onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
                  />
                </div>
              </aside>

              {/* PRODUCTS GRID – takes remaining space */}
              <main className="flex-1 min-w-0">
                {/* Results Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900">
                      {filteredProducts.length === products.length ? 'All Products' : 'Filtered Results'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
                    </p>
                  </div>
                  <button
                    onClick={refetch}
                    className="bg-gray-900 text-white px-6 py-3 font-light hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
                  >
                    <RefreshCw className="h-5 w-5" />
                    <span>Refresh</span>
                  </button>
                </div>

                {/* Grid or Empty State */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-white p-16 rounded-xl text-center shadow-sm">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-light text-gray-900 mb-2">No Products Found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      We couldn't find any products matching your criteria. Try adjusting your filters.
                    </p>
                    <button
                      onClick={() => setFilters({
                        category: '', brand: '', minPrice: 0, maxPrice: 1000000, sortBy: 'name'
                      })}
                      className="bg-gray-900 text-white px-6 py-3 font-light hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
                    >
                      <RefreshCw className="h-5 w-5" />
                      <span>Clear Filters</span>
                    </button>
                  </div>
                ) : (
                  <ProductGrid products={filteredProducts} />
                )}
              </main>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}