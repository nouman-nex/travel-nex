import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Avatar,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  AccountBalance as WithdrawIcon,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { Div } from "@jumbo/shared";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";

const PendingWithdraw = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWithdraw, setSelectedWithdraw] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [tabValue, setTabValue] = useState(1); // Default to pending tab
  const { t } = useTranslation();
  const fetchWithdrawals = () => {
    setIsLoading(true);

    postRequest(
      "/getcurrentuserPandingwithdrawals",
      {},
      (response) => {
        const allWithdrawals = (response?.data?.data || []).map(
          (item, index) => ({ ...item, serial: index + 1 })
        );

        setWithdrawals(allWithdrawals);
        setIsLoading(false);
      },
      (error) => {
        toast.error("Failed to load withdrawals");
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // Filter withdrawals based on status
  useEffect(() => {
    if (selectedStatus === "all") {
      setFilteredWithdrawals(withdrawals);
    } else {
      setFilteredWithdrawals(
        withdrawals.filter((withdraw) => withdraw.status === selectedStatus)
      );
    }
    setPage(0); // Reset page when filter changes
  }, [selectedStatus, withdrawals]);

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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied!");
  };

  // Handle View Click
  const handleViewClick = (withdraw) => {
    setSelectedWithdraw(withdraw);
    setOpenViewDialog(true);
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
      all: withdrawals.length,
      pending: withdrawals.filter((w) => w.status === "pending").length,
      approved: withdrawals.filter((w) => w.status === "approved").length,
      rejected: withdrawals.filter((w) => w.status === "rejected").length,
    };
  };

  const counts = getCounts();

  if (isLoading) {
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
      <Div sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
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
            {t("withdrawalPage.myWithdrawals")}
          </Typography>
        </Box>
        <p className="text-gray-600 text-sm">
          {t("withdrawalPage.description")}
        </p>
      </Div>
      <ToastContainer />

      <Card>
        <CardContent>
          {/* Status Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={`${t("withdrawalPage.all")} (${counts.all})`} />
              <Tab
                label={`${t("withdrawalPage.pending")} (${counts.pending})`}
              />
              <Tab
                label={`${t("withdrawalPage.approved")} (${counts.approved})`}
              />
              <Tab
                label={`${t("withdrawalPage.rejected")} (${counts.rejected})`}
              />
            </Tabs>
          </Box>

          <Typography variant="h6" gutterBottom>
            {t("withdrawalPage.withdrawalRequests")} (
            {filteredWithdrawals.length})
          </Typography>

          {filteredWithdrawals.length === 0 ? (
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
                {t("withdrawalPage.noWithdrawalsFound")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedStatus === "all"
                  ? "No withdrawal requests available"
                  : `No ${selectedStatus}  ${t("withdrawalPage.noWithdrawalsAvailable")}`}
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>{t("withdrawalPage.amount")}</TableCell>
                      <TableCell>{t("withdrawalPage.paymentMethod")}</TableCell>
                      <TableCell>{t("withdrawalPage.payoutAddress")}</TableCell>
                      <TableCell>{t("withdrawalPage.status")}</TableCell>
                      <TableCell>{t("withdrawalPage.createdDate")}</TableCell>
                      <TableCell align="center">
                        {t("withdrawalPage.actions")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredWithdrawals
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((withdraw) => (
                        <TableRow key={withdraw._id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {withdraw.serial}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              ${withdraw.amount}
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
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Tooltip title={withdraw.payoutAddress || "N/A"}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    maxWidth: 160,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {withdraw.payoutAddress || "N/A"}
                                </Typography>
                              </Tooltip>
                              <Tooltip title="Copy Address">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleCopy(withdraw.payoutAddress)
                                  }
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
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
                            <Tooltip title="View Details">
                              <IconButton
                                color="info"
                                onClick={() => handleViewClick(withdraw)}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredWithdrawals.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t("withdrawalPage.withdrawalDetails")}</DialogTitle>
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
                    {t("withdrawalPage.withdrawalNumber")} #
                    {selectedWithdraw.serial}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    {t("withdrawalPage.amount")}:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    ${selectedWithdraw.amount}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    {t("withdrawalPage.paymentMethod")}:
                  </Typography>
                  <Typography variant="body1">
                    {selectedWithdraw.paymentMethod?.toUpperCase() || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    {t("withdrawalPage.status")}
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

                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    {t("withdrawalPage.createdDate")}
                  </Typography>
                  <Typography variant="body1">
                    {selectedWithdraw.createdAt
                      ? new Date(selectedWithdraw.createdAt).toLocaleString()
                      : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    {t("withdrawalPage.payoutAddress")}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        wordBreak: "break-all",
                        bgcolor: "grey.100",
                        p: 1,
                        borderRadius: 1,
                        fontFamily: "monospace",
                        flex: 1,
                      }}
                    >
                      {selectedWithdraw.payoutAddress || "N/A"}
                    </Typography>
                    <Tooltip title="Copy Address">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleCopy(selectedWithdraw.payoutAddress)
                        }
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>

                {selectedWithdraw.updatedAt && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      {t("withdrawalPage.updatedDate")}
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedWithdraw.updatedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PendingWithdraw;
