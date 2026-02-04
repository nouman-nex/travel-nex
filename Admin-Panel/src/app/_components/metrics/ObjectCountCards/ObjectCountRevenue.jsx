import { CardIconText } from "@jumbo/shared/CardIconText";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

const ObjectCountRevenue = ({ subTitle ,balance}) => {
  return (
    <CardIconText
      icon={<AccountBalanceWalletRoundedIcon fontSize="large" />}
      title={
        <Typography variant={"h4"} color={"secondary.main"}>
          {balance ? balance.toFixed(2) : "0.00"}
        </Typography>
      }
      subTitle={
        <Typography variant={"h6"} color={"text.secondary"}>
          {subTitle}
        </Typography>
      }
      color={"secondary.main"}
      disableHoverEffect={true}
      hideArrow={true}
      variant={"outlined"}
    />
  );
};
export { ObjectCountRevenue };

ObjectCountRevenue.propTypes = {
  subTitle: PropTypes.node,
};
