import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

export default function Withdraw() {
  const { User, setUser } = useAuth();
  const balance = User?.commissionWithdrawable.toFixed(2) || 0;
  const isKycVerified = User?.isKycVerified === true;
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run logic if User is defined (i.e. data has loaded)
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isAdmin = roles.includes("Admin");

      if (isAdmin) {
        navigate("/dashboard");
      }
    }
  }, [User, navigate]);

  const formik = useFormik({
    initialValues: {
      amount: "",
      paymentMethod: "",
      payoutAddress: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Amount is required")
        .max(balance, `Amount cannot exceed available balance (${balance})`)
        .positive("Amount must be positive"),
      paymentMethod: Yup.string().required("Payment method is required"),
      payoutAddress: Yup.string().required("Payout address is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
      postRequest(
        "/withdraw",
        values,
        (response) => {
          if (response?.data?.success) {
            resetForm();
            notify(response?.data?.message, "success");

            const amount = response?.data?.data?.amount2; // full withdrawal amount

            setUser((prevUser) => ({
              ...prevUser,
              walletBalance: prevUser.walletBalance - amount,
              commissionEarned: prevUser.commissionEarned - amount,
              commissionWithdrawable: prevUser.commissionWithdrawable - amount,
            }));
          } else {
            notify(response?.data?.message || "Something went wrong", "error");
          }
          setLoading(false);
        },
        (error) => {
          console.error("Withdrawal error:", error);
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong. Please try again.";
          notify(message, "error");
          setLoading(false);
        }
      );
    },
  });

  // If KYC is not verified, show the locked version
  if (!isKycVerified) {
    return <LockedWithdrawForm />;
  }

  // Regular withdraw form when KYC is verified
  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        mt: 5,
        p: 3,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" mb={2} textAlign="center">
        Request Withdrawal
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
        <VerifiedUserIcon color="success" sx={{ mr: 1 }} />
        <Typography variant="body2" color="success.main">
          KYC Verified
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          label="Your Balance"
          value={`$${balance}`}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          label="Enter Payout Amount"
          name="amount"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          margin="normal"
          type="number"
          error={formik.touched.amount && Boolean(formik.errors.amount)}
          helperText={formik.touched.amount && formik.errors.amount}
        />

        <TextField
          select
          label="Payout Method"
          name="paymentMethod"
          value={formik.values.paymentMethod}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          margin="normal"
          error={
            formik.touched.paymentMethod && Boolean(formik.errors.paymentMethod)
          }
          helperText={
            formik.touched.paymentMethod && formik.errors.paymentMethod
          }
        >
          <MenuItem value="USDT">USDT</MenuItem>
          <MenuItem value="USDC">USDC</MenuItem>
        </TextField>

        <TextField
          label="Payout Address"
          name="payoutAddress"
          value={formik.values.payoutAddress}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          margin="normal"
          error={
            formik.touched.payoutAddress && Boolean(formik.errors.payoutAddress)
          }
          helperText={
            formik.touched.payoutAddress && formik.errors.payoutAddress
          }
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit Request"
          )}
        </Button>

        <Typography
          variant="body2"
          mt={2}
          color="textSecondary"
          textAlign="center"
        >
          Please allow up to 72 HOURS for withdrawal request to be processed.
        </Typography>
      </form>
    </Box>
  );
}

// Locked version of the withdraw form when KYC is not verified
function LockedWithdrawForm() {
  const navigate = useNavigate();

  const handleGoToKyc = () => {
    // Navigate to KYC verification page - update this path as needed
    navigate("/dashboard/applykyc");
  };

  return (
    <Paper
      sx={{
        maxWidth: 400,
        margin: "auto",
        mt: 5,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.paper",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 3,
        }}
      >
        <LockIcon
          sx={{ fontSize: 56, color: "text.secondary", mb: 2, opacity: 0.7 }}
        />
        <Typography variant="h5" textAlign="center" color="text.primary" mb={1}>
          Withdrawal Locked
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          mb={3}
        >
          Complete KYC verification to access withdrawal features
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Blurred/locked form fields */}
      <Box sx={{ opacity: 0.4, pointerEvents: "none", filter: "blur(2px)" }}>
        <TextField
          label="Your Balance"
          value="$0.00"
          fullWidth
          margin="normal"
          disabled
        />

        <TextField
          label="Enter Payout Amount"
          fullWidth
          margin="normal"
          disabled
          type="number"
        />

        <TextField
          select
          label="Payout Method"
          fullWidth
          margin="normal"
          disabled
          value=""
        >
          <MenuItem value="USDT">USDT</MenuItem>
        </TextField>

        <TextField label="Payout Address" fullWidth margin="normal" disabled />
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleGoToKyc}
        startIcon={<VerifiedUserIcon />}
        sx={{
          mt: 3,
          bgcolor: "primary.main",
          "&:hover": {
            bgcolor: "primary.dark",
          },
        }}
      >
        Complete KYC Verification
      </Button>

      <Typography
        variant="body2"
        mt={3}
        color="text.secondary"
        textAlign="center"
      >
        Identity verification is required for all withdrawals to comply with
        regulatory requirements.
      </Typography>
    </Paper>
  );
}
