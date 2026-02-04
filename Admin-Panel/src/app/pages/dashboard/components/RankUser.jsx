import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Stack,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import StarsIcon from "@mui/icons-material/Stars";
import { Flame, Gem } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UserCard({ user }) {
  const { t } = useTranslation();
  if (!user) {
    return (
      <Card sx={{ maxWidth: 350, mx: "auto", mt: 2 }}>
        <CardContent sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No user data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { fullName, username, email, rankDetails = {} } = user;

  const { rank = "N/A", criteria = {} } = rankDetails;

  return (
    <Card sx={{ my: 3, borderLeft: "6px solid #DC2626", borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4">
              {" "}
              {t("dashboard.highRankAchiever")}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {rank}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              {fullName || username}
            </Typography>
          </Box>
          <Box className="p-3 bg-red-100 rounded-lg">
            <Flame className="w-8 h-8 text-red-600" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
