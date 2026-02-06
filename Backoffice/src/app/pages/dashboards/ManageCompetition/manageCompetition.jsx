import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Avatar,
  Tab,
  Tabs,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import {
  Edit as EditIcon,
  Close as CloseIcon,
  Upload as UploadIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  MEDIA_BASE_URL,
  postRequest,
} from "../../../../backendServices/ApiCalls";
import DataTable from "@app/_components/table/table";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12;

  return `${month} ${day}, ${year} ${formattedHours}:${minutes} ${ampm}`;
};

// Initial form data
const initialFormData = {
  title: "",
  description: "",
  pictures: [],
  numberOfTickets: 0,
  ticketValue: 0,
  startDateTime: dayjs(),
  endDateTime: dayjs().add(24, "hour"),
  isPublished: false,
  scheduledPublish: false,
  scheduledTime: null,
  featuredImage: "",
  featuredImageFile: null,
  imageFiles: [],
  isFeatured: false,
};

// Helper function to clean image URLs
const cleanImageUrl = (url) => {
  if (!url) return url;
  // Remove MEDIA_BASE_URL if present
  if (url.startsWith("/uploads/")) {
    return url.replace("/uploads/", "");
  }
  // Remove leading slash if present
  return url.startsWith("/") ? url.substring(1) : url;
};

// Media upload component
const MediaUploader = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  selectedTab,
  setSelectedTab,
}) => {
  const [uploadState, setUploadState] = useState({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
    currentFile: null,
    type: null,
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleFileChange = async (e, type = "gallery") => {
    const file = e.target.files[0];
    if (!file) return;

    // Update state based on file type
    if (type === "featured") {
      setFormData((prev) => ({
        ...prev,
        featuredImageFile: file,
      }));
    } else {
      // Initialize imageFiles if not present
      setFormData((prev) => ({
        ...prev,
        imageFiles: Array.isArray(prev.imageFiles)
          ? [...prev.imageFiles, file]
          : [file],
      }));
    }

    // Begin upload process for this file
    await uploadMedia(file, type);
  };

  // Upload media files to server
  const uploadMedia = async (file, type = "gallery") => {
    const mediaData = new FormData();
    mediaData.append("media", file);

    setUploadState({
      uploading: true,
      progress: 0,
      error: null,
      success: false,
      currentFile: file.name,
      type,
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
              type: null,
            });

            // Clean the URL before storing
            const cleanedUrl = cleanImageUrl(response.data.data.mediaUrl);

            // Add URL to appropriate state property
            if (type === "featured") {
              setFormData((prev) => ({
                ...prev,
                featuredImage: cleanedUrl,
              }));
              setFormErrors((prev) => ({ ...prev, featuredImage: null }));
            } else {
              setFormData((prev) => ({
                ...prev,
                pictures: Array.isArray(prev.pictures)
                  ? [...prev.pictures, cleanedUrl]
                  : [cleanedUrl],
              }));
              setFormErrors((prev) => ({ ...prev, pictures: null }));
            }

            // Show success message
            console.log(
              `${type === "featured" ? "Featured image" : "Gallery image"} uploaded successfully`
            );
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
            type: null,
          });
          console.error(
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
        type: null,
      });
      console.error("Failed to upload media");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      pictures: Array.isArray(prev.pictures)
        ? prev.pictures.filter((_, i) => i !== index)
        : [],
      imageFiles: Array.isArray(prev.imageFiles)
        ? prev.imageFiles.filter((_, i) => i !== index)
        : [],
    }));
  };

  const handleRemoveFeaturedImage = () => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: "",
      featuredImageFile: null,
    }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="media tabs"
        >
          <Tab label="Gallery Images" value={0} />
          <Tab label="Featured Image" value={1} />
        </Tabs>
      </Box>

      {/* Gallery Images Tab */}
      {selectedTab === 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Upload and Manage Gallery Images
          </Typography>

          {/* Upload Button */}
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="gallery-file-upload"
            type="file"
            onChange={(e) => handleFileChange(e, "gallery")}
          />
          <label htmlFor="gallery-file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<AddIcon />}
              disabled={uploadState.uploading && uploadState.type === "gallery"}
              sx={{ mb: 2 }}
            >
              {uploadState.uploading && uploadState.type === "gallery" ? (
                <>
                  Uploading... <CircularProgress size={20} sx={{ ml: 1 }} />
                </>
              ) : (
                "Add Gallery Image"
              )}
            </Button>
          </label>

          {formErrors.pictures && (
            <Typography
              variant="caption"
              color="error"
              display="block"
              sx={{ mb: 1 }}
            >
              {formErrors.pictures}
            </Typography>
          )}

          {/* Gallery Images Grid */}
          {Array.isArray(formData.pictures) && formData.pictures.length > 0 ? (
            <Grid container spacing={2}>
              {formData.pictures.map((url, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "75%", // 4:3 Aspect ratio
                      border: "1px solid #ddd",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        url.startsWith("http")
                          ? url
                          : `${MEDIA_BASE_URL}/${url}`
                      }
                      alt={`Gallery ${index + 1}`}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.7)",
                        },
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ my: 2 }}>
              No gallery images uploaded yet.
            </Typography>
          )}
        </Box>
      )}

      {/* Featured Image Tab */}
      {selectedTab === 1 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Upload and Manage Featured Image
          </Typography>

          {/* Upload Button */}
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="featured-file-upload"
            type="file"
            onChange={(e) => handleFileChange(e, "featured")}
          />
          <label htmlFor="featured-file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={formData.featuredImage ? <EditIcon /> : <AddIcon />}
              disabled={
                uploadState.uploading && uploadState.type === "featured"
              }
              sx={{ mb: 2 }}
            >
              {uploadState.uploading && uploadState.type === "featured" ? (
                <>
                  Uploading... <CircularProgress size={20} sx={{ ml: 1 }} />
                </>
              ) : formData.featuredImage ? (
                "Change Featured Image"
              ) : (
                "Add Featured Image"
              )}
            </Button>
          </label>

          {formErrors.featuredImage && (
            <Typography
              variant="caption"
              color="error"
              display="block"
              sx={{ mb: 1 }}
            >
              {formErrors.featuredImage}
            </Typography>
          )}

          {/* Featured Image Preview */}
          {formData.featuredImage ? (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 400,
                paddingTop: "56.25%", // 16:9 Aspect ratio
                border: "1px solid #ddd",
                borderRadius: 1,
                overflow: "hidden",
                mb: 2,
              }}
            >
              <img
                src={
                  formData.featuredImage.startsWith("http")
                    ? formData.featuredImage
                    : `${MEDIA_BASE_URL}/${formData.featuredImage}`
                }
                alt="Featured"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  },
                }}
                onClick={handleRemoveFeaturedImage}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ my: 2 }}>
              No featured image uploaded yet.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

