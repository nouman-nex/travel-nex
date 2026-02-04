import { Box, ImageListItemBar, Typography } from "@mui/material";
import ImageListItem from "@mui/material/ImageListItem";

const PictureItem = ({ item }) => {
  return (
    <ImageListItem
      key={item.photo_url}
      sx={{
        borderRadius: 2,
        overflow: "hidden",

        "& .MuiImageListItemBar-root": {
          transition: "all 0.3s ease",
          transform: "translateY(100%)",
        },

        "&:hover .MuiImageListItemBar-root": {
          transform: "translateY(0)",
        },
        "& .MuiImageListItem-img": {
          aspectRatio: "1/1",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Typography
          sx={{
            color: "white",
            width: "fit-content",
            backgroundColor: "#3BD2A2",
            borderRadius: 20,
            px: 0.5,
            mb: "-5%",
            zIndex: 10,
          }}
        >
          {item.activityPercentage}%
        </Typography>
      </Box>
      <img
        src={`${item.photo_url}?w=248&fit=crop&auto=format`}
        alt={item.caption}
        loading="lazy"
      />
      {/* <ImageListItemBar title={item.caption} subtitle={item.size} /> */}
    </ImageListItem>
  );
};

export { PictureItem };
