import { useState } from "react";
import {
  Chip,
  CircularProgress,
  Stack,
  TableCell,
  TableRow,
  Modal,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

const LeavesItem = ({ item, setInvoicesData, invoicesData }) => {
  const { User } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [reason, setReason] = useState("");
  const notify = useNotify();

  const handleOpenModal = (action) => {
    setModalAction(action);
    setOpenModal(true);
  };

  const handleSubmit = () => {
    setLoading(true);
    postRequest(
      "/approveOrRejectLeave",
      {
        status: modalAction,
        id: item._id,
        reason,
      },
      (response) => {
        notify(response?.data?.message, "success");
        setInvoicesData((prevInvoices) =>
          prevInvoices.filter((invoice) => invoice._id !== item._id)
        );
        setLoading(false);
        setOpenModal(false);
      },
      (error) => {
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        notify(errorMessage, "error");
        console.error(
          "Error submitting leave request:",
          error.response || error
        );
        setLoading(false);
      }
    );
  };

  if (User.roles[0] === "CEO" && item.status !== "Pending") {
    return null;
  }

  return (
    <>
      <TableRow>
        <TableCell>{item?.userId?.firstname}</TableCell>
        <TableCell
          sx={{
            maxWidth: 200,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {item?.subject}
        </TableCell>

        <TableCell
          sx={{
            maxWidth: 220,
            overflowX: "auto",
            whiteSpace: "nowrap",
            display: "block",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              height: "5px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "10px",
            },
          }}
        >
          {item.body}
        </TableCell>
        <TableCell>
          {new Date(item.dateTo).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}{" "}
          |{" "}
          {new Date(item.dateFrom).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </TableCell>

        <TableCell>{item.reason}</TableCell>
        <TableCell sx={{ display: "flex", gap: 2 }}>
          {User.roles[0] === "Employee" ? (
            <Chip label={item.status} size="small" />
          ) : (
            <>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ cursor: "pointer" }}
                onClick={() => handleOpenModal("Rejected")}
              >
                <Chip
                  label="Reject"
                  size="small"
                  sx={{ backgroundColor: "red", color: "white" }}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ cursor: "pointer" }}
                onClick={() => handleOpenModal("Approved")}
              >
                <Chip
                  label="Approve"
                  size="small"
                  sx={{ backgroundColor: "#50C878", color: "white" }}
                />
              </Stack>
            </>
          )}
        </TableCell>
      </TableRow>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2>{modalAction} Leave</h2>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 3 }}
          >
            <Button variant="outlined" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export { LeavesItem };
