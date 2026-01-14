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

export default function EditDocumentTypeDialog({
  data,
  setData,
  setDocumentTypes,
}) {
  const { setError } = useError();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [errors, setErrors] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setFormData({ name: "" });
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
  };

  return (
    <Dialog
      open={data.open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="edit-document-type-dialog-title"
    >
      <DialogTitle id="edit-document-type-dialog-title">
        Edit Document Type
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Document type name: {data.documentTypeName}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Invoice"
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
