import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { LoadingButton } from "@mui/lab";
import {
  Stack,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import useNotify from "@app/_components/Notification/useNotify";
import { useTranslation } from "react-i18next";
import { postRequest } from "../../../../../../backendServices/ApiCalls";

const ResetPasswordSettings = () => {
  const { t } = useTranslation();
  const notify = useNotify();
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Password validation schema using Yup
  const validationSchema = Yup.object({
    currentPassword: Yup.string().required(
      t("validation.currentPasswordRequired"),
    ),
    newPassword: Yup.string()
      .min(6, t("validation.passwordMin"))
      .required(t("validation.newPasswordRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("validation.passwordsMustMatch"))
      .required(t("validation.confirmPasswordRequired")),
  });

  const handleSubmit = (values, { resetForm }) => {
    // console.log("🚀 ~ handleSubmit ~ values:", values)
    setLoading(true); // Set loading state to true
    postRequest(
      "/updatePassword",
      values,
      (response) => {
        if (response?.data?.status === "success") {
          resetForm(); // Reset the form after successful submission
          notify(response?.data?.message, response?.data?.status);
        } else if (response?.data?.status === "error") {
          notify(response?.data?.message, response?.data?.status);
        }
        setLoading(false); // Set loading state to false after the request completes
      },
      (error) => {
        console.log(error);
        setLoading(false); // Set loading state to false in case of error
      },
    );
  };

  return (
    <Div sx={{ mb: 2 }}>
      {/* <SettingHeader title={"Change Password"} divider sx={{ mb: 3 }} /> */}
      <JumboCard contentWrapper>
        <Stack
          spacing={3}
          direction={{ xs: "column", md: "row" }}
          sx={{
            height: { xs: "800px", md: "280px" }, // 500px for mobile, 380px for desktop
          }}
        >
          <Div>
            <img
              src={`${ASSET_IMAGES}/password.png`}
              style={{ width: 300 }}
              alt="Reset password"
            />
          </Div>
          <Div>
            <Typography variant="h4">
              {t("ProfileSetting.resetPassword")}
            </Typography>
            <Typography variant="body1" mb={2}>
              {t("ProfileSetting.resetPasswordSubtitle")}
            </Typography>

            <Formik
              initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ touched, errors }) => (
                <Form>
                  <Div sx={{ "& .MuiTextField-root": { mb: 1.5 } }}>
                    <Field
                      name="currentPassword"
                      type={showPassword.currentPassword ? "text" : "password"}
                      as={TextField}
                      label={t("changePasswordForm.currentPassword")}
                      size="small"
                      fullWidth
                      error={
                        touched.currentPassword &&
                        Boolean(errors.currentPassword)
                      }
                      helperText={<ErrorMessage name="currentPassword" />}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                handleClickShowPassword("currentPassword")
                              }
                              edge="end"
                            >
                              {showPassword.currentPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Field
                      name="newPassword"
                      type={showPassword.newPassword ? "text" : "password"}
                      as={TextField}
                      label={t("changePasswordForm.newPassword")}
                      size="small"
                      fullWidth
                      error={touched.newPassword && Boolean(errors.newPassword)}
                      helperText={<ErrorMessage name="newPassword" />}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                handleClickShowPassword("newPassword")
                              }
                              edge="end"
                            >
                              {showPassword.newPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Field
                      name="confirmPassword"
                      type={showPassword.confirmPassword ? "text" : "password"}
                      as={TextField}
                      label={t("changePasswordForm.confirmPassword")}
                      size="small"
                      fullWidth
                      error={
                        touched.confirmPassword &&
                        Boolean(errors.confirmPassword)
                      }
                      helperText={<ErrorMessage name="confirmPassword" />}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                handleClickShowPassword("confirmPassword")
                              }
                              edge="end"
                            >
                              {showPassword.confirmPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <LoadingButton
                      type="submit"
                      variant="contained"
                      sx={{
                        boxShadow: "none",
                        pt: 1,
                        color: "#fff",
                        fontWeight: 500,
                        background:
                          "linear-gradient(to right, #7DD3FC, #8B7550, #0EA5E9)",
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
                  </Div>
                </Form>
              )}
            </Formik>
          </Div>
        </Stack>
      </JumboCard>
    </Div>
  );
};

export { ResetPasswordSettings };
