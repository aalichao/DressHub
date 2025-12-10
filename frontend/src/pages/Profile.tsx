import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
} from "@mui/material";

type ProfileForm = {
  name: string;
  gender: string;
  heightCm: string;
  weightKg: string;
};

type MyItem = {
  _id: string;
  title: string;
  category?: string;
  size?: string;
  genderTarget?: string;
  dailyPrice: number;
  depositAmount?: number;
  available: boolean;
};

export default function Profile() {
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    gender: "",
    heightCm: "",
    weightKg: "",
  });
  const [myItems, setMyItems] = useState<MyItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axiosClient.get("/users/me");
      setForm({
        name: res.data.name || "",
        gender: res.data.gender || "",
        heightCm: res.data.heightCm || "",
        weightKg: res.data.weightKg || "",
      });
    };
    const fetchItems = async () => {
      try {
        setLoadingItems(true);
        const res = await axiosClient.get<MyItem[]>("/items/mine");
        setMyItems(res.data);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchProfile();
    fetchItems();
  }, []);

  const handleChange = <K extends keyof ProfileForm>(
    field: K,
    value: ProfileForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await axiosClient.put("/users/me", {
      name: form.name,
      gender: form.gender,
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
    });
    alert("Profile updated");
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    await axiosClient.delete(`/items/${itemId}`);
    setMyItems((prev) => prev.filter((i) => i._id !== itemId));
  };

  return (
    <Box className="p-4 mx-auto max-w-5xl space-y-4">
      <Box className="max-w-md space-y-3">
        <Typography component="h1" variant="h5">My Profile</Typography>
        <TextField
          label="Name"
          fullWidth
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <TextField
          select
          label="Gender"
          fullWidth
          value={form.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
        >
          <MenuItem value="">Prefer not to say</MenuItem>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="non-binary">Non-binary</MenuItem>
        </TextField>
        <TextField
          label="Height (cm)"
          fullWidth
          type="number"
          value={form.heightCm}
          onChange={(e) => handleChange("heightCm", e.target.value)}
        />
        <TextField
          label="Weight (kg)"
          fullWidth
          type="number"
          value={form.weightKg}
          onChange={(e) => handleChange("weightKg", e.target.value)}
        />
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>

      <Divider />

      <Box>
        <Typography component="h2" variant="h6" mb={2}>My Listings</Typography>
        {loadingItems ? (
          <Typography color="text.secondary">Loading your listings...</Typography>
        ) : myItems.length === 0 ? (
          <Typography color="text.secondary">You have no listings yet.</Typography>
        ) : (
          <Grid container spacing={2}>
            {myItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card className="shadow-sm">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={700} noWrap>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.category && item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      {item.genderTarget && ` • ${item.genderTarget}`}
                      {item.size && ` • Size ${item.size}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      ${item.dailyPrice.toFixed(2)} / day
                    </Typography>
                    {item.depositAmount && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Deposit: ${item.depositAmount.toFixed(2)}
                      </Typography>
                    )}
                    <Box mt={1}>
                      {item.available ? (
                        <Typography variant="caption" color="success.main" fontWeight={700}>
                          Available
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="error.main" fontWeight={700}>
                          Currently Rented
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      color="error"
                      onClick={() => handleDeleteItem(item._id)}
                      size="small"
                    >
                      Delete Listing
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
