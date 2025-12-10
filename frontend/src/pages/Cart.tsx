import { useEffect, useCallback, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface CartItem {
  _id: string;
  rentalStart: string;
  rentalEnd: string;
  item: {
    _id: string;
    title: string;
    dailyPrice: number;
    depositAmount?: number;
    description?: string;
    category?: string;
    size?: string;
    genderTarget?: string;
    images?: string[];
  };
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCart = useCallback(async () => {
    const res = await axiosClient.get("/cart");
    setCartItems(res.data);
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: { count: res.data.length } }));
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const calculateRentalTotal = () => {
    return cartItems.reduce((total, ci) => {
      const days = calculateDays(ci.rentalStart, ci.rentalEnd);
      return total + (ci.item.dailyPrice * days);
    }, 0);
  };

  const calculateTotalDeposit = () => {
    return cartItems.reduce((total, ci) => {
      return total + (ci.item.depositAmount || 0);
    }, 0);
  };

  const calculateGrandTotal = () => {
    return calculateRentalTotal() + calculateTotalDeposit();
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await axiosClient.delete(`/cart/${cartItemId}`);
      setCartItems(prev => {
        const next = prev.filter(ci => ci._id !== cartItemId);
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: { count: next.length } }));
        return next;
      });
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      await axiosClient.post("/rentals/checkout", {
        cartItemIds: cartItems.map((ci) => ci._id),
      });
      alert("Checkout complete!");
      const res = await axiosClient.get("/cart");
      setCartItems(res.data);
      window.dispatchEvent(new CustomEvent("cart-updated", { detail: { count: res.data.length } }));
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Box className="p-4">
        <Typography component="h1" variant="h5" mb={3} fontWeight={600}>
          Your Cart
        </Typography>
        <Typography color="text.secondary">
          Your cart is empty. Browse items and add them to start renting!
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="p-4 max-w-4xl mx-auto">
      <Typography component="h1" variant="h5" mb={3} fontWeight={600}>
        Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {cartItems.map((ci) => {
          const days = calculateDays(ci.rentalStart, ci.rentalEnd);
          const totalPrice = ci.item.dailyPrice * days;

          return (
            <Card key={ci._id} sx={{ display: "flex", position: "relative" }}>
              <CardMedia
                component="img"
                sx={{ width: 160, aspectRatio: "4/5", objectFit: "cover", flexShrink: 0 }}
                image={ci.item.images?.[0] || "https://via.placeholder.com/160x200"}
                alt={ci.item.title}
              />
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box>
                      <Typography component="h2" variant="h6" fontWeight={600}>
                        {ci.item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {ci.item.category && `${ci.item.category.charAt(0).toUpperCase() + ci.item.category.slice(1)}`}
                        {ci.item.genderTarget && ` • ${ci.item.genderTarget.charAt(0).toUpperCase() + ci.item.genderTarget.slice(1)}`}
                        {ci.item.size && ` • Size ${ci.item.size}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {ci.item.description && ci.item.description.slice(0, 100)}
                        {ci.item.description && ci.item.description.length > 100 && '...'}
                      </Typography>
                    </Box>
                    <IconButton 
                      onClick={() => handleRemoveItem(ci._id)}
                      color="error"
                      aria-label="remove from cart"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      Rental Period: {new Date(ci.rentalStart).toLocaleDateString()} - {new Date(ci.rentalEnd).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {days} {days === 1 ? 'day' : 'days'}
                    </Typography>
                    <Typography component="h2" variant="h6" color="primary" mt={1}>
                      Rental: ${ci.item.dailyPrice}/day × {days} days = ${totalPrice.toFixed(2)}
                    </Typography>
                    {ci.item.depositAmount && (
                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        Refundable deposit: ${ci.item.depositAmount.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Box>
            </Card>
          );
        })}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Paper elevation={2} sx={{ p: 3, backgroundColor: "#f5f5f5" }}>
        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body1">Rental Subtotal</Typography>
            <Typography variant="body1">${calculateRentalTotal().toFixed(2)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body1">Total Deposits (refundable)</Typography>
            <Typography variant="body1">${calculateTotalDeposit().toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography component="h2" variant="h6">Total Due Now</Typography>
            <Typography variant="h5" fontWeight={700} color="primary">
              ${calculateGrandTotal().toFixed(2)}
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" display="block" mb={2}>
          *Deposits will be refunded upon return of items in good condition
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          fullWidth
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </Button>
      </Paper>
    </Box>
  );
}
