import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  FormControlLabel,
  Switch,
  Container,
  Chip,
} from "@mui/material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "@app/_components/table/table";
import { Div } from "@jumbo/shared";

const validationSchema = Yup.object({
  amount: Yup.number()
    .required("Amount is required")
    .min(1, "Amount must be at least 1"),
  fee: Yup.number()
    .required("Fee is required")
    .min(0, "Fee must be at least 0"),
  hubCapacity: Yup.number().required("Hub Capacity is required"),
  minimumMinting: Yup.number().required("Minimum Minting is required"),
  minimumMintingRequired: Yup.boolean().required(),
});

const ManagePackage = () => {
  const [packagesData, setPackagesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialog, setEditDialog] = useState({
    open: false,
    packageData: null,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    packageId: null,
    packageName: "",
  });

  // Fetch packages data
  const fetchPackages = useCallback(() => {
    setIsLoading(true);
    postRequest(
      "/getpackages",
      {},
      (response) => {
        if (response?.data?.success) {
          setPackagesData(response.data.packages || []);
        } else {
          toast.error(
            response?.data?.message || "Failed to load packages data"
          );
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching packages:", error);
        toast.error("Failed to load packages data");
        setIsLoading(false);
      }
    );
  }, []);

  const { User } = useAuth();
  const navigate = useNavigate();
  const [loadingMain, setLoadingMain] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Auth check effect
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
        setLoadingMain(false);
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
          setLoadingMain(false);
          setAuthChecked(true);
        }
      } else {
        navigate("/");
      }
    }
  }, [User, navigate]);

  // Data fetching useEffect - runs only after auth is checked
  useEffect(() => {
    if (authChecked && !loadingMain) {
      fetchPackages();
    }
  }, [authChecked, loadingMain, fetchPackages]);

  // Edit form
  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: editDialog.packageData || {
      amount: "",
      fee: "",
      hubPrice: "",
      hubCapacity: "",
      minimumMinting: "",
      minimumMintingRequired: false,
    },
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        ...values,
        hubPrice: Number(values.amount) + Number(values.fee),
        id: editDialog.packageData?.id || editDialog.packageData?._id,
      };

      // Show loading toast
      const loadingToastId = toast.info("Updating package...", {
        autoClose: false,
      });

      postRequest(
        "/updatepackage",
        { payload },
        (response) => {
          toast.dismiss(loadingToastId);
          if (response?.data?.success) {
            toast.success("Package updated successfully!");
            fetchPackages(); // Refresh the data
            closeEditDialog();
          } else {
            toast.error(response?.data?.message || "Failed to update package");
          }
        },
        (error) => {
          toast.dismiss(loadingToastId);
          toast.error(
            error?.response?.data?.message || "Failed to update package"
          );
        }
      );
    },
  });

  if (loadingMain) {
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

  // Handle edit package
  const handleEditPackage = (pkg) => {
    setEditDialog({
      open: true,
      packageData: pkg,
    });
  };

  // Handle delete package
  const handleDeletePackage = (pkg) => {
    setDeleteDialog({
      open: true,
      packageId: pkg.id || pkg._id,
      packageName: `Package (Amount: ${pkg.amount}, Fee: ${pkg.fee})`,
    });
  };

  // Confirm delete
  const confirmDelete = () => {
    const { packageId } = deleteDialog;
    const loadingToastId = toast.info("Deleting package...", {
      autoClose: false,
    });

    postRequest(
      "/deletepackage",
      { packageId },
      (response) => {
        toast.dismiss(loadingToastId);
        if (response?.data?.success) {
          toast.success("Package deleted successfully!");
          fetchPackages(); // Refresh the data
          closeDeleteDialog();
        } else {
          toast.error(response?.data?.message || "Failed to delete package");
        }
      },
      (error) => {
        toast.dismiss(loadingToastId);
        toast.error(
          error?.response?.data?.message || "Failed to delete package"
        );
      }
    );
  };

  const closeEditDialog = () => {
    setEditDialog({
      open: false,
      packageData: null,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      packageId: null,
      packageName: "",
    });
  };

  // Calculate hubPrice for edit form
  const editHubPrice =
    Number(editFormik.values.amount || 0) + Number(editFormik.values.fee || 0);

  // Column definitions for the table
  const columns = [
    {
      field: "amount",
      label: "Amount",
      exportValue: (row) => row.amount,
      renderCell: (row) => (
        <Typography variant="body2" fontWeight="medium">
          {row.amount}
        </Typography>
      ),
    },
    {
      field: "fee",
      label: "Fee",
      exportValue: (row) => row.fee,
      renderCell: (row) => <Typography variant="body2">{row.fee}</Typography>,
    },
    {
      field: "hubPrice",
      label: "Hub Price",
      exportValue: (row) => Number(row.amount) + Number(row.fee),
      renderCell: (row) => (
        <Chip
          label={Number(row.amount) + Number(row.fee)}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: "hubCapacity",
      label: "Hub Capacity",
      exportValue: (row) => row.hubCapacity,
      renderCell: (row) => (
        <Typography variant="body2">{row.hubCapacity}</Typography>
      ),
    },
    {
      field: "minimumMinting",
      label: "Minimum Minting",
      exportValue: (row) => row.minimumMinting,
      renderCell: (row) => (
        <Typography variant="body2">{row.minimumMinting}</Typography>
      ),
    },
    {
      field: "minimumMintingRequired",
      label: "Min Minting Required",
      exportValue: (row) => (row.minimumMintingRequired ? "Yes" : "No"),
      renderCell: (row) => (
        <Chip
          label={row.minimumMintingRequired ? "Yes" : "No"}
          size="small"
          color={row.minimumMintingRequired ? "success" : "default"}
        />
      ),
    },
    {
      field: "actions",
      label: "Actions",
      align: "center",
      renderCell: (row) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="Edit Package">
            <IconButton
              size="small"
              onClick={() => handleEditPackage(row)}
              disabled={isLoading}
              sx={{
                backgroundColor: "primary.100",
                "&:hover": { backgroundColor: "primary.200" },
                borderRadius: 1,
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Package">
            <IconButton
              size="small"
              onClick={() => handleDeletePackage(row)}
              disabled={isLoading}
              sx={{
                backgroundColor: "error.100",
                "&:hover": { backgroundColor: "error.200" },
                borderRadius: 1,
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Container maxWidth="xl">
      <Div sx={{ borderBottom: 2, borderColor: "divider", py: 1, mb: 3 }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <>
            <Div sx={{ display: { xs: "none", lg: "block" } }}>
              <Typography variant="h3" sx={{ my: 1 }}>
                Manage Hubs
              </Typography>
            </Div>
          </>
        </Stack>
      </Div>
      <ToastContainer />
      <Box sx={{ p: 3 }}>

        <DataTable
          title=""
          data={packagesData}
          columns={columns}
          loading={isLoading}
          searchPlaceholder="Search by amount, fee, or capacity"
          emptyMessage="No packages found"
        />
      </Box>

      {/* Edit Package Dialog */}
      <Dialog
        PaperProps={{
          sx: {
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(139, 69, 19, 0.15)",
            border: "1px solid rgba(218, 165, 32, 0.2)",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(255, 248, 220, 0.7), rgba(245, 222, 179, 0.3))",
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(5px)",
          },
        }}
        open={editDialog.open}
        onClose={closeEditDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit Package</DialogTitle>
        <form onSubmit={editFormik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Amount"
              name="amount"
              type="number"
              value={editFormik.values.amount}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
              error={
                editFormik.touched.amount && Boolean(editFormik.errors.amount)
              }
              helperText={editFormik.touched.amount && editFormik.errors.amount}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Fee"
              name="fee"
              type="number"
              value={editFormik.values.fee}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
              error={editFormik.touched.fee && Boolean(editFormik.errors.fee)}
              helperText={editFormik.touched.fee && editFormik.errors.fee}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Hub Price"
              name="hubPrice"
              type="number"
              value={editHubPrice}
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Hub Capacity"
              name="hubCapacity"
              type="number"
              value={editFormik.values.hubCapacity}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
              error={
                editFormik.touched.hubCapacity &&
                Boolean(editFormik.errors.hubCapacity)
              }
              helperText={
                editFormik.touched.hubCapacity && editFormik.errors.hubCapacity
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Minimum Minting"
              name="minimumMinting"
              type="number"
              value={editFormik.values.minimumMinting}
              onChange={editFormik.handleChange}
              onBlur={editFormik.handleBlur}
              error={
                editFormik.touched.minimumMinting &&
                Boolean(editFormik.errors.minimumMinting)
              }
              helperText={
                editFormik.touched.minimumMinting &&
                editFormik.errors.minimumMinting
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editFormik.values.minimumMintingRequired}
                  onChange={(e) =>
                    editFormik.setFieldValue(
                      "minimumMintingRequired",
                      e.target.checked
                    )
                  }
                  name="minimumMintingRequired"
                  color="primary"
                />
              }
              label="Minimum Minting Required"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditDialog} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Package
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        PaperProps={{
          sx: {
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(139, 69, 19, 0.15)",
            border: "1px solid rgba(218, 165, 32, 0.2)",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(255, 248, 220, 0.7), rgba(245, 222, 179, 0.3))",
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(5px)",
          },
        }}
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Package</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this package:{" "}
            <strong>{deleteDialog.packageName}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Note: This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManagePackage;
