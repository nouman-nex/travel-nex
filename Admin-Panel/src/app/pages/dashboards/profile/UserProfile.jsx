import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { LoadingButton } from "@mui/lab";
import { Stack, Typography, TextField, Grid } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useNotify from "@app/_components/Notification/useNotify";
import { useState } from "react";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { useTranslation } from "react-i18next";

// Validation schema for user profile update
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
});

export default function UserProfile() {
  const { User, setUser } = useAuth();
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const handleSubmit = (values, { resetForm }) => {
    setLoading(true);
    postRequest(
      "/updateProfile",
      values,
      (response) => {
        console.log(response);
        if (response?.data?.status === "success") {
          const { firstName, lastName } = values;

          const updatedUser = {
            ...User,
            firstName,
            lastName,
          };
          setUser(updatedUser);
          setUser(updatedUser);
          resetForm();
          notify(response?.data?.message, response?.data?.status);
        } else if (response?.data?.status === "error") {
          notify(response?.data?.message, response?.data?.status);
        }
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );
  };

  return (
    <Div sx={{ mb: 2 }}>
      {/* <SettingHeader title={"Update Profile"} divider sx={{ mb: 3 }} /> */}
      <JumboCard contentWrapper>
        <Stack
          spacing={3}
          direction={{ xs: "column", md: "row" }}
          sx={{
            height: { xs: "auto", md: "auto" }, // Increased height to accommodate more fields
          }}
        >
          <Div>
            <img
              src={`${ASSET_IMAGES}/profile.png`}
              style={{ width: 300 }}
              alt="Update profile"
            />
          </Div>
          <Div sx={{ width: "100%" }}>
            <Typography variant="h4">
              {t("ProfileSetting.saveChanges")}
            </Typography>
            <Typography variant="body1" mb={2}>
              {t("ProfileSetting.UpdateSubtitle")}
            </Typography>

            <Formik
              initialValues={{
                username: User?.username || "",
                email: User?.email || "",
                firstName: User?.firstName || "",
                lastName: User?.lastName || "",
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ touched, errors }) => (
                <Form>
                  <Grid container spacing={1}>
                    {/* Personal Information */}
                    <Grid item xs={12} md={6}>
                      <Field
                        name="firstName"
                        as={TextField}
                        label={t("form.firstName")}
                        size="small"
                        fullWidth
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={<ErrorMessage name="firstName" />}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        name="lastName"
                        as={TextField}
                        label={t("form.lastName")}
                        size="small"
                        fullWidth
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={<ErrorMessage name="lastName" />}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        name="username"
                        as={TextField}
                        label={t("form.username")}
                        size="small"
                        fullWidth
                        disabled
                        error={touched.username && Boolean(errors.username)}
                        helperText={<ErrorMessage name="username" />}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        name="email"
                        as={TextField}
                        label={t("form.email")}
                        size="small"
                        fullWidth
                        disabled
                        error={touched.email && Boolean(errors.email)}
                        helperText={<ErrorMessage name="email" />}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        sx={{
                          boxShadow: "none",
                          mt: 1,
                          color: "#fff",
                          fontWeight: 500,
                          background:
                            "linear-gradient(to right, #AC9B6D, #8B7550, #6A5637)",
                          borderRadius: "0.5rem",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background:
                              "linear-gradient(to right, #BFA670, #9C7F52, #7A5F3A)",
                          },
                        }}
                        loading={loading}
                      >
                        {t("ProfileSetting.saveChanges")}
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Div>
        </Stack>
      </JumboCard>
    </Div>
  );
}
