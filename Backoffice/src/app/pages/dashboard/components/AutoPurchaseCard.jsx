import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Grid,
  Paper,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { postRequest } from "../../../../backendServices/ApiCalls";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import { HelpOutline, WarningAmberRounded } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";

export default function AutoPurchaseCard() {
  const { User, setUser } = useAuth();

  // Auto Purchase states
  const [autoPurchaseEnabled, setAutoPurchaseEnabled] = useState(
    User?.autoPurchaseEnabled || false
  );
  const [autoIsLoading, setAutoIsLoading] = useState(false);
  const [autoConfirmDialogOpen, setAutoConfirmDialogOpen] = useState(false);
  const [autoPendingState, setAutoPendingState] = useState(false);

  // Mix Purchase states
  const [mixPurchaseEnabled, setMixPurchaseEnabled] = useState(
    User?.mixPurchase || false
  );
  const [mixIsLoading, setMixIsLoading] = useState(false);
  const [mixConfirmDialogOpen, setMixConfirmDialogOpen] = useState(false);
  const [mixPendingState, setMixPendingState] = useState(false);

  useEffect(() => {
    setAutoPurchaseEnabled(User?.autoPurchaseEnabled || false);
    setMixPurchaseEnabled(User?.mixPurchase || false);
  }, [User]);

  const totalWallet =
    (User?.walletBalance || 0) + (User?.commissionLocked || 0);
  const isSufficientFunds = totalWallet >= 1;

  // Auto Purchase functions
  const handleAutoToggle = () => {
    setAutoPendingState(!autoPurchaseEnabled);
    setAutoConfirmDialogOpen(true);
  };

  const handleConfirmedAutoToggle = () => {
    setAutoConfirmDialogOpen(false);
    setAutoIsLoading(true);
    const newState = autoPendingState;
    setAutoPurchaseEnabled(newState);

    postRequest(
      "/toggleAutoPurchase",
      {},
      (response) => {
        setAutoIsLoading(false);
        if (response.data?.autoPurchaseEnabled !== undefined) {
          toast.success(response.data.message);
          setAutoPurchaseEnabled(response.data.autoPurchaseEnabled);
          setUser((prev) => ({
            ...prev,
            autoPurchaseEnabled: response.data.autoPurchaseEnabled,
          }));
        }
      },
      (error) => {
        console.error("Failed to toggle auto purchase:", error);
        setAutoIsLoading(false);
        setAutoPurchaseEnabled(!newState);
      }
    );
  };

  // Mix Purchase functions
  const handleMixToggle = () => {
    setMixPendingState(!mixPurchaseEnabled);
    setMixConfirmDialogOpen(true);
  };

  const handleConfirmedMixToggle = () => {
    setMixConfirmDialogOpen(false);
    setMixIsLoading(true);
    const newState = mixPendingState;
    setMixPurchaseEnabled(newState);

    postRequest(
      "/toggleMixPurchase",
      {},
      (response) => {
        setMixIsLoading(false);
        if (response.data?.mixPurchase !== undefined) {
          toast.success(response.data.message);
          setMixPurchaseEnabled(response.data.mixPurchase);
          setUser((prev) => ({
            ...prev,
            mixPurchase: response.data.mixPurchase,
          }));
        }
      },
      (error) => {
        console.error("Failed to toggle mix purchase:", error);
        setMixIsLoading(false);
        setMixPurchaseEnabled(!newState);
      }
    );
  };

  return (
    <Grid container width={"100%"} spacing={3} sx={{ mt: 4 }}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Main Card Section */}
      <Grid item xs={12} md={12}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,245,245,0.9))",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 12px 40px rgba(31, 38, 135, 0.1)",
            },
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Auto Purchase Section */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 2,
                borderRadius: 2,
                background: "rgba(240, 242, 245, 0.5)",
                transition: "background 0.3s ease",
                "&:hover": {
                  background: "rgba(240, 242, 245, 0.8)",
                },
              }}
            >
              <Box display="flex" alignItems="center">
                <AutorenewIcon
                  sx={{
                    color: "primary.main",
                    mr: 1.5,
                    fontSize: 28,
                    transform: "rotate(0deg)",
                    animation: autoPurchaseEnabled
                      ? "spin 4s linear infinite"
                      : "none",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                />
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Auto Purchase
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Chip
                  label={autoPurchaseEnabled ? "ACTIVE" : "INACTIVE"}
                  color={autoPurchaseEnabled ? "success" : "default"}
                  size="medium"
                  sx={{
                    mr: 3,
                    fontWeight: "bold",
                    letterSpacing: 0.5,
                    boxShadow: autoPurchaseEnabled
                      ? "0 2px 8px rgba(76, 175, 80, 0.3)"
                      : "none",
                  }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoPurchaseEnabled}
                      onChange={handleAutoToggle}
                      color="primary"
                      disabled={autoIsLoading}
                      sx={{
                        "& .MuiSwitch-track": {
                          backgroundColor: autoPurchaseEnabled
                            ? "primary.main"
                            : "grey.400",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight="medium">
                      {autoPurchaseEnabled ? "Enabled" : "Disabled"}
                    </Typography>
                  }
                />
              </Box>
            </Box>

            {!isSufficientFunds && autoPurchaseEnabled && (
              <Alert
                severity="warning"
                sx={{
                  mt: 2,
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(255, 152, 0, 0.1)",
                  borderLeft: "4px solid #ff9800",
                }}
                icon={<WarningAmberRounded />}
              >
                <Typography fontWeight="medium">
                  Low funds for auto purchase
                </Typography>
              </Alert>
            )}

            {/* Quick Info Panel - Moved under Auto Purchase */}
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, rgba(247,249,252,0.9), rgba(240,242,245,0.9))",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                boxShadow: "0 8px 32px rgba(31, 38, 135, 0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 12px 40px rgba(31, 38, 135, 0.1)",
                },
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <HelpOutline
                  color="primary"
                  sx={{
                    fontSize: 24,
                    mr: 1.5,
                    background: "rgba(25, 118, 210, 0.1)",
                    borderRadius: "50%",
                    p: 0.5,
                  }}
                />
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Quick Info
                </Typography>
              </Box>

              <Box sx={{ overflowY: "auto", maxHeight: 200, pr: 1 }}>
                <Typography
                  variant="body2"
                  component="div"
                  color="text.primary"
                  paragraph
                >
                  <Box component="span" fontWeight="bold" color="primary.main">
                    Auto Purchase:
                  </Box>{" "}
                  When enabled, 1 ticket is automatically purchased before 5's
                  multiple dates (the date you joined). The value is deducted
                  from your locked wallet. If you sponsor an active member
                  (meaning they buy a ticket), your money is refunded back to
                  your locked wallet. This ensures you remain active and
                  eligible for commissions.
                </Typography>

                <Box
                  sx={{
                    background: "rgba(0, 0, 0, 0.02)",
                    p: 1.5,
                    borderRadius: 2,
                    borderLeft: "3px solid rgba(25, 118, 210, 0.3)",
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                  >
                    <Box component="span" fontWeight="bold">
                      Disabled:
                    </Box>{" "}
                    Manual purchase required
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                    mt={1}
                  >
                    <Box component="span" fontWeight="bold">
                      Wallet cap:
                    </Box>{" "}
                    500 Lux max
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Divider
              sx={{
                my: 3,
                borderColor: "divider",
                borderBottomWidth: 1,
                opacity: 0.5,
              }}
            />

            {/* Mix Purchase Section */}
            {/* <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: 2,
            borderRadius: 2,
            background: 'rgba(240, 242, 245, 0.5)',
            transition: 'background 0.3s ease',
            '&:hover': {
              background: 'rgba(240, 242, 245, 0.8)'
            }
          }}
        >
          <Box display="flex" alignItems="center">
            <ShuffleIcon 
              sx={{ 
                color: 'secondary.main', 
                mr: 1.5,
                fontSize: 28 
              }} 
            />
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Mix Purchase
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Chip
              label={mixPurchaseEnabled ? "ACTIVE" : "INACTIVE"}
              color={mixPurchaseEnabled ? "success" : "default"}
              size="medium"
              sx={{ 
                mr: 3,
                fontWeight: 'bold',
                letterSpacing: 0.5,
                boxShadow: mixPurchaseEnabled ? '0 2px 8px rgba(76, 175, 80, 0.3)' : 'none'
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={mixPurchaseEnabled}
                  onChange={handleMixToggle}
                  color="secondary"
                  disabled={mixIsLoading}
                  sx={{
                    '& .MuiSwitch-track': {
                      backgroundColor: mixPurchaseEnabled ? 'secondary.main' : 'grey.400'
                    }
                  }}
                />
              }
              label={
                <Typography variant="body2" fontWeight="medium">
                  {mixPurchaseEnabled ? "Enabled" : "Disabled"}
                </Typography>
              }
            />
          </Box>
        </Box> */}

            {!isSufficientFunds && mixPurchaseEnabled && (
              <Alert
                severity="warning"
                sx={{
                  mt: 2,
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(255, 152, 0, 0.1)",
                  borderLeft: "4px solid #ff9800",
                }}
                icon={<WarningAmberRounded />}
              >
                <Typography fontWeight="medium">
                  Low funds for mix purchase
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Empty Grid Item to maintain layout (can be removed if not needed) */}
      <Grid item xs={12} md={4}>
        {/* This space can be used for additional content if needed */}
      </Grid>

      {/* Auto Purchase Confirmation Dialog */}
      <Dialog
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,1), rgba(245,245,245,1))",
            overflow: "hidden",
            maxWidth: "450px",
            width: "100%",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          },
        }}
        open={autoConfirmDialogOpen}
        onClose={() => setAutoConfirmDialogOpen(false)}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(to right, #1976d2, #2196f3)",
            color: "white",
            fontWeight: "bold",
            py: 2,
          }}
        >
          Confirm Auto Purchase
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <AutorenewIcon
              sx={{ mr: 1.5, color: "primary.main", fontSize: 30 }}
            />
            <Typography variant="body1">
              Are you sure you want to {autoPendingState ? "enable" : "disable"}{" "}
              auto purchase?
            </Typography>
          </Box>
          {autoPendingState && (
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              Enabling will automatically purchase tickets as described above.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setAutoConfirmDialogOpen(false)}
            variant="outlined"
            color="inherit"
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmedAutoToggle}
            variant="contained"
            color="primary"
            autoFocus
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mix Purchase Confirmation Dialog */}
      <Dialog
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,1), rgba(245,245,245,1))",
            overflow: "hidden",
            maxWidth: "450px",
            width: "100%",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          },
        }}
        open={mixConfirmDialogOpen}
        onClose={() => setMixConfirmDialogOpen(false)}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(to right, #9c27b0, #ba68c8)",
            color: "white",
            fontWeight: "bold",
            py: 2,
          }}
        >
          Confirm Mix Purchase
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <ShuffleIcon
              sx={{ mr: 1.5, color: "secondary.main", fontSize: 30 }}
            />
            <Typography variant="body1">
              Are you sure you want to {mixPendingState ? "enable" : "disable"}{" "}
              mix purchase?
            </Typography>
          </Box>
          {mixPendingState && (
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              Enabling will automatically mix your purchases as described above.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setMixConfirmDialogOpen(false)}
            variant="outlined"
            color="inherit"
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmedMixToggle}
            variant="contained"
            color="secondary"
            autoFocus
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(156, 39, 176, 0.2)",
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
