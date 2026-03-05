import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  alpha,
  useTheme,
  CircularProgress,
  Avatar,
  FormHelperText,
  Button,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Pets as PetsIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  CloudUpload,
  Image as ImageIcon,
  AddPhotoAlternate,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { styled } from "@mui/material/styles";

import axiosInstance from "../../api/axios";
import GradientButton from "../../components/ui/GradientButton";
import OutlineButton from "../../components/ui/OutlineButton";
import StyledTextField from "../../components/ui/StyledTextField";
import { useAlert } from "../../components/ui/AlertProvider";

// Cloudinary Configuration
const CLOUD_NAME = "ddh86gfrm";
const UPLOAD_PRESET = "ml_default";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_GALLERY_IMAGES = 4;

const DropzoneWrapper = styled("div")(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
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
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  boxShadow: theme.shadows[1],
}));

const RequiredAsterisk = styled("span")(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: 1,
}));

// Default form values
const defaultFormValues = {
  name: "",
  age: "",
  breed: "",
  about: "",
  gender: "",
  neutered: false,
  vaccinated: false,
  size: "medium",
  featuredImage: "",
  gallery: [],
};

export default function CatsManagement() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { addAlert } = useAlert();

  const BLUE_COLOR = theme.palette.primary.main;
  const RED_COLOR = theme.palette.error.main;
  const GREEN_COLOR = theme.palette.success.main;
  const TEXT_PRIMARY = theme.palette.text.primary;

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // "create", "edit", "view"
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Form states for images
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredPreview, setFeaturedPreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [editFormDirty, setEditFormDirty] = useState(false);

  // React Hook Form with Controller
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  // Watch form values
  const formValues = watch();

  // Fetch cats data
  const { data: cats = [], isLoading } = useQuery({
    queryKey: ["cats"],
    queryFn: async () => {
      const response = await axiosInstance.get("/cats");
      return response.data.cats || response.data.data || response.data;
    },
  });

  const paginatedCats = cats.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Dropzone for featured image
  const featuredDropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFeaturedImage(file);
        setFeaturedPreview(URL.createObjectURL(file));
        setEditFormDirty(true);
      }
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

  // Dropzone for gallery images
  const galleryDropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      const remainingSlots = MAX_GALLERY_IMAGES - galleryImages.length;
      if (acceptedFiles.length > remainingSlots) {
        addAlert("error", `You can only add ${remainingSlots} more image(s)`);
        return;
      }

      const newFiles = [...galleryImages, ...acceptedFiles];
      const newPreviews = [
        ...galleryPreviews,
        ...acceptedFiles.map((file) => URL.createObjectURL(file)),
      ];
      setGalleryImages(newFiles);
      setGalleryPreviews(newPreviews);
      setEditFormDirty(true);
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

  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(progress);
        },
      });
      return response.data.secure_url;
    } catch (error) {
      addAlert("error", "Image upload failed. Please try again.");
      return null;
    }
  };

  const handleRemoveFeatured = () => {
    if (featuredPreview) URL.revokeObjectURL(featuredPreview);
    setFeaturedImage(null);
    setFeaturedPreview(null);
    setValue("featuredImage", "");
    setEditFormDirty(true);
  };

  const handleRemoveGallery = (index) => {
    if (galleryPreviews[index]) URL.revokeObjectURL(galleryPreviews[index]);
    const newImages = galleryImages.filter((_, i) => i !== index);
    const newPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGalleryImages(newImages);
    setGalleryPreviews(newPreviews);
    setEditFormDirty(true);
  };

  const resetForm = () => {
    reset(defaultFormValues);
    setFeaturedImage(null);
    if (featuredPreview) URL.revokeObjectURL(featuredPreview);
    setFeaturedPreview(null);
    galleryPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setGalleryImages([]);
    setGalleryPreviews([]);
    setEditFormDirty(false);
    setUploadProgress(0);
  };

  const handleOpenModal = (mode, cat = null) => {
    setModalMode(mode);
    
    if (cat) {
      setSelectedCat(cat);
      // Reset form with cat data
      reset({
        name: cat.name || "",
        age: cat.age || "",
        breed: cat.breed || "",
        about: cat.about || "",
        gender: cat.gender || "",
        neutered: cat.neutered || false,
        vaccinated: cat.vaccinated || false,
        size: cat.size || "medium",
        featuredImage: cat.featuredImage || "",
        gallery: cat.gallery || [],
      });
      
      // Set image previews from existing URLs
      if (cat.featuredImage) {
        setFeaturedPreview(cat.featuredImage);
      }
      if (cat.gallery && cat.gallery.length > 0) {
        setGalleryPreviews(cat.gallery);
      }
    } else {
      setSelectedCat(null);
      reset(defaultFormValues);
    }
    
    setEditFormDirty(false);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCat(null);
    resetForm();
  };

  const handleDeleteClick = (cat) => {
    setCatToDelete(cat);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (catToDelete) deleteCatMutation.mutate(catToDelete._id);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCatToDelete(null);
  };

  // Mutations
  const createCatMutation = useMutation({
    mutationFn: async (catData) => {
      const response = await axiosInstance.post("/cats", catData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] });
      addAlert("success", "Cat profile created successfully!");
      handleCloseModal();
    },
    onError: (error) => {
      addAlert("error", error.response?.data?.message || "Failed to create cat profile. Please try again.");
    },
  });

  const updateCatMutation = useMutation({
    mutationFn: async ({ id, catData }) => {
      const response = await axiosInstance.put(`/cats/${id}`, catData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] });
      addAlert("success", "Cat profile updated successfully!");
      handleCloseModal();
    },
    onError: (error) => {
      addAlert("error", error.response?.data?.message || "Failed to update cat profile. Please try again.");
    },
  });

  const deleteCatMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/cats/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] });
      addAlert("success", "Cat profile deleted successfully!");
      setDeleteDialogOpen(false);
      setCatToDelete(null);
    },
    onError: (error) => {
      addAlert("error", error.response?.data?.message || "Failed to delete cat profile. Please try again.");
      setDeleteDialogOpen(false);
      setCatToDelete(null);
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);

      // Upload featured image if new one is selected
      let featuredImageUrl = data.featuredImage;
      if (featuredImage) {
        const uploadedUrl = await uploadToCloudinary(featuredImage);
        if (!uploadedUrl) return;
        featuredImageUrl = uploadedUrl;
      }

      // Upload gallery images if new ones are selected
      let galleryUrls = data.gallery || [];
      if (galleryImages.length > 0) {
        const uploadedUrls = await Promise.all(
          galleryImages.map((file) => uploadToCloudinary(file))
        );
        galleryUrls = [...galleryUrls, ...uploadedUrls.filter((url) => url !== null)];
      }

      const catData = {
        name: data.name,
        age: data.age,
        breed: data.breed,
        about: data.about,
        gender: data.gender,
        neutered: data.neutered,
        vaccinated: data.vaccinated,
        size: data.size,
        featuredImage: featuredImageUrl,
        gallery: galleryUrls,
      };

      if (modalMode === "edit" && selectedCat) {
        updateCatMutation.mutate({ id: selectedCat._id, catData });
      } else {
        createCatMutation.mutate(catData);
      }
    } catch (error) {
      addAlert("error", "Failed to save cat profile. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getGenderIcon = (gender) => {
    return gender === "female" ? (
      <FemaleIcon sx={{ color: RED_COLOR, fontSize: 18 }} />
    ) : (
      <MaleIcon sx={{ color: BLUE_COLOR, fontSize: 18 }} />
    );
  };

  const isSubmitDisabled = () => {
    if (isUploading || createCatMutation.isPending || updateCatMutation.isPending) return true;
    if (modalMode === "create") {
      return !isValid || !featuredPreview;
    }
    return !editFormDirty && !isDirty;
  };

  return (
    <Box>
      <Helmet>
        <title>Cat Management - PetCare</title>
        <meta name="description" content="Manage your cat profiles" />
      </Helmet>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: TEXT_PRIMARY, fontWeight: 600 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: TEXT_PRIMARY }}>
            Are you sure you want to delete "{catToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <OutlineButton onClick={handleDeleteCancel} size="small" disabled={deleteCatMutation.isPending}>
            Cancel
          </OutlineButton>
          <Button
            onClick={handleDeleteConfirm}
            size="small"
            variant="contained"
            color="error"
            disabled={deleteCatMutation.isPending}
          >
            {deleteCatMutation.isPending ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: TEXT_PRIMARY }}>
            Cat Management
          </Typography>
          <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>
            Manage your cat profiles
          </Typography>
        </Box>
        <GradientButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal("create")}
          size="small"
        >
          Add New Cat
        </GradientButton>
      </Box>

      {/* Cats Table */}
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
            <TableRow sx={{ backgroundColor: alpha(BLUE_COLOR, 0.05) }}>
              {["Image", "Name", "Gender", "Age", "Breed", "Status", "Gallery"].map((label) => (
                <TableCell
                  key={label}
                  sx={{ fontWeight: 600, color: TEXT_PRIMARY, borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}
                >
                  {label}
                </TableCell>
              ))}
              <TableCell
                align="right"
                sx={{ fontWeight: 600, color: TEXT_PRIMARY, borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} sx={{ color: BLUE_COLOR }} />
                </TableCell>
              </TableRow>
            ) : paginatedCats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Box>
                    <PetsIcon sx={{ fontSize: 48, color: alpha(TEXT_PRIMARY, 0.2), mb: 1 }} />
                    <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>
                      No cat profiles found. Add one to get started.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCats.map((cat) => (
                <TableRow
                  key={cat._id}
                  hover
                  sx={{
                    "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.03) },
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell sx={{ py: 1 }}>
                    {cat.featuredImage ? (
                      <Avatar
                        src={cat.featuredImage}
                        alt={cat.name}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          cursor: "pointer",
                        }}
                        onClick={() => handleOpenModal("view", cat)}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: alpha(BLUE_COLOR, 0.05),
                          borderRadius: 1,
                          border: `1px dashed ${theme.palette.divider}`,
                        }}
                      >
                        <ImageIcon sx={{ fontSize: 20, color: alpha(TEXT_PRIMARY, 0.3) }} />
                      </Box>
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>
                      {cat.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {getGenderIcon(cat.gender)}
                      <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                        {cat.gender}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Typography variant="body2">{cat.age}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Typography variant="body2">{cat.breed}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {cat.neutered && (
                        <Chip
                          label="Neutered"
                          size="small"
                          sx={{ fontSize: "0.7rem", height: 20, backgroundColor: alpha(GREEN_COLOR, 0.1), color: GREEN_COLOR }}
                        />
                      )}
                      {cat.vaccinated && (
                        <Chip
                          label="Vaccinated"
                          size="small"
                          sx={{ fontSize: "0.7rem", height: 20, backgroundColor: alpha(BLUE_COLOR, 0.1), color: BLUE_COLOR }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <ImageIcon sx={{ fontSize: 16, color: alpha(TEXT_PRIMARY, 0.5) }} />
                      <Typography variant="caption">
                        {cat.gallery?.length || 0}/{MAX_GALLERY_IMAGES}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenModal("view", cat)}
                      sx={{ color: BLUE_COLOR, mr: 0.5, "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.1) } }}
                      title="View Details"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenModal("edit", cat)}
                      sx={{ color: BLUE_COLOR, mr: 0.5, "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.1) } }}
                      title="Edit Cat"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(cat)}
                      sx={{ color: RED_COLOR, "&:hover": { backgroundColor: alpha(RED_COLOR, 0.1) } }}
                      title="Delete Cat"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={cats.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
        />
      </TableContainer>

      {/* Create/Edit/View Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            backgroundColor: theme.palette.background.paper,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle sx={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: "1rem", py: 2, px: 3 }}>
          {modalMode === "create" && "Add New Cat"}
          {modalMode === "edit" && "Edit Cat Profile"}
          {modalMode === "view" && "Cat Details"}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ px: 3, py: 2 }}>
            <Grid container spacing={3}>
              {/* Left Column - Images */}
              <Grid size={{ xs: 12, md: 5 }}>
                {/* Featured Image */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>
                      Featured Image
                    </Typography>
                    {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                  </Box>

                  {modalMode !== "view" ? (
                    <>
                      <DropzoneWrapper {...featuredDropzone.getRootProps()} className={featuredDropzone.isDragActive ? "active" : ""}>
                        <input {...featuredDropzone.getInputProps()} />
                        <CloudUpload sx={{ fontSize: 32, color: BLUE_COLOR, mb: 1 }} />
                        <Typography variant="body2" sx={{ color: TEXT_PRIMARY }}>
                          {featuredDropzone.isDragActive ? "Drop the image here" : "Click or drag to upload"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>
                          Max 5MB • JPG, PNG, WEBP
                        </Typography>
                      </DropzoneWrapper>

                      {(featuredPreview || formValues.featuredImage) && (
                        <PreviewWrapper>
                          <img
                            src={featuredPreview || formValues.featuredImage}
                            alt="Featured"
                            style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
                          />
                          <IconButton
                            onClick={handleRemoveFeatured}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              bgcolor: RED_COLOR,
                              color: "white",
                              "&:hover": { bgcolor: alpha(RED_COLOR, 0.8) },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </PreviewWrapper>
                      )}
                    </>
                  ) : (
                    formValues.featuredImage && (
                      <PreviewWrapper>
                        <img
                          src={formValues.featuredImage}
                          alt={formValues.name}
                          style={{ width: "100%", maxHeight: 250, objectFit: "cover", borderRadius: 4 }}
                        />
                      </PreviewWrapper>
                    )
                  )}
                </Box>

                {/* Gallery Images */}
                <Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>
                      Gallery Images ({modalMode !== "view" ? galleryPreviews.length : formValues.gallery?.length || 0}/{MAX_GALLERY_IMAGES})
                    </Typography>
                  </Box>

                  <Grid container spacing={1}>
                    {/* Show existing or new gallery images */}
                    {(modalMode !== "view" ? galleryPreviews : formValues.gallery || []).map((image, index) => (
                      <Grid size={{ xs: 6 }} key={index}>
                        <Box sx={{ position: "relative" }}>
                          <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            style={{
                              width: "100%",
                              height: 100,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                          {modalMode !== "view" && (
                            <IconButton
                              onClick={() => handleRemoveGallery(index)}
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                bgcolor: RED_COLOR,
                                color: "white",
                                "&:hover": { bgcolor: alpha(RED_COLOR, 0.8) },
                                width: 24,
                                height: 24,
                              }}
                            >
                              <DeleteIcon fontSize="small" sx={{ fontSize: 16 }} />
                            </IconButton>
                          )}
                        </Box>
                      </Grid>
                    ))}

                    {/* Add more gallery images button */}
                    {modalMode !== "view" && galleryPreviews.length < MAX_GALLERY_IMAGES && (
                      <Grid size={{ xs: 6 }}>
                        <Box
                          {...galleryDropzone.getRootProps()}
                          sx={{
                            border: `2px dashed ${theme.palette.primary.main}`,
                            borderRadius: 1,
                            height: 100,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            bgcolor: alpha(BLUE_COLOR, 0.02),
                            "&:hover": {
                              bgcolor: alpha(BLUE_COLOR, 0.05),
                            },
                          }}
                        >
                          <input {...galleryDropzone.getInputProps()} />
                          <AddPhotoAlternate sx={{ color: BLUE_COLOR, fontSize: 24 }} />
                          <Typography variant="caption" sx={{ textAlign: "center", px: 0.5 }}>
                            Add Image
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {isUploading && (
                  <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                    <CircularProgress
                      variant="determinate"
                      value={uploadProgress}
                      size={24}
                    />
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      Uploading: {uploadProgress}%
                    </Typography>
                  </Box>
                )}
              </Grid>

              {/* Right Column - Cat Information */}
              <Grid size={{ xs: 12, md: 7 }}>
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
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5, color: TEXT_PRIMARY }}>
                    Cat Information
                  </Typography>

                  <Grid container spacing={2}>
                    {/* Name */}
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ mb: 0.5 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>
                          Name
                        </Typography>
                        {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                      </Box>
                      <Controller
                        name="name"
                        control={control}
                        rules={{ 
                          required: "Name is required",
                          minLength: { value: 2, message: "Name must be at least 2 characters" }
                        }}
                        render={({ field }) => (
                          <StyledTextField
                            {...field}
                            fullWidth
                            size="small"
                            disabled={modalMode === "view"}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            placeholder="Enter cat's name"
                            onChange={(e) => {
                              field.onChange(e);
                              setEditFormDirty(true);
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Gender */}
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ mb: 0.5 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>
                          Gender
                        </Typography>
                        {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                      </Box>
                      <Controller
                        name="gender"
                        control={control}
                        rules={{ required: "Gender is required" }}
                        render={({ field }) => (
                          <FormControl fullWidth size="small" error={!!errors.gender} disabled={modalMode === "view"}>
                            <Select
                              {...field}
                              displayEmpty
                              onChange={(e) => {
                                field.onChange(e);
                                setEditFormDirty(true);
                              }}
                            >
                              <MenuItem value="" disabled>Select gender</MenuItem>
                              <MenuItem value="female">Female</MenuItem>
                              <MenuItem value="male">Male</MenuItem>
                            </Select>
                            {errors.gender && (
                              <FormHelperText>{errors.gender.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>

                    {/* Neutered */}
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ mb: 0.5 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>
                          Neutered
                        </Typography>
                      </Box>
                      <Controller
                        name="neutered"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch
                                {...field}
                                checked={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.checked);
                                  setEditFormDirty(true);
                                }}
                                disabled={modalMode === "view"}
                                color="primary"
                                size="small"
                              />
                            }
                            label={field.value ? "Yes" : "No"}
                          />
                        )}
                      />
                    </Grid>

                    {/* Age */}
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ mb: 0.5 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>
                          Age
                        </Typography>
                        {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                      </Box>
                      <Controller
                        name="age"
                        control={control}
                        rules={{ required: "Age is required" }}
                        render={({ field }) => (
                          <StyledTextField
                            {...field}
                            fullWidth
                            size="small"
                            disabled={modalMode === "view"}
                            error={!!errors.age}
                            helperText={errors.age?.message}
                            placeholder="e.g., 2 Years"
                            onChange={(e) => {
                              field.onChange(e);
                              setEditFormDirty(true);
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Breed */}
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ mb: 0.5 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>
                          Breed
                        </Typography>
                        {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                      </Box>
                      <Controller
                        name="breed"
                        control={control}
                        rules={{ required: "Breed is required" }}
                        render={({ field }) => (
                          <StyledTextField
                            {...field}
                            fullWidth
                            size="small"
                            disabled={modalMode === "view"}
                            error={!!errors.breed}
                            helperText={errors.breed?.message}
                            placeholder="Enter breed"
                            onChange={(e) => {
                              field.onChange(e);
                              setEditFormDirty(true);
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Vaccinated */}
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ mb: 0.5 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>
                          Vaccinated
                        </Typography>
                      </Box>
                      <Controller
                        name="vaccinated"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch
                                {...field}
                                checked={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.checked);
                                  setEditFormDirty(true);
                                }}
                                disabled={modalMode === "view"}
                                color="primary"
                                size="small"
                              />
                            }
                            label={field.value ? "Yes" : "No"}
                          />
                        )}
                      />
                    </Grid>

                    {/* Size */}
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ mb: 0.5 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>
                          Size
                        </Typography>
                      </Box>
                      <Controller
                        name="size"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth size="small" disabled={modalMode === "view"}>
                            <Select
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setEditFormDirty(true);
                              }}
                            >
                              <MenuItem value="small">Small</MenuItem>
                              <MenuItem value="medium">Medium</MenuItem>
                              <MenuItem value="large">Large</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>

                    {/* About Section */}
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ mb: 0.5 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>
                          About
                        </Typography>
                      </Box>
                      {modalMode !== "view" ? (
                        <Controller
                          name="about"
                          control={control}
                          render={({ field }) => (
                            <StyledTextField
                              {...field}
                              fullWidth
                              multiline
                              rows={4}
                              disabled={modalMode === "view"}
                              placeholder="Write a description about the cat..."
                              onChange={(e) => {
                                field.onChange(e);
                                setEditFormDirty(true);
                              }}
                            />
                          )}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.8), mt: 1 }}>
                          {formValues.about || "No description provided."}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <OutlineButton onClick={handleCloseModal} size="small">
              {modalMode === "view" ? "Close" : "Cancel"}
            </OutlineButton>

            {modalMode !== "view" && (
              <GradientButton type="submit" size="small" disabled={isSubmitDisabled()}>
                {isUploading || createCatMutation.isPending || updateCatMutation.isPending ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : modalMode === "create" ? (
                  "Add Cat"
                ) : (
                  "Update Cat"
                )}
              </GradientButton>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}