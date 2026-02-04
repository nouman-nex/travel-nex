import React, { useEffect, useState } from "react";
import { postRequest } from "../../../backendServices/ApiCalls";
import {
  Avatar,
  Box,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Person as PersonIcon,
  EmojiEvents as TrophyIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import DataTable from "@app/_components/table/table";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";

export default function Winner() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState("");
  const [fetchingCompetitions, setFetchingCompetitions] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    totalParticipants: 0,
    totalTicketsSold: 0,
    totalVipPacks: 0,
  });

  // Winner selection state
  const [openWinnerDialog, setOpenWinnerDialog] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState("");
  const [announcingWinner, setAnnouncingWinner] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [winnerSearchTerm, setWinnerSearchTerm] = useState("");
  const [currentWinnerId, setCurrentWinnerId] = useState(null);
  const [winnerDetails, setWinnerDetails] = useState(null);
  const [title, setTitle] = useState("");
  const { User } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run logic if User is defined (i.e. data has loaded)
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isAdmin = roles.includes("Admin");

      if (!isAdmin) {
        navigate("/dashboard");
      }
    }
  }, [User, navigate]);
  // Fetch available competitions
  useEffect(() => {
    setFetchingCompetitions(true);

    postRequest(
      "/getCompetitions",
      {},
      (response) => {
        if (response.data && response.data.success) {
          const competitionsData = response.data.data;
          setCompetitions(competitionsData);
          setTitle(competitionsData[0]?.title || "Competitions");
          // Set the first competition as default if available
          if (competitionsData.length > 0) {
            setSelectedCompetition(competitionsData[0]._id);
          }
        } else {
          setError("Failed to fetch competitions data");
        }
        setFetchingCompetitions(false);
      },
      (error) => {
        console.error("Error fetching competitions:", error);
        setError("Error connecting to the server. Please try again later.");
        setFetchingCompetitions(false);
      }
    );
  }, []);

  // Fetch participants when selectedCompetition changes
  useEffect(() => {
    if (selectedCompetition) {
      fetchParticipants(selectedCompetition);
    }
  }, [selectedCompetition]);

  const fetchParticipants = (competitionId) => {
    setLoading(true);
    setParticipants([]);
    setCurrentWinnerId(null);
    setWinnerDetails(null);

    postRequest(
      "/getParticipants",
      {
        competitionId: competitionId,
      },
      (res) => {
        console.log("API Response:", res);
        if (res && res.data && res.data.success && res.data.data) {
          // Store the winnerId if available
          if (res.data.data.winnerId) {
            setCurrentWinnerId(res.data.data.winnerId);
          }

          const participantsWithId = res.data.data.participants.map(
            (participant, index) => {
              const isWinner = participant.buyerId === res.data.data.winnerId;

              // Store winner details if this participant is the winner
              if (isWinner) {
                setWinnerDetails({
                  firstName: participant.firstName,
                  lastName: participant.lastName,
                  email: participant.email,
                  profileImg: participant.profileImg,
                });
              }

              return {
                ...participant,
                id:
                  participant.buyerId || participant.email || index.toString(),
                isWinner: isWinner,
              };
            }
          );

          setParticipants(participantsWithId);
          setSummary(res.data.data.summary);

          // Reset selected winner when participants change
          setSelectedWinner("");
        } else {
          console.error(
            "Failed to fetch participants or unexpected response structure:",
            res
          );
          setError("Failed to load participants data");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching participants:", error);
        setError("Error loading participants. Please try again.");
        setLoading(false);
      }
    );
  };

  const handleCompetitionChange = (event) => {
    setSelectedCompetition(event.target.value);
    setTitle(
      competitions.find((comp) => comp._id === event.target.value)?.title ||
        "Competitions"
    );
  };

  const handleWinnerSelectChange = (event) => {
    setSelectedWinner(event.target.value);
    // When a winner is selected in the dropdown, also update the search term
    // to match the selected participant's name
    const selectedParticipant = participants.find(
      (p) => p.buyerId === event.target.value || p.id === event.target.value
    );
    if (selectedParticipant) {
      setWinnerSearchTerm(
        `${selectedParticipant.firstName} ${selectedParticipant.lastName}`
      );
    }
  };

  const handleWinnerSearchChange = (event) => {
    setWinnerSearchTerm(event.target.value);
    // If search is cleared, also clear the selected winner
    if (!event.target.value) {
      setSelectedWinner("");
    }
  };

  const handleOpenWinnerDialog = () => {
    if (currentWinnerId) {
      setNotification({
        open: true,
        message: "A winner has already been selected for this competition",
        severity: "info",
      });
      return;
    }
    setOpenWinnerDialog(true);
    setWinnerSearchTerm("");
    setSelectedWinner("");
  };

  const handleCloseWinnerDialog = () => {
    setOpenWinnerDialog(false);
  };

  const handleAnnounceWinner = () => {
    if (!selectedWinner || !selectedCompetition) {
      setNotification({
        open: true,
        message: "Please select a winner first",
        severity: "warning",
      });
      return;
    }

    setAnnouncingWinner(true);
    console.log("comp id ", selectedCompetition);
    console.log("winner id (buyerId) ", selectedWinner);

    postRequest(
      "/announceWinner",
      {
        competitionId: selectedCompetition,
        winnerId: selectedWinner,
      },
      (response) => {
        if (response.data && response.data.success) {
          setNotification({
            open: true,
            message: "Winner announced successfully!",
            severity: "success",
          });
          // Refresh participants to show updated winner status
          fetchParticipants(selectedCompetition);
        } else {
          setNotification({
            open: true,
            message: response.data?.message || "Failed to announce winner",
            severity: "error",
          });
        }
        setAnnouncingWinner(false);
        setOpenWinnerDialog(false);
      },
      (error) => {
        console.error("Error announcing winner:", error);
        setNotification({
          open: true,
          message: "Error connecting to the server. Please try again.",
          severity: "error",
        });
        setAnnouncingWinner(false);
      }
    );
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  // Find the currently selected competition object
  const currentCompetition = competitions.find(
    (comp) => comp._id === selectedCompetition
  );

  // Filter participants for the winner selection dropdown
  const filteredParticipants = participants.filter((participant) => {
    const fullName =
      `${participant.firstName} ${participant.lastName} ${participant.email}`.toLowerCase();
    return fullName.includes(winnerSearchTerm.toLowerCase());
  });

  // Function to generate CSV export data with repeated entries based on tickets
  const generateCsvExportData = (row) => {
    // Create an array to hold the repeated entries
    const exportEntries = [];

    // Get the number of tickets for this participant
    const ticketCount = row.totalTickets || 0;

    // Get current date and time as string
    const currentDateTime = new Date().toLocaleString();

    // Create repeated entries based on ticket count
    for (let i = 0; i < ticketCount; i++) {
      exportEntries.push({
        Username:
          row.username ||
          `${row.firstName.toLowerCase()}${row.lastName.toLowerCase()}`,
        "Full Name": `${row.firstName} ${row.lastName}`,
        Email: row.email,
        Mobile: row.phone || "",
        Date: currentDateTime,
        "Ticket #": `${i + 1} of ${ticketCount}`,
        "Is Winner": row.buyerId === currentWinnerId ? "WINNER" : "",
      });
    }

    return exportEntries;
  };

  // Define columns for the DataTable
  const columns = [
    {
      field: "isWinner", // Moving winner status to first column for prominence
      label: "Winner",
      align: "center",
      renderCell: (row) => {
        if (row.buyerId === currentWinnerId) {
          return (
            <Chip
              icon={<TrophyIcon />}
              label="WINNER"
              sx={{
                backgroundColor: "gold",
                color: "black",
                fontWeight: "bold",
                fontSize: "0.9rem",
                px: 1,
                py: 2.5,
              }}
            />
          );
        }
        return null;
      },
      exportValue: (row) => (row.buyerId === currentWinnerId ? "WINNER" : ""),
      exportTransform: generateCsvExportData, // Custom export transform function
    },
    {
      field: "profileImg",
      label: "User",
      align: "left",
      renderCell: (row) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor:
              row.buyerId === currentWinnerId
                ? "rgba(255, 215, 0, 0.1)"
                : "transparent",
            borderRadius: 1,
            p: row.buyerId === currentWinnerId ? 1 : 0,
          }}
        >
          {row.profileImg ? (
            <Avatar
              src={row.profileImg}
              alt={row.firstName}
              sx={
                row.buyerId === currentWinnerId
                  ? {
                      border: "2px solid gold",
                      boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
                    }
                  : {}
              }
            />
          ) : (
            <Avatar
              sx={
                row.buyerId === currentWinnerId
                  ? {
                      border: "2px solid gold",
                      boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
                      bgcolor:
                        row.buyerId === currentWinnerId ? "gold" : undefined,
                      color:
                        row.buyerId === currentWinnerId ? "black" : undefined,
                    }
                  : {}
              }
            >
              <PersonIcon />
            </Avatar>
          )}
          <Box sx={{ ml: 2 }}>
            <Typography
              variant="body2"
              fontWeight={row.buyerId === currentWinnerId ? "bold" : "normal"}
              color={
                row.buyerId === currentWinnerId
                  ? "warning.dark"
                  : "text.primary"
              }
            >
              {row.firstName} {row.lastName}
              {row.buyerId === currentWinnerId && " 🏆"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
      exportValue: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      field: "totalTickets",
      label: "Tickets",
      align: "center",
      renderCell: (row) => (
        <Chip
          label={row.totalTickets}
          color={row.buyerId === currentWinnerId ? "warning" : "primary"}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "country",
      label: "Country",
      align: "left",
    },
    {
      field: "city",
      label: "City",
      align: "left",
    },
    {
      field: "phone",
      label: "Phone",
      align: "left",
    },
    {
      field: "buyerId",
      label: "Buyer ID",
      align: "left",
    },
    {
      field: "isKycVerified",
      label: "KYC Status",
      align: "center",
      renderCell: (row) => (
        <Chip
          label={row.isKycVerified ? "Verified" : "Not Verified"}
          color={row.isKycVerified ? "success" : "warning"}
          size="small"
        />
      ),
      exportValue: (row) => (row.isKycVerified ? "Verified" : "Not Verified"),
    },
    {
      field: "orders",
      label: "Orders",
      align: "center",
      renderCell: (row) => (
        <Chip
          label={row.orders.length}
          color="secondary"
          variant="outlined"
          size="small"
        />
      ),
      exportValue: (row) => row.orders.length,
    },
    {
      field: "vipPacks",
      label: "VIP Packs",
      align: "center",
      renderCell: (row) => {
        const vipOrders = row.orders.filter((order) => order.isVipPack);
        return (
          <Chip
            label={vipOrders.length}
            color={vipOrders.length > 0 ? "secondary" : "default"}
            size="small"
          />
        );
      },
      exportValue: (row) =>
        row.orders.filter((order) => order.isVipPack).length,
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Competition Participants
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Competition Selector */}
            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel id="competition-select-label">
                Select Competition
              </InputLabel>
              <Select
                labelId="competition-select-label"
                id="competition-select"
                value={selectedCompetition}
                label="Select Competition"
                onChange={handleCompetitionChange}
                disabled={fetchingCompetitions}
                startAdornment={
                  fetchingCompetitions ? (
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                  ) : null
                }
              >
                {competitions.map((competition) => (
                  <MenuItem key={competition._id} value={competition._id}>
                    {competition.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Winner Selection Button */}
            <Button
              variant="contained"
              color="warning"
              startIcon={<TrophyIcon />}
              onClick={handleOpenWinnerDialog}
              disabled={
                !selectedCompetition ||
                loading ||
                participants.length === 0 ||
                currentWinnerId !== null
              }
              sx={{
                backgroundColor: currentWinnerId ? "gray" : "gold",
                color: "black",
                "&:hover": {
                  backgroundColor: currentWinnerId ? "gray" : "darkgoldenrod",
                },
              }}
            >
              {currentWinnerId ? "Winner Selected" : "Select Winner"}
            </Button>
          </Box>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Winner Banner when a winner exists */}
        {winnerDetails && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255, 215, 0, 0.15)",
              border: "1px solid gold",
              borderRadius: 2,
              p: 2,
              mb: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <TrophyIcon sx={{ color: "gold", fontSize: 40, mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color="warning.dark" fontWeight="bold">
                Competition Winner
              </Typography>
              <Typography variant="body1">
                {winnerDetails.firstName} {winnerDetails.lastName} (
                {winnerDetails.email})
              </Typography>
            </Box>
            {winnerDetails.profileImg ? (
              <Avatar
                src={winnerDetails.profileImg}
                alt={`${winnerDetails.firstName} ${winnerDetails.lastName}`}
                sx={{
                  width: 56,
                  height: 56,
                  border: "2px solid gold",
                  ml: 2,
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: "gold",
                  color: "black",
                  border: "2px solid gold",
                  ml: 2,
                }}
              >
                <PersonIcon />
              </Avatar>
            )}
          </Box>
        )}

        {/* Summary cards with flex layout */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            mb: 3,
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 1,
              flex: "1 1 0",
              minWidth: 200,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Total Participants
            </Typography>
            <Typography variant="h4">
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                summary.totalParticipants
              )}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 1,
              flex: "1 1 0",
              minWidth: 200,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Tickets Sold
            </Typography>
            <Typography variant="h4">
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                summary.totalTicketsSold
              )}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 1,
              flex: "1 1 0",
              minWidth: 200,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              VIP Packs
            </Typography>
            <Typography variant="h4">
              {loading ? <CircularProgress size={24} /> : summary.totalVipPacks}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DataTable
        title={title}
        data={participants}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search participants..."
        emptyMessage={
          selectedCompetition
            ? "No participants found for this competition"
            : "Please select a competition to view participants"
        }
        onRowClick={(row) => {
          console.log("Participant details:", row);
          // You can add functionality to show detailed info about a participant here
        }}
        exportTransformMode="flat" // Use flat mode to handle the array of entries from each row
      />

      {/* Winner Selection Dialog */}
      <Dialog
        PaperProps={{
          sx: {
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(139, 69, 19, 0.15)",
            border: "1px solid rgba(218, 165, 32, 0.2)",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(255, 248, 220, 0.7), rgba(245, 222, 179, 0.3))",
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(5px)",
          },
        }}
        open={openWinnerDialog}
        onClose={handleCloseWinnerDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrophyIcon sx={{ color: "gold" }} />
            <Typography variant="h6">
              Select Winner for {currentCompetition?.title || "Competition"}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please select a participant to be announced as the winner of this
              competition. This action will update the winner status in the
              database.
            </Typography>

            {/* Searchable select for winner selection */}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="winner-select-label">
                Search and Select Winner
              </InputLabel>
              <Select
                labelId="winner-select-label"
                id="winner-select"
                value={selectedWinner}
                label="Search and Select Winner"
                onChange={handleWinnerSelectChange}
                disabled={loading || participants.length === 0}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                    <TextField
                      placeholder="Type to search..."
                      size="small"
                      value={winnerSearchTerm}
                      onChange={handleWinnerSearchChange}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      sx={{
                        width: "140px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                      variant="standard"
                    />
                  </InputAdornment>
                }
              >
                {filteredParticipants.map((participant) => (
                  <MenuItem
                    key={participant.id}
                    value={participant.buyerId || participant.id}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="body1">
                        {participant.firstName} {participant.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {participant.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWinnerDialog} disabled={announcingWinner}>
            Cancel
          </Button>
          <Button
            onClick={handleAnnounceWinner}
            variant="contained"
            color="warning"
            disabled={!selectedWinner || announcingWinner}
            startIcon={
              announcingWinner ? <CircularProgress size={20} /> : <TrophyIcon />
            }
            sx={{
              backgroundColor: "gold",
              color: "black",
              "&:hover": {
                backgroundColor: "darkgoldenrod",
              },
            }}
          >
            Announce Winner
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
