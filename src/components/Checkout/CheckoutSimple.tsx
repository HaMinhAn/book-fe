import { Box, Typography } from "@mui/material";

export const CheckoutSimple = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Simple Checkout Test
      </Typography>
      <Typography>
        This is a simple test component to verify no re-render issues exist.
      </Typography>
    </Box>
  );
};
