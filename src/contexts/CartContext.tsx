import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product, LensOption, LensCoating, PrescriptionData } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    lensOption?: LensOption,
    coatings?: LensCoating[],
    prescriptionData?: PrescriptionData
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (
    product: Product,
    quantity = 1,
    lensOption?: LensOption,
    coatings: LensCoating[] = [],
    prescriptionData?: PrescriptionData
  ) => {
    const itemId = `${product.id}-${lensOption?.id || 'no-lens'}-${coatings.map(c => c.id).join(',')}`;
    
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemId);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      const newItem: CartItem = {
        id: itemId,
        product,
        quantity,
        lensOption,
        coatings,
        prescriptionData
      };
      
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => {
    const lensPrice = item.lensOption?.price || 0;
    const coatingsPrice = item.coatings.reduce((coatingSum, coating) => coatingSum + coating.price, 0);
    return sum + (item.product.price + lensPrice + coatingsPrice) * item.quantity;
  }, 0);

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}