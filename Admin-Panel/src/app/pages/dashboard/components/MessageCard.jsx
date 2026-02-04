import React, { useEffect, useState } from "react";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const STORAGE_KEY = "seenEarningWarning";

export default function MessageCard() {
  const { t } = useTranslation();
  const { User } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (User == null) return;

    const hasSeen = localStorage.getItem(STORAGE_KEY);

    if (!hasSeen && User.eligibleForEarning === false) {
      setIsVisible(true);
    }
  }, [User]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 400, md: 500 },
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    outline: "none",
  };

  return (
    <Modal
      open={isVisible}
      onClose={handleClose}
      aria-labelledby="earning-warning-title"
      aria-describedby="earning-warning-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box textAlign="center">
          <Typography
            id="earning-warning-title"
            variant="h5"
            component="h2"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              mb: 2,
            }}
          >
            {t("dashboard.Attention")}!
          </Typography>
          <Typography
            id="earning-warning-description"
            variant="body1"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            {t("dashboard.warning")}
          </Typography>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            {t("Ok")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}