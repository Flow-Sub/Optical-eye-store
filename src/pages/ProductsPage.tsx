import React, { useState, useEffect } from 'react';
import { ProductGrid } from '../components/Product/ProductGrid';
import { ProductFilters } from '../components/Product/ProductFilters';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import { RefreshCw, AlertCircle, ShoppingBag, TrendingUp, Sparkles, Package, Grid3x3 } from 'lucide-react';

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

  // Extract unique values for filter options
  const filterOptions = {
    categories: Array.from(new Set(products.map(p => p.category))),
    brands: Array.from(new Set(products.map(p => p.brand))),
    priceRange: [0, 1000000] as [number, number]
  };

  useEffect(() => {
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    filtered = filtered.filter(product => 
      product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-t-4 border-blue-600 mx-auto"></div>
            <ShoppingBag className="h-10 w-10 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Products</h3>
          <p className="text-gray-600">Fetching the latest eyewear collection...</p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="text-center max-w-lg bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Oops! Something Went Wrong</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={refetch}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 inline-flex items-center space-x-3 shadow-lg transform hover:scale-105 transition-all"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-lg bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          <div className="bg-gradient-to-br from-gray-100 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">No Products Yet</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Our collection is being curated. Check back soon for premium eyewear!
          </p>
          <button
            onClick={refetch}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 inline-flex items-center space-x-3 shadow-lg transform hover:scale-105 transition-all"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -ml-36 -mb-36"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-5 py-2 flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-yellow-300 font-bold text-sm uppercase tracking-wider">Premium Collection</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-100">
              Shop Eyewear
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              Discover our curated collection of premium frames, designer sunglasses, and exclusive accessories
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white border-opacity-30 transform hover:scale-105 transition-all shadow-lg">
                <div className="flex items-center space-x-3">
                  <Package className="h-8 w-8 text-blue-200" />
                  <div className="text-left">
                    <p className="text-sm text-blue-200 font-semibold uppercase tracking-wide">Products</p>
                    <p className="text-3xl font-extrabold">{products.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white border-opacity-30 transform hover:scale-105 transition-all shadow-lg">
                <div className="flex items-center space-x-3">
                  <Grid3x3 className="h-8 w-8 text-purple-200" />
                  <div className="text-left">
                    <p className="text-sm text-purple-200 font-semibold uppercase tracking-wide">Categories</p>
                    <p className="text-3xl font-extrabold">{filterOptions.categories.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white border-opacity-30 transform hover:scale-105 transition-all shadow-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-green-200" />
                  <div className="text-left">
                    <p className="text-sm text-green-200 font-semibold uppercase tracking-wide">Brands</p>
                    <p className="text-3xl font-extrabold">{filterOptions.brands.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                filters={filters}
                onFilterChange={setFilters}
                options={filterOptions}
                isOpen={isFiltersOpen}
                onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2 flex items-center">
                    {filteredProducts.length === products.length ? (
                      <>
                        <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
                        All Products
                      </>
                    ) : (
                      <>
                        <Grid3x3 className="h-6 w-6 text-blue-600 mr-2" />
                        Filtered Results
                      </>
                    )}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <p className="text-gray-600 font-medium">
                        Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> of{' '}
                        <span className="font-bold text-gray-900">{products.length}</span> products
                      </p>
                    </div>
                    <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200">
                      from Airtable
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={refetch}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-all font-bold"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
                <div className="bg-gradient-to-br from-gray-100 to-blue-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <AlertCircle className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-4">No Matches Found</h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  We couldn't find any products matching your current filters. Try adjusting your criteria.
                </p>
                <button
                  onClick={() => setFilters({
                    category: '',
                    brand: '',
                    minPrice: 0,
                    maxPrice: 1000000,
                    sortBy: 'name'
                  })}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold shadow-lg transform hover:scale-105 transition-all inline-flex items-center space-x-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}