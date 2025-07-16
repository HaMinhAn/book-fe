import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Paper,
} from "@mui/material";
import {
  LocalShipping,
  VerifiedUser,
  SupportAgent,
  TrendingUp,
} from "@mui/icons-material";

export const HomePage = () => {
  const navigate = useNavigate();

  const featuredBooks = [
    {
      id: 1,
      title: "Economics 101",
      author: "John Smith",
      price: 29.99,
      imageUrl:
        "https://images.unsplash.com/photo-1585241936939-be4099591252?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    {
      id: 2,
      title: "Global Markets",
      author: "Sarah Johnson",
      price: 34.99,
      imageUrl:
        "https://images.unsplash.com/photo-1585241936939-be4099591252?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    {
      id: 3,
      title: "Investment Strategies",
      author: "Michael Brown",
      price: 24.99,
      imageUrl:
        "https://images.unsplash.com/photo-1601055283742-8b27e81b5553?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
  ];

  const features = [
    {
      icon: <LocalShipping color="primary" fontSize="large" />,
      title: "Free Shipping",
      description: "Free shipping on all orders over $50",
    },
    {
      icon: <VerifiedUser color="primary" fontSize="large" />,
      title: "Secure Payments",
      description: "Protected by industry-leading encryption",
    },
    {
      icon: <SupportAgent color="primary" fontSize="large" />,
      title: "24/7 Support",
      description: "Our customer service team is always available",
    },
    {
      icon: <TrendingUp color="primary" fontSize="large" />,
      title: "New Releases",
      description: "Fresh titles added every week",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: "relative",
          color: "white",
          mb: 4,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)`,
          height: "500px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container>
          <Box sx={{ maxWidth: { xs: "100%", md: "50%" }, py: 4 }}>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Discover Economic Knowledge
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              Browse our collection of top-rated economics and business books.
              From beginners to experts, we have resources for everyone.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/books")}
              sx={{ mt: 2 }}
            >
              Browse Books
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container sx={{ py: 4 }}>
        <Typography
          component="h2"
          variant="h4"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: "medium" }}
        >
          Why Choose Our Bookstore
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {feature.icon}
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Books Section */}
      <Box sx={{ bgcolor: "grey.50", py: 6 }}>
        <Container>
          <Typography
            component="h2"
            variant="h4"
            align="center"
            gutterBottom
            sx={{ mb: 4, fontWeight: "medium" }}
          >
            Featured Books
          </Typography>
          <Grid container spacing={4}>
            {featuredBooks.map((book) => (
              <Grid size={{ xs: 12, sm: 4 }} key={book.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 4,
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <Box
                    sx={{
                      position: "relative",
                      height: "200px",
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={book.imageUrl}
                      alt={book.title}
                      sx={{
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      height: "150px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h2"
                        sx={{ fontSize: "1.1rem", fontWeight: 600 }}
                      >
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        by {book.author}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      ${book.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/books")}
            >
              View All Books
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Container sx={{ py: 8 }}>
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "primary.light",
            color: "white",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Subscribe to Our Newsletter
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Get updates on new releases, special offers, and reading
            recommendations.
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <input
              type="email"
              placeholder="Your email address"
              style={{
                padding: "12px 16px",
                borderRadius: "4px",
                border: "none",
                width: "100%",
                maxWidth: "300px",
              }}
            />
            <Button variant="contained" color="secondary">
              Subscribe
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
