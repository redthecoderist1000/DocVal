"use client";

import {
  Button,
  Divider,
  TablePagination,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/helper/Axios";
import { useError } from "@/helper/ErrorContext";
import { useProtectedRoute } from "@/helper/ProtectedRoutes";
import { useLoading } from "@/helper/LoadingContext";
import FileDetailsModal from "@/app/(dashboard)/files/components/FileDetailsModal";
import DeleteDocDialog from "./components/DeleteDocDialog";

export default function files() {
  const router = useRouter();
  const { setError } = useError();
  const { session, status, isChecking } = useProtectedRoute();
  const { startLoading, stopLoading } = useLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDoc, setDeleteDoc] = useState({
    open: false,
    docId: null,
    docTitle: "",
  });

  const headerCells = ["File", "Date Received", "Actions"];

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .post("/document/getFileByUser")
      .then((res) => {
        // console.log(res);
        setFiles(res.body);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  let visibleRows = useMemo(
    () =>
      files
        .filter((file) =>
          file.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [files, searchQuery, page, rowsPerPage]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (isChecking) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [isChecking, startLoading, stopLoading]);

  return (
    <>
      <div className={`${isModalOpen ? "blur-sm" : ""}`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Files</h1>
          <Button
            variant="contained"
            size="small"
            disableElevation
            startIcon={<AddRoundedIcon fontSize="small" />}
            onClick={() => router.push("/files/new")}
          >
            Add Document
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <TextField
              type="text"
              placeholder="Search files..."
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <CircularProgress />
            </div>
          ) : visibleRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {headerCells.map((cell, index) => (
                      <th
                        key={index}
                        className={`px-6 py-2 text-${
                          index === 0 ? "left" : "center"
                        } text-xs uppercase text-gray-500`}
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {visibleRows.map((doc, index) => (
                    <tr key={index}>
                      <td className="px-6 py-2">
                        <div className="flex flex-col">
                          <Typography variant="body1">{doc.title}</Typography>
                          <Typography variant="caption">
                            {doc.sender_office}
                          </Typography>
                        </div>
                      </td>
                      <td className="px-6 py-2 text-center text-sm text-gray-600">
                        {new Date(doc.date_created).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="contained"
                            color="success"
                            disableElevation
                            size="small"
                            startIcon={
                              <RemoveRedEyeOutlinedIcon fontSize="small" />
                            }
                            onClick={() =>
                              router.push(`/files?id=${doc.id}`, {
                                replace: true,
                              })
                            }
                          >
                            View
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            }
                            disableElevation
                            size="small"
                            onClick={() => {
                              setDeleteDoc({
                                open: true,
                                docId: doc.id,
                                docTitle: doc.title,
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Divider />
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={files.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  "& .MuiTablePagination-toolbar": {
                    minHeight: "44px",
                    paddingX: 2,
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      margin: 0,
                      fontSize: "0.75rem",
                    },
                  "& .MuiTablePagination-select": {
                    fontSize: "0.75rem",
                  },
                  "& .MuiIconButton-root": {
                    padding: "4px",
                  },
                }}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? (
                <p>No documents found matching &quot;{searchQuery}&quot;</p>
              ) : (
                <p>
                  No documents found. Add your first document to get started.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <FileDetailsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <DeleteDocDialog
        deleteDoc={deleteDoc}
        setDeleteDoc={setDeleteDoc}
        setFiles={setFiles}
      />
    </>
  );
}
