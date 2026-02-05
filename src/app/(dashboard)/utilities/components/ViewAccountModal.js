"use client";

import {
  Autocomplete,
  Button,
  CircularProgress,
  Chip,
  IconButton,
  Typography,
  Stack,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useState, useEffect } from "react";
import axiosInstance from "@/helper/Axios";
import { useError } from "@/helper/ErrorContext";

export default function ViewAccountModal({ data, setData, setAccounts }) {
  const { setError } = useError();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [divOption, setDivOption] = useState([]);
  const [roleOption, setRoleOption] = useState([]);
  const [oldData, setOldData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    divisionName: "",
    divisionId: "",
    role: [],
  });
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    divisionName: "",
    divisionId: "",
    role: [],
  });

  useEffect(() => {
    // console.log("ViewAccountModal data:", data);
    if (data.open && data.userId) {
      setLoading(true);
      axiosInstance
        .get("/office/getAllDivision")
        .then(async (res) => {
          const options = res.body.filter(
            (division) =>
              division.office_type === "internal" &&
              division.parent_id !== null,
          );

          setDivOption(options);
          await fetchUserDetails();
        })
        .catch((err) => {
          setError("Failed to fetch divisions. Please try again.");
          handleClose();
          setLoading(false);
          console.error(err);
        });

      axiosInstance
        .get("/roles/getAllRoles")
        .then((res) => {
          // console.log("Fetched roles:", res.body);
          setRoleOption(res.body);
        })
        .catch((err) => {
          setError("Failed to fetch roles. Please try again.");
          console.error(err);
        });
    }
  }, [data.open, data.userId]);

  const fetchUserDetails = async () => {
    axiosInstance
      .post("/user/getUserDetail", { userId: data.userId })
      .then((res) => {
        const user = res.body;
        const parsedRole = (() => {
          try {
            return Array.isArray(user.role) ? user.role : JSON.parse(user.role);
          } catch (err) {
            return [];
          }
        })();
        const roleIds = Array.isArray(parsedRole)
          ? parsedRole.map((role) => role.id).filter(Boolean)
          : [];
        setFormData({
          firstName: user.f_name || "",
          middleName: user.m_name || "",
          lastName: user.l_name || "",
          email: user.email || "",
          divisionName: user.division_name || "",
          divisionId: user.division_id || "",
          role: roleIds,
        });
        setOldData({
          firstName: user.f_name || "",
          middleName: user.m_name || "",
          lastName: user.l_name || "",
          email: user.email || "",
          divisionName: user.division_name || "",
          divisionId: user.division_id || "",
          role: roleIds,
        });

        console.log("Fetched user details:", roleIds);

        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch user details");
        handleClose();
        setLoading(false);
      });
  };

  const handleClose = () => {
    setData({ ...data, open: false });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    // validation
    if (!formData.firstName.trim()) {
      setError("First name is required", "warning");
      return;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required", "warning");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required", "warning");
      return;
    }
    if (!formData.divisionId) {
      setError("Division is required", "warning");
      return;
    }

    // check for changes
    const changes = {};
    Object.keys(formData).forEach((key) => {
      if (key === "role") {
        if (JSON.stringify(formData.role) !== JSON.stringify(oldData.role)) {
          changes[key] = formData[key];
        }
        return;
      }
      if (formData[key] !== oldData[key]) {
        changes[key] = formData[key];
      }
    });
    if (Object.keys(changes).length === 0) {
      setError("No changes made", "warning");
      setIsEditing(false);
      return;
    }

    setLoading(true);

    const updateData = { userId: data.userId };

    if (formData.firstName !== oldData.firstName)
      updateData.newFName = formData.firstName;
    if (formData.middleName !== oldData.middleName)
      updateData.newMName = formData.middleName;
    if (formData.lastName !== oldData.lastName)
      updateData.newLName = formData.lastName;
    if (formData.email !== oldData.email) updateData.newEmail = formData.email;
    if (formData.divisionId !== oldData.divisionId)
      updateData.newDiv = formData.divisionId;
    if (JSON.stringify(formData.role) !== JSON.stringify(oldData.role)) {
      updateData.newRole = formData.role;
    }

    console.log("Update data:", updateData);

    axiosInstance
      .post("/user/editUser", updateData)
      .then((res) => {
        // console.log("Edit user response:", res);
        setError(res.message, "success");
        // update accounts list
        setAccounts((prev) =>
          prev.map((acc) => (acc.id === data.userId ? res.body : acc)),
        );
        setIsEditing(false);
        handleClose();
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to update user. Please try again.");
        setLoading(false);
        // console.error(err);
      });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      const nextValue = typeof value === "string" ? value.split(",") : value;
      setFormData({ ...formData, [name]: nextValue });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Dialog open={data.open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Account Details</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Button
              onClick={handleEdit}
              variant="contained"
              size="small"
              color={isEditing ? "error" : "warning"}
              startIcon={isEditing ? <CloseRoundedIcon /> : <EditRoundedIcon />}
              disableElevation
              disabled={loading}
            >
              {isEditing ? "Cancel Edit" : "Edit"}
            </Button>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
              Name
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Middle Name"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                disabled={!isEditing}
                fullWidth
                size="small"
                variant="outlined"
              />
            </Stack>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
              size="small"
              variant="outlined"
            />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
              Email
            </Typography>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
              size="small"
              variant="outlined"
              type="email"
            />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
              Division
            </Typography>

            <Autocomplete
              options={divOption}
              size="small"
              getOptionLabel={(option) => option.division_name || ""}
              value={
                divOption.find((d) => d.id === formData.divisionId) || null
              }
              onChange={(event, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  divisionId: newValue?.id || "",
                }));
              }}
              disabled={!isEditing}
              noOptionsText="No divisions available"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Division"
                  placeholder="Search Division"
                />
              )}
              fullWidth
            />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
              Role
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                name="role"
                labelId="role-label"
                label="Role"
                value={formData.role}
                onChange={handleChange}
                disabled={!isEditing}
                size="small"
                fullWidth
                variant="outlined"
                multiple
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((roleId) => {
                      const role = roleOption.find((r) => r.id === roleId);
                      return (
                        <Chip
                          key={roleId}
                          label={role?.name || roleId}
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {roleOption.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        {isEditing && (
          <Button
            onClick={handleSave}
            variant="contained"
            color="success"
            size="small"
            disableElevation
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
