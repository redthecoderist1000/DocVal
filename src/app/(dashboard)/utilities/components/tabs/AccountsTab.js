"use client";

import {
  Typography,
  Button,
  Divider,
  TablePagination,
  CircularProgress,
  TextField,
} from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useState, useMemo, useEffect } from "react";
import axiosInstance from "@/helper/Axios";
import NewAccountDialog from "../NewAccountDialog";
import ViewAccountModal from "../ViewAccountModal";

export default function AccountsTab({ data, isActive }) {
  //   const accounts = data?.accounts || [];
  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewAccount, setViewAccount] = useState({});

  useEffect(() => {
    if (isActive) {
      setLoading(true);
      axiosInstance
        .get("/user/getAllUser")
        .then((res) => {
          //   console.log(res);
          setAccounts(res.body);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isActive]);

  const handleView = (accountId) => {
    setViewAccount({ ...viewAccount, open: true, userId: accountId }); //
    meronHandel;
  };

  const handleEdit = (id) => {
    console.log("Edit account:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete account:", id);
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
      accounts
        .filter((account) => {
          const matchFName = (account?.full_name ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          const matchEmail = (account?.email ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          const matchDivision = (account?.division_name ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          return matchFName || matchEmail || matchDivision;
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [accounts, page, rowsPerPage, searchQuery]
  );

  const handleNewEntry = () => {
    setDialogOpen(true);
  };

  return (
    <div>
      <ViewAccountModal
        data={viewAccount}
        setData={setViewAccount}
        setAccounts={setAccounts}
      />
      <NewAccountDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        setAccounts={setAccounts}
      />
      <div className="mb-6">
        <TextField
          type="text"
          placeholder="Search accounts..."
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-end mb-3">
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
        ) : accounts && accounts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-2 text-left text-xs uppercase text-gray-500">
                    Fullname
                  </th>
                  <th className="px-6 py-2 text-left text-xs uppercase text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-2 text-left text-xs uppercase text-gray-500">
                    Division
                  </th>
                  <th className="px-6 py-2 text-center text-xs uppercase text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visibleRows.map((account, index) => (
                  <tr key={index}>
                    <td className="px-6 py-2">
                      <Typography variant="body2" sx={{ color: "#000000" }}>
                        {account?.full_name || "N/A"}
                      </Typography>
                    </td>
                    <td className="px-6 py-2">
                      <Typography variant="body2" sx={{ color: "#000000" }}>
                        {account?.email || "N/A"}
                      </Typography>
                    </td>
                    <td className="px-6 py-2">
                      <Typography variant="body2" sx={{ color: "#000000" }}>
                        {account?.division_name || "N/A"}
                      </Typography>
                    </td>
                    <td className="px-6 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outlined"
                          size="small"
                          color="success"
                          disableElevation
                          onClick={() => handleView(account.id)}
                        >
                          <RemoveRedEyeOutlinedIcon fontSize="small" />
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          disableElevation
                          onClick={() => handleDelete(account?.id)}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
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
              count={accounts.length}
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
              <p>No accounts found matching &quot;{searchQuery}&quot;</p>
            ) : (
              <p>No accounts found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
