import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  InputAdornment,
} from "@mui/material";
import { Add, Edit, Delete, Search, Visibility } from "@mui/icons-material";
import BookService, {
  BookResponse,
  BookRequest,
} from "../../services/book.service";
import {
  validateBookTitle,
  validateAuthor,
  validatePrice,
  validateQuantity,
  validateISBN,
  validateRequired,
  validateForm,
} from "../../utils/validation";

export const BookManagement = () => {
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState<BookResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<BookRequest>({
    title: "",
    author: "",
    description: "",
    price: 0,
    imageUrl: "",
    stockQuantity: 0,
    isbn: "",
    category: "",
    publishYear: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await BookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (book?: BookResponse) => {
    setFieldErrors({}); // Clear previous errors
    if (book) {
      setEditingBook(book);
      const updatedFormData = {
        title: book.title,
        author: book.author,
        description: book.description,
        price: Number(book.price),
        imageUrl: book.imageUrl || "",
        stockQuantity: book.stockQuantity,
        isbn: book.isbn || "",
        category: book.category || "",
        publishYear: book.publishYear || new Date().getFullYear(),
      };
      setFormData(updatedFormData);

      // Validate all fields immediately when editing
      Object.keys(updatedFormData).forEach((key) => {
        const bookField = key as keyof BookRequest;
        validateField(bookField, (updatedFormData as any)[bookField]);
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: "",
        author: "",
        description: "",
        price: 0,
        imageUrl: "",
        stockQuantity: 0,
        isbn: "",
        category: "",
        publishYear: new Date().getFullYear(),
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBook(null);
    setFieldErrors({});
  };

  const validateField = (field: keyof BookRequest, value: any) => {
    let validationResult = { isValid: true, error: "" };

    switch (field) {
      case "title":
        validationResult = validateBookTitle(value);
        break;
      case "author":
        validationResult = validateAuthor(value);
        break;
      case "price":
        validationResult = validatePrice(value);
        break;
      case "stockQuantity":
        validationResult = validateQuantity(value);
        break;
      case "description":
        validationResult = validateRequired(value, "Description");
        break;
      case "isbn":
        validationResult = value
          ? validateISBN(value)
          : { isValid: true, error: "" };
        break;
      case "category":
        validationResult = validateRequired(value, "Category");
        break;
      case "publishYear":
        const currentYear = new Date().getFullYear();
        const year = value || currentYear;
        if (year < 1000 || year > currentYear + 5) {
          validationResult = {
            isValid: false,
            error: "Please enter a valid publish year",
          };
        }
        break;
    }

    // Update field errors
    if (!validationResult.isValid) {
      setFieldErrors((prev) => ({ ...prev, [field]: validationResult.error }));
    } else {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    return validationResult.isValid;
  };

  const handleInputChange = (field: keyof BookRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async () => {
    // Validate all fields before submission
    let isValid = true;
    const fieldsToValidate: (keyof BookRequest)[] = [
      "title",
      "author",
      "description",
      "price",
      "stockQuantity",
      "isbn",
      "category",
      "publishYear",
      "imageUrl",
    ];

    // Validate each field
    fieldsToValidate.forEach((field) => {
      const isFieldValid = validateField(field, formData[field]);
      if (!isFieldValid) {
        isValid = false;
      }
    });

    if (!isValid) {
      setError("Please fix the validation errors before submitting.");
      return;
    }

    try {
      if (editingBook) {
        await BookService.updateBook(editingBook.id, formData);
      } else {
        await BookService.createBook(formData);
      }
      await fetchBooks();
      handleCloseDialog();
      setFieldErrors({});
    } catch (err) {
      console.error("Error saving book:", err);
      setError("Failed to save book. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await BookService.deleteBook(id);
      await fetchBooks();
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Error deleting book:", err);
      setError("Failed to delete book. Please try again.");
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Book Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New Book
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search books by title, author, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Books Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cover</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell>
                  <Box sx={{ width: 60, height: 80 }}>
                    <img
                      src={book.imageUrl || "https://via.placeholder.com/60x80"}
                      alt={book.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">{book.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    ISBN: {book.isbn || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>
                  {book.category ? (
                    <Chip label={book.category} size="small" />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>${Number(book.price).toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={book.stockQuantity}
                    color={
                      book.stockQuantity > 10
                        ? "success"
                        : book.stockQuantity > 0
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(book)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteConfirmId(book.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Book Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingBook ? "Edit Book" : "Add New Book"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                error={!!fieldErrors.title}
                helperText={fieldErrors.title}
                required
              />
              <TextField
                fullWidth
                label="Author"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                error={!!fieldErrors.author}
                helperText={fieldErrors.author}
                required
              />
            </Box>{" "}
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              error={!!fieldErrors.description}
              helperText={fieldErrors.description}
              multiline
              rows={3}
              required
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  handleInputChange("price", Number(e.target.value))
                }
                error={!!fieldErrors.price}
                helperText={fieldErrors.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                required
              />
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                value={formData.stockQuantity}
                onChange={(e) =>
                  handleInputChange("stockQuantity", Number(e.target.value))
                }
                error={!!fieldErrors.stockQuantity}
                helperText={fieldErrors.stockQuantity}
                required
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="ISBN"
                value={formData.isbn}
                onChange={(e) => handleInputChange("isbn", e.target.value)}
                error={!!fieldErrors.isbn}
                helperText={fieldErrors.isbn}
              />
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                error={!!fieldErrors.category}
                helperText={fieldErrors.category}
                required
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Publish Year"
                type="number"
                value={formData.publishYear}
                onChange={(e) =>
                  handleInputChange("publishYear", Number(e.target.value))
                }
                error={!!fieldErrors.publishYear}
                helperText={fieldErrors.publishYear}
              />
              <TextField
                fullWidth
                label="Image URL"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                error={!!fieldErrors.imageUrl}
                helperText={fieldErrors.imageUrl}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.title ||
              !formData.author ||
              !formData.description ||
              !formData.category ||
              Object.keys(fieldErrors).some((key) => fieldErrors[key])
            }
          >
            {editingBook ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this book? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button
            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
