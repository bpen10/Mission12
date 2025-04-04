// src/components/BookList.tsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Define types directly in this file
interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

interface BooksResponse {
  books: Book[];
  totalBooks: number;
  pageNumber: number;
  pageSize: number;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalBooks, setTotalBooks] = useState(0);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchBooks();
  }, [currentPage, pageSize, sortField, sortDirection]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://localhost:7040/api/Books?pageNumber=${currentPage}&pageSize=${pageSize}&sortField=${sortField}&sortDirection=${sortDirection}`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data: BooksResponse = await response.json();
      setBooks(data.books);
      setTotalBooks(data.totalBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field: string) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const totalPages = Math.ceil(totalBooks / pageSize);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Jeff Bezos Bookstore</h1>
      
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <label htmlFor="pageSize" className="me-2">Books per page:</label>
          <select
            id="pageSize"
            className="form-select form-select-sm d-inline-block w-auto"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading books...</p>
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
                  <th>ISBN</th>
                  <th>Classification</th>
                  <th>Category</th>
                  <th>Pages</th>
                  <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                    Price {renderSortIcon('price')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.bookID}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.publisher}</td>
                    <td>{book.isbn}</td>
                    <td>{book.classification}</td>
                    <td>{book.category}</td>
                    <td>{book.pageCount}</td>
                    <td>${book.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav>
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
              
              {Array.from({ length: totalPages }, (_, index) => (
                <li 
                  key={index + 1} 
                  className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
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
  );
};

export default BookList;