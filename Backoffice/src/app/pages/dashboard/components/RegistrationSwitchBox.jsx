import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { postRequest } from "../../../../backendServices/ApiCalls";

const RegistrationSwitchBox = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");
  const [registrationData, setRegistrationData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTimeframeChange = (_, newValue) => {
    if (newValue) {
      setSelectedTimeframe(newValue);
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      await postRequest(
        "/getNewRegistrations",
        {
          timeFrame: selectedTimeframe,
        },
        (res) => {
          if (res?.data) {
            setRegistrationData(res.data.data);
          }
        }
      );
    } catch (error) {
      console.log("Error fetching registrations", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [selectedTimeframe]);

  return (
    <Box>
      {/* Timeframe Switch */}
      <Box display="flex" justifyContent="center" my={3}>
        <ToggleButtonGroup
          value={selectedTimeframe}
          exclusive
          onChange={handleTimeframeChange}
          aria-label="Timeframe"
        >
          <ToggleButton value="today" aria-label="Today">
            <TodayIcon sx={{ mr: 1 }} /> Today
          </ToggleButton>
          <ToggleButton value="thisWeek" aria-label="This Week">
            <CalendarViewWeekIcon sx={{ mr: 1 }} /> This Week
          </ToggleButton>
          <ToggleButton value="thisMonth" aria-label="This Month">
            <CalendarMonthIcon sx={{ mr: 1 }} /> This Month
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Data Area */}
      <Box minHeight={200} position="relative">
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <CircularProgress />
          </Box>
        ) : registrationData.length > 0 ? (
          <Grid container spacing={2}>
            {registrationData.map((user) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user.userId}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    boxShadow: 2,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user.firstName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{user.username}
                    </Typography>
                    <Typography variant="body2" color="text.primary" mt={1}>
                      <strong>Left:</strong> {user.totalLeftPoints}
                    </Typography>
                    <Typography variant="body2" color="text.primary" mt={0.5}>
                      <strong>Right:</strong> {user.totalRightPoints}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" mt={4}>
            <Typography variant="body1" color="text.secondary">
              No data available for "{selectedTimeframe}"
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RegistrationSwitchBox;
