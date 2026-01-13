import axiosInstance from "@/helper/Axios";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

export default function NewDivDialog({ open, setOpen, setDivisions }) {
  const [formData, setFormData] = useState({
    name: "",
    abrv: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({ name: "", abrv: "" });
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", abrv: "" });
    setErrors({ name: "", abrv: "" });
    setMessage({ type: "", text: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = { name: "", abrv: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.abrv.trim()) {
      newErrors.abrv = "Abbreviation is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setLoading(true);
    axiosInstance
      .post("/office/createDivision", {
        name: formData.name,
        abrv: formData.abrv,
      })
      .then((res) => {
        setDivisions((prev) => [...prev, ...res.body]);
        setMessage({ type: "success", text: "Division added successfully!" });
        setFormData({ name: "", abrv: "" });
        setErrors({ name: "", abrv: "" });
        setTimeout(() => {
          setMessage({ type: "", text: "" });
          setOpen(false);
          setLoading(false);
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        setMessage({
          type: "error",
          text: "Submission failed. Please try again.",
        });
        setLoading(false);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="new-division-dialog-title"
      aria-describedby="new-division-dialog-description"
    >
      <DialogTitle id="new-division-dialog-title">
        Add a New Division
      </DialogTitle>
      <DialogContent>
        {message.text && (
          <Alert
            severity={message.type}
            sx={{ mb: 2 }}
            onClose={() => setMessage({ type: "", text: "" })}
          >
            {message.text}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Finance Division"
              fullWidth
              variant="outlined"
              size="small"
              required
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
            />
            <TextField
              label="Abbreviation"
              name="abrv"
              value={formData.abrv}
              onChange={handleInputChange}
              placeholder="e.g., FIN"
              fullWidth
              variant="outlined"
              size="small"
              required
              error={!!errors.abrv}
              helperText={errors.abrv}
              disabled={loading}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button
            onClick={handleClose}
            color="error"
            size="small"
            variant="outlined"
            disableElevation
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            type="submit"
            autoFocus
            color="success"
            size="small"
            variant="contained"
            disableElevation
            disabled={loading}
          >
            {loading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} color="inherit" />
                <span>Submitting...</span>
              </Stack>
            ) : (
              "Submit"
            )}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
