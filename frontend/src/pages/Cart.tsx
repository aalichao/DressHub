import { useEffect, useCallback, useState, startTransition } from "react";
import axiosClient from "../api/axiosClient";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface CartItem {
  _id: string;
  rentalStart: string;
  rentalEnd: string;
  item: {
    title: string;
    dailyPrice: number;
  };
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCart = useCallback(async () => {
    const res = await axiosClient.get("/cart");
    startTransition(() => {
      setCartItems(res.data);
    });
  }, []);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  const handleCheckout = async () => {
    await axiosClient.post("/rentals/checkout", {
      cartItemIds: cartItems.map((ci) => ci._id),
    });
    alert("Checkout complete!");
    void fetchCart();
  };

  return (
    <Box className="p-4">
      <Typography variant="h5" mb={2}>Your Cart</Typography>
      <List>
        {cartItems.map((ci) => (
          <ListItem key={ci._id} divider>
            <ListItemText
              primary={ci.item.title}
              secondary={`From ${ci.rentalStart.slice(0, 10)} to ${ci.rentalEnd.slice(0, 10)} • $${ci.item.dailyPrice}/day`}
            />
          </ListItem>
        ))}
      </List>
      {cartItems.length > 0 && (
        <Button variant="contained" onClick={handleCheckout}>
          Checkout
        </Button>
      )}
    </Box>
  );
}
