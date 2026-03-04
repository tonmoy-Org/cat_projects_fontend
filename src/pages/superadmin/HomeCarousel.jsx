import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Switch,
  FormControlLabel,
  Tooltip,
  DialogContentText,
  alpha,
  TablePagination,
  useTheme,
  LinearProgress,
  Grid,
  FormHelperText,
  styled,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import axiosInstance from "../../api/axios";
import GradientButton from "../../components/ui/GradientButton";
import OutlineButton from "../../components/ui/OutlineButton";
import StyledTextField from "../../components/ui/StyledTextField";

// Cloudinary Configuration
const CLOUD_NAME = "ddh86gfrm";
const UPLOAD_PRESET = "ml_default";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const RequiredAsterisk = styled("span")(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: 1,
}));

export const HomeCarousel = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();

  const BLUE_COLOR = theme.palette.primary.main;
  const BLUE_DARK = theme.palette.primary.dark || theme.palette.primary.main;
  const RED_COLOR = theme.palette.error.main;
  const RED_DARK = theme.palette.error.dark || theme.palette.error.main;
  const GREEN_COLOR = theme.palette.success.main;
  const TEXT_PRIMARY = theme.palette.text.primary;

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCarousel, setSelectedCarousel] = useState(null);
  const [carouselToDelete, setCarouselToDelete] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Image upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      smallTitle: "",
      paragraph: "",
      btnText: "Learn More",
      btnLink: "#",
      order: "",
      isActive: true,
    },
  });

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds 5MB limit");
        setTimeout(() => setError(""), 3000);
        return;
      }

      if (!file.type.match("image.*")) {
        setError("Only image files are allowed");
        setTimeout(() => setError(""), 3000);
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setTouchedFields({ ...touchedFields, image: true });
    }
  }, [touchedFields]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop,
    onDropRejected: (rejectedFiles) => {
      const file = rejectedFiles[0];
      let message = "File rejected";

      if (file.errors.some((e) => e.code === "file-too-large")) {
        message = "File is too large (max 5MB)";
      } else if (file.errors.some((e) => e.code === "file-invalid-type")) {
        message = "Invalid file type. Please upload an image.";
      }

      setError(message);
      setTimeout(() => setError(""), 3000);
    },
  });

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setTouchedFields({ ...touchedFields, image: false });
  };

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
      setError("Image upload failed. Please try again.");
      setTimeout(() => setError(""), 3000);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const { data: carousels = [], isLoading } = useQuery({
    queryKey: ["carousel"],
    queryFn: async () => {
      const response = await axiosInstance.get("/carousel");
      return response.data.data || [];
    },
  });

  const filteredCarousels = useMemo(() => {
    if (!searchQuery.trim()) return carousels;

    const query = searchQuery.toLowerCase();
    return carousels.filter(
      (carousel) =>
        carousel.title?.toLowerCase().includes(query) ||
        carousel.smallTitle?.toLowerCase().includes(query) ||
        carousel.paragraph?.toLowerCase().includes(query),
    );
  }, [carousels, searchQuery]);

  const paginatedCarousels = useMemo(() => {
    return filteredCarousels.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [filteredCarousels, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const createCarouselMutation = useMutation({
    mutationFn: async (data) => {
      // Upload image to Cloudinary first
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary();
        if (!imageUrl) {
          throw new Error("Image upload failed");
        }
      }

      // Send data with image URL
      const response = await axiosInstance.post("/carousel", {
        ...data,
        image: imageUrl,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] });
      setSuccess("Carousel created successfully!");
      setOpenDialog(false);
      resetForm();
      setTimeout(() => setSuccess(""), 3000);
      setPage(0);
    },
    onError: (err) => {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create carousel",
      );
      setTimeout(() => setError(""), 3000);
    },
  });

  const deleteCarouselMutation = useMutation({
    mutationFn: async (carouselId) => {
      const response = await axiosInstance.delete(`/carousel/${carouselId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] });
      setSuccess("Carousel deleted successfully!");
      setOpenDeleteDialog(false);
      setCarouselToDelete(null);
      setTimeout(() => setSuccess(""), 3000);
      if (paginatedCarousels.length === 1 && page > 0) {
        setPage(page - 1);
      }
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to delete carousel");
      setOpenDeleteDialog(false);
      setCarouselToDelete(null);
      setTimeout(() => setError(""), 3000);
    },
  });

  const updateCarouselMutation = useMutation({
    mutationFn: async ({ carouselId, data }) => {
      // Upload new image if selected
      let imageUrl = data.image;
      if (imageFile) {
        imageUrl = await uploadToCloudinary();
        if (!imageUrl) {
          throw new Error("Image upload failed");
        }
      }

      // Send updated data
      const response = await axiosInstance.put(`/carousel/${carouselId}`, {
        ...data,
        image: imageUrl,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] });
      setSuccess("Carousel updated successfully!");
      setOpenDialog(false);
      resetForm();
      setTimeout(() => setSuccess(""), 3000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to update carousel");
      setTimeout(() => setError(""), 3000);
    },
  });

  const handleOpenDialog = (carousel = null) => {
    if (carousel) {
      setSelectedCarousel(carousel);
      reset({
        title: carousel.title || "",
        smallTitle: carousel.smallTitle || "",
        paragraph: carousel.paragraph || "",
        btnText: carousel.btnText || "Learn More",
        btnLink: carousel.btnLink || "#",
        order: carousel.order || "",
        isActive: carousel.isActive !== undefined ? carousel.isActive : true,
      });
      setImagePreview(carousel.image || null);
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCarousel(null);
    resetForm();
  };

  const handleDeleteClick = (carousel) => {
    setCarouselToDelete(carousel);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (carouselToDelete) {
      deleteCarouselMutation.mutate(carouselToDelete._id);
    }
  };

  const resetForm = () => {
    reset({
      title: "",
      smallTitle: "",
      paragraph: "",
      btnText: "Learn More",
      btnLink: "#",
      order: "",
      isActive: true,
    });
    handleRemoveImage();
    setSelectedCarousel(null);
    setTouchedFields({});
  };

  const isFormValid = () => {
    if (selectedCarousel) {
      // For edit mode, check if at least one field is changed
      return isValid;
    }
    // For create mode, check all required fields
    return isValid && imageFile;
  };

  const onSubmit = async (data) => {
    // Mark all fields as touched for validation
    const allTouched = {
      title: true,
      smallTitle: true,
      paragraph: true,
      btnText: true,
      btnLink: true,
      order: true,
      image: true,
    };
    setTouchedFields(allTouched);

    if (!selectedCarousel && !imageFile) {
      setError("Please select an image");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (selectedCarousel) {
      updateCarouselMutation.mutate({ carouselId: selectedCarousel._id, data });
    } else {
      createCarouselMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress sx={{ color: BLUE_COLOR }} />
      </Box>
    );
  }

  return (
    <Box>
      <Helmet>
        <title>Carousel Management | Admin</title>
        <meta name="description" content="Manage homepage carousel slides" />
      </Helmet>

      {/* Header */}
      <Box
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3 
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: TEXT_PRIMARY,
            }}
          >
            Carousel Management
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}
          >
            Manage homepage carousel slides and content
          </Typography>
        </Box>
        <GradientButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          size="small"
        >
          Add Carousel
        </GradientButton>
      </Box>

      {/* Search */}
      <Box mb={2}>
        <StyledTextField
          fullWidth
          placeholder="Search carousels by title, subtitle, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon
                sx={{
                  mr: 1,
                  color: TEXT_PRIMARY,
                  fontSize: "0.9rem",
                  opacity: 0.7,
                }}
              />
            ),
          }}
          size="small"
          sx={{
            "& .MuiInputBase-input": {
              fontSize: "0.8rem",
              color: TEXT_PRIMARY,
            },
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: alpha(BLUE_COLOR, 0.05),
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  py: 1.5,
                }}
              >
                Image
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  py: 1.5,
                }}
              >
                Title
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  py: 1.5,
                }}
              >
                Order
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  py: 1.5,
                }}
              >
                Status
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  py: 1.5,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCarousels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Box>
                    <ImageIcon
                      sx={{
                        fontSize: 48,
                        color: alpha(TEXT_PRIMARY, 0.2),
                        mb: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}
                    >
                      {searchQuery
                        ? "No carousels found."
                        : "No carousels yet. Create one to get started."}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCarousels.map((carousel) => (
                <TableRow
                  key={carousel._id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: alpha(BLUE_COLOR, 0.03),
                    },
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  <TableCell sx={{ py: 1 }}>
                    {carousel.image ? (
                      <Box
                        component="img"
                        src={carousel.image}
                        alt={carousel.title}
                        onClick={() => handleOpenDialog(carousel)}
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 0.5,
                          border: `1px solid ${theme.palette.divider}`,
                          cursor: "pointer",
                          transition: "opacity 0.2s",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: alpha(BLUE_COLOR, 0.05),
                          borderRadius: 0.5,
                          border: `1px dashed ${theme.palette.divider}`,
                        }}
                      >
                        <ImageIcon
                          sx={{
                            fontSize: 24,
                            color: alpha(TEXT_PRIMARY, 0.3),
                          }}
                        />
                      </Box>
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        {carousel.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: alpha(TEXT_PRIMARY, 0.7),
                        }}
                      >
                        {carousel.smallTitle}
                      </Typography>
                      {carousel.paragraph && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            color: alpha(TEXT_PRIMARY, 0.6),
                            mt: 0.5,
                          }}
                        >
                          {carousel.paragraph.substring(0, 60)}
                          {carousel.paragraph.length > 60 && "..."}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: TEXT_PRIMARY }}
                    >
                      {carousel.order}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip
                      label={carousel.isActive ? "Active" : "Inactive"}
                      size="small"
                      icon={
                        carousel.isActive ? (
                          <CheckCircleIcon sx={{ fontSize: "0.8rem" }} />
                        ) : undefined
                      }
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        height: 24,
                        backgroundColor: carousel.isActive
                          ? alpha(GREEN_COLOR, 0.1)
                          : alpha(TEXT_PRIMARY, 0.05),
                        color: carousel.isActive ? GREEN_COLOR : alpha(TEXT_PRIMARY, 0.7),
                        borderColor: carousel.isActive
                          ? alpha(GREEN_COLOR, 0.3)
                          : alpha(TEXT_PRIMARY, 0.2),
                      }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(carousel)}
                        sx={{
                          color: BLUE_COLOR,
                          mr: 0.5,
                          "&:hover": {
                            backgroundColor: alpha(BLUE_COLOR, 0.1),
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(carousel)}
                        sx={{
                          color: RED_COLOR,
                          "&:hover": {
                            backgroundColor: alpha(RED_COLOR, 0.1),
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredCarousels.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        />
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle
            sx={{
              color: TEXT_PRIMARY,
              fontWeight: 600,
              fontSize: "1rem",
              py: 2,
              px: 3,
            }}
          >
            {selectedCarousel ? "Edit Carousel" : "Add New Carousel"}
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 2 }}>
            <Grid container spacing={3}>
              {/* Left Column - Form Fields */}
              <Grid item xs={12} md={8}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                  {/* Title Field */}
                  <Box>
                    <Box sx={{ mb: 0.5 }}>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        Title
                      </Typography>
                      <RequiredAsterisk>*</RequiredAsterisk>
                    </Box>
                    <Controller
                      name="title"
                      control={control}
                      rules={{ 
                        required: "Title is required",
                        minLength: {
                          value: 3,
                          message: "Title must be at least 3 characters",
                        },
                      }}
                      render={({ field }) => (
                        <StyledTextField
                          {...field}
                          fullWidth
                          size="small"
                          error={!!errors.title}
                          helperText={errors.title?.message}
                          placeholder="Enter carousel title"
                        />
                      )}
                    />
                  </Box>

                  {/* Small Title Field */}
                  <Box>
                    <Box sx={{ mb: 0.5 }}>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        Small Title
                      </Typography>
                      <RequiredAsterisk>*</RequiredAsterisk>
                    </Box>
                    <Controller
                      name="smallTitle"
                      control={control}
                      rules={{ 
                        required: "Small title is required",
                      }}
                      render={({ field }) => (
                        <StyledTextField
                          {...field}
                          fullWidth
                          size="small"
                          error={!!errors.smallTitle}
                          helperText={errors.smallTitle?.message}
                          placeholder="Enter small title/subtitle"
                        />
                      )}
                    />
                  </Box>

                  {/* Description Field */}
                  <Box>
                    <Box sx={{ mb: 0.5 }}>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        Description
                      </Typography>
                      <RequiredAsterisk>*</RequiredAsterisk>
                    </Box>
                    <Controller
                      name="paragraph"
                      control={control}
                      rules={{ 
                        required: "Description is required",
                        minLength: {
                          value: 10,
                          message: "Description must be at least 10 characters",
                        },
                      }}
                      render={({ field }) => (
                        <StyledTextField
                          {...field}
                          fullWidth
                          multiline
                          rows={3}
                          size="small"
                          error={!!errors.paragraph}
                          helperText={errors.paragraph?.message}
                          placeholder="Enter carousel description"
                        />
                      )}
                    />
                  </Box>

                  {/* Button Text Field */}
                  <Box>
                    <Box sx={{ mb: 0.5 }}>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        Button Text
                      </Typography>
                      <RequiredAsterisk>*</RequiredAsterisk>
                    </Box>
                    <Controller
                      name="btnText"
                      control={control}
                      rules={{ 
                        required: "Button text is required",
                      }}
                      render={({ field }) => (
                        <StyledTextField
                          {...field}
                          fullWidth
                          size="small"
                          error={!!errors.btnText}
                          helperText={errors.btnText?.message}
                          placeholder="Enter button text (e.g., Learn More)"
                        />
                      )}
                    />
                  </Box>

                  {/* Button Link Field */}
                  <Box>
                    <Box sx={{ mb: 0.5 }}>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        Button Link
                      </Typography>
                      <RequiredAsterisk>*</RequiredAsterisk>
                    </Box>
                    <Controller
                      name="btnLink"
                      control={control}
                      rules={{ 
                        required: "Button link is required",
                        pattern: {
                          value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                          message: "Please enter a valid URL",
                        },
                      }}
                      render={({ field }) => (
                        <StyledTextField
                          {...field}
                          fullWidth
                          size="small"
                          error={!!errors.btnLink}
                          helperText={errors.btnLink?.message}
                          placeholder="Enter button link (e.g., /services or https://example.com)"
                        />
                      )}
                    />
                  </Box>

                  {/* Order Field */}
                  <Box>
                    <Box sx={{ mb: 0.5 }}>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        Order
                      </Typography>
                      <RequiredAsterisk>*</RequiredAsterisk>
                    </Box>
                    <Controller
                      name="order"
                      control={control}
                      rules={{ 
                        required: "Order is required",
                        min: {
                          value: 1,
                          message: "Order must be at least 1",
                        },
                      }}
                      render={({ field }) => (
                        <StyledTextField
                          {...field}
                          fullWidth
                          type="number"
                          size="small"
                          error={!!errors.order}
                          helperText={errors.order?.message}
                          placeholder="Enter display order (1, 2, 3...)"
                        />
                      )}
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Right Column - Settings & Image */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: alpha(BLUE_COLOR, 0.02),
                    borderRadius: 1,
                    border: 1,
                    borderColor: theme.palette.divider,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 2.5,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    Settings
                  </Typography>

                  {/* Active Status */}
                  <Box sx={{ mb: 2.5 }}>
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value}
                              onChange={onChange}
                              color="primary"
                              size="small"
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              sx={{ color: TEXT_PRIMARY }}
                            >
                              Active
                            </Typography>
                          }
                        />
                      )}
                    />
                  </Box>

                  {/* Image Upload */}
                  <Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        Image
                      </Typography>
                      {!selectedCarousel && <RequiredAsterisk>*</RequiredAsterisk>}
                    </Box>

                    {/* Dropzone */}
                    <Box
                      {...getRootProps()}
                      sx={{
                        border: `2px dashed ${isDragActive ? BLUE_COLOR : alpha(TEXT_PRIMARY, 0.2)}`,
                        borderRadius: 1,
                        p: 2,
                        textAlign: "center",
                        cursor: "pointer",
                        backgroundColor: isDragActive
                          ? alpha(BLUE_COLOR, 0.05)
                          : "transparent",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: BLUE_COLOR,
                          backgroundColor: alpha(BLUE_COLOR, 0.05),
                        },
                      }}
                    >
                      <input {...getInputProps()} />
                      <CloudUploadIcon
                        sx={{
                          fontSize: "2rem",
                          color: alpha(TEXT_PRIMARY, 0.5),
                          mb: 1,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.75rem",
                          color: TEXT_PRIMARY,
                          display: "block",
                        }}
                      >
                        {isDragActive
                          ? "Drop the image here"
                          : "Drag & drop image here, or click to select"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.7rem",
                          color: alpha(TEXT_PRIMARY, 0.5),
                          display: "block",
                          mt: 0.5,
                        }}
                      >
                        Max size: 5MB (JPG, PNG, GIF)
                      </Typography>
                    </Box>

                    {/* Image Preview */}
                    {(imagePreview || selectedCarousel?.image) && (
                      <Box sx={{ mt: 2, position: "relative" }}>
                        <img
                          src={imagePreview || selectedCarousel?.image}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: 150,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                        {!selectedCarousel && (
                          <IconButton
                            onClick={handleRemoveImage}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: RED_COLOR,
                              color: "white",
                              "&:hover": {
                                bgcolor: alpha(RED_COLOR, 0.8),
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                        {imageFile && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              mt: 0.5,
                              color: alpha(TEXT_PRIMARY, 0.7),
                              fontSize: "0.7rem",
                            }}
                          >
                            Selected file: {imageFile.name}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* Image Error */}
                    {!selectedCarousel && !imageFile && touchedFields.image && (
                      <FormHelperText error sx={{ mt: 1 }}>
                        Image is required
                      </FormHelperText>
                    )}

                    {/* Upload Progress */}
                    {isUploading && (
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            bgcolor: alpha(BLUE_COLOR, 0.1),
                            "& .MuiLinearProgress-bar": {
                              bgcolor: BLUE_COLOR,
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            mt: 0.5,
                            color: alpha(TEXT_PRIMARY, 0.7),
                            fontSize: "0.7rem",
                            textAlign: "center",
                          }}
                        >
                          Uploading: {uploadProgress}%
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <OutlineButton
              onClick={handleCloseDialog}
              size="small"
            >
              Cancel
            </OutlineButton>
            <GradientButton
              type="submit"
              variant="contained"
              disabled={
                isUploading ||
                createCarouselMutation.isPending ||
                updateCarouselMutation.isPending ||
                !isFormValid()
              }
              size="small"
            >
              {isUploading ||
              createCarouselMutation.isPending ||
              updateCarouselMutation.isPending ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : selectedCarousel ? (
                "Update"
              ) : (
                "Create"
              )}
            </GradientButton>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: RED_COLOR,
            fontWeight: 600,
            fontSize: "1rem",
            py: 2,
            px: 3,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <DeleteIcon fontSize="small" />
            Confirm Delete
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 1 }}>
          <DialogContentText sx={{ color: alpha(TEXT_PRIMARY, 0.8) }}>
            Are you sure you want to delete the carousel{" "}
            <strong>"{carouselToDelete?.title}"</strong>? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <OutlineButton
            onClick={() => setOpenDeleteDialog(false)}
            size="small"
          >
            Cancel
          </OutlineButton>
          <Button
            variant="contained"
            sx={{
              background: `linear-gradient(135deg, ${RED_DARK} 0%, ${RED_COLOR} 100%)`,
              color: "white",
              borderRadius: 1,
              padding: "4px 16px",
              fontWeight: 500,
              fontSize: "0.8rem",
              textTransform: "none",
              "&:hover": {
                background: `linear-gradient(135deg, ${RED_COLOR} 0%, ${RED_DARK} 100%)`,
              },
            }}
            onClick={handleDeleteConfirm}
            disabled={deleteCarouselMutation.isPending}
            startIcon={<DeleteIcon fontSize="small" />}
            size="small"
          >
            {deleteCarouselMutation.isPending ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          sx={{
            width: "100%",
            borderRadius: 1,
            backgroundColor: alpha(GREEN_COLOR, 0.1),
            borderLeft: `3px solid ${GREEN_COLOR}`,
            color: TEXT_PRIMARY,
          }}
        >
          <Typography fontWeight={500} sx={{ fontSize: "0.8rem" }}>
            {success}
          </Typography>
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            borderRadius: 1,
            backgroundColor: alpha(RED_COLOR, 0.1),
            borderLeft: `3px solid ${RED_COLOR}`,
            color: TEXT_PRIMARY,
          }}
        >
          <Typography fontWeight={500} sx={{ fontSize: "0.8rem" }}>
            {error}
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};