import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  ShoppingCart,
  Menu as MenuIcon,
  Home,
  Book,
  Person,
  ExitToApp,
  Login as LoginIcon,
  LocalLibrary,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

interface HeaderProps {
  scrolled: boolean;
  onMobileMenuToggle: () => void;
  menuItems: {
    text: string;
    icon: React.ReactNode;
    path: string;
  }[];
}

export const Header = ({
  scrolled,
  onMobileMenuToggle,
  menuItems,
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const { totalItems } = useCart();

  return (
    <AppBar
      position="fixed"
      sx={{
        background: scrolled
          ? "linear-gradient(90deg, #1565c0 0%, #1976d2 50%, #2196f3 100%)"
          : "linear-gradient(90deg, #1976d2 0%, #304ffe 100%)",
        backgroundSize: "200% 200%",
        animation: "gradientAnimation 15s ease infinite",
        boxShadow: scrolled
          ? "0 4px 20px rgba(0, 0, 0, 0.15)"
          : "0 4px 20px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        height: scrolled ? 64 : 70,
      }}
    >
      <Toolbar
        sx={{
          py: scrolled ? 0 : 0.5,
          transition: "all 0.3s ease",
          width: "100%",
          maxWidth: { xs: "95%", sm: "90%", md: "1200px" },
          margin: "0 auto",
        }}
      >
        {/* Mobile menu button - only visible on small screens */}
        <IconButton
          color="inherit"
          aria-label="open menu"
          onClick={onMobileMenuToggle}
          sx={{
            display: { xs: "flex", sm: "none" },
            mr: 1,
            transition: "all 0.2s",
            "&:hover": {
              transform: "scale(1.1)",
              bgcolor: "rgba(255,255,255,0.2)",
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo and branding */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            flexGrow: 1,
            gap: 1,
            "&:hover .logo-icon": {
              transform: "scale(1.1) rotate(-10deg)",
              animation: "glow 1.5s infinite",
            },
          }}
        >
          <Box
            className="logo-icon"
            sx={{
              bgcolor: "white",
              color: "primary.main",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 0.8,
              transition: "transform 0.3s, box-shadow 0.3s",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            <LocalLibrary fontSize="small" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.5,
              textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
              fontFamily: "'Playfair Display', serif",
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              lineHeight: 1.1,
            }}
          >
            ECONOMY
            <Box
              component="span"
              sx={{
                fontSize: "0.7em",
                fontWeight: 400,
                letterSpacing: 2,
                opacity: 0.9,
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              BOOKS
            </Box>
          </Typography>
        </Box>

        {/* Navigation */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            gap: 0.5,
            alignItems: "center",
          }}
        >
          {menuItems.map((item) => (
            <Button
              key={item.text}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                color: "#fff",
                position: "relative",
                mx: 0.5,
                borderRadius: "20px",
                px: 2,
                transition: "all 0.3s",
                bgcolor:
                  location.pathname === item.path
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                "&:hover": {
                  transform: "scale(1.08)",
                },
              }}
            >
              {item.text}
            </Button>
          ))}

          {isAuthenticated ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 1 }}>
              <Tooltip title="Go to Profile">
                <IconButton
                  component={Link}
                  to="/profile"
                  sx={{
                    p: 0.5,
                    border: "2px solid white",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                    },
                  }}
                >
                  {user?.firstName ? (
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "secondary.main",
                        fontWeight: "bold",
                      }}
                    >
                      {user.firstName[0]}
                      {user.lastName?.[0]}
                    </Avatar>
                  ) : (
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "secondary.main",
                      }}
                    >
                      <Person />
                    </Avatar>
                  )}
                </IconButton>
              </Tooltip>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<ExitToApp />}
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                sx={{
                  borderRadius: 20,
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "white",
                    transform: "scale(1.05)",
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<LoginIcon />}
              component={Link}
              to="/login"
              sx={{
                borderRadius: 20,
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "white",
                  transform: "scale(1.05)",
                },
                ml: 1,
              }}
            >
              Login
            </Button>
          )}
        </Box>

        {/* Cart Button */}
        <Tooltip title="View Cart">
          <IconButton
            color="inherit"
            component={Link}
            to="/cart"
            sx={{
              ml: { xs: "auto", sm: 2 },
              bgcolor: "rgba(255,255,255,0.1)",
              transition: "all 0.3s",
              border:
                totalItems > 0 ? "1px solid rgba(255,255,255,0.3)" : "none",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.3)",
                transform: "translateY(-3px)",
                boxShadow:
                  totalItems > 0 ? "0 0 10px rgba(255,255,255,0.5)" : "none",
              },
              position: "relative",
            }}
          >
            <Badge
              badgeContent={totalItems}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: 10,
                  height: 18,
                  minWidth: 18,
                  padding: "0 4px",
                  top: -10,
                  right: -10,
                  transform: totalItems > 0 ? "scale(1.2)" : "scale(1)",
                  transition: "transform 0.2s",
                },
              }}
            >
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
