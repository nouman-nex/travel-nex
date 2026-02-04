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
} from "@mui/icons-material";
import {
  AccountCircle as UserIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  DateRange as DateIcon,
  ShoppingCart as PurchaseIcon,
} from "@mui/icons-material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import DataTable from "@app/_components/table/table";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { CoinsIcon, Package } from "lucide-react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export default function PackagePurchasing() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1,
  });
const { t } = useTranslation();
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
      type: "purchase", // Only fetch purchase transactions
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
          setError("Failed to load purchase transactions");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions:", error);
        setError("Error loading purchase transactions");
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

  // Get transaction party name with user details
  const getPartyName = (row, isReceiver = false) => {
    const id = isReceiver ? row.receiverId : row.senderId;
    const details = isReceiver ? row.receiverDetails : row.senderDetails;

    if (id === 0) return "Admin";

    if (details && details.name) {
      return details.name;
    }

    return `User: ${id.toString().substring(0, 8)}...`;
  };

  // Define columns for the DataTable
  const columns = [
    {
      field: "_id",
      label: `${t("packagePurchasingPage.transactionId")}`,
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {row._id.substring(0, 10)}...
        </Typography>
      ),
      exportValue: (row) => row._id,
    },
    {
      field: "amount",
      label: `${t("packagePurchasingPage.purchaseAmount")}`,
      renderCell: (row) => (
        <Typography fontWeight="bold" color="primary.main">
          ${formatAmount(row.amount)}
        </Typography>
      ),
      exportValue: (row) => row.amount,
    },
    {
      field: "paymentMethod",
      label: `${t("packagePurchasingPage.paymentMethod")}`,
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
      field: "senderId",
      label: `${t("packagePurchasingPage.buyer")}`,
      renderCell: (row) => getPartyName(row, false),
      exportValue: (row) =>
        row.senderDetails?.name ||
        (row.senderId === 0 ? "Admin" : row.senderId),
    },
    {
      field: "status",
      label: `${t("packagePurchasingPage.status")}`,
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
      label: `${t("packagePurchasingPage.purchaseDate")}`,
      renderCell: (row) => formatDate(row.createdAt),
      exportValue: (row) => row.createdAt,
    },
    {
      field: "details",
      label: `${t("packagePurchasingPage.purchaseDetails")}`,
      renderCell: (row) => {
        return <Button>{t("packagePurchasingPage.showDetails")}</Button>;
      },
    },
  ];

 const filterOptions = [
    { value: "approved", label: `${t("packagePurchasingPage.approved")}` },
    { value: "pending", label:`${t("packagePurchasingPage.pending")}` },
    { value: "rejected", label: `${t("packagePurchasingPage.rejected")}` },
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
        {t("packagePurchasingPage.refresh")}
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
          <Typography variant="h6">{t("packagePurchasingPage.purchaseHubTransactionDetails")}</Typography>
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
                      {t("packagePurchasingPage.transactionId")}
                    </Typography>
                    <Typography variant="body1" fontFamily="monospace">
                      {selectedTransaction._id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("packagePurchasingPage.purchaseDateLabel")}
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedTransaction.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("packagePurchasingPage.type")}
                    </Typography>
                    <Chip label="Purchase" color="primary" size="small" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                     {t("packagePurchasingPage.amount")}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="primary.main"
                    >
                      {formatAmount(selectedTransaction.amount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("packagePurchasingPage.status")}
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

            {/* Buyer Information */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t("packagePurchasingPage.buyerInformation")}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {selectedTransaction.senderId === 0 ? (
                    <Avatar sx={{ mr: 1, bgcolor: "primary.main" }}>A</Avatar>
                  ) : (
                    <Avatar
                      sx={{ mr: 1 }}
                      src={
                        selectedTransaction.senderDetails?.profileImage || ""
                      }
                    >
                      {selectedTransaction.senderDetails?.name?.charAt(0) ||
                        "U"}
                    </Avatar>
                  )}
                  <Box>
                    <Typography variant="body1">
                      {selectedTransaction.senderId === 0
                        ? "Admin"
                        : selectedTransaction.senderDetails?.name ||
                          `User ID: ${selectedTransaction.senderId}`}
                    </Typography>
                    {selectedTransaction.senderId !== 0 &&
                      selectedTransaction.senderDetails?.email && (
                        <Typography variant="body2" color="text.secondary">
                          {selectedTransaction.senderDetails.email}
                        </Typography>
                      )}
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
                 {t("packagePurchasingPage.purchaseDetails")}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("packagePurchasingPage.purchaseDateLabel")} 
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
                          {t("packagePurchasingPage.hubitem")}
                        </Typography>
                        <Typography variant="body1">Hub Purchase</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {t("packagePurchasingPage.quantity")}
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
          <Button onClick={closeModal}>{t("packagePurchasingPage.close")}</Button>
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
                <PurchaseIcon className="w-6 h-6 text-white" />
              </div>
              <Typography
                variant="h3"
                sx={{
                  background: "linear-gradient(to right, #374151, #4B5563)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("packagePurchasingPage.purchasedHub")}
              </Typography>
            </div>
            <p className="text-gray-600 text-sm">
              {t("packagePurchasingPage.trackPurchasingHistory")}
            </p>
          </div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Bonus */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {t("packagePurchasingPage.totalTransactions")}
                  </p>
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
                  <p className="text-sm text-gray-600 mb-1">{t("packagePurchasingPage.totalAmount")}</p>
                  <p
                    style={{ fontSize: 18 }}
                    className="text-2xl text-gray-800"
                  >
                    {summary.totalAmount.toFixed(2)}
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
                  <p className="text-sm text-gray-600">{t("packagePurchasingPage.status")}</p>
                  <span className="px-2 py-1 text-sm font-medium bg-green-100 text-green-700 rounded">
                    {summary.approved} {t("packagePurchasingPage.approved")}
                  </span>
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-1 text-sm text-yellow-700 border border-yellow-400 rounded">
                    {summary.pending} {t("packagePurchasingPage.pending")}
                  </span>
                  <span className="px-2 py-1 text-sm text-red-700 border border-red-400 rounded">
                    {summary.rejected} {t("packagePurchasingPage.rejected")}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{t("packagePurchasingPage.lastTransactionDate")}</p>
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
            title={t("packagePurchasingPage.purchasedHub")}
            data={filteredTransactions}
            columns={columns}
            loading={loading}
            searchPlaceholder={t("packagePurchasingPage.searchPurchaseTransactions")}
            emptyMessage="No purchase transactions found"
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            activeFilter={activeFilter}
            filterLabel={t("packagePurchasingPage.filterByStatus")}
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
