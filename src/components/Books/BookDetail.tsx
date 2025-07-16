import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Rating,
  Chip,
  Divider,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Container,
  Fade,
  Stack,
  Badge,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ArrowBack,
  LocalShipping,
  Security,
  Verified,
  BookmarkBorder,
  Share,
} from "@mui/icons-material";
import { useCart } from "../../contexts/CartContext";
import BookService, { BookResponse } from "../../services/book.service";
import "./BookStyles.css";

export const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [book, setBook] = useState<BookResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { addItem } = useCart();

  // Input validation functions
  const validateBookId = (id: string | undefined): boolean => {
    if (!id) return false;
    const numId = parseInt(id);
    return !isNaN(numId) && numId > 0;
  };

  const validateQuantity = (
    qty: number,
    maxStock?: number
  ): { isValid: boolean; error: string } => {
    if (!qty || isNaN(qty)) {
      return {
        isValid: false,
        error: "Quantity is required and must be a number",
      };
    }
    if (qty < 1) {
      return { isValid: false, error: "Quantity must be at least 1" };
    }
    if (qty > 999) {
      return { isValid: false, error: "Quantity cannot exceed 999" };
    }
    if (maxStock && qty > maxStock) {
      return {
        isValid: false,
        error: `Only ${maxStock} items available in stock`,
      };
    }
    return { isValid: true, error: "" };
  };

  const validateBookData = (bookData: any): boolean => {
    return (
      bookData &&
      typeof bookData.id === "number" &&
      typeof bookData.title === "string" &&
      bookData.title.trim().length > 0 &&
      typeof bookData.author === "string" &&
      bookData.author.trim().length > 0 &&
      typeof bookData.price === "number" &&
      bookData.price > 0
    );
  };

  const showError = (message: string) => {
    setAlertMessage(message);
    setShowErrorAlert(true);
  };

  const showSuccess = (message: string) => {
    setAlertMessage(message);
    setShowSuccessAlert(true);
  };

  // Additional handler for quantity validation
  const handleQuantityChange = (value: string) => {
    const newValue = parseInt(value) || 1;
    const clampedValue = Math.max(
      1,
      Math.min(newValue, book?.stockQuantity || 999)
    );
    setQuantity(clampedValue);

    // Real-time validation
    const validation = validateQuantity(clampedValue, book?.stockQuantity);
    setQuantityError(validation.isValid ? "" : validation.error);
  };

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) {
        setError("Invalid book ID");
        setLoading(false);
        return;
      }

      // Validate book ID format
      if (!validateBookId(id)) {
        setError("Invalid book ID format");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const bookId = parseInt(id);
        const bookData = await BookService.getBookById(bookId);

        // Validate received book data
        if (!validateBookData(bookData)) {
          setError("Invalid book data received from server");
          setLoading(false);
          return;
        }

        setBook(bookData);
        setError("");
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (!book) {
      showError("Book information is not available");
      return;
    }

    // Validate quantity
    const quantityValidation = validateQuantity(quantity, book.stockQuantity);
    if (!quantityValidation.isValid) {
      setQuantityError(quantityValidation.error);
      showError(quantityValidation.error);
      return;
    }

    // Validate book availability
    if (!book.stockQuantity || book.stockQuantity < 1) {
      showError("This book is currently out of stock");
      return;
    }

    if (quantity > book.stockQuantity) {
      showError(`Only ${book.stockQuantity} items available in stock`);
      return;
    }

    try {
      addItem(
        {
          id: book.id,
          title: book.title,
          author: book.author,
          price: Number(book.price),
          imageUrl: book.imageUrl || "https://via.placeholder.com/400",
        },
        quantity
      );

      setQuantityError(""); // Clear any previous errors
      showSuccess(
        `${quantity} ${quantity === 1 ? "copy" : "copies"} of "${
          book.title
        }" added to cart!`
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError("Failed to add item to cart. Please try again.");
    }
  };

  const handleBuyNow = async () => {
    if (!book) {
      showError("Book information is not available");
      return;
    }

    // Validate quantity
    const quantityValidation = validateQuantity(quantity, book.stockQuantity);
    if (!quantityValidation.isValid) {
      setQuantityError(quantityValidation.error);
      showError(quantityValidation.error);
      return;
    }

    // Validate book availability
    if (!book.stockQuantity || book.stockQuantity < 1) {
      showError("This book is currently out of stock");
      return;
    }

    if (quantity > book.stockQuantity) {
      showError(`Only ${book.stockQuantity} items available in stock`);
      return;
    }

    try {
      // Add to cart first
      await addItem(
        {
          id: book.id,
          title: book.title,
          author: book.author,
          price: Number(book.price),
          imageUrl: book.imageUrl || "https://via.placeholder.com/400",
        },
        quantity
      );

      setQuantityError(""); // Clear any previous errors
      // Navigate directly to purchase page
      navigate("/purchase");
    } catch (error) {
      console.error("Error processing buy now:", error);
      showError("Failed to process purchase. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              "& .MuiAlert-action": { alignItems: "center" },
            }}
            action={
              <Button
                variant="outlined"
                size="small"
                startIcon={<ArrowBack />}
                onClick={() => navigate("/books")}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Back to Books
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert
            severity="warning"
            sx={{
              borderRadius: 2,
              "& .MuiAlert-action": { alignItems: "center" },
            }}
            action={
              <Button
                variant="outlined"
                size="small"
                startIcon={<ArrowBack />}
                onClick={() => navigate("/books")}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Back to Books
              </Button>
            }
          >
            Book not found
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Fade in={true} timeout={800}>
        <Box sx={{ py: 4 }}>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/books")}
            sx={{
              mb: 3,
              textTransform: "none",
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
          >
            Back to Books
          </Button>

          <Grid container spacing={4}>
            {/* Image Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "grey.200",
                  height: "fit-content",
                  maxWidth: { xs: "100%", md: 550 }, // Limit width on larger screens
                  margin: "0 auto", // Center card
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box
                  className="book-image-container"
                  sx={{
                    position: "relative",
                    height: { xs: 400, md: 600 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.50",
                    p: 2,
                    overflow: "hidden", // Prevent overflow
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "grey.100",
                    },
                    "&:hover .book-detail-image": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <img
                    className="book-detail-image"
                    src={book.imageUrl || "https://via.placeholder.com/400"}
                    alt={book.title}
                  />
                  {/* Action buttons on image */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 46,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        minWidth: "auto",
                        p: 1,
                        borderRadius: 2,
                        bgcolor: "white",
                        color: "grey.700",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        "&:hover": {
                          bgcolor: "grey.100",
                        },
                      }}
                    >
                      <BookmarkBorder fontSize="small" />
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        minWidth: "auto",
                        p: 1,
                        borderRadius: 2,
                        bgcolor: "white",
                        color: "grey.700",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        "&:hover": {
                          bgcolor: "grey.100",
                        },
                      }}
                    >
                      <Share fontSize="small" />
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* Details Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3}>
                {/* Header */}
                <Box>
                  {book.category && (
                    <Chip
                      label={book.category}
                      size="small"
                      sx={{
                        mb: 2,
                        bgcolor: "primary.50",
                        color: "primary.main",
                        fontWeight: 500,
                        borderRadius: 2,
                      }}
                    />
                  )}
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.2,
                      mb: 1,
                      color: "text.primary",
                    }}
                  >
                    {book.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    by {book.author}
                  </Typography>
                </Box>

                {/* Price and Stock */}
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "primary.main",
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    ${Number(book.price).toFixed(2)}
                  </Typography>
                  {book.stockQuantity !== undefined && (
                    <Chip
                      label={
                        book.stockQuantity > 0
                          ? `${book.stockQuantity} in stock`
                          : "Out of stock"
                      }
                      size="small"
                      color={book.stockQuantity > 0 ? "success" : "error"}
                      icon={book.stockQuantity > 0 ? <Verified /> : undefined}
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                </Box>

                {/* Description */}
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    bgcolor: "grey.50",
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                      {book.description}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Purchase Actions */}
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Purchase Options
                    </Typography>

                    <Stack spacing={2}>
                      <TextField
                        type="number"
                        label="Quantity"
                        value={quantity}
                        error={!!quantityError}
                        helperText={quantityError}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                        onBlur={() => {
                          // Validate on blur
                          const validation = validateQuantity(
                            quantity,
                            book.stockQuantity
                          );
                          setQuantityError(
                            validation.isValid ? "" : validation.error
                          );
                        }}
                        InputProps={{
                          inputProps: {
                            min: 1,
                            max: book.stockQuantity || 999,
                            step: 1,
                          },
                        }}
                        size="small"
                        sx={{
                          maxWidth: 120,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />

                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="outlined"
                          size="large"
                          startIcon={<ShoppingCart />}
                          onClick={handleAddToCart}
                          disabled={
                            !book.stockQuantity || book.stockQuantity < 1
                          }
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            py: 1.5,
                            border: "2px solid",
                            "&:hover": {
                              border: "2px solid",
                            },
                          }}
                        >
                          {!book.stockQuantity || book.stockQuantity < 1
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </Button>

                        <Button
                          variant="contained"
                          size="large"
                          onClick={handleBuyNow}
                          disabled={
                            !book.stockQuantity || book.stockQuantity < 1
                          }
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            py: 1.5,
                            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                            "&:hover": {
                              boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                            },
                          }}
                        >
                          Buy Now
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Features */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 4 }}>
                    <Card
                      variant="outlined"
                      sx={{
                        textAlign: "center",
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "success.50",
                        borderColor: "success.200",
                      }}
                    >
                      <LocalShipping sx={{ color: "success.main", mb: 1 }} />
                      <Typography
                        variant="caption"
                        display="block"
                        fontWeight={600}
                      >
                        Free Delivery
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Card
                      variant="outlined"
                      sx={{
                        textAlign: "center",
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "info.50",
                        borderColor: "info.200",
                      }}
                    >
                      <Security sx={{ color: "info.main", mb: 1 }} />
                      <Typography
                        variant="caption"
                        display="block"
                        fontWeight={600}
                      >
                        Secure Payment
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Card
                      variant="outlined"
                      sx={{
                        textAlign: "center",
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "warning.50",
                        borderColor: "warning.200",
                      }}
                    >
                      <Verified sx={{ color: "warning.main", mb: 1 }} />
                      <Typography
                        variant="caption"
                        display="block"
                        fontWeight={600}
                      >
                        Authentic
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                {/* Book Details */}
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Book Details
                    </Typography>
                    <Grid container spacing={2}>
                      {book.isbn && (
                        <Grid size={{ xs: 6 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                          >
                            ISBN
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {book.isbn}
                          </Typography>
                        </Grid>
                      )}
                      {book.category && (
                        <Grid size={{ xs: 6 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                          >
                            Category
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {book.category}
                          </Typography>
                        </Grid>
                      )}
                      {book.publishYear && (
                        <Grid size={{ xs: 6 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                          >
                            Publication Year
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {book.publishYear}
                          </Typography>
                        </Grid>
                      )}
                      {book.stockQuantity !== undefined && (
                        <Grid size={{ xs: 6 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                          >
                            Available Stock
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {book.stockQuantity}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={4000}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setShowSuccessAlert(false)}
          sx={{
            borderRadius: 2,
            fontWeight: 500,
          }}
        >
          {alertMessage || "Book added to cart successfully! 🎉"}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showErrorAlert}
        autoHideDuration={6000}
        onClose={() => setShowErrorAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setShowErrorAlert(false)}
          sx={{
            borderRadius: 2,
            fontWeight: 500,
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};
