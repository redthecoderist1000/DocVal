"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Stack,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Chip,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded";
import axiosInstance from "@/helper/Axios";
import { useRouter } from "next/navigation";
import { useProtectedRoute } from "@/helper/ProtectedRoutes";
import { useError } from "@/helper/ErrorContext";
import LoadingDialog from "@/components/LoadingDialog";

export default function NewFile() {
  const { session, status } = useProtectedRoute();
  const { setError } = useError();
  const router = useRouter();
  const abortControllerRef = useRef(null);
  const [formData, setFormData] = useState({
    refno: "",
    title: "",
    classification: "",
    classification_name: "",
    type: "",
    type_name: "",
    sender_office: "",
    sender_office_name: "",
    sender_person: "",
    sender_email: "",
    sender_phone: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [classifications, setClassifications] = useState([]);
  const [types, setTypes] = useState([]);
  const [offices, setOffices] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      setError("Please fill in all required fields", "error");
      return;
    }

    abortControllerRef.current = new AbortController();

    // convert to file to base64
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
      });

    const fileBase64 = await toBase64(formData.file).catch((err) => {
      setError("Error reading file", "error");
    });

    setLoading(true);
    axiosInstance
      .post(
        "/document/generateReport",
        { base64_data: fileBase64 },
        { signal: abortControllerRef.current.signal },
      )
      .then((res) => {
        // Store large file_base64 and report_data in IndexedDB to avoid session storage limits
        const request = indexedDB.open("docval_db", 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("reports")) {
            db.createObjectStore("reports", { keyPath: "id" });
          }
        };

        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction("reports", "readwrite");
          const store = transaction.objectStore("reports");
          const reportId = `report_${Date.now()}`;

          store.put({
            id: reportId,
            file_base64: fileBase64,
            report_data: res.body,
            timestamp: Date.now(),
          });

          // Store only metadata in session storage (much smaller)
          sessionStorage.setItem(
            "newReportData",
            JSON.stringify({
              ...formData,
              file_name: formData.file.name,
              report_id: reportId,
              generation_date: new Date().toISOString(),
            }),
          );

          router.push(`/files/report`);
          setLoading(false);
        };

        request.onerror = () => {
          setError("Error storing report data", "error");
          setLoading(false);
        };
      })
      .catch((err) => {
        console.log(err);
        if (err.name === "CanceledError") {
          setError("Request cancelled", "info");
        } else {
          setError("Error evaluating file", "error");
        }
        setLoading(false);
      });
  };

  const handleReset = () => {
    setFormData({
      refno: "",
      title: "",
      classification: "",
      classification_name: "",
      type: "",
      type_name: "",
      sender_office: "",
      sender_office_name: "",
      sender_person: "",
      sender_email: "",
      sender_phone: "",
      file: null,
    });
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  useEffect(() => {
    axiosInstance
      .get("/document/getAllDocClass")
      .then((res) => {
        setClassifications(res.body);
      })
      .catch((error) => {
        console.error("Error fetching classifications:", error);
        setError("Error fetching classifications", "error");
      });

    axiosInstance
      .get("/document/getAllDocType")
      .then((res) => {
        // console.log("Fetched types:", res.body);
        setTypes(res.body);
      })
      .catch((error) => {
        console.error("Error fetching types:", error);
        setError("Error fetching types", "error");
      });
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card
        sx={{
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: "text.primary",
            }}
          >
            Upload New File
          </Typography>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Document Details */}
              <Typography variant="body1" color="textDisabled" fontWeight="700">
                Document Details
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Reference No."
                  name="refno"
                  value={formData.refno}
                  onChange={handleInputChange}
                  placeholder="e.g., REF-2023-0001"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                />
                <TextField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., My Document"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="classification-label">
                    Classification
                  </InputLabel>
                  <Select
                    labelId="classification-label"
                    label="Classification"
                    name="classification"
                    onChange={handleInputChange}
                    value={formData.classification}
                  >
                    <MenuItem value="" disabled>
                      Select Classification
                    </MenuItem>
                    {classifications?.map((data, index) => (
                      <MenuItem
                        key={index}
                        value={data.id}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            classification_name: data.name,
                          });
                        }}
                      >
                        {data.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="type-label">Type of Document</InputLabel>
                  <Select
                    labelId="type-label"
                    label="Type of Document"
                    name="type"
                    onChange={handleInputChange}
                    value={formData.type}
                  >
                    <MenuItem value="" disabled>
                      Select Type
                    </MenuItem>
                    {types?.map((data, index) => (
                      <MenuItem
                        key={index}
                        value={data.id}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            type_name: data.name,
                          });
                        }}
                      >
                        {data.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              {/* sender details */}
              <Typography variant="body1" color="textDisabled" fontWeight="700">
                Sender Details
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Sender Office"
                  name="sender_office"
                  value={formData.sender_office}
                  onChange={handleInputChange}
                  placeholder="e.g., Department of Agrarian Reform"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                />
                <TextField
                  label="Contact Person"
                  name="sender_person"
                  value={formData.sender_person}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Email"
                  name="sender_email"
                  value={formData.sender_email}
                  onChange={handleInputChange}
                  placeholder="e.g., john@example.com"
                  fullWidth
                  type="email"
                  variant="outlined"
                  size="small"
                  required
                />
                <TextField
                  label="Phone Number"
                  name="sender_phone"
                  value={formData.sender_phone}
                  onChange={handleInputChange}
                  placeholder="e.g., 0917*******"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                />
              </Stack>

              {/* File Upload */}
              <Typography variant="body1" color="textDisabled" fontWeight="700">
                File Upload
              </Typography>
              {formData.file ? (
                <Chip
                  label={`${formData.file.name} (${(
                    formData.file.size /
                    (1024 * 1024)
                  ).toFixed(2)} MB)`}
                  variant="outlined"
                  icon={<PictureAsPdfRoundedIcon color="error" />}
                  sx={{ borderStyle: "dashed", bgcolor: "#f7f7f7ff" }}
                  onDelete={() => {
                    setFormData({ ...formData, file: null });
                  }}
                />
              ) : (
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backgroundColor: "action.hover",
                    "&:hover": {
                      borderColor: "primary.main",
                      backgroundColor: "action.selected",
                    },
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
                  />
                  <CloudUploadIcon
                    sx={{
                      fontSize: 40,
                      color: "primary.main",
                      mb: 1,
                    }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Click to upload or drag and drop
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    PDF (Max 10MB)
                  </Typography>
                </Box>
              )}

              {/* Action Buttons */}
              <Stack direction="row" spacing={2}>
                <Button
                  type="button"
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  loading={loading}
                  disableElevation
                >
                  Continue
                </Button>
                {loading && (
                  <IconButton>
                    <StopCircleRoundedIcon
                      color="error"
                      onClick={handleCancel}
                    />
                  </IconButton>
                )}
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
      <LoadingDialog open={loading} />
    </Container>
  );
}
