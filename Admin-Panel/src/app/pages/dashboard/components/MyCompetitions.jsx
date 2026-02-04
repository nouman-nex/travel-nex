import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Button,
  Divider,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  MEDIA_BASE_URL,
  postRequest,
} from "../../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

export default function MyCompetitions() {
  const { User } = useAuth();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (User?._id) {
      fetchMyCompetitions();
    }
  }, [User]);

  const fetchMyCompetitions = () => {
    if (!User?._id) return setLoading(false);

    postRequest(
      "/getCompetitionsOfUser",
      { userId: User._id },
      (response) => {
        if (response.data.success) {
          setCompetitions(response.data.data);
          console.log("Fetched competitions:", response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch competitions");
        }
        setLoading(false);
      },
      (error) => {
        setError("Error fetching your competitions. Please try again later.");
        setLoading(false);
        console.error("Error fetching competitions:", error);
      }
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return theme.palette.success.main;
      case "pending":
        return theme.palette.warning.main;
      case "failed":
        return theme.palette.error.main;
      case "refunded":
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getTotalSpent = (userOrders) => {
    return userOrders.reduce(
      (total, order) => total + (order.totalCost || 0),
      0
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Box
          sx={{
            textAlign: "center",
            py: 8,
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={fetchMyCompetitions}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  if (competitions.length === 0) {
    return (
      <Container>
        <Box
          sx={{
            textAlign: "center",
            py: 8,
          }}
        >
          <EmojiEventsIcon
            sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            You haven't entered any competitions yet
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Explore our active competitions and increase your chances to win
            amazing prizes
          </Typography>
          <Button
            variant="contained"
            href="/dashboard/viewCompetitions"
            color="primary"
          >
            Browse Competitions
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          My Competitions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track all your competition entries and their status
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {competitions.map((competition) => (
          <Grid item xs={12} sm={6} key={competition._id}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                borderRadius: 2,
                overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ position: "relative" }}>
                {competition.featuredImage && (
                  <Box
                    sx={{
                      height: 200,
                      position: "relative",
                    }}
                  >
                    <Box
                      component="img"
                      src={`${MEDIA_BASE_URL}/${competition.featuredImage}`}
                      alt={competition.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                    <Badge
                      badgeContent={competition.userOrders?.length || 0}
                      color="secondary"
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                      }}
                    >
                      <Chip label="Orders" color="primary" />
                    </Badge>
                  </Box>
                )}

                <CardContent>
                  <Typography
                    variant="h5"
                    component="h2"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {competition.title}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ConfirmationNumberIcon
                        sx={{ mr: 1, color: theme.palette.primary.main }}
                      />
                      <Typography variant="body1">
                        {competition.totalTicketsPurchased || 0} Total Tickets
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocalOfferIcon
                        sx={{ mr: 1, color: theme.palette.primary.main }}
                      />
                      <Typography variant="body1" fontWeight="medium">
                        $
                        {getTotalSpent(competition.userOrders || [])?.toFixed(
                          2
                        )}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        View All Orders ({competition.userOrders?.length || 0})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {competition.userOrders?.map((order, index) => (
                        <Box
                          key={order._id}
                          sx={{
                            mb:
                              index !== competition.userOrders.length - 1
                                ? 2
                                : 0,
                          }}
                        >
                          <Box sx={{ mb: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography variant="body2">
                                {order.ticketQuantity} Ticket
                                {order.ticketQuantity > 1 ? "s" : ""}
                                {order.isVipPack && (
                                  <Chip
                                    size="small"
                                    label="VIP Pack"
                                    color="secondary"
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </Typography>
                              <Chip
                                size="small"
                                label={
                                  order.paymentStatus ||
                                  order.status ||
                                  "Unknown"
                                }
                                sx={{
                                  color: "white",
                                  backgroundColor: getStatusColor(
                                    order.paymentStatus || order.status
                                  ),
                                  textTransform: "capitalize",
                                }}
                              />
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatDate(order.createdAt)}
                              </Typography>
                              <Typography variant="body2">
                                ${order.totalCost?.toFixed(2) || "0.00"}
                              </Typography>
                            </Box>
                          </Box>
                          {index !== competition.userOrders.length - 1 && (
                            <Divider sx={{ my: 1 }} />
                          )}
                        </Box>
                      )) || (
                        <Typography variant="body2" color="text.secondary">
                          No orders found for this competition.
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
