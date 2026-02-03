"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  Autocomplete,
  Alert,
  Snackbar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import axiosInstance from "@/helper/Axios";
import { useRouter } from "next/navigation";
import { useProtectedRoute } from "@/helper/ProtectedRoutes";
import { useError } from "@/helper/ErrorContext";
import LoadingDialog from "@/components/LoadingDialog";
import ConfirmExternalDocumentDialog from "./components/ConfirmExternalDocumentDialog";

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
    office_type: "internal",
    sender_office: "",
    sender_office_name: "",
    sender_person: "",
    sender_email: "",
    sender_phone: "",
    file: null,
    receiving_office: "",
    receiving_office_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [classifications, setClassifications] = useState([]);
  const [types, setTypes] = useState([]);
  const [offices, setOffices] = useState([]);
  const [internalOffices, setInternalOffices] = useState([]);
  const [validation, setValidation] = useState({
    file: { valid: true, message: "" },
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  const validateFile = (file) => {
    if (!file) return { valid: false, message: "No file selected" };
    if (file.type !== "application/pdf") {
      return { valid: false, message: "Only PDF files are allowed" };
    }
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        message: `File size must be less than 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      };
    }
    return { valid: true, message: "" };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setValidation({ file: { valid: true, message: "" } });
    if (file) {
      const validation = validateFile(file);
      if (validation.valid) {
        setFormData((prev) => ({
          ...prev,
          file,
        }));
      } else {
        setValidation({ file: validation });
        setError(validation.message, "error");
      }
    }
  };

  const submitExternal = () => {
    setConfirmDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      // setError("Please upload a file", "error");
      setValidation({
        file: { valid: false, message: "Please upload a file" },
      });
      return;
    }

    if (formData.office_type === "external") {
      submitExternal();
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
              // sender_office: formData.sender_office_name,
              file_name: formData.file.name,
              report_id: reportId,
              generation_date: new Date().toISOString().split("T")[0],
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
      office_type: "internal",
      sender_office: "",
      sender_office_name: "",
      sender_person: "",
      sender_email: "",
      sender_phone: "",
      file: null,
      receiving_office: "",
      receiving_office_name: "",
    });
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log(session);

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
        setTypes(res.body);
      })
      .catch((error) => {
        console.error("Error fetching types:", error);
        setError("Error fetching types", "error");
      });

    axiosInstance
      .get("/office/getAllDivision")
      .then((res) => {
        setOffices(res.body);
        // Filter internal offices without parent_id for CRRU autocomplete
        const internalNoParent = res.body.filter(
          (office) =>
            office.office_type === "internal" && office.parent_id !== null,
        );
        setInternalOffices(internalNoParent);
      })
      .catch((error) => {
        console.error("Error fetching divisions:", error);
        setError("Error fetching divisions", "error");
      });
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const handleDocumentDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(true);
    };

    const handleDocumentDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Only set to false if leaving the window
      if (e.clientX === 0 && e.clientY === 0) {
        setDragOver(false);
      }
    };

    const handleDocumentDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        const validation = validateFile(file);
        if (validation.valid) {
          setFormData((prev) => ({
            ...prev,
            file,
          }));
        } else {
          setError(validation.message, "error");
        }
      }
    };

    document.addEventListener("dragover", handleDocumentDragOver);
    document.addEventListener("dragleave", handleDocumentDragLeave);
    document.addEventListener("drop", handleDocumentDrop);

    return () => {
      document.removeEventListener("dragover", handleDocumentDragOver);
      document.removeEventListener("dragleave", handleDocumentDragLeave);
      document.removeEventListener("drop", handleDocumentDrop);
    };
  }, []);

  let filteredOffices = useMemo(() => {
    setFormData((prev) => ({
      ...prev,
      sender_office: "",
    }));
    if (formData.office_type === "internal") {
      return offices.filter(
        (office) =>
          office.office_type === "internal" && office.parent_id !== null,
      );
    } else {
      return offices.filter(
        (office) =>
          office.office_type === "external" && office.parent_id === null,
      );
    }
  }, [formData.office_type, offices]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card
        sx={{
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header with Back Button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <IconButton onClick={() => router.back()} size="small">
              <KeyboardBackspaceRoundedIcon />
            </IconButton>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Upload new document
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* File Upload */}
              <Typography variant="body1" color="textDisabled" fontWeight="700">
                Document Upload
              </Typography>
              {/* error file */}
              {validation.file.valid === false && (
                <Alert severity="error">{validation.file.message}</Alert>
              )}
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
                    borderColor: dragOver ? "primary.main" : "divider",
                    borderRadius: 1,
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backgroundColor: dragOver
                      ? "action.selected"
                      : "action.hover",
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
                    accept=".pdf"
                  />
                  <CloudUploadIcon
                    sx={{
                      fontSize: 40,
                      color: "primary.main",
                      mb: 1,
                    }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Drag and drop or click to upload
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    PDF (Max 10MB)
                  </Typography>
                </Box>
              )}
              {/* Document Details */}
              <Typography variant="body1" color="textDisabled" fontWeight="700">
                Document Details
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Autocomplete
                  options={classifications}
                  size="small"
                  getOptionLabel={(option) => option.name || ""}
                  value={
                    classifications.find(
                      (c) => c.id === formData.classification,
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      classification: newValue ? newValue.id : "",
                      classification_name: newValue ? newValue.name : "",
                    });
                  }}
                  noOptionsText="No classifications available"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Classification"
                      placeholder="Search Classification"
                      required
                    />
                  )}
                  fullWidth
                />
                <Autocomplete
                  options={types}
                  size="small"
                  getOptionLabel={(option) => option.name || ""}
                  value={types.find((t) => t.id === formData.type) || null}
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      type: newValue ? newValue.id : "",
                      type_name: newValue ? newValue.name : "",
                    });
                  }}
                  noOptionsText="No types available"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Type of Document"
                      placeholder="Search Type"
                      required
                    />
                  )}
                  fullWidth
                />
              </Stack>

              {/* sender details */}
              <Typography variant="body1" color="textDisabled" fontWeight="700">
                Sender Details
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                {session?.user?.role.some((role) => role.name === "CRRU") && (
                  <FormControl fullWidth size="small" sx={{ flex: 1 }} required>
                    <InputLabel id="office-type-label">Office Type</InputLabel>
                    <Select
                      labelId="office-type-label"
                      label="Office Type"
                      name="office_type"
                      onChange={handleInputChange}
                      value={formData.office_type}
                    >
                      <MenuItem value="internal">Internal (DICT)</MenuItem>
                      <MenuItem value="external">Exernal</MenuItem>
                    </Select>
                  </FormControl>
                )}

                <Autocomplete
                  options={filteredOffices}
                  size="small"
                  sx={{ flex: 2 }}
                  getOptionLabel={(option) => option.division_name || ""}
                  filterOptions={(options, state) => {
                    const inputValue = state.inputValue.toLowerCase();
                    return options.filter(
                      (option) =>
                        option.division_name
                          .toLowerCase()
                          .includes(inputValue) ||
                        (option.division_abrv &&
                          option.division_abrv
                            .toLowerCase()
                            .includes(inputValue)),
                    );
                  }}
                  value={
                    offices.find((d) => d.id === formData.sender_office) || null
                  }
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      sender_office: newValue ? newValue.id : "",
                      sender_office_name: newValue
                        ? newValue.division_name
                        : "",
                    });
                  }}
                  noOptionsText={`No ${formData.office_type === "internal" ? "division" : "office"} available`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sender Office"
                      placeholder="Search Sender Office"
                      required
                    />
                  )}
                  fullWidth
                />
                {session?.user?.role.some((role) => role.name === "CRRU") &&
                  formData.office_type == "external" && (
                    <Autocomplete
                      options={internalOffices}
                      size="small"
                      sx={{ flex: 2 }}
                      getOptionLabel={(option) => option.division_name || ""}
                      filterOptions={(options, state) => {
                        const inputValue = state.inputValue.toLowerCase();
                        return options.filter(
                          (option) =>
                            option.division_name
                              .toLowerCase()
                              .includes(inputValue) ||
                            (option.division_abrv &&
                              option.division_abrv
                                .toLowerCase()
                                .includes(inputValue)),
                        );
                      }}
                      value={
                        internalOffices.find(
                          (d) => d.id === formData.receiving_office,
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        setFormData({
                          ...formData,
                          receiving_office: newValue ? newValue.id : "",
                          receiving_office_name: newValue
                            ? newValue.division_name
                            : "",
                        });
                      }}
                      noOptionsText="No internal offices available"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Receiving Office"
                          placeholder="Search Receiving Office"
                          required
                        />
                      )}
                      fullWidth
                    />
                  )}
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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

<<<<<<< HEAD
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
                    accept=".pdf"
                  />
                  <CloudUploadIcon
                    sx={{
                      fontSize: 40,
                      color: "primary.main",
                      mb: 1,
                    }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Click to upload
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    PDF (Max 10MB)
                  </Typography>
                </Box>
              )}

=======
>>>>>>> 5a08ec877f214686ca5e7219a196b73861a24a5b
              {/* Action Buttons */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
      <ConfirmExternalDocumentDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        formData={formData}
        onConfirm={() => {
          handleReset();
          router.push("/files", { replace: true });
        }}
      />
    </Container>
  );
}
