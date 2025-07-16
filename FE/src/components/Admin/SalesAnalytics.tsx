import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  TrendingUpOutlined,
  ShoppingCartOutlined,
  MenuBookOutlined,
  AttachMoneyOutlined,
} from "@mui/icons-material";
import AnalyticsService, {
  SalesAnalytics as SalesAnalyticsData,
} from "../../services/analytics.service";

export const SalesAnalytics = () => {
  const [analytics, setAnalytics] = useState<SalesAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await AnalyticsService.getSalesAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!analytics) {
    return <Alert severity="info">No analytics data available.</Alert>;
  }

  const statusData = Object.entries(analytics.orderStatusDistribution).map(
    ([status, count]) => ({
      name: status,
      value: count,
    })
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sales Analytics Dashboard
      </Typography>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AttachMoneyOutlined
                  sx={{ fontSize: 40, color: "success.main", mr: 2 }}
                />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    ${analytics.totalRevenue.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ShoppingCartOutlined
                  sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Total Orders
                  </Typography>
                  <Typography variant="h4">{analytics.totalOrders}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <MenuBookOutlined
                  sx={{ fontSize: 40, color: "info.main", mr: 2 }}
                />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Books Sold
                  </Typography>
                  <Typography variant="h4">
                    {analytics.totalBooksSold}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TrendingUpOutlined
                  sx={{ fontSize: 40, color: "warning.main", mr: 2 }}
                />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Avg Order Value
                  </Typography>
                  <Typography variant="h4">
                    ${analytics.averageOrderValue.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Selling Books Table */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Selling Books
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Book Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell align="right">Quantity Sold</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.topSellingBooks.slice(0, 10).map((book) => (
                    <TableRow key={book.bookId}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell align="right">{book.quantitySold}</TableCell>
                      <TableCell align="right">
                        ${book.revenue.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Order Status Distribution */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Status Distribution
            </Typography>
            <Box sx={{ mt: 2 }}>
              {statusData.map((status) => (
                <Box
                  key={status.name}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1,
                    borderBottom: "1px solid",
                    borderColor: "grey.200",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <Typography variant="body1">{status.name}</Typography>
                  <Chip label={status.value} color="primary" size="small" />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Category Sales Table */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sales by Category
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Books Sold</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="right">Orders</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.categorySales.map((category) => (
                    <TableRow key={category.category}>
                      <TableCell>{category.category}</TableCell>
                      <TableCell align="right">{category.booksSold}</TableCell>
                      <TableCell align="right">
                        ${category.revenue.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">{category.orderCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
