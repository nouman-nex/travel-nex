import { OnlineSignupChart1 } from "@app/_components/charts/OnlineSignupChart1";
import { JumboCard } from "@jumbo/components";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Typography from "@mui/material/Typography";
import React from "react";
import PropTypes from "prop-types";

const RevenueThisYear = ({ subheader, data, totalTickets, totalRevenue }) => {
  // console.log("Tickets Sold Today", data, totalTickets, totalRevenue);
  return (
    <JumboCard
      title={
        <Typography fontWeight={"500"} variant={"h3"} color={"common.white"}>
          ${totalRevenue.toFixed(2)}
        </Typography>
      }
      subheader={
        <Typography variant={"h6"} color={"common.white"} mb={0}>
          {totalTickets} ticket(s) sold.
        </Typography>
      }
      reverse
      sx={{ color: "common.white", borderTop: "4px solid #3BD2A2" }}
      bgcolor={["#a3ead3", "#3bd2a2"]}
      contentWrapper
      contentSx={{ pb: 0 }}
    >
      <OnlineSignupChart1 data={data} type="tickets" />
    </JumboCard>
  );
};

export { RevenueThisYear };

RevenueThisYear.propTypes = {
  subheader: PropTypes.node,
};
