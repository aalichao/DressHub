import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import CheckroomIcon from '@mui/icons-material/Checkroom';
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import logo from "../assets/DressHubTitle.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
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
    // re-check on route change (e.g., after login/signup navigation)
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent<{ count: number }>).detail;
        if (typeof detail?.count === "number") {
          setCartCount(detail.count);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
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
    <AppBar component="nav" role="navigation" position="sticky" elevation={1} sx={{ backgroundColor: '#fff', color: 'text.primary', borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ flexGrow: 1, cursor: "pointer", display: "flex", alignItems: "center" }} onClick={() => navigate("/")}> 
          <Box
            component="img"
            src={logo}
            alt="DressHub"
            sx={{ height: 36, width: "auto" }}
          />
        </Box>

        <Box display="flex" gap={1} alignItems="center">
          <IconButton aria-label="home" onClick={() => navigate("/") }>
            <HomeIcon />
          </IconButton>

          {isAuthenticated ? (
            <>
              <IconButton aria-label="upload item" onClick={() => navigate("/upload") }>
                <CheckroomIcon />
              </IconButton>

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

              <Button color="inherit" onClick={handleLogout} sx={{ ml: 1, textTransform: 'none', '&:focus-visible': { outline: (theme) => `3px solid ${theme.palette.primary.main}`, outlineOffset: 4 } }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")} sx={{ textTransform: 'none', '&:focus-visible': { outline: (theme) => `3px solid ${theme.palette.primary.main}`, outlineOffset: 4 } }}>
                Login
              </Button>
              <Button aria-label="Sign up" variant="contained" onClick={() => navigate("/signup")} sx={{ ml: 1, textTransform: 'none', backgroundColor: (theme) => theme.palette.primary.main, color: '#fff', '&:hover': { backgroundColor: (theme) => theme.palette.primary.dark }, '&:focus-visible': { outline: (theme) => `3px solid ${theme.palette.secondary.light}`, outlineOffset: 4 } }}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

