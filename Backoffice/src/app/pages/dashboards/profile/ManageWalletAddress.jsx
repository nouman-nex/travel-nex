import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useNotify from "@app/_components/Notification/useNotify";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { JumboCard } from "@jumbo/components";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { useTranslation } from "react-i18next";

export default function ManageWalletAddress() {
  const { t } = useTranslation();
  const { User, setUser } = useAuth();
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    network: Yup.string().required(t("validation.selectNetwork")),
    walletAddress: Yup.string()
      .min(26, t("validation.walletMin"))
      .max(62, t("validation.walletMax"))
      .required(t("validation.walletRequired")),
  });

  const walletData = {
    bep20: User?.bepWalletAddress || "",
    trc20: User?.trcWalletAddress || "",
    trdo: User?.trdoWalletAddress || "",
  };

  const networks = [
    { value: "bep20", label: "BEP-20 (BSC)" },
    { value: "trc20", label: "TRC-20 (Tron)" },
    { value: "trdo", label: "TRDO Network" },
  ];

  const handleSubmit = (values) => {
    setLoading(true);

    let payload = {};
    if (values.network === "bep20") {
      payload = { bepWalletAddress: values.walletAddress };
    } else if (values.network === "trc20") {
      payload = { trcWalletAddress: values.walletAddress };
    } else if (values.network === "trdo") {
      payload = { trdoWalletAddress: values.walletAddress };
    }

    postRequest(
      "/updateWalletAddress",
      payload,
      (response) => {
        if (response?.data?.status === "success") {
          notify(response?.data?.message, response?.data?.status);

          let userUpdate = { ...User };
          if (values.network === "bep20") {
            userUpdate.bepWalletAddress = values.walletAddress;
          } else if (values.network === "trc20") {
            userUpdate.trcWalletAddress = values.walletAddress;
          } else if (values.network === "trdo") {
            userUpdate.trdoWalletAddress = values.walletAddress;
          }

          setUser(userUpdate);
        } else if (response?.data?.status === "error") {
          notify(response?.data?.message, response?.data?.status);
        }
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      },
    );
  };

  return (
    <JumboCard contentWrapper>
      <Grid container spacing={3}>
        {/* Left Side Image */}
        <Grid item xs={12} md={4}>
          <Box>
            <img
              src={`${ASSET_IMAGES}/profile.png`}
              alt="Wallet"
              style={{ width: "100%", maxWidth: 300 }}
            />
          </Box>
        </Grid>

        {/* Right Side Form */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" mb={2}>
            {t("ProfileSetting.manageWithdraw")}
          </Typography>

          <Formik
            initialValues={{
              currency: "USDT",
              network: walletData.bep20
                ? "bep20"
                : walletData.trc20
                  ? "trc20"
                  : walletData.trdo
                    ? "trdo"
                    : "",
              walletAddress:
                walletData.bep20 || walletData.trc20 || walletData.trdo || "",
            }}
            enableReinitialize={true} // 👈 Important for async user data
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue }) => {
              useEffect(() => {
                if (values.network) {
                  let address = "";
                  if (values.network === "bep20") {
                    address = User?.bepWalletAddress;
                  } else if (values.network === "trc20") {
                    address = User?.trcWalletAddress;
                  } else if (values.network === "trdo") {
                    address = User?.trdoWalletAddress;
                  }
                  setFieldValue("walletAddress", address || "");
                }
              }, [values.network, User]);

              return (
                <Form>
                  <Grid container spacing={2}>
                    {/* Currency */}
                    <Grid item xs={12}>
                      <TextField
                        label={t("withdraw.currency")}
                        value="USDT"
                        fullWidth
                        size="small"
                        disabled
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "primary.main",
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </Grid>

                    {/* Network Select */}
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        size="small"
                        error={touched.network && Boolean(errors.network)}
                      >
                        <InputLabel>{t("withdraw.network")}</InputLabel>
                        <Select
                          value={values.network}
                          label={t("withdraw.network")}
                          onChange={(e) => {
                            const selected = e.target.value;
                            setFieldValue("network", selected);
                            setFieldValue(
                              "walletAddress",
                              walletData[selected],
                            );
                          }}
                        >
                          {networks.map((net) => (
                            <MenuItem key={net.value} value={net.value}>
                              {net.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <ErrorMessage
                          name="network"
                          component="div"
                          style={{ color: "#d32f2f", fontSize: "0.75rem" }}
                        />
                      </FormControl>
                    </Grid>

                    {/* Wallet Address */}
                    <Grid item xs={12}>
                      <TextField
                        label={t("withdraw.walletAddress")}
                        name="walletAddress"
                        size="small"
                        fullWidth
                        value={values.walletAddress}
                        onChange={(e) =>
                          setFieldValue("walletAddress", e.target.value)
                        }
                        disabled={!values.network}
                        error={
                          touched.walletAddress && Boolean(errors.walletAddress)
                        }
                        helperText={<ErrorMessage name="walletAddress" />}
                        multiline
                        rows={2}
                        placeholder={
                          values.network
                            ? t("withdraw.walletPlaceholder", {
                                network: values.network.toUpperCase(),
                              })
                            : t("withdraw.selectNetworkFirst")
                        }
                      />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={loading}
                        sx={{
                          color: "#fff",
                          fontWeight: 500,
                          background:
                            "linear-gradient(to right, #7DD3FC, #8B7550, #0EA5E9)",
                          borderRadius: "0.5rem",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background:
                              "linear-gradient(to right, #BFA670, #9C7F52, #7A5F3A)",
                          },
                        }}
                      >
                        {t("ProfileSetting.saveChanges")}
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </Grid>
      </Grid>
    </JumboCard>
  );
}
