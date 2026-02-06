import { AuthUserPopover } from "@app/_components/popovers/AuthUserPopover";
import { MessagesPopover } from "@app/_components/popovers/MessagesPopover";
import { NotificationsPopover } from "@app/_components/popovers/NotificationsPopover";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  useJumboLayout,
  useSidebarState,
} from "@jumbo/components/JumboLayout/hooks";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";

import { SIDEBAR_STYLES } from "@jumbo/utilities/constants";

import {
  Stack,
  useMediaQuery,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  AccountCircle,
  Settings,
  Help,
  Logout,
  Dashboard,
  Person,
  Email,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Search, SearchIconButtonOnSmallScreen } from "./components";
import { TranslationPopover } from "@app/_components/popovers/TranslationPopover";
import { ThemeModeOption } from "./components/ThemeModeOptions";
import { Logo, SidebarToggleButton } from "@app/_components/_core";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import {
  MEDIA_BASE_URL,
  postRequest,
} from "../../../../backendServices/ApiCalls";
import { Link } from "react-router-dom";

function Header() {
  const { isSidebarStyle } = useSidebarState();
  const [searchVisibility, setSearchVisibility] = React.useState(false);
  const [greenIDStatus, setGreenIDStatus] = useState();
  const { headerOptions } = useJumboLayout();
  const { theme } = useJumboTheme();
  const isBelowLg = useMediaQuery(
    theme.breakpoints.down(headerOptions?.drawerBreakpoint ?? "xl"),
  );
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));

  const { User } = useAuth();
  // Mock user data - replace with actual user context/hook
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/path/to/avatar.jpg", // or null for initials
    role: "Premium User",
    isOnline: true,
  };

  const fetchUserStatus = () => {
    try {
      postRequest("/getGreenIdUser", {}, (response) => {
        console.log("Status green id response", response);
        setGreenIDStatus(response.data.GreenID);
      });
    } catch (error) {
      console.log("error feetching status", error.message);
    }
  };

  useEffect(() => {
    fetchUserStatus();
  }, []);

  const handleSearchVisibility = React.useCallback((value) => {
    setSearchVisibility(value);
  }, []);

  const handleAccountSettings = () => {
    // Navigate to account settings
    console.log("Navigate to account settings");
  };

  const handleHelp = () => {
    // Navigate to help/support
    console.log("Navigate to help");
  };

  const handleLogout = () => {
    // Handle logout
    console.log("Handle logout");
  };

  if (!User) {
    return <div></div>;
  }

  return (
    <React.Fragment>
      <SidebarToggleButton />
      {isSidebarStyle(SIDEBAR_STYLES.CLIPPED_UNDER_HEADER) && !isBelowLg && (
        <Logo sx={{ mr: 3, minWidth: 150 }} mode={theme.type} />
      )}

      {/* Main header content */}
      <Stack direction="row" alignItems="center" gap={2} sx={{ ml: "auto" }}>
        {/* User Info Section - Hide on small screens */}
        {!isBelowMd && (
          <>
            <Stack direction="row" alignItems="center" gap={1.5}>
              {/* User Avatar and Info */}
              <Stack direction="row" alignItems="center" gap={1}>
                {/* <Avatar
                  src={`${MEDIA_BASE_URL}/${User?.profileImg}`}
                  alt={User?.firstname}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                  }}
                >
                  {User?.username}
                </Avatar> */}

                <Stack direction="column" spacing={0}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ lineHeight: 1.2 }}
                  >
                    {User?.firstName}
                  </Typography>
                  <Stack direction="row" alignItems="center" gap={0.5}>
                    <Email sx={{ fontSize: 12, color: "text.secondary" }} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ lineHeight: 1 }}
                    >
                      {User.email}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              {/* User Status/Role */}
              {/* <Chip
                label={greenIDStatus ? "Green ID" : "Red ID"}
                size="small"
                color={greenIDStatus ? "success" : "error"}
                variant="outlined"
                icon={greenIDStatus ? <CheckCircleIcon /> : <CancelIcon />}
                sx={{ fontSize: "0.75rem", height: 24 }}
              /> */}

              {/* Online Status Indicator */}
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: user.isOnline ? "success.main" : "grey.400",
                  border: `2px solid ${theme.palette.background.paper}`,
                }}
              />
            </Stack>

            <Divider orientation="vertical" flexItem />
          </>
        )}

        <TranslationPopover />

        {/* Action Buttons */}
        <Stack direction="row" alignItems="center" gap={0.5}>
          {/* Search - you can uncomment if needed */}

          {/* Account Settings */}
          <Tooltip title="Account Settings">
            <Link
              to={`${User?.roles?.includes("User") ? "/profile" : "/selfMintingcommission"}`}
            >
              <IconButton
                onClick={handleAccountSettings}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <Settings fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>

          {/* Help */}
          <Tooltip title="Help & Support">
            <IconButton
              onClick={handleHelp}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <Help fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Dashboard (if needed) */}
          <Tooltip title="Dashboard">
            <Link to={"/"}>
              <IconButton
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <Dashboard fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
        </Stack>

        {/* Auth User Popover - Enhanced */}
        <AuthUserPopover />
      </Stack>
    </React.Fragment>
  );
}

export { Header };
