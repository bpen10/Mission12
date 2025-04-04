// src/components/WelcomeBand.tsx
import React from 'react';

const WelcomeBand: React.FC = () => {
  return (
    <div className="bg-dark text-white p-4 mb-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h2 className="mb-0">Welcome to Jeff Bezos Bookstore</h2>
            <p className="lead mb-0">Find your next favorite book at amazing prices!</p>
          </div>
          <div className="col-md-4 text-md-end">
            {/* Bootstrap feature 2: Badge component */}
            <span className="badge bg-warning text-dark p-2">Special Sale Today!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBand;