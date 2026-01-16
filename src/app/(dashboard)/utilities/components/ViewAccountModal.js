"use client";

import {
  Button,
  CircularProgress,
  IconButton,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useState, useEffect } from "react";

export default function ViewAccountModal({
  isModalOpen,
  setIsModalOpen,
  accountData,
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen && accountData) {
      setLoading(false);
      setData(accountData);
    }
  }, [isModalOpen, accountData]);

  return (
    <>
      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40"
          onClick={handleClose}
        />
      )}

      {/* Side Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isModalOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-gray-200">
          <Typography variant="h6" fontWeight="bold">
            Account Details
          </Typography>

          <IconButton size="small" onClick={handleClose}>
            <CloseRoundedIcon />
          </IconButton>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-90px)]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <CircularProgress />
            </div>
          ) : data ? (
            <Stack spacing={3}>
              {/* Full Name */}
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Full Name
                </Typography>
                <Typography variant="body2" sx={{ color: "#000000", mt: 0.5 }}>
                  {data?.full_name || "N/A"}
                </Typography>
              </Box>

              {/* Email */}
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body2" sx={{ color: "#000000", mt: 0.5 }}>
                  {data?.email || "N/A"}
                </Typography>
              </Box>

              {/* Division */}
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Division
                </Typography>
                <Typography variant="body2" sx={{ color: "#000000", mt: 0.5 }}>
                  {data?.division_name || "N/A"}
                </Typography>
              </Box>

              {/* Username */}
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Username
                </Typography>
                <Typography variant="body2" sx={{ color: "#000000", mt: 0.5 }}>
                  {data?.username || "N/A"}
                </Typography>
              </Box>

              {/* Status */}
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Status
                </Typography>
                <Typography variant="body2" sx={{ color: "#000000", mt: 0.5 }}>
                  {data?.status || "N/A"}
                </Typography>
              </Box>

              {/* Created At */}
              {data?.created_at && (
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Created At
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#000000", mt: 0.5 }}
                  >
                    {new Date(data?.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              )}

              {/* Updated At */}
              {data?.updated_at && (
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#000000", mt: 0.5 }}
                  >
                    {new Date(data?.updated_at).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Stack>
          ) : (
            <Typography color="textSecondary">No data available</Typography>
          )}
        </div>
      </div>
    </>
  );
}
