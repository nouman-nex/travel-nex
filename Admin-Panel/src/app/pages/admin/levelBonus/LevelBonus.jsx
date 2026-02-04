import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Paper,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  Container,
  Stack,
} from "@mui/material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { Div } from "@jumbo/shared";

const levelData = [
  { level: 1, field: "level1", label: "LEVEL 1" },
  { level: 2, field: "level2", label: "LEVEL 2" },
  { level: 3, field: "level3", label: "LEVEL 3" },
  { level: 4, field: "level4", label: "LEVEL 4" },
  { level: 5, field: "level5", label: "LEVEL 5" },
  { level: 6, field: "level6", label: "LEVEL 6" },
  { level: 7, field: "level7", label: "LEVEL 7" },
  { level: 8, field: "level8", label: "LEVEL 8" },
  { level: 9, field: "level9", label: "LEVEL 9" },
  { level: 10, field: "level10", label: "LEVEL 10" },
];

const validationSchema = Yup.object(
  levelData.reduce((acc, item) => {
    acc[item.field] = Yup.number()
      .required("Required")
      .min(0, "Must be positive")
      .max(100, "Cannot exceed 100%");
    return acc;
  }, {})
);

function LevelBonus() {
  const notify = useNotify();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkRank, setCheckRank] = useState(false);
  const { User } = useAuth();
  const navigate = useNavigate();
  const [loadingMain, setLoadingMain] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const getLevelBonuses = () => {
    setLoading(true);
    postRequest(
      "/getAllLevelBonuses",
      {},
      (response) => {
        setLoading(false);

        if (response.data.success) {
          // Get the level bonus document (should be single document)
          const bonusDoc = response.data.bonuses;

          // Initialize form values
          const formattedValues = {};
          levelData.forEach((item) => {
            // Find the level in levelBonuses array
            const levelBonus = bonusDoc?.levelBonuses?.find(
              (b) => b.level === item.level
            );
            formattedValues[item.field] = levelBonus
              ? levelBonus.percentage
              : 0;
          });

          setInitialValues(formattedValues);

          // Set checkRank from the document
          setCheckRank(bonusDoc?.checkRank || false);
        } else {
          notify(
            response.data.message || "Failed to fetch level bonuses",
            "error"
          );
          // Set default initial values if fetch fails
          const defaultValues = {};
          levelData.forEach((item) => {
            defaultValues[item.field] = 0;
          });
          setInitialValues(defaultValues);
        }
      },
      (error) => {
        setLoading(false);
        notify("Failed to fetch level bonuses", "error");
        // Set default initial values on error
        const defaultValues = {};
        levelData.forEach((item) => {
          defaultValues[item.field] = 0;
        });
        setInitialValues(defaultValues);
      }
    );
  };

  useEffect(() => {
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isAdmin = roles.includes("Admin");
      const isMiniAdmin = roles.includes("MiniAdmin");
      const allowedRoutes = Array.isArray(User.allowedRoutes)
        ? User.allowedRoutes
        : [];
      const currentPath = window.location.pathname;

      if (isAdmin) {
        setLoadingMain(false);
        setAuthChecked(true);
        return;
      } else if (isMiniAdmin) {
        if (!allowedRoutes.includes(currentPath)) {
          if (allowedRoutes.length > 0) {
            navigate(allowedRoutes[0]);
          } else {
            navigate("/");
          }
        } else {
          setLoadingMain(false);
          setAuthChecked(true);
        }
      } else {
        navigate("/");
      }
    }
  }, [User, navigate]);

  // Data fetching useEffect - runs only after auth is checked
  useEffect(() => {
    if (authChecked && !loadingMain) {
      getLevelBonuses();
    }
  }, [authChecked, loadingMain]);

  if (loadingMain) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "primary" }} />
      </div>
    );
  }

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);

    // Convert form values to array of level bonus objects
    const levelBonuses = levelData.map((item) => ({
      level: item.level,
      percentage: parseFloat(values[item.field]) || 0,
    }));

    // Include checkRank in the request payload
    const requestData = {
      levelBonuses: levelBonuses,
      checkRank: checkRank,
    };

    // Update level bonuses with checkRank
    postRequest(
      "/updateLevelBonus",
      requestData,
      (response) => {
        setSubmitting(false);
        if (response.data.success) {
          notify("Level bonuses updated successfully!", "success");
          // Refresh data after successful update
          getLevelBonuses();
        } else {
          notify(
            response.data.message || "Failed to update level bonuses",
            "error"
          );
        }
      },
      (error) => {
        setSubmitting(false);
        notify("Failed to update level bonuses", "error");
      }
    );
  };

  const handleToggleChange = (event) => {
    setCheckRank(event.target.checked);
  };

  if (!initialValues || loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading Level Bonuses...
        </Typography>
      </Box>
    );
  }

  // Calculate total percentage
  const calculateTotal = (values) => {
    return levelData.reduce((total, item) => {
      return total + (parseFloat(values[item.field]) || 0);
    }, 0);
  };

  return (
    <Container maxWidth="xl">
      {/* <Div sx={{ borderBottom: 2, borderColor: "divider", py: 1, mb: 3 }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <>
            <Div sx={{ display: { xs: "none", lg: "block" } }}>
              <Typography variant="h3" sx={{ my: 1 }}>
                Comunity Building Bonus
              </Typography>
            </Div>
          </>
        </Stack>
      </Div> */}
      <Box sx={{ width: "100%", maxWidth: 700, mx: "auto", mt: 2 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" sx={{ mb: 2, textAlign: "center" }}>
            Comunity Minting Bonus
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, values, isSubmitting }) => (
              <Form>
                {/* Level Input Fields */}
                {levelData.map(
                  (item, index) =>
                    index % 2 === 0 && (
                      <Grid
                        container
                        spacing={3}
                        key={`row-${index}`}
                        sx={{ mb: 2 }}
                      >
                        {/* First field in the row */}
                        <Grid item xs={6}>
                          <Field
                            as={TextField}
                            name={item.field}
                            label={item.label}
                            type="number"
                            fullWidth
                            variant="outlined"
                            placeholder="0"
                            inputProps={{
                              min: 0,
                              max: 100,
                              step: 0.01,
                            }}
                            InputProps={{
                              endAdornment: (
                                <Typography sx={{ color: "text.secondary" }}>
                                  %
                                </Typography>
                              ),
                            }}
                            error={
                              touched[item.field] && Boolean(errors[item.field])
                            }
                            helperText={
                              touched[item.field] && errors[item.field]
                            }
                          />
                        </Grid>

                        {/* Second field in the row (if exists) */}
                        {levelData[index + 1] && (
                          <Grid item xs={6}>
                            <Field
                              as={TextField}
                              name={levelData[index + 1].field}
                              label={levelData[index + 1].label}
                              type="number"
                              fullWidth
                              variant="outlined"
                              placeholder="0"
                              inputProps={{
                                min: 0,
                                max: 100,
                                step: 0.01,
                              }}
                              InputProps={{
                                endAdornment: (
                                  <Typography sx={{ color: "text.secondary" }}>
                                    %
                                  </Typography>
                                ),
                              }}
                              error={
                                touched[levelData[index + 1].field] &&
                                Boolean(errors[levelData[index + 1].field])
                              }
                              helperText={
                                touched[levelData[index + 1].field] &&
                                errors[levelData[index + 1].field]
                              }
                            />
                          </Grid>
                        )}
                      </Grid>
                    )
                )}

                {/* Total Percentage Display */}
                <Box sx={{ mb: 3, textAlign: "center" }}>
                  <Typography variant="h6" color="primary">
                    Total: {calculateTotal(values).toFixed(2)}%
                  </Typography>
                </Box>

                {/* Toggle and Submit Button Row */}
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  {/* Left side - Toggle Button */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={checkRank}
                        onChange={handleToggleChange}
                        color="primary"
                      />
                    }
                    label="Check Rank"
                    sx={{ margin: 0 }}
                  />

                  {/* Right side - Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      color: "white",
                      minWidth: 120,
                      background:
                        "linear-gradient(to right, #AC9B6D, #8B7550, #6A5637)",
                    }}
                    size="large"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
}

export default LevelBonus;
