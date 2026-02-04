import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";

export default function ManageFaq() {
  const [faqs, setFaqs] = useState([]);
  const notify = useNotify();
  const [open, setOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState({
    _id: null,
    question: "",
    answer: "",
  });

  const getFaqsData = () => {
    postRequest("/getfaqs", {}, (response) => {
      if (response.data.success) {
        setFaqs(response.data.faqs);
      } else {
        notify(response.data.message || "Failed to fetch FAQs", "error");
      }
    });
  };

  const handleDelete = (id) => {
    postRequest("/deletefaqs", { id }, (response) => {
      if (response.data.success) {
        setFaqs(faqs.filter((faq) => faq._id !== id));
        notify(response.data.message, "success");
      } else {
        notify(response.data.message || "Failed to delete FAQ", "error");
      }
    });
  };

  const handleEdit = (faq) => {
    setSelectedFaq(faq);
    setOpen(true);
  };

  const handleChange = (e) => {
    setSelectedFaq({ ...selectedFaq, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    const { _id, question, answer } = selectedFaq;

    postRequest("/updatefaq", { id: _id, question, answer }, (response) => {
      if (response.data.success) {
        // Update the local state with the updated FAQ from response
        setFaqs(faqs.map((faq) => (faq._id === _id ? response.data.faq : faq)));
        notify(response.data.message, "success");
      } else {
        notify(response.data.message || "Failed to update FAQ", "error");
      }
      setOpen(false);
    });
  };

  useEffect(() => {
    getFaqsData();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage FAQs
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Question</strong>
              </TableCell>
              <TableCell>
                <strong>Answer</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {faqs.length > 0 ? (
              faqs.map((faq) => (
                <TableRow key={faq._id}>
                  <TableCell>{faq.question}</TableCell>
                  <TableCell>{faq.answer}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(faq)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(faq._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No FAQs available.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog
        PaperProps={{
          sx: {
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(139, 69, 19, 0.15)",
            border: "1px solid rgba(218, 165, 32, 0.2)",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(255, 248, 220, 0.7), rgba(245, 222, 179, 0.3))",
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(5px)",
          },
        }}
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update FAQ</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Question"
            name="question"
            value={selectedFaq.question || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Answer"
            name="answer"
            value={selectedFaq.answer || ""}
            multiline
            rows={4}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
