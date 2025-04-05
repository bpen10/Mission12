// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BookList from './components/BookList';
import CartPage from './pages/CartPage';
import AdminBooks from './pages/AdminBooks';
import BookForm from './components/BookForm';
import WelcomeBand from './components/WelcomeBand';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App">
          <WelcomeBand />
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/admin/books" element={<AdminBooks />} />
            <Route path="/admin/books/create" element={<BookForm isEdit={false} />} />
            <Route path="/admin/books/edit/:id" element={<BookForm isEdit={true} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;