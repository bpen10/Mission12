// src/components/ProjectList.tsx
import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { useCart } from '../context/CartContext';
import CategoryFilter from './CategoryFilter';
import CartSummary from './CartSummary';

const ProjectList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [totalBooks, setTotalBooks] = useState(0);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [currentPage, booksPerPage, selectedCategory, sortField, sortDirection]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://localhost:7040/api/Books/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let url = `https://localhost:7040/api/Books?pageNumber=${currentPage}&pageSize=${booksPerPage}&sortField=${sortField}&sortDirection=${sortDirection}`;
      
      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      const data = await response.json();
      setBooks(data.books);
      setTotalBooks(data.totalBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBooksPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBooksPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field: string) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const totalPages = Math.ceil(totalBooks / booksPerPage);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Left sidebar with filters and cart summary */}
        <div className="col-md-3">
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onCategoryChange={handleCategoryChange}
          />
          <CartSummary />
        </div>
        
        {/* Main content */}
        <div className="col-md-9">
          <h1 className="mb-4">Jeff Bezos Bookstore</h1>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <label htmlFor="booksPerPage" className="me-2">Books per page:</label>
              <select 
                id="booksPerPage" 
                className="form-select form-select-sm d-inline-block w-auto"
                value={booksPerPage}
                onChange={handleBooksPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                        Title {renderSortIcon('title')}
                      </th>
                      <th onClick={() => handleSort('author')} style={{ cursor: 'pointer' }}>
                        Author {renderSortIcon('author')}
                      </th>
                      <th>Publisher</th>
                      <th>Category</th>
                      <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                        Price {renderSortIcon('price')}
                      </th>
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
                          <td>{book.title}</td>
                          <td>{book.author}</td>
                          <td>{book.publisher}</td>
                          <td>{book.category}</td>
                          <td>${book.price.toFixed(2)}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => addToCart(book)}
                            >
                              Add to Cart
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li 
                      key={i + 1} 
                      className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                    >
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;