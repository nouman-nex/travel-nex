import { JumboDdMenu } from "@jumbo/components/JumboDdMenu";
import {
  Avatar,
  LinearProgress,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import React from "react";
import { menuItems } from "../../data";

const ProjectItem = ({ data }) => {
  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  const totalReferenceTime = 7.5 * 7;
  const currentTimeInHours = data?.time / 3600;
  let percentage = (currentTimeInHours / totalReferenceTime) * 100;
  if (percentage > 100) {
    percentage = 100;
  }
  percentage = percentage.toFixed(2);
  return (
    <React.Fragment>
      <ListItemButton
        component={"li"}
        sx={{
          p: (theme) => theme.spacing(1, 3),
          borderBottom: 1,
          borderBottomColor: "divider",

          "&:last-child": {
            borderBottomColor: "transparent",
          },
        }}
      >
        <ListItemText
          sx={{ width: "50%" }}
          primary={
            <Typography variant="h5" mb={0.5}>
              {data?.app}
            </Typography>
          }
        />
        <Typography>
          {formatTime(data?.time)}
        </Typography>
        <ListItemText sx={{ width: "40%", px: 2 }}>
          <LinearProgress
            variant="determinate"
            color={"success"}
            value={percentage}
          />
        </ListItemText>

      </ListItemButton>
    </React.Fragment>
  );
};
/* Todo project props */
export { ProjectItem };
