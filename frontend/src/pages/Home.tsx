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

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  const fetchItems = async () => {
    const res = await axiosClient.get("/items", {
      params: { query, category, size },
    });
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchItems();
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
            <ItemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
