import { useState } from "react";
import { Box, TextField } from "@mui/material";
import { ShippingInfo } from "../../services/order.service";
import {
  validateName,
  validateEmail,
  validatePhoneNumber,
  validateAddress,
  validateZipCode,
  validateRequired,
} from "../../utils/validation";

interface ShippingFormProps {
  shippingInfo: ShippingInfo;
  onShippingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string>;
  onValidationChange?: (field: string, isValid: boolean, error: string) => void;
}

export const ShippingForm = ({
  shippingInfo,
  onShippingChange,
  errors = {},
  onValidationChange,
}: ShippingFormProps) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let validation;

    switch (name) {
      case "firstName":
        validation = validateName(value, "First name");
        break;
      case "lastName":
        validation = validateName(value, "Last name");
        break;
      case "address":
        validation = validateAddress(value);
        break;
      case "city":
        validation = validateRequired(value, "City");
        break;
      case "state":
        validation = validateRequired(value, "State");
        break;
      case "zipCode":
        validation = validateZipCode(value);
        break;
      case "email":
        validation = validateEmail(value);
        break;
      case "phone":
        validation = validatePhoneNumber(value);
        break;
      default:
        validation = { isValid: true, error: "" };
    }

    return validation;
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Call parent's onChange
    onShippingChange(e);

    // Clear field error if exists
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const validation = validateField(name, value);

    setFieldErrors((prev) => ({
      ...prev,
      [name]: validation.isValid ? "" : validation.error,
    }));

    // Notify parent of validation state
    if (onValidationChange) {
      onValidationChange(name, validation.isValid, validation.error);
    }
  };

  const getFieldError = (fieldName: string) => {
    return errors[fieldName] || fieldErrors[fieldName] || "";
  };
  return (
    <Box component="form" noValidate sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
          <TextField
            required
            fullWidth
            label="First Name"
            name="firstName"
            value={shippingInfo.firstName}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            error={!!getFieldError("firstName")}
            helperText={getFieldError("firstName")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
        <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
          <TextField
            required
            fullWidth
            label="Last Name"
            name="lastName"
            value={shippingInfo.lastName}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            error={!!getFieldError("lastName")}
            helperText={getFieldError("lastName")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
        <Box sx={{ width: "100%", mt: 1 }}>
          <TextField
            required
            fullWidth
            label="Street Address"
            name="address"
            value={shippingInfo.address}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            error={!!getFieldError("address")}
            helperText={getFieldError("address")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
        <Box sx={{ width: { xs: "100%", sm: "48%" }, mt: 1 }}>
          <TextField
            required
            fullWidth
            label="City"
            name="city"
            value={shippingInfo.city}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            error={!!getFieldError("city")}
            helperText={getFieldError("city")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
        <Box sx={{ width: { xs: "100%", sm: "23%" }, mt: 1 }}>
          <TextField
            required
            fullWidth
            label="State"
            name="state"
            value={shippingInfo.state}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            error={!!getFieldError("state")}
            helperText={getFieldError("state")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
        <Box sx={{ width: { xs: "100%", sm: "23%" }, mt: 1 }}>
          <TextField
            required
            fullWidth
            label="ZIP Code"
            name="zipCode"
            value={shippingInfo.zipCode}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            error={!!getFieldError("zipCode")}
            helperText={getFieldError("zipCode")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
        <Box sx={{ width: { xs: "100%", sm: "48%" }, mt: 1 }}>
          <TextField
            required
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={shippingInfo.email}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            error={!!getFieldError("email")}
            helperText={getFieldError("email")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
        <Box sx={{ width: { xs: "100%", sm: "48%" }, mt: 1 }}>
          <TextField
            required
            fullWidth
            label="Phone Number"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            error={!!getFieldError("phone")}
            helperText={getFieldError("phone")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
