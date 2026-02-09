import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import useNotify from "@app/_components/Notification/useNotify";
import { postRequest } from "../../../../backendServices/ApiCalls";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const otpSchema = Yup.object({
  otp: Yup.string()
    .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const ForgotForm = () => {
  const notify = useNotify();
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [email, setEmail] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [showAccountSelection, setShowAccountSelection] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    postRequest(
      "/forgot-password-email",
      { email: values.email },
      (response) => {
        if (response?.status === 200) {
          notify(response?.data?.message, "success");
          setEmail(response?.data?.email);
          resetForm();
          setOpenModal(true);
          setIsSubmitting(false);
        }
        setIsSubmitting(false);
      },
      (error) => {
        console.error("Error:", error);
        notify(
          error?.response?.data?.message || "Something went wrong.",
          "error",
        );
        setIsSubmitting(false);
      },
    );
  };

  const handleOtpChange = (e, index) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    let newOtp = otpValue.split("");
    if (value) {
      newOtp[index] = value;
      setOtpValue(newOtp.join(""));
      if (index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      let newOtp = otpValue.split("");
      if (!newOtp[index]) {
        if (index > 0) {
          document.getElementById(`otp-${index - 1}`).focus();
        }
      } else {
        newOtp[index] = "";
        setOtpValue(newOtp.join(""));
      }
    }
  };

  const handleOtpPaste = (e) => {
    let pasteData = e.clipboardData
      .getData("text")
      .slice(0, 6)
      .replace(/[^0-9]/g, "");
    setOtpValue(pasteData.padEnd(6, " "));

    setTimeout(() => {
      document.getElementById(`otp-${Math.min(pasteData.length, 5)}`).focus();
    }, 10);
  };

  const handleOtpSubmit = () => {
    if (!otpValue.trim() || otpValue.trim().length !== 6) {
      return notify("Please enter a valid 6-digit OTP", "error");
    }
    setIsOtpSubmitting(true);
    postRequest(
      "/verify-forgot-otp",
      { email: email, otpCode: otpValue.trim() },
      (response) => {
        if (response?.status === 200) {
          console.log(response);
          notify(response?.data?.message, "success");
          if (response?.data?.accounts?.length > 0) {
            // Multiple accounts found, show selection
            setAccounts(response?.data?.accounts);
            setShowAccountSelection(true);
          } else if (response?.data?.accounts?.length === 1) {
            // Single account, proceed directly
            handleAccountSelection(response?.data?.accounts[0]);
          }
          setIsOtpSubmitting(false);
        }
        setIsOtpSubmitting(false);
      },
      (error) => {
        console.error("Error:", error);
        setIsOtpSubmitting(false);
        if (error?.response?.status === 400) {
          notify(
            error?.response?.data?.message || "Invalid OTP or email.",
            "error",
          );
        } else if (error?.response?.status === 500) {
          notify("Server error. Please try again later.", "error");
        } else {
          notify(
            "Something went wrong. Please check your connection.",
            "error",
          );
        }
      },
    );
  };

  const handleAccountSelection = (account) => {
    setSelectedAccount(account);
    setIsOtpSubmitting(true);

    postRequest(
      "/generateLinkTokenForUser",
      {
        userId: account.id,
        email: email,
        otpCode: otpValue.trim(),
      },
      (response) => {
        if (response?.status === 200) {
          notify(response?.data?.message, "success");
          setOpenModal(false);
          const linkToken = response?.data?.linkToken;
          if (linkToken) {
            navigate(`/auth/forgot-password-change?linkToken=${linkToken}`);
          } else {
            notify("Magic link is missing. Please try again.", "error");
          }
          setIsOtpSubmitting(false);
        }
        setIsOtpSubmitting(false);
      },
      (error) => {
        console.error("Error:", error);
        setIsOtpSubmitting(false);
        notify("Something went wrong. Please try again.", "error");
      },
    );
  };

  return (
    <>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, touched, errors }) => (
          <Form>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Enter Your Email"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.email && errors.email}
                  error={touched.email && Boolean(errors.email)}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            p: 4,
            bgcolor: "white",
            width: 450,
            margin: "auto",
            mt: "20vh",
            borderRadius: 2,
            textAlign: "center",
            maxHeight: "60vh",
            overflow: "auto",
          }}
        >
          {!showAccountSelection ? (
            <>
              <h2>Enter OTP</h2>
              <p>A 6-digit OTP has been sent to your email.</p>
              <Grid sx={{ display: "flex", gap: 1, mb: 2 }}>
                {[...Array(6)].map((_, index) => (
                  <TextField
                    key={index}
                    id={`otp-${index}`}
                    variant="outlined"
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: "center", fontSize: "20px" },
                    }}
                    value={otpValue[index] || ""}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    onPaste={handleOtpPaste}
                  />
                ))}
              </Grid>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  boxShadow: "none",
                  pt: 1,
                  px: 3,
                  color: "white",
                  background: "linear-gradient(to right, #7DD3FC, #0EA5E9)",
                  "&:hover": {
                    background: "linear-gradient(to right, #BFA670, #7A5F3A)",
                  },
                }}
                onClick={handleOtpSubmit}
                disabled={isOtpSubmitting}
              >
                {isOtpSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </>
          ) : (
            <>
              <h2>Select Account</h2>
              <p>
                Multiple accounts found. Please select which account's password
                you want to reset:
              </p>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {accounts.map((account) => (
                  <Grid item xs={12} key={account.id}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleAccountSelection(account)}
                      disabled={isOtpSubmitting}
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        textTransform: "none",
                      }}
                    >
                      <Box sx={{ textAlign: "left" }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {account.username}
                        </Typography>
                        {(account.firstName || account.lastName) && (
                          <Typography variant="body2" color="text.secondary">
                            {account.firstName} {account.lastName}
                          </Typography>
                        )}
                      </Box>
                    </Button>
                  </Grid>
                ))}
              </Grid>
              {isOtpSubmitting && (
                <Box sx={{ mt: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              )}
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ForgotForm;
