/* src/components/Product/ProductFilters.tsx */
import React from 'react';
import { Filter, X, ChevronDown, DollarSign, Tag, Grid3x3, ArrowUpDown, RefreshCw } from 'lucide-react';

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

export function ProductFilters({
  filters,
  onFilterChange,
  options,
  isOpen,
  onToggle,
}: ProductFiltersProps) {
  const handleChange = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onFilterChange({
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 1000000,
      sortBy: 'name',
    });
  };

  const activeCount = [
    filters.category,
    filters.brand,
    filters.minPrice > 0,
    filters.maxPrice < 1000000,
  ].filter(Boolean).length;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={onToggle}
        className="lg:hidden flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-light hover:bg-gray-800 transition-colors"
      >
        <Filter className="h-5 w-5" />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="ml-2 bg-white text-gray-900 text-xs font-medium px-2 py-0.5 rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block mt-6 lg:mt-0`}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-700" />
              <h3 className="text-lg font-light text-gray-900">Filters</h3>
              {activeCount > 0 && (
                <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {activeCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={clearAll}
                className="text-sm text-gray-600 hover:text-gray-900 font-light flex items-center space-x-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Clear</span>
              </button>
              <button onClick={onToggle} className="lg:hidden">
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Grid3x3 className="h-5 w-5 text-gray-700" />
              <label className="text-sm font-light text-gray-900 uppercase tracking-wider">Category</label>
            </div>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="cat"
                  value=""
                  checked={filters.category === ''}
                  onChange={() => handleChange('category', '')}
                  className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-0"
                />
                <span className="ml-3 text-sm text-gray-700 font-light">All Categories</span>
              </label>
              {options.categories.map((cat) => (
                <label key={cat} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="cat"
                    value={cat}
                    checked={filters.category === cat}
                    onChange={() => handleChange('category', cat)}
                    className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-0"
                  />
                  <span className="ml-3 text-sm text-gray-700 font-light capitalize">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="h-5 w-5 text-gray-700" />
              <label className="text-sm font-light text-gray-900 uppercase tracking-wider">Brand</label>
            </div>
            <div className="relative">
              <select
                value={filters.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-light text-gray-700 focus:outline-none focus:border-gray-900 appearance-none cursor-pointer"
              >
                <option value="">All Brands</option>
                {options.brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="h-5 w-5 text-gray-700" />
              <label className="text-sm font-light text-gray-900 uppercase tracking-wider">Price Range</label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleChange('minPrice', Number(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-light focus:outline-none focus:border-gray-900"
              />
              <span className="text-gray-500">—</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice < 1000000 ? filters.maxPrice : ''}
                onChange={(e) => handleChange('maxPrice', Number(e.target.value) || 1000000)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-light focus:outline-none focus:border-gray-900"
              />
            </div>
            <p className="mt-2 text-sm text-gray-600 font-light">
              ${filters.minPrice.toLocaleString()} – ${filters.maxPrice >= 1000000 ? 'Any' : filters.maxPrice.toLocaleString()}
            </p>
          </div>

          {/* Sort */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ArrowUpDown className="h-5 w-5 text-gray-700" />
              <label className="text-sm font-light text-gray-900 uppercase tracking-wider">Sort By</label>
            </div>
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-light text-gray-700 focus:outline-none focus:border-gray-900 appearance-none cursor-pointer"
              >
                <option value="name">Name (A–Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}