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
  ArrowForward as ArrowIcon,
  AttachMoney as PurchaseIcon,
  Receipt as MoneyIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { CoinsIcon } from "lucide-react";
import { postRequest } from "../../../../backendServices/ApiCalls";
import DataTable from "@app/_components/table/table";

export default function DirectCommissionReport() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
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

  const fetchTransactions = (page = 1, filter = null) => {
    setLoading(true);
    setError(null);

    const requestBody = {
      transactionType: "direct_commission",
      page,
      limit: pagination.limit,
    };

    // Add status filter if present
    if (filter && ["approved", "pending", "rejected"].includes(filter)) {
      requestBody.status = filter;
    }

    postRequest(
      "/getTransactionsByType",
      requestBody,
      (response) => {
        console.log(response);
        if (response.data.success) {
          const transactionsData = response.data.transactions;
          setTransactions(transactionsData);

          // Apply client-side filtering if backend doesn't support it
          let filteredData = transactionsData;
          if (filter && ["approved", "pending", "rejected"].includes(filter)) {
            filteredData = transactionsData.filter(
              (tx) => tx.status === filter
            );
          }

          setFilteredTransactions(filteredData);
          setPagination(
            response.data.pagination || {
              page: 1,
              limit: 50,
              total: filteredData.length,
              pages: Math.ceil(filteredData.length / 50),
            }
          );
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

  // Auth check useEffect
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
      fetchTransactions();
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
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter((tx) => {
      // Check sender username
      const senderUsername = tx.senderDetails?.username?.toLowerCase() || "";
      const senderMatch = senderUsername.includes(term);

      // Check receiver username
      const receiverUsername =
        tx.receiverDetails?.username?.toLowerCase() || "";
      const receiverMatch = receiverUsername.includes(term);

      // Check transaction ID
      const txIdMatch = tx._id.toLowerCase().includes(term);

      return senderMatch || receiverMatch || txIdMatch;
    });

    setFilteredTransactions(filtered);
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
      label: "Transaction ID",
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {row._id?.substring(0, 10)}...
        </Typography>
      ),
      exportValue: (row) => row._id,
    },
    {
      field: "amount",
      label: "Amount",
      renderCell: (row) => (
        <Typography fontWeight="bold" color="primary.main">
          ${formatAmount(row.amount)}
        </Typography>
      ),
      exportValue: (row) => row.amount,
    },
    {
      field: "transactionFlow",
      label: "Transaction Flow",
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
      label: "Payment Method",
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
      label: "Status",
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
      label: "Date",
      renderCell: (row) => formatDate(row.createdAt || row.transactionDate),
      exportValue: (row) => row.createdAt || row.transactionDate,
    },
  ];

  // Filter options for status only
  const filterOptions = [
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ];

  // Handle filter change
  const handleFilterChange = (value) => {
    setActiveFilter(value);

    if (value) {
      // Apply filter to existing transactions
      const filtered = transactions.filter((tx) => tx.status === value);
      setFilteredTransactions(filtered);
    } else {
      // Show all transactions
      setFilteredTransactions(transactions);
    }
  };

  const clearFilters = () => {
    setActiveFilter(null);
    setFilteredTransactions(transactions);
  };

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    // Note: If you want server-side pagination with filters, uncomment below:
    // fetchTransactions(newPage, activeFilter);
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTransaction(null);
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
        Refresh
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
            Direct Commission Transaction Details
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
                      Transaction ID
                    </Typography>
                    <Typography variant="body1" fontFamily="monospace">
                      {selectedTransaction._id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(
                        selectedTransaction.createdAt ||
                          selectedTransaction.transactionDate
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Type
                    </Typography>
                    <Chip
                      label="Direct Commission"
                      color="primary"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Amount
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
                      Status
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
                  Transaction Flow
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
                      From (Sender)
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
                      To (Receiver)
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

            {/* Direct Commission Details */}
            <Grid item xs={12}>
              <Paper
                sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Direct Commission Details
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Payment Method
                    </Typography>
                    <Typography variant="body1">
                      {selectedTransaction.paymentMethod || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Transaction Type
                    </Typography>
                    <Typography variant="body1">
                      {selectedTransaction.transactionType ||
                        "Direct Commission"}
                    </Typography>
                  </Grid>

                  {/* Rejection Reason */}
                  {selectedTransaction.status === "rejected" &&
                    selectedTransaction.rejectionReason && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="error">
                          Rejection Reason
                        </Typography>
                        <Typography variant="body1">
                          {selectedTransaction.rejectionReason}
                        </Typography>
                      </Grid>
                    )}

                  {/* Withdrawal Details if available */}
                  {selectedTransaction.withdrawalDetails && (
                    <>
                      <Grid item xs={12}></Grid>
                      {selectedTransaction.withdrawalDetails.payoutAddress && (
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Payout Address
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "monospace",
                              wordBreak: "break-all",
                            }}
                          >
                            {
                              selectedTransaction.withdrawalDetails
                                .payoutAddress
                            }
                          </Typography>
                        </Grid>
                      )}
                      {selectedTransaction.withdrawalDetails.netAmount && (
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Net Amount
                          </Typography>
                          <Typography variant="body1">
                            $
                            {formatAmount(
                              selectedTransaction.withdrawalDetails.netAmount
                            )}
                          </Typography>
                        </Grid>
                      )}
                    </>
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

  const getTransactionSummary = (transactions) => {
    const summary = {
      totalTransactions: transactions.length,
      totalAmount: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      paymentMethods: {},
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
                Direct Commission Reports
              </Typography>
            </div>
            <p className="text-gray-600 text-sm">
              Track your all Direct Commission history.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Transactions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Transactions
                  </p>
                  <p className="text-2xl text-gray-800">
                    {summary.totalTransactions}
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
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-2xl text-gray-800">
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
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="px-2 py-1 text-sm font-medium bg-green-100 text-green-700 rounded">
                    {summary.approved} Approved
                  </span>
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-1 text-sm text-yellow-700 border border-yellow-400 rounded">
                    {summary.pending} Pending
                  </span>
                  <span className="px-2 py-1 text-sm text-red-700 border border-red-400 rounded">
                    {summary.rejected} Rejected
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Payment Methods</p>
                <CoinsIcon className="w-6 h-6 text-orange-500" />
              </div>
              <div className="mt-1 space-y-1">
                {Object.entries(summary.paymentMethods).map(
                  ([method, amount]) => (
                    <div
                      key={method}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>{method}</span>
                      <span className="font-medium">${amount.toFixed(2)}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <DataTable
            title="Direct Commission Reports"
            data={filteredTransactions}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search by username or transaction ID..."
            emptyMessage="No Direct Commission transactions found"
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            activeFilter={activeFilter}
            filterLabel="Filter by Status"
            actionButtons={actionButtons}
            onRowClick={handleTransactionClick}
            onSearch={handleSearch}
          />

          {/* Pagination */}
          {filteredTransactions.length > 0 && pagination.pages > 1 && (
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
