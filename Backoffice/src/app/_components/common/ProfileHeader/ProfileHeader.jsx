import { useState } from "react";
import {
  Avatar,
  Button,
  Typography,
  Modal,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { ContentHeader } from "@app/_components/ContentHeader";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SaveIcon from "@mui/icons-material/Save";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { uploadToCloudinary } from "../../../../utils/uploadToCloudinary";
import { api } from "../../../../backendServices/ApiCalls";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ProfileHeader = () => {
  const { User, refreshUser, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedCloudinaryUrl, setUploadedCloudinaryUrl] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedCloudinaryUrl(null);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        setNotification({
          open: true,
          message: "Invalid file type. Only PNG and JPEG files are allowed.",
          severity: "error",
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setNotification({
          open: true,
          message: "File size exceeds 5MB limit.",
          severity: "error",
        });
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Automatically upload to Cloudinary
      uploadToCloudinaryHandler(file);
    }
  };

  // Upload to Cloudinary
  const uploadToCloudinaryHandler = async (file) => {
    try {
      setUploadLoading(true);

      const cloudinaryUrl = await uploadToCloudinary(
        file,
        "travel-agency/avatars",
      );

      if (cloudinaryUrl) {
        setUploadedCloudinaryUrl(cloudinaryUrl);
        setNotification({
          open: true,
          message: "Image uploaded successfully. Click Save to update.",
          severity: "success",
        });
      } else {
        throw new Error("Failed to get Cloudinary URL");
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      setNotification({
        open: true,
        message: error.message || "Error uploading image to Cloudinary",
        severity: "error",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  // Update profile with new avatar
  const handleImageUpdate = async () => {
    if (!uploadedCloudinaryUrl) {
      setNotification({
        open: true,
        message: "Please wait for the image to upload completely.",
        severity: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/v1/auth/updateProfile", {
        avatar: uploadedCloudinaryUrl,
      });

      if (res?.data?.success) {
        // Update user in context with new avatar
        const updatedUser = {
          ...User,
          avatar: uploadedCloudinaryUrl,
          profilePic: uploadedCloudinaryUrl,
          profileImg: uploadedCloudinaryUrl,
        };
        setUser(updatedUser);

        setNotification({
          open: true,
          message: "Profile picture updated successfully",
          severity: "success",
        });

        // Refresh user data if needed
        if (typeof refreshUser === "function") {
          refreshUser();
        }

        handleClose();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "Error updating profile picture",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getProfileImageUrl = () => {
    return User?.avatar || User?.profilePic || User?.profileImg || "";
  };

  return (
    <>
      <ContentHeader
        avatar={
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              sx={{
                width: { xs: 48, sm: 80 },
                height: { xs: 48, sm: 80 },
              }}
              alt={`${User?.name || User?.firstname || ""} ${
                User?.lastname || ""
              }`}
              src={getProfileImageUrl()}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "4px",
                cursor: "pointer",
              }}
              onClick={handleOpen}
            >
              <CameraAltIcon sx={{ fontSize: 24, color: "black" }} />
            </Box>
          </Box>
        }
        title={
          <Typography fontSize={18} variant={"body1"} color={"inherit"}>
            {User?.name || User?.firstname || ""}{" "}
            {User?.lastname ? User.lastname : ""}
          </Typography>
        }
        subheader={
          <Typography
            fontSize={12}
            variant={"body1"}
            color={"inherit"}
            mt={0.5}
          >
            {User?.username || User?.email || ""}
          </Typography>
        }
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1320,
          marginInline: "auto",
          "& .MuiCardHeader-action": {
            alignSelf: "center",
            margin: 0,
          },
        }}
      />

      <Modal
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
        aria-labelledby="profile-image-modal"
        aria-describedby="modal-to-update-profile-image"
      >
        <Box
          sx={{
            ...modalStyle,
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            padding: "24px",
            maxWidth: "450px",
            width: "100%",
            background: "linear-gradient(to bottom, #ffffff, #f9fafb)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              borderBottom: "1px solid #f0f0f0",
              pb: 2,
            }}
          >
            <Typography
              id="profile-image-modal"
              variant="h5"
              component="h2"
              fontWeight="600"
              color="primary.dark"
            >
              Update Profile Image
            </Typography>
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box sx={{ position: "relative", mb: 3 }}>
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  border: "4px solid #fff",
                }}
                alt={`${User?.name || User?.firstname || ""} ${
                  User?.lastname || ""
                }`}
                src={previewUrl || getProfileImageUrl()}
              />
            </Box>

            <Button
              variant="contained"
              component="label"
              sx={{
                mt: 2,
                borderRadius: "8px",
                py: 1.2,
                px: 3,
                textTransform: "none",
                fontWeight: 600,
                background: uploadLoading ? "grey.400" : "primary.main",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                },
                transition: "all 0.2s ease-in-out",
              }}
              disabled={uploadLoading}
              startIcon={
                uploadLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <PhotoCameraIcon />
                )
              }
            >
              {uploadLoading ? "Uploading..." : "Choose New Image"}
              <input
                type="file"
                hidden
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileSelect}
                disabled={uploadLoading}
              />
            </Button>

            {selectedFile && (
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: "8px",
                  bgcolor: "grey.100",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <InsertDriveFileIcon fontSize="small" color="primary" />
                <Typography variant="body2" fontWeight={500}>
                  {selectedFile.name}
                </Typography>
              </Box>
            )}

            {uploadedCloudinaryUrl && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "success.main",
                }}
              >
                <CheckCircleIcon fontSize="small" />
                <Typography variant="body2" fontWeight={500}>
                  Image uploaded successfully
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              borderTop: "1px solid #f0f0f0",
              pt: 3,
            }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={loading || uploadLoading}
              sx={{
                borderRadius: "8px",
                px: 3,
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "grey.100",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImageUpdate}
              variant="contained"
              disabled={!uploadedCloudinaryUrl || loading || uploadLoading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <SaveIcon />
              }
              sx={{
                borderRadius: "8px",
                px: 3,
                textTransform: "none",
                fontWeight: 600,
                background:
                  !uploadedCloudinaryUrl || loading || uploadLoading
                    ? "grey.400"
                    : "primary.main",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export { ProfileHeader };
