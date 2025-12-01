import { Card, CardMedia, CardContent, Typography, IconButton, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function ItemCard({ item }: { item: any }) {
  const [wishlisted, setWishlisted] = useState(false);
  const navigate = useNavigate();

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!wishlisted) {
      await axiosClient.post("/wishlist", { itemId: item._id });
      setWishlisted(true);
    } else {
      await axiosClient.delete(`/wishlist/${item._id}`);
      setWishlisted(false);
    }
  };

  return (
    <Card
      className="rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/items/${item._id}`)}
    >
      <Box position="relative">
        <CardMedia
          component="img"
          height="200"
          image={item.images?.[0] || "https://via.placeholder.com/300x200"}
        />
        <IconButton
          onClick={toggleWishlist}
          sx={{ position: "absolute", top: 8, right: 8, backgroundColor: "white" }}
        >
          {wishlisted ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600}>
          {item.title}
        </Typography>
        <Typography variant="body2">
          ${item.dailyPrice.toFixed(2)} / day • Size {item.size || "N/A"}
        </Typography>
      </CardContent>
    </Card>
  );
}
