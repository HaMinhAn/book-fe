import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonAddOutlined,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../utils/validation";

export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  // Individual field validation handlers
  const validateField = (name: string, value: string) => {
    let validation;

    switch (name) {
      case "username":
        validation = validateUsername(value);
        break;
      case "firstName":
        validation = validateName(value, "First name");
        break;
      case "lastName":
        validation = validateName(value, "Last name");
        break;
      case "email":
        validation = validateEmail(value);
        break;
      case "password":
        validation = validatePassword(value);
        break;
      case "confirmPassword":
        validation = validatePassword(value, formData.password);
        break;
      default:
        validation = { isValid: true, error: "" };
    }

    return validation;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const validation = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: validation.isValid ? "" : validation.error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate all required fields
    const validations = {
      username: validateField("username", formData.username),
      firstName: validateField("firstName", formData.firstName),
      lastName: validateField("lastName", formData.lastName),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword
      ),
    };

    Object.entries(validations).forEach(([field, validation]) => {
      if (!validation.isValid) {
        newErrors[field] = validation.error;
      }
    });

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    // Validate the form
    if (!validateForm()) {
      setGeneralError("Please fix the errors above before submitting");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const success = await register(userData);

      if (success) {
        navigate("/profile");
      } else {
        setGeneralError("Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error.response?.data?.message) {
        setGeneralError(error.response.data.message);
      } else {
        setGeneralError(
          "An error occurred during registration. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        py: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: "600px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              bgcolor: "primary.main",
              p: 2,
              borderRadius: "50%",
              color: "white",
              mb: 1,
            }}
          >
            <PersonAddOutlined />
          </Box>
          <Typography component="h1" variant="h5">
            Create an Account
          </Typography>
        </Box>

        {generalError && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {generalError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          {/* Username Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!fieldErrors.username}
            helperText={fieldErrors.username}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <Box sx={{ display: "flex", flexWrap: "wrap", margin: -1 }}>
            <Box sx={{ width: { xs: "100%", sm: "50%" }, p: 1 }}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!fieldErrors.firstName}
                helperText={fieldErrors.firstName}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
            <Box sx={{ width: { xs: "100%", sm: "50%" }, p: 1 }}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!fieldErrors.lastName}
                helperText={fieldErrors.lastName}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
            <Box sx={{ width: "100%", p: 1 }}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
            <Box sx={{ width: "100%", p: 1 }}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
            <Box sx={{ width: "100%", p: 1 }}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            {/* Optional fields */}
            <Box sx={{ width: "100%", p: 1 }}>
              <TextField
                fullWidth
                name="address"
                label="Address (Optional)"
                id="address"
                autoComplete="address-line1"
                value={formData.address}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
            <Box sx={{ width: "100%", p: 1 }}>
              <TextField
                fullWidth
                name="phoneNumber"
                label="Phone Number (Optional)"
                id="phoneNumber"
                autoComplete="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
            disabled={
              loading ||
              !!fieldErrors.username ||
              !!fieldErrors.firstName ||
              !!fieldErrors.lastName ||
              !!fieldErrors.email ||
              !!fieldErrors.password ||
              !!fieldErrors.confirmPassword ||
              !formData.username ||
              !formData.firstName ||
              !formData.lastName ||
              !formData.email ||
              !formData.password ||
              !formData.confirmPassword
            }
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign Up"
            )}
          </Button>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Link component={RouterLink} to="/login" variant="body2">
              {"Already have an account? Sign In"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
