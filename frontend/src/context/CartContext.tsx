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
  
    // Log all properties to see the actual structure
    console.log("Book properties:", Object.keys(book));
    
    // Find the correct ID property name, whatever it is
    const bookId = book.bookID || book.bookId || book.BookID || book.id || book.ID;
    console.log("Found book ID:", bookId);
  
    setCartItems(prevItems => {
      console.log("Current cart before update:", JSON.stringify(prevItems));
      
      // Find if this book already exists in the cart
      const existingItemIndex = prevItems.findIndex(item => {
        // Get the ID property from the item in the cart
        const itemId = item.book.bookID || item.book.bookId || item.book.BookID || item.book.id || item.book.ID;
        console.log("Comparing cart item ID:", itemId, "with new book ID:", bookId);
        return itemId === bookId;
      });
      
      console.log("Existing item index:", existingItemIndex);
      
      if (existingItemIndex >= 0) {
        // Create a new array with the updated quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        console.log("Updated cart:", JSON.stringify(updatedItems));
        return updatedItems;
      } else {
        // Add as a new item
        const newItems = [...prevItems, { book, quantity: 1 }];
        console.log("New cart with added item:", JSON.stringify(newItems));
        return newItems;
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