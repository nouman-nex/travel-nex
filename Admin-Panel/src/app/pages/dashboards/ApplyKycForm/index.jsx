import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardMedia,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ApplyKycForm = () => {
  const { User, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run logic if User is defined (i.e. data has loaded)
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isAdmin = roles.includes("Admin");

      if (isAdmin) {
        navigate("/dashboard");
      }
    }
  }, [User, navigate]);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    docType: "",
    frontImage: null,
    backImage: null,
    frontImageUrl: "",
    backImageUrl: "",
    frontImageFileName: "",
    backImageFileName: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    frontImage: 0,
    backImage: 0,
  });
  const [isUploading, setIsUploading] = useState({
    frontImage: false,
    backImage: false,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [errors, setErrors] = useState({
    docType: "",
    frontImage: "",
    backImage: "",
  });
  const [rejectionReason, setRejectionReason] = useState(null);

  const documentTypes = ["National ID Card", "Passport", "Driving License"];

  const steps = ["Select Document Type", "Upload Documents", "Review & Submit"];

  const handleDocTypeChange = (event) => {
    setFormData({
      ...formData,
      docType: event.target.value,
    });
    setErrors({
      ...errors,
      docType: "",
    });
  };

  const uploadImage = (file, imageType) => {
    if (!file) return;

    // File validation
    if (!file.type.includes("image/")) {
      setErrors({
        ...errors,
        [imageType]: "Please upload an image file",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        [imageType]: "File size should be less than 5MB",
      });
      return;
    }

    // Create FormData for upload
    const formDataToUpload = new FormData();
    formDataToUpload.append("media", file); // match the working one

    // Set uploading state
    setIsUploading({
      ...isUploading,
      [imageType]: true,
    });

    // Reset progress
    setUploadProgress({
      ...uploadProgress,
      [imageType]: 0,
    });

    // Simulate progress until we get a response
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const currentProgress = prev[imageType];
        if (currentProgress < 90) {
          return {
            ...prev,
            [imageType]: currentProgress + 10,
          };
        }
        return prev;
      });
    }, 300);

    // Use the same postRequest function
    postRequest(
      "/upload",
      formDataToUpload,
      (response) => {
        clearInterval(progressInterval);

        const imageUrl = URL.createObjectURL(file);

        setFormData({
          ...formData,
          [imageType]: file,
          [`${imageType}Url`]: imageUrl,
          [`${imageType}FileName`]: response.data.data.mediaUrl, // ✅ FIXED
        });

        setUploadProgress({
          ...uploadProgress,
          [imageType]: 100,
        });

        setTimeout(() => {
          setIsUploading({
            ...isUploading,
            [imageType]: false,
          });
        }, 500);

        setErrors({
          ...errors,
          [imageType]: "",
        });

        showNotification(
          `${imageType === "frontImage" ? "Front" : "Back"} side uploaded successfully`,
          "success"
        );
      },
      (error) => {
        clearInterval(progressInterval);
        setIsUploading({
          ...isUploading,
          [imageType]: false,
        });

        setUploadProgress({
          ...uploadProgress,
          [imageType]: 0,
        });

        setErrors({
          ...errors,
          [imageType]:
            error.response?.data?.message || "Failed to upload image",
        });

        showNotification(
          "Failed to upload image: " +
            (error.response?.data?.message || "Unknown error"),
          "error"
        );
      },
      true
    );
  };

  const handleImageUpload = (event, imageType) => {
    const file = event.target.files[0];
    if (file) {
      uploadImage(file, imageType);
    }
  };
  // fetch rejected kyc requests
  const fetchRejectedKycRequests = () => {
    postRequest(
      "/getRejectedKyc",
      { userId: User?._id },
      (response) => {
        setRejectionReason(response.data.data[0]?.rejectionReason);
      },
      (error) => {
        console.error("Error fetching rejected KYC requests:", error);
      }
    );
  };
  useEffect(() => {
    // Fetch rejected KYC requests when the component mounts
    fetchRejectedKycRequests();
  }, [User]);
  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.docType) {
        setErrors({
          ...errors,
          docType: "Please select a document type",
        });
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.frontImage) {
        setErrors({
          ...errors,
          frontImage: "Please upload the front side of your document",
        });
        return;
      }
      if (!formData.backImage) {
        setErrors({
          ...errors,
          backImage: "Please upload the back side of your document",
        });
        return;
      }
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    setLoading(true);

    // Create form data for API request
    const kycData = {
      userId: User?._id,
      docType: formData.docType,
      frontImageUrl: formData.frontImageFileName,
      backImageUrl: formData.backImageFileName,
    };

    postRequest(
      "/applyKyc",
      kycData,
      (response) => {
        console.log(response);
        setLoading(false);
        showNotification("KYC application submitted successfully!", "success");
        setUser((prevUser) => ({
          ...prevUser,
          kycStatus: "pending",
          isKycVerified: false,
        }));
      },
      (error) => {
        setLoading(false);
        showNotification(
          error.response?.data?.message || "Failed to submit KYC application",
          "error"
        );
      }
    );
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };
  if (User?.isKycVerified) {
    return (
      <div className="flex justify-center items-center">
        <div className="flex items-center p-4 rounded-lg bg-green-100 bg-opacity-80 border border-green-200 shadow-sm max-w-md">
          <CheckCircle className="text-green-500 mr-3" size={24} />
          <div>
            <p className="font-medium text-green-700">
              You are already verified
            </p>
            <p className="text-green-600 text-sm">
              Your account verification is complete and active
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (User?.kycStatus === "pending") {
    return (
      <div className="flex justify-center items-center">
        <div className="flex items-center p-4 rounded-lg bg-yellow-100 bg-opacity-80 border border-yellow-200 shadow-sm max-w-md">
          <AlertCircle className="text-yellow-500 mr-3" size={24} />
          <div>
            <p className="font-medium text-yellow-700">
              KYC Application Pending
            </p>
            <p className="text-yellow-600 text-sm">
              Your application is under review. You will be notified once it's
              verified.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Box sx={{ py: 3 }}>
              <Typography variant="h6" gutterBottom>
                Select Your Identification Document
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Choose the type of document you want to submit for verification
              </Typography>

              <FormControl fullWidth error={Boolean(errors.docType)}>
                <InputLabel id="document-type-label">Document Type</InputLabel>
                <Select
                  labelId="document-type-label"
                  id="document-type"
                  value={formData.docType}
                  onChange={handleDocTypeChange}
                  label="Document Type"
                >
                  {documentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.docType && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ mt: 1, ml: 1 }}
                  >
                    {errors.docType}
                  </Typography>
                )}
              </FormControl>
            </Box>
          </>
        );

      case 1:
        return (
          <Box sx={{ py: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Document Images
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Please upload clear photos or scans of your {formData.docType}
            </Typography>

            <Grid container spacing={3}>
              {/* Front side upload */}
              <Grid item xs={12} md={6}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    ":hover": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Front Side
                    </Typography>

                    {formData.frontImageUrl ? (
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={formData.frontImageUrl}
                          alt="Front side preview"
                          sx={{
                            objectFit: "contain",
                            borderRadius: 1,
                            mb: 2,
                          }}
                        />
                        <CheckCircleIcon
                          color="success"
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            backgroundColor: "white",
                            borderRadius: "50%",
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          border: "2px dashed",
                          borderColor: "grey.300",
                          borderRadius: 1,
                          p: 3,
                          mb: 2,
                          textAlign: "center",
                          backgroundColor: "grey.50",
                          height: "200px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        {isUploading.frontImage ? (
                          <>
                            <CircularProgress size={40} sx={{ mb: 2 }} />
                            <Typography variant="body2" color="textSecondary">
                              Uploading...
                            </Typography>
                          </>
                        ) : (
                          <CloudUploadIcon fontSize="large" color="action" />
                        )}
                      </Box>
                    )}

                    {isUploading.frontImage && (
                      <Box sx={{ width: "100%", mb: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress.frontImage}
                        />
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          align="center"
                          display="block"
                          sx={{ mt: 0.5 }}
                        >
                          {uploadProgress.frontImage}% Uploaded
                        </Typography>
                      </Box>
                    )}

                    <Button
                      component="label"
                      variant={
                        formData.frontImageUrl ? "outlined" : "contained"
                      }
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                      disabled={isUploading.frontImage}
                    >
                      {formData.frontImageUrl
                        ? "Change Image"
                        : "Upload Front Side"}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "frontImage")}
                        disabled={isUploading.frontImage}
                      />
                    </Button>
                    {errors.frontImage && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 1, display: "block" }}
                      >
                        {errors.frontImage}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Back side upload */}
              <Grid item xs={12} md={6}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    ":hover": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Back Side
                    </Typography>

                    {formData.backImageUrl ? (
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={formData.backImageUrl}
                          alt="Back side preview"
                          sx={{
                            objectFit: "contain",
                            borderRadius: 1,
                            mb: 2,
                          }}
                        />
                        <CheckCircleIcon
                          color="success"
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            backgroundColor: "white",
                            borderRadius: "50%",
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          border: "2px dashed",
                          borderColor: "grey.300",
                          borderRadius: 1,
                          p: 3,
                          mb: 2,
                          textAlign: "center",
                          backgroundColor: "grey.50",
                          height: "200px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        {isUploading.backImage ? (
                          <>
                            <CircularProgress size={40} sx={{ mb: 2 }} />
                            <Typography variant="body2" color="textSecondary">
                              Uploading...
                            </Typography>
                          </>
                        ) : (
                          <CloudUploadIcon fontSize="large" color="action" />
                        )}
                      </Box>
                    )}

                    {isUploading.backImage && (
                      <Box sx={{ width: "100%", mb: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress.backImage}
                        />
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          align="center"
                          display="block"
                          sx={{ mt: 0.5 }}
                        >
                          {uploadProgress.backImage}% Uploaded
                        </Typography>
                      </Box>
                    )}

                    <Button
                      component="label"
                      variant={formData.backImageUrl ? "outlined" : "contained"}
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                      disabled={isUploading.backImage}
                    >
                      {formData.backImageUrl
                        ? "Change Image"
                        : "Upload Back Side"}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "backImage")}
                        disabled={isUploading.backImage}
                      />
                    </Button>
                    {errors.backImage && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 1, display: "block" }}
                      >
                        {errors.backImage}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ py: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Application
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Please review your information before submitting
            </Typography>

            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Document Type
                  </Typography>
                  <Typography variant="body1">{formData.docType}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Document Images
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Front Side
                      </Typography>
                    </CardContent>
                    <CardMedia
                      component="img"
                      height="180"
                      image={formData.frontImageUrl}
                      alt="Front side preview"
                      sx={{ objectFit: "contain", p: 1 }}
                    />
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Back Side
                      </Typography>
                    </CardContent>
                    <CardMedia
                      component="img"
                      height="180"
                      image={formData.backImageUrl}
                      alt="Back side preview"
                      sx={{ objectFit: "contain", p: 1 }}
                    />
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            <Alert severity="info" sx={{ mb: 3 }}>
              By submitting this application, you confirm that all information
              provided is accurate and the documents are authentic.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {rejectionReason && (
        <div className="flex justify-center items-center">
          <div className="flex items-center p-4 rounded-lg bg-red-100 bg-opacity-80 border border-red-200 shadow-sm max-w-md">
            <AlertCircle className="text-red-500 mr-3" size={24} />
            <div>
              <p className="font-medium text-red-700">
                KYC Application Rejected
              </p>
              <p className="text-red-600 text-sm">Reason: {rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", mt: 4, mb: 8 }}>
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              p: 3,
            }}
          >
            <Typography variant="h5" component="h1">
              KYC Verification
            </Typography>
            <Typography variant="body2">
              Complete your identity verification to access all features
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {renderStepContent(activeStep)}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", pt: 3 }}
            >
              <Button
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  endIcon={
                    loading ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <CheckCircleIcon />
                    )
                  }
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForwardIcon />}
                  disabled={isUploading.frontImage || isUploading.backImage}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "top", horizontal: "center" }} // changed to "top"
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
    </>
  );
};

export default ApplyKycForm;
