import React, { useEffect, useState } from "react";
import useNotify from "@app/_components/Notification/useNotify";
import {
  Paper,
  Button,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Tooltip,
  TablePagination,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
  AccountBalance as WithdrawIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Div } from "@jumbo/shared";
import { postRequest } from "../../../../backendServices/ApiCalls";

function ManageWithdraws() {
  const notify = useNotify();
  const navigate = useNavigate();
  const { User } = useAuth();
  const [loading, setLoading] = useState(true);
  const [withdraws, setWithdraws] = useState([]);
  const [filteredWithdraws, setFilteredWithdraws] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState(null);
  const [actionType, setActionType] = useState(""); // 'approve', 'reject' or 'delete'
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [authChecked, setAuthChecked] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [tabValue, setTabValue] = useState(1); // Default to pending tab

  // Authentication check
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
        fetchWithdraws();
      } else if (isMiniAdmin) {
        if (!allowedRoutes.includes(currentPath)) {
          if (allowedRoutes.length > 0) {
            navigate(allowedRoutes[0]);
          } else {
            navigate("/");
          }
        } else {
          setAuthChecked(true);
          fetchWithdraws();
        }
      } else {
        navigate("/");
      }
    }
  }, [User, navigate]);

  // Fetch Withdrawals
  const fetchWithdraws = () => {
    setLoading(true);
    postRequest(
      "/getWithdrawRequests",
      {},
      (response) => {
        console.log("🚀 ~ fetchWithdraws ~ response:", response);
        if (response.data.success) {
          const withdrawsData = response.data.data || [];
          const withdrawsWithCounter = withdrawsData.map((withdraw, index) => ({
            ...withdraw,
            counter: index + 1,
          }));
          setWithdraws(withdrawsWithCounter);
          setFilteredWithdraws(
            withdrawsWithCounter.filter((w) => w.status === "pending")
          );
        } else {
          notify("Failed to fetch withdrawals", "error");
        }
        setLoading(false);
      },
      (error) => {
        notify("Something went wrong while fetching data", "error");
        setLoading(false);
      }
    );
  };

  // Filter withdrawals based on status
  useEffect(() => {
    if (selectedStatus === "all") {
      setFilteredWithdraws(withdraws);
    } else {
      setFilteredWithdraws(
        withdraws.filter((withdraw) => withdraw.status === selectedStatus)
      );
    }
    setPage(0); // Reset page when filter changes
  }, [selectedStatus, withdraws]);

  // Handle status change
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const statusMap = ["all", "pending", "approved", "rejected"];
    setSelectedStatus(statusMap[newValue]);
  };

  // Handle Approve/Reject Withdrawal
  const handleWithdrawAction = () => {
    const updateData = {
      withdrawalId: selectedWithdraw._id,
      status: actionType,
    };

    postRequest(
      "/updateWithdrawStatus",
      updateData,
      (response) => {
        if (response.data.success) {
          notify(`Withdrawal ${actionType} successfully`, "success");
          setOpenActionDialog(false);
          setSelectedWithdraw(null);
          setActionType("");
          fetchWithdraws();
        } else {
          notify(
            response.data.message || `Failed to ${actionType} withdrawal`,
            "error"
          );
        }
      },
      (error) => {
        notify("Something went wrong", "error");
      }
    );
  };

  const handleDeleteWithdrawal = () => {
    postRequest(
      "/deleteWithdraw",
      { withdrawalId: selectedWithdraw._id },
      (response) => {
        if (response.data.success) {
          notify("Withdrawal deleted successfully", "success");
          setOpenActionDialog(false);
          setSelectedWithdraw(null);
          fetchWithdraws();
        } else {
          notify(
            response.data.message || "Failed to delete withdrawal",
            "error"
          );
        }
      },
      (error) => {
        notify("Something went wrong while deleting", "error");
      }
    );
  };

  // Handle View Click
  const handleViewClick = (withdraw) => {
    setSelectedWithdraw(withdraw);
    setOpenViewDialog(true);
  };

  // Handle Action Click
  const handleActionClick = (withdraw, action) => {
    setSelectedWithdraw(withdraw);
    setActionType(action);
    setOpenActionDialog(true);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  // Get counts for each status
  const getCounts = () => {
    return {
      all: withdraws.length,
      pending: withdraws.filter((w) => w.status === "pending").length,
      approved: withdraws.filter((w) => w.status === "approved").length,
      rejected: withdraws.filter((w) => w.status === "rejected").length,
    };
  };

  const counts = getCounts();

  if (!authChecked || loading) {
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

  return (
    <Container maxWidth="xl">
      <Div sx={{ borderBottom: 2, borderColor: "divider", py: 1, mb: 3 }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Div sx={{ display: { xs: "none", lg: "block" } }}>
            <Typography variant="h3" sx={{ my: 1 }}>
              Manage Withdrawals
            </Typography>
          </Div>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              label="Filter by Status"
            >
              <MenuItem value="all">All ({counts.all})</MenuItem>
              <MenuItem value="pending">Pending ({counts.pending})</MenuItem>
              <MenuItem value="approved">Approved ({counts.approved})</MenuItem>
              <MenuItem value="rejected">Rejected ({counts.rejected})</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Div>

      <Card>
        <CardContent>
          {/* Status Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={`All (${counts.all})`} />
              <Tab label={`Pending (${counts.pending})`} />
              <Tab label={`Approved (${counts.approved})`} />
              <Tab label={`Rejected (${counts.rejected})`} />
            </Tabs>
          </Box>

          <Typography variant="h6" gutterBottom>
            Withdrawal Requests ({filteredWithdraws.length})
          </Typography>

          {filteredWithdraws.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
              }}
            >
              <WithdrawIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No Withdrawal Requests Found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedStatus === "all"
                  ? "No withdrawal requests available"
                  : `No ${selectedStatus} withdrawal requests`}
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>UserName</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Fixed_Fee</TableCell>
                      <TableCell>Percentage_Fee</TableCell>
                      <TableCell>Total_Fee</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Payout Address</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created Date</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredWithdraws
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((withdraw) => (
                        <TableRow key={withdraw._id}>
                          <TableCell>
                            <Typography variant="body2" >
                              {withdraw.counter}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {withdraw.username || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              
                              
                            >
                              ${withdraw.amount2.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              
                              
                            >
                              ${withdraw.feeInfo.fixedFee}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              
                              
                            >
                              %{withdraw.feeInfo.percentageFee.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              
                              
                            >
                              ${withdraw.feeInfo.totalFees.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                withdraw.paymentMethod?.toUpperCase() || "N/A"
                              }
                              size="small"
                              variant="outlined"
                              color="info"
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title={withdraw.payoutAddress || "N/A"}>
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: 150,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {withdraw.payoutAddress || "N/A"}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                withdraw.status?.charAt(0).toUpperCase() +
                                  withdraw.status?.slice(1) || "N/A"
                              }
                              color={getStatusColor(withdraw.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {withdraw.createdAt
                                ? new Date(
                                    withdraw.createdAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "center",
                              }}
                            >
                              <Tooltip title="View Details">
                                <IconButton
                                  color="info"
                                  onClick={() => handleViewClick(withdraw)}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>

                              {withdraw.status === "pending" ? (
                                <>
                                  <Tooltip title="Approve">
                                    <IconButton
                                      color="success"
                                      onClick={() =>
                                        handleActionClick(withdraw, "approved")
                                      }
                                    >
                                      <ApproveIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Reject">
                                    <IconButton
                                      color="error"
                                      onClick={() =>
                                        handleActionClick(withdraw, "rejected")
                                      }
                                    >
                                      <RejectIcon />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                <Tooltip title="Delete">
                                  <IconButton
                                    color="error"
                                    onClick={() =>
                                      handleActionClick(withdraw, "delete")
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredWithdraws.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog
        open={openActionDialog}
        onClose={() => setOpenActionDialog(false)}
      >
        <DialogTitle>
          {actionType === "approved"
            ? "Approve"
            : actionType === "rejected"
              ? "Reject"
              : "Delete"}{" "}
          Withdrawal
        </DialogTitle>
        <DialogContent>
          <Typography>
            {actionType === "delete"
              ? `Are you sure you want to delete this withdrawal request of $${selectedWithdraw?.amount2}?`
              : `Are you sure you want to ${actionType} this withdrawal request of $${selectedWithdraw?.amount2} for User ID "${selectedWithdraw?.username}"?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenActionDialog(false)}>Cancel</Button>
          <Button
            onClick={
              actionType === "delete"
                ? handleDeleteWithdrawal
                : handleWithdrawAction
            }
            color={
              actionType === "approved"
                ? "success"
                : actionType === "rejected"
                  ? "error"
                  : "error"
            }
            variant="contained"
          >
            {actionType === "approved"
              ? "Approve"
              : actionType === "rejected"
                ? "Reject"
                : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Withdrawal Details</DialogTitle>
        <DialogContent>
          {selectedWithdraw && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor:
                        getStatusColor(selectedWithdraw.status) + ".main",
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <WithdrawIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h6">
                    Withdrawal #{selectedWithdraw.counter}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    User ID:
                  </Typography>
                  <Typography variant="body1">
                    {selectedWithdraw.username || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Amount:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    ${selectedWithdraw.amount2}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Payment Method:
                  </Typography>
                  <Typography variant="body1">
                    {selectedWithdraw.paymentMethod?.toUpperCase() || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Status:
                  </Typography>
                  <Chip
                    label={
                      selectedWithdraw.status?.charAt(0).toUpperCase() +
                        selectedWithdraw.status?.slice(1) || "N/A"
                    }
                    color={getStatusColor(selectedWithdraw.status)}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Payout Address:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      wordBreak: "break-all",
                      bgcolor: "grey.100",
                      p: 1,
                      borderRadius: 1,
                      fontFamily: "monospace",
                    }}
                  >
                    {selectedWithdraw.payoutAddress || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Created Date:
                  </Typography>
                  <Typography variant="body1">
                    {selectedWithdraw.createdAt
                      ? new Date(selectedWithdraw.createdAt).toLocaleString()
                      : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Updated Date:
                  </Typography>
                  <Typography variant="body1">
                    {selectedWithdraw.updatedAt
                      ? new Date(selectedWithdraw.updatedAt).toLocaleString()
                      : "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          {selectedWithdraw?.status === "pending" ? (
            <>
              <Button
                onClick={() => {
                  setOpenViewDialog(false);
                  handleActionClick(selectedWithdraw, "approved");
                }}
                color="success"
                variant="contained"
                startIcon={<ApproveIcon />}
              >
                Approve
              </Button>
              <Button
                onClick={() => {
                  setOpenViewDialog(false);
                  handleActionClick(selectedWithdraw, "rejected");
                }}
                color="error"
                variant="contained"
                startIcon={<RejectIcon />}
              >
                Reject
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setOpenViewDialog(false);
                handleActionClick(selectedWithdraw, "delete");
              }}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ManageWithdraws;
