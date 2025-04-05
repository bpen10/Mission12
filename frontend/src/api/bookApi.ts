// src/api/bookApi.ts
const API_URL = 'https://mission13backendpenner-a4huade9cwavfufa.eastus-01.azurewebsites.net/api';

export const bookApi = {
  // Get all books
  getBooks: async (forAdmin = false) => {
    // For admin panel, get all books by using a large pageSize
    const pageParam = forAdmin ? '?pageSize=1000' : '';
    const response = await fetch(`${API_URL}/Books${pageParam}`);
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    return response.json();
  },

  // Get a single book by ID
  getBook: async (id: number) => {
    const response = await fetch(`${API_URL}/Admin/Books/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch book');
    }
    return response.json();
  },

  // Create a new book
  createBook: async (book: any) => {
    const response = await fetch(`${API_URL}/Admin/Books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    if (!response.ok) {
      throw new Error('Failed to create book');
    }
    return response.json();
  },

  // Update an existing book
  updateBook: async (id: number, book: any) => {
    const response = await fetch(`${API_URL}/Admin/Books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    if (!response.ok) {
      throw new Error('Failed to update book');
    }
    return response;
  },

  // Delete a book
  deleteBook: async (id: number) => {
    const response = await fetch(`${API_URL}/Admin/Books/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
    return response;
  },

  // Get all categories
  getCategories: async () => {
    const response = await fetch(`${API_URL}/Books/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },
};