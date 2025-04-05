// src/context/CartContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { Book, CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookID: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (book: Book) => {
    console.log("Adding book to cart:", book);
    
    if (!book) {
      console.error("Attempted to add invalid book to cart:", book);
      return;
    }
  
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => 
        item.book.bookID === book.bookID
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        return [...prevItems, { book, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (bookID: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.book.bookID !== bookID));
  };
  
  const clearCart = () => {
    setCartItems([]);
  };
  
  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.book.price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};