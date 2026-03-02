import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
  TextField,
  Button,
  Alert,
  LinearProgress,
  Typography,
  IconButton,
  Paper,
  Box,
  styled,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  Divider,
  Snackbar,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  alpha,
} from "@mui/material";
import {
  Delete,
  CloudUpload,
  Pets as PetsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import GradientButton from "../../components/ui/GradientButton";
import OutlineButton from "../../components/ui/OutlineButton";
import StyledTextField from "../../components/ui/StyledTextField";
import { Helmet } from "react-helmet-async";

// Cloudinary Configuration
const CLOUD_NAME = "ddh86gfrm";
const UPLOAD_PRESET = "ml_default";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const DropzoneWrapper = styled("div")(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create(["background-color", "border-color"]),
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: theme.palette.action.hover,
  },
  "&.active": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.selected,
  },
}));

const PreviewWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  display: "inline-block",
  marginTop: theme.spacing(1),
  maxWidth: "100%",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  boxShadow: theme.shadows[1],
}));

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["blockquote", "code-block"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "image",
  "blockquote",
  "code-block",
  "color",
  "background",
  "align",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function BlogManagement() {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const BLUE_COLOR = theme.palette.primary.main;
  const BLUE_DARK = theme.palette.primary.dark || theme.palette.primary.main;
  const RED_COLOR = theme.palette.error.main;
  const GREEN_COLOR = theme.palette.success.main;
  const TEXT_PRIMARY = theme.palette.text.primary;

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // 'create', 'edit', 'view'

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Form state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [petType, setPetType] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [categoryError, setCategoryError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [petTypeError, setPetTypeError] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      excerpt: "",
    },
  });

  // Fetch blogs data
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/blogs");
      return response.data.blogs || response.data.data || response.data;
    },
  });

  // Pagination logic
  const paginatedBlogs = blogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const addAlert = (severity, message) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, severity, message, open: true }]);
  };

  const handleCloseAlert = (id) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, open: false } : alert,
      ),
    );
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 300);
  };

  const handleFileChange = useCallback((file) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      addAlert("error", "File size exceeds 5MB limit");
      return;
    }

    if (!file.type.match("image.*")) {
      addAlert("error", "Only image files are allowed");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      handleFileChange(acceptedFiles[0]);
    },
    onDropRejected: (rejectedFiles) => {
      const file = rejectedFiles[0];
      let message = "File rejected";

      if (file.errors.some((e) => e.code === "file-too-large")) {
        message = "File is too large (max 5MB)";
      } else if (file.errors.some((e) => e.code === "file-invalid-type")) {
        message = "Invalid file type. Please upload an image.";
      }

      addAlert("error", message);
    },
  });

  const uploadToCloudinary = async () => {
    if (!imageFile) return null;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100,
          );
          setUploadProgress(progress);
        },
      });

      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      addAlert("error", "Image upload failed. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const resetForm = () => {
    reset();
    setContent("");
    setCategory("");
    setPetType("");
    setIsFeatured(false);
    setTags([]);
    handleRemoveImage();
    setUploadProgress(0);
    setContentError(false);
    setCategoryError(false);
    setPetTypeError(false);
  };

  const handleOpenModal = (mode, blog = null) => {
    setModalMode(mode);
    if (blog) {
      setSelectedBlog(blog);
      setValue("title", blog.title);
      setValue("excerpt", blog.excerpt || "");
      setContent(blog.content);
      setCategory(blog.category);
      setPetType(blog.petType);
      setIsFeatured(blog.isFeatured || false);
      setTags(blog.tags || []);
      if (blog.imageUrl) {
        setImagePreview(blog.imageUrl);
      }
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBlog(null);
    resetForm();
  };

  const createBlogMutation = useMutation({
    mutationFn: async (blogData) => {
      const response = await axiosInstance.post("/blogs", blogData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      addAlert("success", "Blog post created successfully!");
      handleCloseModal();
    },
    onError: (error) => {
      console.error("Submission error:", error);
      addAlert(
        "error",
        error.response?.data?.message ||
          "Failed to create blog. Please try again.",
      );
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, blogData }) => {
      const response = await axiosInstance.put(`/blogs/${id}`, blogData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      addAlert("success", "Blog post updated successfully!");
      handleCloseModal();
    },
    onError: (error) => {
      console.error("Update error:", error);
      addAlert(
        "error",
        error.response?.data?.message ||
          "Failed to update blog. Please try again.",
      );
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/blogs/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      addAlert("success", "Blog post deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      addAlert(
        "error",
        error.response?.data?.message ||
          "Failed to delete blog. Please try again.",
      );
    },
  });

  const onSubmit = async (data) => {
    // Clear previous alerts
    setAlerts([]);

    // Validate content
    if (!content || content === "<p><br></p>") {
      setContentError(true);
      addAlert("error", "Blog content is required.");
      return;
    } else {
      setContentError(false);
    }

    // Validate category
    if (!category) {
      setCategoryError(true);
      addAlert("error", "Please select a category.");
      return;
    } else {
      setCategoryError(false);
    }

    // Validate pet type
    if (!petType) {
      setPetTypeError(true);
      addAlert("error", "Please select a pet type.");
      return;
    } else {
      setPetTypeError(false);
    }

    // Validate image for new blogs
    if (modalMode === "create" && !imageFile) {
      addAlert("error", "Please select a featured image.");
      return;
    }

    try {
      let imageUrl = selectedBlog?.imageUrl || "";
      
      // Upload image if new file is selected
      if (imageFile) {
        const uploadedUrl = await uploadToCloudinary();
        if (!uploadedUrl) return;
        imageUrl = uploadedUrl;
      }

      const titleSlug = generateSlug(data.title);

      const blogData = {
        title: data.title,
        excerpt:
          data.excerpt || content.substring(0, 160).replace(/<[^>]*>/g, ""),
        slug: titleSlug,
        content,
        imageUrl,
        category,
        petType,
        isFeatured,
        tags,
        status: "published",
        publishedAt: new Date().toISOString(),
      };

      if (modalMode === "edit" && selectedBlog) {
        updateBlogMutation.mutate({ id: selectedBlog._id, blogData });
      } else {
        createBlogMutation.mutate(blogData);
      }
    } catch (error) {
      console.error("Submission error:", error);
      addAlert("error", "Failed to publish blog. Please try again.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteBlogMutation.mutate(id);
    }
  };

  const getCategoryLabel = (value) => {
    const categories = {
      care: "Care",
      pet: "Pet",
      dental: "Dental",
      surgery: "Surgery",
      diagnostic: "Diagnostic",
      safety: "Safety",
    };
    return categories[value] || value;
  };

  const getPetTypeLabel = (value) => {
    const types = {
      cat: "Cat",
      dog: "Dog",
      bird: "Bird",
      rabbit: "Rabbit",
      hamster: "Hamster",
      fish: "Fish",
      reptile: "Reptile",
      other: "Other Pets",
    };
    return types[value] || value;
  };

  return (
    <Box>
      <Helmet>
        <title>Blog Management - PetCare</title>
        <meta
          name="description"
          content="Manage your pet blog posts"
        />
      </Helmet>

      {/* Alerts */}
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={alert.open}
          autoHideDuration={6000}
          onClose={() => handleCloseAlert(alert.id)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => handleCloseAlert(alert.id)}
            severity={alert.severity}
            variant="filled"
            sx={{
              width: "100%",
              boxShadow: 3,
            }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      ))}

      {/* Header */}
      <Box sx={{ display: { xs: "", lg: "flex" } }} justifyContent="space-between" alignItems="center" mb={2}>
        <Box mb={1}>
          <Typography
            sx={{
              fontWeight: 600,
              mb: 0.5,
              fontSize: "1.1rem",
              background: `linear-gradient(135deg, ${BLUE_DARK} 0%, ${BLUE_COLOR} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Blog Management
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: "0.75rem", color: TEXT_PRIMARY }}
          >
            Manage your pet blog posts
          </Typography>
        </Box>
        <GradientButton
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: "0.9rem" }} />}
          onClick={() => handleOpenModal("create")}
          size="small"
          sx={{ fontSize: "0.8rem", py: 0.6, px: 1.5 }}
        >
          Create New Post
        </GradientButton>
      </Box>

      {/* Blogs Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 1.5,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{
              backgroundColor: theme.palette.mode === "dark"
                ? alpha(BLUE_COLOR, 0.1)
                : alpha(BLUE_COLOR, 0.05),
            }}>
              <TableCell sx={{
                fontWeight: 600,
                color: TEXT_PRIMARY,
                borderBottom: `2px solid ${BLUE_COLOR}`,
                fontSize: "0.8rem",
                py: 1,
              }}>
                Title
              </TableCell>
              <TableCell sx={{
                fontWeight: 600,
                color: TEXT_PRIMARY,
                borderBottom: `2px solid ${BLUE_COLOR}`,
                fontSize: "0.8rem",
                py: 1,
              }}>
                Category
              </TableCell>
              <TableCell sx={{
                fontWeight: 600,
                color: TEXT_PRIMARY,
                borderBottom: `2px solid ${BLUE_COLOR}`,
                fontSize: "0.8rem",
                py: 1,
              }}>
                Pet Type
              </TableCell>
              <TableCell sx={{
                fontWeight: 600,
                color: TEXT_PRIMARY,
                borderBottom: `2px solid ${BLUE_COLOR}`,
                fontSize: "0.8rem",
                py: 1,
              }}>
                Featured
              </TableCell>
              <TableCell sx={{
                fontWeight: 600,
                color: TEXT_PRIMARY,
                borderBottom: `2px solid ${BLUE_COLOR}`,
                fontSize: "0.8rem",
                py: 1,
              }}>
                Tags
              </TableCell>
              <TableCell align="right" sx={{
                fontWeight: 600,
                color: TEXT_PRIMARY,
                borderBottom: `2px solid ${BLUE_COLOR}`,
                fontSize: "0.8rem",
                py: 1,
              }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <LinearProgress sx={{ maxWidth: 200, mx: "auto" }} />
                </TableCell>
              </TableRow>
            ) : paginatedBlogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Box py={2}>
                    <PetsIcon sx={{ fontSize: 32, color: alpha(TEXT_PRIMARY, 0.2), mb: 1.5 }} />
                    <Typography variant="caption" sx={{ fontSize: "0.75rem", color: TEXT_PRIMARY }}>
                      No blog posts found. Create one to get started.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedBlogs.map((blog) => (
                <TableRow
                  key={blog._id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: theme.palette.mode === "dark"
                        ? alpha(BLUE_COLOR, 0.05)
                        : alpha(BLUE_COLOR, 0.03),
                    },
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  <TableCell sx={{ py: 1 }}>
                    <Typography variant="caption" fontWeight={500} sx={{ fontSize: "0.8rem", color: TEXT_PRIMARY }}>
                      {blog.title}
                    </Typography>
                    {blog.excerpt && (
                      <Typography variant="caption" sx={{ fontSize: "0.7rem", display: "block", color: TEXT_PRIMARY, opacity: 0.7 }}>
                        {blog.excerpt.substring(0, 50)}...
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip
                      label={getCategoryLabel(blog.category)}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: 20,
                        backgroundColor: alpha(BLUE_COLOR, 0.1),
                        color: BLUE_COLOR,
                        borderColor: BLUE_COLOR,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip
                      label={getPetTypeLabel(blog.petType)}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: 20,
                        backgroundColor: alpha(GREEN_COLOR, 0.1),
                        color: GREEN_COLOR,
                        borderColor: GREEN_COLOR,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {blog.isFeatured ? (
                      <Chip
                        label="Featured"
                        size="small"
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.7rem",
                          height: 20,
                          backgroundColor: alpha(GREEN_COLOR, 0.1),
                          color: GREEN_COLOR,
                        }}
                      />
                    ) : (
                      <Typography variant="caption" sx={{ fontSize: "0.7rem", color: TEXT_PRIMARY, opacity: 0.5 }}>
                        No
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.3 }}>
                      {blog.tags?.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            fontSize: "0.6rem",
                            height: 18,
                          }}
                        />
                      ))}
                      {blog.tags?.length > 2 && (
                        <Typography variant="caption" sx={{ fontSize: "0.6rem", color: TEXT_PRIMARY }}>
                          +{blog.tags.length - 2}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenModal("view", blog)}
                      sx={{
                        color: BLUE_COLOR,
                        fontSize: "0.8rem",
                        "&:hover": {
                          backgroundColor: alpha(BLUE_COLOR, 0.1),
                        },
                      }}
                    >
                      <VisibilityIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenModal("edit", blog)}
                      sx={{
                        color: BLUE_COLOR,
                        fontSize: "0.8rem",
                        "&:hover": {
                          backgroundColor: alpha(BLUE_COLOR, 0.1),
                        },
                      }}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(blog._id)}
                      sx={{
                        color: RED_COLOR,
                        fontSize: "0.8rem",
                        "&:hover": {
                          backgroundColor: alpha(RED_COLOR, 0.1),
                        },
                      }}
                    >
                      <Delete fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={blogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontSize: "0.75rem",
              color: TEXT_PRIMARY,
            },
            "& .MuiSelect-select": {
              fontSize: "0.8rem",
              padding: "4px 32px 4px 12px",
              color: TEXT_PRIMARY,
            },
          }}
          size="small"
        />
      </TableContainer>

      {/* Create/Edit/View Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }
        }}
      >
        <DialogTitle sx={{
          color: TEXT_PRIMARY,
          fontWeight: 600,
          fontSize: "0.95rem",
          py: 1.5,
          px: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}>
          {modalMode === "create" && "Create New Blog Post"}
          {modalMode === "edit" && "Edit Blog Post"}
          {modalMode === "view" && "View Blog Post"}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ px: 2, py: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                {/* Title Field */}
                <Box sx={{ mb: 2 }}>
                  <StyledTextField
                    label="Blog Title"
                    fullWidth
                    size="small"
                    disabled={modalMode === "view"}
                    {...register("title", {
                      required: "Title is required",
                      minLength: {
                        value: 5,
                        message: "Title must be at least 5 characters",
                      },
                      maxLength: {
                        value: 120,
                        message: "Title must not exceed 120 characters",
                      },
                    })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                </Box>

                {/* Excerpt Field */}
                <Box sx={{ mb: 2 }}>
                  <StyledTextField
                    label="Short Excerpt (Optional)"
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                    disabled={modalMode === "view"}
                    {...register("excerpt", {
                      maxLength: {
                        value: 200,
                        message: "Excerpt must not exceed 200 characters",
                      },
                    })}
                    error={!!errors.excerpt}
                    helperText={
                      errors.excerpt?.message || "Brief summary of your post"
                    }
                  />
                </Box>

                {/* Content Editor */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: "text.primary",
                    }}
                  >
                    Content
                    {contentError && modalMode !== "view" && (
                      <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                        (required)
                      </Typography>
                    )}
                  </Typography>
                  <Box
                    sx={{
                      pointerEvents: modalMode === "view" ? "none" : "auto",
                      "& .quill": {
                        "& .ql-toolbar": {
                          borderColor: "divider",
                          borderTopLeftRadius: 4,
                          borderTopRightRadius: 4,
                          display: modalMode === "view" ? "none" : "block",
                        },
                        "& .ql-container": {
                          borderColor: "divider",
                          borderBottomLeftRadius: 4,
                          borderBottomRightRadius: 4,
                          minHeight: 200,
                          fontSize: "0.875rem",
                        },
                        "& .ql-editor": {
                          minHeight: 200,
                        },
                      },
                    }}
                  >
                    <ReactQuill
                      value={content}
                      onChange={(value) => {
                        if (modalMode !== "view") {
                          setContent(value);
                          if (value && value !== "<p><br></p>") {
                            setContentError(false);
                          }
                        }
                      }}
                      theme="snow"
                      modules={modules}
                      formats={formats}
                      placeholder="Share your pet story, tips, or advice..."
                      readOnly={modalMode === "view"}
                    />
                  </Box>
                </Box>

                {/* Image Upload - Only show for create/edit */}
                {modalMode !== "view" && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: "text.primary",
                      }}
                    >
                      Featured Image
                    </Typography>
                    <DropzoneWrapper
                      {...getRootProps()}
                      className={isDragActive ? "active" : ""}
                    >
                      <input {...getInputProps()} />
                      <PetsIcon
                        sx={{
                          fontSize: 40,
                          color: "primary.main",
                          mb: 1,
                          opacity: 0.6,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, color: "text.primary" }}
                      >
                        {isDragActive
                          ? "Drop the image here"
                          : "Drag & drop your pet's photo here, or click to select"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        Recommended: 1200x630px • Max: 5MB (JPG, PNG, GIF)
                      </Typography>
                    </DropzoneWrapper>

                    {(imagePreview || selectedBlog?.imageUrl) && (
                      <Box sx={{ mt: 2 }}>
                        <PreviewWrapper>
                          <img
                            src={imagePreview || selectedBlog?.imageUrl}
                            alt="Preview"
                            style={{
                              width: "100%",
                              maxHeight: 200,
                              objectFit: "cover",
                            }}
                          />
                          {modalMode !== "view" && (
                            <IconButton
                              onClick={handleRemoveImage}
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                bgcolor: "error.main",
                                color: "white",
                                "&:hover": {
                                  bgcolor: "error.dark",
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </PreviewWrapper>
                      </Box>
                    )}

                    {isUploading && (
                      <Box sx={{ mt: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "primary.light",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: "primary.main",
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          align="center"
                          sx={{
                            mt: 0.5,
                            display: "block",
                            color: "text.secondary",
                          }}
                        >
                          Uploading: {uploadProgress}%
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Show image in view mode */}
                {modalMode === "view" && selectedBlog?.imageUrl && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: "text.primary",
                      }}
                    >
                      Featured Image
                    </Typography>
                    <PreviewWrapper>
                      <img
                        src={selectedBlog.imageUrl}
                        alt={selectedBlog.title}
                        style={{
                          width: "100%",
                          maxHeight: 200,
                          objectFit: "cover",
                        }}
                      />
                    </PreviewWrapper>
                  </Box>
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                {/* Settings Panel */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "background.default",
                    borderRadius: 2,
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: "text.primary",
                    }}
                  >
                    Post Settings
                  </Typography>

                  {/* Category Selection */}
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel error={categoryError}>
                      Category {categoryError && modalMode !== "view" && "(required)"}
                    </InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => {
                        if (modalMode !== "view") {
                          setCategory(e.target.value);
                          if (e.target.value) {
                            setCategoryError(false);
                          }
                        }
                      }}
                      label={`Category ${categoryError ? "(required)" : ""}`}
                      error={categoryError}
                      disabled={modalMode === "view"}
                    >
                      <MenuItem value="care">Care</MenuItem>
                      <MenuItem value="pet">Pet</MenuItem>
                      <MenuItem value="dental">Dental</MenuItem>
                      <MenuItem value="surgery">Surgery</MenuItem>
                      <MenuItem value="diagnostic">Diagnostic</MenuItem>
                      <MenuItem value="safety">Safety</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Pet Type Selection */}
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel error={petTypeError}>
                      Pet Type {petTypeError && modalMode !== "view" && "(required)"}
                    </InputLabel>
                    <Select
                      value={petType}
                      onChange={(e) => {
                        if (modalMode !== "view") {
                          setPetType(e.target.value);
                          if (e.target.value) {
                            setPetTypeError(false);
                          }
                        }
                      }}
                      label={`Pet Type ${petTypeError ? "(required)" : ""}`}
                      error={petTypeError}
                      disabled={modalMode === "view"}
                    >
                      <MenuItem value="cat">Cat</MenuItem>
                      <MenuItem value="dog">Dog</MenuItem>
                      <MenuItem value="bird">Bird</MenuItem>
                      <MenuItem value="rabbit">Rabbit</MenuItem>
                      <MenuItem value="hamster">Hamster</MenuItem>
                      <MenuItem value="fish">Fish</MenuItem>
                      <MenuItem value="reptile">Reptile</MenuItem>
                      <MenuItem value="other">Other Pets</MenuItem>
                    </Select>
                  </FormControl>

                  <Divider sx={{ my: 2 }} />

                  {/* Tags */}
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: "text.primary",
                    }}
                  >
                    Tags
                  </Typography>
                  
                  {modalMode !== "view" ? (
                    <>
                      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <StyledTextField
                          placeholder="Add tag"
                          size="small"
                          fullWidth
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                        />
                        <OutlineButton
                          onClick={handleAddTag}
                          disabled={!tagInput.trim()}
                          size="small"
                        >
                          Add
                        </OutlineButton>
                      </Box>
                      <Box
                        sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}
                      >
                        {tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            onDelete={() => handleRemoveTag(tag)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </>
                  ) : (
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}
                    >
                      {tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Featured Option */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isFeatured}
                        onChange={(e) => {
                          if (modalMode !== "view") {
                            setIsFeatured(e.target.checked);
                          }
                        }}
                        color="primary"
                        size="small"
                        disabled={modalMode === "view"}
                      />
                    }
                    label="Feature this post"
                  />
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 2, py: 1.5, borderTop: `1px solid ${theme.palette.divider}` }}>
            <OutlineButton
              onClick={handleCloseModal}
              size="small"
              sx={{ fontSize: "0.8rem", py: 0.4, px: 1.5 }}
            >
              {modalMode === "view" ? "Close" : "Cancel"}
            </OutlineButton>
            
            {modalMode !== "view" && (
              <GradientButton
                type="submit"
                size="small"
                disabled={
                  isUploading ||
                  createBlogMutation.isPending ||
                  updateBlogMutation.isPending ||
                  !isValid ||
                  !content ||
                  content === "<p><br></p>" ||
                  !category ||
                  !petType ||
                  (modalMode === "create" && !imageFile)
                }
                sx={{ fontSize: "0.8rem", py: 0.4, px: 1.5 }}
              >
                {isUploading || createBlogMutation.isPending || updateBlogMutation.isPending
                  ? "Saving..."
                  : modalMode === "create" ? "Create Post" : "Update Post"}
              </GradientButton>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
