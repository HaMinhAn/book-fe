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
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { validateUsername, validateRequired } from "../../utils/validation";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Field-specific error states
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // Validation handlers
  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (usernameError) {
      const validation = validateUsername(value);
      setUsernameError(validation.isValid ? "" : validation.error);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) {
      const validation = validateRequired(value, "Password");
      setPasswordError(validation.isValid ? "" : validation.error);
    }
  };

  const validateForm = (): boolean => {
    const usernameValidation = validateUsername(username);
    const passwordValidation = validateRequired(password, "Password");

    setUsernameError(
      usernameValidation.isValid ? "" : usernameValidation.error
    );
    setPasswordError(
      passwordValidation.isValid ? "" : passwordValidation.error
    );

    return usernameValidation.isValid && passwordValidation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form before submission
    if (!validateForm()) {
      setError("Please fix the errors above before submitting");
      return;
    }

    setLoading(true);

    try {
      console.log("Login attempt with username:", username);
      const success = await login(username.trim(), password);
      console.log("Login result:", success);

      if (success) {
        navigate("/profile");
      } else {
        setError("Invalid username or password");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.statusText ||
          "Unknown error";
        setError(`Login failed: ${errorMessage}`);
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        setError(
          "No response from server. Please check your internet connection and try again."
        );
        console.error("No response:", error.request);
      } else {
        setError(`Error: ${error.message || "An unexpected error occurred"}`);
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
          maxWidth: "450px",
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
            <LockOutlined />
          </Box>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            error={!!usernameError}
            helperText={usernameError}
            onChange={(e) => handleUsernameChange(e.target.value)}
            onBlur={() => {
              const validation = validateUsername(username);
              setUsernameError(validation.isValid ? "" : validation.error);
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            error={!!passwordError}
            helperText={passwordError}
            onChange={(e) => handlePasswordChange(e.target.value)}
            onBlur={() => {
              const validation = validateRequired(password, "Password");
              setPasswordError(validation.isValid ? "" : validation.error);
            }}
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
              !!usernameError ||
              !!passwordError ||
              !username ||
              !password
            }
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Link component={RouterLink} to="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
