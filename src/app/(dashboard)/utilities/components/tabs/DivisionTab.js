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
import NewDivDialog from "../NewDivDialog";
import EditDivisionDialog from "../EditDivisionDialog";

export default function DivisionTab({ data, isActive }) {
  const [divisions, setDivisions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openNewDivDialog, setOpenNewDivDialog] = useState(false);
  const [editDivDialog, setEditDivDialog] = useState({
    open: false,
    divisionId: null,
    divisionName: "",
  });

  useEffect(() => {
    if (isActive) {
      setLoading(true);
      axiosInstance
        .get("/office/getAllDivision")
        .then((res) => {
          // console.log(res.body);
          setDivisions(res.body);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isActive]);

  const handleEdit = (id, divisionName, divisionAbrv) => {
    setEditDivDialog((prev) => ({
      ...prev,
      open: true,
      divisionId: id,
      divisionName: divisionName,
      divisionAbrv: divisionAbrv,
    }));
  };

  const handleDelete = (id) => {
    console.log("Delete division:", id);
  };

  const handleNewEntry = () => {
    setOpenNewDivDialog(true);
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
      divisions
        .filter((division) =>
          (division?.division_name ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [divisions, searchQuery, page, rowsPerPage]
  );

  useEffect(() => {}, []);

  return (
    <div>
      <div className="mb-6">
        <TextField
          type="text"
          placeholder="Search divisions..."
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
          startIcon={<AddRoundedIcon fontSize="small" />}
          onClick={handleNewEntry}
        >
          New Entry
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <CircularProgress />
          </div>
        ) : divisions && divisions.length > 0 ? (
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
                {visibleRows.map((division, index) => (
                  <tr key={index}>
                    <td className="px-6 py-2">
                      <Typography variant="body2">
                        {division?.division_name || "N/A"}
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
                          onClick={() =>
                            handleEdit(
                              division?.id,
                              division?.division_name,
                              division?.division_abrv
                            )
                          }
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
                          onClick={() => handleDelete(division?.id)}
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
              count={divisions.length}
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
              <p>No divisions found matching &quot;{searchQuery}&quot;</p>
            ) : (
              <p>No divisions found</p>
            )}
          </div>
        )}
      </div>

      <NewDivDialog
        open={openNewDivDialog}
        setOpen={setOpenNewDivDialog}
        setDivisions={setDivisions}
      />

      <EditDivisionDialog
        data={editDivDialog}
        setData={setEditDivDialog}
        set={setDivisions}
      />
    </div>
  );
}
