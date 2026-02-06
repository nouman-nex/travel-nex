import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import {
  TrendingUp,
  Coins,
  Users,
  Gem,
  Wallet,
  Activity,
  Package,
  Flame,
} from "lucide-react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ReactQRCode from "react-qr-code";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { NewConnections } from "@app/_components/widgets/NewConnections";
import { PortfolioBalance } from "@app/_components/widgets/PortfolioBalance";
import { RecentTickets } from "@app/_components/widgets/RecentTickets";
import { PageViews } from "@app/_components/metrics/PageViews";
import { Orders } from "@app/_components/metrics/Orders";
import { Stocks } from "@app/_components/metrics/Stocks";
import { Rank } from "./components/RankCard";
import TopPerformers from "./components/TopPerformers";
import UserCard from "./components/RankUser";
import MessageCard from "./components/MessageCard";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import { postRequest } from "../../../backendServices/ApiCalls";
import moment from "moment";
import { UserSummary } from "@app/_components/widgets/UserSummary";
import RegistrationStats from "./components/RegistrationStats";
import { Margin } from "@mui/icons-material";

// Optimized Stats Card Component with loading state
const StatsCard = React.memo(
  ({ title, value, icon: Icon, loading = false }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            {loading ? (
              <>
                <Skeleton variant="text" width={80} height={32} />
                <Skeleton variant="text" width={120} height={20} />
              </>
            ) : (
              <>
                <Typography variant="h4">{value}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {title}
                </Typography>
              </>
            )}
          </Box>
          <div className="p-3 bg-blue-100 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </Box>
      </CardContent>
    </Card>
  )
);

// Optimized Collection Card Component
const CollectionCard = React.memo(({ collection, t }) => {
  const formattedDate = useMemo(
    () => moment(collection.purchaseDate).format("DD MMM YYYY, hh:mm A"),
    [collection.purchaseDate]
  );

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <div className="p-2 bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637] rounded-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

          <Box flex={1}>
            <Typography variant="h6" noWrap>
              {t("hubAmount")} ${collection?.hubPackage?.hubPrice} (
              {collection.cryptoUsed})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formattedDate}
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

          <Box flex={1}>
            <Typography variant="h6" noWrap>
              {t("dashboard.wallet.hubCapacity")} : $
              {collection?.hubPackage?.hubCapacity} ({collection.cryptoUsed})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("withdrawPage.infoPanel.minimumAmount")}: $
              {collection?.hubPackage?.minimumMinting}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

