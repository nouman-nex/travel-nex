import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
} from "@mui/icons-material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import DataTable from "@app/_components/table/table";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { RefreshCwIcon } from "lucide-react";

export default function DepositRequest() {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
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
  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to fetch orders
  const fetchOrders = () => {
    setLoading(true);
    postRequest(
      "/getOrders",
      {},
      (response) => {
        const fetchedOrders = response.data.data || [];
        setAllOrders(fetchedOrders); // 🔒 Store full copy
        setOrders(fetchedOrders); // 📄 Displayed version
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setSnackbar({
          open: true,
          message: "Failed to load orders",
          severity: "error",
        });
        setLoading(false);
      }
    );
  };

  // Handle order completion
  const handleCompleteOrder = (orderId) => {
    setCompleting(true);
    postRequest(
      "/completeOrder",
      { orderId },
      (response) => {
        setCompleting(false);
        setOpenDialog(false);
        setSnackbar({
          open: true,
          message: "Order completed successfully",
          severity: "success",
        });
        fetchOrders(); // Refresh the order list
      },
      (error) => {
        setCompleting(false);
        setSnackbar({
          open: true,
          message: "Failed to complete order",
          severity: "error",
        });
      }
    );
  };

  // Open dialog for order completion confirmation
  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Table columns configuration
  const columns = [
    {
      field: "_id",
      label: "Order ID",
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {row._id.substring(0, 8)}...
        </Typography>
      ),
      exportValue: (row) => row._id,
    },
    {
      field: "competitionTitle",
      label: "Competition",
      renderCell: (row) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
          {row.competitionTitle}
        </Typography>
      ),
    },
    {
      field: "firstName",
      label: "Customer",
      renderCell: (row) => (
        <Typography variant="body2">
          {row.firstName} {row.lastName}
        </Typography>
      ),
      exportValue: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      field: "email",
      label: "Email",
      renderCell: (row) => (
        <Typography variant="body2" noWrap>
          {row.email}
        </Typography>
      ),
    },
    {
      field: "ticketQuantity",
      label: "Tickets",
      align: "right",
    },
    {
      field: "totalCost",
      label: "Amount",
      align: "right",
      renderCell: (row) => (
        <Typography variant="body2" fontWeight="bold">
          ${row.totalCost.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: "paymentStatus",
      label: "Status",
      renderCell: (row) => {
        let color, icon, label;

        switch (row.paymentStatus) {
          case "completed":
            color = "success";
            icon = <CheckCircleIcon fontSize="small" />;
            label = "Completed";
            break;
          case "failed":
            color = "error";
            icon = <CancelIcon fontSize="small" />;
            label = "Failed";
            break;
          case "refunded":
            color = "warning";
            icon = <CancelIcon fontSize="small" />;
            label = "Refunded";
            break;
          default:
            color = "info";
            icon = <PendingIcon fontSize="small" />;
            label = "Pending";
        }

        return (
          <Chip
            size="small"
            color={color}
            icon={icon}
            label={label}
            variant="outlined"
          />
        );
      },
    },
    {
      field: "createdAt",
      label: "Date",
      renderCell: (row) => new Date(row.createdAt).toLocaleDateString(),
      exportValue: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      field: "actions",
      label: "Payment Method",
      align: "center",
      renderCell: (row) => (
        <Typography variant="body2" fontWeight="normal">
          {row.paymentMethod}
        </Typography>
      ),
    },
  ];

  // Filter options for payment status
  const filterOptions = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ];

  // Handle filter change
  const handleFilterChange = (value) => {
    setLoading(true);

    if (value === "All") {
      setOrders(allOrders);
    } else {
      const filtered = allOrders.filter(
        (order) => order.paymentStatus === value
      );
      setOrders(filtered);
    }

    setLoading(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <DataTable
        title="Order Reports"
        data={orders}
        columns={columns}
        loading={loading}
        filterOptions={filterOptions}
        initialFilterValue="All"
        onFilterChange={handleFilterChange}
        searchPlaceholder="Search orders..."
        emptyMessage="No orders found"
        filterLabel="Status"
        actionButtons={
          <Button
            variant="outlined"
            startIcon={<RefreshCwIcon />}
            onClick={fetchOrders}
            size="small"
          >
            Refresh
          </Button>
        }
      />
    </Box>
  );
}
