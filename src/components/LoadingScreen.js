"use client";

import React from "react";
import { CircularProgress, Box, Typography, Backdrop } from "@mui/material";
import { useLoading } from "@/helper/LoadingContext";

export default function LoadingScreen() {
  const { isLoading } = useLoading();

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      open={isLoading}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "#fff",
            letterSpacing: 1,
          }}
        >
          DocVal
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <CircularProgress size={50} thickness={3} sx={{ color: "#fff" }} />
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "#fff",
          }}
        >
          Please wait...
        </Typography>
      </Box>
    </Backdrop>
  );
}
