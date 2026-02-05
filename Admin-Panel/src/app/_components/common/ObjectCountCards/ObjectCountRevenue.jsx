import { CardIconText } from "@jumbo/shared/CardIconText";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
const ObjectCountRevenue = ({ subTitle,dashboarddata ,type = ""}) => {
  return (
    <CardIconText
      icon={
  type === "profile"
    ? <PeopleAltOutlinedIcon fontSize="large" />
    : <AttachMoneyIcon fontSize="large" />
}

      title={
        <Typography variant={"h4"} color={"secondary.main"}>
          {Number(dashboarddata).toLocaleString()}
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
