import React, { useEffect, useState } from "react";
import axios from "axios";
import { JumboCard, JumboDdMenu, JumboScrollbar } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { Box, ListItemText, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ImageList from "@mui/material/ImageList";
import { PictureItem } from "./components/PictureItem";
import {
  API_BASE_URL,
  MEDIA_BASE_URL,
} from "../../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Link } from "react-router-dom";

const menuItems = [
  { title: "Scrum", slug: "scrum" },
  { title: "Team", slug: "team" },
  { title: "Reports", slug: "reports" },
];

const UserPhotos = ({ title, id, selecteduser }) => {
  const [photos, setPhotos] = useState([]);
  const { User } = useAuth();
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/recent/${id}`)
      .then((response) => {
        if (response.data.success) {
          setPhotos(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching photos:", error));
  }, []);

  return (
    <JumboCard title={title} contentWrapper contentSx={{ p: 0 }}>
      <ListItemText
        sx={{ justifyContent: "flex-end", display: "flex", mt: "-8%" }}
      >
        <JumboDdMenu menuItems={menuItems} />
      </ListItemText>

      <Box sx={{ px: "3%", display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <AccountCircleIcon color="primary" fontSize="large" />
          <Typography variant="h4" sx={{ my: "auto" }}>
            {selecteduser.firstname}
          </Typography>
        </Box>
        <Link to="/screenshots">
          <Typography
            variant="body1"
            color="#7352C7"
            sx={{ my: "auto", cursor: "pointer" }}
          >
            View all
          </Typography>
        </Link>
      </Box>

      <JumboScrollbar autoHeight autoHeightMin={320}>
        <Div sx={{ px: 3 }}>
          <ImageList
            cols={3}
            gap={16}
            sx={{ width: "100%", height: "auto", my: 0 }}
          >
            {photos.map((item) => (
              <PictureItem
                key={item._id}
                item={{
                  photo_url: `${MEDIA_BASE_URL}/${item.filename}`,
                  caption: item.appName,
                  activityPercentage: item.activityPercentage,
                }}
              />
            ))}
          </ImageList>
        </Div>
      </JumboScrollbar>
    </JumboCard>
  );
};

export { UserPhotos };
