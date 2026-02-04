import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Paper,
  TextField,
  Alert,
  CircularProgress,
  Container,
  Stack,
  Card,
  CardContent,
  Divider,
  Grid,
  Chip,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Security,
  Speed,
  TrendingUp,
} from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { Div } from "@jumbo/shared";
import useNotify from "@app/_components/Notification/useNotify";
import { useTranslation } from "react-i18next";

function Deposit() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { User } = useAuth();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const notify = useNotify();

  const validationSchema = Yup.object({
    coin: Yup.string().required(t("depositPage.validation.required")),
    chain: Yup.string().required(t("depositPage.validation.required")),
    amount: Yup.number()
      .required(t("depositPage.validation.required"))
      .min(0.01, t("depositPage.validation.amountMin"))
      .max(1000000, t("depositPage.validation.amountMax")),
  });

  const chainOptions = [
    {
      value: "bep20",
      label: "BEP20 (Binance Smart Chain)",
      fee: "~$1",
      time: "1-3 min",
      popular: true,
    },
    {
      value: "trc20",
      label: "TRC20 (Tron Network)",
      fee: "~$0.50",
      time: "1-2 min",
      popular: false,
    },
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

  const handleDepositRequest = async (values, { resetForm, setSubmitting }) => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const params = {
        coin: values.coin,
        chain: values.chain,
        amount: parseFloat(values.amount),
      };

      await postRequest("/deposit", params, (response) => {
        if (response) {
          // setMessage({
          //   type: "success",
          //   text: "Deposit submitted successfully!",
          // });
          setUser((prevUser) => ({
            ...prevUser,
            cryptoWallet: prevUser.cryptoWallet + parseFloat(values.amount),
          }));
          notify(t("depositPage.messages.success"), "success");
          setLoading(false);
          resetForm();
        } else {
          setMessage({
            type: "error",
            text: response.message || t("depositPage.messages.failed"),
          });
          setLoading(false);
        }
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: t("depositPage.messages.error"),
      });
    }
  };

  return (
    <Container maxWidth="xl">
      {/* Header Section */}
      <Div sx={{ borderBottom: 2, borderColor: "divider", py: 2, mb: 4 }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Div sx={{ display: { xs: "none", lg: "block" } }}>
            <Typography
              variant="h3"
              sx={{
                background: "linear-gradient(to right, #374151, #4B5563)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("depositPage.title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("depositPage.subtitle")}
            </Typography>
          </Div>
          <Stack direction="row" spacing={2}>
            <Chip
              icon={<Security />}
              label={t("depositPage.features.secure")}
              variant="outlined"
              color="success"
            />
            <Chip
              icon={<Speed />}
              label={t("depositPage.features.fastProcessing")}
              variant="outlined"
              color="primary"
            />
          </Stack>
        </Stack>
      </Div>

      <Grid container spacing={4}>
        {/* Statistics Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card elevation={2} sx={{ textAlign: "center" }}>
                <CardContent>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(to right, #AC9B6D, #8B7550, #6A5637)",
                      mb: 1,
                      mx: "auto",
                    }}
                  >
                    <AccountBalanceWallet
                      sx={{ color: "#fff", fontSize: 30 }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      background: "linear-gradient(to right, #374151, #4B5563)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {t("depositPage.features.instantDeposits")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("depositPage.features.fastConfirmation")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card elevation={2} sx={{ textAlign: "center" }}>
                <CardContent>
                  <Security color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      background: "linear-gradient(to right, #374151, #4B5563)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {t("depositPage.features.bankLevelSecurity")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("depositPage.features.fundsProtected")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={2} sx={{ textAlign: "center" }}>
                <CardContent>
                  <TrendingUp color="warning" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      background: "linear-gradient(to right, #374151, #4B5563)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {t("depositPage.features.noFees")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("depositPage.features.competitiveCosts")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Main Form */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={4} sx={{ p: 4 }}>
            <Typography
              variant="h5"
              sx={{
                background: "linear-gradient(to right, #374151, #4B5563)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              gutterBottom
            >
              {t("depositPage.form.makeDeposit")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t("depositPage.formSubtitle")}
            </Typography>

            {/* {message.text && (
              <Alert severity={message.type} sx={{ mb: 3 }}>
                {message.text}
              </Alert>
            )} */}

            <Formik
              initialValues={{
                coin: "usdt",
                chain: "",
                amount: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleDepositRequest}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isSubmitting,
              }) => (
                <Form>
                  <Stack spacing={3}>
                    <FormControl fullWidth>
                      <InputLabel id="coin-label">
                        {t("depositPage.form.cryptocurrency")}
                      </InputLabel>
                      <Select
                        labelId="coin-label"
                        id="coin"
                        name="coin"
                        value={values.coin}
                        label={t("depositPage.form.cryptocurrency")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      >
                        <MenuItem value="usdt">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                bgcolor: "#26a69a",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              ₮
                            </Box>
                            <Box>
                              <Typography>USDT - Tether</Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t("depositPage.form.usdtOption.description")}
                              </Typography>
                            </Box>
                          </Stack>
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl
                      fullWidth
                      error={Boolean(touched.chain && errors.chain)}
                    >
                      <InputLabel id="chain-label">
                        {t("depositPage.form.network")}
                      </InputLabel>
                      <Select
                        labelId="chain-label"
                        id="chain"
                        name="chain"
                        value={values.chain}
                        label={t("depositPage.form.network")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {chainOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              width="100%"
                              alignItems="center"
                            >
                              <Box>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <Typography fontWeight="500">
                                    {option.label}
                                  </Typography>
                                  {option.popular && (
                                    <Chip
                                      label="Recommended"
                                      size="small"
                                      color="primary"
                                      variant="outlined"
                                    />
                                  )}
                                </Stack>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {t(
                                    "depositPage.chainOptions.bep20.processing"
                                  )}
                                </Typography>
                              </Box>
                            </Stack>
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.chain && errors.chain && (
                        <Typography
                          color="error"
                          variant="caption"
                          sx={{ mt: 1 }}
                        >
                          {errors.chain}
                        </Typography>
                      )}
                    </FormControl>

                    <TextField
                      fullWidth
                      id="amount"
                      name="amount"
                      label={t("depositPage.form.amount")}
                      type="number"
                      value={values.amount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.amount && errors.amount)}
                      helperText={
                        (touched.amount && errors.amount) ||
                        t("depositPage.form.amountHelper")
                      }
                      inputProps={{
                        step: "0.01",
                        min: "0.01",
                      }}
                      InputProps={{
                        startAdornment: (
                          <Typography sx={{ mr: 1, color: "text.secondary" }}>
                            $
                          </Typography>
                        ),
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      className={`bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637]${loading && "text-white"}`}
                      disabled={isSubmitting || loading}
                      sx={{
                        py: 1.5,
                        fontWeight: 500,
                        fontSize: "1rem",
                      }}
                      startIcon={
                        loading ? (
                          <CircularProgress size={20} color="white" />
                        ) : (
                          <AccountBalanceWallet />
                        )
                      }
                    >
                      {loading
                        ? t("depositPage.form.processing")
                        : t("depositPage.form.depositButton")}
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>

        {/* Information Panel */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Deposit Information */}
            <Card elevation={2}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(to right, #374151, #4B5563)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  gutterBottom
                >
                  {t("depositPage.depositInfo.title")}
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        background:
                          "linear-gradient(to right, #374151, #4B5563)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {t("depositPage.depositInfo.processingTime")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("depositPage.depositInfo.processingTimeValue")}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        background:
                          "linear-gradient(to right, #374151, #4B5563)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {t("depositPage.depositInfo.confirmations")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("depositPage.depositInfo.confirmationsValue")}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        background:
                          "linear-gradient(to right, #374151, #4B5563)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {t("depositPage.depositInfo.support")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("depositPage.depositInfo.supportValue")}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card
              elevation={2}
              sx={{ bgcolor: "primary.main", color: "white" }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Security />
                  <Box>
                    <Typography variant="h6" gutterBottom color="white">
                      {t("depositPage.securityNotice.title")}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {t("depositPage.securityNotice.message")}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Deposit;
