import React, { useState } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, Grid, FormControlLabel,
  Checkbox, alpha, useTheme, CircularProgress, Avatar, Button,
} from "@mui/material";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Visibility as VisibilityIcon, ShoppingBag as ShoppingBagIcon,
  CloudUpload, Image as ImageIcon, AddPhotoAlternate, Star as StarIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { styled } from "@mui/material/styles";
import axiosInstance from "../../api/axios";
import GradientButton from "../../components/ui/GradientButton";
import OutlineButton from "../../components/ui/OutlineButton";
import StyledTextField from "../../components/ui/StyledTextField";
import { useAlert } from "../../components/ui/AlertProvider";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 4;

const DropzoneWrapper = styled("div")(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create(["background-color", "border-color"]),
  "&:hover": { borderColor: theme.palette.primary.dark, backgroundColor: theme.palette.action.hover },
  "&.active": { borderColor: theme.palette.primary.main, backgroundColor: theme.palette.action.selected },
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

const defaultFormValues = {
  title: "",
  price: "",
  category: "",
  material: "",
  inStock: true,
  isFeatured: false,
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    [{ color: [] }],
    ["clean"],
  ],
};

const quillFormats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link", "color"];

export default function ProductsManagement() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { addAlert } = useAlert();

  const BLUE_COLOR = theme.palette.primary.main;
  const RED_COLOR = theme.palette.error.main;
  const GREEN_COLOR = theme.palette.success.main;
  const TEXT_PRIMARY = theme.palette.text.primary;

  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [description, setDescription] = useState("");
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredPreview, setFeaturedPreview] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [editFormDirty, setEditFormDirty] = useState(false);

  const markDirty = () => { if (modalMode === "edit") setEditFormDirty(true); };

  const { control, handleSubmit, reset, formState: { errors, isValid, isDirty } } = useForm({
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axiosInstance.get("/products");
      return response.data.data || response.data.products || response.data;
    },
  });

  const paginatedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  // Featured image dropzone
  const featuredDropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        if (featuredPreview && featuredPreview.startsWith("blob:")) URL.revokeObjectURL(featuredPreview);
        setFeaturedImageFile(acceptedFiles[0]);
        setFeaturedPreview(URL.createObjectURL(acceptedFiles[0]));
        markDirty();
      }
    },
    onDropRejected: (rejectedFiles) => {
      const err = rejectedFiles[0].errors[0];
      addAlert("error", err.code === "file-too-large" ? "File is too large (max 5MB)" : "Invalid file type.");
    },
  });

  // Gallery dropzone
  const galleryDropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      const remainingSlots = MAX_GALLERY_IMAGES - galleryItems.length;
      if (remainingSlots <= 0) { addAlert("error", "Maximum 4 gallery images allowed"); return; }
      const toAdd = acceptedFiles.slice(0, remainingSlots);
      setGalleryItems(prev => [
        ...prev,
        ...toAdd.map(file => ({ file, preview: URL.createObjectURL(file), isExisting: false })),
      ]);
      markDirty();
    },
    onDropRejected: (rejectedFiles) => {
      const err = rejectedFiles[0].errors[0];
      addAlert("error", err.code === "file-too-large" ? "File is too large (max 5MB)" : "Invalid file type.");
    },
  });

  const handleRemoveFeatured = () => {
    if (featuredPreview && featuredPreview.startsWith("blob:")) URL.revokeObjectURL(featuredPreview);
    setFeaturedImageFile(null);
    setFeaturedPreview(null);
    markDirty();
  };

  const handleRemoveGallery = (index) => {
    setGalleryItems(prev => {
      const item = prev[index];
      if (!item.isExisting) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
    markDirty();
  };

  const resetForm = () => {
    reset(defaultFormValues);
    setDescription("");
    if (featuredPreview && featuredPreview.startsWith("blob:")) URL.revokeObjectURL(featuredPreview);
    setFeaturedImageFile(null);
    setFeaturedPreview(null);
    galleryItems.forEach(item => { if (!item.isExisting) URL.revokeObjectURL(item.preview); });
    setGalleryItems([]);
    setEditFormDirty(false);
  };

  const handleOpenModal = (mode, product = null) => {
    setModalMode(mode);
    setEditFormDirty(false);
    if (product) {
      setSelectedProduct(product);
      reset({
        title: product.title || "",
        price: product.price || "",
        category: product.category || "",
        material: product.material || "",
        inStock: product.inStock !== undefined ? product.inStock : true,
        isFeatured: product.isFeatured || false,
      });
      setDescription(product.description || "");
      setFeaturedPreview(product.featuredImage || null);
      setFeaturedImageFile(null);
      setGalleryItems((product.gallery || []).map(url => ({ file: null, preview: url, isExisting: true })));
    } else {
      setSelectedProduct(null);
      reset(defaultFormValues);
      setDescription("");
      setFeaturedPreview(null);
      setFeaturedImageFile(null);
      setGalleryItems([]);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => { setOpenModal(false); setSelectedProduct(null); resetForm(); };
  const handleDeleteClick = (product) => { setProductToDelete(product); setDeleteDialogOpen(true); };
  const handleDeleteConfirm = () => { if (productToDelete) deleteMutation.mutate(productToDelete._id); };
  const handleDeleteCancel = () => { setDeleteDialogOpen(false); setProductToDelete(null); };

  const buildFormData = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("description", description);
    formData.append("category", data.category || "");
    formData.append("material", data.material || "");
    formData.append("inStock", data.inStock);
    formData.append("isFeatured", data.isFeatured);
    if (featuredImageFile) formData.append("featuredImage", featuredImageFile);
    const existingGalleryUrls = galleryItems.filter(i => i.isExisting).map(i => i.preview);
    formData.append("gallery", JSON.stringify(existingGalleryUrls));
    galleryItems.filter(i => !i.isExisting).forEach(item => formData.append("gallery", item.file));
    return formData;
  };

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      addAlert("success", "Product created successfully!");
      handleCloseModal();
    },
    onError: (error) => { addAlert("error", error.response?.data?.message || "Failed to create product."); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const response = await axiosInstance.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      addAlert("success", "Product updated successfully!");
      handleCloseModal();
    },
    onError: (error) => { addAlert("error", error.response?.data?.message || "Failed to update product."); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      addAlert("success", "Product deleted successfully!");
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    },
    onError: (error) => {
      addAlert("error", error.response?.data?.message || "Failed to delete product.");
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    },
  });

  const onSubmit = (data) => {
    if (!description || description === "<p><br></p>") { addAlert("error", "Description is required."); return; }
    if (modalMode === "create" && !featuredImageFile) { addAlert("error", "Please select a featured image."); return; }
    const formData = buildFormData(data);
    if (modalMode === "edit" && selectedProduct) {
      updateMutation.mutate({ id: selectedProduct._id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSubmitDisabled = () => {
    if (createMutation.isPending || updateMutation.isPending) return true;
    if (modalMode === "create") return !isValid || !description || description === "<p><br></p>" || !featuredImageFile;
    return !editFormDirty && !isDirty;
  };

  return (
    <Box>
      <Helmet>
        <title>Products Management - PetCare</title>
        <meta name="description" content="Manage your products" />
      </Helmet>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 1, backgroundColor: theme.palette.background.paper } }}>
        <DialogTitle sx={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: "1rem", py: 2, px: 3 }}>Confirm Delete</DialogTitle>
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography variant="body2" sx={{ color: TEXT_PRIMARY }}>
            Are you sure you want to delete "<strong>{productToDelete?.title}</strong>"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <OutlineButton onClick={handleDeleteCancel} size="small" disabled={deleteMutation.isPending}>Cancel</OutlineButton>
          <Button onClick={handleDeleteConfirm} size="small" variant="contained" color="error" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: TEXT_PRIMARY }}>Products Management</Typography>
          <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>Manage your product listings</Typography>
        </Box>
        <GradientButton variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal("create")} size="small">
          Add New Product
        </GradientButton>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 1, border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: alpha(BLUE_COLOR, 0.05) }}>
              {["Image", "Title", "Price", "Category", "In Stock", "Featured", "Gallery"].map(label => (
                <TableCell key={label} sx={{ fontWeight: 600, color: TEXT_PRIMARY, borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>{label}</TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600, color: TEXT_PRIMARY, borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}><CircularProgress size={32} sx={{ color: BLUE_COLOR }} /></TableCell></TableRow>
            ) : paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <ShoppingBagIcon sx={{ fontSize: 48, color: alpha(TEXT_PRIMARY, 0.2), mb: 1 }} />
                  <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>No products found. Add one to get started.</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedProducts.map(product => (
              <TableRow key={product._id} hover sx={{ "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.03) }, "&:last-child td": { borderBottom: 0 } }}>

                {/* Image */}
                <TableCell sx={{ py: 1 }}>
                  {product.featuredImage ? (
                    <Avatar src={product.featuredImage} alt={product.title}
                      sx={{ width: 48, height: 48, borderRadius: 1, cursor: "pointer" }}
                      onClick={() => handleOpenModal("view", product)} />
                  ) : (
                    <Box sx={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: alpha(BLUE_COLOR, 0.05), borderRadius: 1, border: `1px dashed ${theme.palette.divider}` }}>
                      <ImageIcon sx={{ fontSize: 20, color: alpha(TEXT_PRIMARY, 0.3) }} />
                    </Box>
                  )}
                </TableCell>

                {/* Title */}
                <TableCell sx={{ py: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>{product.title}</Typography>
                  <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.5) }}>{product.title_id}</Typography>
                </TableCell>

                {/* Price */}
                <TableCell sx={{ py: 1 }}>
                  <Chip label={`$${parseFloat(product.price).toFixed(2)}`} size="small"
                    sx={{ fontWeight: 600, fontSize: "0.75rem", height: 22, backgroundColor: alpha(GREEN_COLOR, 0.1), color: GREEN_COLOR }} />
                </TableCell>

                {/* Category */}
                <TableCell sx={{ py: 1 }}>
                  {product.category ? (
                    <Chip label={product.category} size="small"
                      sx={{ fontWeight: 500, fontSize: "0.75rem", height: 22, backgroundColor: alpha(BLUE_COLOR, 0.08), color: BLUE_COLOR }} />
                  ) : (
                    <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.4) }}>—</Typography>
                  )}
                </TableCell>

                {/* In Stock */}
                <TableCell sx={{ py: 1 }}>
                  <Chip
                    label={product.inStock ? "In Stock" : "Out of Stock"}
                    size="small"
                    sx={{
                      fontWeight: 500, fontSize: "0.75rem", height: 22,
                      backgroundColor: product.inStock ? alpha(GREEN_COLOR, 0.1) : alpha(RED_COLOR, 0.1),
                      color: product.inStock ? GREEN_COLOR : RED_COLOR,
                    }}
                  />
                </TableCell>

                {/* Featured */}
                <TableCell sx={{ py: 1 }}>
                  {product.isFeatured ? (
                    <Chip icon={<StarIcon sx={{ fontSize: "0.8rem !important" }} />} label="Featured" size="small"
                      sx={{ fontWeight: 500, fontSize: "0.75rem", height: 22, backgroundColor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.dark }} />
                  ) : (
                    <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.4) }}>—</Typography>
                  )}
                </TableCell>

                {/* Gallery count */}
                <TableCell sx={{ py: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ImageIcon sx={{ fontSize: 16, color: alpha(TEXT_PRIMARY, 0.5) }} />
                    <Typography variant="caption">{product.gallery?.length || 0}/{MAX_GALLERY_IMAGES}</Typography>
                  </Box>
                </TableCell>

                {/* Actions */}
                <TableCell align="right" sx={{ py: 1 }}>
                  <IconButton size="small" onClick={() => handleOpenModal("view", product)} sx={{ color: BLUE_COLOR, mr: 0.5, "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.1) } }}><VisibilityIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => handleOpenModal("edit", product)} sx={{ color: BLUE_COLOR, mr: 0.5, "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.1) } }}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => handleDeleteClick(product)} sx={{ color: RED_COLOR, "&:hover": { backgroundColor: alpha(RED_COLOR, 0.1) } }}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={products.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} sx={{ borderTop: `1px solid ${theme.palette.divider}` }} />
      </TableContainer>

      {/* Create / Edit / View Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth
        PaperProps={{ sx: { borderRadius: 1, backgroundColor: theme.palette.background.paper, maxHeight: "90vh" } }}>
        <DialogTitle sx={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: "1rem", py: 2, px: 3 }}>
          {modalMode === "create" && "Add New Product"}
          {modalMode === "edit" && "Edit Product"}
          {modalMode === "view" && "Product Details"}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ px: 3, py: 2 }}>
            <Grid container spacing={3}>

              {/* Left — Images */}
              <Grid size={{ xs: 12, md: 5 }}>

                {/* Featured Image */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Featured Image</Typography>
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
                        <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>Max 5MB • JPG, PNG, WEBP</Typography>
                      </DropzoneWrapper>
                      {featuredPreview && (
                        <PreviewWrapper>
                          <img src={featuredPreview} alt="Featured" style={{ width: "100%", maxHeight: 200, objectFit: "cover" }} />
                          <IconButton onClick={handleRemoveFeatured} size="small"
                            sx={{ position: "absolute", top: 8, right: 8, bgcolor: RED_COLOR, color: "white", "&:hover": { bgcolor: alpha(RED_COLOR, 0.8) } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </PreviewWrapper>
                      )}
                    </>
                  ) : (
                    featuredPreview && (
                      <PreviewWrapper>
                        <img src={featuredPreview} alt="Featured" style={{ width: "100%", maxHeight: 250, objectFit: "cover", borderRadius: 4 }} />
                      </PreviewWrapper>
                    )
                  )}
                </Box>

                {/* Gallery */}
                <Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>
                      Gallery ({galleryItems.length}/{MAX_GALLERY_IMAGES})
                    </Typography>
                  </Box>
                  <Grid container spacing={1}>
                    {galleryItems.map((item, index) => (
                      <Grid size={{ xs: 6 }} key={index}>
                        <Box sx={{ position: "relative" }}>
                          <img src={item.preview} alt={`Gallery ${index + 1}`} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 4 }} />
                          {modalMode !== "view" && (
                            <IconButton onClick={() => handleRemoveGallery(index)} size="small"
                              sx={{ position: "absolute", top: 4, right: 4, bgcolor: RED_COLOR, color: "white", "&:hover": { bgcolor: alpha(RED_COLOR, 0.8) }, width: 24, height: 24 }}>
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          )}
                        </Box>
                      </Grid>
                    ))}
                    {modalMode !== "view" && galleryItems.length < MAX_GALLERY_IMAGES && (
                      <Grid size={{ xs: 6 }}>
                        <Box {...galleryDropzone.getRootProps()}
                          sx={{ border: `2px dashed ${theme.palette.primary.main}`, borderRadius: 1, height: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", bgcolor: alpha(BLUE_COLOR, 0.02), "&:hover": { bgcolor: alpha(BLUE_COLOR, 0.05) } }}>
                          <input {...galleryDropzone.getInputProps()} />
                          <AddPhotoAlternate sx={{ color: BLUE_COLOR, fontSize: 24 }} />
                          <Typography variant="caption" sx={{ textAlign: "center", px: 0.5 }}>Add Image</Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Grid>

              {/* Right — Product Info */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Paper elevation={0} sx={{ p: 2.5, bgcolor: alpha(BLUE_COLOR, 0.02), borderRadius: 1, border: 1, borderColor: theme.palette.divider }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5, color: TEXT_PRIMARY }}>Product Information</Typography>
                  <Grid container spacing={2}>

                    {/* Title */}
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ mb: 0.5 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Title</Typography>
                        {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                      </Box>
                      <Controller name="title" control={control}
                        rules={{ required: "Title is required", minLength: { value: 3, message: "Must be at least 3 characters" }, maxLength: { value: 120, message: "Cannot exceed 120 characters" } }}
                        render={({ field }) => (
                          <StyledTextField {...field} fullWidth size="small" disabled={modalMode === "view"}
                            error={!!errors.title} helperText={errors.title?.message} placeholder="Enter product title"
                            onChange={(e) => { field.onChange(e); markDirty(); }} />
                        )} />
                    </Grid>

                    {/* Price */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ mb: 0.5 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Price ($)</Typography>
                        {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                      </Box>
                      <Controller name="price" control={control}
                        rules={{ required: "Price is required", min: { value: 0, message: "Price cannot be negative" } }}
                        render={({ field }) => (
                          <StyledTextField {...field} fullWidth size="small" type="number" disabled={modalMode === "view"}
                            error={!!errors.price} helperText={errors.price?.message} placeholder="e.g. 29.99"
                            onChange={(e) => { field.onChange(e); markDirty(); }} />
                        )} />
                    </Grid>

                    {/* Category */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ mb: 0.5 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Category</Typography>
                      </Box>
                      <Controller name="category" control={control}
                        render={({ field }) => (
                          <StyledTextField {...field} fullWidth size="small" disabled={modalMode === "view"}
                            placeholder="e.g. Food, Toy, Accessory"
                            onChange={(e) => { field.onChange(e); markDirty(); }} />
                        )} />
                    </Grid>

                    {/* Material */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ mb: 0.5 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Material</Typography>
                      </Box>
                      <Controller name="material" control={control}
                        render={({ field }) => (
                          <StyledTextField {...field} fullWidth size="small" disabled={modalMode === "view"}
                            placeholder="e.g. Cotton, Plastic, Leather"
                            onChange={(e) => { field.onChange(e); markDirty(); }} />
                        )} />
                    </Grid>

                    {/* In Stock + Featured checkboxes */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, pt: 0.5 }}>
                        <Controller name="inStock" control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox {...field} checked={field.value}
                                  onChange={(e) => { field.onChange(e.target.checked); markDirty(); }}
                                  disabled={modalMode === "view"} color="primary" size="small" />
                              }
                              label={<Typography variant="body2" sx={{ color: TEXT_PRIMARY }}>In Stock</Typography>}
                            />
                          )} />
                        <Controller name="isFeatured" control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox {...field} checked={field.value}
                                  onChange={(e) => { field.onChange(e.target.checked); markDirty(); }}
                                  disabled={modalMode === "view"} color="primary" size="small" />
                              }
                              label={<Typography variant="body2" sx={{ color: TEXT_PRIMARY }}>Feature this product</Typography>}
                            />
                          )} />
                      </Box>
                    </Grid>

                    {/* Description */}
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ mb: 1 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Description</Typography>
                        {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                      </Box>
                      {modalMode !== "view" ? (
                        <Box sx={{
                          "& .quill": {
                            "& .ql-toolbar": { borderColor: theme.palette.divider, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: alpha(BLUE_COLOR, 0.02) },
                            "& .ql-container": { borderColor: theme.palette.divider, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, minHeight: 150, fontSize: "0.875rem", backgroundColor: theme.palette.background.paper },
                            "& .ql-editor": { minHeight: 150 },
                          },
                        }}>
                          <ReactQuill value={description}
                            onChange={(val) => { setDescription(val); markDirty(); }}
                            theme="snow" modules={quillModules} formats={quillFormats}
                            placeholder="Enter product description..." />
                        </Box>
                      ) : (
                        <Box sx={{ mt: 1, fontSize: "0.875rem", color: alpha(TEXT_PRIMARY, 0.85), "& p": { margin: 0 } }}
                          dangerouslySetInnerHTML={{ __html: description || "<p>No description provided.</p>" }} />
                      )}
                    </Grid>

                  </Grid>
                </Paper>
              </Grid>

            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <OutlineButton onClick={handleCloseModal} size="small">{modalMode === "view" ? "Close" : "Cancel"}</OutlineButton>
            {modalMode !== "view" && (
              <GradientButton type="submit" size="small" disabled={isSubmitDisabled()}>
                {createMutation.isPending || updateMutation.isPending
                  ? <CircularProgress size={18} sx={{ color: "white" }} />
                  : modalMode === "create" ? "Add Product" : "Update Product"}
              </GradientButton>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}