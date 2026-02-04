import React, { useState, useRef } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardMedia,
  IconButton,
  Grid,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
} from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { postRequest } from "../../../../backendServices/ApiCalls";

const RichTextEditor = ({ value, onChange, error, helperText }) => {
  const [content, setContent] = useState(value || "");

  const handleContentChange = (e) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
    onChange(newContent);
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <Box>
      <Paper
        elevation={1}
        sx={{
          border: error ? "1px solid #d32f2f" : "1px solid #c4c4c4",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        {/* Toolbar */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            p: 1,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#f5f5f5",
            flexWrap: "wrap",
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() => formatText("bold")}
            sx={{ minWidth: "auto", px: 1 }}
          >
            <strong>B</strong>
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => formatText("italic")}
            sx={{ minWidth: "auto", px: 1 }}
          >
            <em>I</em>
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => formatText("underline")}
            sx={{ minWidth: "auto", px: 1 }}
          >
            <u>U</u>
          </Button>
          <Divider orientation="vertical" flexItem />
          <Button
            size="small"
            variant="outlined"
            onClick={() => formatText("insertUnorderedList")}
            sx={{ minWidth: "auto", px: 1 }}
          >
            • List
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => formatText("insertOrderedList")}
            sx={{ minWidth: "auto", px: 1 }}
          >
            1. List
          </Button>
          <Divider orientation="vertical" flexItem />
          <Button
            size="small"
            variant="outlined"
            onClick={() => formatText("formatBlock", "h3")}
            sx={{ minWidth: "auto", px: 1 }}
          >
            H3
          </Button>
        </Box>

        {/* Editor */}
        <Box
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          dangerouslySetInnerHTML={{ __html: content }}
          sx={{
            minHeight: 200,
            p: 2,
            outline: "none",
            "&:focus": {
              backgroundColor: "#fafafa",
            },
            "& h3": {
              margin: "16px 0 8px 0",
              fontSize: "1.2em",
              fontWeight: "bold",
            },
            "& ul, & ol": {
              paddingLeft: "20px",
              margin: "8px 0",
            },
            "& li": {
              marginBottom: "4px",
            },
          }}
        />
      </Paper>
      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 0.5, ml: 1.5, display: "block" }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must be less than 5000 characters")
    .required("Description is required"),
  image: Yup.mixed()
    .required("Image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return false;
      return (
        value &&
        ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
          value.type
        )
      );
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value) return false;
      return value && value.size <= 5 * 1024 * 1024;
    }),
});

