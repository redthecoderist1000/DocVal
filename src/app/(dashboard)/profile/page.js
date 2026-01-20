"use client";
import { useProtectedRoute } from "@/helper/ProtectedRoutes";
import LoadingScreen from "@/components/LoadingScreen";
import React, { useEffect, useState } from "react";
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
  const [personalFormData, setPersonalFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
  });
  const [passwordFormData, setPasswordFormData] = useState({
    curPass: "",
    newPass: "",
    conPass: "",
  });

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

  const handleChangePersonal = (e) => {
    const { name, value } = e.target;
    setPersonalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangePass = (e) => {
    const { name, value } = e.target;
    setPasswordFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // useEffect(() => {
  //   console.log("Session data:", session);
  // }, [session]);

  if (isChecking) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

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
                name="firstname"
                size="small"
                fullWidth
                value={personalFormData.firstname}
                onChange={handleChangePersonal}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": { color: "#000" },
                  },
                }}
              />

              <TextField
                label="Middle Name"
                variant="outlined"
                name="middlename"
                size="small"
                fullWidth
                value={personalFormData.middlename}
                onChange={handleChangePersonal}
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
                name="lastname"
                size="small"
                value={personalFormData.lastname}
                onChange={handleChangePersonal}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": { color: "#000" },
                  },
                }}
              />

              <Button type="submit" variant="contained" disableElevation>
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
                size="small"
                fullWidth
                value={personalFormData.curPass}
                onChange={handleChangePass}
                required
              />

              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                size="small"
                value={personalFormData.newPass}
                name="newPass"
                onChange={handleChangePass}
                required
              />

              <TextField
                label="Confirm New Password"
                type="password"
                variant="outlined"
                size="small"
                name="conPass"
                fullWidth
                value={personalFormData.conPass}
                onChange={handleChangePass}
                required
              />

              <Button type="submit" variant="contained" disableElevation>
                Change Password
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
