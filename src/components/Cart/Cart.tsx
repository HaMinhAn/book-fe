import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export const Cart = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    loading,
    error,
    refreshCart,
    fetchCart,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const [localLoading, setLocalLoading] = useState<{ [key: number]: boolean }>(
    {}
  );
  const navigate = useNavigate();

  const shipping = 5.99;
  const total = subtotal + shipping;
  useEffect(() => {
    fetchCart();
  }, []);
  const handleQuantityChange = async (id: number, newQuantity: number) => {
    setLocalLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await updateQuantity(id, newQuantity);
    } finally {
      setLocalLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleRemoveItem = async (id: number) => {
    setLocalLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await removeItem(id);
    } finally {
      setLocalLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Please log in to view your cart
        </Alert>
        <Button variant="contained" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Shopping Cart</Typography>
        {items.length > 0 && (
          <Button
            startIcon={<RefreshIcon />}
            onClick={() => refreshCart()}
            disabled={loading}
          >
            Refresh Cart
          </Button>
        )}
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 66.66%" } }}>
            {items.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Your cart is empty
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/books")}
                  sx={{ mt: 2 }}
                >
                  Continue Shopping
                </Button>
              </Box>
            ) : (
              items.map((item) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        margin: -1,
                      }}
                    >
                      <Box
                        sx={{ flex: { xs: "1 1 100%", sm: "0 0 25%" }, p: 1 }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: "120px",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{ flex: { xs: "1 1 100%", sm: "0 0 75%" }, p: 1 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography variant="h6">{item.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              by {item.author}
                            </Typography>
                            <Typography
                              variant="h6"
                              color="primary"
                              sx={{ mt: 1 }}
                            >
                              ${item.price.toFixed(2)}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {localLoading[item.id] ? (
                              <CircularProgress size={24} />
                            ) : (
                              <>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                >
                                  <RemoveIcon />
                                </IconButton>
                                <TextField
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.id,
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  inputProps={{
                                    min: 1,
                                    style: { textAlign: "center" },
                                  }}
                                  sx={{ width: "60px" }}
                                  disabled={localLoading[item.id]}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={localLoading[item.id]}
                                >
                                  <AddIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={localLoading[item.id]}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>

          <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 33.33%" } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Box sx={{ my: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>Subtotal</Typography>
                    <Typography>${subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>Shipping</Typography>
                    <Typography>${shipping.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">${total.toFixed(2)}</Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => navigate("/purchase")}
                  disabled={items.length === 0 || loading}
                >
                  Proceed to Purchase
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
};
