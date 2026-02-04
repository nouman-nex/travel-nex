import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

// MUI Icons
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import {
  MEDIA_BASE_URL,
  postRequest,
} from "../../../../backendServices/ApiCalls";
import DataTable from "@app/_components/table/table";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import useNotify from "@app/_components/Notification/useNotify";

export default function RejectedKYCs() {
  const { User } = useAuth();
  const navigate = useNavigate();
  const notify = useNotify();

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
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Rejected");

  // Modals
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [rejectionInfoDialogOpen, setRejectionInfoDialogOpen] = useState(false);
  const [selectedRejectionReason, setSelectedRejectionReason] = useState("");

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = () => {
    setLoading(true);
    const params = statusFilter !== "All" ? { status: statusFilter } : {};

    postRequest(
      "/getPendingKyc",
      params,
      (response) => {
        setApplications(response.data.data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching KYC applications:", error);
        setLoading(false);
      }
    );
  };

  const handleApprove = (userId) => {
    postRequest(
      "/approveKyc",
      { userId },
      () => {
        notify("KYC approved successfully", "success");
        fetchApplications();
      },
      () => notify("Failed to approve KYC", "error")
    );
  };

  const openRejectionDialog = (userId) => {
    setSelectedUserId(userId);
    setRejectionDialogOpen(true);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      notify("Please provide a reason for rejection", "warn");
      return;
    }

    postRequest(
      "/rejectKyc",
      { userId: selectedUserId, reason: rejectionReason },
      () => {
        setRejectionDialogOpen(false);
        setRejectionReason("");
        fetchApplications();
      },
      () => notify("Failed to reject KYC", "error")
    );
  };

  const viewDocument = (doc) => {
    setSelectedDocument(doc);
    setDocumentDialogOpen(true);
  };

  const viewRejectionReason = (reason) => {
    setSelectedRejectionReason(reason || "No reason provided");
    setRejectionInfoDialogOpen(true);
  };

  const getImageUrl = (imagePath) => {
    console.log(imagePath);

    if (!imagePath) {
      return "/api/placeholder/400/320";
    }

    // Remove "/uploads" from the beginning if it exists
    const cleanedPath = imagePath.startsWith("/uploads")
      ? imagePath.replace("/uploads", "")
      : imagePath;

    return `${MEDIA_BASE_URL}${cleanedPath}`;
  };

  const columns = [
    {
      field: "user",
      label: "User",
      exportValue: (row) => row?.user?.username,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2">{row?.user?.username}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row?.user?.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: "user.email",
      exportValue: (row) => row?.user?.email,
      hidden: true,
    },
    {
      field: "docType",
      label: "Document Type",
    },
    {
      field: "createdAt",
      label: "Submitted On",
      renderCell: (row) => new Date(row.createdAt).toLocaleDateString(),
      exportValue: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      field: "status",
      label: "Status",
      exportValue: (row) => row.status,
      renderCell: (row) => {
        const statusConfig = {
          Pending: { color: "warning", label: "Pending" },
          Approved: { color: "success", label: "Approved" },
          Rejected: { color: "error", label: "Rejected" },
        };
        const props = statusConfig[row.status] || {
          color: "default",
          label: row.status,
        };

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Chip size="small" {...props} />
            {row.status === "Rejected" && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => viewRejectionReason(row.rejectionReason)}
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
      field: "actions",
      label: "Actions",
      align: "right",
      renderCell: (row) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() =>
              viewDocument({
                frontImageUrl: row.frontImageUrl,
                backImageUrl: row.backImageUrl,
                docType: row.docType,
              })
            }
            title="View Documents"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>

          {row.status === "Pending" && (
            <>
              <IconButton
                size="small"
                color="success"
                onClick={() => handleApprove(row?.user?._id)}
                title="Approve KYC"
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => openRejectionDialog(row?.user?._id)}
                title="Reject KYC"
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  const statusFilterOptions = [{ value: "Rejected", label: "Rejected" }];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        KYC Applications Management
      </Typography>

      <DataTable
        title=""
        data={applications}
        columns={columns}
        loading={loading}
        filterOptions={statusFilterOptions}
        initialFilterValue={statusFilter}
        onFilterChange={setStatusFilter}
        searchPlaceholder="Search by name, email, or document type"
        emptyMessage="No KYC applications found"
        filterLabel="Status"
      />

      {/* Rejection Dialog */}
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
        open={rejectionDialogOpen}
        onClose={() => setRejectionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject KYC Application</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide a reason for rejecting this KYC application.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setRejectionDialogOpen(false);
              setRejectionReason("");
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleReject}>
            Reject KYC
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Rejection Reason Dialog */}
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

      {/* Document View Dialog */}
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
        open={documentDialogOpen}
        onClose={() => setDocumentDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedDocument?.docType} Documents</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {["front", "back"].map((side) => (
              <Grid item xs={12} md={6} key={side}>
                <Typography variant="subtitle2" gutterBottom>
                  {side === "front" ? "Front Side" : "Back Side"}
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    height: 320,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <a
                    href={getImageUrl(selectedDocument?.[`${side}ImageUrl`])}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={getImageUrl(selectedDocument?.[`${side}ImageUrl`])}
                      alt={`${side} document`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                      onError={(e) => {
                        e.target.src = "/api/placeholder/400/320";
                        e.target.alt = "Image not available";
                      }}
                      title="Click to open in new tab"
                    />
                  </a>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setDocumentDialogOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
