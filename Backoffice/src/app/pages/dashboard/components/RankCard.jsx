import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";

import { FeaturedCard3 } from "@app/_components/cards";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { Div } from "@jumbo/shared";

const activeStyle = {
  bgcolor: "#F5F7FA",
  color: "primary.main",

  "&:hover": {
    bgcolor: "#F5F5F5",
  },
};
const defaultStyle = { color: "common.white", bgcolor: "transparent" };

const Rank = ({ title }) => {
  const [isMonthlyPlan, setIsMonthlyPlan] = useState(true);
  return (
    <FeaturedCard3
      sx={{ height: 210 }}
      bgcolor={["-135deg", "#E44A77", "#7352C7"]}
      textColor="common.white"
      avatar={
        <Stack alignItems={"center"}>
          <Div sx={{ mb: 1 }}>
            <img
              src={`${ASSET_IMAGES}/Gold.png`}
              alt={"Pet Insurance"}
              width={140}
              height={140}
            />
          </Div>
        </Stack>
      }
      title={
        <span style={{ fontWeight: 400,fontSize:25 }}>{title}</span>
      }
      // subheader={"Current Level"}
    />
  );
};

export { Rank };
