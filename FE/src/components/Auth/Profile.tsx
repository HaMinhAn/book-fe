import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Avatar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Snackbar,
} from "@mui/material";
import {
  PersonOutlined,
  ShoppingBagOutlined,
  HistoryOutlined,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { OrderHistory } from "../Orders/OrderHistory";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const Profile = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchingUserInfo, setFetchingUserInfo] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const isAdmin = AuthService.isAdmin();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  // Fetch user info when component mounts
  useEffect(() => {
    const getUserInfo = async () => {
      if (!isAuthenticated) return;

      setFetchingUserInfo(true);
      try {
        const info = await AuthService.getUserInfo();
        setUserInfo(info);
        setFormData({
          firstName: info.firstName || "",
          lastName: info.lastName || "",
          email: info.email || "",
          address: info.address || "",
          city: "",
          state: "",
          zipCode: "",
          phone: info.phoneNumber || "",
        });
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to load your profile information. Please try again.");
      } finally {
        setFetchingUserInfo(false);
      }
    };

    getUserInfo();
  }, [isAuthenticated]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Transform form data to match API expectations
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phoneNumber: formData.phone, // Note API expects 'phoneNumber' not 'phone'
      };

      const success = await updateProfile(userData);
      if (success) {
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUserInfo) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
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
          mb: 2,
        }}
      >
        <Typography variant="h4">My Account</Typography>

        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/admin"
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Go to Admin Dashboard
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="profile tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<PersonOutlined />} label="Personal Information" />
          <Tab icon={<ShoppingBagOutlined />} label="Current Orders" />
          <Tab icon={<HistoryOutlined />} label="Order History" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          <Box
            sx={{
              flex: "0 0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{ width: 120, height: 120, mb: 2, bgcolor: "primary.main" }}
            >
              {formData.firstName?.charAt(0) || ""}
              {formData.lastName?.charAt(0) || ""}
            </Avatar>
            <Typography variant="h6">
              {formData.firstName} {formData.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formData.email}
            </Typography>
          </Box>

          <Paper sx={{ flex: 1, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexWrap: "wrap", margin: -1 }}>
                <Box sx={{ width: { xs: "100%", sm: "50%" }, p: 1 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ width: { xs: "100%", sm: "50%" }, p: 1 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ width: "100%", p: 1 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled // Email should typically not be changed easily
                  />
                </Box>
                <Box sx={{ width: "100%", p: 1 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Box>
              </Box>

              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Shipping Address
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: "flex", flexWrap: "wrap", margin: -1 }}>
                <Box sx={{ width: "100%", p: 1 }}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ width: { xs: "100%", sm: "50%" }, p: 1 }}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ width: { xs: "100%", sm: "25%" }, p: 1 }}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ width: { xs: "100%", sm: "25%" }, p: 1 }}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" type="submit" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Save Changes"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Current Orders
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <OrderHistory showCurrentOrders={true} />
        </Paper>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order History
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <OrderHistory showCurrentOrders={false} />
        </Paper>
      </TabPanel>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};
