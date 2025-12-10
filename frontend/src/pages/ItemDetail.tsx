import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface Item {
  _id: string;
  title: string;
  dailyPrice: number;
  depositAmount?: number;
  available: boolean;
  owner: string;
  size?: string;
  category?: string;
  genderTarget?: string;
  images?: string[];
  description?: string;
}

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const today = dayjs();

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      const res = await axiosClient.get(`/items/${id}`);
      setItem(res.data);
    };
    const fetchMe = async () => {
      try {
        const res = await axiosClient.get("/users/me");
        setCurrentUserId(res.data._id || res.data.id || "");
      } catch {
        setCurrentUserId("");
      }
    };
    const fetchWishlist = async () => {
      try {
        const res = await axiosClient.get("/wishlist");
        const exists = res.data.some((wi: any) => wi.item?._id === id);
        setWishlisted(exists);
      } catch {
        setWishlisted(false);
      }
    };
    fetchItem();
    fetchMe();
    fetchWishlist();
  }, [id]);

  const handleAddToCart = async () => {
    if (!item || !startDate || !endDate) return;
    try {
      await axiosClient.post("/cart", {
        itemId: item._id,
        rentalStart: startDate.toISOString(),
        rentalEnd: endDate.toISOString(),
      });
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      // If unauthorized, show login prompt
      if ((error as any)?.response?.status === 401) {
        setShowLoginPrompt(true);
      }
    }
  };

  const handleToggleWishlist = async () => {
    if (!item) return;
    try {
      if (!wishlisted) {
        await axiosClient.post("/wishlist", { itemId: item._id });
        setWishlisted(true);
      } else {
        await axiosClient.delete(`/wishlist/${item._id}`);
        setWishlisted(false);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setShowLoginPrompt(true);
      } else {
        console.error("Error toggling wishlist:", error);
      }
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    return endDate.diff(startDate, "day") + 1;
  };

  const calculateTotal = () => {
    if (!item || !startDate || !endDate) return 0;
    return item.dailyPrice * calculateDays();
  };

  if (!item) return null;

  const isOwner = currentUserId && item.owner === currentUserId;
  const notAvailable = !item.available || isOwner;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="p-4 max-w-6xl mx-auto">
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
          {/* Image Section - Made Smaller */}
          <Box sx={{ width: { xs: "100%", md: "400px" }, flexShrink: 0 }}>
            <img
              src={item.images?.[0] || "https://via.placeholder.com/400x600"}
              alt={item.title}
              style={{
                width: "100%",
                height: "auto",
                aspectRatio: "2/3",
                borderRadius: "16px",
                objectFit: "cover",
                maxHeight: "600px",
              }}
            />
          </Box>

          {/* Details Section */}
          <Box flex={1}>
            <Typography component="h1" variant="h4" fontWeight={700} mb={2} color="text.primary">
              {item.title}
            </Typography>
            
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              {/* Availability Badge */}
              <Box>
                {!notAvailable ? (
                  <Box 
                    sx={{ 
                      display: "inline-block",
                      px: 2, 
                      py: 0.5, 
                      backgroundColor: "#4caf50", 
                      color: "white",
                      borderRadius: 1,
                      fontWeight: 600,
                    }}
                  >
                    ✓ Available
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      display: "inline-block",
                      px: 2, 
                      py: 0.5, 
                      backgroundColor: isOwner ? "#ff9800" : "#f44336", 
                      color: "white",
                      borderRadius: 1,
                      fontWeight: 600,
                    }}
                  >
                    {isOwner ? "Your listing" : "Currently Rented"}
                  </Box>
                )}
              </Box>

              {/* Wishlist button */}
              <Button
                variant={wishlisted ? "contained" : "outlined"}
                color="primary"
                size="small"
                onClick={handleToggleWishlist}
              >
                {wishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </Box>

            <Typography component="h2" variant="h5" color="primary" mb={1}>
              ${item.dailyPrice.toFixed(2)} / day
            </Typography>

            {item.depositAmount && (
              <Typography variant="body2" color="text.secondary" mb={3}>
                Refundable deposit: ${item.depositAmount.toFixed(2)}
              </Typography>
            )}

            <Box mb={3}>
              {item.category && (
                <Typography variant="body1" mb={1} color="text.primary">
                  <strong>Category:</strong> {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Typography>
              )}
              {item.genderTarget && (
                <Typography variant="body1" mb={1} color="text.primary">
                  <strong>For:</strong> {item.genderTarget.charAt(0).toUpperCase() + item.genderTarget.slice(1)}
                </Typography>
              )}
              {item.size && (
                <Typography variant="body1" mb={1} color="text.primary">
                  <strong>Size:</strong> {item.size}
                </Typography>
              )}
            </Box>

            <Typography variant="body1" color="text.primary" mb={4}>
              {item.description}
            </Typography>

            {/* Rental Dates Section */}
            <Paper elevation={2} sx={{ p: 3, backgroundColor: "#f9f9f9" }}>
              <Typography component="h2" variant="h6" mb={2}>
                Select Rental Period
              </Typography>

              {notAvailable && (
                <Box 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    backgroundColor: isOwner ? "#fff3e0" : "#ffebee", 
                    borderRadius: 2,
                    border: isOwner ? "1px solid #ff9800" : "1px solid #f44336"
                  }}
                >
                  <Typography variant="body2" color="error" fontWeight={600}>
                    {isOwner
                      ? "You cannot rent your own listing."
                      : "This item is currently rented and unavailable for booking."}
                  </Typography>
                </Box>
              )}

              <Box display="flex" flexDirection="column" gap={2}>
                <DatePicker
                  label="Rental Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  minDate={today}
                  disabled={!!notAvailable}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />

                <DatePicker
                  label="Rental End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  minDate={startDate || today}
                  disabled={!startDate || !!notAvailable}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />

                {startDate && endDate && !notAvailable && (
                  <Box 
                    sx={{ 
                      mt: 2, 
                      p: 2, 
                      backgroundColor: "#e3f2fd", 
                      borderRadius: 2 
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Duration: {calculateDays()} {calculateDays() === 1 ? "day" : "days"}
                    </Typography>
                    <Typography component="h3" variant="h6" color="primary" mt={1}>
                      Total: ${calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                )}

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={!startDate || !endDate || !!notAvailable}
                  onClick={handleAddToCart}
                  sx={{ mt: 2 }}
                >
                  {notAvailable ? (isOwner ? "Your listing" : "Not Available") : "Add to Cart"}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      <Dialog open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)}>
        <DialogTitle>Login required</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Please login to rent this item.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => { e.stopPropagation(); setShowLoginPrompt(false); }}>Cancel</Button>
          <Button variant="contained" onClick={(e) => { e.stopPropagation(); navigate("/login"); }}>Login</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
