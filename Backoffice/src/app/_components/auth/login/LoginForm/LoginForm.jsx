import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  FormGroup,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Link, useNavigate } from "react-router-dom";
import useNotify from "@app/_components/Notification/useNotify";

const validationSchema = Yup.object({
  identifier: Yup.string()
    .required("Email is required")
    .test(
      "is-email-or-username",
      "Must be a valid email or username",
      (value) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const isUsername = /^[a-zA-Z0-9_-]+$/.test(value);
        return isEmail || isUsername;
      },
    ),
  password: Yup.string().required("Password is required"),
});

const LoginForm = () => {
  const notify = useNotify();
  const navigate = useNavigate();
  const { loading, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values) => {
    try {
      const response = await login({
        email: values.identifier,
        password: values.password,
      });

      if (response?.token) {
        notify("Login successful", "success");
        navigate("/");
      } else {
        // If no token returned, show error
        notify("Invalid email or password", "error");
      }
    } catch (error) {
      // Show the error message from server
      const errorMsg = error?.message || "Login failed";
      notify(errorMsg, "error");
    }
  };

  return (
    <Formik
      initialValues={{
        identifier: "",
        password: "",
        rememberMe: true,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleBlur, touched, errors }) => (
        <Form>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                id="identifier"
                name="identifier"
                value={values.identifier}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.identifier && errors.identifier}
                error={touched.identifier && Boolean(errors.identifier)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.password && errors.password}
                error={touched.password && Boolean(errors.password)}
                variant="outlined"
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
            </Grid>
            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={values.rememberMe}
                      onChange={handleChange}
                    />
                  }
                  label="Remember Me"
                />
              </FormGroup>
              <Link
                to="/auth/forgot-password"
                style={{ textDecoration: "none" }}
              >
                Forgot your password?
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{
                  boxShadow: "none",
                  pt: 1,
                  px: 3,
                  color: "white",
                  background: "linear-gradient(to right, #AC9B6D, #6A5637)",
                  "&:hover": {
                    background: "linear-gradient(to right, #BFA670, #7A5F3A)",
                  },
                }}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {loading ? "Logging In..." : "Login"}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
