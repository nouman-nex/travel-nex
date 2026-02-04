import React, { useState, useCallback, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Grid,
} from "@mui/material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { toast } from "react-toastify";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";

// Leg options
const legOptions = [
  { value: "left", label: "Left Leg" },
  { value: "right", label: "Right Leg" },
];

const validationSchema = Yup.object({
  referredBy: Yup.string().required("Referred By is required"),
  leg: Yup.string().required("Leg selection is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

function BulkRegistration() {
  const { User } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const notify = useNotify();
  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    postRequest(
      "/getAllUsers",
      {},
      (response) => {
        const allUsersArray = response?.data || [];
        setAllUsers(allUsersArray);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users data");
        setIsLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const initialValues = {
    referredBy: "",
    leg: "",
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const submitData = {
      referredBy: values.referredBy,
      leg: values.leg,
      username: values.username,
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
    };

    postRequest(
      "/adminRegister",
      submitData,
      (response) => {
        if (response.status === 200) {
          notify("User registered successfully!", "success");
          resetForm();
        } else {
          notify("Registration failed", "error");
        }
        setSubmitting(false);
      },
      (error) => {
        console.error("Registration error:", error);
        toast.error("Registration failed. Please try again.");
        setSubmitting(false);
      }
    );
  };

  return (
    <Container maxWidth="xl">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ my: "auto" }}
        bgcolor="#f5f6fa"
      >
        <Paper elevation={3} sx={{ p: 4, width: 700 }}>
          <Typography variant="h3" sx={{ mb: 2, textAlign: "center" }}>
            Admin User Registration
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isSubmitting,
              errors,
              touched,
              handleChange,
              handleBlur,
              values,
            }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.referredBy && Boolean(errors.referredBy)}
                    >
                      <InputLabel>Referred By</InputLabel>
                      <Select
                        name="referredBy"
                        value={values.referredBy}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Referred By"
                      >
                        {allUsers.map((user) => (
                          <MenuItem key={user.id} value={user.refferrCode}>
                            {user.username} ({user.refferrCode})
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.referredBy && errors.referredBy && (
                        <FormHelperText>{errors.referredBy}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.leg && Boolean(errors.leg)}
                    >
                      <InputLabel>Leg</InputLabel>
                      <Select
                        name="leg"
                        value={values.leg}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Leg"
                      >
                        {legOptions.map((leg) => (
                          <MenuItem key={leg.value} value={leg.value}>
                            {leg.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.leg && errors.leg && (
                        <FormHelperText>{errors.leg}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      type="text"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      type="text"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      type="text"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.confirmPassword &&
                        Boolean(errors.confirmPassword)
                      }
                      helperText={
                        touched.confirmPassword && errors.confirmPassword
                      }
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    color: "white",
                    mt: 2,
                    background:
                      "linear-gradient(to right, #AC9B6D, #8B7550, #6A5637)",
                  }}
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? <CircularProgress size={20} /> : null
                  }
                >
                  {isSubmitting ? "Registering..." : "Register User"}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
}

export default BulkRegistration;
