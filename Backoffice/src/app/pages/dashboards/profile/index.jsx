import React, { useState } from "react";

import { ContentLayout } from "@app/_layouts/ContentLayout";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { getAssetPath } from "@app/_utilities/helpers";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import {
  Alert,
  AlertTitle,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { ProfileHeader } from "@app/_components/common/ProfileHeader";
import { UserProfileSidebar } from "@app/_components/common/UserProfileSidebar";
import UserProfileCard from "@app/_components/common/About/About";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import SidebarNavigation from "./SidebarNavigation";
import UserProfile from "./UserProfile";
import { useTranslation } from "react-i18next";
import { ResetPasswordSettings } from "@app/_components/common/settings";
import QrCodeIcon from "@mui/icons-material/QrCode";
import QRCode from "qrcode";
import ReactQRCode from "react-qr-code";
import ManageWalletAddress from "./ManageWalletAddress";
const useProfileLayout = () => {
  const { theme } = useJumboTheme();
  return React.useMemo(
    () => ({
      headerOptions: {
        sx: {
          mt: -4,
          mb: -7.25,
          mx: { xs: -4, lg: -6 },
          p: { xs: theme.spacing(6, 4, 11), lg: theme.spacing(6, 6, 11) },
          background: `#002447 url(${getAssetPath(`${ASSET_IMAGES}/profile-bg.jpg`, "1920x580")}) no-repeat center`,
          backgroundSize: "cover",
          color: "common.white",
          position: "relative",

          "&::after": {
            display: "inline-block",
            position: "absolute",
            content: `''`,
            inset: 0,
            backgroundColor: alpha(theme.palette.common.black, 0.65),
          },
        },
      },
      sidebarOptions: {
        sx: {
          mr: 3.75,
          width: { xs: "100%", lg: "33%" },
          [theme.breakpoints.down("lg")]: {
            minHeight: 0,
            mr: 0,
            order: 2,
            mt: 3.75,
          },
        },
      },
      wrapperOptions: {
        sx: {
          [theme.breakpoints.down("lg")]: {
            flexDirection: "column",
          },
        },
        container: true,
      },
      mainOptions: {
        sx: {
          [theme.breakpoints.down("lg")]: {
            minHeight: 0,
          },
        },
      },
      contentOptions: {
        sx: {
          p: { lg: 0, xs: 0 },
        },
      },
    }),
    [theme],
  );
};

const Profile = () => {
  const { t } = useTranslation();
  const allNavItems = [
    {
      label: t("UserProfile"),
      path: "profile",
      icon: "public-profile",
    },
    {
      label: t("changePassword"),
      path: "change-password",
      icon: "reset-password",
    },
    {
      label: t("Manage Withdrawals"),
      path: "Manage-WalletAddress",
      icon: "crypto",
    },
  ];

  const [tab, setTab] = useState("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profileLayoutOptions = useProfileLayout();
  const { User } = useAuth();
  const isReferralActive = true;
  const referralLink = `${window.location.origin}/auth/signup-1?ref=${User?.refferrCode}`;
  const [selectedOption, setSelectedOption] = useState("left"); // default to 'left'
  const filteredNavItems = User?.roles?.includes("User")
    ? allNavItems
    : allNavItems.slice(0, 2);
  // Modified referral link generation
  const getModifiedReferralLink = () => {
    const suffix = selectedOption === "left" ? "_L" : "_R";
    return `${referralLink}${suffix}`;
  };
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const generateQRCode = (text) => {
    return QRCode.toDataURL(text);
  };
  const handleNavigation = (navItem) => {
    setTab(navItem?.path);
  };

  const Swal = useSwalWrapper();
  const sweetAlerts = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
    });
  };

  const copyReferralLink = (text) => {
    if (!text) {
      sweetAlerts("error", "Error", "No referral link to copy.");
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Snackbar or Sweet Alert
        sweetAlerts("success", t("dashboard.success"), t("dashboard.success"));
      })
      .catch((err) => {
        sweetAlerts("error", "Error", "Something went wrong.");
      });
  };
  return (
    <>
      <ContentLayout header={<ProfileHeader />} {...profileLayoutOptions}>
        <Box
          sx={{
            display: "flex",
            gap: "2%",
            flexDirection: {
              xs: "column", // mobile: column
              md: "row", // md and up: row
            },
          }}
        >
          <Box
            sx={{
              width: {
                xs: "100%", // full width on small screens
                md: "30%", // 30% on medium and up
              },
            }}
          >
            <UserProfileSidebar />
          </Box>
          <Box
            sx={{
              width: {
                xs: "100%",
                md: "70%",
              },
              mx: "auto",
            }}
          >
            <Stack spacing={3.75}>
              {User?.roles?.includes("User") && (
                <Card sx={{ mb: 3, bgcolor: "#faf1eb", p: 3 }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight={600} mb={1}>
                      {t("dashboard.referral.bonusTitle")}
                    </Typography>
                    <Typography variant="body1" mb={2}>
                      {t("dashboard.referral.description")}
                    </Typography>

                    <Box
                      display="flex"
                      flexWrap="wrap"
                      alignItems="center"
                      gap={2}
                      mb={2}
                    >
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>
                          {t("dashboard.referral.selectOption")}
                        </InputLabel>
                        <Select
                          value={selectedOption}
                          onChange={(e) => setSelectedOption(e.target.value)}
                          label={t("dashboard.referral.selectOption")}
                        >
                          <MenuItem value="left">
                            {t("dashboard.referral.left")}
                          </MenuItem>
                          <MenuItem value="right">
                            {t("dashboard.referral.right")}
                          </MenuItem>
                        </Select>
                      </FormControl>

                      <Button
                        variant="contained"
                        onClick={() =>
                          copyReferralLink(getModifiedReferralLink())
                        }
                        sx={{
                          background:
                            "linear-gradient(to right, #7DD3FC, #8B7550, #0EA5E9)",
                          "&:hover": {
                            background:
                              "linear-gradient(to right, #BFA670, #9C7F52, #7A5F3A)",
                          },
                        }}
                      >
                        {t("dashboard.referral.copyLink")}
                      </Button>
                    </Box>

                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ wordBreak: "break-all", flex: 1 }}
                      >
                        {getModifiedReferralLink()}
                      </Typography>
                      <ReactQRCode
                        value={getModifiedReferralLink()}
                        size={100}
                      />
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </Box>
        </Box>

        <div style={{ transform: "scale(0.94) ", marginTop: 20 }}>
          <Grid container spacing={8.75}>
            <Grid item xs={12} md={3.5}>
              <Box sx={{ p: 3 }}>
                <SidebarNavigation
                  navItems={filteredNavItems}
                  currentTab={tab}
                  onNavigate={handleNavigation}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={8.5}>
              {tab === "profile" && <UserProfile />}
              {tab === "change-password" && <ResetPasswordSettings />}
              {User?.roles?.includes("User") &&
                tab === "Manage-WalletAddress" && <ManageWalletAddress />}
            </Grid>
          </Grid>
        </div>
      </ContentLayout>
    </>
  );
};

export default Profile;
