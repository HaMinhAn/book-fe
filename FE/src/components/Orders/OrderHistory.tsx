import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Snackbar,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  SelectChangeEvent,
  IconButton,
  Collapse,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FilterList, ExpandMore, ExpandLess } from "@mui/icons-material";
import OrderService, {
  OrderFilter,
  PaginationParams,
  PagedResponse,
  OrderResponse,
} from "../../services/order.service";

interface OrderItem {
  id: number;
  book: {
    id: number;
    title: string;
    author: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  shippingInfo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    email: string;
    phone: string;
  };
  paymentMethod: string;
}

interface OrderHistoryProps {
  showCurrentOrders?: boolean;
}

export const OrderHistory = ({
  showCurrentOrders = false,
}: OrderHistoryProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState<number | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");
  const [minAmountFilter, setMinAmountFilter] = useState<string>("");
  const [maxAmountFilter, setMaxAmountFilter] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  const fetchOrders = async (page = currentPage, size = pageSize) => {
    setLoading(true);
    setError(null);

    try {
      // Build filter object
      const filter: OrderFilter = {};
      if (statusFilter) filter.status = statusFilter;
      if (startDateFilter) filter.startDate = startDateFilter;
      if (endDateFilter) filter.endDate = endDateFilter;
      if (minAmountFilter) filter.minAmount = parseFloat(minAmountFilter);
      if (maxAmountFilter) filter.maxAmount = parseFloat(maxAmountFilter);

      // Build pagination params
      const pagination: PaginationParams = {
        page,
        size,
      };

      const response = await OrderService.getUserOrders(filter, pagination);

      // Check if we got a paged response
      if ("content" in response) {
        const pagedResponse = response as PagedResponse<OrderResponse>;
        setOrders(pagedResponse.content as Order[]);
        setTotalPages(pagedResponse.totalPages);
        setCurrentPage(pagedResponse.number);
        setTotalElements(pagedResponse.totalElements);
      } else {
        // If we got a regular array (non-paginated)
        setOrders(response as Order[]);
        setTotalPages(1);
        setCurrentPage(0);
        setTotalElements(response.length);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const filteredOrders = showCurrentOrders
    ? orders.filter((order) => order.status !== "DELIVERED")
    : orders.filter((order) => order.status === "DELIVERED");

  const confirmOrderReceived = async (orderId: number) => {
    setConfirmingOrderId(orderId);
    setError(null);

    try {
      await OrderService.confirmOrderReceived(orderId);

      // Update the order status in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "DELIVERED" } : order
        )
      );

      setSuccessMessage("Order confirmed as received. Thank you!");

      // Refetch orders to ensure data is up to date
      fetchOrders();
    } catch (err) {
      console.error("Error confirming order receipt:", err);
      setError("Failed to confirm order receipt. Please try again.");
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    // Material UI Pagination is 1-indexed, but our API is 0-indexed
    fetchOrders(page - 1, pageSize);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<string>) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    fetchOrders(0, newSize); // Reset to first page with new size
  };

  const handleFilterChange = () => {
    fetchOrders(0, pageSize); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setStatusFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setMinAmountFilter("");
    setMaxAmountFilter("");
    fetchOrders(0, pageSize); // Reset to first page with no filters
  };

  if (loading && orders.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && orders.length === 0) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (filteredOrders.length === 0 && !loading) {
    return (
      <Alert severity="info">
        {showCurrentOrders
          ? "You don't have any current orders."
          : "You don't have any order history yet."}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Filter section */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {showCurrentOrders ? "Current Orders" : "Order History"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              size="small"
            >
              <FilterList />
              {showFilters ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Filters
            </Typography>
          </Box>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
            <Box sx={{ width: { xs: "100%", sm: "47%", md: "31%" } }}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="PROCESSING">Processing</MenuItem>
                  <MenuItem value="SHIPPED">Shipped</MenuItem>
                  <MenuItem value="DELIVERED">Delivered</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "47%", md: "31%" } }}>
              <TextField
                label="From Date"
                type="date"
                size="small"
                fullWidth
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "47%", md: "31%" } }}>
              <TextField
                label="To Date"
                type="date"
                size="small"
                fullWidth
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "47%", md: "31%" } }}>
              <TextField
                label="Min Amount"
                type="number"
                size="small"
                fullWidth
                value={minAmountFilter}
                onChange={(e) => setMinAmountFilter(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "47%", md: "31%" } }}>
              <TextField
                label="Max Amount"
                type="number"
                size="small"
                fullWidth
                value={maxAmountFilter}
                onChange={(e) => setMaxAmountFilter(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 1 }}
          >
            <Button variant="outlined" size="small" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleFilterChange}
            >
              Apply Filters
            </Button>
          </Box>
        </Collapse>
      </Paper>

      {/* Loading indicator when refreshing with filters */}
      {loading && orders.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Success message snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />

      {filteredOrders.map((order) => (
        <Paper
          key={order.id}
          sx={{
            mb: 3,
            p: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Order #{order.id}
            </Typography>
            <Chip
              label={order.status}
              color={getStatusColor(order.status) as any}
              variant="outlined"
            />
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {showCurrentOrders ? "Placed" : "Delivered"} on{" "}
            {new Date(order.orderDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Payment Method: {order.paymentMethod}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Items Ordered:
          </Typography>

          {order.items.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
                borderBottom: "1px solid",
                borderColor: "grey.200",
                "&:last-child": {
                  borderBottom: "none",
                },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" fontWeight="medium">
                  {item.book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  by {item.book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {item.quantity}
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight="bold">
                ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Total: ${order.totalAmount.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            {showCurrentOrders ? (
              <>
                {order.status === "SHIPPED" && (
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => confirmOrderReceived(order.id)}
                    disabled={confirmingOrderId === order.id}
                  >
                    {confirmingOrderId === order.id ? (
                      <CircularProgress
                        size={20}
                        color="inherit"
                        sx={{ mr: 1 }}
                      />
                    ) : null}
                    Confirm Received
                  </Button>
                )}
                <Button variant="outlined" size="small">
                  Track Order
                </Button>
              </>
            ) : (
              <Button variant="outlined" size="small">
                Buy Again
              </Button>
            )}
            <Button variant="text" size="small">
              View Details
            </Button>
          </Box>
        </Paper>
      ))}

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
      />

      {/* Pagination controls */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 4,
            mb: 2,
          }}
        >
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="items-per-page-label">Items per page</InputLabel>
            <Select
              labelId="items-per-page-label"
              value={pageSize.toString()}
              onChange={handlePageSizeChange}
              label="Items per page"
            >
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="25">25</MenuItem>
              <MenuItem value="50">50</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              Showing{" "}
              {filteredOrders.length > 0 ? currentPage * pageSize + 1 : 0}-
              {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
              {totalElements}
            </Typography>

            <Pagination
              count={totalPages}
              page={currentPage + 1} // convert from 0-indexed to 1-indexed
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
