import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { api } from "../../../../backendServices/ApiCalls";
import { uploadToCloudinary } from "../../../../utils/uploadToCloudinary";

export default function ManageHero() {
  const [images, setImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]); // Tracks DB state
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Modal State
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    index: null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validateImageDimensions = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const width = img.width;
          const height = img.height;

          // Constraints
          const minW = 1920,
            minH = 850;
          const maxW = 3840,
            maxH = 2160;

          if (width < minW || height < minH) {
            resolve({
              valid: false,
              error: `Image too small (${width}x${height}). Min required: ${minW}x${minH}`,
            });
          } else if (width > maxW || height > maxH) {
            resolve({
              valid: false,
              error: `Image too large (${width}x${height}). Max allowed: ${maxW}x${maxH}`,
            });
          } else {
            resolve({ valid: true });
          }
        };
      };
    });
  };

  // Fetching images memoized
  const fetchHeroImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/v5/dashboard/hero");
      if (res.status === 200) {
        const fetchedImages = res.data.images || [];
        setImages(fetchedImages);
        setOriginalImages(fetchedImages);
      }
    } catch (error) {
      console.error("Error fetching hero images:", error);
      showSnackbar("Failed to fetch hero images", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroImages();
  }, [fetchHeroImages]);

  // Check if changes exist to enable/disable Save button
  const hasChanges = useMemo(() => {
    return JSON.stringify(images) !== JSON.stringify(originalImages);
  }, [images, originalImages]);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);

    // 1. Check Quantity
    if (images.length + files.length > 4) {
      showSnackbar("Maximum 4 images allowed", "warning");
      return;
    }

    setUploading(true);
    try {
      // 2. Validate Dimensions for all files
      const validFiles = [];
      for (const file of files) {
        const validation = await validateImageDimensions(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          showSnackbar(validation.error, "error");
        }
      }

      if (validFiles.length === 0) {
        setUploading(false);
        return;
      }

      // 3. Upload only valid files
      const uploadPromises = validFiles.map((file) =>
        uploadToCloudinary(file, "travel-agency/hero-slider"),
      );

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
      showSnackbar(
        `Successfully added ${uploadedUrls.length} image(s)`,
        "success",
      );
    } catch (error) {
      showSnackbar("Failed to upload images", "error");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  // Confirmation Modal Handlers
  const askDeleteConfirmation = (index) => {
    setDeleteConfirm({ open: true, index });
  };

  const handleConfirmDelete = () => {
    const indexToRemove = deleteConfirm.index;
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setDeleteConfirm({ open: false, index: null });
    showSnackbar("Image removed from list (Save to apply)", "info");
  };

  const handleSaveImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.put("/v5/dashboard/editHero", { images });
      if (res.data.success) {
        showSnackbar("Hero images updated successfully", "success");
        setOriginalImages(images); // Update original to match new state
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Failed to save", "error");
    } finally {
      setLoading(false);
    }
  }, [images]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5">Manage Hero Slider</Typography>
            <Typography variant="body2" color="text.secondary">
              Upload up to 4 images (Recommended: 1920x850 to 3840x2160)
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchHeroImages}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              disabled={images.length >= 4 || uploading}
            >
              {uploading ? "Uploading..." : "Upload Images"}
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Button>
          </Stack>
        </Box>

        {loading && !uploading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {images.map((imageUrl, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={imageUrl}
                      sx={{ objectFit: "cover" }}
                    />
                    <IconButton
                      onClick={() => askDeleteConfirmation(index)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "error.main",
                        color: "white",
                        "&:hover": { backgroundColor: "error.dark" },
                      }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Save Button: Now logic-driven */}
            <Box
              sx={{
                mt: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSaveImages}
                disabled={!hasChanges || loading || uploading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              {!hasChanges && images.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  No new changes to save
                </Typography>
              )}
            </Box>
          </>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, index: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this image? Changes won't be
            permanent until you click "Save Changes".
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirm({ open: false, index: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
