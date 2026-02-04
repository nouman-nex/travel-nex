import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Avatar,
  Divider,
  Button,
  CircularProgress,
  Paper,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Star,
  AttachMoney,
  LocalActivity,
  Instagram,
  Refresh,
  Groups,
  MilitaryTech,
  Event,
  AccessTime,
  EmojiEvents,
} from "@mui/icons-material";

import { MEDIA_BASE_URL, postRequest } from "../../../backendServices/ApiCalls";

export default function WonCompetitions() {
  const [competitions, setCompetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = () => {
    setIsLoading(true);
    postRequest(
      "/getWinnedCompetition",
      {},
      (response) => {
        if (response.data && response.data.success) {
          const competitionsWithWinners = response.data.data.filter(
            (comp) => comp.winnerId
          );
          setCompetitions(competitionsWithWinners);
        } else {
          showSnackbar("Failed to fetch competitions data", "error");
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching competitions:", error);
        showSnackbar("Error connecting to the server", "error");
        setIsLoading(false);
      }
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateSoldTickets = (comp) => {
    return comp.numberOfTickets - (comp.availableTickets || 0);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <CircularProgress size={48} sx={{ mb: 2, color: "#1976d2" }} />
        <Typography variant="h6" color="text.secondary">
          Loading your achievements...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 3,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 3,
              }}
            >
              <EmojiEvents sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Victory Gallery
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
              Your remarkable achievements and competition wins
            </Typography>
            {/* <Chip
              icon={<MilitaryTech />}
              label={`${competitions.length} Competitions Won`}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: "bold",
                px: 2,
                py: 1,
              }}
            /> */}
          </Box>
        </Paper>

        {/* Empty State */}
        {competitions.length === 0 && !isLoading && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid #e0e0e0",
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "#f5f5f5",
                mx: "auto",
                mb: 3,
              }}
            >
              <EmojiEvents sx={{ fontSize: 50, color: "#9e9e9e" }} />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              No Victories Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Keep participating in competitions and your wins will appear here.
              <br />
              Every champion started with their first victory!
            </Typography>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchCompetitions}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Refresh Results
            </Button>
          </Paper>
        )}
        {/* Achievement Summary */}
        {competitions.length > 0 && (
          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 3,
              //   background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              fontWeight="bold"
              textAlign="center"
              sx={{ mb: 4 }}
            >
              Achievement Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {competitions.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Victories
                  </Typography>
                </Paper>
              </Grid>
              {/* <Grid item xs={12} sm={6} md={4}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    color: "white",
                  }}
                >
                  <Groups sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {competitions.reduce(
                      (acc, comp) => acc + (calculateSoldTickets(comp) - 1),
                      0
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Competitors Defeated
                  </Typography>
                </Paper>
              </Grid> */}
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    color: "white",
                  }}
                >
                  <AttachMoney sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    $
                    {competitions.reduce(
                      (acc, comp) => acc + comp.ticketValue,
                      0
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Prize Value
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                    color: "white",
                  }}
                >
                  <Star sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {competitions.filter((comp) => comp.isFeatured).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Featured Wins
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        )}
        {/* Competitions Grid */}
        {competitions.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 6 }} mt={4}>
            {competitions.map((competition, index) => (
              <Grid item xs={12} md={6} lg={4} key={competition._id}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`${MEDIA_BASE_URL}/${competition.featuredImage}`}
                      alt={competition.title}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                      }}
                    >
                      <Chip
                        icon={<EmojiEvents />}
                        label="Winner"
                        color="warning"
                        sx={{
                          fontWeight: "bold",
                          color: "white",
                          bgcolor: "#ff9800",
                        }}
                      />
                    </Box>
                    {competition.isFeatured && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                        }}
                      >
                        <Chip
                          icon={<Star />}
                          label="Featured"
                          sx={{
                            fontWeight: "bold",
                            color: "white",
                            bgcolor: "#9c27b0",
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {competition.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {competition.description}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        icon={<AttachMoney />}
                        label={`$${competition.ticketValue}`}
                        variant="outlined"
                        color="success"
                        size="small"
                      />
                      <Chip
                        icon={<LocalActivity />}
                        label={`${competition.numberOfTickets} tickets`}
                        variant="outlined"
                        color="primary"
                        size="small"
                      />
                    </Stack>

                    <Stack spacing={1} sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Groups
                          sx={{ fontSize: 18, color: "text.secondary", mr: 1 }}
                        />
                        {/* <Typography variant="body2" color="text.secondary">
                          {calculateSoldTickets(competition)} participants
                        </Typography> */}
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Event
                          sx={{ fontSize: 18, color: "text.secondary", mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(competition.startDateTime)} -{" "}
                          {formatDate(competition.endDateTime)}
                        </Typography>
                      </Box>
                      {competition.scheduledTime && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AccessTime
                            sx={{
                              fontSize: 18,
                              color: "text.secondary",
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Draw: {formatDateTime(competition.scheduledTime)}
                          </Typography>
                        </Box>
                      )}
                    </Stack>

                    {competition.instagramLiveDrawLink && (
                      <Button
                        variant="outlined"
                        startIcon={<Instagram />}
                        href={competition.instagramLiveDrawLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          mb: 2,
                          borderColor: "#E1306C",
                          color: "#E1306C",
                          "&:hover": {
                            borderColor: "#E1306C",
                            bgcolor: "rgba(225, 48, 108, 0.04)",
                          },
                        }}
                        fullWidth
                      >
                        Watch Live Draw
                      </Button>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "#f8f9fa",
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        <EmojiEvents sx={{ color: "#ff9800", mr: 1 }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                          Victory Achieved
                        </Typography>
                      </Box>
                      {/* <Typography variant="body2" color="text.secondary">
                        Won against {calculateSoldTickets(competition) - 1}{" "}
                        participants
                      </Typography> */}
                    </Paper>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
