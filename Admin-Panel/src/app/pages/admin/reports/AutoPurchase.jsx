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
import { Close as CloseIcon } from "@mui/icons-material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import DataTable from "@app/_components/table/table";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import {
  Refresh as RefreshIcon,
  AccountCircle as UserIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  DateRange as DateIcon,
} from "@mui/icons-material";

export default function AutoPurchase() {
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

  const { User } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run logic if User is defined (i.e. data has loaded)
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isAdmin = roles.includes("Admin");

      if (!isAdmin) {
        navigate("/dashboard");
      }
    }
  }, [User, navigate]);

  const fetchTransactions = (page = 1, filter = null) => {
    setLoading(true);
    setError(null);

    const requestBody = {
      page: page,
      limit: pagination.limit,
    };

    // Add filter if present
    if (filter) {
      // Check if filter is a transaction type or status
      if (
        ["purchase", "withdrawal", "referral_bonus", "auto-purchase"].includes(
          filter
        )
      ) {
        requestBody.type = filter;
      } else if (["approved", "pending", "rejected"].includes(filter)) {
        requestBody.status = filter;
      }
    }

    postRequest(
      "/getTransactions",
      requestBody,
      (response) => {
        if (response.data.success) {
          console.log(response);
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
    fetchTransactions(1, "auto-purchase");
    setActiveFilter("auto-purchase");
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

    return `User: ${id.substring(0, 8)}...`;
  };

  // Define columns for the DataTable
  const columns = [
    {
      field: "_id",
      label: "Transaction ID",
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {row._id.substring(0, 10)}...
        </Typography>
      ),
      exportValue: (row) => row._id,
    },
    {
      field: "transactionType",
      label: "Type",
      renderCell: (row) => (
        <Chip
          label={row.transactionType.replace("_", " ")}
          color={
            row.transactionType === "purchase"
              ? "primary"
              : row.transactionType === "withdrawal"
                ? "warning"
                : "success"
          }
          size="small"
        />
      ),
    },
    {
      field: "amount",
      label: "Amount",
      renderCell: (row) => (
        <Typography
          fontWeight="bold"
          color={row.amount > 0 ? "success.main" : "inherit"}
        >
          ${formatAmount(row.amount)}
        </Typography>
      ),
      exportValue: (row) => row.amount,
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
              : row.paymentMethod === "USDC"
                ? "info"
                : "default"
          }
        />
      ),
    },
    {
      field: "senderId",
      label: "From",
      renderCell: (row) => getPartyName(row, false),
      exportValue: (row) =>
        row.senderDetails?.name ||
        (row.senderId === 0 ? "Admin" : row.senderId),
    },
    {
      field: "receiverId",
      label: "To",
      renderCell: (row) => getPartyName(row, true),
      exportValue: (row) =>
        row.receiverDetails?.name ||
        (row.receiverId === 0 ? "Admin" : row.receiverId),
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
      renderCell: (row) => formatDate(row.createdAt),
      exportValue: (row) => row.createdAt,
    },
    {
      field: "details",
      label: "Details",
      renderCell: (row) => {
        const {
          transactionType,
          orderDetails,
          commissionDetails,
          status,
          rejectionReason,
        } = row;

        if (transactionType === "purchase" && orderDetails) {
          const title = orderDetails.competitionTitle || "N/A";
          const tickets = orderDetails.ticketQuantity ?? 0;
          return `Competition: ${title}, Tickets: ${tickets}`;
        }

        if (transactionType === "referral_bonus" && commissionDetails) {
          const level = commissionDetails.level ?? "N/A";
          const percentage = commissionDetails.percentage ?? 0;
          return `Referral Bonus - Level ${level}, Commission: ${percentage}%`;
        }

        if (transactionType === "direct_referral_bonus" && commissionDetails) {
          const percentage = commissionDetails.percentage ?? 0;
          return `Direct Referral Bonus: ${percentage}%`;
        }

        if (status === "rejected") {
          return rejectionReason || "No reason provided";
        }

        return "-";
      },
    },
  ];

  // Filter options for the DataTable
  const filterOptions = [
    { value: "referral_bonus", label: "Referral Bonuses" },
  ];

  // Handle filter change
  const handleFilterChange = (value) => {
    setLoading(true);
    setActiveFilter(value);

    // Reset to first page when applying filter
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
      {/* {activeFilter && (
        <Button
          variant="text"
          onClick={clearFilters}
          size="small"
          sx={{ mr: 1 }}
        >
          Clear Filters
        </Button>
      )} */}
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
  const summary = getTransactionSummary(filteredTransactions);

  // Transaction details modal
  const renderTransactionModal = () => {
    if (!selectedTransaction) return null;

    return (
      <Dialog
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
        open={modalOpen}
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
          <Typography variant="h6">Transaction Details</Typography>
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
                      Date & Time
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedTransaction.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Type
                    </Typography>
                    <Chip
                      label={selectedTransaction.transactionType.replace(
                        "_",
                        " "
                      )}
                      color={
                        selectedTransaction.transactionType === "purchase"
                          ? "primary"
                          : selectedTransaction.transactionType === "withdrawal"
                            ? "warning"
                            : "success"
                      }
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
                      color={
                        selectedTransaction.amount > 0
                          ? "success.main"
                          : "inherit"
                      }
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

            {/* Sender and Receiver */}
            <Grid item xs={12} sm={6}>
              <Paper
                sx={{
                  p: 2,
                  height: "100%",
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Sender
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

            <Grid item xs={12} sm={6}>
              <Paper
                sx={{
                  p: 2,
                  height: "100%",
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Receiver
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {selectedTransaction.receiverId === 0 ? (
                    <Avatar sx={{ mr: 1, bgcolor: "primary.main" }}>A</Avatar>
                  ) : (
                    <Avatar
                      sx={{ mr: 1 }}
                      src={
                        selectedTransaction.receiverDetails?.profileImage || ""
                      }
                    >
                      {selectedTransaction.receiverDetails?.name?.charAt(0) ||
                        "U"}
                    </Avatar>
                  )}
                  <Box>
                    <Typography variant="body1">
                      {selectedTransaction.receiverId === 0
                        ? "Admin"
                        : selectedTransaction.receiverDetails?.name ||
                          `User ID: ${selectedTransaction.receiverId}`}
                    </Typography>
                    {selectedTransaction.receiverId !== 0 &&
                      selectedTransaction.receiverDetails?.email && (
                        <Typography variant="body2" color="text.secondary">
                          {selectedTransaction.receiverDetails.email}
                        </Typography>
                      )}
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Transaction Details */}
            <Grid item xs={12}>
              <Paper
                sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Transaction Details
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

                  {/* Order Details for Purchase */}
                  {selectedTransaction.transactionType === "purchase" &&
                    selectedTransaction.orderDetails && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Competition
                          </Typography>
                          <Typography variant="body1">
                            {selectedTransaction.orderDetails
                              .competitionTitle || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Tickets Purchased
                          </Typography>
                          <Typography variant="body1">
                            {selectedTransaction.orderDetails.ticketQuantity ||
                              "0"}
                          </Typography>
                        </Grid>
                      </>
                    )}

                  {/* Commission Details for Referral Bonus */}
                  {selectedTransaction.transactionType === "auto-purchase" &&
                    selectedTransaction.commissionDetails && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Referral Level
                          </Typography>
                          <Typography variant="body1">
                            Level{" "}
                            {selectedTransaction.commissionDetails.level ||
                              "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Commission Percentage
                          </Typography>
                          <Typography variant="body1">
                            {selectedTransaction.commissionDetails.percentage ||
                              "0"}
                            %
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
          <Button onClick={closeModal}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

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
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Transactions
                    </Typography>
                    <ReceiptIcon color="primary" />
                  </Stack>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {summary.totalTransactions}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Amount
                    </Typography>
                    <MoneyIcon color="success" />
                  </Stack>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    ${summary.totalAmount.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Approved
                    </Typography>
                    <Chip
                      color="success"
                      label={`Approved: ${summary.approved}`}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip
                      size="small"
                      label={`Pending: ${summary.pending}`}
                      color="warning"
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label={`Rejected: ${summary.rejected}`}
                      color="error"
                      variant="outlined"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Methods
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {Object.entries(summary.paymentMethods).map(
                      ([method, amount]) => (
                        <Stack
                          key={method}
                          direction="row"
                          justifyContent="space-between"
                          sx={{ mb: 1 }}
                        >
                          <Typography variant="body2">{method}</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            ${amount.toFixed(2)}
                          </Typography>
                        </Stack>
                      )
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <DataTable
            title="Auto Purchase Reports"
            data={filteredTransactions}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search transactions..."
            emptyMessage="No transactions found"
            filterLabel="Filter by"
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
