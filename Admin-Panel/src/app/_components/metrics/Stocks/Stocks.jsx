import { JumboCard } from "@jumbo/components";
import { Span } from "@jumbo/shared";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Stocks = ({ title, payout }) => {
  const { t } = useTranslation();
  return (
    <JumboCard
      title={
        <Typography variant={"h5"} mb={0}>
          {title}
        </Typography>
      }
      action={
        <Stack direction={"row"} spacing={1}>
          {/* <Chip label={"Annual"} color={"warning"} size={"small"} />
          <ShowChartIcon fontSize={"small"} /> */}
        </Stack>
      }
      contentWrapper
      contentSx={{ textAlign: "center" }}
      headerSx={{
        borderBottom: 1,
        borderBottomColor: "divider",
      }}
    >
      <Typography variant={"h2"}>${payout}</Typography>
      <Typography variant={"body1"}>
        {t("dashboard.TotalPendingWithdrawals")}
        {/* <Span sx={{ color: "success.main", ml: 1 }}>
          {payout}
          <TrendingUpIcon
            fontSize={"small"}
            sx={{ verticalAlign: "middle", ml: 1 }}
          />
        </Span> */}
      </Typography>
    </JumboCard>
  );
};

export { Stocks };

Stocks.propTypes = {
  title: PropTypes.node,
};
