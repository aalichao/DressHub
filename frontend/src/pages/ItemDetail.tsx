import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import {
  Box,
  Typography,
  Button,
  Paper,
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
  const today = dayjs();

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      const res = await axiosClient.get(`/items/${id}`);
      setItem(res.data);
    };
    fetchItem();
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
                borderRadius: "16px",
                objectFit: "cover",
                maxHeight: "600px",
              }}
            />
          </Box>

          {/* Details Section */}
          <Box flex={1}>
            <Typography variant="h4" fontWeight={700} mb={2} color="text.primary">
              {item.title}
            </Typography>
            
            {/* Availability Badge */}
            <Box mb={2}>
              {item.available ? (
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
                    backgroundColor: "#f44336", 
                    color: "white",
                    borderRadius: 1,
                    fontWeight: 600,
                  }}
                >
                  Currently Rented
                </Box>
              )}
            </Box>

            <Typography variant="h5" color="primary" mb={1}>
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
              <Typography variant="h6" mb={2}>
                Select Rental Period
              </Typography>

              {!item.available && (
                <Box 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    backgroundColor: "#ffebee", 
                    borderRadius: 2,
                    border: "1px solid #f44336"
                  }}
                >
                  <Typography variant="body2" color="error" fontWeight={600}>
                    This item is currently rented and unavailable for booking.
                  </Typography>
                </Box>
              )}

              <Box display="flex" flexDirection="column" gap={2}>
                <DatePicker
                  label="Rental Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  minDate={today}
                  disabled={!item.available}
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
                  disabled={!startDate || !item.available}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />

                {startDate && endDate && item.available && (
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
                    <Typography variant="h6" color="primary" mt={1}>
                      Total: ${calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                )}

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={!startDate || !endDate || !item.available}
                  onClick={handleAddToCart}
                  sx={{ mt: 2 }}
                >
                  {item.available ? "Add to Cart" : "Not Available"}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
