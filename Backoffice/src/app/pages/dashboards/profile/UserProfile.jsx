import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { LoadingButton } from "@mui/lab";
import { Stack, Typography, TextField, Grid } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useNotify from "@app/_components/Notification/useNotify";
import { useState } from "react";
import { api, postRequest } from "../../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { useTranslation } from "react-i18next";
import { SettingHeader } from "@app/_components/common/settings";

// Validation schema for user profile update
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
});

export default function UserProfile() {
  const { User, setUser } = useAuth();
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const res = await api.post("/v1/auth/updateProfile", values);
      console.log(res);
      console.log(res?.data?.success);
      if (res?.data?.success) {
        const { name } = values;
        const updatedUser = {
          ...User,
          name,
        };
        setUser(updatedUser);
        setUser(updatedUser);
        resetForm();

        notify("Profile Updated Successfully", "success");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Div sx={{ mb: 2 }}>
      {/* <SettingHeader title={"Update Profile"} divider sx={{ mb: 5 }} /> */}
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
                email: User?.email || "",
                name: User?.name || "",
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ touched, errors }) => (
                <Form>
                  <Grid container spacing={1}>
                    {/* Personal Information */}
                    <Grid item xs={12} md={12}>
                      <Field
                        name="name"
                        as={TextField}
                        label={"Name"}
                        size="small"
                        fullWidth
                        error={touched.name && Boolean(errors.name)}
                        helperText={<ErrorMessage name="name" />}
                      />
                    </Grid>
                    {/* <Grid item xs={12} md={6}>
                      <Field
                        name="lastName"
                        as={TextField}
                        label={t("form.lastName")}
                        size="small"
                        fullWidth
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={<ErrorMessage name="lastName" />}
                      />
                    </Grid> */}
                    {/* <Grid item xs={12} md={6}>
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
                    </Grid> */}
                    <Grid item xs={12} md={12}>
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
                            "linear-gradient(to right, #7DD3FC, #0EA5E9)",
                          borderRadius: "0.5rem",
                          transition: "all 0.3s ease",
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
