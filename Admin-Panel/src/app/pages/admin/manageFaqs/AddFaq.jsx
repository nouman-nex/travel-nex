import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";

const AddFaqs = () => {
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const validationSchema = Yup.object({
    question: Yup.string()
      .required("Question is required")
      .min(5, "Question should be at least 5 characters"),
    answer: Yup.string()
      .required("Answer is required")
      .min(10, "Answer should be at least 10 characters"),
  });

  const formik = useFormik({
    initialValues: {
      question: "",
      answer: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
      postRequest(
        "/addfaqs",
        values,
        (response) => {
          if (response?.data?.success) {
            resetForm();
            notify(response?.data?.message, "success");
          }
          setLoading(false);
        },
        (error) => {
          console.error(" error:", error);
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong. Please try again.";
          notify(message, "error");
          setLoading(false);
        }
      );
    },
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Add New FAQ
            </Typography>

            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{ mt: 2 }}
            >
              <TextField
                fullWidth
                id="question"
                name="question"
                label="Question"
                value={formik.values.question}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.question && Boolean(formik.errors.question)
                }
                helperText={formik.touched.question && formik.errors.question}
                margin="normal"
                variant="outlined"
              />

              <TextField
                fullWidth
                id="answer"
                name="answer"
                label="Answer"
                value={formik.values.answer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.answer && Boolean(formik.errors.answer)}
                helperText={formik.touched.answer && formik.errors.answer}
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
                fullWidth
              >
                {loading ? (
                  <CircularProgress color="white" size="25px" />
                ) : (
                  "Add FAQ"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AddFaqs;
