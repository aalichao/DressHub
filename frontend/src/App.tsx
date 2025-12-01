import { useEffect, useState } from "react";
import axiosClient from "./api/axiosClient";
import { Box, Typography } from "@mui/material";

function App() {
  const [msg, setMsg] = useState<string>("Loading...");

  useEffect(() => {
    axiosClient.get("/health").then((res) => {
      setMsg(res.data.message);
    }).catch(() => {
      setMsg("Could not reach backend");
    });
  }, []);

  return (
    <Box className="min-h-screen flex items-center justify-center bg-slate-100">
      <Box className="bg-white rounded-2xl shadow-lg p-8">
        <Typography variant="h4" gutterBottom>
          Dress Hub
        </Typography>
        <Typography>{msg}</Typography>
      </Box>
    </Box>
  );
}

export default App;
