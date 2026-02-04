import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  LinearProgress,
  Divider,
  TextField,
} from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must be less than 5000 characters")
    .required("Description is required"),
});

function UpdateBlog({ open, onClose, blog, onUpdate }) {
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

  useEffect(() => {
    if (blog) {
      // Initial formData ko blog ke existing values se set karo
      setFormData({
        title: blog.title || "",
        description: blog.description || "",
        media: null,
        mediaType: blog.mediaType || "",
        mediaUrl: blog.mediaUrl || "",
      });
      setImagePreview(blog.mediaUrl || null);

      // Reset upload state when blog changes
      setUploadState({
        uploading: false,
        progress: 0,
        error: null,
        success: false,
      });
    }
  }, [blog]);

  const uploadMedia = async (file) => {
    const mediaData = new FormData();
    mediaData.append("media", file);

    setUploadState({
      uploading: true,
      progress: 0,
      error: null,
      success: false,
    });

    try {
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
    setImagePreview(blog?.mediaUrl || null); // Original image ko wapas show karo
    // FormData ko original blog values se reset karo
    setFormData((prev) => ({
      ...prev,
      media: null,
      mediaType: blog?.mediaType || "",
      mediaUrl: blog?.mediaUrl || "",
    }));
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitStatus({ type: "info", message: "Updating blog post..." });

      // Proper fallback logic - agar nayi image upload nahi hui to purani use karo
      const blogData = {
        id: blog._id,
        title: values.title,
        description: values.description,
        // Agar new image upload hui hai to new use karo, nahi to original blog ki image use karo
        mediaType:
          formData.mediaUrl && formData.mediaType
            ? formData.mediaType
            : blog?.mediaType,
        mediaUrl: formData.mediaUrl ? formData.mediaUrl : blog?.mediaUrl,
      };

      postRequest(
        "/updateblog",
        blogData,
        (response) => {
          if (response.data.success) {
            setSubmitStatus({
              type: "success",
              message: "Blog post updated successfully!",
            });

            toast.success("Blog updated successfully!");

            if (onUpdate) {
              onUpdate(response.data.data);
            }

            setTimeout(() => {
              onClose();
            }, 1500);
          } else {
            throw new Error(
              response.data.message || "Failed to update blog post"
            );
          }
        },
        (error) => {
          console.error("API error:", error);
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong. Please try again.";
          setSubmitStatus({
            type: "error",
            message: message,
          });
          toast.error(message);
        }
      );
    } catch (error) {
      console.error("Error updating blog post:", error);
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to update blog post. Please try again.",
      });
      toast.error(
        error.response?.data?.message || "Failed to update blog post"
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, minHeight: "500px" },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            Update Blog Post
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Formik
        initialValues={{
          title: blog?.title || "",
          description: blog?.description || "",
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          isSubmitting,
          handleSubmit,
        }) => (
          <Form>
            <DialogContent dividers sx={{ px: 3, py: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {submitStatus && (
                  <Alert
                    severity={submitStatus.type}
                    sx={{ mb: 2 }}
                    onClose={() => setSubmitStatus(null)}
                  >
                    {submitStatus.message}
                  </Alert>
                )}
                <Field name="title">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label="Blog Title"
                      fullWidth
                      variant="outlined"
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                      placeholder="Enter an engaging title for your blog post"
                      onChange={(e) => {
                        field.onChange(e);
                        setFieldValue("title", e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }));
                      }}
                    />
                  )}
                </Field>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Featured Image
                  </Typography>

                  {!imagePreview ? (
                    <Box>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="image-upload-update"
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleImageChange(e, setFieldValue)}
                      />
                      <label htmlFor="image-upload-update">
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
                          <Typography variant="h6" gutterBottom>
                            Click to upload new image
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Supports: JPG, PNG, GIF (Max 5MB)
                          </Typography>
                        </Box>
                      </label>
                    </Box>
                  ) : (
                    <Card sx={{ maxWidth: 400 }}>
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
                          {values.image?.name || "Current Image"}
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
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Blog Content
                  </Typography>
                  <Box
                    sx={{
                      "& .ck-editor__editable": {
                        minHeight: "200px",
                        maxHeight: "400px",
                        overflow: "auto",
                      },
                      "& .ck-content": {
                        fontSize: "1rem",
                        lineHeight: "1.6",
                      },
                    }}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={values.description}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setFieldValue("description", data);
                        setFormData((prev) => ({
                          ...prev,
                          description: data,
                        }));
                      }}
                      config={{
                        toolbar: [
                          "heading",
                          "|",
                          "bold",
                          "italic",
                          "link",
                          "bulletedList",
                          "numberedList",
                          "blockQuote",
                          "undo",
                          "redo",
                        ],
                      }}
                    />
                  </Box>
                  {touched.description && errors.description && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 1, display: "block" }}
                    >
                      {errors.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
              <Button
                onClick={onClose}
                variant="outlined"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  isSubmitting ||
                  uploadState.uploading ||
                  !values.title.trim() ||
                  !values.description.trim()
                }
                startIcon= {setSubmitStatus.type === "info" ? <CircularProgress size={20} sx={{color:"white"}} /> : null}
              >
                {setSubmitStatus.type === "info" ? (
                  <CircularProgress size={20} sx={{color:"white"}}/>
                ) : (
                  "Update Blog"
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

export default UpdateBlog;
