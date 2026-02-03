"use client";

import {
  Button,
  Divider,
  TablePagination,
  TextField,
  Typography,
  CircularProgress,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Container,
  Autocomplete,
  Stack,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import RotateLeftRoundedIcon from "@mui/icons-material/RotateLeftRounded";

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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("date-desc"); // "none", "file-asc", "file-desc", "date-asc", "date-desc"
  const [filterClassification, setFilterClassification] = useState("");
  const [filterDocType, setFilterDocType] = useState("");
  const [filterOffice, setFilterOffice] = useState("");
  const [deleteDoc, setDeleteDoc] = useState({
    open: false,
    docId: null,
    docTitle: "",
  });

  const [classOption, setClassOption] = useState([]);
  const [typeOption, setTypeOption] = useState([]);
  const [officeOption, setOfficeOption] = useState([]);
  const [officeEditLabels, setOfficeEditLabels] = useState({});

  const headerCells = [
    "Documents",
    "Classification",
    "Type of Document",
    "Date Received",
    // "Status",
    "Actions",
  ];

  useEffect(() => {
    setLoading(true);

    axiosInstance
      .get("/document/getAllDocClass")
      .then((res) => {
        setClassOption(res.body);
      })
      .catch((error) => {
        console.error("Error fetching classifications:", error);
      });

    axiosInstance
      .get("/document/getAllDocType")
      .then((res) => {
        setTypeOption(res.body);
      })
      .catch((error) => {
        console.error("Error fetching types:", error);
      });

    axiosInstance
      .get("/office/getAllDivision")
      .then((res) => {
        setOfficeOption(res.body);
      })
      .catch((error) => {
        console.error("Error fetching offices:", error);
      });

    axiosInstance
      .post("/document/getFileByUser")
      .then((res) => {
        setFiles(res.body);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch documents. Please try again.";
        setError(message);
        setLoading(false);
      });
  }, []);

  let visibleRows = useMemo(() => {
    let filtered = files.filter((file) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        (file.title && file.title.toLowerCase().includes(query)) ||
        (file.reference_no &&
          file.reference_no.toLowerCase().includes(query)) ||
        (file.doc_class && file.doc_class.toLowerCase().includes(query)) ||
        (file.doc_type && file.doc_type.toLowerCase().includes(query)) ||
        (file.sender_office &&
          file.sender_office.toLowerCase().includes(query));

      const matchesClassification =
        filterClassification === "" || file.doc_class === filterClassification;
      const matchesDocType =
        filterDocType === "" || file.doc_type === filterDocType;
      const matchesOffice =
        filterOffice === "" || file.sender_office === filterOffice;

      return (
        matchesSearch &&
        matchesClassification &&
        matchesDocType &&
        matchesOffice
      );
    });

    // Apply sorting
    if (sortBy === "documents-asc") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "documents-desc") {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "date-asc") {
      filtered.sort(
        (a, b) => new Date(a.date_created) - new Date(b.date_created),
      );
    } else if (sortBy === "date-desc") {
      filtered.sort(
        (a, b) => new Date(b.date_created) - new Date(a.date_created),
      );
    }

    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [
    files,
    searchQuery,
    page,
    rowsPerPage,
    sortBy,
    filterClassification,
    filterDocType,
    filterOffice,
  ]);

  let filesByOffice = useMemo(() => {
    const temp = files.reduce((acc, file) => {
      const office = file.sender_office || "Unknown";
      if (!acc[office]) {
        acc[office] = 0;
      }
      acc[office] += 1;
      return acc;
    }, {});

    const result = Object.entries(temp).map(([office, count]) => ({
      office,
      count,
    }));

    return result;
  }, [files, officeOption]);

  // Organize offices by division type
  const organizedOffices = useMemo(() => {
    const external = [];
    const internal = [];

    officeOption.forEach((office) => {
      if (office.office_type?.toLowerCase() === "external") {
        external.push(office);
      } else if (office.office_type?.toLowerCase() === "internal") {
        // Only include internal offices where parent_id is not null
        if (office.parent_id) {
          internal.push(office);
        }
      }
    });

    return { external, internal };
  }, [officeOption]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterClassification("");
    setFilterDocType("");
    setFilterOffice("");
    setPage(0);
  };

  useEffect(() => {
    if (isChecking) {
      startLoading();
    } else {
      stopLoading();
    }
    // console.log("Status:", status);
    if (status !== "authenticated") {
      router.push("/", { replace: true });
    }
  }, [isChecking, startLoading, stopLoading, status, router]);

  return (
    <Container maxWidth="lg" className="py-8 min-h-[80vh]">
      <div className={`${isModalOpen ? "blur-sm" : ""}`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Evaluate</h1>
            <h2 className="text-sm text-gray-600">
              Manage your evaluated documents or create new evaluations
            </h2>
          </div>
          <Button
            variant="contained"
            size="small"
            disableElevation
            startIcon={<AddRoundedIcon fontSize="small" />}
            onClick={() => router.push("/files/new")}
          >
            Evaluate
          </Button>
        </div>

        {/* File Count by Office Box */}
        <Stack
          direction="row"
          spacing={2}
          mb={3}
          sx={{ overflowX: "auto", pb: 1 }}
        >
          {filesByOffice.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setFilterOffice(
                  item.office === filterOffice ? "" : item.office,
                );
                setPage(0);
              }}
              className="cursor-pointer bg-white rounded-lg p-4 border-l-4 border-blue-600 max-w-xs shadow-sm w-75 transition-all hover:shadow-md"
            >
              <div className="flex flex-col justify-between h-full">
                <p className="text-gray-500 text-sm font-medium">
                  {item?.office ?? "-"}
                </p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {item?.count ?? 0}
                </h3>
              </div>
            </div>
          ))}
        </Stack>

        {/* Search and Filter Bar */}
        <div className="mb-6 grid grid-cols-1  md:grid-cols-5 gap-4 items-end">
          {/* Search bar - full width on mobile, 1 column on desktop */}
          <div className="md:col-span-2">
            <TextField
              type="text"
              placeholder="Search documents..."
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Classification filter - full width on mobile */}
          <div>
            <FormControl size="small" fullWidth>
              <Select
                value={filterClassification}
                onChange={(e) => {
                  setFilterClassification(e.target.value);
                  setPage(0);
                }}
                displayEmpty
              >
                <MenuItem value="">All Classifications</MenuItem>
                {classOption.map((data, index) => (
                  <MenuItem key={index} value={data.name}>
                    {data.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Document type filter - full width on mobile */}
          <div>
            <FormControl size="small" fullWidth>
              <Select
                value={filterDocType}
                onChange={(e) => {
                  setFilterDocType(e.target.value);
                  setPage(0);
                }}
                displayEmpty
              >
                <MenuItem value="">All Document Types</MenuItem>
                {typeOption.map((data, index) => (
                  <MenuItem key={index} value={data.name}>
                    {data.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Office filter - full width on mobile */}
          <div className="flex gap-2">
            <Autocomplete
              size="small"
              fullWidth
              options={[
                ...organizedOffices.external,
                ...organizedOffices.internal,
              ]}
              groupBy={(option) => {
                if (option.office_type?.toLowerCase() === "external") {
                  return "External";
                } else if (option.office_type?.toLowerCase() === "internal") {
                  return "Internal";
                }
                return "Other";
              }}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.division_name || ""
              }
              value={
                officeOption.find(
                  (office) => office.division_name === filterOffice,
                ) || null
              }
              onChange={(event, value) => {
                setFilterOffice(value ? value.division_name : "");
                setPage(0);
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="All Offices" />
              )}
            />
            <Tooltip title="Reset Filters" arrow placement="top">
              <IconButton color="error" size="small">
                <RotateLeftRoundedIcon
                  fontSize="medium"
                  onClick={resetFilters}
                />
              </IconButton>
            </Tooltip>
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
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    {headerCells.map((cell, index) => (
                      <th
                        key={index}
                        className={`px-6 py-3 text-${
                          index === 0 ? "left" : "left"
                        } text-xs font-semibold uppercase text-gray-700 bg-gray-50`}
                      >
                        <div className="flex items-center gap-2 ">
                          {cell}
                          {(cell === "Documents" ||
                            cell === "Date Received") && (
                            <Tooltip
                              title={`Sort by ${cell}`}
                              arrow
                              placement="top"
                            >
                              <Button
                                size="small"
                                variant="text"
                                onClick={() => {
                                  if (cell === "Documents") {
                                    setSortBy(
                                      sortBy === "documents-asc"
                                        ? "documents-desc"
                                        : "documents-asc",
                                    );
                                  } else if (cell === "Date Received") {
                                    setSortBy(
                                      sortBy === "date-asc"
                                        ? "date-desc"
                                        : "date-asc",
                                    );
                                  }
                                }}
                                sx={{
                                  padding: "4px",
                                  minWidth: "auto",
                                  color: "inherit",
                                }}
                              >
                                {sortBy === "documents-asc" &&
                                cell === "Documents" ? (
                                  <KeyboardArrowUpRoundedIcon fontSize="small" />
                                ) : sortBy === "documents-desc" &&
                                  cell === "Documents" ? (
                                  <KeyboardArrowDownRoundedIcon fontSize="small" />
                                ) : sortBy === "date-asc" &&
                                  cell === "Date Received" ? (
                                  <KeyboardArrowUpRoundedIcon fontSize="small" />
                                ) : sortBy === "date-desc" &&
                                  cell === "Date Received" ? (
                                  <KeyboardArrowDownRoundedIcon fontSize="small" />
                                ) : (
                                  <UnfoldMoreRoundedIcon fontSize="small" />
                                )}
                              </Button>
                            </Tooltip>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {visibleRows.map((doc, index) => (
                    <tr key={index}>
                      <td className="px-6 py-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="body2"
                            className="font-semibold text-gray-900"
                          >
                            {doc.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-gray-500 mt-1"
                          >
                            {doc.sender_office}
                          </Typography>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        {doc.doc_class || "-"}
                      </td>
                      <td className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        {doc.doc_type || "-"}
                      </td>
                      <td className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        {doc.date_created
                          ? new Date(doc.date_created)
                              .toISOString()
                              .split("T")[0]
                          : "-"}
                      </td>
                      {/* <td className="px-6 py-3 text-left text-sm text-gray-600">
                        {doc.status || "-"}
                      </td> */}
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Tooltip title="View Details" arrow placement="top">
                            <Button
                              variant="outlined"
                              color="success"
                              disableElevation
                              size="small"
                              onClick={() =>
                                router.push(`/files?id=${doc.id}`, {
                                  replace: true,
                                })
                              }
                            >
                              <RemoveRedEyeOutlinedIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                          <Tooltip
                            title="Delete Document"
                            arrow
                            placement="top"
                          >
                            <Button
                              variant="outlined"
                              color="error"
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
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </Button>
                          </Tooltip>
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
    </Container>
  );
}
