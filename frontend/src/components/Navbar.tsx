import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export default function Navbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check auth status and cart count
    const checkAuth = async () => {
      try {
        await axiosClient.get("/users/me");
        setIsAuthenticated(true);
        
        // Fetch cart count
        const cartRes = await axiosClient.get("/cart");
        setCartCount(cartRes.data?.length || 0);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosClient.post("/users/logout");
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AppBar position="sticky" elevation={1} sx={{ backgroundColor: '#fff', color: 'text.primary', borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer", fontWeight: 700 }}
          onClick={() => navigate("/")}
        >
          DressHub
        </Typography>

        <Box display="flex" gap={1} alignItems="center">
          <IconButton aria-label="home" onClick={() => navigate("/") }>
            <HomeIcon />
          </IconButton>

          {isAuthenticated ? (
            <>
              <IconButton aria-label="wishlist" onClick={() => navigate("/wishlist") }>
                <FavoriteIcon />
              </IconButton>

              <IconButton aria-label="cart" onClick={() => navigate("/cart") }>
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <IconButton aria-label="returns" onClick={() => navigate("/returns") }>
                <AssignmentReturnIcon />
              </IconButton>

              <IconButton aria-label="profile" onClick={() => navigate("/profile") }>
                <PersonIcon />
              </IconButton>

              <Button color="inherit" onClick={handleLogout} sx={{ ml: 1, textTransform: 'none' }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")} sx={{ textTransform: 'none' }}>
                Login
              </Button>
              <Button color="primary" variant="contained" onClick={() => navigate("/signup")} sx={{ ml: 1, textTransform: 'none' }}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

