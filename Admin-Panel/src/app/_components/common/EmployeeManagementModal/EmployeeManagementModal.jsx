import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Avatar,
  Button,
  Stack,
  Badge,
  styled,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Divider,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import useNotify from "@app/_components/Notification/useNotify";

function EmployeeManagementModal({ open, handleClose, item }) {
  if (!item) return null;
  const notify = useNotify();
  const [positionandSallery, setPositionandSallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialValues = {
    position: item?.roles[1] || "",
    status: item?.status || "",
    workType: item?.salaryType || "fixed",
    tax: item?.taxPercentage ? "custom" : "",
    customTax: item?.taxPercentage || "",
    salary: "",
    bonus: item?.bonus ? "custom" : "",
    customBonus: item?.bonus || "",
    transportAllowance: item?.allowances?.transport ? "custom" : "",
    customTransportAllowance: item?.allowances?.transport || "",
    medicalAllowance: item?.allowances?.medical ? "custom" : "",
    customMedicalAllowance: item?.allowances?.medical || "",
  };

  const validationSchema = Yup.object({
    position: Yup.string(),
    status: Yup.string(),
    salary: Yup.number()
      .typeError("Salary must be a number")
      .positive("Salary must be positive")
      .nullable(),
    tax: Yup.string(),
    customTax: Yup.number()
      .typeError("Custom tax must be a number")
      .min(0, "Tax cannot be negative")
      .max(100, "Tax cannot exceed 100%")
      .nullable(),
    bonus: Yup.string(),
    customBonus: Yup.number()
      .typeError("Custom bonus must be a number")
      .positive("Bonus must be positive")
      .nullable(),
    transportAllowance: Yup.string(),
    customTransportAllowance: Yup.number()
      .typeError("Custom transportation allowance must be a number")
      .positive("Allowance must be positive")
      .nullable(),
    medicalAllowance: Yup.string(),
    customMedicalAllowance: Yup.number()
      .typeError("Custom medical allowance must be a number")
      .positive("Allowance must be positive")
      .nullable(),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setLoading(true);
    const formData = {
      userId: item._id,
      roles: ["Employee", values.position || item?.roles[1]],
      status: values.status || item?.status,
      salaryType: values.workType,
      taxPercentage:
        values.tax === "custom"
          ? Number(values.customTax)
          : values.tax
            ? Number(values.tax.replace(/[^0-9.]/g, ""))
            : item?.taxPercentage,
      bonus:
        values.bonus === "custom"
          ? Number(values.customBonus)
          : values.bonus
            ? Number(values.bonus)
            : item?.bonus,
      transportAllowance:
        values.transportAllowance === "custom"
          ? Number(values.customTransportAllowance)
          : values.transportAllowance
            ? Number(values.transportAllowance)
            : item?.allowances?.transport,
      medicalAllowance:
        values.medicalAllowance === "custom"
          ? Number(values.customMedicalAllowance)
          : values.medicalAllowance
            ? Number(values.medicalAllowance)
            : item?.allowances?.medical,
    };

    try {
      postRequest(
        "/update-employee",
        formData,
        (response) => {
          notify(response?.data?.message, "success");
          setLoading(false);
          handleClose();
        },
        (error) => {
          console.error("Error updating user:", error);
          const errorMessage =
            error.response?.data?.message || "Something went wrong";
          notify(errorMessage, "error");
          setLoading(false);
        }
      );
    } catch (error) {
      setLoading(false);
    }
    setSubmitting(false);
  };

  const getPositionsandsallery = () => {
    postRequest(
      "/get-salaries",
      {},
      (response) => {
        setPositionandSallery(response?.data);
      },
      (error) => {
        console.error("Error fetching Activity and Projects :", error);
      }
    );
  };

  useEffect(() => {
    getPositionsandsallery();
  }, []);

  const Item = styled("span")(({ theme }) => ({
    padding: theme.spacing(0, 1),
  }));

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { lg: "60%", xs: "95%" },
          height: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          overflowY: "auto",
        }}
      >
        <Typography variant="h4" mb={2}>
          Manage User
        </Typography>

        <Stack direction={"row"} alignItems={"center"}>
          <Item>
            <Badge
              overlap="circular"
              variant="dot"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              sx={{
                ".MuiBadge-badge": {
                  border: "2px solid #FFF",
                  height: "14px",
                  width: "14px",
                  borderRadius: "50%",
                  bgcolor: "success.main",
                },
              }}
            >
              <Avatar
                sx={{ width: 56, height: 56 }}
                alt={`${item.firstname} ${item.lastname}`}
                src={item.profileImg}
              />
            </Badge>
          </Item>
          <Item>
            <Typography variant={"h6"}>
              {`${item.firstname} ${item.lastname}`}
            </Typography>
            <Typography variant={"body1"} color="text.secondary">
              {item.email}
            </Typography>
          </Item>
        </Stack>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => {
            React.useEffect(() => {
              if (values.position) {
                const selectedPosition = positionandSallery.find(
                  (item) => item.role === values.position
                );
                if (selectedPosition) {
                  const salaryValue =
                    values.workType === "hourly"
                      ? selectedPosition.hourlySalary
                      : selectedPosition.monthlySalary;
                  setFieldValue("salary", salaryValue);
                }
              }
            }, [values.position, values.workType]);

            return (
              <Form>
                <Box
                  className="work-type-container"
                  sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                >
                  <Button
                    variant={
                      values.workType === "fixed" ? "contained" : "outlined"
                    }
                    onClick={() => setFieldValue("workType", "fixed")}
                  >
                    Monthly
                  </Button>
                  <Button
                    sx={{ ml: 1 }}
                    variant={
                      values.workType === "hourly" ? "contained" : "outlined"
                    }
                    onClick={() => setFieldValue("workType", "hourly")}
                  >
                    Hourly
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    mt: 2,
                  }}
                >
                  <FormControl
                    sx={{ width: "45%" }}
                    error={touched.position && Boolean(errors.position)}
                  >
                    <InputLabel>Position</InputLabel>
                    <Select
                      name="position"
                      value={values.position}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {positionandSallery.map((item) => (
                        <MenuItem key={item._id} value={item.role}>
                          {item.role}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.position && errors.position && (
                      <FormHelperText>{errors.position}</FormHelperText>
                    )}
                  </FormControl>

                  <TextField
                    name="salary"
                    label="Salary"
                    variant="outlined"
                    sx={{ width: "45%" }}
                    value={values.salary}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.salary && Boolean(errors.salary)}
                    helperText={touched.salary && errors.salary}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    mt: 2,
                  }}
                >
                  <FormControl
                    sx={{ width: "45%" }}
                    error={touched.status && Boolean(errors.status)}
                  >
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Suspended">Suspended</MenuItem>
                    </Select>
                    {touched.status && errors.status && (
                      <FormHelperText>{errors.status}</FormHelperText>
                    )}
                  </FormControl>

                  {values.tax !== "custom" ? (
                    <FormControl
                      sx={{ width: "45%" }}
                      error={touched.tax && Boolean(errors.tax)}
                    >
                      <InputLabel>Tax</InputLabel>
                      <Select
                        name="tax"
                        value={values.tax}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="3%">3%</MenuItem>
                        <MenuItem value="5%">5%</MenuItem>
                        <MenuItem value="10%">10%</MenuItem>
                        <MenuItem value="custom">Custom</MenuItem>
                      </Select>
                      {touched.tax && errors.tax && (
                        <FormHelperText>{errors.tax}</FormHelperText>
                      )}
                    </FormControl>
                  ) : (
                    <TextField
                      name="customTax"
                      label="Custom Tax (%)"
                      variant="outlined"
                      sx={{ width: "45%" }}
                      value={values.customTax}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.customTax && Boolean(errors.customTax)}
                      helperText={touched.customTax && errors.customTax}
                    />
                  )}
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h2" mb={1}>
                    Allowances
                  </Typography>
                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      mt: 2,
                    }}
                  >
                    {values.transportAllowance !== "custom" ? (
                      <FormControl
                        sx={{ width: "45%" }}
                        error={
                          touched.transportAllowance &&
                          Boolean(errors.transportAllowance)
                        }
                      >
                        <InputLabel>Transportation Allowance</InputLabel>
                        <Select
                          name="transportAllowance"
                          value={values.transportAllowance}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <MenuItem value="">None</MenuItem>
                          <MenuItem value="5000">5000</MenuItem>
                          <MenuItem value="10000">10000</MenuItem>
                          <MenuItem value="15000">15000</MenuItem>
                          <MenuItem value="custom">Custom</MenuItem>
                        </Select>
                        {touched.transportAllowance &&
                          errors.transportAllowance && (
                            <FormHelperText>
                              {errors.transportAllowance}
                            </FormHelperText>
                          )}
                      </FormControl>
                    ) : (
                      <TextField
                        name="customTransportAllowance"
                        label="Custom Transportation Allowance"
                        variant="outlined"
                        sx={{ width: "45%" }}
                        value={values.customTransportAllowance}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.customTransportAllowance &&
                          Boolean(errors.customTransportAllowance)
                        }
                        helperText={
                          touched.customTransportAllowance &&
                          errors.customTransportAllowance
                        }
                      />
                    )}

                    {values.medicalAllowance !== "custom" ? (
                      <FormControl
                        sx={{ width: "45%" }}
                        error={
                          touched.medicalAllowance &&
                          Boolean(errors.medicalAllowance)
                        }
                      >
                        <InputLabel>Medical Allowance</InputLabel>
                        <Select
                          name="medicalAllowance"
                          value={values.medicalAllowance}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <MenuItem value="">None</MenuItem>
                          <MenuItem value="5000">5000</MenuItem>
                          <MenuItem value="10000">10000</MenuItem>
                          <MenuItem value="15000">15000</MenuItem>
                          <MenuItem value="custom">Custom</MenuItem>
                        </Select>
                        {touched.medicalAllowance &&
                          errors.medicalAllowance && (
                            <FormHelperText>
                              {errors.medicalAllowance}
                            </FormHelperText>
                          )}
                      </FormControl>
                    ) : (
                      <TextField
                        name="customMedicalAllowance"
                        label="Custom Medical Allowance"
                        variant="outlined"
                        sx={{ width: "45%" }}
                        value={values.customMedicalAllowance}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.customMedicalAllowance &&
                          Boolean(errors.customMedicalAllowance)
                        }
                        helperText={
                          touched.customMedicalAllowance &&
                          errors.customMedicalAllowance
                        }
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      mt: 2,
                    }}
                  >
                    {values.bonus !== "custom" ? (
                      <FormControl
                        sx={{ width: "95%" }}
                        error={touched.bonus && Boolean(errors.bonus)}
                      >
                        <InputLabel>Bonus</InputLabel>
                        <Select
                          name="bonus"
                          value={values.bonus}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <MenuItem value="">None</MenuItem>
                          <MenuItem value="500">500</MenuItem>
                          <MenuItem value="1000">1000</MenuItem>
                          <MenuItem value="2000">2000</MenuItem>
                          <MenuItem value="custom">Custom</MenuItem>
                        </Select>
                        {touched.bonus && errors.bonus && (
                          <FormHelperText>{errors.bonus}</FormHelperText>
                        )}
                      </FormControl>
                    ) : (
                      <TextField
                        name="customBonus"
                        label="Custom Bonus"
                        variant="outlined"
                        sx={{ width: "95%" }}
                        value={values.customBonus}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.customBonus && Boolean(errors.customBonus)
                        }
                        helperText={touched.customBonus && errors.customBonus}
                      />
                    )}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Button
                    onClick={handleClose}
                    sx={{ backgroundColor: "red" }}
                    variant="contained"
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {loading ? (
                      <CircularProgress color="white" size={20} />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Modal>
  );
}

export default EmployeeManagementModal;
