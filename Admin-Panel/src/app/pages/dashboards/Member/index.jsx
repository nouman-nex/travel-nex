import { CONTAINER_MAX_WIDTH } from "@app/_config/layouts";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import { postRequest } from "../../../../backendServices/ApiCalls";

// Icons
import AssignmentIcon from "@mui/icons-material/Assignment";
import ImageIcon from "@mui/icons-material/Image";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PublishIcon from "@mui/icons-material/Publish";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ErrorIcon from "@mui/icons-material/Error";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";

// MUI Components
import {
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Box,
  Divider,
  InputAdornment,
  Paper,
  Card,
  CardContent,
  Collapse,
  LinearProgress,
  CircularProgress,
  IconButton,
} from "@mui/material";

// Initial form state
const initialFormState = {
  title: "",
  description: "",
  numberOfTickets: "",
  ticketValue: "20",
  startDateTime: "",
  endDateTime: "",
  publishNow: false,
  scheduledPublish: false,
  scheduledDateTime: "",
  pictures: [], // Array of URLs
  imageFiles: [], // Array of File objects
  featuredImage: "", // New field for featured image URL
  featuredImageFile: null, // New field for featured image File object
  featured: false,
};

// Form field configurations for reusability
const formFields = {
  title: {
    label: "Competition Title",
    required: true,
    icon: <AssignmentIcon color="action" />,
    gridWidth: { xs: 12, md: 6 },
  },
  description: {
    label: "Description",
    required: true,
    multiline: true,
    rows: 4,
    placeholder: "Enter detailed description of the competition...",
    gridWidth: { xs: 12 },
  },
  numberOfTickets: {
    label: "Number of Tickets",
    required: true,
    type: "number",
    icon: <ConfirmationNumberIcon color="action" />,
    gridWidth: { xs: 12, md: 6 },
  },
  ticketValue: {
    label: "Ticket Value",
    required: true,
    type: "number",
    icon: <AttachMoneyIcon color="action" />,
    gridWidth: { xs: 12, md: 6 },
  },
  startDateTime: {
    label: "Competition Start Date & Time",
    required: true,
    type: "datetime-local",
    icon: <CalendarTodayIcon color="action" />,
    gridWidth: { xs: 12, md: 6 },
  },
  endDateTime: {
    label: "Competition End Date & Time",
    required: true,
    type: "datetime-local",
    icon: <CalendarTodayIcon color="action" />,
    gridWidth: { xs: 12, md: 6 },
  },
  scheduledDateTime: {
    label: "Schedule Publication Date & Time",
    type: "datetime-local",
    icon: <CalendarTodayIcon color="action" />,
    gridWidth: { xs: 12 },
  },
};

