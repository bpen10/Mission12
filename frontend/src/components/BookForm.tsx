// src/components/BookForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Book } from '../types';

interface BookFormProps {
  isEdit?: boolean;
}

const initialBookState: Book = {
  bookID: 0,
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0
};

const BookForm: React.FC<BookFormProps> = ({ isEdit = false }) => {
  const [book, setBook] = useState<Book>(initialBookState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Fetch book data if in edit mode
  useEffect(() => {
    if (isEdit && id) {
      fetchBook(parseInt(id));
    }
  }, [isEdit, id]);
  
  const fetchCategories = async () => {
    try {
      const response = await fetch('https://localhost:7040/api/Books/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again later.');
    }
  };
  
  const fetchBook = async (bookId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://localhost:7040/api/Admin/Books/${bookId}`);
      if (!response.ok) throw new Error('Failed to fetch book');
      const data = await response.json();
      setBook(data);
    } catch (error) {
      console.error('Error fetching book:', error);
      setError('Failed to load book data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convert number fields
    if (name === 'pageCount' || name === 'price') {
      setBook({
        ...book,
        [name]: parseFloat(value) || 0
      });
    } else {
      setBook({
        ...book,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const url = isEdit 
        ? `https://localhost:7040/api/Admin/Books/${book.bookID}`
        : 'https://localhost:7040/api/Admin/Books';
      
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
      });
      
      if (!response.ok) throw new Error('Failed to save book');
      
      // Navigate back to admin books page
      navigate('/admin/books');
    } catch (error) {
      console.error('Error saving book:', error);
      setError('Failed to save book. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEdit) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mt-4">
      <h1>{isEdit ? 'Edit Book' : 'Add New Book'}</h1>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={book.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="author">Author</label>
              <input
                type="text"
                className="form-control"
                id="author"
                name="author"
                value={book.author}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="publisher">Publisher</label>
              <input
                type="text"
                className="form-control"
                id="publisher"
                name="publisher"
                value={book.publisher}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                className="form-control"
                id="isbn"
                name="isbn"
                value={book.isbn}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="classification">Classification</label>
              <input
                type="text"
                className="form-control"
                id="classification"
                name="classification"
                value={book.classification}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="category">Category</label>
              <select
                className="form-control"
                id="category"
                name="category"
                value={book.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                <option value="new">Add New Category...</option>
              </select>
            </div>
          </div>
          
          {book.category === 'new' && (
            <div className="col-md-12">
              <div className="form-group mb-3">
                <label htmlFor="newCategory">New Category</label>
                <input
                  type="text"
                  className="form-control"
                  id="newCategory"
                  name="category"
                  value=""
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}
          
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="pageCount">Page Count</label>
              <input
                type="number"
                className="form-control"
                id="pageCount"
                name="pageCount"
                value={book.pageCount}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="price">Price</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  value={book.price}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between mt-4">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/admin/books')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              'Save Book'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;