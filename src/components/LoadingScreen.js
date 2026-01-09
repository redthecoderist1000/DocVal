import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "#1e3a8a",
            letterSpacing: 1,
          }}
        >
          DocVal
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <CircularProgress size={50} thickness={3} sx={{ color: "#1e3a8a" }} />
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
          }}
        >
          Please wait...
        </Typography>
      </Box>
    </Box>
  );
}
