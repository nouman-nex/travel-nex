import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  LinearProgress,
  Alert,
  Container,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { AccessTime, TouchApp } from "@mui/icons-material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { useNavigate } from "react-router-dom";

const SelfMintingPage = () => {
  const [mintingActivities, setMintingActivities] = useState([]);
  const { User } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickingLoading, setClickingLoading] = useState({}); // Track loading state for each activity

  // Helper function to get today's clicks count
  const getTodayClicksCount = (clickHistory) => {
    if (!clickHistory || clickHistory.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return clickHistory.filter((click) => {
      const clickDate = new Date(click.clickTime);
      return clickDate >= today && clickDate < tomorrow;
    }).length;
  };

  // Helper function to get the last click time
  const getLastClickTime = (clickHistory) => {
    if (!clickHistory || clickHistory.length === 0) return null;

    const sortedClicks = [...clickHistory].sort(
      (a, b) => new Date(b.clickTime) - new Date(a.clickTime)
    );

    return new Date(sortedClicks[0].clickTime);
  };

  // Helper function to calculate next click time
  const calculateNextClickTime = (clickHistory) => {
    const todayClicks = getTodayClicksCount(clickHistory);
    const lastClickTime = getLastClickTime(clickHistory);

    if (todayClicks === 0) {
      // No clicks today, can click immediately
      return null;
    } else if (todayClicks === 1) {
      // One click done today, need to wait 12 hours from last click
      if (lastClickTime) {
        return new Date(lastClickTime.getTime() + 12 * 60 * 60 * 1000);
      }
      return null;
    } else {
      // Two clicks done today, need to wait until tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow;
    }
  };

  // Helper function to check if user can click
  const canClick = (clickHistory) => {
    const todayClicks = getTodayClicksCount(clickHistory);
    const nextClickTime = calculateNextClickTime(clickHistory);

    if (todayClicks >= 2) {
      return false; // Already clicked 2 times today
    }

    if (nextClickTime && currentTime < nextClickTime.getTime()) {
      return false; // Still in cooldown
    }

    return true;
  };

  const getUserMintings = async () => {
    try {
      setLoading(true);
      setError(null);

      await postRequest(
        "/getMintingActivities",
        { type: "MANUAL" },
        (response) => {
          console.log("Minting activities response:", response);
          if (
            response.data &&
            response.data.success &&
            response.data.data &&
            response.data.data.length > 0
          ) {
            const activities = response.data.data.map((mintingActivity) => {
              // Calculate days since start
              const startDate = new Date(mintingActivity.startDate);
              const currentDate = new Date();
              const daysSinceStart =
                Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)) +
                1;

              // Use actual data from backend
              const totalClicks = mintingActivity.clicksDone || 0;
              const totalProfit = mintingActivity.totalProfitEarned || 0;
              const clickHistory = mintingActivity.clickHistory || [];

              // Calculate today's clicks and next click time
              const todayClicks = getTodayClicksCount(clickHistory);
              const nextClickTime = calculateNextClickTime(clickHistory);
              const isEligible = canClick(clickHistory);

              // Get hub package info
              const hubPackage = mintingActivity.investmentId?.hubPackage || {};
              const packageAmount = hubPackage.amount || 0;
              const hubCapacity = hubPackage.hubCapacity || 0;

              return {
                _id: mintingActivity._id,
                totalProfit: totalProfit,
                dailyClicks: todayClicks,
                nextClickTime: nextClickTime,
                isEligible: isEligible,
                totalDuration: 25 * 30, // 25 months in days
                currentDay: Math.min(daysSinceStart, 25 * 30),
                missedDays: 0,
                investedAmount: mintingActivity.investedAmount || 0,
                investmentId:
                  mintingActivity.investmentId?._id ||
                  mintingActivity.investmentId,
                startDate: startDate,
                hubPackage: hubPackage,
                packageAmount: packageAmount,
                hubCapacity: hubCapacity,
                clicksDone: totalClicks,
                isActive: mintingActivity.isActive,
                clickHistory: clickHistory,
                lastClickTime: getLastClickTime(clickHistory),
              };
            });

            setMintingActivities(activities);
          } else {
            setMintingActivities([]);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching minting activities:", error);
          setError("Failed to load minting data. Please try again.");
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("Error in getUserMintings:", err);
      setError("Failed to load minting data. Please try again.");
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    getUserMintings();
  }, []);
  
  const navigate = useNavigate();

  // Format time countdown
  const formatCountdown = useCallback(
    (targetTime) => {
      if (!targetTime) return "00:00:00";

      const distance = targetTime.getTime() - currentTime;

      if (distance < 0) return "00:00:00";

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    },
    [currentTime]
  );

  // Get countdown message
  const getCountdownMessage = (activity) => {
    if (!activity.nextClickTime) return "Ready to click!";

    const todayClicks = activity.dailyClicks;
    if (todayClicks === 1) {
      return "Next click available in:";
    } else if (todayClicks === 2) {
      return "Next click available tomorrow:";
    }
    return "Next click available in:";
  };

  // Self Minting Click Handler - Updated with API integration
  const handleSelfMintClick = async (activityId) => {
    const activity = mintingActivities.find((a) => a._id === activityId);
    if (!activity || !activity.isEligible || !activity.investmentId) return;

    // Set loading state for this specific activity
    setClickingLoading((prev) => ({ ...prev, [activityId]: true }));

    try {
      // Make API call to record the click
      await postRequest(
        "/recordClick",
        {
          mintingActivityId: activityId,
        },
        (response) => {
          console.log("Click recorded successfully:", response);

          if (response.data && response.data.success) {
            const { data } = response.data;

            // Add success notification with actual profit
            setNotifications((prev) => [
              ...prev,
              {
                id: Date.now(),
                message: `Self minting successful! +$${data.profitEarned.toFixed(4)} profit earned. Total profit: $${data.totalProfitEarned.toFixed(4)}`,
                type: "success",
              },
            ]);

            // Refresh data to get updated info
            setTimeout(() => {
              getUserMintings();
            }, 1000);
          }
        },
        (error) => {
          console.error("Error recording click:", error);

          // Show specific error message from backend
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to process click. Please try again.";

          setNotifications((prev) => [
            ...prev,
            {
              id: Date.now(),
              message: errorMessage,
              type: "error",
            },
          ]);
        }
      );
    } catch (error) {
      console.error("Error in handleSelfMintClick:", error);
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: "Failed to process click. Please try again.",
          type: "error",
        },
      ]);
    } finally {
      // Remove loading state for this activity
      setClickingLoading((prev) => {
        const newState = { ...prev };
        delete newState[activityId];
        return newState;
      });
    }
  };

  // Main timer effect - updates current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check eligibility when time updates
  useEffect(() => {
    setMintingActivities((prev) =>
      prev.map((activity) => {
        const newIsEligible = canClick(activity.clickHistory);
        const newNextClickTime = calculateNextClickTime(activity.clickHistory);
        const newDailyClicks = getTodayClicksCount(activity.clickHistory);

        // If eligibility changed from false to true, show notification
        if (!activity.isEligible && newIsEligible) {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            {
              id: Date.now() + Math.random(),
              message: `Self minting is now available for $${activity.investedAmount} investment!`,
              type: "info",
            },
          ]);
        }

        return {
          ...activity,
          isEligible: newIsEligible,
          nextClickTime: newNextClickTime,
          dailyClicks: newDailyClicks,
        };
      })
    );
  }, [currentTime]);

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      const timer = setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== latestNotification.id)
        );
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your minting data...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={getUserMintings}>
          Retry
        </Button>
      </Container>
    );
  }

  if (mintingActivities.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Self Minting
        </Typography>
        <Alert severity="info">
          No active minting activities found. Please make an investment to start
          minting.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        Self Minting ({mintingActivities.length} Active)
      </Typography>

      {/* Notifications */}
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          severity={notification.type}
          sx={{ mb: 2 }}
          onClose={() =>
            setNotifications((prev) =>
              prev.filter((n) => n.id !== notification.id)
            )
          }
        >
          {notification.message}
        </Alert>
      ))}

      {/* Multiple Minting Cards */}
      <Grid container spacing={3}>
        {mintingActivities.map((activity) => (
          <Grid item xs={12} md={6} key={activity._id}>
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  mb={2}
                  justifyContent="center"
                >
                  <TouchApp color="primary" sx={{ mr: 2, fontSize: 32 }} />
                  <Typography variant="h5" component="h2">
                    INVESTED AMOUNT ${activity.investedAmount}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                  align="center"
                >
                  Click twice daily for profit (12 hours gap between clicks)
                </Typography>

                <Paper
                  elevation={1}
                  sx={{ p: 2, mb: 3, bgcolor: "background.default" }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Total Profit Earned
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        ${activity.totalProfit.toFixed(4)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Today's Clicks
                      </Typography>
                      <Typography variant="h6">
                        {activity.dailyClicks}/2
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Hub Capacity
                      </Typography>
                      <Typography variant="body1">
                        {activity.hubCapacity}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Total Clicks
                      </Typography>
                      <Typography variant="body1">
                        {activity.clicksDone}
                      </Typography>
                    </Grid>
                    {activity.lastClickTime && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Last Click: {activity.lastClickTime.toLocaleString()}
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Progress ({activity.currentDay}/{activity.totalDuration}{" "}
                        days)
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (activity.currentDay / activity.totalDuration) * 100
                        }
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {(
                          (activity.currentDay / activity.totalDuration) *
                          100
                        ).toFixed(1)}
                        % Complete
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Dynamic Timer Display */}
                {activity.nextClickTime && !activity.isEligible && (
                  <Box sx={{ mb: 2 }} textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      {getCountdownMessage(activity)}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="warning.main"
                      sx={{ mt: 1 }}
                    >
                      <AccessTime sx={{ verticalAlign: "middle", mr: 1 }} />
                      {formatCountdown(activity.nextClickTime)}
                    </Typography>
                  </Box>
                )}

                {/* Ready to Click Message */}
                {activity.isEligible && (
                  <Box sx={{ mb: 2 }} textAlign="center">
                    <Typography variant="h6" color="success.main">
                      ✓ Ready to Click!
                    </Typography>
                  </Box>
                )}

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => handleSelfMintClick(activity._id)}
                  disabled={
                    !activity.isEligible ||
                    !activity.investmentId ||
                    clickingLoading[activity._id]
                  }
                  startIcon={
                    clickingLoading[activity._id] ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <TouchApp />
                    )
                  }
                  sx={{ mb: 2, py: 1.5 }}
                >
                  {clickingLoading[activity._id]
                    ? "Processing..."
                    : !activity.investmentId
                      ? "No Active Investment"
                      : activity.isEligible
                        ? `Click to Mint (${activity.dailyClicks}/2 today)`
                        : activity.dailyClicks >= 2
                          ? "Daily Limit Reached"
                          : "Cooling Down"}
                </Button>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Investment Details:
                  </Typography>
                  <Typography variant="caption" display="block">
                    • Invested: ${activity.investedAmount}
                  </Typography>
                  <Typography variant="caption" display="block">
                    • Started: {activity.startDate.toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" display="block">
                    • Status: {activity.isActive ? "Active" : "Inactive"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Summary Info */}
      <Card elevation={2} sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 2 }}
            align="center"
          >
            Self Minting Rules:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Click twice daily with 12 hours gap between clicks
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Profit calculated based on your investment and downline
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Daily limit resets at midnight
          </Typography>
          <Typography variant="body2">
            • Track your progress over 25 months
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SelfMintingPage;