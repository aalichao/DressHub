import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import {
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";

interface Item {
  _id: string;
  title: string;
  dailyPrice: number;
  size?: string;
  category?: string;
  images?: string[];
  description?: string;
}

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      const res = await axiosClient.get(`/items/${id}`);
      setItem(res.data);
    };
    fetchItem();
  }, [id]);

  const handleAddToCart = async () => {
    if (!item) return;
    await axiosClient.post("/cart", {
      itemId: item._id,
      rentalStart: startDate,
      rentalEnd: endDate,
    });
    alert("Added to cart!");
  };

  if (!item) return null;

  return (
    <Box className="p-4 flex flex-col md:flex-row gap-6">
      <Box flex={1}>
        <img
          src={item.images?.[0] || "https://via.placeholder.com/500x400"}
          alt={item.title}
          className="w-full rounded-2xl"
        />
      </Box>
      <Box flex={1} className="space-y-3">
        <Typography variant="h5" fontWeight={700}>
          {item.title}
        </Typography>
        <Typography>${item.dailyPrice} / day</Typography>
        <Typography>Size: {item.size}</Typography>
        <Typography>Category: {item.category}</Typography>
        <Typography variant="body2">{item.description}</Typography>

        <Box display="flex" flexDirection="column" gap={2} mt={3}>
          <TextField
            label="Rental start date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="Rental end date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button
            variant="contained"
            disabled={!startDate || !endDate}
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
