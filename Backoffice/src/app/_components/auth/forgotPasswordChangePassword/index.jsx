import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Button, Grid, CircularProgress } from "@mui/material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import useNotify from "@app/_components/Notification/useNotify";
import { postRequest } from "../../../../backendServices/ApiCalls";

const ForgotPasswordChangePassword = ({ linkToken }) => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const notify = useNotify();
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setSubmitting(true);
    postRequest(
      "/reset-password-linktoken",
      { linkToken: linkToken, newPassword: values.password },
      (response) => {
        if (response?.status === 200) {
          notify(response?.data?.message, "success");
          resetForm();
          setSubmitting(false);
          navigate(`/auth/login`);
        }
        setSubmitting(false);
      },
      (error) => {
        console.error("Error:", error);
        notify(
          error?.response?.data?.message || "Something went wrong.",
          "error",
        );
        setSubmitting(false);
      },
    );
  };

  return (
    <>
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, touched, errors }) => (
          <Form>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.password && errors.password}
                  error={touched.password && Boolean(errors.password)}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  error={
                    touched.confirmPassword && Boolean(errors.confirmPassword)
                  }
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    boxShadow: "none",
                    pt: 1,
                    px: 3,
                    color: "white",
                    background: "linear-gradient(to right, #7DD3FC, #0EA5E9)",
                    "&:hover": {
                      background: "linear-gradient(to right, #BFA670, #7A5F3A)",
                    },
                  }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ForgotPasswordChangePassword;
