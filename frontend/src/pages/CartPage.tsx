// src/pages/CartPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, clearCart, getTotal } = useCart();

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="alert alert-info">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn-primary">Browse Books</Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.book.bookID}>
                    <td>{item.book.title}</td>
                    <td>{item.book.author}</td>
                    <td>${item.book.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.book.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => removeFromCart(item.book.bookID)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={4} className="text-end">Total:</th>
                  <th>${getTotal().toFixed(2)}</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <Link to="/" className="btn btn-primary">Continue Shopping</Link>
            <button 
              className="btn btn-danger"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
          
          {/* Bootstrap feature 1: Accordion checkout info */}
          <div className="accordion mt-4" id="checkoutAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button 
                  className="accordion-button collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseOne"
                >
                  Proceed to Checkout
                </button>
              </h2>
              <div 
                id="collapseOne" 
                className="accordion-collapse collapse" 
                data-bs-parent="#checkoutAccordion"
              >
                <div className="accordion-body">
                  <p>Checkout functionality would be implemented here.</p>
                  <button className="btn btn-success">Complete Purchase</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;