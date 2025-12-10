import { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await axiosClient.post("/users/register", { email, password, name });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <Paper elevation={3} className="p-8 rounded-2xl max-w-md w-full">
        <Typography component="h1" variant="h4" fontWeight={700} gutterBottom align="center" color="primary">
          Join DressHub
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={3}>
          Create your account to start renting
        </Typography>

        <form onSubmit={handleSignup}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Name"
              type="text"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Button type="submit" variant="contained" size="large" fullWidth>
              Sign Up
            </Button>

            <Typography variant="body2" align="center">
              Already have an account?{" "}
              <Link onClick={() => navigate("/login")} sx={{ cursor: "pointer" }}>
                Log in
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

