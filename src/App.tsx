import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  CircularProgress,
} from "@mui/material";
import { MainLayout } from "./components/Layout/MainLayout";
import { BookList } from "./components/Books/BookList";
import { BookDetail } from "./components/Books/BookDetail";
import { Cart } from "./components/Cart/Cart";
import { HomePage } from "./components/Home/HomePage";
import { CheckoutSimple } from "./components/Checkout/CheckoutSimple";
import { Purchase } from "./components/Purchase/Purchase";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { Profile } from "./components/Auth/Profile";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { AdminRoute } from "./components/Auth/AdminRoute";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// App content component that waits for auth initialization
const AppContent = () => {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="books" element={<BookList />} />
            <Route path="book/:id" element={<BookDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <CheckoutSimple />
                </ProtectedRoute>
              }
            />
            <Route
              path="purchase"
              element={
                <ProtectedRoute>
                  <Purchase />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
