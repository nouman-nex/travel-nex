import { CardIconText } from "@jumbo/shared/CardIconText";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
const ObjectCountOrders = ({ vertical, subTitle, dashboarddata, type = "" }) => {
  return (
    <CardIconText
       icon={
      type === "profile"
        ? <PeopleAltOutlinedIcon fontSize="large" />
        : <ShoppingCartRoundedIcon fontSize="large" />
    }
      title={
        <Typography variant="h4" color="primary.main">
          {Number(dashboarddata).toLocaleString()}
        </Typography>
      }
      subTitle={
        <Typography variant={"h6"} color={"text.secondary"}>
          {subTitle}
        </Typography>
      }
      color={"primary.main"}
      disableHoverEffect={true}
      hideArrow={true}
      variant={"outlined"}
    />
  );
};
export { ObjectCountOrders };

ObjectCountOrders.propTypes = {
  vertical: PropTypes.bool,
  subTitle: PropTypes.node,
};
