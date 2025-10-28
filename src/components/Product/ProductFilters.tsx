import React from 'react';
import { Filter, X, ChevronDown, DollarSign, Tag, Grid3x3, ArrowUpDown } from 'lucide-react';

interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
}

interface ProductFiltersProps {
  filters: {
    category: string;
    brand: string;
    minPrice: number;
    maxPrice: number;
    sortBy: string;
  };
  onFilterChange: (filters: any) => void;
  options: FilterOptions;
  isOpen: boolean;
  onToggle: () => void;
}

export function ProductFilters({ filters, onFilterChange, options, isOpen, onToggle }: ProductFiltersProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 1000000,
      sortBy: 'name'
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.brand,
    filters.minPrice > 0,
    filters.maxPrice < 1000000,
  ].filter(Boolean).length;

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={onToggle}
        className="lg:hidden flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 relative"
      >
        <Filter className="h-5 w-5" />
        <span className="font-semibold">Filters</span>
        {activeFiltersCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-white" />
                <h3 className="text-lg font-bold text-white">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearFilters}
                  className="text-sm text-white hover:text-blue-100 font-semibold underline"
                >
                  Clear all
                </button>
                <button
                  onClick={onToggle}
                  className="lg:hidden p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Category Filter */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Grid3x3 className="h-5 w-5 text-blue-600" />
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Category</label>
              </div>
              <div className="space-y-3">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={filters.category === ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-blue-600 font-medium transition-colors">
                    All Categories
                  </span>
                </label>
                {options.categories.map((category) => (
                  <label key={category} className="flex items-center group cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={filters.category === category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-blue-600 font-medium capitalize transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="h-5 w-5 text-blue-600" />
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Brand</label>
              </div>
              <div className="relative">
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white font-medium text-gray-700 cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <option value="">All Brands</option>
                  {options.brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Price Range */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Price Range</label>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  />
                  <span className="text-gray-500 font-semibold">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value) || 1000000)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  />
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-4 py-3 border border-blue-100">
                  <p className="text-sm font-bold text-blue-900">
                    ${filters.minPrice.toLocaleString()} - ${filters.maxPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ArrowUpDown className="h-5 w-5 text-blue-600" />
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Sort By</label>
              </div>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white font-medium text-gray-700 cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}