import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  TextField,
  CircularProgress,
} from "@mui/material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

// Icons
import LoginIcon from "@mui/icons-material/Login";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import EditIcon from "@mui/icons-material/Edit";
import DataTable from "@app/_components/table/table";

const InactiveUsers = () => {
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    userId: null,
    username: "",
    newStatus: "",
  });
  const [levelDialog, setLevelDialog] = useState({
    open: false,
    userId: null,
    username: "",
    currentLevel: 1,
    newLevel: "", // Changed to empty string to allow deletion
  });

  // Fetch users data
  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    postRequest(
      "/getAllUsers",
      {},
      (response) => {
        const allUsers = response?.data || [];
        const inactiveUsers = allUsers.filter(
          (user) => user.status === "inactive"
        );
        setUsersData(inactiveUsers);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users data");
        setIsLoading(false);
      }
    );
  }, []);

  const { User } = useAuth();
  const navigate = useNavigate();
  const [loadingMain, setLoadingMain] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isAdmin = roles.includes("Admin");
      const isMiniAdmin = roles.includes("MiniAdmin");
      const allowedRoutes = Array.isArray(User.allowedRoutes)
        ? User.allowedRoutes
        : [];
      const currentPath = window.location.pathname;

      if (isAdmin) {
        setLoadingMain(false);
        setAuthChecked(true);
        return;
      } else if (isMiniAdmin) {
        if (!allowedRoutes.includes(currentPath)) {
          if (allowedRoutes.length > 0) {
            navigate(allowedRoutes[0]);
          } else {
            navigate("/");
          }
        } else {
          setLoadingMain(false);
          setAuthChecked(true);
        }
      } else {
        navigate("/");
      }
    }
  }, [User, navigate]);

  // Data fetching useEffect - runs only after auth is checked
  useEffect(() => {
    if (authChecked && !loadingMain) {
      fetchUsers();
    }
  }, [authChecked, loadingMain]);

  if (loadingMain) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "primary" }} />
      </div>
    );
  }
  // Toggle user status
  const handleToggleStatus = (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    setConfirmDialog({
      open: true,
      userId: user._id,
      username: user.username,
      newStatus: newStatus,
    });
  };

  // Update user status
  const confirmStatusChange = () => {
    const { userId, newStatus, username } = confirmDialog;

    // Optimistically update UI for immediate feedback
    setUsersData((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, status: newStatus } : user
      )
    );

    closeConfirmDialog();

    // Backend update
    postRequest(
      "/updateStatus",
      { userId, status: newStatus },
      (response) => {
        toast.dismiss(temporaryToastId);

        if (response) {
          toast.success(`User status updated successfully`);

          // ✅ Ensure the local state is fully synced with backend response
          setUsersData((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId ? { ...user, status: newStatus } : user
            )
          );
          // fetchUsers();
        } else {
          // ❌ Backend failed — revert state
          setUsersData((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId
                ? {
                    ...user,
                    status: newStatus === "active" ? "inactive" : "active",
                  }
                : user
            )
          );
          toast.error(response.message || "Failed to update user status");
        }
      },
      (error) => {
        // ❌ Request error — revert state
        toast.dismiss(temporaryToastId);

        setUsersData((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  status: newStatus === "active" ? "inactive" : "active",
                }
              : user
          )
        );
        toast.error(
          error?.response?.data?.message || "Failed to update user status"
        );
      }
    );
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      userId: null,
      username: "",
      newStatus: "",
    });
  };

  // Edit level functions
  const handleEditLevel = (user) => {
    setLevelDialog({
      open: true,
      userId: user._id,
      username: user.username,
      currentLevel: user.levelsOpen || 1,
      newLevel: user.levelsOpen || 1, // Set initial value
    });
  };

  const closeLevelDialog = () => {
    setLevelDialog({
      open: false,
      userId: null,
      username: "",
      currentLevel: 1,
      newLevel: "",
    });
  };

  const handleLevelChange = (e) => {
    // Allow empty string or numeric values
    const value = e.target.value;
    if (
      value === "" ||
      (!isNaN(parseInt(value, 10)) && parseInt(value, 10) > 0)
    ) {
      setLevelDialog((prev) => ({
        ...prev,
        newLevel: value,
      }));
    }
  };

  const confirmLevelChange = () => {
    const { userId, newLevel, username } = levelDialog;

    // Convert empty string to 1 or ensure it's a number
    const levelToSend = newLevel === "" ? 1 : parseInt(newLevel, 10);

    // First update the UI state immediately for real-time feedback
    setUsersData((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, levelsOpen: levelToSend } : user
      )
    );

    // Show temporary toast
    const temporaryToastId = toast.info(`Updating level for ${username}...`, {
      autoClose: false,
    });

    // Close the dialog right away for better UX
    closeLevelDialog();

    // Then make the API call
    postRequest(
      "/updateLevel",
      { userId, levelsOpen: levelToSend },
      (response) => {
        if (response.data.success) {
          // Remove the temporary toast
          toast.dismiss(temporaryToastId);
          toast.success(`User level updated successfully`);
          // Update with the new level value from the response or use levelToSend
          setUsersData((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId ? { ...user, levelsOpen: levelToSend } : user
            )
          );
        } else {
          // If failed, revert the UI change
          setUsersData((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId
                ? { ...user, levelsOpen: levelDialog.currentLevel }
                : user
            )
          );
          toast.dismiss(temporaryToastId);
          toast.error(response.message || "Failed to update user level");
        }
        setIsLoading(false);
      },
      (error) => {
        // If error, revert the UI change
        setUsersData((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? { ...user, levelsOpen: levelDialog.currentLevel }
              : user
          )
        );
        toast.dismiss(temporaryToastId);
        toast.error(
          error?.response?.data?.message || "Failed to update user level"
        );
        setIsLoading(false);
      }
    );
  };

  // Column definitions for the table
  const columns = [
    {
      field: "username",
      label: "Name",
      exportValue: (row) => row.username,
      renderCell: (row) => (
        <Typography variant="body2" fontWeight="medium">
          {row.username}
        </Typography>
      ),
    },
    {
      field: "email",
      label: "Email",
      exportValue: (row) => row.email,
    },
    {
      field: "roles",
      label: "Roles",
      exportValue: (row) => row.roles?.join(", ") || "",
      renderCell: (row) => (
        <Chip
          label={row.roles[0]}
          size="small"
          color={row.roles[0] === "Admin" ? "primary" : "default"}
        />
      ),
    },
    {
      field: "status",
      label: "Status",
      exportValue: (row) => row.status || "active",
      renderCell: (row) => (
        <Chip
          label={row.status || "active"}
          size="small"
          color={(row.status || "active") === "active" ? "success" : "error"}
        />
      ),
    },
    {
      field: "levelsOpen",
      label: "Open Level",
      exportValue: (row) => row.levelsOpen || 1,
      renderCell: (row) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2">{row.levelsOpen || 1}</Typography>
          <Tooltip title="Edit level">
            <IconButton
              size="small"
              onClick={() => handleEditLevel(row)}
              disabled={isLoading}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: "actions",
      label: "Actions",
      align: "center",
      renderCell: (row) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip
            title={
              (row.status || "active") === "active"
                ? "Deactivate User"
                : "Activate User"
            }
          >
            <IconButton
              size="small"
              onClick={() => handleToggleStatus(row)}
              disabled={isLoading}
            >
              {(row.status || "active") === "active" ? (
                <ToggleOnIcon color="success" fontSize="small" />
              ) : (
                <ToggleOffIcon color="error" fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Container maxWidth="xl">
      <ToastContainer />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Review and manage user accounts
        </Typography>

        <DataTable
          title=""
          data={usersData}
          columns={columns}
          loading={isLoading}
          searchPlaceholder="Search by name, email or role"
          emptyMessage="No users found"
        />
      </Box>

      {/* Confirmation Dialog for Status Change */}
      <Dialog
        PaperProps={{
          sx: {
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(139, 69, 19, 0.15)",
            border: "1px solid rgba(218, 165, 32, 0.2)",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(255, 248, 220, 0.7), rgba(245, 222, 179, 0.3))",
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(5px)",
          },
        }}
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {confirmDialog.newStatus === "active"
            ? "Activate User"
            : "Deactivate User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {confirmDialog.newStatus === "active" ? "activate" : "deactivate"}{" "}
            the user <strong>{confirmDialog.username}</strong>?
            {confirmDialog.newStatus === "inactive" && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                Note: Deactivated users will not be able to log in.
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmStatusChange}
            color={confirmDialog.newStatus === "active" ? "success" : "error"}
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Level Editing */}
      <Dialog
        PaperProps={{
          sx: {
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(139, 69, 19, 0.15)",
            border: "1px solid rgba(218, 165, 32, 0.2)",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(255, 248, 220, 0.7), rgba(245, 222, 179, 0.3))",
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(5px)",
          },
        }}
        open={levelDialog.open}
        onClose={closeLevelDialog}
        aria-labelledby="level-dialog-title"
      >
        <DialogTitle id="level-dialog-title">Edit User Level</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update the level for user <strong>{levelDialog.username}</strong>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="level"
            label="Level"
            type="number"
            fullWidth
            variant="outlined"
            value={levelDialog.newLevel}
            onChange={handleLevelChange}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLevelDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmLevelChange}
            color="primary"
            variant="contained"
            disabled={
              levelDialog.currentLevel === parseInt(levelDialog.newLevel, 10)
            }
          >
            Update Level
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InactiveUsers;
