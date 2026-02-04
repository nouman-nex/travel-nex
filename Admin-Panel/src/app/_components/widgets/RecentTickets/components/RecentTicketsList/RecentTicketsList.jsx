import List from "@mui/material/List";
import { tickets } from "../../data";
import { RecentClickItem } from "../RecentTicketItem";
import { useEffect, useState } from "react";
import { postRequest } from "../../../../../../backendServices/ApiCalls";
import { Box, Typography } from "@mui/material";

const RecentTicketsList = ({ mints }) => {
  const [lotteryItems, setLotteryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setIsLoading(true);

    postRequest(
      "/getCompetitions",
      {},
      (response) => {
        if (response.data && response.data.success) {
          const now = new Date();

          const competitions = response.data.data;

          const activeCompetitions = competitions.filter(
            (item) => new Date(item.endDateTime) > now
          );

          const expiredCompetitions = competitions.filter(
            (item) => new Date(item.endDateTime) <= now
          );

          // For example, you can store both in state
          setLotteryItems(activeCompetitions); // or use setActiveCompetitions
          // setExpiredCompetitions(expiredCompetitions); // if you want to use expired ones too
        } else {
          setError("Failed to fetch competitions data");
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching competitions:", error);
        setError("Error connecting to the server. Please try again later.");
        setIsLoading(false);
      }
    );
  }, []);
  if (!mints || mints.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No recent activity found.
        </Typography>
      </Box>
    );
  }
  console.log(lotteryItems, "lotteryItems");
  return (
    <List disablePadding sx={{ mb: 1 }}>
      {mints?.map((item, index) => (
        <RecentClickItem item={item} key={index} />
      ))}
    </List>
  );
};

export { RecentTicketsList };
