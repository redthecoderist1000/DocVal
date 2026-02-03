"use client";

import {
  Chip,
  IconButton,
  Stack,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import axiosInstance from "@/helper/Axios";
import { useError } from "@/helper/ErrorContext";

export default function InfoTab({ data }) {
  const { setError } = useError();

  const openFile = () => {
    axiosInstance
      .post(
        "/document/downloadFile",
        { fileName: data?.url },
        { responseType: "blob" },
      )
      .then((res) => {
        const url = window.URL.createObjectURL(res);
        window.open(url);
        // const link = document.createElement("a");
        // link.href = url;
        // link.download = data?.url || "document.pdf";
        // link.click();
        // URL.revokeObjectURL(url);
      })
      .catch((err) => {
        setError("Failed to open the file. Please try again.", "error");
      });
  };

  return (
    <Stack spacing={2}>
      {/* Document Details Section */}
      <Box>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
          Document Details
        </Typography>
        <Stack spacing={1}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Control No.:
            </Typography>
            <Typography variant="body2" fontWeight="500">
              {data?.id || "—"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Reference No.:
            </Typography>
            <Typography variant="body2" fontWeight="500">
              {data?.reference_no || "—"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Title:
            </Typography>
            <Typography variant="body2" fontWeight="500">
              {data?.title || "—"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Document Type:
            </Typography>
            <Typography variant="body2" fontWeight="500">
              {data?.doc_type || "—"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Classification:
            </Typography>
            <Typography variant="body2" fontWeight="500">
              {data?.doc_class || "—"}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Sender Details Section */}
      <Box>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
          Sender Information
        </Typography>
        <Stack spacing={1}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Office:
            </Typography>
            <Typography variant="body2" fontWeight="500">
              {data?.sender_office || "—"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Contact Person:
            </Typography>
            <Typography variant="body2" fontWeight="500">
              {data?.sender_person || "—"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Email:
            </Typography>
            <Typography variant="body2" fontWeight="500">
              {data?.sender_email || "—"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Phone:
            </Typography>
            <Typography variant="body2" fontWeight="500">
              {data?.sender_phone || "—"}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Receiving Office Section - Display if not null */}
      {data?.receiving_office && (
        <>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Receiving Office
            </Typography>
            <Typography variant="body2" fontWeight="500">
              {data?.receiving_office}
            </Typography>
          </Box>

          <Divider />
        </>
      )}

      {/* File Section */}
      <Box>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
          Attached File
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={data?.url}
            variant="outlined"
            icon={<PictureAsPdfRoundedIcon color="error" />}
            sx={{ borderStyle: "dashed", bgcolor: "#f7f7f7ff" }}
          />
          <IconButton size="small" onClick={openFile}>
            <LaunchRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </Stack>
  );
}