const MintingEarningsGraph = React.memo(
  ({ mintingData, isAutoMode, onModeChange, mintingInsights = [], t }) => {
    const COLORS = ["#AC9B6D", "#E5E7EB"];

    const { pieData, totalEarnings, totalRemaining } = useMemo(() => {
      const currentMintingData = mintingInsights.find(
        (insight) => insight.type === (isAutoMode ? "AUTO" : "SELF")
      );

      const totalEarnings = currentMintingData
        ? isAutoMode
          ? currentMintingData.allAutoMintingEarning || 0
          : currentMintingData.allSelfMintingEarning || 0
        : 0;

      const totalRemaining = currentMintingData?.remaining || 0;
      const totalCapacity = totalEarnings + totalRemaining;

      const usedPercentage =
        totalCapacity > 0
          ? ((totalEarnings / totalCapacity) * currentMintingData.mintingCapPercentage).toFixed(1) // currentMintingData.mintingCapPercentage = 250% getting from settings
          : 0;

      const pieData = [
        {
          name: "Earned",
          value: parseFloat(usedPercentage),
          amount: totalEarnings,
        },
        {
          name: "Remaining",
          value: parseFloat((100 - usedPercentage).toFixed(1)),
          amount: totalRemaining,
        },
      ];

      return {
        pieData,
        totalEarnings,
        totalRemaining,
      };
    }, [mintingData, isAutoMode, mintingInsights]);

    return (
      <Card sx={{ mb: 3, minHeight: 300, mt: -2 }}>
        <CardContent>
          {/* Switch Buttons */}
          <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
            <Button
              variant={!isAutoMode ? "contained" : "outlined"}
              onClick={() => onModeChange(false)}
              sx={{
                backgroundColor: !isAutoMode ? "#AC9B6D" : "transparent",
                borderColor: "#AC9B6D",
                color: !isAutoMode ? "white" : "#AC9B6D",
                "&:hover": {
                  backgroundColor: !isAutoMode
                    ? "#9A8A5F"
                    : "rgba(172, 155, 109, 0.1)",
                },
              }}
            >
              {t("packagesPage.selfMinting")}
            </Button>
            <Button
              variant={isAutoMode ? "contained" : "outlined"}
              onClick={() => onModeChange(true)}
              sx={{
                backgroundColor: isAutoMode ? "#AC9B6D" : "transparent",
                borderColor: "#AC9B6D",
                color: isAutoMode ? "white" : "#AC9B6D",
                "&:hover": {
                  backgroundColor: isAutoMode
                    ? "#9A8A5F"
                    : "rgba(172, 155, 109, 0.1)",
                },
              }}
            >
              {t("packagesPage.autoMinting")}
            </Button>
          </Box>

          {/* Pie & Progress Side-by-Side */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
          >
            {/* Pie Chart */}
            <Box flex={1}>
              <Typography variant="h6" mb={1}>
                {t("dashboard.minting.overAllProgress")}
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={75}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, entry) => [
                      `${value}% ($${entry.payload.amount.toFixed(2)})`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Progress */}
            <Box
              flex={1}
              sx={{
                bgcolor: "#f8f9fa",
                p: 2,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    {t("dashboard.minting.profitEarned")}
                  </Typography>
                  <Typography variant="h6" color="#AC9B6D">
                    ${totalEarnings.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    {t("myPackages.hubCard.remaining")}
                  </Typography>
                  <Typography variant="h6" color="#666">
                    ${totalRemaining.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    {t("dashboard.minting.overAllProgress")}: {pieData[0]?.value || 0}%  {t("myPackages.mintingModal.totalCapacity")}
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      height: 8,
                      bgcolor: "#E5E7EB",
                      borderRadius: 1,
                      mt: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: `${pieData[0]?.value || 0}%`,
                        height: "100%",
                        bgcolor: "#AC9B6D",
                        borderRadius: 1,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }
);

// Binary Points Component
const BinaryPointsCards = React.memo(
  ({ leftPoints, rightPoints, loading, t }) => (
    <Grid container spacing={2} mb={3}>
      <Grid item xs={6}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t("dashboard.binaryPoints.leftPoints")}
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={60} height={32} />
              ) : (
                <Typography variant="h6" fontWeight="bold">
                  {leftPoints || 0}
                </Typography>
              )}
            </Box>
            <ArrowBackIcon color="primary" sx={{ fontSize: 32 }} />
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t("dashboard.binaryPoints.rightPoints")}
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={60} height={32} />
              ) : (
                <Typography variant="h6" fontWeight="bold">
                  {rightPoints || 0}
                </Typography>
              )}
            </Box>
            <ArrowForwardIcon color="success" sx={{ fontSize: 32 }} />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
);

