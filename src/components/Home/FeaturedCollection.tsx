import React from 'react';
import { ProductCard } from '../Product/ProductCard';
import { Product } from '../../types';

interface FeaturedCollectionProps {
  products: Product[];
  loading: boolean;
}

export function FeaturedCollection({ products, loading }: FeaturedCollectionProps) {
  return (
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
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

