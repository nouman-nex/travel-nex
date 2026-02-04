import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
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
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Switch,
  Tooltip,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { AccessTime, TouchApp, AutoFixHigh } from "@mui/icons-material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { Div } from "@jumbo/shared";
import { ToastContainer, toast } from "react-toastify";
import { Activity, Bold, DollarSign, Package, TrendingUp } from "lucide-react";
import "./spinner.css";
import useNotify from "@app/_components/Notification/useNotify";
import { Link } from "react-router-dom";

const MintingPage = () => {
  const { t } = useTranslation();
  const [mintingType, setMintingType] = useState("MANUAL"); // 'MANUAL' or 'AUTO'
  const [mintingActivities, setMintingActivities] = useState([]);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const { User } = useAuth();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bulkClickingLoading, setBulkClickingLoading] = useState(false);
  const [mintingInsights, setMintingInsights] = useState([]);
  const [mintingMessage, setMintingMessage] = useState("");

  const [createdAt, setCreatedAt] = useState(null);

  const [showMintingAnimation, setShowMintingAnimation] = useState(false);
  const [showMintingSuccess, setShowMintingSuccess] = useState(false);
  const [suppressMainLoading, setSuppressMainLoading] = useState(false);

  const [showMintingError, setShowMintingError] = useState(false);
  const [btnLoading, setTtnLoading] = useState(false);

  const [selfMintingBtnStatus, setSelfMintingBtnStatus] = useState(false);
  const [autoMintingBtnStatus, setAutoMintingBtnStatus] = useState(false);
  const [pahseForClick, setPahseForClick] = useState(0);

  const notify = useNotify();
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

  // Helper function to calculate next click time based on minting type
  const calculateNextClickTime = (clickHistory, type) => {
    const todayClicks = getTodayClicksCount(clickHistory);
    const lastClickTime = getLastClickTime(clickHistory);

    if (type === "MANUAL") {
      if (todayClicks === 0) {
        return null;
      } else if (todayClicks === 1) {
        if (lastClickTime) {
          return new Date(lastClickTime.getTime() + 12 * 60 * 60 * 1000); // 12 hours cooldown
        }
        return null;
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
      }
    } else {
      // AUTO minting - 30 days cooldown
      if (lastClickTime) {
        return new Date(lastClickTime.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days cooldown
      }
      return null;
    }
  };
  const toggleMintingType = async (id) => {
    try {
      const payload = { mintingActivityId: id };
      console.log("Toggle Payload:", payload);

      await postRequest("/toggleMintingType", payload, (res) => {
        const { data } = res;

        if (data?.success) {
          toast.success(data.message);
          console.log("Toggle Response Data:", data.data);
          setShowToggleModal(false);
          setSelectedActivity(null);

          setTimeout(() => {
            getUserMintings();
          }, 1000);
        } else {
          toast.error(data?.message || "Minting toggle failed.");
        }
      });
    } catch (error) {
      console.error("Toggle Error:", error);
      toast.error("Something went wrong while toggling");
    }
  };
  const handleToggleClick = (activity) => {
    setSelectedActivity(activity);
    setShowToggleModal(true);
  };

  // Helper function to check if user can click
  const canClick = (clickHistory, type) => {
    if (type === "MANUAL") {
      const todayClicks = getTodayClicksCount(clickHistory);
      const nextClickTime = calculateNextClickTime(clickHistory, type);

      if (todayClicks >= 2) {
        return false;
      }

      if (nextClickTime && currentTime < nextClickTime.getTime()) {
        return false;
      }

      return true;
    } else {
      // AUTO minting - only check cooldown
      const nextClickTime = calculateNextClickTime(clickHistory, type);
      return !nextClickTime || currentTime >= nextClickTime.getTime();
    }
  };

  // Get the earliest investment for global timer
  const getEarliestInvestment = () => {
    if (mintingActivities.length === 0) return null;

    return mintingActivities.reduce((earliest, current) => {
      if (!earliest) return current;
      return new Date(current.startDate) < new Date(earliest.startDate)
        ? current
        : earliest;
    }, null);
  };

  // Calculate global timer based on earliest investment - CONTINUOUS TIMER
  const getGlobalTimer = () => {
    const earliestInvestment = getEarliestInvestment();
    if (!earliestInvestment) return null;

    // Get the creation/start date of the earliest investment
    const startDate = new Date(
      earliestInvestment.createdAt || earliestInvestment.startDate
    );

    if (mintingType === "MANUAL") {
      // For manual: 24 hours cycles from the start date
      const cycleLength = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const timeSinceStart = currentTime - startDate.getTime();

      // Calculate how many complete cycles have passed
      const completedCycles = Math.floor(timeSinceStart / cycleLength);

      // Calculate when the next cycle starts
      const nextCycleStart =
        startDate.getTime() + (completedCycles + 1) * cycleLength;

      // If we're in the first 24 hours, show countdown to first availability
      if (timeSinceStart < cycleLength) {
        return new Date(startDate.getTime() + cycleLength);
      }

      // Otherwise, show countdown to next 24-hour cycle
      return new Date(nextCycleStart);
    } else {
      // For auto: 30 days cycles from the start date
      const cycleLength = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
      const timeSinceStart = currentTime - startDate.getTime();

      // Calculate how many complete cycles have passed
      const completedCycles = Math.floor(timeSinceStart / cycleLength);

      // Calculate when the next cycle starts
      const nextCycleStart =
        startDate.getTime() + (completedCycles + 1) * cycleLength;

      // If we're in the first 30 days, show countdown to first availability
      if (timeSinceStart < cycleLength) {
        return new Date(startDate.getTime() + cycleLength);
      }

      // Otherwise, show countdown to next 30-day cycle
      return new Date(nextCycleStart);
    }
  };

  // Updated countdown message function
  const getGlobalCountdownMessage = () => {
    const globalTimer = getGlobalTimer();
    const earliestInvestment = getEarliestInvestment();

    if (!globalTimer || !earliestInvestment) return "Ready to mint!";

    const startDate = new Date(
      earliestInvestment.createdAt || earliestInvestment.startDate
    );
    const timeSinceStart = currentTime - startDate.getTime();

    if (mintingType === "MANUAL") {
      const cycleLength = 24 * 60 * 60 * 1000; // 24 hours

      if (timeSinceStart < cycleLength) {
        return "First minting available in:";
      } else {
        return "Next minting cycle in:";
      }
    } else {
      const cycleLength = 30 * 24 * 60 * 60 * 1000; // 30 days

      if (timeSinceStart < cycleLength) {
        return "First auto minting available in:";
      } else {
        return "Next auto minting cycle in:";
      }
    }
  };

  // Helper function to check if minting is available in current cycle
  const canMintInCurrentCycle = () => {
    const earliestInvestment = getEarliestInvestment();
    if (!earliestInvestment) return false;

    const startDate = new Date(
      earliestInvestment.createdAt || earliestInvestment.startDate
    );
    const timeSinceStart = currentTime - startDate.getTime();

    if (mintingType === "MANUAL") {
      const cycleLength = 24 * 60 * 60 * 1000; // 24 hours

      // If we haven't reached the first cycle yet
      if (timeSinceStart < cycleLength) {
        return false;
      }

      // Check if we're currently in an active cycle
      const timeInCurrentCycle = timeSinceStart % cycleLength;
      return timeInCurrentCycle < cycleLength; // Always true, but kept for clarity
    } else {
      const cycleLength = 30 * 24 * 60 * 60 * 1000; // 30 days

      // If we haven't reached the first cycle yet
      if (timeSinceStart < cycleLength) {
        return false;
      }

      // Check if we're currently in an active cycle
      const timeInCurrentCycle = timeSinceStart % cycleLength;
      return timeInCurrentCycle < cycleLength; // Always true, but kept for clarity
    }
  };
  // Format amount helper
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount || 0);
  };

  const [timer, setTimer] = useState({
    phase: "",
    timeRemaining: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
  });

  useEffect(() => {
    const calculateTimer = () => {
      const now = new Date();
      const createdDate = new Date(createdAt);

      if (mintingType === "MANUAL") {
        const msSinceCreated = now - createdDate;
        const msIn24h = 24 * 60 * 60 * 1000;
        const msIn12h = 12 * 60 * 60 * 1000;

        const timeInCurrentCycle = msSinceCreated % msIn24h;
        const isFirstHalf = timeInCurrentCycle < msIn12h;

        const timePassedInCurrentHalf = timeInCurrentCycle % msIn12h;
        const timeRemaining = msIn12h - timePassedInCurrentHalf;

        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor(
          (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        return {
          phase: isFirstHalf ? 1 : 2,
          timeRemaining: { hours, minutes, seconds },
        };
      }

      if (mintingType === "AUTO") {
        const msIn30Days = 30 * 24 * 60 * 60 * 1000;
        const msSinceCreated = now - createdDate;

        // How far are we into the current cycle
        const timeInCurrentCycle = msSinceCreated % msIn30Days;
        const msRemaining = msIn30Days - timeInCurrentCycle;

        const days = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (msRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((msRemaining % (1000 * 60)) / 1000);

        return {
          phase: null, // Not needed for AUTO
          timeRemaining: { days, hours, minutes, seconds },
        };
      }

      return {
        phase: null,
        timeRemaining: { hours: 0, minutes: 0, seconds: 0 },
      };
    };

    setTimer(calculateTimer());

    const interval = setInterval(() => {
      setTimer(calculateTimer());
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, mintingType]);

  const { phase, timeRemaining } = timer;
  // useEffect(() => {
  //   const calculateTimer = () => {
  //     const now = new Date();
  //     const createdDate = new Date(createdAt);

  //     // alert('createdDate ' + createdDate)

  //     const msSinceCreated = now - createdDate;
  //     const msIn24h = 24 * 60 * 60 * 1000;
  //     const msIn12h = 12 * 60 * 60 * 1000;

  //     const timeInCurrentCycle = msSinceCreated % msIn24h;
  //     const isFirstHalf = timeInCurrentCycle < msIn12h;

  //     const timePassedInCurrentHalf = timeInCurrentCycle % msIn12h;
  //     const timeRemaining = msIn12h - timePassedInCurrentHalf;

  //     const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  //     const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  //     const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  //     return {
  //       phase: isFirstHalf ? 1 : 2,
  //       timeRemaining: { hours, minutes, seconds },
  //     };
  //   };

  //   setTimer(calculateTimer());

  //   const interval = setInterval(() => {
  //     setTimer(calculateTimer());
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [createdAt]);

  // const { phase, timeRemaining } = timer;

  // console.log('general phase', phase)

  const format = (num) => num?.toString().padStart(2, "0");

  // Bulk Minting Click Handler
  const handleBulkMintClick = async () => {
    try {
      setSelfMintingBtnStatus(true);
      setAutoMintingBtnStatus(true);
      setShowMintingSuccess(false);
      setShowMintingAnimation(true);
      setBulkClickingLoading(true);

      //  Wait 100ms to allow UI to show animation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      postRequest(
        "/recordClick",
        { mintingType },
        (response) => {
          setShowMintingAnimation(false);

          if (response.data.success) {
            setShowMintingSuccess(true);
            getUserMintings();
          } else {
            notify(response.data.message || "Something went wrong!", "error");
          }

          setBulkClickingLoading(false);
        },
        (error) => {
          setShowMintingAnimation(false);
          notify("Something went wrong!", "error");
          setBulkClickingLoading(false);
        }
      );
    } catch (error) {
      console.error("Error in handleBulkMintClick:", error);
      notify("Something went wrong!", "error");
      setBulkClickingLoading(false);
    } finally {
      setShowMintingAnimation(false);
      setSuppressMainLoading(false);
    }
  };

  const getUserMintings = async () => {
    try {
      setLoading(true);
      setError(null);

      await postRequest(
        "/getMintingActivities",
        {
          type: mintingType,
        },
        (response) => {
          console.log(response);
          if (
            response.data &&
            response.data.success &&
            response.data.data &&
            response.data.data.length > 0
          ) {
            setMintingInsights(response.data.mintingInsights || []);
            setSelfMintingBtnStatus(response.data.manualClickStatus);
            setAutoMintingBtnStatus(response.data.autoClickStatus);
            const activities = response.data.data.map((mintingActivity) => {
              if (response.data.data.length > 0) {
                const lastActivity =
                  response.data.data[response.data.data.length - 1];
                setCreatedAt(lastActivity.startDate);
              }

              const startDate = new Date(mintingActivity.startDate);
              const currentDate = new Date();

              const daysSinceStart =
                Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)) +
                1;

              const totalClicks = mintingActivity.clicksDone || 0;
              const totalProfit = mintingActivity.totalProfitEarned || 0;
              const clickHistory = mintingActivity.clickHistory || [];

              const todayClicks = getTodayClicksCount(clickHistory);
              const nextClickTime = calculateNextClickTime(
                clickHistory,
                mintingType
              );
              const isEligible = canClick(clickHistory, mintingType);

              // Find corresponding minting insight for this activity
              const currentTypeInsights = response.data.mintingInsights?.find(
                (insight) =>
                  insight.type === (mintingType === "MANUAL" ? "SELF" : "AUTO")
              );

              const activityInsight = currentTypeInsights?.activities?.find(
                (activity) => activity._id === mintingActivity._id
              );

              // Calculate progress based on minting insights
              const maxCap = activityInsight?.maxCap; // Default fallback
              const remainingCap = activityInsight?.remainingCap || maxCap;
              const earnedAmount = maxCap - remainingCap;
              const progressPercentage = (earnedAmount / maxCap) * response?.data?.mintingInsights[0]?.mintingCapPercentage; //activityInsight?.mintingCapPercentage = 250% getting from settings

              const hubPackage = mintingActivity.investmentId?.hubPackage || {};
              const packageAmount = hubPackage.amount || 0;
              const hubCapacity = hubPackage.hubCapacity || 0;

              return {
                _id: mintingActivity._id,
                mintingType: mintingType,
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
                // Add minting insights data
                maxCap: maxCap,
                remainingCap: remainingCap,
                earnedAmount: earnedAmount,
                progressPercentage: progressPercentage,
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

  // Load data when minting type changes
  useEffect(() => {
    getUserMintings();
  }, [mintingType]);

  // Format time countdown
  const formatCountdown = useCallback(
    (targetTime) => {
      if (!targetTime) return "00:00:00";

      const distance = targetTime.getTime() - currentTime;

      if (distance < 0) return "00:00:00";

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (mintingType === "AUTO" && days > 0) {
        return `${days}d ${hours?.toString().padStart(2, "0")}:${minutes?.toString().padStart(2, "0")}:${seconds?.toString().padStart(2, "0")}`;
      }
      return `${hours?.toString().padStart(2, "0")}:${minutes?.toString().padStart(2, "0")}:${seconds?.toString().padStart(2, "0")}`;
    },
    [currentTime, mintingType]
  );

  // Get countdown message
  const getCountdownMessage = (activity) => {
    if (!activity.nextClickTime) return "Ready to mint!";

    if (mintingType === "MANUAL") {
      const todayClicks = activity.dailyClicks;
      if (todayClicks === 1) {
        return "Next click available in:";
      } else if (todayClicks === 2) {
        return "Next click available tomorrow:";
      }
      return "Next click available in:";
    } else {
      return "Next auto minting available in:";
    }
  };

  // Get eligible activities count
  const getEligibleActivitiesCount = () => {
    return 1;
    // return mintingActivities.filter(
    //   (activity) =>
    //     activity.isEligible && activity.investmentId && activity.isActive
    // ).length;
  };

  // // Get global countdown message
  // const getGlobalCountdownMessage = () => {
  //   const globalTimer = getGlobalTimer();
  //   if (!globalTimer) return "Ready to mint!";

  //   if (mintingType === "MANUAL") {
  //     const earliestInvestment = getEarliestInvestment();
  //     if (earliestInvestment) {
  //       const todayClicks = getTodayClicksCount(
  //         earliestInvestment.clickHistory || []
  //       );
  //       if (todayClicks === 1) {
  //         return "Next minting available in:";
  //       } else if (todayClicks === 2) {
  //         return "Next minting available tomorrow:";
  //       }
  //     }
  //     return "Next minting available in:";
  //   } else {
  //     return "Next auto minting available in:";
  //   }
  // };

  // Check if global timer is ready
  const isGlobalTimerReady = () => {
    const globalTimer = getGlobalTimer();
    return !globalTimer || currentTime >= globalTimer.getTime();
  };

  // Main timer effect
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
        const newIsEligible = canClick(activity.clickHistory, mintingType);
        const newNextClickTime = calculateNextClickTime(
          activity.clickHistory,
          mintingType
        );
        const newDailyClicks = getTodayClicksCount(activity.clickHistory);

        if (!activity.isEligible && newIsEligible) {
          toast.info(
            `${mintingType === "MANUAL" ? "Self" : "Auto"} minting is now available for ${formatAmount(activity.investedAmount)} investment!`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }

        return {
          ...activity,
          isEligible: newIsEligible,
          nextClickTime: newNextClickTime,
          dailyClicks: newDailyClicks,
        };
      })
    );
  }, [currentTime, mintingType]);

  const handleMintingTypeChange = (event, newType) => {
    if (newType !== null) {
      setMintingType(newType);
    }
  };
  const tooltipText =
    mintingType === "MANUAL"
      ? "Self: Click twice daily with 12 hours gap to earn profit"
      : "Auto: Click once a month to earn profit";

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t("mintingPage.mintingCard.loading")}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <ToastContainer />

      {showMintingAnimation && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <div className="coin-minting"></div>
          <div className="coin-minting"></div>
          <p style={{ color: "#5c4724", marginTop: "14px" }}>
            {t("mintingPage.mintingAnimation.started")}
          </p>
        </div>
      )}

      {showMintingSuccess && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <div className="coin-minting success"></div>
          <p style={{ color: "#4caf50", marginTop: "14px" }}>
            {t("mintingPage.mintingAnimation.success")}
          </p>
        </div>
      )}

      {showMintingError && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <div className="coin-minting error"></div>
          <p style={{ color: "#e53935", marginTop: "14px" }}>
            {t("mintingPage.mintingAnimation.error")}
          </p>
        </div>
      )}

      {/* <div style={{ fontSize: "28px", padding: "20px", border: "2px solid #007bff", borderRadius: "10px", width: "300px", textAlign: "center" }}>
        <div style={{ marginBottom: "10px", fontWeight: "bold" }}>{phase}</div>
        <div style={{ fontFamily: "monospace" }}>
          {format(timeRemaining.hours)}:{format(timeRemaining.minutes)}:{format(timeRemaining.seconds)}
        </div>
      </div> */}

      <Div sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <div className="p-2 bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637] rounded-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <Typography
            variant="h3"
            sx={{
              background: "linear-gradient(to right, #374151, #4B5563)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("mintingPage.pageTitle")}
          </Typography>
        </Box>
        <p className="text-gray-600 text-sm">{t("mintingPage.pageSubtitle")}</p>
      </Div>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {/* Toggle Switch */}
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 4 }}>
            <ToggleButtonGroup
              value={mintingType}
              exclusive
              onChange={handleMintingTypeChange}
              aria-label="minting type"
              size="small"
              sx={{ mb: 3 }}
            >
              <ToggleButton
                sx={{ mr: 2 }}
                value="MANUAL"
                aria-label="self minting"
              >
                <TouchApp sx={{ mr: 1 }} />
                {t("mintingPage.toggleSwitch.manualMinting")}
              </ToggleButton>
              <ToggleButton value="AUTO" aria-label="auto minting">
                <AutoFixHigh sx={{ mr: 1 }} />
                {t("mintingPage.toggleSwitch.autoMinting")}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Global Timer and Bulk Minting Button */}
          {mintingActivities.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                mb: 4,
              }}
            >
              {/* Global Timer */}
              {getGlobalTimer() && !isGlobalTimerReady() && (
                <Box sx={{ mb: 2, textAlign: "center" }}>
                  {/* <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    {getGlobalCountdownMessage()}
                  </Typography> */}
                  <Typography
                    variant="h4"
                    color="warning.main"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: -2,
                    }}
                  >
                    <AccessTime sx={{ mr: 1, fontSize: "1.2rem" }} />

                    {mintingType === "MANUAL" ? (
                      <>
                        {format(timeRemaining.hours)}:
                        {format(timeRemaining.minutes)}:
                        {format(timeRemaining.seconds)}
                      </>
                    ) : (
                      <>
                        {format(timeRemaining.days)}:
                        {format(timeRemaining.hours)}:
                        {format(timeRemaining.minutes)}:
                        {format(timeRemaining.seconds)}
                      </>
                    )}
                  </Typography>
                </Box>
              )}

              {/* Ready message when timer is done */}
              {/* {isGlobalTimerReady() && (
                <Box sx={{ mb: 2, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="success.main"
                    sx={{ fontWeight: 600 }}
                  >
                    🎉 Ready to mint!
                  </Typography>
                </Box>
              )} */}

              {/* Bulk Minting Button */}

              <Tooltip
                title={t(
                  mintingType === "MANUAL"
                    ? "mintingPage.bulkMintingButton.tooltipManual"
                    : "mintingPage.bulkMintingButton.tooltipAuto"
                )}
                arrow
                placement="top"
              >
                <span>
                  {" "}
                  {/* Tooltip only works on hoverable elements, span wraps disabled button */}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleBulkMintClick}
                    disabled={
                      bulkClickingLoading || mintingType === "MANUAL"
                        ? selfMintingBtnStatus
                        : autoMintingBtnStatus
                    }
                    startIcon={
                      bulkClickingLoading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : mintingType === "MANUAL" ? (
                        <TouchApp />
                      ) : (
                        <AutoFixHigh />
                      )
                    }
                    sx={{
                      mb: 5,
                      boxShadow: "none",
                      px: 2,
                      py: 1,
                      fontSize: "0.75rem",
                      color: "white",
                      background: "linear-gradient(to right, #AC9B6D, #6A5637)",
                      "&:hover": {
                        background:
                          "linear-gradient(to right, #BFA670, #7A5F3A)",
                      },
                      "&:disabled": {
                        background:
                          "linear-gradient(to right, #e5e7eb, #d1d5db)",
                        color: "#6b7280",
                        opacity: 1,
                      },
                    }}
                  >
                    {bulkClickingLoading
                      ? t("mintingPage.bulkMintingButton.processing")
                      : t("mintingPage.clickHere")}
                  </Button>
                </span>
              </Tooltip>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4, mt: -7 }}>
        {/* Total Activities */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: "1px solid",
              borderColor: "#f3f4f6",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                  {t("mintingPage.statsCards.totalEarnedProfit")}
                </Typography>
                <Typography variant="h4" sx={{ color: "#1f2937" }}>
                  {formatAmount(
                    mintingActivities.reduce(
                      (sum, activity) => sum + (activity.totalProfit || 0),
                      0
                    )
                  )}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: "#dbeafe", borderRadius: 2 }}>
                <Package className="w-6 h-6 text-blue-600" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Total Invested */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: "1px solid",
              borderColor: "#f3f4f6",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                  {t("mintingPage.statsCards.totalInvested")}
                </Typography>
                <Typography variant="h4" sx={{ color: "#1f2937" }}>
                  {formatAmount(
                    mintingActivities.reduce(
                      (sum, activity) => sum + (activity.investedAmount || 0),
                      0
                    )
                  )}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: "#d1fae5", borderRadius: 2 }}>
                <DollarSign className="w-6 h-6 text-green-600" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Active Minting */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: "1px solid",
              borderColor: "#f3f4f6",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                  {t("mintingPage.statsCards.activeMinting")}
                </Typography>
                <Typography variant="h4" sx={{ color: "#1f2937" }}>
                  {
                    mintingActivities.filter((activity) => activity.isActive)
                      .length
                  }
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: "#ede9fe", borderRadius: 2 }}>
                <Activity className="w-6 h-6 text-purple-600" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Total Clicks */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: "1px solid",
              borderColor: "#f3f4f6",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                  {t("mintingPage.mintingCard.totalClicks")}
                </Typography>
                <Typography variant="h4" sx={{ color: "#1f2937" }}>
                  {mintingActivities.reduce(
                    (sum, activity) => sum + (activity.clicksDone || 0),
                    0
                  )}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: "#ffedd5", borderRadius: 2 }}>
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* No activities message */}
      {mintingActivities.length === 0 && (
        <>
          <Alert severity="info" sx={{ mb: 4 }}>
            {t(
              mintingType === "MANUAL"
                ? "mintingPage.noActivities.messageManual"
                : "mintingPage.noActivities.messageAuto"
            )}
          </Alert>

          <Box sx={{ textAlign: "center" }}>
            <Button
              component={Link}
              to="/myPackages"
              variant="contained"
              size="small"
              sx={{
                color: "white",
                background: "linear-gradient(to right, #AC9B6D, #6A5637)",
                "&:hover": {
                  background: "linear-gradient(to right, #BFA670, #7A5F3A)",
                },
                "&:disabled": {
                  background: "linear-gradient(to right, #e5e7eb, #d1d5db)",
                  color: "#6b7280",
                  opacity: 1,
                },
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              {t("mintingPage.noActivities.startButton")}
            </Button>
          </Box>
        </>
      )}

      {/* Multiple Minting Cards */}
      <Grid container spacing={3}>
        {mintingActivities.map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity._id}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid #f3f4f6",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  mb={2}
                  justifyContent="center"
                >
                  {mintingType === "MANUAL" ? (
                    <TouchApp color="primary" sx={{ mr: 1, fontSize: 25 }} />
                  ) : (
                    <AutoFixHigh color="primary" sx={{ mr: 1, fontSize: 25 }} />
                  )}
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 600 }}
                  >
                    {t("mintingPage.mintingCard.investedAmount")}{" "}
                    {formatAmount(activity.investedAmount)}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 3 }}
                >
                  {mintingType === "MANUAL"
                    ? `${t("mintingPage.mintingCard.manualDescription")}`
                    : `${t("mintingPage.mintingCard.autoDescription")}`}
                </Typography>

                <Paper
                  elevation={1}
                  sx={{ p: 2, mb: 3, bgcolor: "#f9fafb", borderRadius: 2 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        {t("mintingPage.mintingCard.totalProfitEarned")}
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        {formatAmount(activity.totalProfit)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        {t("mintingPage.mintingCard.totalClicks")}
                      </Typography>
                      <Typography variant="h6">
                        {activity.clicksDone || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        {t("mintingPage.mintingCard.hubCapacity")}
                      </Typography>
                      <Typography variant="body1">
                        {activity.hubCapacity}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        {t("mintingPage.mintingCard.daysActive")}
                      </Typography>
                      <Typography variant="body1">
                        {activity.currentDay}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {t("mintingPage.mintingCard.earningProgress")} (
                        {formatAmount(activity.earnedAmount)} /{" "}
                        {formatAmount(activity.maxCap)})
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={activity.progressPercentage}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mt={0.5}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {activity.progressPercentage.toFixed(1)}
                          {t("mintingPage.mintingCard.completePercentage")}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t("mintingPage.mintingCard.remaining")}:{" "}
                          {formatAmount(activity.remainingCap)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                <Box display="flex" justifyContent="center" mb={2}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleToggleClick(activity)}
                    sx={{
                      color: "white",
                      background: "linear-gradient(to right, #AC9B6D, #6A5637)",
                      "&:hover": {
                        background:
                          "linear-gradient(to right, #BFA670, #7A5F3A)",
                      },
                      "&:disabled": {
                        background:
                          "linear-gradient(to right, #e5e7eb, #d1d5db)",
                        color: "#6b7280",
                        opacity: 1, // Keep it fully visible
                      },
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                  >
                    {t("mintingPage.mintingCard.swapButton")}
                  </Button>
                </Box>

                {/* Timer or Ready Message */}
                {/* {activity.nextClickTime && !activity.isEligible && (
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
                )} */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={showToggleModal}
        onClose={() => setShowToggleModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t("mintingPage.toggleModal.title")}F
          </Typography>
        </DialogTitle>

        <DialogContent>
          {selectedActivity && (
            <Box>
              {/* Activity Details */}
              <Paper
                elevation={1}
                sx={{ p: 3, mb: 3, bgcolor: "#f9fafb", borderRadius: 2 }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {t("mintingPage.toggleModal.activityDetails")}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t("mintingPage.toggleModal.investedAmount")}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatAmount(selectedActivity.investedAmount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t("mintingPage.toggleModal.currentType")}
                    </Typography>
                    <Typography variant="h6">
                      {mintingType === "MANUAL"
                        ? t("mintingPage.toggleSwitch.manualMinting")
                        : t("mintingPage.toggleSwitch.autoMinting")}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t("mintingPage.toggleModal.totalProfit")}
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {formatAmount(selectedActivity.totalProfit)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      {t("mintingPage.toggleModal.hubCapacity")}
                    </Typography>
                    <Typography variant="h6">
                      {selectedActivity.hubCapacity}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Warning Message */}
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  {t("mintingPage.toggleModal.warningTitle")}
                </Typography>
                <Typography variant="body2">
                  {t("mintingPage.toggleModal.warningMessage")}
                </Typography>
              </Alert>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {t("mintingPage.toggleModal.confirmationText")}
                <strong>
                  {" "}
                  {mintingType === "MANUAL" ? "Self" : "Auto"}
                </strong>{" "}
                to <strong>{mintingType === "MANUAL" ? "Auto" : "Self"}</strong>{" "}
                ?
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setShowToggleModal(false)}
            variant="outlined"
            color="inherit"
          >
            {t("mintingPage.toggleModal.cancelButton")}
          </Button>
          <Button
            onClick={() =>
              selectedActivity && toggleMintingType(selectedActivity._id)
            }
            variant="contained"
            sx={{
              color: "white",
              background: "linear-gradient(to right, #AC9B6D, #6A5637)",
              "&:hover": {
                background: "linear-gradient(to right, #BFA670, #7A5F3A)",
              },
              "&:disabled": {
                background: "linear-gradient(to right, #e5e7eb, #d1d5db)",
                color: "#6b7280",
                opacity: 1, // Keep it fully visible
              },
            }}
          >
            {t("mintingPage.toggleModal.confirmButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MintingPage;
