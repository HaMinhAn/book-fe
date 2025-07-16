import {
  Box,
  useTheme,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  Home,
  Book,
  Person,
  ExitToApp,
  Login as LoginIcon,
  AutoStories,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Header } from "./Header";

export const MainLayout = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Close drawer when navigating to a new page
  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }, [location.pathname]);

  // Check if user is admin
  const isAdmin = user?.roles?.some((role: any) => role.name === "ROLE_ADMIN");

  const menuItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "Books", icon: <Book />, path: "/books" },
    { text: "Profile", icon: <Person />, path: "/profile" },
    ...(isAdmin
      ? [{ text: "Admin", icon: <AdminPanelSettings />, path: "/admin" }]
      : []),
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header
        scrolled={scrolled}
        onMobileMenuToggle={handleDrawerToggle}
        menuItems={menuItems}
      />

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 1 }}>
            <AutoStories color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" color="primary" fontWeight="bold">
              ECONOMY BOOKS
            </Typography>
          </Box>

          <List component="nav" sx={{ flexGrow: 1 }}>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  "&.Mui-selected": {
                    bgcolor: "primary.light",
                    "&:hover": {
                      bgcolor: "primary.light",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === item.path
                        ? "primary.main"
                        : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>

          {isAuthenticated ? (
            <List>
              <ListItemButton
                onClick={() => {
                  logout();
                  navigate("/");
                  setMobileOpen(false);
                }}
                sx={{ borderRadius: 2, mt: "auto", mb: 2 }}
              >
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          ) : (
            <List>
              <ListItemButton
                component={Link}
                to="/login"
                sx={{ borderRadius: 2, mt: "auto", mb: 2 }}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </List>
          )}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: { xs: 10, sm: 12 },
          mt: { xs: 0, sm: 0 },
          transition: "padding-top 0.3s ease",
          backgroundColor: theme.palette.background.default,
          margin: "0 auto",
          width: "100%",
          maxWidth: { xs: "95%", sm: "90%", md: "1200px" },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
