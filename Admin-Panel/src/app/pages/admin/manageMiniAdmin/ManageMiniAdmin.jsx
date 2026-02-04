import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Div } from "@jumbo/shared";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { getMenus } from "@app/_components/layout/Sidebar/menus-items";

const UpdateUserSchema = Yup.object().shape({
  username: Yup.string().min(3).required("Username is required"),
  email: Yup.string().email().required("Email is required"),
  allowedRoutes: Yup.array().min(1, "Please select at least one route"),
});

function ManageMiniAdmin() {
  const notify = useNotify();
  const navigate = useNavigate();
  const { User } = useAuth();
  const [loading, setLoading] = useState(true);
  const [miniAdmins, setMiniAdmins] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
        fetchMiniAdmins();
      } else if (isMiniAdmin) {
        if (!allowedRoutes.includes(currentPath)) {
          if (allowedRoutes.length > 0) {
            navigate(allowedRoutes[0]);
          } else {
            navigate("/");
          }
        } else {
          setAuthChecked(true);
          fetchMiniAdmins();
        }
      } else {
        navigate("/");
      }
    }
  }, [User, navigate]);

  // Fetch Mini Admins
  const fetchMiniAdmins = () => {
    setLoading(true);
    postRequest(
      "/getMiniAdmins",
      {},
      (response) => {
        if (response.data.status === "success") {
          setMiniAdmins(response.data.data || []);
        } else {
          notify("Failed to fetch Mini Admins", "error");
        }
        setLoading(false);
      },
      (error) => {
        notify("Something went wrong while fetching data", "error");
        setLoading(false);
      }
    );
  };

  // Handle Update Mini Admin
  const handleUpdateAdmin = (values, actions) => {
    const updateData = {
      id: selectedAdmin._id,
      username: values.username,
      email: values.email,
      allowedRoutes: values.allowedRoutes,
    };

    postRequest(
      "/updateMiniAdmin",
      updateData,
      (response) => {
        if (response.data.status === "success") {
          notify("Mini Admin updated successfully", "success");
          setOpenEditDialog(false);
          setSelectedAdmin(null);
          fetchMiniAdmins();
        } else {
          notify(
            response.data.message || "Failed to update Mini Admin",
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

  // Handle Delete Mini Admin
  const handleDeleteAdmin = () => {
    postRequest(
      "/deleteMiniAdmin",
      { id: selectedAdmin._id },
      (response) => {
        if (response.data.status === "success") {
          notify("Mini Admin deleted successfully", "success");
          setOpenDeleteDialog(false);
          setSelectedAdmin(null);
          fetchMiniAdmins();
        } else {
          notify(
            response.data.message || "Failed to delete Mini Admin",
            "error"
          );
        }
      },
      (error) => {
        notify("Something went wrong", "error");
      }
    );
  };

  // Handle Edit Click
  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    setOpenEditDialog(true);
  };

  // Handle Delete Click
  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setOpenDeleteDialog(true);
  };

  // Handle View Click
  const handleViewClick = (admin) => {
    setSelectedAdmin(admin);
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
      <Div sx={{ borderBottom: 2, borderColor: "divider", py: 1, mb: 3 }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Div sx={{ display: { xs: "none", lg: "block" } }}>
            <Typography variant="h3" sx={{ my: 1 }}>
              Manage Mini Admins
            </Typography>
          </Div>
          <Button
            variant="contained"
             sx={{
                      color: "white",
                      background:
                        "linear-gradient(to right, #AC9B6D, #8B7550, #6A5637)",
                    }}
            onClick={() => navigate("/addMiniAdmin")}
          >
            Add New Mini Admin
          </Button>
        </Stack>
      </Div>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Mini Admin Users ({miniAdmins.length})
          </Typography>

          {miniAdmins.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
              }}
            >
              <PersonIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No Mini Admins Found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Create your first Mini Admin to get started
              </Typography>
              <Button
                variant="contained"
                 sx={{
                      color: "white",
                      background:
                        "linear-gradient(to right, #AC9B6D, #8B7550, #6A5637)",
                    }}
                onClick={() => navigate("/addMiniAdmin")}
              >
                Add Mini Admin
              </Button>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Avatar</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Allowed Routes</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created Date</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {miniAdmins
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((admin) => (
                        <TableRow key={admin._id}>
                          <TableCell>
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                              {admin.username.charAt(0).toUpperCase()}
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {admin.username}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {admin.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {admin.allowedRoutes?.slice(0, 2).map((route) => (
                                <Chip
                                  key={route}
                                  label={
                                    availableRoutes.find(
                                      (r) => r.path === route
                                    )?.name || route
                                  }
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                              {admin.allowedRoutes?.length > 2 && (
                                <Chip
                                  label={`+${admin.allowedRoutes.length - 2}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={admin.status || "Active"}
                              color={
                                admin.status === "active" ? "success" : "error"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {admin.createdAt
                                ? new Date(admin.createdAt).toLocaleDateString()
                                : "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  color="info"
                                  onClick={() => handleViewClick(admin)}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton
                                  color="primary"
                                  onClick={() => handleEditClick(admin)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  color="error"
                                  onClick={() => handleDeleteClick(admin)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
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
                count={miniAdmins.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Mini Admin</DialogTitle>
        <DialogContent>
          {selectedAdmin && (
            <Formik
              initialValues={{
                username: selectedAdmin.username || "",
                email: selectedAdmin.email || "",
                allowedRoutes: selectedAdmin.allowedRoutes || [],
              }}
              validationSchema={UpdateUserSchema}
              onSubmit={handleUpdateAdmin}
            >
              {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                <Form>
                  <Grid container spacing={3} sx={{ mt: 1 }}>
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
                            <Grid item xs={12} sm={6} key={route.path}>
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

                    <Grid item xs={12}>
                      <DialogActions>
                        <Button
                          onClick={() => setOpenEditDialog(false)}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isSubmitting}
                          startIcon={
                            isSubmitting ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : null
                          }
                        >
                          {isSubmitting ? "Updating..." : "Update"}
                        </Button>
                      </DialogActions>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Mini Admin</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the Mini Admin "
            {selectedAdmin?.username}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAdmin} color="error" variant="contained">
            Delete
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
        <DialogTitle>Mini Admin Details</DialogTitle>
        <DialogContent>
          {selectedAdmin && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {selectedAdmin.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h6">{selectedAdmin.username}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Email:
                  </Typography>
                  <Typography variant="body1">{selectedAdmin.email}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Status:
                  </Typography>
                  <Chip
                    label={selectedAdmin.status || "Active"}
                    color={
                      selectedAdmin.status === "active" ? "success" : "error"
                    }
                    size="small"
                  />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Created Date:
                  </Typography>
                  <Typography variant="body1">
                    {selectedAdmin.createdAt
                      ? new Date(selectedAdmin.createdAt).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Role:
                  </Typography>
                  <Typography variant="body1">Mini Admin</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Allowed Routes:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedAdmin.allowedRoutes?.map((route) => (
                      <Chip
                        key={route}
                        label={
                          availableRoutes.find((r) => r.path === route)?.name ||
                          route
                        }
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
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
}

export default ManageMiniAdmin;
