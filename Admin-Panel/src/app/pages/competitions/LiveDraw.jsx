import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  LinearProgress,
  Card,
  CardMedia,
} from "@mui/material";
import AddLinkIcon from "@mui/icons-material/AddLink";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { MEDIA_BASE_URL, postRequest } from "../../../backendServices/ApiCalls";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  instaVideoLink: Yup.string()
    .url("Enter a valid Instagram URL")
    .matches(
      /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/.*/,
      "Please enter a valid Instagram URL"
    )
    .required("Instagram video link is required"),
});

export default function LiveDraw() {
  const [open, setOpen] = useState(false);
  const [pictureModalOpen, setPictureModalOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [selectedPictureCompetition, setSelectedPictureCompetition] =
    useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadState, setUploadState] = useState({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
    currentFile: null,
  });
  const [winnerImageFile, setWinnerImageFile] = useState(null);
  const [winnerImageUrl, setWinnerImageUrl] = useState(null);

  console.log(winnerImageUrl);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch competitions on component mount
  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = () => {
    setIsLoading(true);
    postRequest(
      "/getCompetitions",
      {},
      (response) => {
        if (response.data && response.data.success) {
          // Filter competitions that have winners but no live draw link yet
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

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpen = (competition) => {
    setSelectedCompetition(competition);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCompetition(null);
  };

  const handlePictureModalOpen = (competition) => {
    setSelectedPictureCompetition(competition);
    setWinnerImageUrl(competition.winnerPicture || null);
    setPictureModalOpen(true);
  };

  const handlePictureModalClose = () => {
    setPictureModalOpen(false);
    setSelectedPictureCompetition(null);
    setWinnerImageFile(null);
    setWinnerImageUrl(null);
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false,
      currentFile: null,
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showSnackbar("Please select a valid image file", "error");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("File size should be less than 5MB", "error");
      return;
    }

    setWinnerImageFile(file);
    await uploadMedia(file);
  };

  const uploadMedia = async (file) => {
    const mediaData = new FormData();
    mediaData.append("media", file);

    setUploadState({
      uploading: true,
      progress: 0,
      error: null,
      success: false,
      currentFile: file.name,
    });

    try {
      postRequest(
        "/upload",
        mediaData,
        (response) => {
          if (response.data.success) {
            setUploadState({
              uploading: false,
              progress: 100,
              error: null,
              success: true,
              currentFile: null,
            });
            setWinnerImageUrl(
              response.data.data.mediaUrl.replace("/uploads", "")
            );
            toast.success("Winner image uploaded successfully");
          } else {
            throw new Error(response.data.message || "Upload failed");
          }
        },
        (error) => {
          console.error("Error uploading media:", error);
          setUploadState({
            uploading: false,
            progress: 0,
            error: error.response?.data?.message || "Failed to upload media",
            success: false,
            currentFile: null,
          });
          toast.error(
            error.response?.data?.message || "Failed to upload media"
          );
        }
      );
    } catch (error) {
      console.error("Error in try/catch block:", error);
      setUploadState({
        uploading: false,
        progress: 0,
        error: "Failed to upload media",
        success: false,
        currentFile: null,
      });
      toast.error("Failed to upload media");
    }
  };

  const handleSaveWinnerPicture = () => {
    if (!winnerImageUrl) {
      showSnackbar("Please upload an image first", "error");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      competitionId: selectedPictureCompetition._id,
      winnerPicture: winnerImageUrl,
    };

    postRequest(
      "/addWinnerPicture",
      payload,
      (response) => {
        if (response.data && response.data.success) {
          showSnackbar("Winner picture added successfully!", "success");

          // Update the local state to reflect the change
          setCompetitions((prev) =>
            prev.map((comp) =>
              comp._id === selectedPictureCompetition._id
                ? { ...comp, winnerPicture: winnerImageUrl }
                : comp
            )
          );

          handlePictureModalClose();
        } else {
          showSnackbar(
            response.data?.message || "Failed to add winner picture",
            "error"
          );
        }
        setIsSubmitting(false);
      },
      (error) => {
        console.error("Error adding winner picture:", error);
        showSnackbar(
          error.response?.data?.message || "Error connecting to the server",
          "error"
        );
        setIsSubmitting(false);
      }
    );
  };

  const handleRemoveImage = () => {
    setWinnerImageFile(null);
    setWinnerImageUrl(null);
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false,
      currentFile: null,
    });
  };

  const handleSubmit = (values, actions) => {
    setIsSubmitting(true);

    const payload = {
      competitionId: selectedCompetition._id,
      link: values.instaVideoLink,
    };

    postRequest(
      "/addLiveDrawLink",
      payload,
      (response) => {
        if (response.data && response.data.success) {
          showSnackbar("Live draw link added successfully!", "success");

          // Update the local state to reflect the change
          setCompetitions((prev) =>
            prev.map((comp) =>
              comp._id === selectedCompetition._id
                ? { ...comp, instagramLiveDrawLink: values.instaVideoLink }
                : comp
            )
          );

          handleClose();
        } else {
          showSnackbar(
            response.data?.message || "Failed to add live draw link",
            "error"
          );
        }
        setIsSubmitting(false);
        actions.setSubmitting(false);
      },
      (error) => {
        console.error("Error adding live draw link:", error);
        showSnackbar(
          error.response?.data?.message || "Error connecting to the server",
          "error"
        );
        setIsSubmitting(false);
        actions.setSubmitting(false);
      }
    );
  };

  const getWinnerNames = (winners) => {
    if (!winners || winners.length === 0) return "No winners";
    if (winners.length === 1) return winners[0].name || winners[0].username;
    return `${winners[0].name || winners[0].username} +${winners.length - 1} more`;
  };

  const getPrizeInfo = (competition) => {
    return competition.prize || competition.title || "Prize not specified";
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Live Draw Management
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Add Instagram live draw links and winner pictures for completed
        competitions
      </Typography>

      {competitions.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No competitions with winners found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Competitions will appear here once they have declared winners
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: 3 }}>
          <List>
            {competitions.map((competition) => (
              <ListItem
                key={competition._id}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: "#f5f5f5",
                  border:
                    competition.instagramLiveDrawLink &&
                    competition.winnerPicture
                      ? "1px solid #4caf50"
                      : "none",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{ display: "flex", width: "100%", alignItems: "center" }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={MEDIA_BASE_URL + "/" + competition.featuredImage}
                      sx={{ bgcolor: "primary.main" }}
                    >
                      {competition.title?.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography fontWeight={600}>
                        {competition.title ||
                          `Competition #${competition._id.slice(-6)}`}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Prize: {getPrizeInfo(competition)}
                        </Typography>
                        {competition.instagramLiveDrawLink && (
                          <Typography
                            variant="body2"
                            color="success.main"
                            sx={{ mt: 0.5 }}
                          >
                            Live draw link: Added ✓
                          </Typography>
                        )}
                        {competition.winnerPicture && (
                          <Typography
                            variant="body2"
                            color="success.main"
                            sx={{ mt: 0.5 }}
                          >
                            Winner picture: Added ✓
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 1, mt: 2, width: "100%" }}>
                  <Button
                    variant="contained"
                    startIcon={<AddLinkIcon />}
                    onClick={() => handleOpen(competition)}
                    size="small"
                  >
                    {competition.instagramLiveDrawLink ? "Change" : "Add"} Live
                    Draw Link
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PhotoCameraIcon />}
                    onClick={() => handlePictureModalOpen(competition)}
                    size="small"
                  >
                    {competition.winnerPicture ? "Change" : "Add"} Winner
                    Picture
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Dialog for adding Instagram link */}
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
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedCompetition?.instagramLiveDrawLink ? "Change" : "Add"}{" "}
          Instagram Live Draw Link
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Formik
          initialValues={{
            instaVideoLink: selectedCompetition?.instagramLiveDrawLink || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values }) => (
            <Form>
              <DialogContent dividers>
                <Typography gutterBottom sx={{ mb: 2 }}>
                  Competition: <strong>{selectedCompetition?.title}</strong>
                </Typography>

                <Field
                  as={TextField}
                  name="instaVideoLink"
                  label="Instagram Video Link"
                  placeholder="https://www.instagram.com/p/..."
                  fullWidth
                  margin="normal"
                  error={
                    touched.instaVideoLink && Boolean(errors.instaVideoLink)
                  }
                  helperText={
                    touched.instaVideoLink && errors.instaVideoLink
                      ? errors.instaVideoLink
                      : "Paste the Instagram post or reel URL of the live draw"
                  }
                  disabled={isSubmitting}
                />
              </DialogContent>

              <DialogActions sx={{ p: 2 }}>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !values.instaVideoLink}
                  startIcon={
                    isSubmitting ? <CircularProgress size={20} /> : null
                  }
                >
                  {isSubmitting ? "Adding..." : "Add Link"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Dialog for adding Winner Picture */}
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
        open={pictureModalOpen}
        onClose={handlePictureModalClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedPictureCompetition?.winnerPicture ? "Change" : "Add"} Winner
          Picture
          <IconButton
            aria-label="close"
            onClick={handlePictureModalClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography gutterBottom sx={{ mb: 2 }}>
            Competition: <strong>{selectedPictureCompetition?.title}</strong>
          </Typography>

          <Box sx={{ mb: 3 }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="winner-image-upload"
              type="file"
              onChange={handleFileSelect}
              disabled={uploadState.uploading}
            />
            <label htmlFor="winner-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCameraIcon />}
                disabled={uploadState.uploading}
                fullWidth
                sx={{ mb: 2 }}
              >
                {uploadState.uploading ? "Uploading..." : "Select Winner Image"}
              </Button>
            </label>

            {uploadState.uploading && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Uploading: {uploadState.currentFile}
                </Typography>
                <LinearProgress />
              </Box>
            )}

            {uploadState.error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {uploadState.error}
              </Alert>
            )}

            {winnerImageUrl && (
              <Card sx={{ mb: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={MEDIA_BASE_URL + "/" + winnerImageUrl}
                  alt="Winner"
                  sx={{ objectFit: "contain" }}
                />
                <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
                  <IconButton
                    onClick={handleRemoveImage}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary">
            Upload a clear image of the winner(s) receiving their prize or
            celebrating their victory.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handlePictureModalClose}
            color="secondary"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveWinnerPicture}
            variant="contained"
            disabled={isSubmitting || !winnerImageUrl}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? "Saving..." : "Save Picture"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
