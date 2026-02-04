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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Close as CloseIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import {
  AccountCircle as UserIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  DateRange as DateIcon,
  ShoppingCart as PurchaseIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import DataTable from "@app/_components/table/table";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { CoinsIcon, Package } from "lucide-react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export default function DirectCommission() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1,
  });

  const { User } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run logic if User is defined (i.e. data has loaded)
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isAdmin = roles.includes("Admin");

      if (isAdmin) {
        navigate("/");
      }
    }
  }, [User, navigate]);

  const fetchTransactions = (page = 1, filter = null) => {
    setLoading(true);
    setError(null);

    const requestBody = {
      page: page,
      limit: pagination.limit,
      type: "direct_commission", // Only fetch transactions
    };

    // Add status filter if present
    if (filter) {
      if (["approved", "pending", "rejected"].includes(filter)) {
        requestBody.status = filter;
      }
    }

    postRequest(
      "/getTransactions",
      requestBody,
      (response) => {
        console.log(response);
        if (response.data.success) {
          const transactionsData = response.data.transactions;
          setTransactions(transactionsData);
          setFilteredTransactions(transactionsData);
          setPagination(response.data.pagination);
        } else {
          setError("Failed to load transactions");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions:", error);
        setError("Error loading transactions");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchTransactions(1); // Load all purchase transactions initially
  }, []);

  // Format currency amount with 2 decimal places
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date to more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get party name with proper handling for Admin (0 or "system")
  const getPartyName = (row, isReceiver = false) => {
    const id = isReceiver ? row.receiverId : row.senderId;
    const details = isReceiver ? row.receiverDetails : row.senderDetails;

    // Handle Admin cases
    if (id === 0 || id === "0" || id === "system") {
      return "Admin";
    }

    // If we have details, use the name
    if (details && details.name) {
      return details.name;
    }

    // Fallback to truncated ID
    return `User: ${id.toString().substring(0, 8)}...`;
  };

  // Get party display with avatar for better UI
  const getPartyDisplay = (row, isReceiver = false) => {
    const id = isReceiver ? row.receiverId : row.senderId;
    const details = isReceiver ? row.receiverDetails : row.senderDetails;
    const name = getPartyName(row, isReceiver);

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {id === 0 || id === "0" || id === "system" ? (
          <Avatar sx={{ width: 24, height: 24, bgcolor: "primary.main" }}>
            <AdminIcon sx={{ fontSize: 14 }} />
          </Avatar>
        ) : (
          <Avatar
            sx={{ width: 24, height: 24 }}
            src={details?.profileImage || ""}
          >
            {details?.name?.charAt(0) || "U"}
          </Avatar>
        )}
        <Typography variant="body2">{name}</Typography>
      </Box>
    );
  };

  // Define columns for the DataTable
  const columns = [
    {
      field: "_id",
      label: `${t("directCommission.transactionId")}`,
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {row._id.substring(0, 10)}...
        </Typography>
      ),
      exportValue: (row) => row._id,
    },
    {
      field: "amount",
      label: `${t("directCommission.amount")}`,
      renderCell: (row) => (
        <Typography fontWeight="bold" color="primary.main">
          ${formatAmount(row.amount)}
        </Typography>
      ),
      exportValue: (row) => row.amount,
    },
    {
      field: "transactionFlow",
      label: `${t("directCommission.transactionFlow")}`,
      renderCell: (row) => (
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 200 }}
        >
          {getPartyDisplay(row, false)}
          <ArrowIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          {getPartyDisplay(row, true)}
        </Box>
      ),
      exportValue: (row) =>
        `${getPartyName(row, false)} → ${getPartyName(row, true)}`,
    },
    {
      field: "paymentMethod",
      label: `${t("directCommission.paymentMethod")}`,
      renderCell: (row) => (
        <Chip
          label={row.paymentMethod}
          variant="outlined"
          size="small"
          color={
            row.paymentMethod === "USDT"
              ? "secondary"
              : row.paymentMethod === "wallet"
                ? "info"
                : "default"
          }
        />
      ),
    },
    {
      field: "status",
      label: `${t("directCommission.status")}`,
      renderCell: (row) => (
        <Chip
          label={row.status}
          color={
            row.status === "approved"
              ? "success"
              : row.status === "rejected"
                ? "error"
                : "warning"
          }
          size="small"
        />
      ),
    },
    {
      field: "createdAt",
      label: `${t("directCommission.date")}`,
      renderCell: (row) => formatDate(row.createdAt),
      exportValue: (row) => row.createdAt,
    },
  ];

 const filterOptions = [
    { value: "approved", label: `${t("directCommission.approved")}` },
    { value: "pending", label:`${t("directCommission.pending")}` },
    { value: "rejected", label: `${t("directCommission.rejected")}` },
  ];
  
  // Handle filter change
  const handleFilterChange = (value) => {
    setLoading(true);
    setActiveFilter(value);
    fetchTransactions(1, value);
  };

  const clearFilters = () => {
    setActiveFilter(null);
    fetchTransactions(1);
  };

  const handlePageChange = (event, newPage) => {
    fetchTransactions(newPage, activeFilter);
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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
        onClick={() => fetchTransactions(pagination.page, activeFilter)}
        size="small"
      >
        {t("directCommission.refresh")}
      </Button>
    </>
  );

  // Transaction details modal
  const renderTransactionModal = () => {
    if (!selectedTransaction) return null;

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
          <Typography variant="h6">
            {t("directCommission.modalTitle")}
          </Typography>
          <IconButton onClick={closeModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Transaction ID and Basic Info */}
            <Grid item xs={12}>
              <Paper
                sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("directCommission.transactionId")}
                    </Typography>
                    <Typography variant="body1" fontFamily="monospace">
                      {selectedTransaction._id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("directCommission.date")}
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedTransaction.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Type
                    </Typography>
                    <Chip label="Bonus" color="primary" size="small" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("directCommission.amount")}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="primary.main"
                    >
                      ${formatAmount(selectedTransaction.amount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("directCommission.status")}
                    </Typography>
                    <Chip
                      label={selectedTransaction.status}
                      color={
                        selectedTransaction.status === "approved"
                          ? "success"
                          : selectedTransaction.status === "rejected"
                            ? "error"
                            : "warning"
                      }
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Transaction Flow */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t("directCommission.transactionFlow")}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {t("directCommission.fromSender")}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {selectedTransaction.senderId === 0 ||
                      selectedTransaction.senderId === "0" ||
                      selectedTransaction.senderId === "system" ? (
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          <AdminIcon />
                        </Avatar>
                      ) : (
                        <Avatar
                          src={
                            selectedTransaction.senderDetails?.profileImage ||
                            ""
                          }
                        >
                          {selectedTransaction.senderDetails?.name?.charAt(0) ||
                            "U"}
                        </Avatar>
                      )}
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {getPartyName(selectedTransaction, false)}
                        </Typography>
                        {selectedTransaction.senderId !== 0 &&
                          selectedTransaction.senderId !== "0" &&
                          selectedTransaction.senderId !== "system" &&
                          selectedTransaction.senderDetails?.email && (
                            <Typography variant="body2" color="text.secondary">
                              {selectedTransaction.senderDetails.email}
                            </Typography>
                          )}
                      </Box>
                    </Box>
                  </Box>

                  <ArrowIcon sx={{ fontSize: 32, color: "primary.main" }} />

                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {t("directCommission.toReceiver")}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {selectedTransaction.receiverId === 0 ||
                      selectedTransaction.receiverId === "0" ||
                      selectedTransaction.receiverId === "system" ? (
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          <AdminIcon />
                        </Avatar>
                      ) : (
                        <Avatar
                          src={
                            selectedTransaction.receiverDetails?.profileImage ||
                            ""
                          }
                        >
                          {selectedTransaction.receiverDetails?.name?.charAt(
                            0
                          ) || "U"}
                        </Avatar>
                      )}
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {getPartyName(selectedTransaction, true)}
                        </Typography>
                        {selectedTransaction.receiverId !== 0 &&
                          selectedTransaction.receiverId !== "0" &&
                          selectedTransaction.receiverId !== "system" &&
                          selectedTransaction.receiverDetails?.email && (
                            <Typography variant="body2" color="text.secondary">
                              {selectedTransaction.receiverDetails.email}
                            </Typography>
                          )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Purchase Details */}
            <Grid item xs={12}>
              <Paper
                sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t("directCommission.bonusDetails")}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("directCommission.paymentMethod")}
                    </Typography>
                    <Typography variant="body1">
                      {selectedTransaction.paymentMethod || "N/A"}
                    </Typography>
                  </Grid>

                  {/* Order Details if available */}
                  {selectedTransaction.orderDetails && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Package/Item
                        </Typography>
                        <Typography variant="body1">
                          {selectedTransaction.orderDetails.competitionTitle ||
                            selectedTransaction.orderDetails.packageName ||
                            "Package Purchase"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Quantity
                        </Typography>
                        <Typography variant="body1">
                          {selectedTransaction.orderDetails.ticketQuantity ||
                            selectedTransaction.orderDetails.quantity ||
                            "1"}
                        </Typography>
                      </Grid>
                    </>
                  )}

                  {/* Rejection Reason */}
                  {selectedTransaction.status === "rejected" && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="error">
                        Rejection Reason
                      </Typography>
                      <Typography variant="body1">
                        {selectedTransaction.rejectionReason ||
                          "No reason provided"}
                      </Typography>
                    </Grid>
                  )}

                  {/* Additional fields */}
                  {selectedTransaction.notes && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Notes
                      </Typography>
                      <Typography variant="body1">
                        {selectedTransaction.notes}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>{t("directCommission.close")}</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const getTransactionSummary = (transactions) => {
    const summary = {
      totalPurchases: transactions.length,
      totalAmount: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      paymentMethods: {},
      lastTransactionDate: null, // Add this line
    };

    transactions.forEach((tx) => {
      summary.totalAmount += tx.amount || 0;

      if (tx.status === "approved") summary.approved++;
      else if (tx.status === "pending") summary.pending++;
      else if (tx.status === "rejected") summary.rejected++;

      const method = tx.paymentMethod || "Other";
      if (!summary.paymentMethods[method]) {
        summary.paymentMethods[method] = 0;
      }
      summary.paymentMethods[method] += tx.amount || 0;
    });

    // Add this part to find the last transaction date
    if (transactions.length > 0) {
      const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      summary.lastTransactionDate = sortedTransactions[0].createdAt;
    }

    return summary;
  };

  const summary = getTransactionSummary(filteredTransactions);

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {error ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => fetchTransactions(1)}
          >
            Try Again
          </Button>
        </Box>
      ) : (
        <>
          <div className="mb-8 border-b-2 border-gray-300 pb-4">
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
                 {t("directCommission.title")}
              </Typography>
            </div>
            <p className="text-gray-600 text-sm">
              {t("directCommission.description")}
            </p>
          </div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Bonus */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("directCommission.totalBonus")}</p>
                  <p
                    style={{ fontSize: 18 }}
                    className="text-2xl text-gray-800"
                  >
                    {summary.totalPurchases}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <PurchaseIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("directCommission.totalAmount")}</p>
                  <p
                    style={{ fontSize: 18 }}
                    className="text-2xl text-gray-800"
                  >
                    ${summary.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <MoneyIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">{t("directCommission.status")}</p>
                  <span className="px-2 py-1 text-sm font-medium bg-green-100 text-green-700 rounded">
                    {summary.approved} {t("directCommission.approved")}
                  </span>
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-1 text-sm text-yellow-700 border border-yellow-400 rounded">
                    {summary.pending} {t("directCommission.pending")}
                  </span>
                  <span className="px-2 py-1 text-sm text-red-700 border border-red-400 rounded">
                    {summary.rejected} {t("directCommission.rejected")}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{t("directCommission.lastTransactionDate")}</p>
                <CoinsIcon className="w-6 h-6 text-orange-500" />
              </div>

              <div className="mt-1 text-sm text-gray-700">
                <span className="font-medium">
                  {summary.lastTransactionDate
                    ? dayjs(summary.lastTransactionDate).format(
                        "MMM D, YYYY h:mm A"
                      )
                    : "No transactions yet"}
                </span>
              </div>
            </div>
          </div>

          <DataTable
            title={t("directCommission.title")}
            data={filteredTransactions}
            columns={columns}
            loading={loading}
            searchPlaceholder={t("directCommission.searchPlaceholder")}
            emptyMessage="No bonus transactions found"
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            activeFilter={activeFilter}
            filterLabel={t("directCommission.filterByStatus")}
            actionButtons={actionButtons}
            onRowClick={handleTransactionClick}
          />

          {/* Pagination */}
          {filteredTransactions.length > 0 && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={pagination.pages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}

          {/* Transaction Details Modal */}
          {renderTransactionModal()}
        </>
      )}
    </Box>
  );
}
