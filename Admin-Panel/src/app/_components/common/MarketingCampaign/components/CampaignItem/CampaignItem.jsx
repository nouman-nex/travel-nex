import { Icon } from "@jumbo/components/Icon";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Avatar,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";

const CampaignItem = ({ item }) => {
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  }
  const todayTime = formatTime(item.activity.today.timeWorked.raw);
  const weklyTime = formatTime(item.activity.weekly.timeWorked.raw);
  return (
    <ListItemButton component={"li"} sx={{ p: (theme) => theme.spacing(1, 3) }}>
      <ListItemAvatar>
        <Avatar
          alt={item.name}
          sx={{ color: "common.white", bgcolor: `#1A90FF` }}
        >
          <Icon name="profile-3" />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        sx={{
          flexBasis: "30%",
          maxWidth: "350px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        primary={
          <Typography variant="h5" mb={0.5} noWrap>
            {item.name}
          </Typography>
        }
        secondary={
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
              maxWidth: "100%",
            }}
          >
            {item.projects?.length > 0
              ? item.projects.map((p) => p.name).join(", ")
              : ""}
          </Typography>
        }
      />

      <ListItemText
        primary={
          <Typography
            variant="body1"
            sx={{
              fontSize: 13,
              width: "fit-content",
              backgroundColor: "#3BD2A2",
              borderRadius: 20,
              color: "white",
              px: 0.5,
            }}
          >
            {Math.ceil(item.activity.today.percentage)}%
          </Typography>
        }
        secondary={
          <Typography variant="body1" sx={{ fontSize: 13, pl: 0.5 }}>
            {todayTime}
          </Typography>
        }
      />
      <ListItemText
        primary={
          <Typography
            variant="body1"
            sx={{
              fontSize: 13,
              width: "fit-content",
              backgroundColor: "#3BD2A2",
              borderRadius: 20,
              color: "white",
              px: 0.5,
            }}
          >
            {Math.ceil(item.activity.weekly.percentage)}%
          </Typography>
        }
        secondary={
          <Typography variant="body1" sx={{ fontSize: 13, pl: 0.5 }}>
            {weklyTime}
          </Typography>
        }
      />
      {/* <ListItemText sx={{ alignSelf: "self-start", flexGrow: 0 }}>
        <Typography variant="body1" component={"span"}>
          {item.growth}%
        </Typography>
        {item.growth > 0 ? (
          <TrendingUpIcon
            color="success"
            sx={{ ml: 1, verticalAlign: "middle" }}
            fontSize={"small"}
          />
        ) : (
          <TrendingDownIcon
            color="error"
            sx={{ ml: 1, verticalAlign: "middle" }}
            fontSize={"small"}
          />
        )}
      </ListItemText> */}
    </ListItemButton>
  );
};

export { CampaignItem };
