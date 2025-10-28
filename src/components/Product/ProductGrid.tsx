import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Package, Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300"></div>
            <div className="p-5 space-y-3">
              <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 w-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
        <div className="inline-flex items-center space-x-2 text-blue-600 font-semibold">
          <Sparkles className="h-5 w-5" />
          <span>Explore our full collection</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Product Grid - 3 columns max */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}