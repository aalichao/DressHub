import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import ItemCard from "../components/ItemCard";

interface WishlistItem {
  _id: string;
  item: {
    _id: string;
    title: string;
    dailyPrice: number;
    size?: string;
    category?: string;
    images?: string[];
  };
}

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const fetchWishlist = async () => {
    try {
      const res = await axiosClient.get("/wishlist");
      setWishlistItems(res.data);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleWishlistToggle = (itemId: string, isWishlisted: boolean) => {
    if (!isWishlisted) {
      // Item was removed from wishlist, refresh the list
      setWishlistItems(prev => prev.filter(wi => wi.item._id !== itemId));
    }
  };

  return (
    <Box className="p-4">
      <Typography component="h1" variant="h5" mb={3} fontWeight={600}>
        My Wishlist
      </Typography>

      {wishlistItems.length === 0 ? (
        <Typography color="text.secondary">
          Your wishlist is empty. Start adding items you love!
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {wishlistItems.map((wi) => (
            <Grid item xs={12} sm={6} md={4} key={wi._id}>
              <ItemCard 
                item={wi.item} 
                isWishlisted={true}
                onWishlistToggle={handleWishlistToggle}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

