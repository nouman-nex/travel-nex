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
  AdminPanelSettings as AdminIcon,
  EmojiEvents as RewardIcon,
} from "@mui/icons-material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { TrophyIcon } from "lucide-react";
import { postRequest } from "../../../../backendServices/ApiCalls";
import DataTable from "@app/_components/table/table";

export default function RankHistory() {
  const [rankHistories, setRankHistories] = useState([]);
  const [filteredRankHistories, setFilteredRankHistories] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRankHistory, setSelectedRankHistory] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
      "/getAdminRankHistory",
      {},
      (response) => {
        console.log(response);
        if (response.data.success) {
          const rankHistoriesData = response.data.data;
          setRankHistories(rankHistoriesData);

          let filteredData = rankHistoriesData;
          if (filter && ["approved", "pending", "rejected", "flushed"].includes(filter)) {
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
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isAdmin = roles.includes("Admin");
      const isMiniAdmin = roles.includes("MiniAdmin");
      const allowedRoutes = Array.isArray(User.allowedRoutes)
        ? User.allowedRoutes
        : [];
      const currentPath = window.location.pathname;

      if (isAdmin) {
        setAuthChecked(true);
        return;
      } else if (isMiniAdmin) {
        if (!allowedRoutes.includes(currentPath)) {
          if (allowedRoutes.length > 0) {
            navigate(allowedRoutes[0]);
          } else {
            navigate("/");
          }
        } else {
          setAuthChecked(true);
        }
      } else {
        navigate("/");
      }
    }
  }, [User, navigate]);

  // Data fetching useEffect - runs only after auth is checked
  useEffect(() => {
    if (authChecked) {
      fetchRankHistories();
    }
  }, [authChecked]);

  // Format currency amount with 2 decimal places
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());

    if (!term) {
      setFilteredRankHistories(rankHistories);
      return;
    }

    const filtered = rankHistories.filter((rh) => {
      // Check username
      const username = rh.userId?.username?.toLowerCase() || "";
      const usernameMatch = username.includes(term);

      // Check email
      const email = rh.userId?.email?.toLowerCase() || "";
      const emailMatch = email.includes(term);

      // Check old rank
      const oldRank = rh.oldRankId?.rank?.toLowerCase() || "";
      const oldRankMatch = oldRank.includes(term);

      // Check new rank
      const newRank = rh.newRankId?.rank?.toLowerCase() || "";
      const newRankMatch = newRank.includes(term);

      // Check rank history ID
      const rhIdMatch = rh._id.toLowerCase().includes(term);

      return usernameMatch || emailMatch || oldRankMatch || newRankMatch || rhIdMatch;
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
      label: "History ID",
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {row._id?.substring(0, 10)}...
        </Typography>
      ),
      exportValue: (row) => row._id,
    },
    {
      field: "user",
      label: "User",
      renderCell: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{ width: 24, height: 24 }}
            src={row.userId?.profileImage || ""}
          >
            {row.userId?.username?.charAt(0) || "U"}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {row.userId?.username || "Unknown User"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.userId?.email || ""}
            </Typography>
          </Box>
        </Box>
      ),
      exportValue: (row) => row.userId?.username || "Unknown User",
    },
    {
      field: "rankChange",
      label: "Rank Change",
      renderCell: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 150 }}>
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
      label: "Reward",
      renderCell: (row) => (
        <Typography fontWeight="bold" color="primary.main">
          ${formatAmount(row.reward)}
        </Typography>
      ),
      exportValue: (row) => row.reward,
    },
    {
      field: "status",
      label: "Status",
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
      label: "Date",
      renderCell: (row) => formatDate(row.date || row.createdAt),
      exportValue: (row) => row.date || row.createdAt,
    },
  ];

  // Filter options for status
  const filterOptions = [
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
    { value: "flushed", label: "Flushed" },
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
          Clear Filters
        </Button>
      )}
      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={() => fetchRankHistories(pagination.page, activeFilter)}
        size="small"
      >
        Refresh
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
          <Typography variant="h6">Rank History Details</Typography>
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
                      History ID
                    </Typography>
                    <Typography variant="body1" fontFamily="monospace">
                      {selectedRankHistory._id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(
                        selectedRankHistory.date || selectedRankHistory.createdAt
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Reward Amount
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
                      Status
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

            {/* User Information */}
            <Grid item xs={12}>
              <Paper
                sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  User Information
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar
                    src={selectedRankHistory.userId?.profileImage || ""}
                    sx={{ width: 48, height: 48 }}
                  >
                    {selectedRankHistory.userId?.username?.charAt(0) || "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedRankHistory.userId?.username || "Unknown User"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedRankHistory.userId?.email || "No email"}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Rank Change */}
            <Grid item xs={12}>
              <Paper
                sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Rank Progression
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
                      Previous Rank
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
                      New Rank
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
                  Additional Details
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {selectedRankHistory.rankDetails?.note && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Note
                      </Typography>
                      <Typography variant="body1">
                        {selectedRankHistory.rankDetails.note}
                      </Typography>
                    </Grid>
                  )}

                  {selectedRankHistory.extra && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Extra Information
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
          <Button onClick={closeModal}>Close</Button>
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
      rankPromotions: {},
    };

    rankHistories.forEach((rh) => {
      summary.totalRewards += rh.reward || 0;

      if (rh.status === "approved") summary.approved++;
      else if (rh.status === "pending") summary.pending++;
      else if (rh.status === "rejected") summary.rejected++;
      else if (rh.status === "flushed") summary.flushed++;

      const promotion = `${rh.oldRankId?.rank || "Unknown"} → ${rh.newRankId?.rank || "Unknown"}`;
      if (!summary.rankPromotions[promotion]) {
        summary.rankPromotions[promotion] = 0;
      }
      summary.rankPromotions[promotion]++;
    });

    return summary;
  };

  if (loading && !authChecked) {
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
                Rank History Reports
              </Typography>
            </div>
            <p className="text-gray-600 text-sm">
              Track all user rank promotions and rewards history.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Histories */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Histories</p>
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
                  <p className="text-sm text-gray-600 mb-1">Total Rewards</p>
                  <p className="text-2xl text-gray-800">
                    ${summary.totalRewards.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <RewardIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="px-2 py-1 text-sm font-medium bg-green-100 text-green-700 rounded">
                    {summary.approved} Approved
                  </span>
                </div>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <span className="px-2 py-1 text-sm text-blue-700 border border-blue-400 rounded">
                    {summary.pending} Pending
                  </span>
                  <span className="px-2 py-1 text-sm text-red-700 border border-red-400 rounded">
                    {summary.rejected} Rejected
                  </span>
                  <span className="px-2 py-1 text-sm text-yellow-700 border border-yellow-400 rounded">
                    {summary.flushed} Flushed
                  </span>
                </div>
              </div>
            </div>

            {/* Top Promotions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Top Promotions</p>
                <TrendingUpIcon className="w-6 h-6 text-orange-500" />
              </div>
              <div className="mt-1 space-y-1">
                {Object.entries(summary.rankPromotions)
                  .slice(0, 3)
                  .map(([promotion, count]) => (
                    <div
                      key={promotion}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span className="truncate">{promotion}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <DataTable
            title="Rank History Reports"
            data={filteredRankHistories}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search by username, email, rank, or history ID..."
            emptyMessage="No rank histories found"
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            activeFilter={activeFilter}
            filterLabel="Filter by Status"
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