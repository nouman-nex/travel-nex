import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  CardHeader,
  Paper,
  Stack,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import TodayIcon from "@mui/icons-material/Today";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

export default function RegistrationStats({ stats }) {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation();

  const tabNames = [
    t("dashboard.daily"),
    t("dashboard.weekly"),
    t("dashboard.monthly"),
  ];

  // We are using the hardcoded tab names to access the stats object
  const tabKeys = ["daily", "weekly", "monthly"];
  const currentTabKey = tabKeys[activeTab];
  const data = stats?.[currentTabKey];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const statItems = [
    {
      title: t("dashboard.leftLeg"),
      value: data?.leftLeg || "0",
      icon: <PersonOutlineIcon color="primary" />,
    },
    {
      title: t("dashboard.rightLeg"),
      value: data?.rightLeg || "0",
      icon: <PersonOutlineIcon color="secondary" />,
    },
    {
      title: t("dashboard.totalLeg"),
      value: data?.total || "0",
      icon: <GroupsIcon sx={{ color: "success.main" }} />,
    },
  ];

  return (
    <Card
      sx={{
        maxWidth: "100%",
        margin: "2rem auto",
        boxShadow: 4,
        borderRadius: 4,
      }}
    >
      <CardHeader
        title={
          <Typography variant="h4">{t("dashboard.newRegistrations")}</Typography>
        }
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      />
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="registration stats tabs"
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              icon={<TodayIcon />}
              iconPosition="start"
              label={t("dashboard.daily")}
              id={`tab-0`}
              aria-controls={`tabpanel-0`}
            />
            <Tab
              icon={<CalendarViewWeekIcon />}
              iconPosition="start"
              label={t("dashboard.weekly")}
              id={`tab-1`}
              aria-controls={`tabpanel-1`}
            />
            <Tab
              icon={<CalendarMonthIcon />}
              iconPosition="start"
              label={t("dashboard.monthly")}
              id={`tab-2`}
              aria-controls={`tabpanel-2`}
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {statItems.map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Stack
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    {item.icon}
                    <Typography variant="body1" color="text.secondary">
                      {item.title}
                    </Typography>
                    <Typography variant="h5" component="div" fontWeight="bold">
                      {item.value}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