// Snackbar component
const NotificationSnackbar = ({ snackbar, handleClose }) => (
  <Snackbar
    open={snackbar.open}
    autoHideDuration={6000}
    onClose={handleClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <Alert
      onClose={handleClose}
      severity={snackbar.severity}
      variant="filled"
      sx={{ width: "100%" }}
    >
      {snackbar.message}
    </Alert>
  </Snackbar>
);

// Competition Management component
const CompetitionManagement = () => {
  const { User } = useAuth();
  const navigate = useNavigate();
  const featuredFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  // Check if user is admin
  useEffect(() => {
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      if (!roles.includes("Admin")) {
        navigate("/dashboard");
      }
    }
  }, [User, navigate]);

  // State
  const [competitions, setCompetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedTab, setSelectedTab] = useState(0);

  // Fetch competitions
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
          setCompetitions(response.data.data);
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

  // Show snackbar helper
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Form handlers
  const handleEdit = (competition) => {
    // Clean image URLs before setting them in the form
    const cleanedFeaturedImage = cleanImageUrl(competition.featuredImage);

    // Handle pictures array properly and clean each URL
    const cleanedPictures = Array.isArray(competition.pictures)
      ? competition.pictures.map(cleanImageUrl)
      : competition.pictures
        ? [cleanImageUrl(competition.pictures)]
        : [];

    setSelectedCompetition(competition);
    setFormData({
      ...competition,
      pictures: cleanedPictures,
      featuredImage: cleanedFeaturedImage,
      startDateTime: dayjs(competition.startDateTime),
      endDateTime: dayjs(competition.endDateTime),
      scheduledTime: competition.scheduledTime
        ? dayjs(competition.scheduledTime)
        : null,
      imageFiles: [], // Reset image files when editing
      featuredImageFile: null, // Reset featured image file when editing
    });
    setFormModalOpen(true);
    setSelectedTab(0); // Reset to gallery tab when opening modal
  };

  const handleFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field if exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDateChange = (name, value) => {
    if (value) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: null }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    if (!formData.title?.trim()) errors.title = "Title is required";
    if (!formData.description?.trim())
      errors.description = "Description is required";

    // Gallery images validation
    if (!Array.isArray(formData.pictures)) {
      errors.pictures = "Invalid gallery images data";
    } else if (formData.pictures.length === 0) {
      errors.pictures = "At least one gallery image is required";
    }

    // Featured image validation
    if (!formData.featuredImage) {
      errors.featuredImage = "Featured image is required";
    }

    // Number validations
    if (!formData.numberOfTickets || formData.numberOfTickets <= 0) {
      errors.numberOfTickets = "Number of tickets must be positive";
    }
    if (formData.ticketValue < 0) {
      errors.ticketValue = "Ticket value cannot be negative";
    }

    // Date validations
    if (!formData.startDateTime)
      errors.startDateTime = "Start date is required";
    if (!formData.endDateTime) errors.endDateTime = "End date is required";

    if (
      formData.startDateTime &&
      formData.endDateTime &&
      formData.endDateTime.isBefore(formData.startDateTime)
    ) {
      errors.endDateTime = "End date must be after start date";
    }

    // Scheduled time validation
    if (formData.scheduledPublish && !formData.scheduledTime) {
      errors.scheduledTime =
        "Scheduled time is required when scheduled publish is enabled";
    }

    if (
      formData.scheduledPublish &&
      formData.scheduledTime &&
      formData.startDateTime &&
      formData.scheduledTime.isAfter(formData.startDateTime)
    ) {
      errors.scheduledTime = "Scheduled time must be before start date";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const prepareDataForSubmission = () => {
    return {
      ...formData,
      featuredImage: cleanImageUrl(formData.featuredImage),
      pictures: Array.isArray(formData.pictures)
        ? formData.pictures.map(cleanImageUrl)
        : [],
      startDateTime: formData.startDateTime.toISOString(),
      endDateTime: formData.endDateTime.toISOString(),
      scheduledTime: formData.scheduledTime
        ? formData.scheduledTime.toISOString()
        : null,
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // If there are errors with images, switch to the appropriate tab
      if (formErrors.pictures) setSelectedTab(0);
      if (formErrors.featuredImage) setSelectedTab(1);
      return;
    }

    setSubmitting(true);
    const submissionData = prepareDataForSubmission();
    console.log("submimttion data ", submissionData);
    postRequest(
      `/updateCompetition/${selectedCompetition._id}`,
      submissionData,
      (response) => {
        setSubmitting(false);
        if (response.data && response.data.success) {
          showSnackbar("Competition updated successfully!");
          closeFormModal();
          fetchCompetitions();
        } else {
          showSnackbar(response.data?.message || "Update failed", "error");
        }
      },
      (error) => {
        setSubmitting(false);
        showSnackbar(
          error.response?.data?.message || "An error occurred during update",
          "error"
        );
      }
    );
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    setSelectedCompetition(null);
    setFormErrors({});
    setFormData(initialFormData);
    setSelectedTab(0);
  };

  // Table columns definition
  const columns = [
    {
      field: "thumbnail",
      label: "",
      renderCell: (row) => (
        <Avatar
          src={
            row.featuredImage
              ? `${MEDIA_BASE_URL}/${cleanImageUrl(row.featuredImage)}`
              : row.pictures && row.pictures.length > 0
                ? `${MEDIA_BASE_URL}/${cleanImageUrl(row.pictures[0])}`
                : ""
          }
          alt={row.title}
          sx={{ width: 50, height: 50 }}
        >
          {row.title?.charAt(0)}
        </Avatar>
      ),
    },
    { field: "title", label: "Title" },
    {
      field: "description",
      label: "Description",
      renderCell: (row) => (
        <Typography noWrap sx={{ maxWidth: 150 }}>
          {row.description?.length > 50
            ? `${row.description.substring(0, 50)}...`
            : row.description}
        </Typography>
      ),
    },
    {
      field: "startDateTime",
      label: "Start Date",
      renderCell: (row) => formatDate(row.startDateTime),
    },
    {
      field: "endDateTime",
      label: "End Date",
      renderCell: (row) => formatDate(row.endDateTime),
    },
    {
      field: "numberOfTickets",
      label: "Tickets",
      renderCell: (row) =>
        `${row.availableTickets || 0} / ${row.numberOfTickets}`,
    },
    {
      field: "ticketValue",
      label: "Ticket Value",
      renderCell: (row) => `$${row.ticketValue.toFixed(2)}`,
    },
    {
      field: "isPublished",
      label: "Status",
      renderCell: (row) => (
        <Box>
          {row.isPublished ? (
            <Typography color="success.main">Published</Typography>
          ) : row.scheduledPublish ? (
            <Typography color="info.main">Scheduled</Typography>
          ) : (
            <Typography color="text.secondary">Draft</Typography>
          )}
        </Box>
      ),
    },
    {
      field: "actions",
      label: "Actions",
      align: "right",
      renderCell: (row) => (
        <Box>
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            <EditIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <DataTable
        title="Competition Management"
        data={competitions}
        columns={columns}
        loading={isLoading}
        searchPlaceholder="Search competitions..."
        emptyMessage="No competitions found"
      />

      {/* Form Dialog */}
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
        open={formModalOpen}
        onClose={closeFormModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Competition
          <IconButton
            aria-label="close"
            onClick={closeFormModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <Grid container spacing={3}>
                {/* Title */}
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Title"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleFormChange}
                    error={!!formErrors.title}
                    helperText={formErrors.title}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleFormChange}
                    multiline
                    rows={4}
                    error={!!formErrors.description}
                    helperText={formErrors.description}
                  />
                </Grid>

                {/* Media Uploader */}
                <Grid item xs={12}>
                  <MediaUploader
                    formData={formData}
                    setFormData={setFormData}
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                  />
                </Grid>

                {/* Number of Tickets */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Number of Tickets"
                    name="numberOfTickets"
                    value={formData.numberOfTickets || 0}
                    onChange={handleFormChange}
                    InputProps={{ inputProps: { min: 1 } }}
                    error={!!formErrors.numberOfTickets}
                    helperText={
                      formErrors.numberOfTickets || "Must be positive"
                    }
                  />
                </Grid>

                {/* Ticket Value */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Ticket Value"
                    name="ticketValue"
                    value={formData.ticketValue || 0}
                    onChange={handleFormChange}
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                    error={!!formErrors.ticketValue}
                    helperText={formErrors.ticketValue || "Cannot be negative"}
                  />
                </Grid>

                {/* Start Date & Time */}
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Start Date & Time"
                    value={formData.startDateTime}
                    onChange={(newValue) =>
                      handleDateChange("startDateTime", newValue)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!formErrors.startDateTime,
                        helperText: formErrors.startDateTime,
                      },
                    }}
                  />
                </Grid>

                {/* End Date & Time */}
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="End Date & Time"
                    value={formData.endDateTime}
                    onChange={(newValue) =>
                      handleDateChange("endDateTime", newValue)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!formErrors.endDateTime,
                        helperText:
                          formErrors.endDateTime || "Must be after start date",
                      },
                    }}
                  />
                </Grid>

                {/* Status options */}
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isPublished || false}
                        onChange={handleFormChange}
                        name="isPublished"
                        color="primary"
                      />
                    }
                    label="Published"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.scheduledPublish || false}
                        onChange={handleFormChange}
                        name="scheduledPublish"
                        color="primary"
                      />
                    }
                    label="Schedule Publication"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isFeatured || false}
                        onChange={handleFormChange}
                        name="isFeatured"
                        color="primary"
                      />
                    }
                    label="Featured"
                  />
                </Grid>

                {/* Scheduled Time - only shown if scheduledPublish is true */}
                {formData.scheduledPublish && (
                  <Grid item xs={12}>
                    <DateTimePicker
                      label="Scheduled Publication Time"
                      value={formData.scheduledTime}
                      onChange={(newValue) =>
                        handleDateChange("scheduledTime", newValue)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!formErrors.scheduledTime,
                          helperText:
                            formErrors.scheduledTime ||
                            "Must be before start date",
                        },
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeFormModal} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? "Saving..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <NotificationSnackbar
        snackbar={snackbar}
        handleClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default CompetitionManagement;
