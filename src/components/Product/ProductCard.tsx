/* src/components/Product/ProductCard.tsx */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye, Heart, Zap, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { WishlistButton } from '../Wishlist/WishlistButton';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.lensCompatible || product.stock === 0) return;
    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 overflow-hidden">
      
      {/* Toast */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-light shadow-lg animate-fade-in">
          Added to cart
        </div>
      )}

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.stock === 0 && (
            <span className="bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          )}
          {product.stock > 0 && product.stock < 10 && (
            <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>Only {product.stock} left</span>
            </span>
          )}
          {product.lensCompatible && (
            <span className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>Custom</span>
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col space-y-2">
          <Link
            to={`/product/${product.id}`}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition"
            title="Quick View"
          >
            <Eye className="h-5 w-5 text-gray-700" />
          </Link>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition">
            <WishlistButton product={product} />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <Link to={`/product/${product.id}`} className="block mb-3">
          <h3 className="text-lg font-light text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 font-light">{product.brand}</p>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < 4 ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-2 text-xs text-gray-500">(24)</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-light text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.lensCompatible && (
              <span className="ml-2 text-sm text-gray-500">+ lens</span>
            )}
          </div>

          <button
            onClick={quickAdd}
            disabled={product.stock === 0 || product.lensCompatible}
            className={`p-3 rounded-lg transition-colors ${
              product.stock === 0 || product.lensCompatible
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>

        {/* Features */}
        {product.features.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-1.5">
              {product.features.slice(0, 2).map((f, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-light"
                >
                  {f}
                </span>
              ))}
              {product.features.length > 2 && (
                <span className="text-xs text-gray-500 font-light">
                  +{product.features.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}