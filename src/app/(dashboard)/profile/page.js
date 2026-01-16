"use client";
import { useProtectedRoute } from "@/helper/ProtectedRoutes";
import LoadingScreen from "@/components/LoadingScreen";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
} from "@mui/material";

export default function Profile() {
  const { session, status, isChecking } = useProtectedRoute();
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setAlertMessage("");
    setError("");

    try {
      setAlertMessage("Profile updated successfully.");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setAlertMessage("");
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setAlertMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setError("Failed to change password.");
    }
  };

  if (isChecking) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

      {alertMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {alertMessage}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Profile Information Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#333" }}
          >
            Personal Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleUpdateProfile}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                InputLabelProps={{ style: { color: "#000" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": { color: "#000" },
                  },
                }}
              />

              <TextField
                label="Middle Name"
                variant="outlined"
                fullWidth
                value={middlename}
                onChange={(e) => setMiddlename(e.target.value)}
                InputLabelProps={{ style: { color: "#000" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": { color: "#000" },
                  },
                }}
              />

              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                InputLabelProps={{ style: { color: "#000" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": { color: "#000" },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Update Profile
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#000" }}
          >
            Change Password
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleChangePassword}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Current Password"
                type="password"
                variant="outlined"
                fullWidth
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                InputLabelProps={{ style: { color: "#000" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": { color: "#000" },
                  },
                }}
              />

              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                InputLabelProps={{ style: { color: "#000" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": { color: "#000" },
                  },
                }}
              />

              <TextField
                label="Confirm New Password"
                type="password"
                variant="outlined"
                fullWidth
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                InputLabelProps={{ style: { color: "#000" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": { color: "#000" },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Change Password
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
