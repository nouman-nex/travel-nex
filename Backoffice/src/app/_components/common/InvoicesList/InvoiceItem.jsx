import { JumboDdMenu } from "@jumbo/components";
import {
  Chip,
  CircularProgress,
  Stack,
  TableCell,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

const InvoiceItem = ({ item, setInvoicesData, invoicesData }) => {
  const { User } = useAuth();
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDecline, setLoadingDecline] = useState(false);
  const notify = useNotify();

  const handleSubmit = (status) => {
    // Set loading state based on action
    if (status === "Approved") {
      setLoadingApprove(true);
    } else {
      setLoadingDecline(true);
    }

    const payload = {
      userId: item.userId,
      projectName: item.project,
      date: item.createdAt,
      startTime: item.startTime,
      endTime: item.endTime,
      reason: item.reason,
      role: User.roles[0],
      status: status, // Set status dynamically
    };

    postRequest(
      "/addTime",
      payload,
      (response) => {
        notify(response?.data?.message, "success");
        setInvoicesData((prevInvoices) =>
          prevInvoices.filter((invoice) => invoice._id !== item._id)
        );
        setLoadingApprove(false);
        setLoadingDecline(false);
      },
      (error) => {
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        notify(errorMessage, "error");
        console.error("Error submitting work log:", error.response || error);
        setLoadingApprove(false);
        setLoadingDecline(false);
      }
    );
  };

  return (
    <TableRow>
      <TableCell>{item.userName}</TableCell>
      <TableCell>{item.project}</TableCell>
      <TableCell>
        {new Date(item.startTime)
          .toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .replace(",", "")}
      </TableCell>
      <TableCell>
        {new Date(item.endTime)
          .toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .replace(",", "")}
      </TableCell>
      <TableCell>{item.reason}</TableCell>
      <TableCell sx={{ display: "flex", gap: 2 }}>
        {/* Decline Button */}
        {User.roles[0] === "Employee" && (
          <Stack
            direction={"row"}
            spacing={2}
            alignItems={"center"}
            sx={{ cursor: "pointer" }}
          >
            <Chip label={"Pending"} size="small" />
          </Stack>
        )}
        {User.roles[0] === "CEO" && (
          <Stack
            direction={"row"}
            spacing={2}
            alignItems={"center"}
            sx={{ cursor: "pointer" }}
            onClick={() => handleSubmit("Declined")}
          >
            <Chip
              label={
                loadingDecline ? (
                  <CircularProgress color="white" size={16} />
                ) : (
                  "Decline"
                )
              }
              size="small"
              sx={{ backgroundColor: "red", color: "white", minWidth: 60 }}
            />
          </Stack>
        )}
        {/* Approve Button (Only for CEO) */}
        {User.roles[0] === "CEO" && (
          <Stack
            direction={"row"}
            spacing={2}
            alignItems={"center"}
            sx={{ cursor: "pointer" }}
            onClick={() => handleSubmit("Approved")}
          >
            <Chip
              label={
                loadingApprove ? (
                  <CircularProgress color="white" size={16} />
                ) : (
                  "Approve"
                )
              }
              size="small"
              sx={{ backgroundColor: "#50C878", color: "white", minWidth: 60 }}
            />
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
};

export { InvoiceItem };
