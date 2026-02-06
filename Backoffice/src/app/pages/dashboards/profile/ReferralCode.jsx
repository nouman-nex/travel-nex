import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { LoadingButton } from "@mui/lab";
import { Stack, Typography, TextField } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useNotify from "@app/_components/Notification/useNotify";
import { useState } from "react";
// import { SettingHeader } from "@app/_components/user/settings";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";

// Validation schema for user profile update
const validationSchema = Yup.object({
  ReferralCode: Yup.string().required("Referral Code is required"),
});

export default function ReferralCode() {
  const { User, setUser } = useAuth();
  //   console.log("🚀 ~ ReferralCode ~ User:", User);
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values, { resetForm }) => {
    // console.log("🚀 ~ handleSubmit ~ values:", values);
    setLoading(true);
    postRequest(
      "/updateReferralCode",
      values,
      (response) => {
        if (response?.data?.status === "success") {
          const { ReferralCode } = values;
          const updatedUser = { ...User, referCode: ReferralCode };
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
      {/* <SettingHeader title={"Update Referral Code"} divider sx={{ mb: 3 }} /> */}
      <JumboCard contentWrapper>
        <Stack
          spacing={3}
          direction={{ xs: "column", md: "row" }}
          sx={{
            height: { xs: "500px", md: "380px" }, // 500px for mobile, 380px for desktop
          }}
        >
          <Div>
            <img
              src={`${ASSET_IMAGES}/referralCode.png`}
              alt="Referral Code"
              // style={{ marginTop: -80 }}
              style={{ width: 250 }}
            />
          </Div>
          <Div>
            <Typography variant="h4">{"Update your Referral Code"}</Typography>
            <Typography variant="body1" mb={2}>
              {
                "Update your Referral Code below and click 'Save Changes' to apply."
              }
            </Typography>

            <Formik
              initialValues={{
                PreviousReferralCode: User?.referCode || "",
                ReferralCode: "",
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ touched, errors }) => (
                <Form>
                  <Div sx={{ "& .MuiTextField-root": { mb: 2.5 } }}>
                    {/* Read-Only Previous Referral Code */}
                    <Field
                      name="PreviousReferralCode"
                      as={TextField}
                      label="Previous Referral Code"
                      size="small"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    {/* Editable Referral Code */}
                    <Field
                      name="ReferralCode"
                      as={TextField}
                      label="New Referral Code"
                      size="small"
                      fullWidth
                      error={
                        touched.ReferralCode && Boolean(errors.ReferralCode)
                      }
                      helperText={<ErrorMessage name="ReferralCode" />}
                    />

                    <LoadingButton
                      type="submit"
                      variant="contained"
                      sx={{ boxShadow: "none", pt: 1 }}
                      loading={loading}
                    >
                      Save Changes
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
}
