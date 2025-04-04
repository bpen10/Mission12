// src/components/CartSummary.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartSummary: React.FC = () => {
  const { cartItems, getTotal } = useCart();
  
  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Cart Summary</h5>
      </div>
      <div className="card-body">
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <p>{cartItems.length} item(s) in cart</p>
            <p className="fw-bold">Total: ${getTotal().toFixed(2)}</p>
            <Link to="/cart" className="btn btn-primary w-100">View Cart</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default CartSummary;