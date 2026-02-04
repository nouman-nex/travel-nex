import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
} from "@mui/material";
import { postRequest } from "../../../backendServices/ApiCalls";
import DataTable from "@app/_components/table/table";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import {
  Refresh as RefreshIcon,
  AccountCircle as UserIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  DateRange as DateIcon,
} from "@mui/icons-material";

export default function Purchasing() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    byPaymentMethod: {},
  });
  const { User } = useAuth();

  // Load transaction data on component mount
  useEffect(() => {
    if (User?._id) {
      fetchPurchaseReports();
    }
  }, [User?._id]);

  const fetchPurchaseReports = () => {
    setLoading(true);

    postRequest(
      "/getUserReports",
      {
        transactionType: "purchase",
        userId: User?._id,
      },
      (response) => {
        if (response.data.success) {
          setTransactions(response.data.transactions);
          setSummary(response.data.summary);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching purchase reports:", error);
        setLoading(false);
      }
    );
  };

  // Define table columns
  const columns = [
    {
      field: "senderId",
      label: "From",
      renderCell: (row) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <UserIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="body2">
            {row.senderId === 0 ? "System" : row.senderName || row.senderId}
          </Typography>
        </Box>
      ),
    },
    {
      field: "receiverId",
      label: "To",
      renderCell: (row) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <UserIcon fontSize="small" sx={{ mr: 1, color: "secondary.main" }} />
          <Typography variant="body2">
            {row.receiverId === 0
              ? "System"
              : row.receiverName || row.receiverId}
          </Typography>
        </Box>
      ),
    },
    {
      field: "amount",
      label: "Amount",
      align: "right",
      renderCell: (row) => (
        <Typography variant="body2" fontWeight="bold">
          ${row.amount.toFixed(2)}
        </Typography>
      ),
      exportValue: (row) => row.amount.toFixed(2),
    },
    {
      field: "paymentMethod",
      label: "Payment Method",
      renderCell: (row) => (
        <Chip
          size="small"
          label={row.paymentMethod || "N/A"}
          color="default"
          variant="outlined"
        />
      ),
    },
    {
      field: "status",
      label: "Status",
      renderCell: (row) => {
        let color = "default";
        if (row.status === "approved") color = "success";
        if (row.status === "pending") color = "warning";
        if (row.status === "rejected") color = "error";

        return <Chip size="small" label={row.status} color={color} />;
      },
    },
    {
      field: "transactionDate",
      label: "Date",
      renderCell: (row) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <DateIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
          <Typography variant="body2">
            {new Date(row.transactionDate).toLocaleString()}
          </Typography>
        </Box>
      ),
      exportValue: (row) => new Date(row.transactionDate).toLocaleString(),
      exportTransform: (row) => {
        // This function transforms each row into a flat structure for CSV export
        return [
          {
            Username:
              row.senderId === 0 ? "System" : row.senderName || row.senderId,
            "Full Name": row.senderFullName || "-",
            Email: row.senderEmail || "-",
            Mobile: row.senderMobile || "-",
            Date: new Date(row.transactionDate).toLocaleDateString(),
          },
        ];
      },
    },
  ];

  // Filter options for the data table
  const filterOptions = [
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ];

  // Action buttons for the data table
  const actionButtons = (
    <Button
      variant="contained"
      startIcon={<RefreshIcon />}
      onClick={fetchPurchaseReports}
      size="small"
    >
      Refresh
    </Button>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Purchase Reports
      </Typography>

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
                {summary.totalTransactions || 0}
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
                ${(summary.totalAmount || 0).toFixed(2)}
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
                <Chip color="success" label={summary.approved || 0} />
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip
                  size="small"
                  label={`Pending: ${summary.pending || 0}`}
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label={`Rejected: ${summary.rejected || 0}`}
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
                {Object.keys(summary.byPaymentMethod || {}).length > 0 ? (
                  Object.entries(summary.byPaymentMethod).map(
                    ([method, data]) => (
                      <Stack
                        key={method}
                        direction="row"
                        justifyContent="space-between"
                        sx={{ mb: 0.5 }}
                      >
                        <Typography variant="body2">{method}</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {data.count} (${data.amount.toFixed(2)})
                        </Typography>
                      </Stack>
                    )
                  )
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No data available
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Data Table */}
      <DataTable
        title="Purchase Transactions"
        data={transactions}
        columns={columns}
        loading={loading}
        filterOptions={filterOptions}
        filterLabel="Status"
        initialFilterValue="All"
        searchPlaceholder="Search transactions..."
        emptyMessage="No transactions found"
        actionButtons={actionButtons}
        exportTransformMode="flat" // Use flat mode for CSV export
      />
    </Box>
  );
}
