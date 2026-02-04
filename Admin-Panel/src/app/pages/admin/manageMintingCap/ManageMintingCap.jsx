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
  CircularProgress,
} from "@mui/material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";

const validationSchema = Yup.object({
  value: Yup.number()
    .required("Value is required")
    .min(0, "Value must be at least 0"),
});

function ManageMintingCap() {
  const notify = useNotify();
  const [initialValues, setInitialValues] = useState({ value: 0 });
  const [loading, setLoading] = useState(true);

  const getMintingCap = () => {
    setLoading(true);
    postRequest("/getMintingCap", { keyname: "Minting Cap" }, (response) => {
      if (response.data.success) {
        setInitialValues({ value: response.data.setting.value || 0 });
      } else {
        notify(
          response.data.message || "Failed to fetch Minting Cap setting",
          "error"
        );
      }
      setLoading(false);
    });
  };

  const updateMintingCap = (values, { setSubmitting, resetForm }) => {
    postRequest("/updateMintingCap", { value: values.value }, (response) => {
      if (response.data.success) {
        notify("Minting Cap updated successfully", "success");
        setInitialValues({ value: values.value });
        resetForm({ values: { value: values.value } });
      } else {
        notify(response.data.message || "Failed to update Minting Cap", "error");
      }
      setSubmitting(false);
    });
  };

  useEffect(() => {
    getMintingCap();
  }, []);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ my: "auto" }} bgcolor="#f5f6fa">
        <Paper elevation={3} sx={{ p: 4, width: 400 }}>
          <Typography variant="h3" sx={{ mb: 2, textAlign: "center" }}>
            Configure Minting Cap
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={updateMintingCap}
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
                  label="Minting Cap Value"
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
                  {isSubmitting ? "Saving..." : "Save Minting Cap"}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
}

export default ManageMintingCap;