function AddBlog() {
  const [imagePreview, setImagePreview] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const fileInputRef = useRef(null);

  // Upload state management
  const [uploadState, setUploadState] = useState({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
  });

  // Form data state for API
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media: null,
    mediaType: "",
    mediaUrl: "",
  });

  const uploadMedia = async (file) => {
    // Create form data for upload
    const mediaData = new FormData();
    mediaData.append("media", file);

    // Set upload state to start
    setUploadState({
      uploading: true,
      progress: 0,
      error: null,
      success: false,
    });

    try {
      // const response = await axios.post(
      //   "https://mobicrypto-backend.threearrowstech.com/user/api/upload", // Adjust endpoint as needed
      //   mediaData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      // onUploadProgress: (progressEvent) => {
      //   const percentCompleted = Math.round(
      //     (progressEvent.loaded * 100) / progressEvent.total
      //   );
      //   setUploadState((prev) => ({
      //     ...prev,
      //     progress: percentCompleted,
      //   }));
      // },
      //   }
      // );

      postRequest("/upload", mediaData, (response) => {
        if (response.data.success) {
          setUploadState({
            uploading: false,
            progress: 100,
            error: null,
            success: true,
          });

          setFormData((prev) => ({
            ...prev,
            mediaType: response.data.data.mediaType,
            mediaUrl: response.data.data.mediaUrl,
          }));

          toast.success("Image uploaded successfully");
          return true;
        } else {
          throw new Error(response.data.message || "Upload failed");
        }
      });
    } catch (error) {
      console.error("Error uploading media:", error);
      setUploadState({
        uploading: false,
        progress: 0,
        error: error.response?.data?.message || "Failed to upload media",
        success: false,
      });
      toast.error(error.response?.data?.message || "Failed to upload media");
      return false;
    }
  };

  const handleImageChange = async (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue("image", file);
      setFormData((prev) => ({ ...prev, media: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload the file immediately
      await uploadMedia(file);
    }
  };

  const handleRemoveImage = (setFieldValue) => {
    setFieldValue("image", null);
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      media: null,
      mediaType: "",
      mediaUrl: "",
    }));
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false,
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitStatus({ type: "info", message: "Publishing blog post..." });
      if (!formData.mediaUrl) {
        setSubmitStatus({
          type: "error",
          message:
            "Please wait for image upload to complete or upload an image.",
        });
        setSubmitting(false);
        return;
      }

      const blogData = {
        title: values.title,
        description: values.description,
        mediaType: formData.mediaType,
        mediaUrl: formData.mediaUrl,
      };
      postRequest(
        "/createblog",
        blogData,
        (response) => {
          if (response.data.success) {
            setSubmitStatus({
              type: "success",
              message: "Blog post published successfully!",
            });

            toast.success("Blog posted successfully!");

            resetForm();
            setImagePreview(null);

            setFormData({
              title: "",
              description: "",
              media: null,
              mediaType: "",
              mediaUrl: "",
            });

            setUploadState({
              uploading: false,
              progress: 0,
              error: null,
              success: false,
            });

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          } else {
            throw new Error(
              response.data.message || "Failed to create blog post"
            );
          }
        },
        (error) => {
          console.error(" error:", error);
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong. Please try again.";
          toast.error(message || "Failed to create blog post");
        }
      );
    } catch (error) {
      console.error("Error creating blog post:", error);
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to publish blog post. Please try again.",
      });
      toast.error(
        error.response?.data?.message || "Failed to create blog post"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderUploadProgress = () => {
    if (uploadState.uploading) {
      return (
        <Box sx={{ mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={uploadState.progress}
            sx={{ mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            Uploading: {uploadState.progress}%
          </Typography>
        </Box>
      );
    }

    if (uploadState.error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {uploadState.error}
        </Alert>
      );
    }

    if (uploadState.success) {
      return (
        <Alert severity="success" sx={{ mt: 2 }}>
          Upload successful!
        </Alert>
      );
    }

    return null;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          color="primary"
        >
          Create New Blog Post
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Share your thoughts and ideas with the world
        </Typography>

        {submitStatus && (
          <Alert
            severity={submitStatus.type}
            sx={{ mb: 3 }}
            onClose={() => setSubmitStatus(null)}
          >
            {submitStatus.message}
          </Alert>
        )}

        <Formik
          initialValues={{
            title: "",
            description: "",
            image: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Title Field */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="title"
                    label="Blog Title"
                    fullWidth
                    variant="outlined"
                    error={touched.title && !!errors.title}
                    helperText={touched.title && errors.title}
                    placeholder="Enter an engaging title for your blog post"
                    onChange={(e) => {
                      setFieldValue("title", e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Featured Image
                  </Typography>

                  {!imagePreview ? (
                    <Box>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="image-upload"
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleImageChange(e, setFieldValue)}
                      />
                      <label htmlFor="image-upload">
                        <Box
                          sx={{
                            border: "2px dashed #ccc",
                            borderRadius: 2,
                            p: 4,
                            textAlign: "center",
                            cursor: "pointer",
                            "&:hover": {
                              borderColor: "primary.main",
                              backgroundColor: "action.hover",
                            },
                          }}
                        >
                          <CloudUploadIcon
                            sx={{
                              fontSize: 48,
                              color: "text.secondary",
                              mb: 2,
                            }}
                          />
                          <Typography variant="h6" gutterBottom>
                            Click to upload image
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Supports: JPG, PNG, GIF (Max 5MB)
                          </Typography>
                        </Box>
                      </label>
                    </Box>
                  ) : (
                    <Card sx={{ maxWidth: 400, mx: "auto" }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={imagePreview}
                        alt="Preview"
                      />
                      <Box
                        sx={{
                          p: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {values.image?.name}
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveImage(setFieldValue)}
                          disabled={uploadState.uploading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Card>
                  )}

                  {/* Upload Progress */}
                  {renderUploadProgress()}

                  {touched.image && errors.image && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 1, display: "block" }}
                    >
                      {errors.image}
                    </Typography>
                  )}
                </Grid>

                {/* Description Field with Rich Text Editor */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Blog Content
                  </Typography>
                  <RichTextEditor
                    value={values.description}
                    onChange={(content) => {
                      setFieldValue("description", content);
                      setFormData((prev) => ({
                        ...prev,
                        description: content,
                      }));
                    }}
                    error={touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                  />
                </Grid>

                {/* Submit Buttons */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "center",
                      mt: 3,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={
                        submitStatus?.type === "info" ? (
                          <CircularProgress size={20} />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      disabled={isSubmitting || uploadState.uploading}
                      sx={{ minWidth: 150 }}
                    >
                      {submitStatus?.type === "info" ? (
                        <CircularProgress size={20} sx={{ color: "white" }} />
                      ) : (
                        "Publish Blog"
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
}

export default AddBlog;
