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
  bepFixed: Yup.number().required("Required").min(0, "Min 0"),
  bepPercent: Yup.number()
    .required("Required")
    .min(0, "Min 0")
    .max(100, "Max 100"),
  trcFixed: Yup.number().required("Required").min(0, "Min 0"),
  trcPercent: Yup.number()
    .required("Required")
    .min(0, "Min 0")
    .max(100, "Max 100"),
});

function ManageWithdrawalFee() {
  const notify = useNotify();

  const [initialValues, setInitialValues] = useState({
    bepFixed: 1,
    bepPercent: 3,
    trcFixed: 5,
    trcPercent: 3,
  });
  const [loading, setLoading] = useState(true);

  const getWithdrawalFees = () => {
    setLoading(true);

    postRequest("/getwithdrawlFees", {}, (res) => {
      if (res.data.success) {
        const { bep20, trc20 } = res.data.fees;
        setInitialValues({
          bepFixed: bep20.fixedFee ?? 1,
          bepPercent: bep20.percentFee ?? 3,
          trcFixed: trc20.fixedFee ?? 5,
          trcPercent: trc20.percentFee ?? 3,
        });
      } else {
        notify(res.data.message || "Failed to load withdrawal fees", "error");
      }
      setLoading(false);
    });
  };

  const updateWithdrawalFees = (values, { setSubmitting, resetForm }) => {
    const payload = {
      bep20: { fixedFee: values.bepFixed, percentFee: values.bepPercent },
      trc20: { fixedFee: values.trcFixed, percentFee: values.trcPercent },
    };

    postRequest("/updateWithdrawlFees", payload, (res) => {
      if (res.data.success) {
        notify("Withdrawal fees updated successfully", "success");
        resetForm({ values });
      } else {
        notify(res.data.message || "Update failed", "error");
      }
      setSubmitting(false);
    });
  };

  useEffect(getWithdrawalFees, []);

  if (loading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={400}
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
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Div sx={{ display: { xs: "none", lg: "block" } }}>
            <Typography variant="h3" sx={{ my: 1 }}>
              Manage Withdrawal Fee
            </Typography>
          </Div>
        </Stack>
      </Div> */}

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#f5f6fa"
      >
        <Paper elevation={3} sx={{ p: 4, width: 500, my: 4 }}>
          <Typography variant="h3" sx={{ mb: 2, textAlign: "center" }}>
            Manage Withdrawal Fee
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={updateWithdrawalFees}
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
                {/* │ BEP20 │ */}
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  BEP20
                </Typography>

                <TextField
                  fullWidth
                  label="Fixed Fee ($)"
                  name="bepFixed"
                  type="number"
                  value={values.bepFixed}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.bepFixed && Boolean(errors.bepFixed)}
                  helperText={touched.bepFixed && errors.bepFixed}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />

                <TextField
                  fullWidth
                  label="Percentage Fee (%)"
                  name="bepPercent"
                  type="number"
                  value={values.bepPercent}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.bepPercent && Boolean(errors.bepPercent)}
                  helperText={touched.bepPercent && errors.bepPercent}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.01 } }}
                />

                {/* │ TRC20 │ */}
                <Typography variant="subtitle1" sx={{ mt: 4 }}>
                  TRC20
                </Typography>

                <TextField
                  fullWidth
                  label="Fixed Fee ($)"
                  name="trcFixed"
                  type="number"
                  value={values.trcFixed}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.trcFixed && Boolean(errors.trcFixed)}
                  helperText={touched.trcFixed && errors.trcFixed}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />

                <TextField
                  fullWidth
                  label="Percentage Fee (%)"
                  name="trcPercent"
                  type="number"
                  value={values.trcPercent}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.trcPercent && Boolean(errors.trcPercent)}
                  helperText={touched.trcPercent && errors.trcPercent}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.01 } }}
                />

                {/* SUBMIT */}
                <Button
                  type="submit"
                  variant="contained"
                   sx={{
                        color: "white",
                        mt: 3,
                        background:
                          "linear-gradient(to right, #AC9B6D, #8B7550, #6A5637)",
                      }}
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? <CircularProgress size={20} /> : null
                  }
                >
                  {isSubmitting ? "Saving..." : "Save Withdrawal Fees"}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
}

export default ManageWithdrawalFee;
