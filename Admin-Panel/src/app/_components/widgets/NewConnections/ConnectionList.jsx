import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

const StyledListItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const UserInfo = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 12,
});

const UserDetails = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

const AmountInfo = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 4,
});

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "error";
    default:
      return "default";
  }
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getPaymentMethodDisplay = (method) => {
  switch (method?.toLowerCase()) {
    case "bep20":
      return "BEP-20";
    case "erc20":
      return "ERC-20";
    case "trc20":
      return "TRC-20";
    default:
      return method?.toUpperCase();
  }
};

function ConnectionsList({ data }) {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {t("dashboard.NoWithdrawalsToday")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {data.map((withdrawal) => (
        <StyledListItem key={withdrawal.id}>
          <UserInfo>
            <UserDetails>
              <Typography variant="subtitle2" fontWeight={500}>
                {/* {withdrawal.username || withdrawal.payoutAddress} */}
                USDT
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getPaymentMethodDisplay(withdrawal.paymentMethod)} •{" "}
                {formatDate(withdrawal.date)}
              </Typography>
            </UserDetails>
          </UserInfo>

          <AmountInfo>
            <Typography variant="h6" fontWeight={600} color="primary">
              ${withdrawal.amount.toFixed(2)} USDT
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                After fees: ${withdrawal.netAmount?.toFixed(2)}
              </Typography>
              <Chip
                label={withdrawal.status?.toUpperCase()}
                size="small"
                color={getStatusColor(withdrawal.status)}
                sx={{ fontSize: "0.7rem", height: 20 }}
              />
            </Box>
          </AmountInfo>
        </StyledListItem>
      ))}
    </Box>
  );
}

export { ConnectionsList };
