import { OnlineSignupChart1 } from "@app/_components/charts/OnlineSignupChart1";
import { JumboCard } from "@jumbo/components";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Typography from "@mui/material/Typography";
import React from "react";
import PropTypes from "prop-types";

const OnlineSignups = ({ subheader, data, totalUsers }) => {
  // console.log("Data in online signnups and total users", data, totalUsers);
  return (
    <JumboCard
      title={
        <Typography fontWeight={"500"} variant={"h3"} color={"common.white"}>
          {totalUsers}
        </Typography>
      }
      subheader={
        <Typography variant={"h6"} color={"common.white"} mb={0}>
          {subheader}
        </Typography>
      }
      reverse
      sx={{ color: "common.white", borderTop: "4px solid #7352C7" }}
      bgcolor={["#c1b2e6", "#7352c7"]}
      contentWrapper
      contentSx={{ pb: 0 }}
    >
      <OnlineSignupChart1 data={data} type="users" />
    </JumboCard>
  );
};

export { OnlineSignups };

OnlineSignups.propTypes = {
  subheader: PropTypes.node,
};
