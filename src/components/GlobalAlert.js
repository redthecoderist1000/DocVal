"use client";

import { Alert, Snackbar } from "@mui/material";
import { useError } from "@/helper/ErrorContext";

export default function GlobalAlert() {
  const { errorData, clearError } = useError();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    clearError();
  };

  return (
    <Snackbar
      open={errorData.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={errorData.severity}
        sx={{ width: "100%" }}
      >
        {errorData.message}
      </Alert>
    </Snackbar>
  );
}
