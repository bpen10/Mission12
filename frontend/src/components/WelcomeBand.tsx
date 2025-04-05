// src/components/WelcomeBand.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeBand: React.FC = () => {
  return (
    <div className="bg-dark text-white p-4 mb-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h2 className="mb-0">
              <Link to="/" className="text-white text-decoration-none">
                Welcome to Jeff Bezos Bookstore
              </Link>
            </h2>
            <p className="lead mb-0">Find your next favorite book at amazing prices!</p>
          </div>
          <div className="col-md-4 d-flex justify-content-end align-items-center">
            <span className="badge bg-warning text-dark p-2 me-3">Special Sale Today!</span>
            <Link to="/" className="btn btn-outline-light me-2">
              Books
            </Link>
            <Link to="/admin/books" className="btn btn-outline-light">
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBand;