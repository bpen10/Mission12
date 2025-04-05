// src/pages/AdminBooks.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';

const AdminBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('https://localhost:7040/api/Admin/Books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const response = await fetch(`https://localhost:7040/api/Admin/Books/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      // Update the books list after deletion
      setBooks(books.filter(book => book.bookID !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin - Manage Books</h1>
        <Link to="/admin/books/create" className="btn btn-success">
          Add New Book
        </Link>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.bookID}>
                  <td>{book.bookID}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link to={`/admin/books/edit/${book.bookID}`} className="btn btn-sm btn-primary me-1">
                        Edit
                      </Link>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteBook(book.bookID)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;