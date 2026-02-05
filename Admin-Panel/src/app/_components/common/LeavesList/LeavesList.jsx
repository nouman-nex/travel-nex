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
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";

// Icons
import LoginIcon from "@mui/icons-material/Login";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import DataTable from "@app/_components/table/table";
import { Div } from "@jumbo/shared";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EmailIcon from "@mui/icons-material/Email";

const UserManagement = () => {
  const [usersData, setUsersData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
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
    newLevel: "",
  });
  const [sponsorDialog, setSponsorDialog] = useState({
    open: false,
    userId: null,
    username: "",
    currentSponsor: "",
    newSponsorId: "",
  });
  const [walletDialog, setWalletDialog] = useState({
    open: false,
    userId: null,
    username: "",
    currentAmount: 0,
    newAmount: "",
  });
  const [emailDialog, setEmailDialog] = useState({
    open: false,
    userId: null,
    username: "",
    currentEmail: "",
    newEmail: "",
  });
  const [withdrawalDialog, setWithdrawalDialog] = useState({
    open: false,
    userId: null,
    username: "",
    currentStatus: false,
    newStatus: false,
  });
  const location = useLocation();
  const isActivePath = location.pathname === "/activeUsers";

  const findSponsorByReferralCode = (referBy, allUsersArray) => {
    if (!referBy) return null;
    return allUsersArray.find((user) => user.refferrCode === referBy);
  };

 const fetchUsers = useCallback(() => {
  setIsLoading(true);
  postRequest(
    "/getAllUsers",
    {},
    (response) => {
      const allUsersArray = response?.data || [];
      setAllUsers(allUsersArray);

      const filteredUsers = allUsersArray.filter((user) =>
        isActivePath ? user.status === "active" : user.status === "inactive"
      );

      const usersWithSponsor = filteredUsers.map(user => {
        const sponsor = findSponsorByReferralCode(user.refferBy, allUsersArray);
        return {
          ...user,
          sponsorUser: sponsor ? sponsor.username : "No Sponsor",
          sponsorId: sponsor ? sponsor._id : null,
          cryptoWallet: user.cryptoWallet || 0,
          withdrawalEnabled: user.withdrawalEnabled || false // Add this line
        };
      });

      setUsersData(usersWithSponsor);
      setIsLoading(false);
    },
    (error) => {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users data");
      setIsLoading(false);
    }
  );
}, [isActivePath]);

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

  useEffect(() => {
    if (authChecked && !loadingMain) {
      fetchUsers();
    }
  }, [authChecked, loadingMain, fetchUsers]);

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

  const handleToggleWithdrawal = (user) => {
    setWithdrawalDialog({
      open: true,
      userId: user._id,
      username: user.username,
      currentStatus: user.withdrawalEnabled || false,
      newStatus: !user.withdrawalEnabled,
    });
  };

  const closeWithdrawalDialog = () => {
    setWithdrawalDialog({
      open: false,
      userId: null,
      username: "",
      currentStatus: false,
      newStatus: false,
    });
  };

  const confirmWithdrawalChange = () => {
    const { userId, newStatus, username } = withdrawalDialog;

    setUsersData((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, withdrawalEnabled: newStatus } : user
      )
    );

    const temporaryToastId = toast.info(
      `Updating withdrawal status for ${username}...`,
      { autoClose: false }
    );

    closeWithdrawalDialog();

    postRequest(
      "/updateWithdrawalStatus",
      { userId, withdrawalEnabled: newStatus },
      (response) => {
        if (response.data.success) {
          toast.dismiss(temporaryToastId);
          toast.success(`Withdrawal status updated successfully`);
        } else {
          setUsersData((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId
                ? { ...user, withdrawalEnabled: withdrawalDialog.currentStatus }
                : user
            )
          );
          toast.dismiss(temporaryToastId);
          toast.error(response.message || "Failed to update withdrawal status");
        }
        setIsLoading(false);
      },
      (error) => {
        setUsersData((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? { ...user, withdrawalEnabled: withdrawalDialog.currentStatus }
              : user
          )
        );
        toast.dismiss(temporaryToastId);
        toast.error(
          error?.response?.data?.message || "Failed to update withdrawal status"
        );
        setIsLoading(false);
      }
    );
  };

  const loginAsUser = (userId) => {
    const targetUser = usersData.find((user) => user._id === userId);

    setIsLoading(true);
    postRequest(
      "/loginAsUser",
      { userId },
      (response) => {
        if (response.data) {
          toast.success(
            `Successfully logged in as ${targetUser?.username || "user"}`
          );
          localStorage.setItem("token", response.data.token);
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error(response.message || "Failed to login as user");
          setIsLoading(false);
        }
      },
      (error) => {
        toast.error(
          error?.response?.data?.message || "Failed to login as user"
        );
        setIsLoading(false);
      }
    );
  };

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

    setUsersData((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, status: newStatus } : user
      )
    );

    const temporaryToastId = toast.info(`Updating status for ${username}...`, {
      autoClose: false,
    });

    closeConfirmDialog();

    postRequest(
      "/updateStatus",
      { userId, status: newStatus },
      (response) => {
        if (response) {
          toast.dismiss(temporaryToastId);
          toast.success(`User status updated successfully`);
        } else {
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
        setIsLoading(false);
      },
      (error) => {
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
        toast.dismiss(temporaryToastId);
        toast.error(
          error?.response?.data?.message || "Failed to update user status"
        );
        setIsLoading(false);
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
      newLevel: user.levelsOpen || 1,
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
    const levelToSend = newLevel === "" ? 1 : parseInt(newLevel, 10);

    setUsersData((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, levelsOpen: levelToSend } : user
      )
    );

    const temporaryToastId = toast.info(`Updating level for ${username}...`, {
      autoClose: false,
    });

    closeLevelDialog();

    postRequest(
      "/updateLevel",
      { userId, levelsOpen: levelToSend },
      (response) => {
        if (response.data.success) {
          toast.dismiss(temporaryToastId);
          toast.success(`User level updated successfully`);
          setUsersData((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId ? { ...user, levelsOpen: levelToSend } : user
            )
          );
        } else {
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

  // Sponsor functions
  const handleEditSponsor = (user) => {
    setSponsorDialog({
      open: true,
      userId: user._id,
      username: user.username,
      currentSponsor: user.sponsorUser,
      newSponsorId: user.sponsorId || "",
    });
  };

  const closeSponsorDialog = () => {
    setSponsorDialog({
      open: false,
      userId: null,
      username: "",
      currentSponsor: "",
      newSponsorId: "",
    });
  };

  const handleSponsorChange = (e) => {
    setSponsorDialog((prev) => ({
      ...prev,
      newSponsorId: e.target.value,
    }));
  };

  const confirmSponsorChange = () => {
    const { userId, newSponsorId, username } = sponsorDialog;

    const newSponsor = allUsers.find((user) => user._id === newSponsorId);
    const newSponsorReferralCode = newSponsor ? newSponsor.refferrCode : "";

    setUsersData((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId
          ? {
              ...user,
              sponsorUser: newSponsor ? newSponsor.username : "No Sponsor",
              sponsorId: newSponsorId,
              refferBy: newSponsorReferralCode,
            }
          : user
      )
    );

    const temporaryToastId = toast.info(`Updating sponsor for ${username}...`, {
      autoClose: false,
    });

    closeSponsorDialog();

    postRequest(
      "/updateSponsor",
      {
        userId,
        sponsorId: newSponsorId,
        referralCode: newSponsorReferralCode,
      },
      (response) => {
        if (response.data.success) {
          toast.dismiss(temporaryToastId);
          toast.success(`User sponsor updated successfully`);
        } else {
          fetchUsers();
          toast.dismiss(temporaryToastId);
          toast.error(response.message || "Failed to update user sponsor");
        }
        setIsLoading(false);
      },
      (error) => {
        fetchUsers();
        toast.dismiss(temporaryToastId);
        toast.error(
          error?.response?.data?.message || "Failed to update user sponsor"
        );
        setIsLoading(false);
      }
    );
  };

  // Wallet functions
  const handleEditWallet = (user) => {
    setWalletDialog({
      open: true,
      userId: user._id,
      username: user.username,
      currentAmount: user.cryptoWallet || 0,
      newAmount: user.cryptoWallet || 0,
    });
  };

  const closeWalletDialog = () => {
    setWalletDialog({
      open: false,
      userId: null,
      username: "",
      currentAmount: 0,
      newAmount: "",
    });
  };

  const handleWalletChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      setWalletDialog((prev) => ({
        ...prev,
        newAmount: value,
      }));
    }
  };

  const confirmWalletChange = () => {
    const { userId, newAmount, username } = walletDialog;
    const amountToSend = newAmount === "" ? 0 : parseFloat(newAmount);

    setUsersData((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, cryptoWallet: amountToSend } : user
      )
    );

    const temporaryToastId = toast.info(`Updating wallet for ${username}...`, {
      autoClose: false,
    });

    closeWalletDialog();

    postRequest(
      "/updateWallet",
      { userId, amount: amountToSend },
      (response) => {
        if (response.data.success) {
          toast.dismiss(temporaryToastId);
          toast.success(`User wallet updated successfully`);
          setUsersData((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId
                ? { ...user, cryptoWallet: amountToSend }
                : user
            )
          );
        } else {
          setUsersData((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId
                ? { ...user, cryptoWallet: walletDialog.currentAmount }
                : user
            )
          );
          toast.dismiss(temporaryToastId);
          toast.error(response.message || "Failed to update user wallet");
        }
        setIsLoading(false);
      },
      (error) => {
        setUsersData((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? { ...user, cryptoWallet: walletDialog.currentAmount }
              : user
          )
        );
        toast.dismiss(temporaryToastId);
        toast.error(
          error?.response?.data?.message || "Failed to update user wallet"
        );
        setIsLoading(false);
      }
    );
  };

  // Email functions
  const handleEditEmail = (user) => {
    setEmailDialog({
      open: true,
      userId: user._id,
      username: user.username,
      currentEmail: user.email,
      newEmail: user.email,
    });
  };

  const closeEmailDialog = () => {
    setEmailDialog({
      open: false,
      userId: null,
      username: "",
      currentEmail: "",
      newEmail: "",
    });
  };

  const handleEmailChange = (e) => {
    setEmailDialog((prev) => ({
      ...prev,
      newEmail: e.target.value,
    }));
  };

  const confirmEmailChange = () => {
    const { userId, newEmail, username } = emailDialog;

    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setUsersData((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, email: newEmail } : user
      )
    );

    const temporaryToastId = toast.info(`Updating email for ${username}...`, {
      autoClose: false,
    });

    closeEmailDialog();

    postRequest(
      "/updateEmail",
      { userId, email: newEmail },
      (response) => {
        if (response.data.success) {
          toast.dismiss(temporaryToastId);
          toast.success(`User email updated successfully`);
          setUsersData((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId ? { ...user, email: newEmail } : user
            )
          );
        } else {
          setUsersData((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId
                ? { ...user, email: emailDialog.currentEmail }
                : user
            )
          );
          toast.dismiss(temporaryToastId);
          toast.error(response.message || "Failed to update user email");
        }
        setIsLoading(false);
      },
      (error) => {
        setUsersData((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? { ...user, email: emailDialog.currentEmail }
              : user
          )
        );
        toast.dismiss(temporaryToastId);
        toast.error(
          error?.response?.data?.message || "Failed to update user email"
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
      renderCell: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2">{row.email}</Typography>
          <Tooltip title="Edit Email">
            <IconButton
              size="small"
              onClick={() => handleEditEmail(row)}
              disabled={isLoading}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: "country",
      label: "Country",
      exportValue: (row) => row.address?.country || "N/A",
      renderCell: (row) => (
        <Typography variant="body2" fontWeight="medium">
          {row.address?.country || "N/A"}
        </Typography>
      ),
    },
    {
      field: "sponsorUser",
      label: "Sponsor",
      exportValue: (row) => row.sponsorUser || "No Sponsor",
      renderCell: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" fontWeight="medium">
            {row.sponsorUser || "No Sponsor"}
          </Typography>
          <Tooltip title="Change Sponsor">
            <IconButton
              size="small"
              onClick={() => handleEditSponsor(row)}
              disabled={isLoading}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: "cryptoWallet",
      label: "Wallet Amount",
      exportValue: (row) => row.cryptoWallet || 0,
      renderCell: (row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccountBalanceWalletIcon color="primary" fontSize="small" />
          <Typography variant="body2" fontWeight="medium">
            {row.cryptoWallet || 0}
          </Typography>
          <Tooltip title="Update Wallet">
            <IconButton
              size="small"
              onClick={() => handleEditWallet(row)}
              disabled={isLoading}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
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
      field: "withdrawalStatus",
      label: "Withdrawal",
      align: "center",
      exportValue: (row) => (row.withdrawalEnabled ? "Enabled" : "Disabled"),
      renderCell: (row) => (
        <Tooltip
          title={
            row.withdrawalEnabled ? "Disable Withdrawal" : "Enable Withdrawal"
          }
        >
          <IconButton
            size="small"
            onClick={() => handleToggleWithdrawal(row)}
            disabled={isLoading}
            color={row.withdrawalEnabled ? "success" : "error"}
          >
            {row.withdrawalEnabled ? (
              <ToggleOnIcon fontSize="small" />
            ) : (
              <ToggleOffIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      label: "Actions",
      align: "center",
      renderCell: (row) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          {/* <Tooltip title="Login as User">
            <IconButton
              size="small"
              onClick={() => loginAsUser(row._id)}
              disabled={isLoading}
            >
              <LoginIcon color="primary" fontSize="small" />
            </IconButton>
          </Tooltip> */}
          <Tooltip
            title={
              (row.status || "active") === "active"
                ? "Block User"
                : "UnBlock User"
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
      <Div sx={{ borderBottom: 2, borderColor: "divider", py: 1, mb: 3 }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <>
            <Div sx={{ display: { xs: "none", lg: "block" } }}>
              <Typography variant="h3" sx={{ my: 1 }}>
                {isActivePath ? "Active Users" : "Inactive Users"}
              </Typography>
            </Div>
          </>
        </Stack>
      </Div>
      <ToastContainer />
      <Box sx={{ p: 3 }}>
        <DataTable
          title=""
          data={usersData}
          columns={columns}
          loading={isLoading}
          searchPlaceholder="Search by name, email or role"
          emptyMessage="No users found"
        />
      </Box>

      {/* Status Change Dialog */}
      <Dialog
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
            {confirmDialog.newStatus === "active" ? "Unblocked" : "Blocked"} the
            user <strong>{confirmDialog.username}</strong>?
            {confirmDialog.newStatus === "inactive" && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                Note: Blocked users will not be able to log in.
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

      {/* Level Change Dialog */}
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
      {/* Withdrawal Status Dialog */}
      <Dialog
        open={withdrawalDialog.open}
        onClose={closeWithdrawalDialog}
        aria-labelledby="withdrawal-dialog-title"
      >
        <DialogTitle id="withdrawal-dialog-title">
          {withdrawalDialog.newStatus ? "Enable" : "Disable"} Withdrawal
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {withdrawalDialog.newStatus ? "enable" : "disable"} withdrawals for
            user <strong>{withdrawalDialog.username}</strong>?
            {!withdrawalDialog.newStatus && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                Note: User won't be able to make withdrawal requests when
                disabled.
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWithdrawalDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmWithdrawalChange}
            color={withdrawalDialog.newStatus ? "success" : "error"}
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Sponsor Change Dialog */}
      <Dialog
        open={sponsorDialog.open}
        onClose={closeSponsorDialog}
        aria-labelledby="sponsor-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="sponsor-dialog-title">
          <Stack direction="row" alignItems="center" spacing={1}>
            <PersonIcon />
            <Typography variant="h6">Change Sponsor</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Select a new sponsor for user{" "}
            <strong>{sponsorDialog.username}</strong>
          </DialogContentText>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Current Sponsor: <strong>{sponsorDialog.currentSponsor}</strong>
          </Typography>
          <FormControl fullWidth margin="dense">
            <InputLabel id="sponsor-select-label">
              Select New Sponsor
            </InputLabel>
            <Select
              labelId="sponsor-select-label"
              id="sponsor-select"
              value={sponsorDialog.newSponsorId}
              label="Select New Sponsor"
              onChange={handleSponsorChange}
            >
              <MenuItem value="">
                <em>No Sponsor</em>
              </MenuItem>
              {allUsers
                .filter((user) => user._id !== sponsorDialog.userId)
                .map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.username} ({user.email})
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSponsorDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmSponsorChange}
            color="primary"
            variant="contained"
            disabled={
              sponsorDialog.newSponsorId === sponsorDialog.currentSponsorId
            }
          >
            Update Sponsor
          </Button>
        </DialogActions>
      </Dialog>

      {/* Wallet Update Dialog */}
      <Dialog
        open={walletDialog.open}
        onClose={closeWalletDialog}
        aria-labelledby="wallet-dialog-title"
      >
        <DialogTitle id="wallet-dialog-title">
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccountBalanceWalletIcon />
            <Typography variant="h6">Update Wallet Amount</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update wallet amount for user{" "}
            <strong>{walletDialog.username}</strong>
          </DialogContentText>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Current Amount: <strong>{walletDialog.currentAmount}</strong>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="wallet-amount"
            label="New Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={walletDialog.newAmount}
            onChange={handleWalletChange}
            inputProps={{ min: 0, step: "0.01" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWalletDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmWalletChange}
            color="primary"
            variant="contained"
            disabled={
              parseFloat(walletDialog.newAmount) ===
                walletDialog.currentAmount ||
              isNaN(parseFloat(walletDialog.newAmount))
            }
          >
            Update Amount
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Update Dialog */}
      <Dialog
        open={emailDialog.open}
        onClose={closeEmailDialog}
        aria-labelledby="email-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="email-dialog-title">
          <Stack direction="row" alignItems="center" spacing={1}>
            <EmailIcon />
            <Typography variant="h6">Update Email Address</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update email for user <strong>{emailDialog.username}</strong>
          </DialogContentText>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Current Email: <strong>{emailDialog.currentEmail}</strong>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="New Email"
            type="email"
            fullWidth
            variant="outlined"
            value={emailDialog.newEmail}
            onChange={handleEmailChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEmailDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmEmailChange}
            color="primary"
            variant="contained"
            disabled={
              emailDialog.newEmail === emailDialog.currentEmail ||
              !emailDialog.newEmail.includes("@")
            }
          >
            Update Email
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export { UserManagement };
