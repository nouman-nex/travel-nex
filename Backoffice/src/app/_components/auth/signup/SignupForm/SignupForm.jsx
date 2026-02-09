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
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../../../../../backendServices/ApiCalls";

// Updated validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  phone: Yup.string().optional(),
});

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);

      try {
        const { confirmPassword, ...dataToSend } = values;

        const response = await api.post("/v1/auth/register", dataToSend);

        if (response.data?.success) {
          localStorage.setItem("token", response.data.data.token);
          setUser(response.data.data.user);
          setIsAuthenticated(true);
          toast.success("You have been Registered");
          navigate("/");
        } else {
          toast.error(response.data?.error || "Signup failed!");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Signup failed! Please try again.",
        );
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  // Check if form is valid
  const isFormDisabled = formik.isSubmitting || loading;

  return (
    <>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" textAlign="center" mb={3}>
          Create Your Account
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={1}>
            <TextField
              name="name"
              label="Full Name"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

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

            <TextField
              name="phone"
              label="Phone (Optional)"
              fullWidth
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />

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
                background: "linear-gradient(to right, #7DD3FC, #0EA5E9)",
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
