// src/pages/AdminBooks.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookApi } from '../api/bookApi';

interface Book {
  bookID: number;
  title: string;
  author: string;
  category: string;
  price: number;
}

const AdminBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  // src/pages/AdminBooks.tsx
const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookApi.getBooks(true); // Pass true to indicate this is for admin
      // Adapt to your API response structure
      const booksData = data.books || data;
      setBooks(booksData);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await bookApi.deleteBook(id);
      // Update the UI after successful deletion
      setBooks(books.filter(book => book.bookID !== id));
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Failed to delete book. Please try again later.');
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

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

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
              {books.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">No books found</td>
                </tr>
              ) : (
                books.map(book => (
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
                          onClick={() => handleDelete(book.bookID)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;