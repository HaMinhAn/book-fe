import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BookFilter } from "./BookFilter";
import BookService, { BookResponse } from "../../services/book.service";
import "./BookStyles.css";

export const BookList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        if (searchTerm || category !== "all") {
          const results = await BookService.searchBooks(
            searchTerm || undefined,
            undefined,
            category !== "all" ? category : undefined
          );
          setBooks(results);
        } else {
          const results = await BookService.getAllBooks();
          setBooks(results);
        }
        setError("");
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm, category]);

  // Calculate pagination
  const booksPerPage = 12;
  const indexOfLastBook = page * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  return (
    <Box sx={{ py: 4 }}>
      <BookFilter
        searchTerm={searchTerm}
        category={category}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategory}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : books.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No books found matching your criteria.
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", flexWrap: "wrap", margin: "-12px" }}>
            {currentBooks.map((book) => (
              <Box
                key={book.id}
                sx={{
                  width: { xs: "100%", sm: "50%", md: "33.33%", lg: "25%" },
                  padding: "12px",
                }}
              >
                <Card
                  className="book-card"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <Box
                    className="book-image-container-all"
                    sx={{ height: 200, p: 2 }}
                  >
                    <img
                      className="book-image"
                      src={book.imageUrl || "https://via.placeholder.com/400"}
                      alt={book.title}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {book.author}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      ${Number(book.price).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};
