import React, { useState, useMemo, useCallback } from "react";
import {
  Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Chip, CircularProgress, Switch, FormControlLabel,
  Tooltip, DialogContentText, alpha, TablePagination, useTheme,
  Grid, FormHelperText, styled,
} from "@mui/material";
import {
  Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon,
  Image as ImageIcon, Search as SearchIcon, CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useDropzone } from "react-dropzone";
import axiosInstance from "../../api/axios";
import GradientButton from "../../components/ui/GradientButton";
import OutlineButton from "../../components/ui/OutlineButton";
import StyledTextField from "../../components/ui/StyledTextField";
import { useAlert } from "../../components/ui/AlertProvider";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const RequiredAsterisk = styled("span")(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: 1,
}));

export const HomeCarousel = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { addAlert } = useAlert();

  const BLUE_COLOR = theme.palette.primary.main;
  const RED_COLOR = theme.palette.error.main;
  const RED_DARK = theme.palette.error.dark || theme.palette.error.main;
  const GREEN_COLOR = theme.palette.success.main;
  const TEXT_PRIMARY = theme.palette.text.primary;

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCarousel, setSelectedCarousel] = useState(null);
  const [carouselToDelete, setCarouselToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [touchedImage, setTouchedImage] = useState(false);
  const [editFormDirty, setEditFormDirty] = useState(false);

  const markDirty = () => { if (selectedCarousel) setEditFormDirty(true); };

  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm({
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

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) { addAlert("error", "File size exceeds 5MB limit"); return; }
    if (!file.type.match("image.*")) { addAlert("error", "Only image files are allowed"); return; }
    if (imagePreview && imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setTouchedImage(true);
    markDirty();
  }, [selectedCarousel, imagePreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop,
    onDropRejected: (rejectedFiles) => {
      const file = rejectedFiles[0];
      let message = "File rejected";
      if (file.errors.some(e => e.code === "file-too-large")) message = "File is too large (max 5MB)";
      else if (file.errors.some(e => e.code === "file-invalid-type")) message = "Invalid file type.";
      addAlert("error", message);
    },
  });

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setTouchedImage(true);
    markDirty();
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
    return carousels.filter(c =>
      c.title?.toLowerCase().includes(query) ||
      c.smallTitle?.toLowerCase().includes(query) ||
      c.paragraph?.toLowerCase().includes(query)
    );
  }, [carousels, searchQuery]);

  const paginatedCarousels = useMemo(() =>
    filteredCarousels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredCarousels, page, rowsPerPage]
  );

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  const buildFormData = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("smallTitle", data.smallTitle || "");
    formData.append("paragraph", data.paragraph);
    formData.append("btnText", data.btnText || "Learn More");
    formData.append("btnLink", data.btnLink || "#");
    formData.append("isActive", data.isActive);
    // Only send order on edit
    if (selectedCarousel && data.order !== "") {
      formData.append("order", data.order);
    }
    if (imageFile) formData.append("image", imageFile);
    return formData;
  };

  const createCarouselMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post("/carousel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] });
      addAlert("success", "Carousel created successfully!");
      setOpenDialog(false);
      resetForm();
      setPage(0);
    },
    onError: (err) => { addAlert("error", err.response?.data?.message || "Failed to create carousel"); },
  });

  const updateCarouselMutation = useMutation({
    mutationFn: async ({ carouselId, formData }) => {
      const response = await axiosInstance.put(`/carousel/${carouselId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] });
      addAlert("success", "Carousel updated successfully!");
      setOpenDialog(false);
      resetForm();
    },
    onError: (err) => { addAlert("error", err.response?.data?.message || "Failed to update carousel"); },
  });

  const deleteCarouselMutation = useMutation({
    mutationFn: async (carouselId) => {
      const response = await axiosInstance.delete(`/carousel/${carouselId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] });
      addAlert("success", "Carousel deleted successfully!");
      setOpenDeleteDialog(false);
      setCarouselToDelete(null);
      if (paginatedCarousels.length === 1 && page > 0) setPage(page - 1);
    },
    onError: (err) => {
      addAlert("error", err.response?.data?.message || "Failed to delete carousel");
      setOpenDeleteDialog(false);
      setCarouselToDelete(null);
    },
  });

  const handleOpenDialog = (carousel = null) => {
    setEditFormDirty(false);
    setTouchedImage(false);
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
      setImageFile(null);
    } else {
      setSelectedCarousel(null);
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => { setOpenDialog(false); setSelectedCarousel(null); resetForm(); };
  const handleDeleteClick = (carousel) => { setCarouselToDelete(carousel); setOpenDeleteDialog(true); };
  const handleDeleteConfirm = () => { if (carouselToDelete) deleteCarouselMutation.mutate(carouselToDelete._id); };

  const resetForm = () => {
    reset({ title: "", smallTitle: "", paragraph: "", btnText: "Learn More", btnLink: "#", order: "", isActive: true });
    if (imagePreview && imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setSelectedCarousel(null);
    setTouchedImage(false);
    setEditFormDirty(false);
  };

  const onSubmit = (data) => {
    if (!selectedCarousel && !imageFile) { addAlert("error", "Please select an image"); return; }
    const formData = buildFormData(data);
    if (selectedCarousel) {
      updateCarouselMutation.mutate({ carouselId: selectedCarousel._id, formData });
    } else {
      createCarouselMutation.mutate(formData);
    }
  };

  const isSubmitDisabled = () => {
    if (createCarouselMutation.isPending || updateCarouselMutation.isPending) return true;
    if (selectedCarousel) return !editFormDirty;
    return !isValid || !imageFile;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2, mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '1rem' }}>Carousel Management</Typography>
          <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>Manage homepage carousel slides and content</Typography>
        </Box>
        <GradientButton variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} size="small">
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
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: TEXT_PRIMARY, fontSize: "0.9rem", opacity: 0.7 }} /> }}
          size="small"
          sx={{ "& .MuiInputBase-input": { fontSize: "0.8rem", color: TEXT_PRIMARY } }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 1, border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: alpha(BLUE_COLOR, 0.05) }}>
              {["Image", "Title", "Order", "Status"].map(label => (
                <TableCell key={label} sx={{ fontWeight: 600, color: TEXT_PRIMARY, borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>{label}</TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600, color: TEXT_PRIMARY, borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCarousels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Box>
                    <ImageIcon sx={{ fontSize: 48, color: alpha(TEXT_PRIMARY, 0.2), mb: 1 }} />
                    <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>
                      {searchQuery ? "No carousels found." : "No carousels yet. Create one to get started."}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : paginatedCarousels.map(carousel => (
              <TableRow key={carousel._id} hover sx={{ "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.03) }, "&:last-child td": { borderBottom: 0 } }}>
                <TableCell sx={{ py: 1 }}>
                  {carousel.image ? (
                    <Box component="img" src={carousel.image} alt={carousel.title} onClick={() => handleOpenDialog(carousel)}
                      sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 0.5, border: `1px solid ${theme.palette.divider}`, cursor: "pointer", "&:hover": { opacity: 0.8 } }} />
                  ) : (
                    <Box sx={{ width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: alpha(BLUE_COLOR, 0.05), borderRadius: 0.5, border: `1px dashed ${theme.palette.divider}` }}>
                      <ImageIcon sx={{ fontSize: 24, color: alpha(TEXT_PRIMARY, 0.3) }} />
                    </Box>
                  )}
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>{carousel.title}</Typography>
                  <Typography variant="caption" sx={{ display: "block", color: alpha(TEXT_PRIMARY, 0.7) }}>{carousel.smallTitle}</Typography>
                  {carousel.paragraph && (
                    <Typography variant="caption" sx={{ display: "block", color: alpha(TEXT_PRIMARY, 0.6), mt: 0.5 }}>
                      {carousel.paragraph.substring(0, 60)}{carousel.paragraph.length > 60 && "..."}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Chip
                    label={`#${carousel.order}`}
                    size="small"
                    sx={{ fontWeight: 600, fontSize: "0.75rem", height: 22, backgroundColor: alpha(BLUE_COLOR, 0.08), color: BLUE_COLOR }}
                  />
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Chip
                    label={carousel.isActive ? "Active" : "Inactive"}
                    size="small"
                    icon={carousel.isActive ? <CheckCircleIcon sx={{ fontSize: "0.8rem" }} /> : undefined}
                    sx={{ fontWeight: 500, fontSize: "0.75rem", height: 24, backgroundColor: carousel.isActive ? alpha(GREEN_COLOR, 0.1) : alpha(TEXT_PRIMARY, 0.05), color: carousel.isActive ? GREEN_COLOR : alpha(TEXT_PRIMARY, 0.7), borderColor: carousel.isActive ? alpha(GREEN_COLOR, 0.3) : alpha(TEXT_PRIMARY, 0.2) }}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right" sx={{ py: 1 }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleOpenDialog(carousel)} sx={{ color: BLUE_COLOR, mr: 0.5, "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.1) } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDeleteClick(carousel)} sx={{ color: RED_COLOR, "&:hover": { backgroundColor: alpha(RED_COLOR, 0.1) } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={filteredCarousels.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} sx={{ borderTop: `1px solid ${theme.palette.divider}` }} />
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1, backgroundColor: theme.palette.background.paper } }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: "1rem", py: 2, px: 3 }}>
            {selectedCarousel ? "Edit Carousel" : "Add New Carousel"}
          </DialogTitle>

          <DialogContent sx={{ px: 3, py: 2 }}>
            <Grid container spacing={3}>

              {/* Left - Form Fields */}
              <Grid size={{ md: 8 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                  {/* Title */}
                  <Box>
                    <Box sx={{ mb: 0.5 }}>
                      <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Title</Typography>
                      {!selectedCarousel && <RequiredAsterisk>*</RequiredAsterisk>}
                    </Box>
                    <Controller name="title" control={control}
                      rules={{ ...(!selectedCarousel && { required: "Title is required" }), minLength: { value: 3, message: "Title must be at least 3 characters" } }}
                      render={({ field }) => (
                        <StyledTextField {...field} onChange={(e) => { field.onChange(e); markDirty(); }}
                          fullWidth size="small" error={!!errors.title} helperText={errors.title?.message} placeholder="Enter carousel title" />
                      )} />
                  </Box>

                  {/* Small Title */}
                  <Box>
                    <Box sx={{ mb: 0.5 }}>
                      <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Small Title</Typography>
                      {!selectedCarousel && <RequiredAsterisk>*</RequiredAsterisk>}
                    </Box>
                    <Controller name="smallTitle" control={control}
                      rules={{ ...(!selectedCarousel && { required: "Small title is required" }) }}
                      render={({ field }) => (
                        <StyledTextField {...field} onChange={(e) => { field.onChange(e); markDirty(); }}
                          fullWidth size="small" error={!!errors.smallTitle} helperText={errors.smallTitle?.message} placeholder="Enter small title/subtitle" />
                      )} />
                  </Box>

                  {/* Description */}
                  <Box>
                    <Box sx={{ mb: 0.5 }}>
                      <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Description</Typography>
                      {!selectedCarousel && <RequiredAsterisk>*</RequiredAsterisk>}
                    </Box>
                    <Controller name="paragraph" control={control}
                      rules={{ ...(!selectedCarousel && { required: "Description is required" }), minLength: { value: 10, message: "Description must be at least 10 characters" } }}
                      render={({ field }) => (
                        <StyledTextField {...field} onChange={(e) => { field.onChange(e); markDirty(); }}
                          fullWidth multiline rows={3} size="small" error={!!errors.paragraph} helperText={errors.paragraph?.message} placeholder="Enter carousel description" />
                      )} />
                  </Box>

                  {/* Button Text */}
                  <Box>
                    <Box sx={{ mb: 0.5 }}>
                      <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Button Text</Typography>
                      {!selectedCarousel && <RequiredAsterisk>*</RequiredAsterisk>}
                    </Box>
                    <Controller name="btnText" control={control}
                      rules={{ ...(!selectedCarousel && { required: "Button text is required" }) }}
                      render={({ field }) => (
                        <StyledTextField {...field} onChange={(e) => { field.onChange(e); markDirty(); }}
                          fullWidth size="small" error={!!errors.btnText} helperText={errors.btnText?.message} placeholder="Enter button text (e.g., Learn More)" />
                      )} />
                  </Box>

                  {/* Button Link */}
                  <Box>
                    <Box sx={{ mb: 0.5 }}>
                      <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Button Link</Typography>
                      {!selectedCarousel && <RequiredAsterisk>*</RequiredAsterisk>}
                    </Box>
                    <Controller name="btnLink" control={control}
                      rules={{
                        ...(!selectedCarousel && { required: "Button link is required" }),
                        pattern: { value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$|^[/#]/, message: "Please enter a valid URL" },
                      }}
                      render={({ field }) => (
                        <StyledTextField {...field} onChange={(e) => { field.onChange(e); markDirty(); }}
                          fullWidth size="small" error={!!errors.btnLink} helperText={errors.btnLink?.message} placeholder="Enter button link (e.g., /services or https://example.com)" />
                      )} />
                  </Box>

                  {/* Order — only visible in edit mode */}
                  {selectedCarousel && (
                    <Box>
                      <Box sx={{ mb: 0.5 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Order</Typography>
                      </Box>
                      <Controller name="order" control={control}
                        rules={{ min: { value: 1, message: "Order must be at least 1" } }}
                        render={({ field }) => (
                          <StyledTextField {...field} onChange={(e) => { field.onChange(e); markDirty(); }}
                            fullWidth size="small" type="number" error={!!errors.order}
                            helperText={errors.order?.message || "Change to reorder this slide"}
                            placeholder="Enter display order (1, 2, 3...)" />
                        )} />
                    </Box>
                  )}

                </Box>
              </Grid>

              {/* Right - Settings & Image */}
              <Grid size={{ md: 4 }}>
                <Paper elevation={0} sx={{ p: 2.5, bgcolor: alpha(BLUE_COLOR, 0.02), borderRadius: 1, border: 1, borderColor: theme.palette.divider }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5, color: TEXT_PRIMARY }}>Settings</Typography>

                  {/* Active Status */}
                  <Box sx={{ mb: 2.5 }}>
                    <Controller name="isActive" control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          control={<Switch checked={value} onChange={(e) => { onChange(e); markDirty(); }} color="primary" size="small" />}
                          label={<Typography variant="body2" sx={{ color: TEXT_PRIMARY }}>Active</Typography>}
                        />
                      )} />
                  </Box>

                  {/* Auto order notice — create mode only */}
                  {!selectedCarousel && (
                    <Box sx={{ mb: 2.5, p: 1.5, borderRadius: 1, bgcolor: alpha(BLUE_COLOR, 0.05), border: `1px dashed ${alpha(BLUE_COLOR, 0.3)}` }}>
                      <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.7), display: "block" }}>
                        🔢 <strong>Order</strong> is assigned automatically. You can reorder slides after creation by editing them.
                      </Typography>
                    </Box>
                  )}

                  {/* Image Upload */}
                  <Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Image</Typography>
                      {!selectedCarousel && <RequiredAsterisk>*</RequiredAsterisk>}
                    </Box>
                    <Box {...getRootProps()}
                      sx={{ border: `2px dashed ${isDragActive ? BLUE_COLOR : alpha(TEXT_PRIMARY, 0.2)}`, borderRadius: 1, p: 2, textAlign: "center", cursor: "pointer", backgroundColor: isDragActive ? alpha(BLUE_COLOR, 0.05) : "transparent", transition: "all 0.2s ease", "&:hover": { borderColor: BLUE_COLOR, backgroundColor: alpha(BLUE_COLOR, 0.05) } }}>
                      <input {...getInputProps()} />
                      <CloudUploadIcon sx={{ fontSize: "2rem", color: alpha(TEXT_PRIMARY, 0.5), mb: 1 }} />
                      <Typography variant="caption" sx={{ fontSize: "0.75rem", color: TEXT_PRIMARY, display: "block" }}>
                        {isDragActive ? "Drop the image here" : "Drag & drop image here, or click to select"}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: "0.7rem", color: alpha(TEXT_PRIMARY, 0.5), display: "block", mt: 0.5 }}>
                        Max size: 5MB (JPG, PNG, GIF)
                      </Typography>
                    </Box>

                    {imagePreview && (
                      <Box sx={{ mt: 2, position: "relative" }}>
                        <img src={imagePreview} alt="Preview" style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 4 }} />
                        <IconButton onClick={handleRemoveImage} size="small"
                          sx={{ position: "absolute", top: 4, right: 4, bgcolor: RED_COLOR, color: "white", "&:hover": { bgcolor: alpha(RED_COLOR, 0.8) } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        {imageFile && (
                          <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: alpha(TEXT_PRIMARY, 0.7), fontSize: "0.7rem" }}>
                            Selected: {imageFile.name}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {!selectedCarousel && !imageFile && touchedImage && (
                      <FormHelperText error sx={{ mt: 1 }}>Image is required</FormHelperText>
                    )}
                  </Box>
                </Paper>
              </Grid>

            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <OutlineButton onClick={handleCloseDialog} size="small">Cancel</OutlineButton>
            <GradientButton type="submit" variant="contained" disabled={isSubmitDisabled()} size="small">
              {createCarouselMutation.isPending || updateCarouselMutation.isPending
                ? <CircularProgress size={18} sx={{ color: "white" }} />
                : selectedCarousel ? "Update" : "Create"}
            </GradientButton>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 1, backgroundColor: theme.palette.background.paper } }}>
        <DialogTitle sx={{ color: RED_COLOR, fontWeight: 600, fontSize: "1rem", py: 2, px: 3 }}>
          <Box display="flex" alignItems="center" gap={1}><DeleteIcon fontSize="small" />Confirm Delete</Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 1 }}>
          <DialogContentText sx={{ color: alpha(TEXT_PRIMARY, 0.8) }}>
            Are you sure you want to delete <strong>"{carouselToDelete?.title}"</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <OutlineButton onClick={() => setOpenDeleteDialog(false)} size="small">Cancel</OutlineButton>
          <Button variant="contained"
            sx={{ background: `linear-gradient(135deg, ${RED_DARK} 0%, ${RED_COLOR} 100%)`, color: "white", borderRadius: 1, padding: "4px 16px", fontWeight: 500, fontSize: "0.8rem", textTransform: "none", "&:hover": { background: `linear-gradient(135deg, ${RED_COLOR} 0%, ${RED_DARK} 100%)` } }}
            onClick={handleDeleteConfirm} disabled={deleteCarouselMutation.isPending} startIcon={<DeleteIcon fontSize="small" />} size="small">
            {deleteCarouselMutation.isPending ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};