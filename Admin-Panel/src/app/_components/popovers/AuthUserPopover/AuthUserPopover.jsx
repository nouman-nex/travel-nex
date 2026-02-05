import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Div } from "@jumbo/shared";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import LoginIcon from "@mui/icons-material/Login";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { authUser } from "./data";
import { JumboDdPopover } from "@jumbo/components/JumboDdPopover";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Link, useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslation } from "react-i18next";
import {
  MEDIA_BASE_URL,
  postRequest,
} from "../../../../backendServices/ApiCalls";
import { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Make sure this is imported

const AuthUserPopover = () => {
  const { t } = useTranslation();
  const { theme } = useJumboTheme();
  const { logout, User } = useAuth();
  const navigate = useNavigate();

  // State management
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // // Fetch all user accounts
  // const fetchUserAccounts = () => {
  //   setLoadingUsers(true);
  //   postRequest(
  //     "/getAllAccountsOfUser",
  //     {},
  //     (response) => {
  //       if (response.data) {
  //         setUsersData(response.data);
  //       } else {
  //         toast.error("Failed to fetch user accounts");
  //       }
  //       setLoadingUsers(false);
  //     },
  //     (error) => {
  //       toast.error("Error fetching user accounts");
  //       setLoadingUsers(false);
  //     }
  //   );
  // };

  // // Load users when component mounts
  // useEffect(() => {
  //   fetchUserAccounts();
  // }, []);

  // Handle logout
  async function handleLogout() {
    await logout();
    return navigate("/auth/login");
  }

  // Handle switch user click
  const handleSwitchUserClick = () => {
    setShowSwitchDialog(true);
  };

  // Handle user selection for switching
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Confirm and execute user switch
  const confirmUserSwitch = () => {
    if (!selectedUser) return;

    setIsLoading(true);
    postRequest(
      "/loginAsUser",
      { userId: selectedUser._id },
      (response) => {
        if (response.data) {
          toast.success(
            `Successfully logged in as ${selectedUser?.username || selectedUser?.firstname || "user"}`
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

  // Close dialog
  const handleCloseDialog = () => {
    setShowSwitchDialog(false);
    setSelectedUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover
        triggerButton={
          <Avatar
            src={`${MEDIA_BASE_URL}/${User?.profileImg}`}
            sizes={"small"}
            sx={{ boxShadow: 23, cursor: "pointer" }}
          />
        }
        sx={{ ml: 3 }}
      >
        <Div
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            p: (theme) => theme.spacing(2.5),
          }}
        >
          <Avatar
            src={`${MEDIA_BASE_URL}/${User?.profileImg}`}
            alt={User?.firstname}
            sx={{ width: 60, height: 60, mb: 2 }}
          />
          <Typography variant={"h5"}>{User.firstname}</Typography>
          <Typography variant={"body1"} color="text.secondary">
            {User?.email}
          </Typography>
        </Div>
        <Divider />
        <nav>
          <List disablePadding sx={{ pb: 1 }}>
            <Link to="/profile">
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PersonOutlineIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t("Profile")}
                  sx={{
                    my: 0,
                    color: "black",
                    textDecoration: "none !important",
                    display: "inline-block",
                  }}
                />
              </ListItemButton>
            </Link>
            {/* Conditionally render Switch User button only if there are accounts */}
            {usersData.length > 1 && (
              <ListItemButton onClick={handleSwitchUserClick}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <RepeatOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Switch User" sx={{ my: 0 }} />
              </ListItemButton>
            )}
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={t("Logout")} sx={{ my: 0 }} />
            </ListItemButton>
          </List>
        </nav>
      </JumboDdPopover>

      {/* User Switch Dialog */}
      <Dialog
        open={showSwitchDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: 400,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <Typography variant="h5" component="div">
            Switch User Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Select an account to switch to
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 3 }}>
          {loadingUsers ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ width: "100%" }}>
              {usersData.map((user) => (
                <ListItemButton
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  selected={selectedUser?._id === user._id}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    border: selectedUser?._id === user._id ? 2 : 1,
                    borderColor:
                      selectedUser?._id === user._id
                        ? "primary.main"
                        : "divider",
                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Avatar
                      src={`${MEDIA_BASE_URL}/${user?.profileImg}`}
                      sx={{ width: 40, height: 40 }}
                    >
                      {user?.firstname?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {user?.firstname} {user?.lastname}
                        </Typography>
                        {user?.isKycVerified && (
                          <CheckCircleIcon
                            sx={{ color: "green", fontSize: 16 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {user?.email}
                        </Typography>
                        {user?.username && (
                          <Typography variant="caption" color="text.secondary">
                            @{user.username}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                </ListItemButton>
              ))}

              {usersData.length === 0 && !loadingUsers && (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="text.secondary">
                    No additional accounts found
                  </Typography>
                </Box>
              )}
            </List>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmUserSwitch}
            variant="contained"
            disabled={!selectedUser || isLoading}
            startIcon={
              isLoading ? <CircularProgress size={20} /> : <LoginIcon />
            }
          >
            {isLoading ? "Switching..." : "Switch Account"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export { AuthUserPopover };
