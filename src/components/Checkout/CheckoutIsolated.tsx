import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import OrderService, { ShippingInfo } from "../../services/order.service";
import AuthService from "../../services/auth.service";
import CartService from "../../services/cart.service";
import { ShippingForm } from "./ShippingForm";
import { PaymentForm } from "./PaymentForm";
import { OrderSummary } from "./OrderSummary";

const steps = ["Shipping Information", "Payment Details", "Review Order"];

interface CartItem {
  id: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export const CheckoutIsolated = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    email: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  const navigate = useNavigate();

  const shipping = 5.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  // Load data on component mount
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        // Load user info and cart data in parallel
        const [userInfo, cartResponse] = await Promise.all([
          AuthService.getUserInfo(),
          CartService.getUserCart(),
        ]);

        if (mounted) {
          // Set user info
          setShippingInfo({
            firstName: userInfo.firstName || "",
            lastName: userInfo.lastName || "",
            email: userInfo.email || "",
            address: userInfo.address || "",
            city: "",
            state: "",
            zipCode: "",
            phone: userInfo.phoneNumber || "",
          });

          // Set cart data
          const cartItems: CartItem[] =
            cartResponse.items?.map((item: any) => ({
              id: item.bookId,
              title: item.title,
              author: item.author,
              price: item.price,
              quantity: item.quantity,
              imageUrl: item.imageUrl,
            })) || [];

          setItems(cartItems);
          setSubtotal(cartResponse.totalPrice || 0);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        if (mounted) {
          setError("Failed to load checkout data");
        }
      } finally {
        if (mounted) {
          setInitialLoad(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateShippingInfo = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "address",
      "city",
      "state",
      "zipCode",
      "email",
    ];
    for (const field of requiredFields) {
      if (!shippingInfo[field as keyof ShippingInfo]) {
        setError(`Please fill in all required shipping information fields`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const clearCart = async () => {
    try {
      await CartService.clearCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create order via API
      await OrderService.createOrder({
        shippingInfo,
        paymentMethod,
      });

      // Clear the cart after successful order
      await clearCart();

      setOrderPlaced(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err: any) {
      console.error("Error placing order:", err);
      setError(
        err.response?.data?.message ||
          "Failed to place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStepClick = (step: number) => {
    if (activeStep === 0 && step > 0) {
      if (!validateShippingInfo()) {
        return;
      }
    }
    setActiveStep(step);
  };

  if (initialLoad) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Your cart is empty
        </Alert>
        <Button variant="contained" onClick={() => navigate("/books")}>
          Browse Books
        </Button>
      </Box>
    );
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ShippingForm
            shippingInfo={shippingInfo}
            onShippingChange={handleShippingChange}
          />
        );
      case 1:
        return (
          <PaymentForm
            paymentMethod={paymentMethod}
            onPaymentChange={handlePaymentChange}
          />
        );
      case 2:
        return (
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            shippingInfo={shippingInfo}
          />
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step
            key={label}
            onClick={() => handleStepClick(index)}
            sx={{ cursor: "pointer" }}
          >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 66.66%" } }}>
          <Paper sx={{ p: 3 }}>
            {getStepContent(activeStep)}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button onClick={handleBack} disabled={activeStep === 0}>
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Place Order"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={activeStep === 0 && !validateShippingInfo()}
                >
                  Next
                </Button>
              )}
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 33.33%" } }}>
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
                  <Typography>Subtotal ({items.length} items)</Typography>
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Tax</Typography>
                  <Typography>${tax.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">${total.toFixed(2)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Snackbar open={orderPlaced} autoHideDuration={3000}>
        <Alert severity="success">
          Order placed successfully! Redirecting to homepage...
        </Alert>
      </Snackbar>
    </Box>
  );
};
