import { useState, FormEvent } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Grid,
  Alert,
  Stack,
  List,
  ListItem,
  ListItemText,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function Upload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [genderTarget, setGenderTarget] = useState("");
  const [dailyPrice, setDailyPrice] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [condition, setCondition] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !dailyPrice) {
      setError("Title and daily price are required.");
      return;
    }

    const oversized = files.find((f) => f.size > 2 * 1024 * 1024);
    if (oversized) {
      setError(`"${oversized.name}" is too large. Please keep images under 2 MB.`);
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        title: title.trim(),
        dailyPrice: Number(dailyPrice),
      };

      if (description) payload.description = description.trim();
      if (category) payload.category = category.trim();
      if (size) payload.size = size.trim();
      if (genderTarget) payload.genderTarget = genderTarget.trim();
      if (depositAmount) payload.depositAmount = Number(depositAmount);
      if (condition) payload.condition = condition.trim();
      if (files.length) {
        const images = await Promise.all(files.map(readFileAsDataUrl));
        payload.images = images;
      }

      const res = await axiosClient.post("/items", payload);
      setSuccess("Item uploaded successfully!");
      const newId = res.data?._id;
      if (newId) {
        setTimeout(() => navigate(`/items/${newId}`), 500);
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError("Please log in to upload an item.");
      } else {
        setError(err?.response?.data?.error || "Failed to upload item.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, px: 2 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography component="h1" variant="h5" fontWeight={700} gutterBottom>
          Upload a garment
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Fill out the details below to list your item for rental.
        </Typography>

        <Stack spacing={2} component="form" onSubmit={handleSubmit} mt={2}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />

          {/* Category + Size */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>

          {/* Gender target (select) + Condition */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label=""
                value={genderTarget}
                onChange={(e) => setGenderTarget(e.target.value)}
                fullWidth
                size="medium"
                SelectProps={{
                  displayEmpty: true,
                }}
              >
                <MenuItem value="">
                  <em>Select Gender</em>
                </MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Unisex">Unisex</MenuItem>
              </TextField>

            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>

          {/* Prices */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Daily price"
                type="number"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(e.target.value)}
                required
                fullWidth
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Deposit amount"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                fullWidth
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
          </Grid>

          {/* Images */}
          <Box>
            <Button variant="outlined" component="label">
              Select images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {files.length > 0 && (
              <List dense sx={{ mt: 1 }}>
                {files.map((file) => (
                  <ListItem key={file.name}>
                    <ListItemText
                      primary={file.name}
                      secondary={`${Math.round(file.size / 1024)} KB`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mt={0.5}
            >
              Images are sent as data URLs and stored with the item. Keep files
              under 2 MB each.
            </Typography>
          </Box>

          {/* Actions */}
          <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload item"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
