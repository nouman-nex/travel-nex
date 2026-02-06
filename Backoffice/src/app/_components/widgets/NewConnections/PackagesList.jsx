import React from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import { format } from "date-fns";

function PackagesList({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No packages sold today
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {data.map((item, index) => (
        <Paper
          key={item._id || index}
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" fontWeight={600}>
                ${item.amount} <Chip label={item.cryptoUsed} size="small" />
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.purchaseDate
                  ? format(new Date(item.purchaseDate), "MMM dd, yyyy HH:mm")
                  : "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Chip
                label={item.isMintingActive ? "Active" : "Inactive"}
                size="small"
                sx={{
                  backgroundColor: item.isMintingActive ? "#e0f7e9" : "#fff0f0",
                  color: item.isMintingActive ? "#2e7d32" : "#c62828",
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Minting: {item.mintingType}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Hub Price
              </Typography>
              <Typography variant="body1">
                ${item.hubPackage?.hubPrice || "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Capacity
              </Typography>
              <Typography variant="body1">
                {item.hubPackage?.hubCapacity || "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Min. Minting
              </Typography>
              <Typography variant="body1">
                {item.hubPackage?.minimumMinting || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Stack>
  );
}

export { PackagesList };
