import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

// MUI Icons
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";

const DataTable = ({
  title,
  data,
  columns,
  loading = false,
  filterOptions = null,
  initialFilterValue = "All",
  onFilterChange = null,
  searchPlaceholder = "Search...",
  emptyMessage = "No data found",
  filterLabel = "Filter",
  onRowClick = null,
  actionButtons = null,
  exportTransformMode = "normal",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filterValue, setFilterValue] = useState(initialFilterValue);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (!data) return;

    let filtered = [...data];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();

      filtered = filtered.filter((row) =>
        columns.some((column) => {
          // 1️⃣ Use exportValue if provided (best for rendered columns)
          if (column.exportValue) {
            const value = column.exportValue(row);
            return String(value ?? "")
              .toLowerCase()
              .includes(searchLower);
          }

          // 2️⃣ Handle nested fields (e.g. user.name)
          if (column.field?.includes(".")) {
            const parts = column.field.split(".");
            let value = row;
            for (const part of parts) {
              value = value?.[part];
            }
            return String(value ?? "")
              .toLowerCase()
              .includes(searchLower);
          }

          // 3️⃣ Normal fields
          if (column.field && column.field !== "actions") {
            return String(row[column.field] ?? "")
              .toLowerCase()
              .includes(searchLower);
          }

          return false;
        }),
      );
    }

    // Optional filter dropdown logic
    if (filterValue !== "All" && filterOptions) {
      filtered = filtered.filter((item) => item.status === filterValue);
    }

    setFilteredData(filtered);
    setPage(0);
  }, [data, searchTerm, filterValue, filterOptions, columns]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    const newValue = event.target.value;
    setFilterValue(newValue);
    if (onFilterChange) {
      onFilterChange(newValue);
    }
  };

  // Extract plain value for CSV export
  const getPlainValue = (row, column) => {
    // Check if column has an exportValue function
    if (column.exportValue) {
      return column.exportValue(row);
    }

    // Handle nested properties (like user.username)
    if (column.field && column.field.includes(".")) {
      const parts = column.field.split(".");
      let value = row;
      for (const part of parts) {
        if (value && typeof value === "object") {
          value = value[part];
        } else {
          value = undefined;
          break;
        }
      }
      return value;
    }

    // Use simple field mapping
    if (column.field && column.field !== "actions") {
      return row[column.field];
    }

    return "";
  };

  // Export to CSV function
  // In the DataTable.js component, modify the exportToCSV function to properly identify the transformColumn

  const exportToCSV = () => {
    if (!filteredData || filteredData.length === 0) return;

    // Custom headers for CSV as per requirements
    const headers = ["Username", "Full Name", "Email", "Mobile", "Date"];

    // Find the column with exportTransform function - this fixes the "transformColumn is not defined" error
    const transformColumn = columns.find(
      (col) => typeof col.exportTransform === "function",
    );

    let csvRows = [];

    // Process each row of data for export
    if (exportTransformMode === "flat" && transformColumn) {
      // Using the transform function that returns multiple entries per row
      filteredData.forEach((row) => {
        // Get transformed data (array of objects)
        const transformedEntries = transformColumn.exportTransform(row);

        if (Array.isArray(transformedEntries)) {
          // For each transformed entry, create a CSV row
          transformedEntries.forEach((entry) => {
            // Use the keys from transformedEntry to map to CSV columns
            const csvRow = headers.map((header) => {
              const value = entry[header];
              // CSV formatting: quote strings, escape quotes by doubling
              if (typeof value === "string") {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value !== undefined && value !== null ? String(value) : "";
            });
            csvRows.push(csvRow);
          });
        }
      });
    } else {
      // Standard export - one row per data item
      csvRows = filteredData.map((row) =>
        columns
          .filter((col) => col.field !== "actions") // Skip action columns
          .map((column) => {
            // Get the plain value for this cell
            const value = getPlainValue(row, column);

            // Format dates if needed
            if (column.field === "createdAt" && value) {
              return new Date(value).toLocaleDateString();
            }

            // Ensure proper CSV formatting with quotes around strings
            if (typeof value === "string") {
              // Escape quotes by doubling them
              return `"${value.replace(/"/g, '""')}"`;
            }

            return value !== undefined && value !== null ? String(value) : "";
          }),
      );
    }

    // Combine headers and data
    const csvContent = [
      headers.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${title || "export"}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, width: "100%" }}>
      {title && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            placeholder={searchPlaceholder}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: "100%", sm: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          {filterOptions && (
            <FormControl size="small" sx={{ width: { xs: "100%", sm: 150 } }}>
              <InputLabel id="data-filter-label">{filterLabel}</InputLabel>
              <Select
                labelId="data-filter-label"
                value={filterValue}
                label={filterLabel}
                onChange={handleFilterChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="All">All</MenuItem>
                {filterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Stack>

        <Stack direction="row" spacing={2}>
          {actionButtons}
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={exportToCSV}
            disabled={!filteredData.length}
            size="small"
          >
            Export CSV
          </Button>
        </Stack>
      </Box>

      <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredData.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">{emptyMessage}</Typography>
          </Box>
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.light" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    align={column.align || "left"}
                    sx={{ fontWeight: "bold" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => (
                  <TableRow
                    key={row.id || rowIndex}
                    hover
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    sx={{
                      cursor: onRowClick ? "pointer" : "default",
                      "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                      "&:hover": { backgroundColor: "action.selected" },
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={`${row.id || rowIndex}-${column.field}`}
                        align={column.align || "left"}
                      >
                        {column.renderCell
                          ? column.renderCell(row)
                          : row[column.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable;
