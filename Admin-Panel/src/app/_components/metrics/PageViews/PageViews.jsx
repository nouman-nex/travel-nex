import { JumboCard } from "@jumbo/components";
import { Span } from "@jumbo/shared";
import { TrendingDown } from "@mui/icons-material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { Chip } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const PageViews = ({ title, refferals }) => {
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
          {/* <Chip label={"Monthly"} color={"success"} size={"small"} />
          <ShowChartIcon fontSize={"small"} /> */}
        </Stack>
      }
      contentSx={{ textAlign: "center" }}
      contentWrapper={true}
      headerSx={{ borderBottom: 1, borderBottomColor: "divider" }}
    >
      <Typography variant={"h2"}>{refferals}</Typography>
      <Typography variant={"body1"}>
        {t("dashboard.totalDepositAmount")}
        {/* <Span sx={{ color: "error.main", ml: 1 }}>
          {refferals}
          <TrendingDown
            fontSize={"small"}
            sx={{ verticalAlign: "middle", ml: 1 }}
          />
        </Span> */}
      </Typography>
    </JumboCard>
  );
};

export { PageViews };

PageViews.propTypes = {
  title: PropTypes.node,
};
