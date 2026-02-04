import React, { useState } from "react";
import { useFormik } from "formik";
import {
  Stack,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as Yup from "yup";

import { postRequest } from "../../../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

// Updated validation schema with confirm password
const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true);
      const { confirmPassword, ...dataToSend } = values;
      const finalData = { ...dataToSend, ref: referralCode };

      postRequest(
        "/register",
        finalData,
        (response) => {
          setUser(response.data.user);
          setLoading(false);
          setSubmitting(false);
          if (response.data?.status === "success") {
            localStorage.setItem("token", response.data.token);
            setIsAuthenticated(true);
            toast.success("You have been Registered");
          } else {
            toast.error(response.data?.message || "Signup failed!");
          }
        },
        (error) => {
          setLoading(false);
          setSubmitting(false);
          toast.error(
            error.response?.data?.message || "Signup failed! Please try again."
          );
        }
      );
    },
  });

  // Check if referral code is available and form is valid
  const isFormDisabled = !referralCode || formik.isSubmitting || loading;

  return (
    <>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" textAlign="center" mb={3}>
          Create Your Account
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={1}>
            {/* Referral Code */}
            <TextField
              name="ref"
              label="Referral Code"
              fullWidth
              disabled
              value={referralCode || ""}
              sx={{ pl: 0.5 }}
              error={!referralCode}
              helperText={!referralCode ? "Referral code is required" : ""}
            />

            <Grid container spacing={0.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  label="First Name"
                  fullWidth
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
            </Grid>

            <Grid container spacing={0.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="username"
                  label="Username"
                  fullWidth
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
            </Grid>

            <TextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              sx={{ pl: 0.5 }}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              sx={{ pl: 0.5 }}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                boxShadow: "none",
                pt: 1,
                px: 3,
                color: "white",
                background: "linear-gradient(to right, #AC9B6D, #6A5637)",
                "&:hover": {
                  background: "linear-gradient(to right, #BFA670, #7A5F3A)",
                },
                "&:disabled": {
                  background: "#ccc",
                  color: "#666",
                },
              }}
              disabled={isFormDisabled}
            >
              {formik.isSubmitting || loading ? (
                <CircularProgress size={24} />
              ) : !referralCode ? (
                "Referral Code Required"
              ) : (
                "Signup"
              )}
            </Button>
          </Stack>
        </form>
      </Box>

      <ToastContainer />
    </>
  );
};

export { SignupForm };
