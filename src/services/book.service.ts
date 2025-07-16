import api from "./api";

// Book service interfaces
export interface BookResponse {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  imageUrl?: string;
  stockQuantity: number;
  isbn?: string;
  category?: string;
  publishYear?: number;
}

export interface BookRequest {
  title: string;
  author: string;
  description: string;
  price: number;
  imageUrl?: string;
  stockQuantity: number;
  isbn?: string;
  category?: string;
  publishYear?: number;
}

// Book service methods
const BookService = {
  getAllBooks: async (): Promise<BookResponse[]> => {
    try {
      console.log("Fetching all books");
      // Create a new instance without auth headers for public endpoints
      const response = await api.get("/books/all");
      console.log("Books fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching books:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  getBookById: async (id: number): Promise<BookResponse> => {
    try {
      console.log(`Fetching book with ID: ${id}`);
      // Public endpoint - no auth required
      const response = await api.get(`/books/${id}`);
      console.log("Book fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching book ${id}:`, error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  searchBooks: async (
    title?: string,
    author?: string,
    category?: string
  ): Promise<BookResponse[]> => {
    try {
      const params = new URLSearchParams();
      if (title) params.append("title", title);
      if (author) params.append("author", author);
      if (category) params.append("category", category);

      console.log(`Searching books with params: ${params.toString()}`);
      const response = await api.get(`/books/search?${params.toString()}`);
      console.log("Search results:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error searching books:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  // Admin methods (require ROLE_ADMIN)
  createBook: async (book: BookRequest): Promise<BookResponse> => {
    try {
      console.log("Creating new book:", book);
      const response = await api.post("/books", book);
      console.log("Book created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating book:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  updateBook: async (id: number, book: BookRequest): Promise<BookResponse> => {
    try {
      console.log(`Updating book ${id}:`, book);
      const response = await api.put(`/books/${id}`, book);
      console.log("Book updated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating book ${id}:`, error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  deleteBook: async (id: number): Promise<void> => {
    try {
      console.log(`Deleting book ${id}`);
      await api.delete(`/books/${id}`);
      console.log(`Book ${id} deleted successfully`);
    } catch (error: any) {
      console.error(`Error deleting book ${id}:`, error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },
};

export default BookService;
