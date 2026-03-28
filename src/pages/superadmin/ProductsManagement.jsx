import React, { useState, useMemo } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, Grid, FormControl, Select,
  MenuItem, FormControlLabel, Switch, alpha, useTheme, CircularProgress,
  Avatar, FormHelperText, Button, Tabs, Tab, Tooltip, Divider, TextField,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Visibility as VisibilityIcon, ShoppingBag as ShoppingBagIcon,
  CloudUpload, Image as ImageIcon, AddPhotoAlternate, Star as StarIcon,
  RateReview as RateReviewIcon, Check as CheckIcon,
  Close as CloseIcon, TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon, Save as SaveIcon,
  AddCircleOutline as AddOptionIcon, RemoveCircleOutline as RemoveOptionIcon,
  Tune as TuneIcon,
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

// ─── Theme Colors ─────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  text: '#1f2937',
  border: '#e5e7eb',
  bg: '#f9fafb',
};

// ─── Styled Components ────────────────────────────────────────────────────────
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

const StatCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  border: `1px solid ${COLORS.border}`,
  borderRadius: 12,
  padding: '20px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-2px)',
  },
}));

const StatIcon = styled(Box)(({ color }) => ({
  width: 44,
  height: 44,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(color, 0.1),
  color: color,
  fontSize: 22,
}));

const StatValue = styled(Typography)({
  fontSize: 20,
  fontWeight: 700,
  color: COLORS.text,
  lineHeight: 1,
  margin: 0,
});

const StatLabel = styled(Typography)({
  fontSize: 12,
  color: '#6b7280',
  marginTop: 4,
  fontWeight: 500,
});

