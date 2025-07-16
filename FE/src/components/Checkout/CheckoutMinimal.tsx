import { Box, Typography } from "@mui/material";

export const CheckoutMinimal = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout - Minimal Version
      </Typography>
      <Typography>
        This is a minimal checkout component to test for re-render issues.
      </Typography>
    </Box>
  );
};
