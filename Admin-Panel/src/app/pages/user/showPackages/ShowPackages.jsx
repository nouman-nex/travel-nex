import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Container,
} from "@mui/material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { Div } from "@jumbo/shared";

function ShowPackages() {
  const [cards, setCards] = useState([]);
  const { User, setUser } = useAuth();
  const [purchaseModal, setPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const steps = [
    t("packagesPage.selectHub"),
    t("packagesPage.confirmPurchase"),
  ];

  useEffect(() => {
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isUser = roles.includes("User");

      if (!isUser) {
        navigate("/adminDashboard");
      }
    }
  }, [User, navigate]);
  const notify = useNotify();

  const fetchPackages = async () => {
    setLoading(true)
    postRequest("/getpackages", {}, (response) => {
      if (response.data.success) {
        setCards(response.data.packages);
        setLoading(false)
      } else {
        setLoading(false)
        notify(response.data.message || "Failed to fetch packages", "error");
      }
    });
  };

  useEffect(() => {
    fetchPackages();
  }, [User]);

  const handlePurchaseClick = (packageData) => {
    if (!User?._id) {
      notify("Please login to purchase a package", "error");
      return;
    }

    setSelectedPackage(packageData);
    setPurchaseModal(true);
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePurchaseSubmit = async () => {
    if (!User?._id) {
      notify("User authentication required", "error");
      return;
    }

    setLoading(true);

    const payload = {
      userId: User._id,
      packageId: selectedPackage._id,
    };

    postRequest("/createPackageOrder", payload, (response) => {
      setLoading(false);
      if (response.data.success) {
        setUser({
          ...User,
          cryptoWallet:
            User.cryptoWallet - parseFloat(selectedPackage.hubPrice || 0),
          walletBalance:
            User.walletBalance + parseFloat(selectedPackage.hubCapacity || 0),
        });
        notify(
          response.data.message || "Package purchased successfully!",
          "success"
        );

        setPurchaseModal(false);
        fetchPackages();
      } else {
        notify(response.data.message || "Failed to purchase package", "error");
      }
    });
  };

  const isBalanceSufficient = () => {
    if (!selectedPackage) return false;
    return User.cryptoWallet >= parseFloat(selectedPackage.hubPrice || 0);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t("packagesPage.hubDetails")}{" "}
            </Typography>
            {selectedPackage && (
              <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h5" color="primary" gutterBottom>
                  ${selectedPackage.hubPrice}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      {t("packagesPage.baseAmount")}
                    </Typography>
                    <Typography variant="body1">
                      ${selectedPackage.amount}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      {t("packagesPage.totalPriceWithFee")}
                    </Typography>
                    <Typography variant="body1">
                      ${selectedPackage.hubPrice}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      {t("packagesPage.hubCapacity")}
                    </Typography>
                    <Typography variant="body1">
                      ${selectedPackage.hubCapacity}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      {t("packagesPage.minMinting")}
                    </Typography>
                    <Typography variant="body1">
                      ${selectedPackage.minimumMinting}
                    </Typography>
                  </Grid>
                </Grid>

                <Alert severity="info" sx={{ mt: 2 }}>
                  You will pay ${selectedPackage.hubPrice} and receive $
                  {selectedPackage.hubCapacity} in your wallet for minting
                  investments!
                </Alert>

                <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {t("packagesPage.yourBalance")}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t("packagesPage.currentCryptoBalance")} : $
                    {User.cryptoWallet.toFixed(2)}
                  </Typography>

                  {userDataLoading && (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography variant="body2">Loading...</Typography>
                    </Box>
                  )}
                </Box>

                {User && (
                  <Box
                    sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    <Typography variant="body1" gutterBottom>
                      {t("packagesPage.purchasingAs")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {User.firstName} {User.lastName} ({User.username})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {User.email}
                    </Typography>
                  </Box>
                )}
              </Paper>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t("packagesPage.confirmPurchaseTitle")}
            </Typography>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                {t("packagesPage.purchaseSummary")}
              </Typography>
              <Divider sx={{ my: 2 }} />

              {User && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography> {t("packagesPage.buyer")}</Typography>
                    <Typography>
                      {User.firstName} {User.lastName}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography> {t("packagesPage.username")}</Typography>
                    <Typography>{User.username}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography> {t("packagesPage.email")}</Typography>
                    <Typography>{User.email}</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography> {t("packagesPage.hubBaseAmount")}</Typography>
                <Typography>${selectedPackage?.amount}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography> {t("packagesPage.totalCostWithFee")}</Typography>
                <Typography color="error.main">
                  -${selectedPackage?.hubPrice}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>
                  {" "}
                  {t("packagesPage.hubCapacityReceived")}
                </Typography>
                <Typography color="success.main">
                  +${selectedPackage?.hubCapacity}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>
                  {" "}
                  {t("packagesPage.currentCryptoBalance")}
                </Typography>
                <Typography>${User.cryptoWallet.toFixed(2)}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography> {t("packagesPage.afterPurchase")}</Typography>
                <Typography>
                  $
                  {(
                    User.cryptoWallet -
                    parseFloat(selectedPackage?.hubPrice || 0)
                  ).toFixed(2)}
                </Typography>
              </Box>
            </Paper>

            <Alert
              severity={isBalanceSufficient() ? "success" : "error"}
              sx={{ mt: 2 }}
            >
              {isBalanceSufficient() ? (
                <>
                  {t("packagesPage.sufficientBalance")}
                  <br />
                  After purchase, you will receive $
                  {selectedPackage?.hubCapacity} for mining investments!
                </>
              ) : (
                <>
                  {t("packagesPage.insufficientBalance")} You need $
                  {selectedPackage?.hubPrice} but only have $
                  {User.cryptoWallet.toFixed(2)}.
                </>
              )}
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return selectedPackage !== null && User?._id;
      case 1:
        return isBalanceSufficient();
      default:
        return false;
    }
  };

  if (!User) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Please Login
        </Typography>
        <Typography variant="body1" color="textSecondary">
          You need to be logged in to view and purchase packages.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Div sx={{ borderBottom: 2, borderColor: "divider", py: 1, mb: 3 }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <>
            <Div sx={{ display: { xs: "none", lg: "block" } }}>
              <Typography variant="h3" sx={{ my: 1 }}>
                {t("packagesPage.availableHub")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("packagesPage.choosePlan")}
              </Typography>
            </Div>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate("/myPackages")}
              sx={{
                mt: 3,
                color: "white",
                background: "linear-gradient(to right, #AC9B6D, #6A5637)",
                "&:hover": {
                  background: "linear-gradient(to right, #BFA670, #7A5F3A)",
                },
                "&:disabled": {
                  background: "linear-gradient(to right, #e5e7eb, #d1d5db)",
                  color: "#6b7280",
                  opacity: 1, // Keep it fully visible
                },
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              {t("packagesPage.myHub")}
            </Button>
          </>
        </Stack>
      </Div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Grid
          container
          spacing={4}
          className="max-w-6xl"
          justifyContent="center"
          alignItems="stretch"
        >
          {cards.map((card, index) => (
            <Grid
              item
              xs={12}
              md={4}
              key={index}
              display="flex"
              justifyContent="center"
            >
              <div className="pt-2">
                <div className="w-80 bg-white rounded-lg relative shadow-lg overflow-visible border-t-[5px] border-primary">
                  {/* <div className="bg-gray-100 flex justify-center relative">
                    <img
                      src={`${ASSET_IMAGES}/cardtop.png`}
                      alt="Competition Item"
                      className="w-[50%] absolute -top-3 rounded-t-lg"
                    />
                  </div> */}
                  <div className="text-center py-4 pt-4">
                    <h2 className="text-4xl text-grey">${card.hubPrice}</h2>
                    <p className="text-sm text-gray-600">
                      {t("packagesPage.getInvestment")} ${card.hubCapacity}
                    </p>
                  </div>
                  <div className="px-6 pb-4">
                    {/* <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">
                        Base Amount
                      </span>
                      <span className="text-gray-900 font-semibold">
                        ${card.amount}
                      </span>
                    </div> */}
                    <div className="flex justify-between items-center">
                      <span className="text-grayfont-medium">
                        {" "}
                        {t("packagesPage.hubCapacity")}
                      </span>
                      <span className="text-grey font-semibold">
                        ${card.hubCapacity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-grayfont-medium">
                        {t("packagesPage.minMintingAmount")}
                      </span>
                      <span className="text-gray font-semibold">
                        ${card.minimumMinting}
                      </span>
                    </div>
                  </div>
                  <div className="border-t-2 border-gray-800 mx-6"></div>
                  <div className="px-6 py-2">
                    {/* <h3 className="text-lg font-bold text-center text-black mb-4">
                      Mining Options
                    </h3> */}
                    <div className="mb-6">
                      <h4
                        className="font-semibold text-grey mb-2"
                        style={{
                          display: "inline-block",
                          background: "#f3f4f6",
                          padding: "0 0.5rem",
                          borderRadius: "0.25rem",
                        }}
                      >
                        {t("packagesPage.selfMinting")}
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>{t("packagesPage.selfMintingBullet1")}</li>
                        <li>{t("packagesPage.selfMintingBullet2")}</li>
                        <li>{t("packagesPage.selfMintingBullet3")}</li>
                        <li>{t("packagesPage.selfMintingBullet4")}</li>
                      </ul>
                    </div>
                    <div className="mb-6">
                      <h4
                        className="font-semibold text-grey mb-2"
                        style={{
                          display: "inline-block",
                          background: "#f3f4f6",
                          padding: "0 0.5rem",
                          borderRadius: "0.25rem",
                        }}
                      >
                        {t("packagesPage.autoMinting")}
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>{t("packagesPage.autoMintingBullet1")}</li>
                        <li>{t("packagesPage.autoMintingBullet2")}</li>
                        <li>{t("packagesPage.autoMintingBullet3")}</li>
                      </ul>
                    </div>
                    <button
                      className="w-full bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637] text-white py-2 px-4 rounded-lg font-medium hover:from-[#BFA670] hover:via-[#9C7F52] hover:to-[#7A5F3A] transition-all duration-200 flex items-center justify-center gap-2"
                      onClick={() => handlePurchaseClick(card)}
                    >
                      {t("packagesPage.buyNow")}
                    </button>
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>

        {/* Purchase Modal */}
        <Dialog
          open={purchaseModal}
          onClose={() => setPurchaseModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle> {t("packagesPage.purchaseHub")}</DialogTitle>
          <DialogContent>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {renderStepContent(activeStep)}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPurchaseModal(false)}>
              {" "}
              {t("packagesPage.cancel")}
            </Button>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              {t("packagesPage.back")}
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handlePurchaseSubmit}
                disabled={loading || !canProceed()}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  t("packagesPage.purchase")
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                {t("packagesPage.next")}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default ShowPackages;
