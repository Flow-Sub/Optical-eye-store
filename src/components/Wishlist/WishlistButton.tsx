import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../../types';

interface WishlistButtonProps {
  product: Product;
  className?: string;
}

export function WishlistButton({ product, className = '' }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    
    // In a real app, this would save to backend/localStorage
    if (!isWishlisted) {
      // Add to wishlist
      console.log('Added to wishlist:', product.name);
    } else {
      // Remove from wishlist
      console.log('Removed from wishlist:', product.name);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      className={`p-2 rounded-full transition-all duration-200 ${
        isWishlisted
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-red-500'
      } ${className}`}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
    </button>
  );
}