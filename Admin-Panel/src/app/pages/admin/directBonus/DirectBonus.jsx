import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
  value: Yup.number()
    .required("Value is required")
    .min(0, "Value must be at least 0"),
});

function DirectBonus() {
  const notify = useNotify();
  const [initialValues, setInitialValues] = useState({ value: 10 });
  const [loading, setLoading] = useState(true);

  const getDirectBonus = () => {
    setLoading(true);
    postRequest("/getsetting", { keyname: "Direct Bonus" }, (response) => {
      if (response.data.success) {
        setInitialValues({ value: response.data.setting.value || 10 });
      } else {
        notify(
          response.data.message || "Failed to fetch Direct Bonus settings",
          "error"
        );
      }
      setLoading(false);
    });
  };

  const updateDirectBonus = (values, { setSubmitting, resetForm }) => {
    postRequest("/updatedirectbonus", { value: values.value }, (response) => {
      if (response.data.success) {
        notify("Direct Bonus updated successfully", "success");
        setInitialValues({ value: values.value });
        resetForm({ values: { value: values.value } });
      } else {
        notify(
          response.data.message || "Failed to update Direct Bonus",
          "error"
        );
      }
      setSubmitting(false);
    });
  };

  useEffect(() => {
    getDirectBonus();
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
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Div sx={{ display: { xs: "none", lg: "block" } }}>
            <Typography variant="h3" sx={{ my: 1 }}>
              Direct Bonus
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
            Configure Direct Bonus
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={updateDirectBonus}
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
                  label="Direct Bonus Value"
                  name="value"
                  type="number"
                  value={values.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.value && Boolean(errors.value)}
                  helperText={touched.value && errors.value}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    inputProps: { min: 0, step: 0.01 },
                  }}
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
                  {isSubmitting ? "Saving..." : "Save Direct Bonus"}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
}

export default DirectBonus;
