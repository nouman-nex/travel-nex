import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Stack,
  CircularProgress,
} from "@mui/material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";
import { Div } from "@jumbo/shared";

const validationSchema = Yup.object({
  level1Bonus: Yup.number()
    .required("Level 1 Bonus is required")
    .min(0, "Value must be at least 0"),
  remainingLevelBonus: Yup.number()
    .required("Remaining Level Bonus is required")
    .min(0, "Value must be at least 0"),
});

function BuildingBonus() {
  const notify = useNotify();
  const [initialValues, setInitialValues] = useState({
    level1Bonus: 5,
    remainingLevelBonus: 2,
  });
  const [loading, setLoading] = useState(true);

  const getBuildingBonus = () => {
    setLoading(true);
    postRequest(
      "/getbuildingbonus",
      { keyname: "Building Bonus" },
      (response) => {
        if (response.data.success) {
          const data = response.data.setting.value || {};
          setInitialValues({
            level1Bonus: data.level1Bonus ?? 5,
            remainingLevelBonus: data.remainingLevelBonus ?? 2,
          });
        } else {
          notify(
            response.data.message || "Failed to fetch Building Bonus settings",
            "error"
          );
        }
        setLoading(false);
      }
    );
  };

  const updateBuildingBonus = (values, { setSubmitting, resetForm }) => {
    postRequest("/updatebuildingbonus", values, (response) => {
      if (response.data.success) {
        notify("Building Bonus updated successfully", "success");
        setInitialValues(values);
        resetForm({ values });
      } else {
        notify(
          response.data.message || "Failed to update Building Bonus",
          "error"
        );
      }
      setSubmitting(false);
    });
  };

  useEffect(() => {
    getBuildingBonus();
  }, []);

  if (loading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* <Div sx={{ borderBottom: 2, borderColor: "divider", py: 1, mb: 3 }}>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Div sx={{ display: { xs: "none", lg: "block" } }}>
            <Typography variant="h3" sx={{ my: 1 }}>
              Building Bonus
            </Typography>
          </Div>
        </Stack>
      </Div> */}

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ my: "auto" }}
        bgcolor="#f5f6fa"
      >
        <Paper elevation={3} sx={{ p: 4, width: 400 }}>
          <Typography variant="h3" sx={{ mb: 2, textAlign: "center" }}>
            Configure Building Bonus
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={updateBuildingBonus}
          >
            {({
              isSubmitting,
              errors,
              touched,
              handleChange,
              handleBlur,
              values,
            }) => (
              <Form>
                <TextField
                  fullWidth
                  label="Level 1 Building Bonus"
                  name="level1Bonus"
                  type="number"
                  value={values.level1Bonus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.level1Bonus && Boolean(errors.level1Bonus)}
                  helperText={touched.level1Bonus && errors.level1Bonus}
                  margin="normal"
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />

                <TextField
                  fullWidth
                  label="Remaining Level Building Bonus"
                  name="remainingLevelBonus"
                  type="number"
                  value={values.remainingLevelBonus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.remainingLevelBonus &&
                    Boolean(errors.remainingLevelBonus)
                  }
                  helperText={
                    touched.remainingLevelBonus && errors.remainingLevelBonus
                  }
                  margin="normal"
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    color: "white",
                    mt: 2,
                    background:
                      "linear-gradient(to right, #AC9B6D, #8B7550, #6A5637)",
                  }}
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? <CircularProgress size={20} /> : null
                  }
                >
                  {isSubmitting ? "Saving..." : "Save Building Bonus"}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
}

export default BuildingBonus;
