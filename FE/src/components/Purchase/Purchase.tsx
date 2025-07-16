import { useState } from "react";
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
  Grid,
  Container,
} from "@mui/material";
import {
  CheckCircle,
  ShoppingCart,
  CreditCard,
  LocalShipping,
} from "@mui/icons-material";
import { useCart } from "../../contexts/CartContext";
import OrderService, { ShippingInfo } from "../../services/order.service";
import { ShippingForm } from "../Checkout/ShippingForm";
import { PaymentForm } from "../Checkout/PaymentForm";
import { OrderSummary } from "../Checkout/OrderSummary";

const steps = [
  { label: "Cart Review", icon: <ShoppingCart /> },
  { label: "Shipping Information", icon: <LocalShipping /> },
  { label: "Payment Details", icon: <CreditCard /> },
  { label: "Order Confirmation", icon: <CheckCircle /> },
];

export const Purchase = () => {
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
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = items.length > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const orderRequest = {
        shippingInfo,
        paymentMethod,
      };

      const response = await OrderService.createOrder(orderRequest);
      setOrderNumber(response.id.toString());
      setOrderPlaced(true);
      await clearCart();
      setActiveStep(3); // Move to confirmation step
    } catch (err: any) {
      console.error("Error placing order:", err);
      setError(
        err.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return items.length > 0;
      case 1:
        return (
          shippingInfo.firstName &&
          shippingInfo.lastName &&
          shippingInfo.address &&
          shippingInfo.city &&
          shippingInfo.state &&
          shippingInfo.zipCode &&
          shippingInfo.email &&
          shippingInfo.phone
        );
      case 2:
        return paymentMethod !== "";
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Review Your Cart
              </Typography>
              {items.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="text.secondary">
                    Your cart is empty. Add some books before proceeding.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/books")}
                    sx={{ mt: 2 }}
                  >
                    Browse Books
                  </Button>
                </Box>
              ) : (
                <>
                  {items.map((item) => (
                    <Box key={item.id} mb={2}>
                      <Box
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        <Box sx={{ flex: "0 0 80px" }}>
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            style={{
                              width: "100%",
                              maxWidth: "80px",
                              height: "auto",
                              borderRadius: "4px",
                            }}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            by {item.author}
                          </Typography>
                          <Typography variant="body2">
                            Quantity: {item.quantity}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="h6">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))}
                  <Box mt={2}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="h6">Subtotal:</Typography>
                      <Typography variant="h6">
                        ${subtotal.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <ShippingForm
            shippingInfo={shippingInfo}
            onShippingChange={handleShippingChange}
          />
        );

      case 2:
        return (
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box sx={{ flex: { xs: 1, md: "0 0 66%" } }}>
              <PaymentForm
                paymentMethod={paymentMethod}
                onPaymentChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Box>
            <Box sx={{ flex: { xs: 1, md: "0 0 33%" } }}>
              <OrderSummary
                items={items}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                shippingInfo={shippingInfo}
              />
            </Box>
          </Box>
        );

      case 3:
        return (
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" gutterBottom color="success.main">
                Order Confirmed!
              </Typography>
              <Typography variant="h6" gutterBottom>
                Order Number: #{orderNumber}
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Thank you for your purchase! You will receive a confirmation
                email shortly.
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  onClick={() => navigate("/books")}
                  sx={{ mr: 2 }}
                >
                  Continue Shopping
                </Button>
                <Button variant="outlined" onClick={() => navigate("/profile")}>
                  View Order History
                </Button>
              </Box>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" gutterBottom align="center">
          Complete Your Purchase
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel icon={step.icon}>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent()}

          {activeStep < 3 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
                pt: 2,
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>

              {activeStep === 2 ? (
                <Button
                  variant="contained"
                  onClick={handlePlaceOrder}
                  disabled={!isStepValid() || loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Next
                </Button>
              )}
            </Box>
          )}
        </Paper>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};