// Main Dashboard Component
function Dashboard() {
  const { User, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("left");
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const { t } = useTranslation();

  const Swal = useSwalWrapper();

  // Memoized referral link
  const referralLink = useMemo(
    () => `${window.location.origin}/auth/signup-1?ref=${User?.refferrCode}`,
    [User?.refferrCode]
  );

  // Optimized sweet alerts function
  const sweetAlerts = useCallback(
    (icon, title, text) => {
      Swal.fire({ icon, title, text });
    },
    [Swal]
  );

  // Optimized copy function
  const copyReferralLink = useCallback(
    (text) => {
      if (!text) {
        sweetAlerts("error", "Error", "No referral link to copy.");
        return;
      }

      navigator.clipboard
        .writeText(text)
        .then(() =>
          sweetAlerts(
            "success",
            t("dashboard.success"),
            t("dashboard.success")
          )
        )
        .catch(() => sweetAlerts("error", "Error", "Something went wrong."));
    },
    [sweetAlerts]
  );

  // Memoized modified referral link
  const modifiedReferralLink = useMemo(() => {
    const suffix = selectedOption === "left" ? "_L" : "_R";
    return `${referralLink}${suffix}`;
  }, [referralLink, selectedOption]);

  // Optimized data fetching function
  const getDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      postRequest("/getDashboardAnalytics", {}, (res) => {
        console.log("dashboard ..", res);
        setLoading(false);
        const responseData = res?.data?.data;

        if (res?.data?.success && responseData) {
          setUser(responseData.currentUser);
          console.log(res);
          // Properly map the response data structure
          setDashboardData({
            totalEarning: responseData.totalEarning || {},
            allTimeInvested: responseData.allTimeInvested || 0,
            referredUsers: responseData.referredUsers || 0,
            boughtPackages: responseData.boughtPackages || 0,
            topPerformer: responseData.topPerformer,
            totalApprovedWithdrawals:
              responseData.totalApprovedWithdrawals || 0,
            totalDepositsAmount: responseData.totalDepositsAmount || 0,
            pendingWithdrawalsAmount:
              responseData.pendingWithdrawalsAmount || 0,
            // Fix the binary points mapping
            totalLeftPoints: responseData.totalLeftPoints || 0,
            mintingInsights: responseData.mintingInsights || [],
            totalRightPoints: responseData.totalRightPoints || 0,
            recentMintingClicks: responseData.recentMintingClicks || [],
            depositHistory: responseData.depositHistory || [],
            withdrawHistory: responseData.withdrawHistory || [],
            topPerformers: responseData.topPerformers || [],
            boughtPackagesList: responseData.boughtPackagesList || [],
            rankInfo: responseData.rankInfo || {},
            highestRankReferredUser: responseData.highestRankReferredUser || {},
            summary: responseData.summary || {},
            registrationStats: responseData.registrationStats,
          });
        }
      });
    } catch (error) {
      setLoading(false);
      console.error("Dashboard data fetch error:", error);
    }
  }, [setUser]);

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  // useEffect(() => {
  //   if (User && !User.roles?.includes("User")) {
  //     navigate("/adminDashboard");
  //   }
  // }, [User, navigate]);

  // Memoized stats data
  const statsData = useMemo(
    () => [
      {
        title: t("dashboard.stats.lifeTimeEarned"),
        value: `$${dashboardData?.totalEarning?.grandTotal || 0}`,
        icon: Gem,
      },
      {
        title: t("dashboard.stats.investedInMinting"),
        value: `$${dashboardData.allTimeInvested || 0}`,
        icon: Coins,
      },
      {
        title: t("dashboard.stats.referredUsers"),
        value: dashboardData.referredUsers || 0,
        icon: Users,
      },
      {
        title: t("dashboard.stats.boughtPackages"),
        value: dashboardData.boughtPackages || 0,
        icon: TrendingUp,
      },
    ],
    [dashboardData, t]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box mb={4}>
          <div className="flex items-center gap-3 mb-2">
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
              {t("dashboard.title")}
            </Typography>
          </div>
          <Typography variant="body1" color="text.secondary">
            {t("dashboard.subtitle")}
          </Typography>
        </Box>

        {/* Message Card */}
        <Box mb={3}>
          <MessageCard />
        </Box>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} mb={4}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              loading={false}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          {/* Portfolio Balance and Rank */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={8}>
              <PortfolioBalance
                title={t("dashboard.portfolio.walletBalance")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Rank title={dashboardData?.rankInfo?.rank} />
            </Grid>
          </Grid>

          <MintingEarningsGraph
            t={t}
            mintingData={dashboardData.recentMintingClicks}
            isAutoMode={isAutoMode}
            onModeChange={setIsAutoMode}
            mintingInsights={dashboardData.mintingInsights}
          />

          <RegistrationStats stats={dashboardData.registrationStats} />

          {/* Metrics Row */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={4}>
              <PageViews
                refferals={`$${dashboardData.totalDepositsAmount || 0}`}
                title={t("dashboard.stats.deposit")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Orders
                levelBonus={`$${dashboardData.totalApprovedWithdrawals || 0}`}
                title={t("dashboard.stats.approvedWithdrawals")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Stocks
                payout={dashboardData.pendingWithdrawalsAmount || 0}
                title={t("dashboard.stats.pendingWithdrawals")}
              />
            </Grid>
          </Grid>

          {/* Purchased Hub */}
          <Card sx={{ mb: 3, height: 210 }}>
            <CardContent
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Flame size={30} color="#ff6b35" />
                  <Typography variant="h4">
                    {t("dashboard.purchasedHub.title")}
                  </Typography>
                </Box>
                <Button
                  onClick={() => navigate("/myPackages")}
                  size="small"
                  variant="outlined"
                >
                  {t("dashboard.purchasedHub.viewAll")}
                </Button>
              </Box>
              <Box sx={{ overflowY: "auto", flex: 1 }}>
                {dashboardData?.boughtPackagesList?.length > 0 ? (
                  dashboardData.boughtPackagesList.map((pkg) => (
                    <CollectionCard key={pkg._id} collection={pkg} t={t} />
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mt: 2 }}
                  >
                    {t("dashboard.purchasedHub.noPackages")}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Referral Section */}
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
                  onClick={() => copyReferralLink(modifiedReferralLink)}
                  sx={{
                    background:
                      "linear-gradient(to right, #AC9B6D, #8B7550, #6A5637)",
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
                  {modifiedReferralLink}
                </Typography>
                <ReactQRCode value={modifiedReferralLink} size={100} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          <Box mb={3}>
            <RecentTickets
              mints={dashboardData?.recentMintingClicks}
              title={t("dashboard.minting.recentMints")}
            />
          </Box>

          {/* Binary Points - Fixed */}
          <BinaryPointsCards
            leftPoints={dashboardData.totalLeftPoints}
            rightPoints={dashboardData.totalRightPoints}
            loading={false}
            t={t}
          />
          {/* <UserSummary
            bgColor={"#3BD2A2"}
            title={t("High Rank Achiever")}
            subheader={t("widgets.subheader.userSummary")}
          />
          <UserSummary
            bgColor={"#F39711"}
            title={t("Top Performer")}
            subheader={dashboardData.topPerformer.username}
          /> */}
          <UserCard user={dashboardData.highestRankReferredUser} />
          <TopPerformers topPerformer={dashboardData.topPerformer} />

          <Box mb={3}>
            <NewConnections
              dataType="deposits"
              title={t("dashboard.history.depositHistory")}
              path="/DepositReports"
              scrollHeight={240}
              loading={false}
              connections={dashboardData.depositHistory}
            />
          </Box>

          <Box mb={3}>
            <NewConnections
              title={t("dashboard.history.withdrawalHistory")}
              path="/pendingWithdraws"
              scrollHeight={280}
              loading={false}
              dataType="withdrawals"
              connections={dashboardData.withdrawHistory}
            />
          </Box>
          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h4" mb={3}>
                {t("dashboard.quickActions.title")}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                  <Link to="/packages">
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Gem size={18} />}
                      size="large"
                    >
                      {t("dashboard.quickActions.buyMoreHub")}
                    </Button>
                  </Link>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Link to="/deposit">
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Wallet size={18} />}
                      size="large"
                    >
                      {t("dashboard.quickActions.deposit")}
                    </Button>
                  </Link>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Link to="/minting">
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Activity size={18} />}
                      size="large"
                    >
                      {t("dashboard.quickActions.viewMintings")}
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
