import { Formik, Form, FieldArray } from "formik";
import {
  Button,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
  Box,
  Paper,
  Container,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { postRequest } from "../../../../backendServices/ApiCalls";

// Default values - will be used only if API fails
const defaultValues = {
  withdrawalFee: 0,
  managementFee: 0,
  isWithdrawalEnabled: true,
  levels: Array.from({ length: 10 }, (_, i) => ({
    level: i + 1,
    commissionPercentage: 0,
  })),
  levelBonus: 0,
};

export default function CommissionSettingsForm() {
  const [initialValues, setInitialValues] = useState({
    managementFee: 15000,
    withdrawalFee: 5,
    isWithdrawalEnabled: true,
    levels: Array.from({ length: 10 }, (_, i) => ({
      level: i + 1,
      commissionPercentage: i + 1,
    })),
    levelBonus: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch current settings on component mount
  useEffect(() => {
    fetchCommissionSettings();
  }, []);

  const fetchCommissionSettings = () => {
    postRequest(
      "/getCommissionSettings",
      {}, // Empty body for POST request
      (response) => {

        if (response && response.status === 200) {
          const settings = response.data.settings;


          if (settings) {
            const formattedValues = {
              managementFee: settings.managementFee ?? 0,
              withdrawalFee:
                settings.withdrawalFee !== undefined
                  ? settings.withdrawalFee
                  : 0,
              isWithdrawalEnabled:
                settings.isWithdrawalEnabled !== undefined
                  ? settings.isWithdrawalEnabled
                  : true,
              levelBonus:
                settings.levelBonus !== undefined ? settings.levelBonus : 0,
              levels: Array.isArray(settings.levels)
                ? settings.levels.map((level, i) => ({
                    level: level.level !== undefined ? level.level : i + 1,
                    commissionPercentage:
                      level.commissionPercentage !== undefined
                        ? level.commissionPercentage
                        : 0,
                  }))
                : defaultValues.levels,
            };

            setInitialValues(formattedValues);
          } else {
            console.warn("No settings found in response");
            setInitialValues(defaultValues);
            toast.warning("Using default settings - no settings data found");
          }
        } else {
          console.warn("API call was not successful", response);
          setInitialValues(defaultValues);
          toast.warning(
            "Using default settings - couldn't load saved settings"
          );
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching settings:", error);
        toast.error("Failed to load settings. Using defaults.");
        setInitialValues(defaultValues);
        setLoading(false);
      }
    );
  };

  const handleSubmit = (values, { setSubmitting }) => {
    postRequest(
      "/updateCommissionSettings",
      values,
      (response) => {
        if (response.status == 200) {
          toast.success("Settings updated successfully!");
          if (response.data) {
            setInitialValues({
              withdrawalFee: response.data.settings.withdrawalFee || 0,
              isWithdrawalEnabled:
                response.data.settings.isWithdrawalEnabled !== false,
              levels: response.data.settings.levels || defaultValues.levels,
            });
          } else {
            setInitialValues(defaultValues);
            toast.warning(
              "Using default settings - couldn't load saved settings"
            );
          }
        } else {
          toast.error(
            "Failed to update settings: " +
              (response.message || "Unknown error")
          );
        }
        setSubmitting(false);
      },
      (error) => {
        console.error("Error updating settings:", error);
        toast.error(
          "Failed to update settings: " + (error.message || "Unknown error")
        );
        setSubmitting(false);
      }
    );
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading commission settings...
        </Typography>
      </Container>
    );
  }
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Commission Settings
        </Typography>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize={true} // Important: update form when initialValues change
        >
          {({ values, isSubmitting, handleChange }) => (
            <Form>
              <Box mb={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Withdrawal Settings
                </Typography>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="withdrawalFee"
                      label="Withdrawal Fee (%)"
                      type="number"
                      value={values.withdrawalFee}
                      onChange={handleChange}
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="levelBonus"
                      label="Level Bonus (%)"
                      type="number"
                      value={values.levelBonus}
                      onChange={handleChange}
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="commissionInLocked"
                      label="Commission In Locked (%)"
                      type="number"
                      value={values.commissionInLocked}
                      onChange={handleChange}
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="managementFee"
                      label="managementFee ($)"
                      type="number"
                      value={values.managementFee}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="isWithdrawalEnabled"
                          checked={values.isWithdrawalEnabled}
                          onChange={handleChange}
                          color="primary"
                        />
                      }
                      label="Enable Withdrawals"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box mb={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Commission Percentages (Per Level)
                </Typography>
                <FieldArray
                  name="levels"
                  render={() => (
                    <Grid container spacing={2}>
                      {values.levels.map((level, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <TextField
                            fullWidth
                            name={`levels[${index}].commissionPercentage`}
                            label={`Level ${level.level}`}
                            type="number"
                            value={level.commissionPercentage}
                            onChange={handleChange}
                            InputProps={{
                              endAdornment: "%",
                              inputProps: { min: 0, max: 100, step: 0.1 },
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={fetchCommissionSettings}
                  disabled={isSubmitting}
                >
                  Refresh
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  size="large"
                >
                  {isSubmitting ? "Saving Changes..." : "Save Changes"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
}
