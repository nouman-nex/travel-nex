import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Alert,
  Snackbar,
  Chip,
  Typography,
} from "@mui/material";
import { api } from "../../../../backendServices/ApiCalls";
import DataTable from "@app/_components/table/table";

export default function PartnerShip() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch all partners on component mount
  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/v4/partners/getAllPartners");

      if (response.data.success) {
        setPartners(response.data.data);
      } else {
        setError("Failed to fetch partners");
      }
    } catch (err) {
      console.error("Error fetching partners:", err);
      setError(err.response?.data?.message || "Error fetching partners");
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Error fetching partners",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Define table columns
  const columns = [
    {
      field: "agencyName",
      label: "Agency Name",
      align: "left",
    },
    {
      field: "contactPerson",
      label: "Contact Person",
      align: "left",
    },
    {
      field: "emailAddress",
      label: "Email",
      align: "left",
    },
    {
      field: "phoneNumber",
      label: "Phone Number",
      align: "left",
    },
    {
      field: "address",
      label: "Address",
      align: "left",
      renderCell: (row) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
          {row.address}
        </Typography>
      ),
    },
    {
      field: "primaryRegion",
      label: "Region",
      align: "center",
      renderCell: (row) => (
        <Chip
          label={row.primaryRegion || "N/A"}
          color="primary"
          size="small"
          sx={{ textTransform: "capitalize" }}
        />
      ),
      exportValue: (row) => row.primaryRegion || "N/A",
    },
    {
      field: "monthlyVolume",
      label: "Monthly Volume",
      align: "center",
      renderCell: (row) => (
        <Chip
          label={row.monthlyVolume || "0"}
          color="secondary"
          size="small"
          variant="outlined"
        />
      ),
      exportValue: (row) => row.monthlyVolume || "0",
    },
    {
      field: "dtsLicense",
      label: "DTS License",
      align: "left",
    },
    {
      field: "businessLicense",
      label: "Business License",
      align: "left",
    },
    {
      field: "createdAt",
      label: "Registered Date",
      align: "center",
      renderCell: (row) => (
        <Typography variant="body2">
          {new Date(row.createdAt).toLocaleDateString()}
        </Typography>
      ),
      exportValue: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  // Filter options for regions (optional)
  const filterOptions = [
    { value: "north", label: "North" },
    { value: "south", label: "South" },
    { value: "east", label: "East" },
    { value: "west", label: "West" },
    { value: "central", label: "Central" },
  ];

  return (
    <div sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ width: "100%" }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <DataTable
          title="Partnership Management"
          data={partners}
          columns={columns}
          loading={loading}
          searchPlaceholder="Search by agency name, contact person, email..."
          emptyMessage="No partners found"
          initialFilterValue="All"
        />
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
