import { CardIconText } from "@jumbo/shared/CardIconText";
import TouchAppRoundedIcon from "@mui/icons-material/TouchAppRounded";
import { Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
const ObjectCountVisits = ({ subTitle, dashboarddata, type = "" }) => {
  return (
    <CardIconText
     icon={
  type === "profile"
    ? <PeopleAltOutlinedIcon fontSize="large" />
    : <AttachMoneyIcon fontSize="large" />
}

      title={
        <Typography variant={"h4"} color={"success.main"}>
          {Number(dashboarddata).toLocaleString()}
        </Typography>
      }
      subTitle={
        <Typography variant={"h6"} color={"text.secondary"}>
          {subTitle}
        </Typography>
      }
      color={"success.main"}
      disableHoverEffect={true}
      hideArrow={true}
      variant={"outlined"}
    />
  );
};
export { ObjectCountVisits };

ObjectCountVisits.propTypes = {
  subTitle: PropTypes.node,
};
