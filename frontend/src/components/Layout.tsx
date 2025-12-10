import { Box, Container } from "@mui/material";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: (theme) => theme.palette.background.default }}>
      <Navbar />

      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

