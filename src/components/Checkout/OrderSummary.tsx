import { Box, Typography, Divider } from "@mui/material";
import { ShippingInfo } from "../../services/order.service";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingInfo: ShippingInfo;
}

export const OrderSummary = ({
  items,
  subtotal,
  shipping,
  tax,
  total,
  shippingInfo,
}: OrderSummaryProps) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <Box sx={{ maxHeight: "300px", overflow: "auto", mb: 2 }}>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              py: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ mr: 2, width: 60, height: 60, flexShrink: 0 }}>
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                ${item.price.toFixed(2)} x {item.quantity}
              </Typography>
            </Box>
            <Typography variant="subtitle1">
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Subtotal</Typography>
          <Typography>${subtotal.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Shipping</Typography>
          <Typography>${shipping.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Tax</Typography>
          <Typography>${tax.toFixed(2)}</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1">Total</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            ${total.toFixed(2)}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Shipping Information:
        </Typography>
        <Typography variant="body2">
          {shippingInfo.firstName} {shippingInfo.lastName}
        </Typography>
        <Typography variant="body2">{shippingInfo.address}</Typography>
        <Typography variant="body2">
          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
        </Typography>
        <Typography variant="body2">{shippingInfo.email}</Typography>
        <Typography variant="body2">{shippingInfo.phone}</Typography>
      </Box>
    </Box>
  );
};
