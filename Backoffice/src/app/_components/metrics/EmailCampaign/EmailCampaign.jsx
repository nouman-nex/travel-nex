import { OnlineSignupChart1 } from "@app/_components/charts/OnlineSignupChart1";
import { JumboCard } from "@jumbo/components";
import { TrendingDown } from "@mui/icons-material";
import { Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

const EmailCampaign = ({ subheader, data, totalPending, totalAmount }) => {
  // console.log(
  //   "data in email campaign withdraawal , total pending and total ammount",
  //   data,
  //   totalPending,
  //   totalAmount
  // );
  return (
    <JumboCard
      title={
        <Typography fontWeight={"500"} variant={"h3"} color={"common.white"}>
          ${totalAmount.toFixed(2)}
        </Typography>
      }
      subheader={
        <Typography variant={"h6"} color={"common.white"} mb={0}>
          {subheader}
        </Typography>
      }
      reverse
      sx={{ color: "common.white", borderTop: "4px solid #F39711" }}
      bgcolor={["#f9cc8a", "#f39711"]}
      contentWrapper
      contentSx={{ pb: 0 }}
    >
      <OnlineSignupChart1 data={data} type="withdrawal" />
    </JumboCard>
  );
};

export { EmailCampaign };

EmailCampaign.propTypes = {
  subheader: PropTypes.node,
};
