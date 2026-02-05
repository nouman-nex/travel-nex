import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";

const profileValidationSchema = Yup.object({
  firstname: Yup.string().required("First name is required"),
  lastname: Yup.string().required("Last name is required"),
});

const passwordValidationSchema = Yup.object({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const UserProfileCard = ({}) => {
  const notify = useNotify();
  const { User, setUser } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingPPassword, setLoadingPPassword] = useState(false);

  const profileFormik = useFormik({
    initialValues: {
      username: User?.username || "",
      email: User?.email || "",
      firstname: User?.firstname || "",
      lastname: User?.lastname || "",
    },
    validationSchema: profileValidationSchema,
    onSubmit: (values) => {
      setLoading(true);

      postRequest(
        "/update-profile",
        {
          userId: User?._id,
          updateData: values,
        },
        (response) => {
          if (response?.status === 200) {
            notify(response?.data?.message, "success");

            const updatedUser = response?.data?.user || {};

            profileFormik.setValues({
              username: updatedUser.username || values.username,
              email: updatedUser.email || values.email,
              firstname: updatedUser.firstname || values.firstname,
              lastname: updatedUser.lastname || values.lastname,
            });

            setUser((prevUser) => ({
              ...prevUser,
              ...updatedUser,
            }));
          }
          setLoading(false);
        },
        (error) => {
          if (error?.response?.status === 400) {
            notify(
              error?.response?.data?.message || "Invalid update data.",
              "error"
            );
          } else if (error?.response?.status === 404) {
            notify("User not found!", "error");
          } else {
            notify("Something went wrong. Please try again.", "error");
          }

          console.error("Error updating profile:", error);
          setLoading(false);
        }
      );
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoadingPPassword(true);

      postRequest(
        "/update-password",
        {
          userId: User?._id,
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        (response) => {
          if (response?.status === 200) {
            notify(response?.data?.message, "success");
            resetForm();
          }
          setLoadingPPassword(false);
        },
        (error) => {
          if (error?.response?.status === 400) {
            notify(error?.response?.data?.message || "Invalid input!", "error");
          } else if (error?.response?.status === 404) {
            notify("User not found!", "error");
          } else {
            notify("Something went wrong. Please try again.", "error");
          }
          console.error("Error updating password:", error);
          setLoadingPPassword(false);
        }
      );
    },
  });

  return (
    <Card
      sx={{ maxWidth: "full", mx: "auto", mt: 4, p: 2, textAlign: "center" }}
    >
      <CardContent>
        <Tabs
          value={tabIndex}
          onChange={(e, newValue) => setTabIndex(newValue)}
          centered
        >
          <Tab label="Profile Info" />
          <Tab label="Change Password" />
        </Tabs>
        {tabIndex === 0 && (
          <Box p={2}>
            <form onSubmit={profileFormik.handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={profileFormik.values.username}
                disabled
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={profileFormik.values.email}
                disabled
                margin="normal"
              />
              <TextField
                fullWidth
                label="First Name"
                name="firstname"
                value={profileFormik.values.firstname}
                onChange={profileFormik.handleChange}
                error={
                  profileFormik.touched.firstname &&
                  Boolean(profileFormik.errors.firstname)
                }
                helperText={
                  profileFormik.touched.firstname &&
                  profileFormik.errors.firstname
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastname"
                value={profileFormik.values.lastname}
                onChange={profileFormik.handleChange}
                error={
                  profileFormik.touched.lastname &&
                  Boolean(profileFormik.errors.lastname)
                }
                helperText={
                  profileFormik.touched.lastname &&
                  profileFormik.errors.lastname
                }
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                sx={{ mt: 2 }}
              >
                {loading ? (
                  <CircularProgress color="white" />
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </Box>
        )}
        {tabIndex === 1 && (
          <Box p={2}>
            <form onSubmit={passwordFormik.handleSubmit}>
              <TextField
                fullWidth
                label="Old Password"
                name="oldPassword"
                type="password"
                value={passwordFormik.values.oldPassword}
                onChange={passwordFormik.handleChange}
                error={
                  passwordFormik.touched.oldPassword &&
                  Boolean(passwordFormik.errors.oldPassword)
                }
                helperText={
                  passwordFormik.touched.oldPassword &&
                  passwordFormik.errors.oldPassword
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordFormik.values.newPassword}
                onChange={passwordFormik.handleChange}
                error={
                  passwordFormik.touched.newPassword &&
                  Boolean(passwordFormik.errors.newPassword)
                }
                helperText={
                  passwordFormik.touched.newPassword &&
                  passwordFormik.errors.newPassword
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={passwordFormik.values.confirmPassword}
                onChange={passwordFormik.handleChange}
                error={
                  passwordFormik.touched.confirmPassword &&
                  Boolean(passwordFormik.errors.confirmPassword)
                }
                helperText={
                  passwordFormik.touched.confirmPassword &&
                  passwordFormik.errors.confirmPassword
                }
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                sx={{ mt: 2 }}
              >
                {loadingPPassword ? (
                  <CircularProgress color="white" />
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
