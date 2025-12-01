import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";

type ProfileForm = {
  name: string;
  gender: string;
  heightCm: string;
  weightKg: string;
};

export default function Profile() {
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    gender: "",
    heightCm: "",
    weightKg: "",
  });

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
    fetchProfile();
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

  return (
    <Box className="p-4 max-w-md mx-auto space-y-3">
      <Typography variant="h5">My Profile</Typography>
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
  );
}
