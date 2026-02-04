import { RevenueChart } from "@app/_components/charts";
import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { TrendingUp } from "@mui/icons-material";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

function OnlineSignupsFilled({ subheader, coreWorkData }) {
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0 && m > 0) return `${h} h ${m} m`;
    if (h > 0) return `${h} h`;
    if (m > 0) return `${m} m`;
    return `${s} s`;
  };
  return (
    <JumboCard
      title={
        isNaN(coreWorkData?.summary?.totalTimeInSeconds)
          ? "00:00"
          : formatTime(coreWorkData?.summary?.totalTimeInSeconds)
      }
      subheader={subheader}
      textColor="common.white"
      bgcolor={["#a3ead3", "#3bd2a2"]}
      reverse
      sx={{
        borderTop: "4px solid #3BD2A2",
        ".MuiCardHeader-title": {
          color: "inherit",
          fontSize: "1.25rem",
        },
        ".MuiCardHeader-subheader": {
          color: "inherit",
        },
      }}
    >
      <Div sx={{ p: 3, pb: 0 }}>
        <RevenueChart coreWorkData={coreWorkData} />
      </Div>
    </JumboCard>
  );
}

export { OnlineSignupsFilled };

OnlineSignupsFilled.propTypes = {
  subheader: PropTypes.node.isRequired,
};
