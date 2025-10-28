import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye, Zap, Heart, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { WishlistButton } from '../Wishlist/WishlistButton';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.lensCompatible) {
      return;
    }
    addToCart(product);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-2">
      {/* Success Toast */}
      {showSuccess && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold animate-bounce">
          Added to cart! ✓
        </div>
      )}

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.stock === 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
              <span>Out of Stock</span>
            </span>
          )}
          {product.stock > 0 && product.stock < 10 && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1 animate-pulse">
              <Zap className="h-3 w-3" />
              <span>Only {product.stock} left</span>
            </span>
          )}
          {product.lensCompatible && (
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>Customizable</span>
            </span>
          )}
        </div>
      </Link>

      {/* Quick Actions - Top Right */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <div className="flex flex-col space-y-2">
          <Link
            to={`/product/${product.id}`}
            className="p-2.5 bg-white rounded-full shadow-lg hover:bg-blue-50 hover:scale-110 transition-all duration-200 border border-gray-200"
            title="Quick View"
          >
            <Eye className="h-5 w-5 text-gray-700 hover:text-blue-600" />
          </Link>
          <div className="p-2.5 bg-white rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-200 border border-gray-200">
            <WishlistButton product={product} />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <Link to={`/product/${product.id}`} className="block mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors line-clamp-1 group-hover:text-blue-600">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{product.brand}</p>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2 font-medium">(24)</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.lensCompatible && (
              <span className="text-xs text-gray-500 font-medium">+ lens options</span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`p-3 rounded-full transition-all transform shadow-md ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-110 hover:shadow-xl'
            }`}
            title={product.lensCompatible ? "View Details" : "Add to Cart"}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>

        {/* Features */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {product.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-100"
              >
                {feature}
              </span>
            ))}
            {product.features.length > 2 && (
              <span className="text-xs text-gray-500 px-2 py-1 font-medium">
                +{product.features.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
}