const CompetitionForm = () => {
  const { User } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const featuredFileInputRef = useRef(null);

  // State
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [uploadState, setUploadState] = useState({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
    currentFile: null,
    type: null, // 'featured' or 'gallery'
  });

  // Check if user is admin
  useEffect(() => {
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      if (!roles.includes("Admin")) navigate("/dashboard");
    }
  }, [User, navigate]);

  // Form validation
  const validateForm = () => {
    const errors = {};

    // Required fields validation
    Object.entries(formFields).forEach(([name, config]) => {
      if (config.required && !formData[name]) {
        errors[name] = `${config.label} is required`;
      }
    });

    // Gallery images validation
    if (formData.pictures.length === 0) {
      errors.pictures = "At least one gallery image is required";
    }

    // Featured image validation
    if (!formData.featuredImage) {
      errors.featuredImage = "Featured image is required";
    }

    // Date validation
    if (isPastDateTime(formData.startDateTime)) {
      errors.startDateTime = "Start date cannot be in the past";
    }

    if (new Date(formData.endDateTime) <= new Date(formData.startDateTime)) {
      errors.endDateTime = "End date must be after start date";
    }

    // Publication options validation
    if (!formData.publishNow && !formData.scheduledPublish) {
      errors.publish = "Please select either Publish Now or Scheduled Publish";
    }

    if (formData.scheduledPublish) {
      if (!formData.scheduledDateTime) {
        errors.scheduledDateTime = "Scheduled date and time is required";
      } else if (isPastDateTime(formData.scheduledDateTime)) {
        errors.scheduledDateTime =
          "Scheduled publish date cannot be in the past";
      } else if (
        new Date(formData.scheduledDateTime) >= new Date(formData.startDateTime)
      ) {
        errors.scheduledDateTime =
          "Scheduled publish date must be before the competition start date";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Utility function to check if date is in the past
  const isPastDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return false;
    const selectedDate = new Date(dateTimeStr);
    const now = new Date();
    return selectedDate < now;
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      handleCheckboxChange(e);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle checkbox state changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (name === "publishNow" && checked) {
      setFormData({
        ...formData,
        publishNow: checked,
        scheduledPublish: false,
        scheduledDateTime: "",
      });
    } else if (name === "scheduledPublish" && checked) {
      setFormData({
        ...formData,
        scheduledPublish: checked,
        publishNow: false,
      });
    } else {
      setFormData({ ...formData, [name]: checked });
    }
  };

  // Handle file selection for gallery images
  const handleFileSelect = async (e, type = "gallery") => {
    const file = e.target.files[0];
    if (!file) return;

    // Update state based on file type
    if (type === "featured") {
      setFormData((prev) => ({
        ...prev,
        featuredImageFile: file,
      }));
    } else {
      // Add the file to the gallery files array
      setFormData((prev) => ({
        ...prev,
        imageFiles: [...prev.imageFiles, file],
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

            // Add URL to appropriate state property
            if (type === "featured") {
              setFormData((prev) => ({
                ...prev,
                featuredImage: response.data.data.mediaUrl,
              }));
              setFormErrors((prev) => ({ ...prev, featuredImage: null }));
            } else {
              setFormData((prev) => ({
                ...prev,
                pictures: [...prev.pictures, response.data.data.mediaUrl],
              }));
              setFormErrors((prev) => ({ ...prev, pictures: null }));
            }

            toast.success(
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
        type: null,
      });
      toast.error("Failed to upload media");
    }
  };

  // Remove image from gallery
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      pictures: prev.pictures.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  // Remove featured image
  const handleRemoveFeaturedImage = () => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: "",
      featuredImageFile: null,
    }));

    if (featuredFileInputRef.current) {
      featuredFileInputRef.current.value = "";
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    // Create data object with proper data types
    const competitionData = {
      title: formData.title,
      description: formData.description,
      numberOfTickets: formData.numberOfTickets,
      ticketValue: formData.ticketValue,
      startDateTime: formData.startDateTime,
      endDateTime: formData.endDateTime,
      publishNow: formData.publishNow.toString(),
      scheduledPublish: formData.scheduledPublish.toString(),
      scheduledDateTime: formData.scheduledDateTime,
      pictures: formData.pictures,
      featuredImage: formData.featuredImage,
      featured: formData.featured,
    };

    const loadingToast = toast.loading("Creating competition...");

    postRequest(
      "/competitions",
      competitionData,
      (response) => {
        toast.update(loadingToast, {
          render: "Competition created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        if (formData.scheduledPublish) {
          toast.info(
            `Competition will be published on ${new Date(formData.scheduledDateTime).toLocaleString()}`
          );
        }

        // Reset form
        setFormData(initialFormState);
        setUploadState({
          uploading: false,
          progress: 0,
          error: null,
          success: false,
          currentFile: null,
          type: null,
        });

        // Reset file inputs
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (featuredFileInputRef.current)
          featuredFileInputRef.current.value = "";
      },
      (error) => {
        toast.update(loadingToast, {
          render:
            error?.response?.data?.message || "Failed to create competition",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        console.error(error);
      }
    );
  };

  // Media upload status display component
  const MediaUploadStatus = () => {
    if (!uploadState.uploading) return null;

    return (
      <Box sx={{ width: "100%", mt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography variant="body2" color="primary" sx={{ mr: 1 }}>
            Uploading{" "}
            {uploadState.type === "featured"
              ? "featured image"
              : "gallery image"}{" "}
            {uploadState.currentFile}: {uploadState.progress}%
          </Typography>
          <CircularProgress size={16} />
        </Box>
        <LinearProgress variant="determinate" value={uploadState.progress} />
      </Box>
    );
  };

  // Error display component
  const ErrorDisplay = ({ message }) => {
    if (!message) return null;

    return (
      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <ErrorIcon color="error" fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="body2" color="error">
          {message}
        </Typography>
      </Box>
    );
  };

  // Render text field with consistent styling
  const renderTextField = (name, additionalProps = {}) => {
    const field = formFields[name];
    if (!field) return null;

    return (
      <Grid item {...field.gridWidth}>
        <TextField
          fullWidth
          label={field.label}
          name={name}
          type={field.type || "text"}
          value={formData[name]}
          onChange={handleChange}
          error={!!formErrors[name]}
          helperText={formErrors[name]}
          required={field.required}
          variant="outlined"
          multiline={field.multiline}
          rows={field.rows}
          placeholder={field.placeholder}
          InputLabelProps={
            field.type === "datetime-local" ? { shrink: true } : undefined
          }
          InputProps={
            field.icon
              ? {
                  startAdornment: (
                    <InputAdornment position="start">
                      {field.icon}
                    </InputAdornment>
                  ),
                }
              : undefined
          }
          {...additionalProps}
        />
      </Grid>
    );
  };

  // Image upload button component
  const ImageUploadButton = ({ type, error, fileRef }) => {
    const isFeatured = type === "featured";
    const label = isFeatured ? "Upload Featured Image" : "Upload Gallery Image";
    const errorMsg = isFeatured
      ? formErrors.featuredImage
      : formErrors.pictures;
    const isUploading = uploadState.uploading && uploadState.type === type;

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            color={errorMsg ? "error" : "primary"}
            startIcon={
              isUploading ? (
                <CircularProgress size={20} />
              ) : isFeatured ? (
                <StarIcon />
              ) : (
                <CloudUploadIcon />
              )
            }
            sx={{ height: "56px", justifyContent: "flex-start" }}
            disabled={uploadState.uploading}
          >
            {label}
            <input
              ref={fileRef}
              type="file"
              hidden
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(e) => handleFileSelect(e, type)}
            />
          </Button>
          {errorMsg && <FormHelperText error>{errorMsg}</FormHelperText>}
          {isUploading && <MediaUploadStatus />}
          <ErrorDisplay message={uploadState.error} />
        </Box>
      </Box>
    );
  };

  // Display uploaded images
  const ImagePreview = ({ type }) => {
    const isFeatured = type === "featured";
    const images = isFeatured
      ? formData.featuredImageFile
        ? [formData.featuredImageFile]
        : []
      : formData.imageFiles;
    const uploadedUrls = isFeatured
      ? formData.featuredImage
        ? [formData.featuredImage]
        : []
      : formData.pictures;

    if (images.length === 0) return null;

    return (
      <Grid item xs={12}>
        <Typography variant="subtitle2" mb={1}>
          {isFeatured
            ? "Featured Image"
            : `Gallery Images (${uploadedUrls.length})`}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mt: 1,
          }}
        >
          {images.map((file, index) => (
            <Paper
              key={index}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {isFeatured ? (
                <StarIcon
                  color={formData.featuredImage ? "success" : "action"}
                  fontSize="small"
                />
              ) : (
                <ImageIcon
                  color={index < uploadedUrls.length ? "success" : "action"}
                  fontSize="small"
                />
              )}
              <Typography variant="body2" noWrap sx={{ maxWidth: "150px" }}>
                {file.name}
              </Typography>
              {/* Show remove button for uploaded images */}
              {(isFeatured && formData.featuredImage) ||
              (!isFeatured && index < uploadedUrls.length) ? (
                <IconButton
                  size="small"
                  onClick={() =>
                    isFeatured
                      ? handleRemoveFeaturedImage()
                      : handleRemoveImage(index)
                  }
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              ) : null}
            </Paper>
          ))}
        </Box>
      </Grid>
    );
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: CONTAINER_MAX_WIDTH,
        display: "flex",
        minWidth: 0,
        flex: 1,
        flexDirection: "column",
      }}
      disableGutters
    >
      <Card
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          maxWidth: "900px",
          mx: "auto",
          width: "100%",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" fontWeight="500">
              Competition Details
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Fill in the information below to create a new competition
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Title Field */}
                {renderTextField("title")}

                {/* Featured Image Upload */}
                <Grid item xs={12} md={6}>
                  <ImageUploadButton
                    type="featured"
                    error={formErrors.featuredImage}
                    fileRef={featuredFileInputRef}
                  />
                  <span>
                    Features images will show at the main page Only PNG, JPEG,
                    and MP4 video files are allowed.
                  </span>
                </Grid>
                {/* Featured Image Preview */}
                <ImagePreview type="featured" />

                {/* Gallery Image Upload */}
                <Grid item xs={12} md={6}>
                  <ImageUploadButton
                    type="gallery"
                    error={formErrors.pictures}
                    fileRef={fileInputRef}
                  />
                </Grid>

                {/* Gallery Images Preview */}
                <ImagePreview type="gallery" />

                {/* Description */}
                {renderTextField("description")}

                {/* Ticket fields */}
                {renderTextField("numberOfTickets")}
                {renderTextField("ticketValue")}

                {/* Date fields */}
                {renderTextField("startDateTime")}
                {renderTextField("endDateTime")}

                {/* Publication Options */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PublishIcon color="primary" />
                      <Typography variant="subtitle1" fontWeight="500">
                        Publication Options
                      </Typography>
                    </Stack>
                  </Box>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                    <Stack direction="row" spacing={4}>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="featured"
                              checked={formData.featured}
                              onChange={handleChange}
                              color="primary"
                            />
                          }
                          label={
                            <Typography variant="body1">
                              Feature this competition
                            </Typography>
                          }
                        />
                        <FormHelperText>
                          Featured competitions will be highlighted on the
                          homepage
                        </FormHelperText>
                      </Grid>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="publishNow"
                            checked={formData.publishNow}
                            onChange={handleCheckboxChange}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body1">Publish Now</Typography>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="scheduledPublish"
                            checked={formData.scheduledPublish}
                            onChange={handleCheckboxChange}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body1">
                            Scheduled Publish
                          </Typography>
                        }
                      />
                    </Stack>

                    {/* Schedule picker */}
                    <Collapse in={formData.scheduledPublish}>
                      <Box sx={{ mt: 2, mb: 1 }}>
                        {renderTextField("scheduledDateTime", {
                          required: formData.scheduledPublish,
                        })}
                      </Box>
                    </Collapse>

                    {formErrors.publish && (
                      <FormHelperText error sx={{ mt: 1 }}>
                        {formErrors.publish}
                      </FormHelperText>
                    )}
                  </Paper>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      size="large"
                      sx={{ px: 4, py: 1.5, borderRadius: 1 }}
                      startIcon={<AddIcon />}
                      disabled={
                        uploadState.uploading ||
                        formData.pictures.length === 0 ||
                        !formData.featuredImage
                      }
                    >
                      Create Competition
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </form>
        </CardContent>
      </Card>
      <ToastContainer position="bottom-right" />
    </Container>
  );
};

export default CompetitionForm;
