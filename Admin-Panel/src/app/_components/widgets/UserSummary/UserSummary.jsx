import { FeaturedCard2 } from "@app/_components/cards/FeaturedCard2/FeaturedCard2";
import { Avatar } from "@mui/material";
import PropTypes from "prop-types";

function UserSummary({ title, subheader, bgColor }) {
  return (
    <FeaturedCard2
      avatar={
        <Avatar
          sx={{
            width: 60,
            height: 60,
            boxShadow: 2,
            position: "relative",
          }}
          src={`/assets/images/avatdar/avatar7.jpg`}
          alt={""}
        />
      }
      title={title}
      subheader={subheader}
      bgcolor={[bgColor]}
    />
  );
}

export { UserSummary };

UserSummary.propTypes = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
  bgColor: PropTypes.string,
};
