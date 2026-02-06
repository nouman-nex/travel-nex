import { JumboCard } from "@jumbo/components";
import { Div, Span } from "@jumbo/shared";
import { TrendingUp } from "@mui/icons-material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { Chip, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";

const Visits = ({ title ,dashboarddata}) => {
  return (
    <JumboCard
      sx={{ maxHeight: 146 }} 
      title={
        <Typography variant={"h5"} mb={0}>
          {title}
        </Typography>
      }
      contentWrapper
      contentSx={{ textAlign: "center" }}
      headerSx={{ borderBottom: 1, borderBottomColor: "divider" }}
    >
      <Stack direction={"row"} sx={{ maxWidth: 600, mx: "auto" }}>
        <Div sx={{ width: "50%", textAlign: "center" }}>
          <Typography variant={"h2"}>{dashboarddata.totalActiveUsers}</Typography>
          <Typography variant={"body1"}>
            Active Users:
            <Span sx={{ color: "success.main", ml: 1 }}>
              {/* 23% */}
              <TrendingUp
                fontSize={"small"}
                sx={{ verticalAlign: "middle", ml: 1 }}
              />
            </Span>
          </Typography>
        </Div>
        <Div sx={{ width: "50%", textAlign: "center" }}>
          <Typography variant={"h2"}>{dashboarddata.totalInactiveUsers}</Typography>
          <Typography variant={"body1"}>
            Inactive Users:
            <Span sx={{ color: "error.main", ml: 1 }}>
              {/* 1.58% */}
              <TrendingUp
                fontSize={"small"}
                sx={{ verticalAlign: "middle", ml: 1 }}
              />
            </Span>
          </Typography>
        </Div>
      </Stack>
    </JumboCard>
  );
};

export { Visits };

Visits.propTypes = {
  title: PropTypes.node,
};
