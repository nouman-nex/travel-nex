import {
  Chip,
  ListItemText,
  Typography,
  ListItemButton,
  Box,
} from "@mui/material";
import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

const RecentClickItem = ({ item }) => {
  const { t } = useTranslation();

  const formattedTime = moment(item.clickTime).format("DD MMM YYYY, hh:mm A");

  return (
    <ListItemButton
      component="li"
      sx={{
        p: "12px 24px",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: `rgba(0, 0, 0, 0.2) 0px 3px 10px 0px`,
          transform: "translateY(-4px)",
        },
      }}
    >
      <ListItemText
        primary={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">
              {t("dashboard.minting.investedAmount")} ${item.investedAmount}
            </Typography>
            <Chip
              label={item.mintingType === "MANUAL" ? "SELF" : item.mintingType}
              color={item.mintingType === "AUTO" ? "primary" : "secondary"}
              size="small"
            />
          </Box>
        }
        secondary={
          <Typography variant="body2" color="text.secondary">
            • {formattedTime}
          </Typography>
        }
      />
    </ListItemButton>
  );
};

export { RecentClickItem };
