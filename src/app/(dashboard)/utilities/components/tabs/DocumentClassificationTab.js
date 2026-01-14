"use client";

import {
  Typography,
  Stack,
  Chip,
  Button,
  Divider,
  TablePagination,
  CircularProgress,
  TextField,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useState, useMemo, useEffect } from "react";
import axiosInstance from "@/helper/Axios";
import NewDocumentClassificationDialog from "../NewDocumentClassificationDialog";
import EditDocumentClassificationDialog from "../EditDocumentClassificationDialog";

export default function DocumentClassificationTab({ data, isActive }) {
  //   const classifications = data?.classifications || [];
  const [classifications, setClassifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    open: false,
    classificationName: "",
    id: null,
  });

  useEffect(() => {
    if (isActive) {
      setLoading(true);
      axiosInstance
        .get("/document/getAllDocClass")
        .then((res) => {
          //   console.log(res);
          setClassifications(res.body);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isActive]);

  const handleEdit = (id) => {
    const classification = classifications.find((c) => c.id === id);
    if (classification) {
      setEditData({
        open: true,
        classificationName: classification.name,
        id: id,
      });
    }
  };

  const handleDelete = (id) => {
    console.log("Delete classification:", id);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(
    () =>
      classifications
        .filter((classification) =>
          (classification?.name ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [classifications, searchQuery, page, rowsPerPage]
  );

  const handleNewEntry = () => {
    setDialogOpen(true);
  };

  return (
    <div>
      <NewDocumentClassificationDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        setClassifications={setClassifications}
      />
      <EditDocumentClassificationDialog
        data={editData}
        setData={setEditData}
        setClassifications={setClassifications}
      />
      <div className="mb-6">
        <TextField
          type="text"
          placeholder="Search classifications..."
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div></div>
        <Button
          variant="contained"
          size="small"
          disableElevation
          onClick={handleNewEntry}
          startIcon={<AddRoundedIcon fontSize="small" />}
        >
          New Entry
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <CircularProgress />
          </div>
        ) : classifications && classifications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-2 text-left text-xs uppercase text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-2 text-center text-xs uppercase text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visibleRows.map((classification, index) => (
                  <tr key={index}>
                    <td className="px-6 py-2">
                      <Typography variant="body2">
                        {classification?.name || "N/A"}
                      </Typography>
                    </td>
                    <td className="px-6 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="contained"
                          size="small"
                          color="warning"
                          disableElevation
                          startIcon={<EditOutlinedIcon fontSize="small" />}
                          onClick={() => handleEdit(classification?.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          }
                          disableElevation
                          onClick={() => handleDelete(classification?.id)}
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
              count={classifications.length}
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
              <p>No classifications found matching &quot;{searchQuery}&quot;</p>
            ) : (
              <p>No classifications found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
