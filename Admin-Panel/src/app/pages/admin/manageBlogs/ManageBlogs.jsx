import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { postRequest } from "../../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";
import UpdateBlog from "./UpdateBlog";

export default function ManageBlogs() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const notify = useNotify();

  const fetchBlogs = async () => {
    postRequest("/getallBlogs", {}, (response) => {
      if (response.data.success) {
        setBlogPosts(response.data.data);
      } else {
        notify(response.data.message || "Failed to fetch Blogs", "error");
      }
    });
  };
  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = (id) => {
    postRequest("/deleteblog", { id }, (response) => {
      if (response.data.success) {
        setBlogPosts(blogPosts.filter((blogPosts) => blogPosts._id !== id));
        notify(response.data.message, "success");
      } else {
        notify(response.data.message || "Failed to delete FAQ", "error");
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedBlog(null);
  };
  const handleUpdateBlog = (updatedBlog) => {
    fetchBlogs();
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h2" sx={{ p: 2 }}>
        Blogs List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Time</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blogPosts.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell width={200}>
                <img
                  src={blog.media.url}
                  alt={blog.title}
                  style={{ width: 300, height: 100 }}
                />
              </TableCell>
              <TableCell width={250}>{blog.title}</TableCell>
              <TableCell width={400}>
                <Box
                  dangerouslySetInnerHTML={{
                    __html: blog.description,
                  }}
                  sx={{
                    width: "450px",
                    height: "120px",
                    overflow: "auto",
                    // border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    padding: "8px",
                    backgroundColor: "#ffffff",
                    "& p": { margin: "0.5em 0" },
                    "& ul, & ol": { marginLeft: "1em" },
                    "& img": { maxWidth: "100%", height: "auto" },
                    "& h1, & h2, & h3, & h4, & h5, & h6": { margin: "0.5em 0" },
                    "& blockquote": {
                      borderLeft: "3px solid #ccc",
                      paddingLeft: "10px",
                      margin: "0.5em 0",
                    },
                    fontSize: "14px",
                    lineHeight: "1.4",
                  }}
                />
              </TableCell>
              <TableCell width={150}>{formatDate(blog.createdAt)}</TableCell>
              <TableCell align="center" width={120}>
                <IconButton
                  color="primary"
                  aria-label="edit"
                  onClick={() => handleEdit(blog)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  aria-label="delete"
                  onClick={() => handleDelete(blog._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UpdateBlog
        open={editModalOpen}
        onClose={handleModalClose}
        blog={selectedBlog}
        onUpdate={handleUpdateBlog}
      />
    </TableContainer>
  );
}
