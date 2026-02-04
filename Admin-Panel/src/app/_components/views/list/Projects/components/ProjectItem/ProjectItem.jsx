import React, { useState } from "react";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Div } from "@jumbo/shared";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  AvatarGroup,
  Card,
  Chip,
  Backdrop,
  LinearProgress,
  Modal,
  Typography,
  Slide,
  Box,
  IconButton,
  Tabs,
  Tab,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import { postRequest } from "../../../../../../../backendServices/ApiCalls";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers";
import { LoadingButton } from "@mui/lab";
import EmployeeList from "@app/pages/list-views/projects/Employees";
import axios from "axios";

const validationSchema = Yup.object({
  name: Yup.string().required("Project Name is required"),
  description: Yup.string().required("Description is required"),
  date: Yup.date()
    .min(dayjs().startOf("day"), "Start Date must be today or later")
    .required("Start Date is required"),
  deadline: Yup.date()
    .min(Yup.ref("date"), "Deadline must be after the Start Date")
    .required("Deadline is required"),
  status: Yup.object({
    label: Yup.string().required("Status is required"),
  }),
});

const ProjectItem = ({ item }) => {
  const { User } = useAuth();
  const [expanded, setExpanded] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingdelete, setLoadingdelete] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedEmployees, setSelectedEmployees] = useState(item?.team || []);

  const handleClick = () => {
    if (item.id) setExpanded(!expanded);
  };

  const handleDelete = () => {
    setLoadingdelete(true);
    postRequest(
      "/delete-project",
      { id: item._id },
      (response) => {
        setLoadingdelete(false);
        if (response?.status === 200) {
          toast.success("Project Deleted Successfully");
          setIsDeleted(true);
        }
      },
      (error) => {
        setLoadingdelete(false);
        toast.error(
          error.response?.data?.message || "Project deletion failed."
        );
      }
    );
  };

  const formik = useFormik({
    initialValues: {
      _id: item?._id,
      name: item?.name || "",
      description: item?.description || "",
      date: item?.date ? dayjs(item.date) : null,
      deadline: item?.deadline ? dayjs(item.deadline) : null,
      status: item?.status || { label: "In Progress" },
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        const payload = {
          ...values,
          addedBy: User?.companyId || "unknown",
          team: selectedEmployees,
        };

        postRequest(
          "/update-project",
          payload,
          (response) => {
            setLoading(false);
            if (response?.status === 200) {
              const updatedProject = response.data;
              formik.setValues({
                _id: updatedProject._id,
                name: updatedProject.name || "",
                description: updatedProject.description || "",
                date: updatedProject.date ? dayjs(updatedProject.date) : null,
                deadline: updatedProject.deadline
                  ? dayjs(updatedProject.deadline)
                  : null,
                status: updatedProject.status || { label: "In Progress" },
              });
              Object.assign(item, updatedProject);
              setSelectedEmployees(updatedProject.team || []);

              setOpen(false);
              toast.success("Project updated successfully!");
            }
          },
          (error) => {
            setLoading(false);
            toast.error(
              error.response?.data?.message || "Project update failed."
            );
          }
        );
      } catch (error) {
        setLoading(false);
        console.error("Error updating project:", error);
        toast.error("Error updating project!");
      }
      setSubmitting(false);
    },
  });

  if (isDeleted) return null;

  return (
    <Card sx={{ mb: 1 }}>
      <Accordion
        expanded={expanded}
        onChange={handleClick}
        square
        sx={{ borderRadius: 2 }}
      >
        <AccordionSummary
          expandIcon={expanded ? <RemoveIcon /> : <AddIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{
            px: 3,
            flexDirection: "row-reverse",
            "& .MuiAccordionSummary-content": {
              alignItems: "center",
              "&.Mui-expanded": {
                margin: "12px 0",
              },
            },
            ".MuiAccordionSummary-expandIconWrapper": {
              borderRadius: 1,
              border: 1,
              color: "text.secondary",
              borderColor: "divider",
              transform: "none",
              height: 28,
              width: 28,
              alignItems: "center",
              justifyContent: "center",
              mr: 1,
              "&.Mui-expanded": {
                transform: "none",
                color: "primary.main",
                borderColor: "primary.main",
              },
              "& svg": {
                fontSize: "1.25rem",
              },
            },
          }}
        >
          <Div sx={{ flexShrink: 0, px: 1 }}>
            <Avatar
              sx={{ width: 52, height: 52 }}
              alt={item.name}
              src={item.name}
              variant="rounded"
            />
          </Div>
          <Div
            sx={{
              width: { xs: "auto", lg: "26%" },
              flexShrink: 0,
              px: 1,
              flex: { xs: "1", lg: "0 1 auto" },
            }}
          >
            <Typography variant={"h5"} mb={0.5} fontSize={14}>
              {item.name}
            </Typography>
            <Typography
              fontSize={"12px"}
              variant={"body1"}
              color={"text.secondary"}
            >
              <CalendarTodayOutlinedIcon
                sx={{
                  verticalAlign: "middle",
                  fontSize: "1rem",
                  mt: -0.25,
                  mr: 1,
                }}
              />
              {new Date(item.date).toLocaleDateString()}
            </Typography>
          </Div>

          <Div
            sx={{
              display: { xs: "none", lg: "block" },
              width: "20%",
              flexShrink: 0,
              px: 2,
            }}
          >
            <LinearProgress
              variant={"determinate"}
              color={item?.status?.linear_color || "primary"}
              value={item.progress || 0}
              sx={{
                height: 6,
                borderRadius: 2,
                backgroundColor: "#E9EEEF",
              }}
            />
          </Div>
          <Div
            sx={{
              display: { xs: "none", lg: "block" },
              width: "16%",
              flexShrink: 0,
              px: 1,
            }}
          >
            <Typography
              fontSize={"12px"}
              variant={"h6"}
              color={"text.secondary"}
              mb={0.25}
            >
              Deadline
            </Typography>
            <Typography variant={"body1"}>
              {new Date(item.deadline).toLocaleDateString()}
            </Typography>
          </Div>

          <Div sx={{ flex: { xs: "0 1 auto", lg: 1 }, flexShrink: 0, px: 1 }}>
            <Typography
              fontSize={"12px"}
              variant={"h6"}
              color={"text.secondary"}
              mb={0.25}
              sx={{
                display: { xs: "none", lg: "block" },
              }}
            >
              Status
            </Typography>
            <Chip color={"primary"} size={"small"} label={item.status.label} />
          </Div>

          <AvatarGroup max={3} sx={{ display: { xs: "none", lg: "flex" } }}>
            {(item.team || []).map((teamMember, index) => (
              <Avatar
                key={index}
                alt={teamMember.name}
                src={teamMember.profilePic}
              />
            ))}
          </AvatarGroup>
          {loadingdelete ? (
            <CircularProgress size={24} color="#7352C7" />
          ) : (
            <DeleteSweepRoundedIcon
              sx={{ ml: 2, color: "red", cursor: "pointer" }}
              fontSize="large"
              onClick={(event) => {
                event.stopPropagation();
                handleDelete();
              }}
            />
          )}
          <EditNoteRoundedIcon
            sx={{ mx: 1, color: "#7352C7", cursor: "pointer" }}
            fontSize="large"
            onClick={(event) => {
              event.stopPropagation();
              setOpen(true);
            }}
          />
        </AccordionSummary>
        <AccordionDetails
          sx={{
            borderTop: 1,
            borderColor: "divider",
            p: (theme) => theme.spacing(2, 2, 2, 8.25),
          }}
        >
          <Typography variant={"h5"}>Description</Typography>
          <Div
            sx={{
              display: { xs: "flex", lg: "none" },
              minWidth: 0,
              flexDirection: "column",
            }}
          >
            <Div
              sx={{
                display: "flex",
                minWidth: 0,
                alignItems: "center",
                justifyContent: "space-between",
                mt: 1,
                mb: 2,
              }}
            >
              <Div>
                <Typography
                  fontSize={"12px"}
                  variant={"h6"}
                  color={"text.secondary"}
                  mb={0.25}
                >
                  Deadline
                </Typography>
                <Typography variant={"body1"}>
                  {new Date(item.deadline).toLocaleDateString()}
                </Typography>
              </Div>

              <AvatarGroup max={3}>
                {(item.team || []).map((teamMember, index) => (
                  <Avatar
                    key={index}
                    alt={teamMember.name}
                    src={teamMember.profilePic}
                  />
                ))}
              </AvatarGroup>
            </Div>
            <Div sx={{ mb: 3, maxWidth: 280 }}>
              <Typography
                fontSize={"12px"}
                variant={"h6"}
                color={"text.secondary"}
                mb={1}
              >
                Progress
              </Typography>
              <LinearProgress
                variant={"determinate"}
                color={item?.status?.linear_color || "primary"}
                value={item.progress || 0}
                sx={{
                  height: 6,
                  borderRadius: 2,
                  backgroundColor: "#E9EEEF",
                }}
              />
            </Div>
          </Div>
          <Typography variant={"body1"} color={"text.secondary"}>
            {item.description}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: "relative",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              height: 650,
              borderRadius: 2,
              minWidth: 500,
              maxWidth: "700px",
              overflowY: "auto",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Update Project</Typography>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Tabs
              value={tabIndex}
              onChange={(_, newValue) => setTabIndex(newValue)}
              centered
            >
              <Tab label="Edit Project" />
              <Tab label="Edit Team" />
            </Tabs>
            {tabIndex === 0 && (
              <form onSubmit={formik.handleSubmit}>
                <Box sx={{ "& .MuiTextField-root": { mb: 2, mt: 3 } }}>
                  <TextField
                    label="Project Name"
                    name="name"
                    fullWidth
                    size="small"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                  <TextField
                    label="Description"
                    name="description"
                    fullWidth
                    size="small"
                    multiline
                    rows={4}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                  />
                  <DatePicker
                    sx={{ marginRight: 5, mb: 2, mt: 3 }}
                    label="Start Date"
                    value={formik.values.date}
                    onChange={(newValue) =>
                      formik.setFieldValue("date", newValue)
                    }
                  />
                  <DatePicker
                    sx={{ mb: 2, mt: 3 }}
                    label="Deadline"
                    value={formik.values.deadline}
                    onChange={(newValue) =>
                      formik.setFieldValue("deadline", newValue)
                    }
                  />
                  <TextField
                    label="Status Label"
                    name="status.label"
                    fullWidth
                    size="small"
                    value={formik.values.status.label}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.status?.label &&
                      Boolean(formik.errors.status?.label)
                    }
                    helperText={
                      formik.touched.status?.label &&
                      formik.errors.status?.label
                    }
                  />
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mt: 2 }}
                    loading={formik.isSubmitting}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="#7352C7" />
                    ) : (
                      "Save"
                    )}
                  </LoadingButton>
                </Box>
              </form>
            )}
            {tabIndex === 1 && (
              <EmployeeList onSelectionChange={setSelectedEmployees} />
            )}
          </Box>
        </Slide>
      </Modal>
    </Card>
  );
};
export { ProjectItem };
