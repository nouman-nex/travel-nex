import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  TrendingDown,
  Send,
  Warning,
} from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { Div } from "@jumbo/shared";
import useNotify from "@app/_components/Notification/useNotify";

const coinOptions = [{ value: "usdt", label: "USDT" }];

function Withdraw() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { User } = useAuth();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const notify = useNotify();
  const [feeInfo, setFeeInfo] = useState({
    bepFixed: 1,
    bepPercent: 3,
    trcFixed: 5,
    trcPercent: 3,
  });
  const validationSchema = Yup.object({
    coin: Yup.string().required(t("depositPage.validation.required")),
    chain: Yup.string().required(t("depositPage.validation.required")),
    walletAddress: Yup.string()
      .required(t("depositPage.validation.required"))
      .min(10, t("depositPage.validation.required")),
    amount: Yup.number()
      .required(t("depositPage.validation.required"))
      .min(1, t("depositPage.validation.amountMin"))
      .max(1000000, t("depositPage.validation.amountMax")),
  });
  const calculateFees = (chain, amount) => {
    if (!chain || !amount || amount <= 0) {
      return { fixedFee: 0, percentageFee: 0, totalFees: 0, netAmount: 0 };
    }

    const fixedFee = chain === "bep20" ? feeInfo.bepFixed : feeInfo.trcFixed;
    const percentRate =
      chain === "bep20" ? feeInfo.bepPercent : feeInfo.trcPercent;
    const percentageFee = (amount * percentRate) / 100;
    const totalFees = fixedFee + percentageFee;
    const netAmount = amount - totalFees;

    return { fixedFee, percentageFee, totalFees, netAmount };
  };

  const chainOptions = useMemo(
    () => [
      {
        value: "bep20",
        label: "BEP20 (Binance Smart Chain)",
        fee: `$${feeInfo.bepFixed} + ${feeInfo.bepPercent}%`,
        time: "10‑30 min",
        popular: true,
      },
      {
        value: "trc20",
        label: "TRC20 (Tron Network)",
        fee: `$${feeInfo.trcFixed} + ${feeInfo.trcPercent}%`,
        time: "5‑15 min",
        popular: false,
      },
    ],
    [feeInfo]
  );

  useEffect(() => {
    postRequest("/getwithdrawlFees", {}, (res) => {
      if (res.data?.success) {
        const { bep20, trc20 } = res.data.fees;
        setFeeInfo({
          bepFixed: bep20.fixedFee ?? 1,
          bepPercent: bep20.percentFee ?? 3,
          trcFixed: trc20.fixedFee ?? 5,
          trcPercent: trc20.percentFee ?? 3,
        });
      } else {
        notify(res.data.message || "Failed to load withdrawal fees", "error");
      }
    });
  }, []);

  useEffect(() => {
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isUser = roles.includes("User");

      if (!isUser) {
        navigate("/adminDashboard");
      }
    }
  }, [User, navigate]);

  const getWalletAddress = (chain) => {
    if (!User) return "";

    if (chain === "trc20") {
      return User.trcWalletAddress || "";
    } else if (chain === "bep20") {
      return User.bepWalletAddress || "";
    }
    return "";
  };

  const handleWithdrawRequest = async (
    values,
    { resetForm, setSubmitting }
  ) => {
    try {
      if (!User?.withdrawalEnabled) {
        notify("Withdrawals are currently disabled for your account", "error");
        setLoading(false);
        setSubmitting(false);
        return;
      }

      setLoading(true);
      setMessage({ type: "", text: "" });

      const { fixedFee, percentageFee, totalFees, netAmount } = calculateFees(
        values.chain,
        parseFloat(values.amount)
      );

      if (User.currentBalance < parseFloat(values.amount)) {
        setMessage({
          type: "error",
          text: `Insufficient balance for withdrawal of ${parseFloat(values.amount).toFixed(2)}`,
        });
        setLoading(false);
        setSubmitting(false);
        return;
      }

      if (netAmount <= 0) {
        setMessage({
          type: "error",
          text: `Amount too small. After fees (${totalFees.toFixed(2)}), net amount would be ${netAmount.toFixed(2)}. Please enter a larger amount.`,
        });
        setLoading(false);
        setSubmitting(false);
        return;
      }

      const params = {
        amount: parseFloat(values.amount),
        netAmount: netAmount,
        paymentMethod: values.chain,
        payoutAddress: values.walletAddress,
        feeInfo: {
          fixedFee: fixedFee,
          percentageFee: percentageFee,
          totalFees: totalFees,
          feeRate:
            values.chain === "bep20" ? feeInfo.bepPercent : feeInfo.trcPercent,
        },
      };

      await postRequest("/createWithdrawRequest", params, (response) => {
        if (response) {
          // setMessage({
          //   type: "success",
          //   text: "Withdrawal request submitted successfully!",
          // });
          // Deduct only the entered amount from user balance
          setUser((prevUser) => ({
            ...prevUser,
            currentBalance: prevUser.currentBalance - parseFloat(values.amount),
          }));
          setLoading(false);
          notify(t("withdrawalPage.successNotification"), "success");
          resetForm();
        } else {
          setMessage({
            type: "error",
            text: response.message || "Withdrawal failed. Please try again.",
          });
          setLoading(false);
        }
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again later.",
      });
      setLoading(false);
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
              variant="h4"
              sx={{
                background: "linear-gradient(to right, #374151, #4B5563)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("withdrawPage.title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("withdrawPage.subtitle")}
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
                    <Send sx={{ color: "#fff", fontSize: 30 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      background: "linear-gradient(to right, #374151, #4B5563)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {t("withdrawPage.stats.quickWithdrawals")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("withdrawPage.stats.quickWithdrawals")}
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
                    {t("withdrawPage.stats.multiLayerSecurity")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("depositPage.features.bankLevelSecurity")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={2} sx={{ textAlign: "center" }}>
                <CardContent>
                  <TrendingDown color="warning" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      background: "linear-gradient(to right, #374151, #4B5563)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {t("withdrawPage.stats.lowFees")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("depositPage.features.competitiveCosts")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

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
              {t("withdrawPage.form.requestWithdrawal")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t("withdrawPage.form.formDescription")}
            </Typography>
            {!User?.withdrawalEnabled && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                {t("withdrawPage.form.withdrawalDisabledAlert")}
              </Alert>
            )}
            {/* {message.text && (
            <Alert severity={message.type} sx={{ mb: 3 }}>
                {message.text}
            </Alert>
        )} */}

            <Formik
              initialValues={{
                coin: "usdt",
                chain: "",
                walletAddress: "",
                amount: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleWithdrawRequest}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
                isSubmitting,
              }) => {
                const { fixedFee, percentageFee, totalFees, netAmount } =
                  calculateFees(values.chain, parseFloat(values.amount));
                const enteredAmount = parseFloat(values.amount) || 0;

                return (
                  <Form>
                    <Stack spacing={3}>
                      <FormControl fullWidth>
                        <InputLabel id="coin-label">
                          {t("withdrawPage.form.cryptocurrencyLabel")}
                        </InputLabel>
                        <Select
                          labelId="coin-label"
                          id="coin"
                          name="coin"
                          value={values.coin}
                          label={t("withdrawPage.form.cryptocurrencyLabel")}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          {coinOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
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
                                  <Typography>
                                    {t("depositPage.form.usdtOption.label")}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {t(
                                      "depositPage.form.usdtOption.description"
                                    )}
                                  </Typography>
                                </Box>
                              </Stack>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl
                        fullWidth
                        error={Boolean(touched.chain && errors.chain)}
                      >
                        <InputLabel id="chain-label">
                          {t("withdrawPage.form.networkLabel")}
                        </InputLabel>
                        <Select
                          labelId="chain-label"
                          id="chain"
                          name="chain"
                          value={values.chain}
                          label={t("withdrawPage.form.networkLabel")}
                          onChange={(e) => {
                            handleChange(e);
                            const savedAddress = getWalletAddress(
                              e.target.value
                            );
                            setFieldValue("walletAddress", savedAddress);
                          }}
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
                                      {option.value === "bep20"
                                        ? t(
                                            "depositPage.chainOptions.bep20.label"
                                          )
                                        : t(
                                            "depositPage.chainOptions.trc20.label"
                                          )}
                                    </Typography>
                                    {option.popular && (
                                      <Chip
                                        label={t(
                                          "depositPage.chainOptions.bep20.recommended"
                                        )}
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
                                    Fee: {option.fee} •{" "}
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
                        id="walletAddress"
                        name="walletAddress"
                        label={t("withdrawPage.form.walletAddressLabel")}
                        value={values.walletAddress}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.walletAddress && errors.walletAddress
                        )}
                        helperText={
                          touched.walletAddress && errors.walletAddress
                            ? errors.walletAddress
                            : values.chain && getWalletAddress(values.chain)
                              ? t("withdrawPage.form.savedAddressHelperText")
                              : t("withdrawPage.form.walletAddressHelperText")
                        }
                        multiline
                        rows={2}
                        InputProps={{
                          startAdornment: (
                            <Typography sx={{ mr: 1, color: "text.secondary" }}>
                              🔗
                            </Typography>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        id="amount"
                        name="amount"
                        label={t("withdrawPage.form.amountLabel")}
                        type="number"
                        value={values.amount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.amount && errors.amount)}
                        helperText={
                          (touched.amount && errors.amount) ||
                          `${t("withdrawPage.form.amountLabel")} $${User?.currentBalance?.toFixed(2) || "0.00"}`
                        }
                        inputProps={{
                          step: "0.01",
                          min: "0.01",
                          max: User?.currentBalance || 1000000,
                        }}
                        InputProps={{
                          startAdornment: (
                            <Typography sx={{ mr: 1, color: "text.secondary" }}>
                              $
                            </Typography>
                          ),
                        }}
                      />

                      {/* Fee Breakdown */}
                      {values.chain &&
                        values.amount &&
                        parseFloat(values.amount) > 0 && (
                          <Card elevation={1} sx={{ bgcolor: "grey.50", p: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              {t("withdrawPage.form.feeBreakdownTitle")}
                            </Typography>
                            <Stack spacing={1}>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                              >
                                <Typography variant="body2">
                                  {t("withdrawPage.form.totalAmountEntered")}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                  ${enteredAmount.toFixed(2)}
                                </Typography>
                              </Box>
                              <Divider />
                              <Box
                                display="flex"
                                justifyContent="space-between"
                              >
                                <Typography variant="body2">
                                  {t("withdrawPage.form.fixedFee")}
                                </Typography>
                                <Typography variant="body2" color="error">
                                  -${fixedFee.toFixed(2)}
                                </Typography>
                              </Box>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                              >
                                <Typography variant="body2">
                                  {t("withdrawalPage.form.percentageFee")} (
                                  {values.chain === "bep20"
                                    ? feeInfo.bepPercent
                                    : feeInfo.trcPercent}
                                  %):
                                </Typography>
                                <Typography variant="body2" color="error">
                                  -${percentageFee.toFixed(2)}
                                </Typography>
                              </Box>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                              >
                                <Typography variant="body2" color="error">
                                  {t("withdrawPage.form.totalFees")}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  fontWeight="bold"
                                  color="error"
                                >
                                  -${totalFees.toFixed(2)}
                                </Typography>
                              </Box>
                              <Divider />
                              <Box
                                display="flex"
                                justifyContent="space-between"
                              >
                                <Typography
                                  variant="body2"
                                  fontWeight="bold"
                                  color="primary"
                                >
                                  {t("withdrawPage.form.youWillReceive")}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  fontWeight="bold"
                                  color="primary"
                                >
                                  $
                                  {netAmount > 0
                                    ? netAmount.toFixed(2)
                                    : "0.00"}
                                </Typography>
                              </Box>
                              {netAmount <= 0 && (
                                <Alert severity="warning" sx={{ mt: 1 }}>
                                  {t("withdrawPage.form.amountTooSmallAlert")}
                                </Alert>
                              )}
                            </Stack>
                          </Card>
                        )}

                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        className="bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637]"
                        fullWidth
                        disabled={
                          isSubmitting || loading || !User?.withdrawalEnabled
                        }
                        sx={{
                          py: 1.5,
                          fontWeight: 600,
                          fontSize: "1rem",
                        }}
                        startIcon={
                          loading || isSubmitting ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Send />
                          )
                        }
                      >
                        {!User?.withdrawalEnabled
                          ? t("withdrawPage.form.withdrawDisabledButton")
                          : loading || isSubmitting
                            ? t("withdrawPage.form.processingButton")
                            : t("withdrawPage.form.withdrawNowButton")}
                      </Button>
                    </Stack>
                  </Form>
                );
              }}
            </Formik>
          </Paper>
        </Grid>

        {/* Information Panel */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Current Balance */}
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
                  {t("withdrawPage.infoPanel.availableBalanceTitle")}
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="700">
                  ${User?.currentBalance?.toFixed(2) || "0.00"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("withdrawPage.infoPanel.availableForWithdrawal")}
                </Typography>
              </CardContent>
            </Card>

            {/* Withdrawal Information */}
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" fontWeight="500" gutterBottom>
                  {t("withdrawPage.infoPanel.infoTitle")}
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
                      {t("withdrawPage.infoPanel.processingTime")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("withdrawPage.infoPanel.processingTimeValue")}
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
                      {t("withdrawPage.infoPanel.minimumAmount")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("withdrawPage.infoPanel.minimumAmountValue")}
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
                      {t("withdrawPage.infoPanel.feeStructure")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      BEP20: ${feeInfo.bepFixed} + {feeInfo.bepPercent}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      TRC20: ${feeInfo.trcFixed} + {feeInfo.trcPercent}%
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
                      {t("withdrawPage.infoPanel.support")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("withdrawPage.infoPanel.supportMessage")}
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
                  <Warning />
                  <Box>
                    <Typography variant="h6" color="white" gutterBottom>
                      {t("withdrawPage.infoPanel.importantNoticeTitle")}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {t("withdrawPage.infoPanel.importantNoticeMessage")}
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

export default Withdraw;
