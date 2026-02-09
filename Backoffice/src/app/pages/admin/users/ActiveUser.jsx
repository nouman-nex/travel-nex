import React, { useState, useEffect } from "react";
import { api } from "../../../../backendServices/ApiCalls";
import { Chip, Avatar, Box, Typography } from "@mui/material";
import { Phone as PhoneIcon, Email as EmailIcon } from "@mui/icons-material";
import DataTable from "@app/_components/table/table";

export default function ActiveUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v5/dashboard/users");
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      field: "avatar",
      label: "Avatar",
      align: "center",
      renderCell: (row) => (
        <Avatar src={row.avatar} alt={row.name} sx={{ width: 40, height: 40 }}>
          {row.name?.charAt(0).toUpperCase()}
        </Avatar>
      ),
      exportValue: (row) => row.name?.charAt(0).toUpperCase() || "",
    },
    {
      field: "name",
      label: "Name",
      exportValue: (row) => row.name,
    },
    {
      field: "email",
      label: "Email",
      renderCell: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EmailIcon fontSize="small" color="action" />
          <Typography variant="body2">{row.email}</Typography>
        </Box>
      ),
      exportValue: (row) => row.email,
    },
    {
      field: "phone",
      label: "Phone",
      renderCell: (row) =>
        row.phone ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2">{row.phone}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            N/A
          </Typography>
        ),
      exportValue: (row) => row.phone || "N/A",
    },
    {
      field: "role",
      label: "Role",
      align: "center",
      renderCell: (row) => (
        <Chip
          label={row.role?.join(", ").toUpperCase() || "USER"}
          color="primary"
          size="small"
          variant="outlined"
        />
      ),
      exportValue: (row) => row.role?.join(", ").toUpperCase() || "USER",
    },
    {
      field: "lastLogin",
      label: "Last Login",
      renderCell: (row) =>
        row.lastLogin ? (
          <Typography variant="body2">
            {new Date(row.lastLogin).toLocaleString()}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Never
          </Typography>
        ),
      exportValue: (row) =>
        row.lastLogin ? new Date(row.lastLogin).toLocaleString() : "Never",
    },
    {
      field: "createdAt",
      label: "Joined",
      renderCell: (row) => (
        <Typography variant="body2">
          {new Date(row.createdAt).toLocaleDateString()}
        </Typography>
      ),
      exportValue: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      title="Active Users"
      data={users}
      columns={columns}
      loading={loading}
      searchPlaceholder="Search users by name, email, or phone..."
      emptyMessage="No active users found"
    />
  );
}
