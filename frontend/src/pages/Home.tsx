import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient.ts";
import { TextField, Box, MenuItem, Button } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import ItemCard from "../components/ItemCard.tsx";

interface Item {
  _id: string;
  title: string;
  dailyPrice: number;
  size?: string;
  category?: string;
  images?: string[];
}

interface WishlistItemResponse {
  _id: string;
  item?: Item;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [genderTarget, setGenderTarget] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [wishlistItemIds, setWishlistItemIds] = useState<Set<string>>(new Set());

  const fetchWishlist = async () => {
    try {
      const res = await axiosClient.get<WishlistItemResponse[]>("/wishlist");
      const itemIds = new Set<string>(
        res.data.map((wi) => wi.item?._id).filter((id): id is string => Boolean(id))
      );
      setWishlistItemIds(itemIds);
    } catch {
      // User not authenticated or error fetching wishlist
      setWishlistItemIds(new Set());
    }
  };

  const fetchItems = async () => {
    const res = await axiosClient.get("/items", {
      params: { query, category, size, genderTarget },
    });
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchItems();
  };

  const handleWishlistToggle = (itemId: string, isWishlisted: boolean) => {
    setWishlistItemIds(prev => {
      const newSet = new Set(prev);
      if (isWishlisted) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  return (
    <Box className="p-4">
      <Box display="flex" gap={2} mb={3} className="flex-wrap">
        <TextField
          label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="dress">Dress</MenuItem>
          <MenuItem value="suit">Suit</MenuItem>
          <MenuItem value="jacket">Jacket</MenuItem>
        </TextField>
        <TextField
          select
          label="Gender"
          value={genderTarget}
          onChange={(e) => setGenderTarget(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="unisex">Unisex</MenuItem>
        </TextField>
        <TextField
          label="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          sx={{ minWidth: 120 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <ItemCard 
              item={item} 
              isWishlisted={wishlistItemIds.has(item._id)}
              onWishlistToggle={handleWishlistToggle}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
