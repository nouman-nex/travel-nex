import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit, CloudUpload } from "@mui/icons-material";
import { api } from "../../../../backendServices/ApiCalls";
import DataTable from "@app/_components/table/table";
import useNotify from "@app/_components/Notification/useNotify";
import { uploadToCloudinary } from "../../../../utils/uploadToCloudinary";

const initialForm = {
  bankName: "",
  accountTitle: "",
  iban: "",
  branchCode: "",
  accountNumber: "",
  accountType: "company",
  isActive: true,
  remarks: "",
  logo: "",
};

export default function ManageBankAccounts() {
  const notify = useNotify();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v2/bankAccounts");
      console.log(res);
      setRows(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    try {
      const logoUrl = await uploadToCloudinary(
        file,
        "travel-agency/bank-logos",
      );
      setForm((prev) => ({
        ...prev,
        logo: logoUrl,
      }));
      notify("Logo uploaded successfully", "success");
    } catch (error) {
      notify(error.message || "Failed to upload logo", "error");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/v2/bankAccounts/${editingId}`, form);
        notify("Bank account updated successfully", "success");
        await fetchAccounts();
      } else {
        const response = await api.post("/v2/bankAccounts", form);
        // Add the new account to the rows (response returns single object)
        if (response.data?.data) {
          setRows((prevRows) => [...prevRows, response.data.data]);
        }
        notify("Bank account added successfully", "success");
      }
      setForm(initialForm);
      setEditingId(null);
      setOpenFormDialog(false); // Close modal after success
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Operation failed";
      notify(errorMsg, "error");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (row) => {
    setForm({
      bankName: row.bankName || "",
      accountTitle: row.accountTitle || "",
      iban: row.iban || "",
      branchCode: row.branchCode || "",
      accountNumber: row.accountNumber || "",
      accountType: row.accountType || "company",
      isActive: row.isActive ?? true,
      remarks: row.remarks || "",
      logo: row.logo || "",
    });
    setEditingId(row._id);
    setOpenFormDialog(true);
  };

  const openAddDialog = () => {
    setForm(initialForm);
    setEditingId(null);
    setOpenFormDialog(true);
  };

  const closeFormDialog = () => {
    if (!submitting) {
      setOpenFormDialog(false);
      setForm(initialForm);
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/v2/bankAccounts/${deleteId}`);
      notify("Bank account deleted successfully", "success");
      setRows(rows.filter((row) => row._id !== deleteId));
      setOpenDeleteDialog(false);
      setDeleteId(null);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to delete";
      notify(errorMsg, "error");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const closeDeleteDialog = () => {
    if (!submitting) {
      setOpenDeleteDialog(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      field: "logo",
      label: "Logo",
      renderCell: (row) =>
        row.logo ? (
          <Box
            component="img"
            src={row.logo}
            alt={row.bankName}
            sx={{ width: 40, height: 40, borderRadius: 1, objectFit: "cover" }}
          />
        ) : (
          <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
            No logo
          </Typography>
        ),
    },
    {
      field: "bankName",
      label: "Bank Name",
    },
    {
      field: "accountTitle",
      label: "Account Title",
    },
    {
      field: "iban",
      label: "IBAN",
    },
    {
      field: "accountNumber",
      label: "Account No",
    },
    {
      field: "accountType",
      label: "Type",
      renderCell: (row) => (
        <Chip
          label={row.accountType}
          size="small"
          color={row.accountType === "company" ? "primary" : "secondary"}
        />
      ),
    },
    {
      field: "isActive",
      label: "Status",
      renderCell: (row) => (
        <Chip
          label={row.isActive ? "Active" : "Inactive"}
          size="small"
          color={row.isActive ? "success" : "default"}
        />
      ),
    },
    {
      field: "actions",
      label: "Actions",
      renderCell: (row) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDelete(row._id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Manage Bank Accounts
        </Typography>
        <Button variant="contained" onClick={openAddDialog}>
          + Add Bank Account
        </Button>
      </Box>

      {/* Add/Edit Form Dialog */}
      <Dialog
        open={openFormDialog}
        onClose={closeFormDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingId ? "Update Bank Account" : "Add Bank Account"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            {/* Logo Upload */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                disabled={logoUploading}
              >
                {logoUploading ? "Uploading..." : "Upload Logo"}
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleLogoUpload}
                  disabled={logoUploading}
                />
              </Button>
              {form.logo && (
                <Box
                  component="img"
                  src={form.logo}
                  alt="Bank Logo"
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    objectFit: "cover",
                  }}
                />
              )}
            </Box>

            <TextField
              fullWidth
              label="Bank Name"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              fullWidth
              label="Account Title"
              name="accountTitle"
              value={form.accountTitle}
              onChange={handleChange}
              size="small"
            />
            <TextField
              fullWidth
              label="IBAN"
              name="iban"
              value={form.iban}
              onChange={handleChange}
              size="small"
            />
            <TextField
              fullWidth
              label="Branch Code"
              name="branchCode"
              value={form.branchCode}
              onChange={handleChange}
              size="small"
            />
            <TextField
              fullWidth
              label="Account Number"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              size="small"
            />
            <TextField
              select
              fullWidth
              label="Account Type"
              name="accountType"
              value={form.accountType}
              onChange={handleChange}
              size="small"
            >
              <MenuItem value="company">Company</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={handleChange}
                  name="isActive"
                />
              }
              label="Active"
            />
            <TextField
              fullWidth
              label="Remarks"
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              multiline
              rows={2}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={closeFormDialog}
            disabled={submitting}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            variant="contained"
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : editingId ? (
              "Update Account"
            ) : (
              "Add Account"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Bank Account</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete this bank account? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={closeDeleteDialog}
            disabled={submitting}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={submitting}
            variant="contained"
            color="error"
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <div>
        <DataTable
          title="Bank Accounts"
          data={rows}
          columns={columns}
          loading={loading}
          searchPlaceholder="Search by bank, IBAN, account number..."
          emptyMessage="No bank accounts found"
        />
      </div>
    </Box>
  );
}