// ─── Constants ────────────────────────────────────────────────────────────────
const defaultFormValues = {
  title: "",
  price: "",
  category: "",
  material: "",
  inStock: true,
  isFeatured: false,
  stock: 0,
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductsManagement() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { addAlert } = useAlert();

  const BLUE_COLOR = theme.palette.primary.main;
  const RED_COLOR = theme.palette.error.main;
  const GREEN_COLOR = theme.palette.success.main;
  const TEXT_PRIMARY = theme.palette.text.primary;

  // ── State ──────────────────────────────────────────────────────────────────
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // create | edit | view
  const [modalTab, setModalTab] = useState(0); // 0=Info, 1=Features, 2=Options, 3=Reviews
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredPreview, setFeaturedPreview] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [editFormDirty, setEditFormDirty] = useState(false);
  
  // ── Stock inline edit state ────────────────────────────────────────────────
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockInputValue, setStockInputValue] = useState("");
  
  // ── Product Options state ──────────────────────────────────────────────────
  const [productOptions, setProductOptions] = useState([]);
  // Each option: { id, name, values: [{id, value, priceModifier}] }

  const markDirty = () => { if (modalMode === "edit") setEditFormDirty(true); };

  const { control, handleSubmit, reset, formState: { errors, isValid, isDirty } } = useForm({
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axiosInstance.get("/products");
      return response.data.data || response.data.products || response.data;
    },
  });

  // ── Computed Statistics ────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const inStockCount = products.filter(p => p.inStock).length;
    const outOfStockCount = products.filter(p => !p.inStock).length;
    const featuredCount = products.filter(p => p.isFeatured).length;
    const totalStock = products.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);
    
    const avgPrice = totalProducts > 0
      ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / totalProducts
      : 0;
    
    const maxPrice = totalProducts > 0
      ? Math.max(...products.map(p => parseFloat(p.price) || 0))
      : 0;
    
    const minPrice = totalProducts > 0
      ? Math.min(...products.filter(p => p.price).map(p => parseFloat(p.price)))
      : 0;

    const totalReviews = products.reduce((sum, p) => sum + (p.reviewCount || 0), 0);
    const productsWithReviews = products.filter(p => (p.reviewCount || 0) > 0).length;
    
    const avgRating = productsWithReviews > 0
      ? (products.reduce((sum, p) => sum + (p.averageRating || 0), 0) / productsWithReviews)
      : 0;

    const totalGalleryImages = products.reduce((sum, p) => sum + (p.gallery?.length || 0), 0);
    const categoriesSet = new Set(products.filter(p => p.category).map(p => p.category));
    const uniqueCategories = categoriesSet.size;

    return {
      totalProducts,
      inStockCount,
      outOfStockCount,
      featuredCount,
      avgPrice,
      maxPrice,
      minPrice,
      totalReviews,
      productsWithReviews,
      avgRating: avgRating.toFixed(1),
      totalGalleryImages,
      uniqueCategories,
      stockPercentage: totalProducts > 0 ? ((inStockCount / totalProducts) * 100).toFixed(1) : 0,
      totalStock,
    };
  }, [products]);

  const paginatedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  // ── Dropzones ──────────────────────────────────────────────────────────────
  const featuredDropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        if (featuredPreview?.startsWith("blob:")) URL.revokeObjectURL(featuredPreview);
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

  const galleryDropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      const remainingSlots = MAX_GALLERY_IMAGES - galleryItems.length;
      if (remainingSlots <= 0) { addAlert("error", "Maximum 4 gallery images allowed"); return; }
      const toAdd = acceptedFiles.slice(0, remainingSlots);
      setGalleryItems((prev) => [
        ...prev,
        ...toAdd.map((file) => ({ file, preview: URL.createObjectURL(file), isExisting: false })),
      ]);
      markDirty();
    },
    onDropRejected: (rejectedFiles) => {
      const err = rejectedFiles[0].errors[0];
      addAlert("error", err.code === "file-too-large" ? "File is too large (max 5MB)" : "Invalid file type.");
    },
  });

  const handleRemoveFeatured = () => {
    if (featuredPreview?.startsWith("blob:")) URL.revokeObjectURL(featuredPreview);
    setFeaturedImageFile(null);
    setFeaturedPreview(null);
    markDirty();
  };

  const handleRemoveGallery = (index) => {
    setGalleryItems((prev) => {
      const item = prev[index];
      if (!item.isExisting) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
    markDirty();
  };

  // ── Form helpers ───────────────────────────────────────────────────────────
  const resetForm = () => {
    reset(defaultFormValues);
    setDescription("");
    setFeatures("");
    if (featuredPreview?.startsWith("blob:")) URL.revokeObjectURL(featuredPreview);
    setFeaturedImageFile(null);
    setFeaturedPreview(null);
    galleryItems.forEach((item) => { if (!item.isExisting) URL.revokeObjectURL(item.preview); });
    setGalleryItems([]);
    setEditFormDirty(false);
    setModalTab(0);
    setProductOptions([]);
  };

  const handleOpenModal = (mode, product = null) => {
    setModalMode(mode);
    setEditFormDirty(false);
    setModalTab(0);
    if (product) {
      setSelectedProduct(product);
      reset({
        title: product.title || "",
        price: product.price || "",
        category: product.category || "",
        material: product.material || "",
        inStock: product.inStock !== undefined ? product.inStock : true,
        isFeatured: product.isFeatured || false,
        stock: product.stock || 0,
      });
      setDescription(product.description || "");
      setFeatures(product.features || "");
      setFeaturedPreview(product.featuredImage || null);
      setFeaturedImageFile(null);
      setGalleryItems((product.gallery || []).map((url) => ({ file: null, preview: url, isExisting: true })));
      setProductOptions(product.options || []);
    } else {
      setSelectedProduct(null);
      reset(defaultFormValues);
      setDescription("");
      setFeatures("");
      setFeaturedPreview(null);
      setFeaturedImageFile(null);
      setGalleryItems([]);
      setProductOptions([]);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => { setOpenModal(false); setSelectedProduct(null); resetForm(); };
  const handleDeleteClick = (product) => { setProductToDelete(product); setDeleteDialogOpen(true); };
  const handleDeleteConfirm = () => { if (productToDelete) deleteMutation.mutate(productToDelete._id); };
  const handleDeleteCancel = () => { setDeleteDialogOpen(false); setProductToDelete(null); };

  // ── Product Options Helpers ────────────────────────────────────────────────
  const addOption = () => {
    setProductOptions(prev => [
      ...prev,
      { id: Date.now().toString(), name: "", values: [{ id: Date.now().toString() + "v", value: "", priceModifier: 0 }] }
    ]);
    markDirty();
  };

  const removeOption = (optionId) => {
    setProductOptions(prev => prev.filter(o => o.id !== optionId));
    markDirty();
  };

  const updateOptionName = (optionId, name) => {
    setProductOptions(prev => prev.map(o => o.id === optionId ? { ...o, name } : o));
    markDirty();
  };

  const addOptionValue = (optionId) => {
    setProductOptions(prev => prev.map(o =>
      o.id === optionId
        ? { ...o, values: [...o.values, { id: Date.now().toString(), value: "", priceModifier: 0 }] }
        : o
    ));
    markDirty();
  };

  const removeOptionValue = (optionId, valueId) => {
    setProductOptions(prev => prev.map(o =>
      o.id === optionId ? { ...o, values: o.values.filter(v => v.id !== valueId) } : o
    ));
    markDirty();
  };

  const updateOptionValue = (optionId, valueId, field, val) => {
    setProductOptions(prev => prev.map(o =>
      o.id === optionId
        ? { ...o, values: o.values.map(v => v.id === valueId ? { ...v, [field]: val } : v) }
        : o
    ));
    markDirty();
  };

  const buildFormData = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("description", description);
    formData.append("features", features);
    formData.append("category", data.category || "");
    formData.append("material", data.material || "");
    formData.append("inStock", data.inStock);
    formData.append("isFeatured", data.isFeatured);
    formData.append("stock", data.stock);
    formData.append("options", JSON.stringify(productOptions));
    if (featuredImageFile) formData.append("featuredImage", featuredImageFile);
    const existingGalleryUrls = galleryItems.filter((i) => i.isExisting).map((i) => i.preview);
    formData.append("gallery", JSON.stringify(existingGalleryUrls));
    galleryItems.filter((i) => !i.isExisting).forEach((item) => formData.append("gallery", item.file));
    return formData;
  };

  // ── Mutations ──────────────────────────────────────────────────────────────
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

  // ── Quick Stock Update Mutation ────────────────────────────────────────────
  const updateStockMutation = useMutation({
    mutationFn: async ({ id, stock, inStock }) => {
      const formData = new FormData();
      formData.append("stock", stock);
      formData.append("inStock", inStock);
      const response = await axiosInstance.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      addAlert("success", "Stock updated!");
      setEditingStockId(null);
    },
    onError: () => { addAlert("error", "Failed to update stock."); setEditingStockId(null); },
  });

  // ── Quick InStock Toggle Mutation ──────────────────────────────────────────
  const toggleInStockMutation = useMutation({
    mutationFn: async ({ id, inStock }) => {
      const formData = new FormData();
      formData.append("inStock", inStock);
      const response = await axiosInstance.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      addAlert("success", variables.inStock ? "Marked as In Stock!" : "Marked as Out of Stock!");
    },
    onError: () => { addAlert("error", "Failed to update stock status."); },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async ({ productId, reviewId }) => {
      const response = await axiosInstance.delete(`/products/${productId}/reviews/${reviewId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      addAlert("success", "Review deleted.");
    },
    onError: () => { addAlert("error", "Failed to delete review."); },
  });

  // ── Reviews query ──────────────────────────────────────────────────────────
  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", selectedProduct?._id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products/${selectedProduct._id}/reviews`);
      return response.data;
    },
    enabled: !!selectedProduct?._id && openModal,
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

  // ── Stock inline handlers ──────────────────────────────────────────────────
  const handleStockEditStart = (product) => {
    setEditingStockId(product._id);
    setStockInputValue(String(product.stock || 0));
  };

  const handleStockSave = (product) => {
    const newStock = parseInt(stockInputValue, 10);
    if (isNaN(newStock) || newStock < 0) { addAlert("error", "Please enter a valid stock number."); return; }
    updateStockMutation.mutate({ id: product._id, stock: newStock, inStock: newStock > 0 });
  };

  const handleStockKeyDown = (e, product) => {
    if (e.key === "Enter") handleStockSave(product);
    if (e.key === "Escape") setEditingStockId(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box>
      <Helmet>
        <title>Products Management - PetCare</title>
        <meta name="description" content="Manage your products with stock and options" />
      </Helmet>

      {/* ── Delete Dialog ──────────────────────────────────────────────────── */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 1, backgroundColor: theme.palette.background.paper } }}>
        <DialogTitle sx={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: "1rem", py: 2, px: 3 }}>
          Confirm Delete
        </DialogTitle>
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

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2, mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '1rem' }}>Products Management</Typography>
          <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>Manage your product listings, inventory, and options</Typography>
        </Box>
        <GradientButton variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal("create")} size="small">
          Add New Product
        </GradientButton>
      </Box>

      {/* ── Statistics Cards ──────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            label: "Total Products",
            value: stats.totalProducts,
            icon: <ShoppingBagIcon />,
            color: COLORS.primary,
            trend: `${stats.uniqueCategories} categories`,
          },
          {
            label: "In Stock",
            value: stats.inStockCount,
            icon: <CheckIcon />,
            color: COLORS.success,
            trend: `${stats.stockPercentage}% available`,
          },
          {
            label: "Out of Stock",
            value: stats.outOfStockCount,
            icon: <CloseIcon />,
            color: COLORS.danger,
            trend: `${((stats.outOfStockCount / stats.totalProducts) * 100).toFixed(1)}% unavailable`,
          },
          {
            label: "Total Stock Units",
            value: stats.totalStock,
            icon: <InventoryIcon />,
            color: COLORS.info,
            trend: `Across ${stats.totalProducts} products`,
          },
          {
            label: "Featured",
            value: stats.featuredCount,
            icon: <StarIcon />,
            color: COLORS.warning,
            trend: `${stats.totalProducts > 0 ? ((stats.featuredCount / stats.totalProducts) * 100).toFixed(1) : 0}% featured`,
          },
          {
            label: "Avg Price",
            value: `৳${stats.avgPrice.toFixed(0)}`,
            icon: <TrendingUpIcon />,
            color: COLORS.purple,
            trend: `Min: ৳${stats.minPrice.toFixed(0)} • Max: ৳${stats.maxPrice.toFixed(0)}`,
          },
          {
            label: "Avg Rating",
            value: stats.avgRating,
            icon: <StarIcon />,
            color: COLORS.info,
            trend: `${stats.totalReviews} reviews from ${stats.productsWithReviews} products`,
          },
          {
            label: "Total Reviews",
            value: stats.totalReviews,
            icon: <RateReviewIcon />,
            color: COLORS.primary,
            trend: `${stats.productsWithReviews} products reviewed`,
          },
          {
            label: "Gallery Images",
            value: stats.totalGalleryImages,
            icon: <ImageIcon />,
            color: COLORS.warning,
            trend: `Avg ${stats.totalProducts > 0 ? (stats.totalGalleryImages / stats.totalProducts).toFixed(1) : 0} per product`,
          },
        ].map(({ label, value, icon, color, trend }) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={label}>
            <Tooltip title={trend} arrow>
              <StatCard>
                <StatIcon color={color}>
                  {icon}
                </StatIcon>
                <Box sx={{ flex: 1 }}>
                  <StatValue>{value}</StatValue>
                  <StatLabel>{label}</StatLabel>
                </Box>
              </StatCard>
            </Tooltip>
          </Grid>
        ))}
      </Grid>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <TableContainer component={Paper} elevation={0}
        sx={{ borderRadius: 1, border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: alpha(BLUE_COLOR, 0.05) }}>
              {["Image", "Title", "Price", "Category", "Stock", "In Stock", "Featured", "Gallery", "Reviews", "Options"].map((label) => (
                <TableCell key={label} sx={{ fontWeight: 600, color: TEXT_PRIMARY, borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5, whiteSpace: "nowrap" }}>
                  {label}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600, color: TEXT_PRIMARY, borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={11} align="center" sx={{ py: 4 }}><CircularProgress size={32} sx={{ color: BLUE_COLOR }} /></TableCell></TableRow>
            ) : paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                  <ShoppingBagIcon sx={{ fontSize: 48, color: alpha(TEXT_PRIMARY, 0.2), mb: 1 }} />
                  <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>No products found. Add one to get started.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
                <TableRow key={product._id} hover
                  sx={{ "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.03) }, "&:last-child td": { borderBottom: 0 } }}>

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
                    <Chip label={`৳${parseFloat(product.price).toFixed(2)}`} size="small"
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

                  {/* ── Stock (inline editable) ── */}
                  <TableCell sx={{ py: 1 }}>
                    {editingStockId === product._id ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <TextField
                          size="small"
                          type="number"
                          value={stockInputValue}
                          onChange={(e) => setStockInputValue(e.target.value)}
                          onKeyDown={(e) => handleStockKeyDown(e, product)}
                          autoFocus
                          inputProps={{ min: 0, style: { padding: "2px 6px", width: 60, fontSize: 13 } }}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                        />
                        <IconButton size="small" onClick={() => handleStockSave(product)}
                          disabled={updateStockMutation.isPending}
                          sx={{ color: GREEN_COLOR, p: 0.4, "&:hover": { bgcolor: alpha(GREEN_COLOR, 0.1) } }}>
                          {updateStockMutation.isPending && updateStockMutation.variables?.id === product._id
                            ? <CircularProgress size={14} /> : <SaveIcon sx={{ fontSize: 16 }} />}
                        </IconButton>
                        <IconButton size="small" onClick={() => setEditingStockId(null)}
                          sx={{ color: RED_COLOR, p: 0.4, "&:hover": { bgcolor: alpha(RED_COLOR, 0.1) } }}>
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    ) : (
                      <Tooltip title="Click to edit stock" arrow>
                        <Box
                          onClick={() => handleStockEditStart(product)}
                          sx={{
                            display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer",
                            px: 1, py: 0.25, borderRadius: 1, border: `1px dashed transparent`,
                            "&:hover": { border: `1px dashed ${theme.palette.divider}`, bgcolor: alpha(BLUE_COLOR, 0.04) }
                          }}
                        >
                          <InventoryIcon sx={{ fontSize: 14, color: alpha(TEXT_PRIMARY, 0.5) }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{product.stock ?? 0}</Typography>
                          <EditIcon sx={{ fontSize: 12, color: alpha(TEXT_PRIMARY, 0.3) }} />
                        </Box>
                      </Tooltip>
                    )}
                  </TableCell>

                  {/* ── In Stock Toggle ── */}
                  <TableCell sx={{ py: 1 }}>
                    <Tooltip title={product.inStock ? "Mark as Out of Stock" : "Mark as In Stock"} arrow>
                      <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                        {toggleInStockMutation.isPending && toggleInStockMutation.variables?.id === product._id ? (
                          <CircularProgress size={18} />
                        ) : (
                          <Switch
                            size="small"
                            checked={!!product.inStock}
                            onChange={(e) => toggleInStockMutation.mutate({ id: product._id, inStock: e.target.checked })}
                            color={product.inStock ? "success" : "default"}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": { color: GREEN_COLOR },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: GREEN_COLOR },
                            }}
                          />
                        )}
                        <Typography variant="caption" sx={{ color: product.inStock ? GREEN_COLOR : RED_COLOR, fontWeight: 600, ml: 0.5 }}>
                          {product.inStock ? "Yes" : "No"}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>

                  {/* Featured */}
                  <TableCell sx={{ py: 1 }}>
                    {product.isFeatured ? (
                      <StarIcon sx={{ fontSize: 18, color: theme.palette.warning.main }} />
                    ) : (
                      <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.4) }}>—</Typography>
                    )}
                  </TableCell>

                  {/* Gallery */}
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <ImageIcon sx={{ fontSize: 16, color: alpha(TEXT_PRIMARY, 0.5) }} />
                      <Typography variant="caption">{product.gallery?.length || 0}/{MAX_GALLERY_IMAGES}</Typography>
                    </Box>
                  </TableCell>

                  {/* Reviews */}
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <RateReviewIcon sx={{ fontSize: 16, color: alpha(TEXT_PRIMARY, 0.5) }} />
                      <Typography variant="caption">{product.reviewCount || 0}</Typography>
                      {product.averageRating > 0 && (
                        <Typography variant="caption" sx={{ color: theme.palette.warning.dark }}>
                          ★ {product.averageRating}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  {/* Options count */}
                  <TableCell sx={{ py: 1 }}>
                    <Tooltip title={product.options?.length ? `${product.options.length} options configured` : "No options"}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <TuneIcon sx={{ fontSize: 14, color: alpha(TEXT_PRIMARY, 0.5) }} />
                        <Typography variant="caption">{product.options?.length || 0}</Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right" sx={{ py: 1 }}>
                    <IconButton size="small" onClick={() => handleOpenModal("view", product)} sx={{ color: BLUE_COLOR, mr: 0.5, "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.1) } }}><VisibilityIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => handleOpenModal("edit", product)} sx={{ color: BLUE_COLOR, mr: 0.5, "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.1) } }}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => handleDeleteClick(product)} sx={{ color: RED_COLOR, "&:hover": { backgroundColor: alpha(RED_COLOR, 0.1) } }}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={products.length}
          rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }} />
      </TableContainer>

      {/* ── Create / Edit / View Modal ──────────────────────────────────────── */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth
        PaperProps={{ sx: { borderRadius: 1, backgroundColor: theme.palette.background.paper, maxHeight: "90vh" } }}>
        <DialogTitle sx={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: "1rem", py: 2, px: 3 }}>
          {modalMode === "create" && "Add New Product"}
          {modalMode === "edit" && "Edit Product"}
          {modalMode === "view" && "Product Details"}
        </DialogTitle>

        {/* ── Modal Tabs ────────────────────────────────────────────────────── */}
        <Box sx={{ px: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Tabs value={modalTab} onChange={(_, v) => setModalTab(v)} textColor="primary" indicatorColor="primary" sx={{ minHeight: 40 }}>
            <Tab label="Product Info" sx={{ minHeight: 40, textTransform: "none", fontSize: "0.85rem" }} />
            <Tab label="Features" sx={{ minHeight: 40, textTransform: "none", fontSize: "0.85rem" }} />
            <Tab 
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TuneIcon sx={{ fontSize: 16 }} />
                  {`Options${productOptions.length > 0 ? ` (${productOptions.length})` : ""}`}
                </Box>
              }
              sx={{ minHeight: 40, textTransform: "none", fontSize: "0.85rem" }}
            />
            {(modalMode === "view" || modalMode === "edit") && (
              <Tab label={`Reviews (${reviewsData?.reviewCount ?? selectedProduct?.reviewCount ?? 0})`}
                sx={{ minHeight: 40, textTransform: "none", fontSize: "0.85rem" }} />
            )}
          </Tabs>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ px: 3, py: 2, maxHeight: "calc(90vh - 180px)", overflow: "auto" }}>

            {/* ── TAB 0: Product Info ───────────────────────────────────────── */}
            {modalTab === 0 && (
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

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ mb: 0.5 }}>
                          <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Price (৳)</Typography>
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

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ mb: 0.5 }}>
                          <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Stock Quantity</Typography>
                          {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                        </Box>
                        <Controller name="stock" control={control}
                          rules={{ required: "Stock is required", min: { value: 0, message: "Cannot be negative" } }}
                          render={({ field }) => (
                            <StyledTextField {...field} fullWidth size="small" type="number" disabled={modalMode === "view"}
                              error={!!errors.stock} helperText={errors.stock?.message} placeholder="e.g. 10"
                              InputProps={{ startAdornment: <InputAdornment position="start"><InventoryIcon sx={{ fontSize: 16, color: alpha(TEXT_PRIMARY, 0.4) }} /></InputAdornment> }}
                              onChange={(e) => { field.onChange(e); markDirty(); }} />
                          )} />
                      </Grid>

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

                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ mb: 0.5 }}>
                          <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>In Stock Status</Typography>
                        </Box>
                        <Controller name="inStock" control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={<Switch {...field} checked={field.value} onChange={(e) => { field.onChange(e.target.checked); markDirty(); }} disabled={modalMode === "view"} color="success" size="small" />}
                              label={<Typography variant="body2" sx={{ color: field.value ? GREEN_COLOR : RED_COLOR, fontWeight: 600 }}>{field.value ? "In Stock" : "Out of Stock"}</Typography>}
                            />
                          )} />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ mb: 0.5 }}>
                          <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Featured Product</Typography>
                        </Box>
                        <Controller name="isFeatured" control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={<Switch {...field} checked={field.value} onChange={(e) => { field.onChange(e.target.checked); markDirty(); }} disabled={modalMode === "view"} color="primary" size="small" />}
                              label={field.value ? "Mark as Featured" : "Not Featured"}
                            />
                          )} />
                        <FormHelperText sx={{ color: alpha(TEXT_PRIMARY, 0.6) }}>Mark this product as featured to highlight it on the homepage</FormHelperText>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ mb: 1 }}>
                          <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Description</Typography>
                          {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                        </Box>
                        {modalMode !== "view" ? (
                          <Box sx={{ "& .quill": { "& .ql-toolbar": { borderColor: theme.palette.divider, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: alpha(BLUE_COLOR, 0.02) }, "& .ql-container": { borderColor: theme.palette.divider, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, minHeight: 120, fontSize: "0.875rem", backgroundColor: theme.palette.background.paper }, "& .ql-editor": { minHeight: 120 } } }}>
                            <ReactQuill value={description} onChange={(val) => { setDescription(val); markDirty(); }}
                              theme="snow" modules={quillModules} formats={quillFormats} placeholder="Enter product description..." />
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
            )}

            {/* ── TAB 1: Features ───────────────────────────────────────────── */}
            {modalTab === 1 && (
              <Box>
                <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7), mb: 2 }}>
                  Use this section to highlight product features, bullet points, or any additional information shown in the "Features" tab on the product page.
                </Typography>
                {modalMode !== "view" ? (
                  <Box sx={{ "& .quill": { "& .ql-toolbar": { borderColor: theme.palette.divider, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: alpha(BLUE_COLOR, 0.02) }, "& .ql-container": { borderColor: theme.palette.divider, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, minHeight: 300, fontSize: "0.875rem", backgroundColor: theme.palette.background.paper }, "& .ql-editor": { minHeight: 300 } } }}>
                    <ReactQuill value={features} onChange={(val) => { setFeatures(val); markDirty(); }}
                      theme="snow" modules={quillModules} formats={quillFormats} placeholder="Add product features, highlights, specifications..." />
                  </Box>
                ) : (
                  <Paper elevation={0} sx={{ p: 2.5, bgcolor: alpha(BLUE_COLOR, 0.02), borderRadius: 1, border: 1, borderColor: theme.palette.divider }}>
                    <Box sx={{ fontSize: "0.875rem", color: alpha(TEXT_PRIMARY, 0.85), "& p": { margin: 0 }, "& ul, & ol": { paddingLeft: "1.5rem" } }}
                      dangerouslySetInnerHTML={{ __html: features || "<p>No features provided.</p>" }} />
                  </Paper>
                )}
              </Box>
            )}

            {/* ── TAB 2: Product Options ───────────────────────────────────── */}
            {modalTab === 2 && (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY }}>Product Options</Typography>
                    <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.6) }}>
                      Add options like size, color, material — each option can have multiple values with optional price modifiers.
                    </Typography>
                  </Box>
                  {modalMode !== "view" && (
                    <GradientButton size="small" startIcon={<AddOptionIcon />} onClick={addOption}>
                      Add Option
                    </GradientButton>
                  )}
                </Box>

                {productOptions.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 6, border: `2px dashed ${theme.palette.divider}`, borderRadius: 2 }}>
                    <TuneIcon sx={{ fontSize: 48, color: alpha(TEXT_PRIMARY, 0.15), mb: 1 }} />
                    <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.5) }}>
                      {modalMode === "view" ? "No options configured for this product." : "No options yet. Click \"Add Option\" to create one."}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {productOptions.map((option, optIdx) => (
                      <Paper key={option.id} elevation={0}
                        sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, bgcolor: alpha(BLUE_COLOR, 0.01) }}>

                        {/* Option Name Row */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 500, color: alpha(TEXT_PRIMARY, 0.7), mb: 0.5, display: "block" }}>
                              Option Name (e.g. Size, Color, Material)
                            </Typography>
                            {modalMode !== "view" ? (
                              <StyledTextField
                                fullWidth size="small"
                                value={option.name}
                                onChange={(e) => updateOptionName(option.id, e.target.value)}
                                placeholder="Option name..."
                              />
                            ) : (
                              <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY }}>{option.name || "—"}</Typography>
                            )}
                          </Box>
                          {modalMode !== "view" && (
                            <Tooltip title="Remove this option" arrow>
                              <IconButton size="small" onClick={() => removeOption(option.id)}
                                sx={{ color: RED_COLOR, mt: 2.5, "&:hover": { bgcolor: alpha(RED_COLOR, 0.1) } }}>
                                <RemoveOptionIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>

                        <Divider sx={{ mb: 1.5 }} />

                        {/* Option Values */}
                        <Typography variant="caption" sx={{ fontWeight: 500, color: alpha(TEXT_PRIMARY, 0.7), mb: 1, display: "block" }}>
                          Values
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          {option.values.map((val, valIdx) => (
                            <Box key={val.id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {/* Value chip / number */}
                              <Box sx={{
                                minWidth: 24, height: 24, borderRadius: "50%", bgcolor: alpha(BLUE_COLOR, 0.1),
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                              }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: BLUE_COLOR, fontSize: 10 }}>{valIdx + 1}</Typography>
                              </Box>

                              {modalMode !== "view" ? (
                                <>
                                  <StyledTextField
                                    size="small" fullWidth
                                    value={val.value}
                                    onChange={(e) => updateOptionValue(option.id, val.id, "value", e.target.value)}
                                    placeholder={`Value (e.g. Red, Large, Cotton)`}
                                    sx={{ flex: 2 }}
                                  />
                                  <StyledTextField
                                    size="small"
                                    type="number"
                                    value={val.priceModifier}
                                    onChange={(e) => updateOptionValue(option.id, val.id, "priceModifier", parseFloat(e.target.value) || 0)}
                                    placeholder="±Price"
                                    sx={{ width: 110, flexShrink: 0 }}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start"><Typography variant="caption">৳</Typography></InputAdornment>,
                                    }}
                                  />
                                  <Tooltip title="Remove value" arrow>
                                    <IconButton size="small" onClick={() => removeOptionValue(option.id, val.id)}
                                      disabled={option.values.length === 1}
                                      sx={{ color: RED_COLOR, flexShrink: 0, "&:hover": { bgcolor: alpha(RED_COLOR, 0.1) }, "&.Mui-disabled": { color: alpha(TEXT_PRIMARY, 0.2) } }}>
                                      <CloseIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                                  <Chip label={val.value || "—"} size="small" sx={{ fontSize: "0.75rem" }} />
                                  {val.priceModifier !== 0 && (
                                    <Chip
                                      label={`${val.priceModifier > 0 ? "+" : ""}৳${val.priceModifier}`}
                                      size="small"
                                      sx={{ fontSize: "0.7rem", bgcolor: val.priceModifier > 0 ? alpha(GREEN_COLOR, 0.1) : alpha(RED_COLOR, 0.1), color: val.priceModifier > 0 ? GREEN_COLOR : RED_COLOR }}
                                    />
                                  )}
                                </Box>
                              )}
                            </Box>
                          ))}

                          {modalMode !== "view" && (
                            <Button size="small" startIcon={<AddOptionIcon sx={{ fontSize: 14 }} />}
                              onClick={() => addOptionValue(option.id)}
                              sx={{ alignSelf: "flex-start", textTransform: "none", fontSize: "0.75rem", color: BLUE_COLOR, mt: 0.5, px: 1 }}>
                              Add value
                            </Button>
                          )}
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* ── TAB 3: Reviews ────────────────────────────────────────────── */}
            {modalTab === 3 && (
              <Box>
                {/* Summary */}
                {reviewsData && reviewsData.reviewCount > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, p: 2, bgcolor: alpha(BLUE_COLOR, 0.04), borderRadius: 1 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.dark }}>{reviewsData.averageRating}</Typography>
                      <Typography variant="caption">out of 5</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY }}>{reviewsData.reviewCount} review{reviewsData.reviewCount !== 1 ? "s" : ""}</Typography>
                      <Box sx={{ display: "flex", gap: 0.25 }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <StarIcon key={s} sx={{ fontSize: 16, color: s <= Math.round(reviewsData.averageRating) ? theme.palette.warning.main : alpha(TEXT_PRIMARY, 0.2) }} />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Review List */}
                {!reviewsData ? (
                  <Box sx={{ textAlign: "center", py: 4 }}><CircularProgress size={28} sx={{ color: BLUE_COLOR }} /></Box>
                ) : reviewsData.data?.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <RateReviewIcon sx={{ fontSize: 48, color: alpha(TEXT_PRIMARY, 0.2), mb: 1 }} />
                    <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>No reviews yet.</Typography>
                  </Box>
                ) : (
                  reviewsData.data.map((review) => (
                    <Paper key={review._id} elevation={0}
                      sx={{ p: 2, mb: 1.5, borderRadius: 1, border: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.paper }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY }}>{review.name}</Typography>
                            <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.5) }}>{review.email}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", gap: 0.25, mb: 0.5 }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <StarIcon key={s} sx={{ fontSize: 14, color: s <= review.rating ? theme.palette.warning.main : alpha(TEXT_PRIMARY, 0.2) }} />
                            ))}
                          </Box>
                          <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.8) }}>{review.comment}</Typography>
                          <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.4) }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={() => deleteReviewMutation.mutate({ productId: selectedProduct._id, reviewId: review._id })}
                          sx={{ color: RED_COLOR, "&:hover": { bgcolor: alpha(RED_COLOR, 0.1) } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))
                )}
              </Box>
            )}
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