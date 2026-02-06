import { CitiesChart } from "@app/_components/charts/CitiesChart";
import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

const Cities = ({ title, dashboarddata }) => {
  return (
    <JumboCard
      title={
        <Typography
          variant={"h4"}
          mb={0}
          sx={{ fontSize: 14, color: "common.white", letterSpacing: 1.5 }}
        >
          {title}
        </Typography>
      }
      sx={{ color: "common.white" }}
      bgcolor={["#EF5350"]}
    >
      <Div
        sx={{
          p: 3,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          position: "absolute",
        }}
      >
        <Typography variant={"h2"} color={"common.white"}>
          ${Number(dashboarddata.totalPendingWithdrawalAmount).toLocaleString()}
        </Typography>
        {/* <Typography variant={"h6"} color={"common.white"} mb={0}>
          {"03% This Week"}
        </Typography> */}
      </Div>
      <CitiesChart />
    </JumboCard>
  );
};

export { Cities };

Cities.propTypes = {
  title: PropTypes.node,
};
