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
  Container,
  Stack,
} from "@mui/material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { Div } from "@jumbo/shared";

const headings = [
  "No Investment",
  "5X",
  "10X",
  "15X",
  "20X",
  "25X",
  "30X",
  "35X",
  "40X",
  "45X",
  "50X",
  "100X",
];

const fieldNames = [
  "noInvestment",
  "x5",
  "x10",
  "x15",
  "x20",
  "x25",
  "x30",
  "x35",
  "x40",
  "x45",
  "x50",
  "x100",
];

const validationSchema = Yup.object(
  fieldNames.reduce((acc, field) => {
    acc[field] = Yup.string().required("Required");
    return acc;
  }, {})
);

function AutoMintingcommission() {
  const notify = useNotify();
  const [initialValues, setInitialValues] = useState(null);
  const { User } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const getMintingCommission = () => {
    postRequest("/getAllMintingCommission", {}, (response) => {
      if (response.data.success) {
        const commissions = response.data.commissions || [];
        const autoMinting = commissions.find(
          (item) => item.commissionType === "autoMinting"
        );

        if (autoMinting && autoMinting.rates) {
          const rates = autoMinting.rates;

          const formattedValues = {
            noInvestment: rates.noInvestment || "",
            x5: rates["5x"] || "",
            x10: rates["10x"] || "",
            x15: rates["15x"] || "",
            x20: rates["20x"] || "",
            x25: rates["25x"] || "",
            x30: rates["30x"] || "",
            x35: rates["35x"] || "",
            x40: rates["40x"] || "",
            x45: rates["45x"] || "",
            x50: rates["50x"] || "",
            x100: rates["100x"] || "",
          };

          setInitialValues(formattedValues);
        } else {
          notify("Auto Minting commission data not found", "error");
        }
      } else {
        notify(response.data.message || "Failed to fetch commissions", "error");
      }
    });
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
        setLoading(false);
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
          setLoading(false);
          setAuthChecked(true);
        }
      } else {
        navigate("/");
      }
    }
  }, [User, navigate]);

  // Data fetching useEffect - runs only after auth is checked
  useEffect(() => {
    if (authChecked && !loading) {
      getMintingCommission();
    }
  }, [authChecked, loading]);

  if (loading) {
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

  if (!initialValues) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

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
                Auto Minting Commission
              </Typography>
            </Div>
          </>
        </Stack>
      </Div> */}
      <Box sx={{ maxWidth: 700, mx: "auto", mt: 1 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const formattedData = {
                commissionType: "autoMinting",
                rates: {
                  noInvestment: values.noInvestment,
                  "5x": values.x5,
                  "10x": values.x10,
                  "15x": values.x15,
                  "20x": values.x20,
                  "25x": values.x25,
                  "30x": values.x30,
                  "35x": values.x35,
                  "40x": values.x40,
                  "45x": values.x45,
                  "50x": values.x50,
                  "100x": values.x100,
                },
              };

              setSubmitting(true);
              postRequest(
                "/updateMintingCommission",
                formattedData,
                (response) => {
                  if (response.data.success) {
                    notify("Commission updated successfully!", "success");
                  } else {
                    notify(
                      response.data.message || "Failed to update commission",
                      "error"
                    );
                  }
                  setSubmitting(false);
                }
              );
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Typography variant="h3" sx={{mb:2, textAlign: "center" }}>
                  Auto Minting Commission
                </Typography>
                <Grid container spacing={2}>
                  {headings.map((heading, idx) => {
                    const field = fieldNames[idx];
                    return (
                      <Grid item xs={12} sm={6} key={field}>
                        <Field
                          as={TextField}
                          name={field}
                          label={heading}
                          fullWidth
                          variant="outlined"
                          error={touched[field] && Boolean(errors[field])}
                          helperText={touched[field] && errors[field]}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      color: "white",
                      minWidth: 120,
                      position: "relative",
                      background:
                        "linear-gradient(to right, #AC9B6D, #8B7550, #6A5637)",
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
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

export default AutoMintingcommission;
