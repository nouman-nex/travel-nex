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

const DepositInfo = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 4,
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
    case "confirmed":
    case "approved":
      return "success";
    case "failed":
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

const formatChain = (chain) => {
  switch (chain?.toLowerCase()) {
    case "bep20":
      return "BEP-20";
    case "erc20":
      return "ERC-20";
    case "trc20":
      return "TRC-20";
    default:
      return chain?.toUpperCase() || "";
  }
};

const formatNumber = (num) =>
  typeof num === "number" ? num.toLocaleString("en-US") : num;

function TodayDepositsList({ data }) {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {t("dashboard.NoDepositsToday")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {data.map((deposit) => (
        <StyledListItem key={deposit.id}>
          <DepositInfo>
            <Typography variant="subtitle2" fontWeight={500}>
              {deposit.coin?.toUpperCase()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatChain(deposit.chain)} • {formatDate(deposit.date)}
            </Typography>
          </DepositInfo>

          <AmountInfo>
            <Typography variant="h6" fontWeight={600} color="primary">
              ${formatNumber(deposit.amount)} {deposit.coin?.toUpperCase()}
            </Typography>
            <Chip
              label={deposit.status?.toUpperCase()}
              size="small"
              color={getStatusColor(deposit.status)}
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          </AmountInfo>
        </StyledListItem>
      ))}
    </Box>
  );
}

export { TodayDepositsList };
