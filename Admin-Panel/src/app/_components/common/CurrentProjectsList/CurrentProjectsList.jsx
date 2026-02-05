import { JumboCard, JumboDdMenu, JumboScrollbar } from "@jumbo/components";
import { Box, Chip, ListItemText, Typography } from "@mui/material";
import { ProjectsList } from "./components/ProjectsList";
import PropTypes from "prop-types";
import { menuItems } from "./data";

const CurrentProjectsList = ({ title, subheader, scrollHeight,coreWorkData }) => {
  return (
    <JumboCard
      title={title}
      subheader={subheader}
      contentWrapper
      contentSx={{ p: 0 }}
    >
      <ListItemText sx={{ justifyContent: "flex-end", display: "flex", mt: "-8%" }}>
        <JumboDdMenu menuItems={menuItems} />
      </ListItemText>
      <Box sx={{ display: "flex", px: "6%", borderBottom: "1px solid rgb(219, 219, 219)" }} >
        <Typography sx={{ width: "60%", fontWeight: "500" }}>
          App or site
        </Typography>
        <Typography sx={{ fontWeight: "500" }}>
          Time
        </Typography>
      </Box>
      <JumboScrollbar
        autoHeight
        autoHeightMin={scrollHeight ? scrollHeight : 356}
      >
        <ProjectsList coreWorkData={coreWorkData}/>
      </JumboScrollbar>
    </JumboCard>
  );
};

export { CurrentProjectsList };

CurrentProjectsList.propTypes = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node,
  scrollHeight: PropTypes.number,
};
