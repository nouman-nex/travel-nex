import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  FormControlLabel,
  Switch,
  Stack,
  Container,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { Div } from "@jumbo/shared";

const validationSchema = Yup.object({
  amount: Yup.number()
    .required("Amount is required")
    .min(1, "Amount must be at least 1"),
  fee: Yup.number()
    .required("Fee is required")
    .min(0, "Fee must be at least 0"),
  hubCapacity: Yup.number().required("Hub Capacity is required"),
  minimumMinting: Yup.number().required("Minimum Minting is required"),
  minimumMintingRequired: Yup.boolean().required(),
});

function AddPackages() {
  const notify = useNotify();
  const { User } = useAuth();
  const navigate = useNavigate();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [loadingMain, setLoadingMain] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Main form
  const formik = useFormik({
    initialValues: {
      amount: "",
      fee: "",
      hubPrice: "",
      hubCapacity: "",
      minimumMinting: "",
      minimumMintingRequired: false,
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmitLoading(true);
      const payload = {
        ...values,
        hubPrice: Number(values.amount) + Number(values.fee),
      };
      postRequest(
        "/addpackage",
        { payload },
        (response) => {
          setSubmitLoading(false);
          if (response?.data?.success) {
            resetForm();
            notify(
              response?.data?.message || "Package added successfully!",
              "success"
            );
          }
        },
        (error) => {
          setSubmitLoading(false);
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong. Please try again.";
          notify(message, "error");
        }
      );
    },
  });

  // Auth check effect
  useEffect(() => {
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isAdmin = roles.includes("Admin");
      const isMiniAdmin = roles.includes("MiniAdmin");
      const allowedRoutes = Array.isArray(User.allowedRoutes)
        ? User.allowedRoutes
        : [];
      const currentPath = window.location.pathname;

      if (isAdmin) {
        setLoadingMain(false);
        setAuthChecked(true);
        setShouldRender(true);
      } else if (isMiniAdmin) {
        if (!allowedRoutes.includes(currentPath)) {
          setTimeout(() => {
            if (allowedRoutes.length > 0) {
              navigate(allowedRoutes[0]);
            } else {
              navigate("/");
            }
          }, 0);
        } else {
          setLoadingMain(false);
          setAuthChecked(true);
          setShouldRender(true);
        }
      } else {
        setTimeout(() => {
          navigate("/");
        }, 0);
      }
    }
  }, [User, navigate]);

  // Calculate hubPrice for display
  const hubPrice =
    Number(formik.values.amount || 0) + Number(formik.values.fee || 0);

  if (loadingMain || !shouldRender) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "primary" }} />
      </div>
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
              Add Package
            </Typography>
          </Div>
        </Stack>
      </Div> */}

      <Paper
        sx={{ maxWidth: 400, mx: "auto", p: 3, boxShadow: 6, borderRadius: 1 }}
      >
        <Typography variant="h3" sx={{ mb: 2, textAlign: "center" }}>
          Add Hub
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Amount"
            name="amount"
            type="number"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Fee"
            name="fee"
            type="number"
            value={formik.values.fee}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fee && Boolean(formik.errors.fee)}
            helperText={formik.touched.fee && formik.errors.fee}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Hub Price"
            name="hubPrice"
            type="number"
            value={hubPrice}
            InputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Hub Capacity"
            name="hubCapacity"
            type="number"
            value={formik.values.hubCapacity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.hubCapacity && Boolean(formik.errors.hubCapacity)
            }
            helperText={formik.touched.hubCapacity && formik.errors.hubCapacity}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Minimum Minting"
            name="minimumMinting"
            type="number"
            value={formik.values.minimumMinting}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.minimumMinting &&
              Boolean(formik.errors.minimumMinting)
            }
            helperText={
              formik.touched.minimumMinting && formik.errors.minimumMinting
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.minimumMintingRequired}
                onChange={(e) =>
                  formik.setFieldValue(
                    "minimumMintingRequired",
                    e.target.checked
                  )
                }
                name="minimumMintingRequired"
                color="primary"
              />
            }
            label="Minimum Minting Required"
          />
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                color: "white",
                py: 1.2,
                borderRadius: 2,
                background:
                  "linear-gradient(to right, #AC9B6D, #8B7550, #6A5637)",
              }}
              fullWidth
              disabled={submitLoading}
            >
              {submitLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Package"
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default AddPackages;
