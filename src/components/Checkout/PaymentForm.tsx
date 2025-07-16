import {
  Box,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  FormHelperText,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  validateCreditCard,
  validateExpiryDate,
  validateCVV,
  formatCreditCard,
  formatExpiryDate,
} from "../../utils/validation";

interface PaymentFormProps {
  paymentMethod: string;
  onPaymentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export const PaymentForm = ({
  paymentMethod,
  onPaymentChange,
  onValidityChange,
}: PaymentFormProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate credit card fields
  const validateCreditCardFields = () => {
    if (paymentMethod !== "credit") {
      return true; // PayPal doesn't need validation
    }

    const cardValidation = validateCreditCard(cardNumber);
    const expiryValidation = validateExpiryDate(expiryDate);
    const cvvValidation = validateCVV(cvv);

    const newErrors: Record<string, string> = {};
    if (!cardValidation.isValid) newErrors.cardNumber = cardValidation.error;
    if (!expiryValidation.isValid)
      newErrors.expiryDate = expiryValidation.error;
    if (!cvvValidation.isValid) newErrors.cvv = cvvValidation.error;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes with formatting and validation
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCreditCard(e.target.value);
    setCardNumber(formatted);

    // Real-time validation
    const validation = validateCreditCard(formatted);
    setErrors((prev) => ({
      ...prev,
      cardNumber: validation.isValid ? "" : validation.error,
    }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);

    // Real-time validation
    const validation = validateExpiryDate(formatted);
    setErrors((prev) => ({
      ...prev,
      expiryDate: validation.isValid ? "" : validation.error,
    }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4);
    setCvv(value);

    // Real-time validation
    const validation = validateCVV(value);
    setErrors((prev) => ({
      ...prev,
      cvv: validation.isValid ? "" : validation.error,
    }));
  };

  // Notify parent of validation status
  useEffect(() => {
    const isValid = validateCreditCardFields();
    onValidityChange?.(isValid);
  }, [paymentMethod, cardNumber, expiryDate, cvv, onValidityChange]);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      <RadioGroup value={paymentMethod} onChange={onPaymentChange}>
        <FormControlLabel
          value="credit"
          control={<Radio />}
          label="Credit Card"
        />
        <Box
          sx={{
            ml: 4,
            mb: 2,
            display: paymentMethod === "credit" ? "block" : "none",
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ width: "100%" }}>
              <TextField
                required
                fullWidth
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                inputProps={{ maxLength: 23 }}
              />
            </Box>
            <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
              <TextField
                required
                fullWidth
                label="Expiry Date"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryChange}
                error={!!errors.expiryDate}
                helperText={errors.expiryDate}
                inputProps={{ maxLength: 5 }}
              />
            </Box>
            <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
              <TextField
                required
                fullWidth
                label="CVV"
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                error={!!errors.cvv}
                helperText={errors.cvv}
                inputProps={{ maxLength: 4 }}
              />
            </Box>
          </Box>
        </Box>
        <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
      </RadioGroup>
    </Box>
  );
};
