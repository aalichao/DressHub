import { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await axiosClient.post("/users/login", { email, password });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Paper elevation={3} className="p-8 rounded-2xl max-w-md w-full">
        <Typography component="h1" variant="h4" fontWeight={700} gutterBottom align="center" color="primary">
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={3}>
          Log in to your DressHub account
        </Typography>

        <form onSubmit={handleLogin}>
          <Box display="flex" flexDirection="column" gap={2}>
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
              Login
            </Button>

            <Typography variant="body2" align="center">
              Don't have an account?{" "}
              <Link onClick={() => navigate("/signup")} sx={{ cursor: "pointer" }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

