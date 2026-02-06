import { JumboCard, JumboScrollbar } from "@jumbo/components";
import { JumboDdMenu } from "@jumbo/components/JumboDdMenu";
import { Article, Refresh } from "@mui/icons-material";
import { Box, Chip, Typography } from "@mui/material";
import React from "react";
import { CampaignsList } from "./components";
import PropTypes from "prop-types";

const MarketingCampaign = ({
  title,
  subheader,
  scrollHeight,
  employeesdata,
}) => {
  return (
    <JumboCard
      title={title}
      subheader={subheader}
      action={
        <React.Fragment>
          {/* <Chip label={"Today"} size={"small"} sx={{ mr: 1 }} /> */}
          <JumboDdMenu
            menuItems={[
              {
                icon: <Refresh sx={{ fontSize: 20 }} />,
                title: "Refresh",
                slug: "refresh",
              },
              {
                icon: <Article sx={{ fontSize: 20 }} />,
                title: "All campaigns",
                slug: "articles",
              },
            ]}
          />
        </React.Fragment>
      }
      contentWrapper={true}
      contentSx={{ p: 0 }}
    >
      <Box
        sx={{
          display: "flex",
          px: "6%",
          pb: "2%",
          borderBottom: "1px solid rgb(219, 219, 219)",
        }}
      >
        <Typography sx={{ width: "55%", fontWeight: "500" }}>
          Member info
        </Typography>
        <Typography sx={{ width: "25%", fontWeight: "500" }}>Today</Typography>
        <Typography sx={{ width: "20%", fontWeight: "500" }}>
          This week
        </Typography>
      </Box>
      <JumboScrollbar
        autoHeight
        autoHeightMin={scrollHeight ? scrollHeight : 300}
      >
        <CampaignsList employeesdata={employeesdata} />
      </JumboScrollbar>
    </JumboCard>
  );
};

export { MarketingCampaign };

MarketingCampaign.propTypes = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
  scrollHeight: PropTypes.number,
};
