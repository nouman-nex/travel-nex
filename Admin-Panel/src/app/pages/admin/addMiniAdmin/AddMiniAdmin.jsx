import React, { useEffect, useState } from "react";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";
import {
  Paper,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Box,
  FormControlLabel,
  Checkbox,
  Grid,
  Card,
  CardContent,
  FormHelperText,
  Container,
  Stack,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Div } from "@jumbo/shared";
import { getMenus } from "@app/_components/layout/Sidebar/menus-items";

const CreateUserSchema = Yup.object().shape({
  username: Yup.string().min(3).required("Username is required"),
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().min(6).required("Password is required"),
  allowedRoutes: Yup.array().min(1, "Please select at least one route"),
});

function AddMiniAdmin() {
  const notify = useNotify();
  const navigate = useNavigate();
  const { User } = useAuth();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const menus = getMenus();
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const mapMenusToRoutes = (items) => {
    const result = [];

    const traverse = (list) => {
      list.forEach((item) => {
        if (item.path && item.label) {
          result.push({ path: item.path, name: item.label });
        }
        if (Array.isArray(item.children) && item.children.length) {
          traverse(item.children);
        }
      });
    };

    traverse(items);
    return result;
  };

  useEffect(() => {
    setAvailableRoutes(mapMenusToRoutes(menus));
  }, [menus]);
  const handleCreateUser = (values, actions) => {
    const userData = {
      username: values.username,
      email: values.email,
      password: values.password,
      roles: ["MiniAdmin"],
      allowedRoutes: values.allowedRoutes,
    };

    postRequest(
      "/createMiniAdmin",
      userData,
      (response) => {
        if (response.data.status === "success") {
          notify("Mini Admin created successfully", "success");
          actions.resetForm();
        } else {
          notify(
            response.data.message || "Failed to create Mini Admin",
            "error"
          );
        }
        actions.setSubmitting(false);
      },
      (error) => {
        notify("Something went wrong", "error");
        actions.setSubmitting(false);
      }
    );
  };
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
        setLoading(false);
        setAuthChecked(true);
        return;
      } else if (isMiniAdmin) {
        if (!allowedRoutes.includes(currentPath)) {
          if (allowedRoutes.length > 0) {
            navigate(allowedRoutes[0]);
          } else {
            navigate("/");
          }
        } else {
          setLoading(false);
          setAuthChecked(true);
        }
      } else {
        navigate("/");
      }
    }
  }, [User, navigate]);

  if (loading) {
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
      {/* <Div sx={{ borderBottom: 2, borderColor: "divider", py: 1, mb: 3 }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <>
            <Div sx={{ display: { xs: "none", lg: "block" } }}>
              <Typography variant="h3" sx={{ my: 1 }}>
                Create Mini Admin
              </Typography>
            </Div>
          </>
        </Stack>
      </Div> */}
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Card>
          <CardContent>
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            Create Mini Admin
          </Typography>
            <Typography
              variant="body2"
              align="center"
              color="textSecondary"
              sx={{ mb: 3 }}
            >
              Fill in the details below to create a new Mini Admin user
            </Typography>

            <Formik
              initialValues={{
                username: "",
                email: "",
                password: "",
                allowedRoutes: [],
              }}
              validationSchema={CreateUserSchema}
              onSubmit={handleCreateUser}
            >
              {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                <Form>
                  <Grid container spacing={3}>
                    {/* Username Field */}
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        name="username"
                        label="Username"
                        fullWidth
                        variant="outlined"
                        error={touched.username && !!errors.username}
                        helperText={touched.username && errors.username}
                        disabled={isSubmitting}
                      />
                    </Grid>

                    {/* Email Field */}
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        error={touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                        disabled={isSubmitting}
                      />
                    </Grid>

                    {/* Password Field */}
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        error={touched.password && !!errors.password}
                        helperText={touched.password && errors.password}
                        disabled={isSubmitting}
                      />
                    </Grid>

                    {/* Routes Selection */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Select Allowed Routes
                      </Typography>
                      <Box
                        sx={{
                          maxHeight: 300,
                          overflowY: "auto",
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                          p: 2,
                        }}
                      >
                        <Grid container spacing={1}>
                          {availableRoutes.map((route) => (
                            <Grid item xs={12} sm={6} md={4} key={route.path}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={values.allowedRoutes.includes(
                                      route.path
                                    )}
                                    onChange={(e) => {
                                      const updatedRoutes = e.target.checked
                                        ? [...values.allowedRoutes, route.path]
                                        : values.allowedRoutes.filter(
                                            (r) => r !== route.path
                                          );
                                      setFieldValue(
                                        "allowedRoutes",
                                        updatedRoutes
                                      );
                                    }}
                                    disabled={isSubmitting}
                                  />
                                }
                                label={
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      {route.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="textSecondary"
                                    >
                                      {route.path}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>

                      {touched.allowedRoutes && errors.allowedRoutes && (
                        <FormHelperText error sx={{ mt: 1 }}>
                          {errors.allowedRoutes}
                        </FormHelperText>
                      )}
                    </Grid>

                    {/* Selected Routes Display */}
                    {values.allowedRoutes.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                          Selected Routes ({values.allowedRoutes.length}):
                        </Typography>
                        <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            {values.allowedRoutes.join(", ")}
                          </Typography>
                        </Box>
                      </Grid>
                    )}

                    {/* Submit Button */}
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{
                            color: "white",
                            minWidth: 150,
                            background:
                              "linear-gradient(to right, #AC9B6D, #8B7550, #6A5637)",
                          }}
                          size="large"
                          disabled={isSubmitting}
                          startIcon={
                            isSubmitting ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : null
                          }
                        >
                          {isSubmitting ? "Creating..." : "Create Mini Admin"}
                        </Button>

                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          size="large"
                          disabled={isSubmitting}
                          onClick={() => {
                            setFieldValue("username", "");
                            setFieldValue("email", "");
                            setFieldValue("password", "");
                            setFieldValue("allowedRoutes", []);
                          }}
                        >
                          Reset Form
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default AddMiniAdmin;
