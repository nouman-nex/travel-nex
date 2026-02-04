import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Avatar,
  Paper,
  Divider,
  IconButton,
  Pagination,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Close as CloseIcon,
  ArrowUpward as RankUpIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as MoneyIcon,
  EmojiEvents as RewardIcon,
} from "@mui/icons-material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { TrophyIcon, CoinsIcon } from "lucide-react";
import { postRequest } from "../../../../backendServices/ApiCalls";
import DataTable from "@app/_components/table/table";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export default function RankReport() {
  const [rankHistories, setRankHistories] = useState([]);
  const [filteredRankHistories, setFilteredRankHistories] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const [selectedRankHistory, setSelectedRankHistory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1,
  });

  const { User } = useAuth();
  const navigate = useNavigate();

  const fetchRankHistories = (page = 1, filter = null) => {
    setLoading(true);
    setError(null);

    postRequest(
      "/getCurrentUserRankHistory",
      {},
      (response) => {
        console.log(response);
        if (response.data.success) {
          const rankHistoriesData = response.data.data;
          setRankHistories(rankHistoriesData);

          // Apply client-side filtering if filter is present
          let filteredData = rankHistoriesData;
          if (
            filter &&
            ["approved", "pending", "rejected", "flushed"].includes(filter)
          ) {
            filteredData = rankHistoriesData.filter(
              (rh) => rh.status === filter
            );
          }

          setFilteredRankHistories(filteredData);
          setPagination({
            page: 1,
            limit: 50,
            total: filteredData.length,
            pages: Math.ceil(filteredData.length / 50),
          });
        } else {
          setError("Failed to load rank histories");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching rank histories:", error);
        setError("Error loading rank histories");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    // Only run logic if User is defined (i.e. data has loaded)
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isAdmin = roles.includes("Admin");

      if (isAdmin) {
        navigate("/");
      } else {
        fetchRankHistories();
      }
    }
  }, [User, navigate]);

  // Format currency amount with 2 decimal places
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSearch = (term) => {
    const searchTerm = term.toLowerCase();

    if (!term) {
      setFilteredRankHistories(rankHistories);
      return;
    }

    const filtered = rankHistories.filter((rh) => {
      // Check old rank
      const oldRank = rh.oldRankId?.rank?.toLowerCase() || "";
      const oldRankMatch = oldRank.includes(searchTerm);

      // Check new rank
      const newRank = rh.newRankId?.rank?.toLowerCase() || "";
      const newRankMatch = newRank.includes(searchTerm);

      // Check rank history ID
      const rhIdMatch = rh._id.toLowerCase().includes(searchTerm);

      // Check notes
      const noteMatch =
        rh.rankDetails?.note?.toLowerCase().includes(searchTerm) || false;

      return oldRankMatch || newRankMatch || rhIdMatch || noteMatch;
    });

    setFilteredRankHistories(filtered);
  };

  // Format date to more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get rank color based on rank name
  const getRankColor = (rank) => {
    const rankColors = {
      STARTER: "default",
      IRON: "secondary",
      BRONZE: "warning",
      SILVER: "info",
      GOLD: "success",
      PLATINUM: "primary",
      DIAMOND: "error",
    };
    return rankColors[rank] || "default";
  };

  // Define columns for the DataTable
  const columns = [
    {
      field: "_id",
      label: t("rankReport.historyId"),
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {row._id?.substring(0, 10)}...
        </Typography>
      ),
      exportValue: (row) => row._id,
    },
    {
      field: "rankChange",
      label: t("rankReport.rankChange"),
      renderCell: (row) => (
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 150 }}
        >
          <Chip
            label={row.oldRankId?.rank || "Unknown"}
            size="small"
            color={getRankColor(row.oldRankId?.rank)}
            variant="outlined"
          />
          <RankUpIcon sx={{ fontSize: 16, color: "success.main" }} />
          <Chip
            label={row.newRankId?.rank || "Unknown"}
            size="small"
            color={getRankColor(row.newRankId?.rank)}
          />
        </Box>
      ),
      exportValue: (row) =>
        `${row.oldRankId?.rank || "Unknown"} → ${row.newRankId?.rank || "Unknown"}`,
    },
    {
      field: "reward",
      label: t("rankReport.reward"),
      renderCell: (row) => (
        <Typography fontWeight="bold" color="primary.main">
          ${formatAmount(row.reward)}
        </Typography>
      ),
      exportValue: (row) => row.reward,
    },
    {
      field: "status",
      label: t("rankReport.status"),
      renderCell: (row) => (
        <Chip
          label={row.status}
          color={
            row.status === "approved"
              ? "success"
              : row.status === "rejected"
                ? "error"
                : row.status === "flushed"
                  ? "warning"
                  : "info"
          }
          size="small"
        />
      ),
    },
    {
      field: "date",
      label: t("rankReport.date"),
      renderCell: (row) => formatDate(row.date || row.createdAt),
      exportValue: (row) => row.date || row.createdAt,
    },
    {
      field: "details",
      label: t("rankReport.details"),
      renderCell: (row) => {
        return <Button size="small">{t("rankReport.showDetails")}</Button>;
      },
    },
  ];

 const filterOptions = [
    { value: "approved", label: `${t("rankReport.approved")}` },
    { value: "pending", label:`${t("rankReport.pending")}` },
    { value: "rejected", label: `${t("rankReport.rejected")}` },
    { value: "flushed", label: `${t("rankReport.flushed")}` },
  ];
  
  // Handle filter change
  const handleFilterChange = (value) => {
    setActiveFilter(value);

    if (value) {
      // Apply filter to existing rank histories
      const filtered = rankHistories.filter((rh) => rh.status === value);
      setFilteredRankHistories(filtered);
    } else {
      // Show all rank histories
      setFilteredRankHistories(rankHistories);
    }
  };

  const clearFilters = () => {
    setActiveFilter(null);
    setFilteredRankHistories(rankHistories);
  };

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleRankHistoryClick = (rankHistory) => {
    setSelectedRankHistory(rankHistory);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRankHistory(null);
  };

  const actionButtons = (
    <>
      {activeFilter && (
        <Button
          variant="text"
          onClick={clearFilters}
          size="small"
          sx={{ mr: 1 }}
        >
          {t("rankReport.clearFilters")}
        </Button>
      )}
      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={() => fetchRankHistories(pagination.page, activeFilter)}
        size="small"
      >
        {t("rankReport.refresh")}
      </Button>
    </>
  );

  // Rank history details modal
  const renderRankHistoryModal = () => {
    if (!selectedRankHistory) return null;

    return (
      <Dialog
        open={modalOpen}
        PaperProps={{
          sx: {
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(139, 69, 19, 0.15)",
            border: "1px solid rgba(218, 165, 32, 0.2)",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(255, 248, 220, 0.7), rgba(245, 222, 179, 0.3))",
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(5px)",
          },
        }}
        onClose={closeModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">{t("rankReport.modalTitle")}</Typography>
          <IconButton onClick={closeModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <Paper
                sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("rankReport.historyId")}
                    </Typography>
                    <Typography variant="body1" fontFamily="monospace">
                      {selectedRankHistory._id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("rankReport.date")}
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(
                        selectedRankHistory.date ||
                          selectedRankHistory.createdAt
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("rankReport.rewardAmount")}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="primary.main"
                    >
                      ${formatAmount(selectedRankHistory.reward)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("rankReport.status")}
                    </Typography>
                    <Chip
                      label={selectedRankHistory.status}
                      color={
                        selectedRankHistory.status === "approved"
                          ? "success"
                          : selectedRankHistory.status === "rejected"
                            ? "error"
                            : selectedRankHistory.status === "flushed"
                              ? "warning"
                              : "info"
                      }
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Rank Change */}
            <Grid item xs={12}>
              <Paper
                sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t("rankReport.rankProgression")}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {t("rankReport.previousRank")}
                    </Typography>
                    <Chip
                      label={selectedRankHistory.oldRankId?.rank || "Unknown"}
                      color={getRankColor(selectedRankHistory.oldRankId?.rank)}
                      variant="outlined"
                      size="medium"
                    />
                  </Box>

                  <RankUpIcon sx={{ fontSize: 32, color: "success.main" }} />

                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {t("rankReport.newRank")}
                    </Typography>
                    <Chip
                      label={selectedRankHistory.newRankId?.rank || "Unknown"}
                      color={getRankColor(selectedRankHistory.newRankId?.rank)}
                      size="medium"
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Additional Details */}
            <Grid item xs={12}>
              <Paper
                sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t("rankReport.additionalDetails")}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {selectedRankHistory.rankDetails?.note && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t("rankReport.note")}
                      </Typography>
                      <Typography variant="body1">
                        {selectedRankHistory.rankDetails.note}
                      </Typography>
                    </Grid>
                  )}

                  {selectedRankHistory.extra && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {t("rankReport.extraInformation")}
                      </Typography>
                      <Typography variant="body1">
                        {selectedRankHistory.extra}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}> {t("rankReport.close")}</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const getRankHistorySummary = (rankHistories) => {
    const summary = {
      totalHistories: rankHistories.length,
      totalRewards: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      flushed: 0,
      latestRank: null,
      lastRankChangeDate: null,
    };

    rankHistories.forEach((rh) => {
      summary.totalRewards += rh.reward || 0;

      if (rh.status === "approved") summary.approved++;
      else if (rh.status === "pending") summary.pending++;
      else if (rh.status === "rejected") summary.rejected++;
      else if (rh.status === "flushed") summary.flushed++;
    });

    // Find latest rank and last change date
    if (rankHistories.length > 0) {
      const sortedByDate = [...rankHistories].sort(
        (a, b) =>
          new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
      );

      summary.latestRank = sortedByDate[0].newRankId?.rank || "Unknown";
      summary.lastRankChangeDate =
        sortedByDate[0].date || sortedByDate[0].createdAt;
    }

    return summary;
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "primary" }} />
      </div>
    );
  }

  const summary = getRankHistorySummary(filteredRankHistories);

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {error ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => fetchRankHistories(1)}
          >
            Try Again
          </Button>
        </Box>
      ) : (
        <>
          <div className="mb-8 border-b-2 border-gray-300 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637] rounded-lg">
                <TrendingUpIcon className="w-6 h-6 text-white" />
              </div>
              <Typography
                variant="h3"
                sx={{
                  background: "linear-gradient(to right, #374151, #4B5563)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("rankReport.title")}
              </Typography>
            </div>
            <p className="text-gray-600 text-sm">
              {t("rankReport.description")}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Histories */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {t("rankReport.totalPromotions")}
                  </p>
                  <p className="text-2xl text-gray-800">
                    {summary.totalHistories}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrophyIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Total Rewards */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {t("rankReport.totalRewards")}
                  </p>
                  <p className="text-2xl text-gray-800">
                    ${summary.totalRewards.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <RewardIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Current Rank */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {t("rankReport.currentRank")}
                  </p>
                  <div className="mt-1">
                    <Chip
                      label={summary.latestRank || "No Rank"}
                      color={getRankColor(summary.latestRank)}
                      size="medium"
                    />
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUpIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Last Change Date */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{t("rankReport.lastRankChange")}</p>
                <CoinsIcon className="w-6 h-6 text-orange-500" />
              </div>
              <div className="mt-1 text-sm text-gray-700">
                <span className="font-medium">
                  {summary.lastRankChangeDate
                    ? dayjs(summary.lastRankChangeDate).format(
                        "MMM D, YYYY h:mm A"
                      )
                    : "No changes yet"}
                </span>
              </div>
            </div>
          </div>

          <DataTable
            title={t("rankReport.title")}
            data={filteredRankHistories}
            columns={columns}
            loading={loading}
            searchPlaceholder={t("rankReport.searchPlaceholder")}
            emptyMessage={t("rankReport.emptyMessage")}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            activeFilter={activeFilter}
            filterLabel={t("rankReport.filterByStatus")}
            actionButtons={actionButtons}
            onRowClick={handleRankHistoryClick}
            onSearch={handleSearch}
          />

          {/* Pagination */}
          {filteredRankHistories.length > 0 && pagination.pages > 1 && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={pagination.pages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}

          {/* Rank History Details Modal */}
          {renderRankHistoryModal()}
        </>
      )}
    </Box>
  );
}
