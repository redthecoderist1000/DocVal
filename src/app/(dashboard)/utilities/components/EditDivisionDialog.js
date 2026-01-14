import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useError } from "@/helper/ErrorContext";
import axiosInstance from "@/helper/Axios";

export default function EditDivisionDialog({ data, setData, setDivisions }) {
  const { setError } = useError();
  const [formData, setFormData] = useState({
    name: "",
    abrv: "",
  });
  const [errors, setErrors] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setFormData({ name: "", abrv: "" });
    setData((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submit logic here
    console.log("data:", data);
    console.log("Form submitted with data:", formData);

    axiosInstance
      .post("/office/editDivision", {
        divId: data.divisionId,
        newName: formData.name,
        newAbrv: formData.abrv,
      })
      .then((res) => {
        console.log(res);
        // Update divisions list
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to update division. Please try again.");
      });
  };

  return (
    <Dialog
      open={data.open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="new-classification-dialog-title"
    >
      <DialogTitle id="new-classification-dialog-title">
        Edit Division
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary">
          Division name: {data.divisionName}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Division abrv.: {data.divisionAbrv}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Management Information Systems Services - Data Warehouse and Analytics Division"
              fullWidth
              variant="outlined"
              size="small"
              required
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
            />
            <TextField
              label="Abrv"
              name="abrv"
              value={formData.abrv}
              onChange={handleInputChange}
              placeholder="e.g., MISS-DWAD"
              fullWidth
              variant="outlined"
              size="small"
              required
              error={!!errors.name}
              helperText={errors.name}
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
