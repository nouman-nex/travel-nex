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
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit as EditIcon, Star as StarIcon } from "@mui/icons-material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";
import { Div } from "@jumbo/shared";

const validationSchema = Yup.object({
  required: Yup.number()
    .required("Required value is required")
    .min(0, "Required value must be at least 0"),
  reward: Yup.number()
    .required("Reward value is required")
    .min(0, "Reward value must be at least 0"),
  extra: Yup.number().min(0, "Extra value must be at least 0").nullable(),
});

function RankManagement() {
  const notify = useNotify();
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRank, setSelectedRank] = useState(null);
  const [initialValues, setInitialValues] = useState({
    required: 0,
    reward: 0,
    extra: null,
  });

  const getAllRanks = () => {
    setLoading(true);
    postRequest("/getranks", {}, (response) => {
      if (response.data.success) {
        setRanks(response.data.ranks || []);
      } else {
        notify(response.data.message || "Failed to fetch ranks", "error");
      }
      setLoading(false);
    });
  };

  const handleEditRank = (rank) => {
    setSelectedRank(rank);
    setInitialValues({
      required: parseFloat(rank.criteria.required) || 0,
      reward: parseFloat(rank.criteria.reward) || 0,
      extra:
        rank.criteria.extra && rank.criteria.extra !== "null"
          ? parseFloat(rank.criteria.extra)
          : null,
    });
    setEditDialogOpen(true);
  };

  const updateRank = (values, { setSubmitting, resetForm }) => {
    const payload = {
      rankId: selectedRank._id,
      required: values.required,
      reward: values.reward,
      extra: values.extra,
    };

    postRequest("/updaterank", payload, (response) => {
      if (response.data.success) {
        notify("Rank updated successfully", "success");
        setEditDialogOpen(false);
        getAllRanks();
        resetForm();
      } else {
        notify(response.data.message || "Failed to update rank", "error");
      }
      setSubmitting(false);
    });
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setSelectedRank(null);
  };

  useEffect(() => {
    getAllRanks();
  }, []);

  if (loading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Div sx={{ borderBottom: 2, borderColor: "divider", py: 1, mb: 3 }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Div sx={{ display: { xs: "none", lg: "block" } }}>
            <Typography variant="h3" sx={{ my: 1 }}>
              Rank Management
            </Typography>
          </Div>
        </Stack>
      </Div>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {ranks.map((rank) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={rank._id}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: `1px solid`,
                  borderColor: "primary.main",
                  borderRadius: 2,
                  "&:hover": {
                    boxShadow: 4,
                    borderColor: "primary.dark",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #374151, #4B5563)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {rank.rank}
                    </Typography>
                    <Chip
                      icon={<StarIcon color="white" />}
                      label={rank.rank}
                      size="small"
                      sx={{
                        color: "white",
                        background:
                          "linear-gradient(to right, #AC9B6D, #8B7550, #6A5637)",
                      }}
                    />
                  </Box>

                  <Box mb={2}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Required Amount:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #374151, #4B5563)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {parseFloat(rank.criteria.required).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Reward:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        background:
                          "linear-gradient(to right, #374151, #4B5563)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {parseFloat(rank.criteria.reward).toLocaleString()}
                    </Typography>
                  </Box>

                  {rank.criteria.extra && rank.criteria.extra !== "null" && (
                    <Box mb={2}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Extra Bonus:
                      </Typography>
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                      >
                        {parseFloat(rank.criteria.extra).toLocaleString()}%
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditRank(rank)}
                    fullWidth
                  >
                    Edit Rank
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Edit Rank Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" color="primary">
            Edit Rank: {selectedRank?.rank}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={updateRank}
          >
            {({
              isSubmitting,
              errors,
              touched,
              handleChange,
              handleBlur,
              values,
            }) => (
              <Form>
                <TextField
                  fullWidth
                  label="Required Amount"
                  name="required"
                  type="number"
                  value={values.required}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.required && Boolean(errors.required)}
                  helperText={touched.required && errors.required}
                  margin="normal"
                  variant="outlined"
                  color="primary"
                  InputProps={{
                    inputProps: { min: 0, step: 1 },
                  }}
                />

                <TextField
                  fullWidth
                  label="Reward Amount"
                  name="reward"
                  type="number"
                  value={values.reward}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.reward && Boolean(errors.reward)}
                  helperText={touched.reward && errors.reward}
                  margin="normal"
                  variant="outlined"
                  color="primary"
                  InputProps={{
                    inputProps: { min: 0, step: 1 },
                  }}
                />

                <TextField
                  fullWidth
                  label="Extra Bonus (%)"
                  name="extra"
                  type="number"
                  value={values.extra || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.extra && Boolean(errors.extra)}
                  helperText={touched.extra && errors.extra}
                  margin="normal"
                  variant="outlined"
                  color="primary"
                  InputProps={{
                    inputProps: { min: 0, step: 1 },
                  }}
                  placeholder="Optional"
                />

                <DialogActions sx={{ mt: 3, px: 0 }}>
                  <Button onClick={handleCloseDialog} color="inherit">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                     sx={{
                        color: "white",
                        background:
                          "linear-gradient(to right, #AC9B6D, #8B7550, #6A5637)",
                      }}
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                  >
                    {isSubmitting ? "Updating..." : "Update Rank"}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default RankManagement;
