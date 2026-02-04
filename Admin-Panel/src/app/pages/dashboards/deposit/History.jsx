import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import DataTable from "@app/_components/table/table";
import {
  Box,
  Typography,
  Button,
  Chip,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../../../../backendServices/ApiCalls";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast, ToastContainer } from "react-toastify";

export default function History() {
  const { User } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [rejectionInfoDialogOpen, setRejectionInfoDialogOpen] = useState(false);
  const [selectedRejectionReason, setSelectedRejectionReason] = useState("");

  const fetchWithdrawHistory = () => {
    setLoading(true);
    postRequest(
      "/getwithdrwahistory",
      {},
      (response) => {
        const history = response.data.data || [];
        setWithdrawHistory(history);
        applyStatusFilter(history, statusFilter);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching withdraw history:", error);
        setLoading(false);
      }
    );
  };

  const applyStatusFilter = (data, filter) => {
    if (filter === "all") {
      setFilteredHistory(data);
    } else {
      const filtered = data.filter((item) => item.status === filter);
      setFilteredHistory(filtered);
    }
  };

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setStatusFilter(newFilter);
    applyStatusFilter(withdrawHistory, newFilter);
  };

  useEffect(() => {
    fetchWithdrawHistory();
  }, []);

  // No need for this effect anymore as we'll update both states directly
  // We'll keep the filter change handling in the handleFilterChange function

  const handleStatusUpdate = (id, status, amount, reason = "") => {
    setUpdateLoading(true);
    const currentTime = new Date().toISOString();
    const requestData = {
      id: id,
      status: status,
      amount: amount,
      updatedAt: currentTime,
    };

    if (reason) {
      requestData.reason = reason;
    }

    postRequest(
      "/updatewithdrawstatus",
      requestData,
      (response) => {
        // Create the updated item
        const updatedItem = {
          status,
          updatedAt: currentTime,
          reason: reason || undefined,
        };

        // Update both states directly without calling the API again
        setWithdrawHistory((prevHistory) => {
          const newHistory = prevHistory.map((item) =>
            item._id === id ? { ...item, ...updatedItem } : item
          );
          return newHistory;
        });

        // Update filteredHistory directly based on the current filter
        setFilteredHistory((prevFiltered) => {
          if (statusFilter === "all") {
            // For "all" filter, just update the item
            return prevFiltered.map((item) =>
              item._id === id ? { ...item, ...updatedItem } : item
            );
          } else if (statusFilter === status) {
            // For matching filter, make sure the item is included
            const itemExists = prevFiltered.some((item) => item._id === id);
            if (itemExists) {
              return prevFiltered.map((item) =>
                item._id === id ? { ...item, ...updatedItem } : item
              );
            } else {
              // Find the item in the main history and add it to filtered
              const itemToAdd = withdrawHistory.find((item) => item._id === id);
              if (itemToAdd) {
                return [...prevFiltered, { ...itemToAdd, ...updatedItem }];
              }
              return prevFiltered;
            }
          } else {
            // For non-matching filter, remove the item if it exists
            return prevFiltered.filter((item) => item._id !== id);
          }
        });

        // Show success toast
        toast.success(`Status updated to ${status}`, {
          position: "top-right",
          autoClose: 3000,
        });

        setUpdateLoading(false);
      },
      (error) => {
        console.error("Error updating status:", error);
        toast.error("Failed to update status", {
          position: "top-right",
          autoClose: 3000,
        });
        setUpdateLoading(false);
      }
    );
  };

  const openRejectionModal = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setRejectionReason("");
    setRejectionModalOpen(true);
  };

  const handleRejectionSubmit = () => {
    if (selectedWithdrawal) {
      handleStatusUpdate(
        selectedWithdrawal._id,
        "rejected",
        selectedWithdrawal.amount2,
        rejectionReason
      );
      setRejectionModalOpen(false);
      setSelectedWithdrawal(null);
      setRejectionReason("");
    }
  };

  const viewRejectionReason = (reason) => {
    setSelectedRejectionReason(reason || "No reason provided");
    setRejectionInfoDialogOpen(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Address copied!", {
          position: "top-right",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.error("Failed to copy:", error);
        toast.error("Failed to copy address", {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };

  const columns = [
    {
      field: "_id",
      label: "Serial no",
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {row._id?.substring(0, 8)}...
        </Typography>
      ),
    },
    {
      field: "totalCost",
      label: "Amount",
      align: "right",
      renderCell: (row) => (
        <Typography variant="body2" fontWeight="bold">
          {User.roles.includes("Admin") ? row.amount : row.amount2}
        </Typography>
      ),
    },
    {
      field: "payoutAddress",
      label: "payoutAddress",
      renderCell: (row) => (
        <Box
          sx={{ display: "flex", alignItems: "center", position: "relative" }}
        >
          <Typography
            variant="body2"
            noWrap
            sx={{
              maxWidth: "180px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {row.payoutAddress}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(row.payoutAddress);
            }}
            sx={{
              ml: 1,
              p: 0.5,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
    {
      field: "createdAt",
      label: "Created Date",
      renderCell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      field: "updatedAt",
      label: "Status Updated",
      renderCell: (row) =>
        row.updatedAt
          ? new Date(row.updatedAt).toLocaleString()
          : "Not updated",
    },
    {
      field: "paymentStatus",
      label: "Status",
      renderCell: (row) => {
        let color, icon, label;
        switch (row.status) {
          case "completed":
            color = "success";
            icon = <CheckCircleIcon fontSize="small" />;
            label = "Completed";
            break;
          case "rejected":
            color = "error";
            icon = <CancelIcon fontSize="small" />;
            label = "Rejected";
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Chip
              size="small"
              color={color}
              icon={icon}
              label={label}
              variant="outlined"
            />
            {row.status === "rejected" && row.reason && (
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  viewRejectionReason(row.reason);
                }}
                title="View Rejection Reason"
              >
                <InfoIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        );
      },
    },
    {
      field: "paymentMethod",
      label: "Payment Method",
      align: "center",
      renderCell: (row) => (
        <Typography variant="body2" fontWeight="normal">
          {row.paymentMethod}
        </Typography>
      ),
    },
    {
      field: "actions",
      label: `${Array.isArray(User?.roles) && User.roles.includes("Admin") ? "Actions" : ""}`,
      align: "center",
      renderCell: (row) => {
        const roles = Array.isArray(User?.roles) ? User.roles : [];
        if (
          roles.includes("Admin") &&
          !["completed", "rejected", "failed"].includes(row.status)
        ) {
          return (
            <ButtonGroup size="small" variant="outlined">
              <Button
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(row._id, "pending", row.amount);
                }}
                disabled={updateLoading || row.status === "pending"}
              >
                Pending
              </Button>
              <Button
                color="success"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(row._id, "completed", row.amount);
                }}
                disabled={updateLoading}
              >
                Complete
              </Button>
              <Button
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  openRejectionModal(row);
                }}
                disabled={updateLoading}
              >
                Reject
              </Button>
            </ButtonGroup>
          );
        }
        return null;
      },
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <ToastContainer />
      <DataTable
        title="Payouts History"
        data={filteredHistory}
        columns={columns}
        loading={loading || updateLoading}
        searchPlaceholder="Search withdrawals..."
        emptyMessage="No withdrawal history found"
        actionButtons={
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="body2">Filter:</Typography>
            <Select
              size="small"
              value={statusFilter}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
            </Select>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={fetchWithdrawHistory}
              disabled={loading || updateLoading}
              startIcon={<RefreshIcon />}
            >
              Refresh
            </Button>
          </Box>
        }
      />

      {/* Rejection Reason Modal */}
      <Dialog
        open={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        fullWidth
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
        maxWidth="sm"
      >
        <DialogTitle>Reject Withdrawal</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this withdrawal request:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRejectionModalOpen(false)}
            color="inherit"
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectionSubmit}
            color="error"
            variant="contained"
            disabled={!rejectionReason.trim() || updateLoading}
          >
            Reject Withdrawal
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Rejection Reason Dialog */}
      <Dialog
        open={rejectionInfoDialogOpen}
        onClose={() => setRejectionInfoDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rejection Reason</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ py: 2 }}>
            {selectedRejectionReason}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setRejectionInfoDialogOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
