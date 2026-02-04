import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import { MEDIA_BASE_URL } from "../../../../../../backendServices/ApiCalls";

const ConnectionItem = ({ item, handleFollowToggle }) => {
  return (
    <ListItem sx={{ p: (theme) => theme.spacing(1, 3) }}>
      {item.image && (
        <ListItemAvatar>
          <Avatar src={`${MEDIA_BASE_URL}/${item.image}`} alt={item.image} />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={
          <Typography variant="h5" mb={0.5}>
            {item.title}
          </Typography>
        }
        secondary={"@" + item.subtitle}
      />
      {/* <Button
        size={"small"}
        variant={"contained"}
        disableElevation
        onClick={() => handleFollowToggle(item)}
        {...(item.follow ? { color: "inherit" } : { color: "success" })}
        sx={{
          minWidth: 78,
          textTransform: "none",
          p: (theme) => theme.spacing(0.5, 1.5),
        }}
      >
        {item.follow ? "Unfollow" : "Follow"}
      </Button> */}
    </ListItem>
  );
};
/* Todo item, handleFollowToggle prop define */
export { ConnectionItem };
