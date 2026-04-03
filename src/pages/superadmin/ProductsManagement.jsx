import React, { useState, useMemo } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, Grid, FormControl, Select,
  MenuItem, FormControlLabel, Switch, alpha, useTheme, CircularProgress,
  Avatar, FormHelperText, Button, Tabs, Tab, Tooltip, Divider, TextField,
  InputAdornment, useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Visibility as VisibilityIcon, ShoppingBag as ShoppingBagIcon,
  CloudUpload, Image as ImageIcon, AddPhotoAlternate, Star as StarIcon,
  RateReview as RateReviewIcon, Check as CheckIcon,
  Close as CloseIcon, TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon, Save as SaveIcon,
  AddCircleOutline as AddOptionIcon, RemoveCircleOutline as RemoveOptionIcon,
  Tune as TuneIcon, Discount as DiscountIcon, LocalOffer as LocalOfferIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { styled } from "@mui/material/styles";
import axiosInstance from "../../api/axios";
import GradientButton from "../../components/ui/GradientButton";
import OutlineButton from "../../components/ui/OutlineButton";
import StyledTextField from "../../components/ui/StyledTextField";
import { useAlert } from "../../components/ui/AlertProvider";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useShopApi } from "../../hooks/useShopApi";

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
  discount: '#10b981',
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
  padding: theme.spacing(1.5, 2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(2, 2.5) },
  [theme.breakpoints.up('md')]: { padding: theme.spacing(2.5, 3) },
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  '&:hover': { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', transform: 'translateY(-2px)' },
}));

const StatIcon = styled(Box)(({ color }) => ({
  width: 36, height: 36, borderRadius: 10,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  backgroundColor: alpha(color, 0.1), color: color, fontSize: 18,
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: 16, fontWeight: 700, color: COLORS.text, lineHeight: 1, margin: 0,
  [theme.breakpoints.up('sm')]: { fontSize: 18 },
  [theme.breakpoints.up('md')]: { fontSize: 20 },
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: 10, color: '#6b7280', marginTop: 4, fontWeight: 500,
  [theme.breakpoints.up('sm')]: { fontSize: 11 },
  [theme.breakpoints.up('md')]: { fontSize: 12 },
}));

// ─── Constants ────────────────────────────────────────────────────────────────
const defaultFormValues = {
  title: "", price: "", category: "", material: "",
  inStock: true, isFeatured: false, stock: 1,
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addAlert } = useAlert();

  const BLUE_COLOR = theme.palette.primary.main;
  const RED_COLOR = theme.palette.error.main;
  const GREEN_COLOR = theme.palette.success.main;
  const TEXT_PRIMARY = theme.palette.text.primary;

  // ── useShopApi ─────────────────────────────────────────────────────────────
  const { useProductsManagement } = useShopApi();
  const {
    allProducts,
    paginatedProducts,
    isLoading,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    stats,
    createMutation,
    updateMutation,
    deleteMutation,
    updateStockMutation,
    toggleInStockMutation,
    deleteReviewMutation,
    approveReviewMutation,   // ← from updated hook
  } = useProductsManagement();

  // ── Modal / UI State ───────────────────────────────────────────────────────
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [modalTab, setModalTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredPreview, setFeaturedPreview] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [editFormDirty, setEditFormDirty] = useState(false);

  // ── Discount State ─────────────────────────────────────────────────────────
  const [discount, setDiscount] = useState({
    type: 'percentage', value: 0, startDate: '', endDate: '', isActive: false,
  });

  // ── Stock Inline Edit State ────────────────────────────────────────────────
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockInputValue, setStockInputValue] = useState("");

  // ── Product Options State ──────────────────────────────────────────────────
  const [productOptions, setProductOptions] = useState([]);

  const markDirty = () => { if (modalMode === "edit") setEditFormDirty(true); };

  const { control, handleSubmit, reset, watch, formState: { errors, isValid, isDirty } } = useForm({
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  const priceValue = watch("price");

  // ── Reviews Query ──────────────────────────────────────────────────────────
  // Fetches ALL reviews (including unapproved) for the admin modal
  const { data: reviewsRaw, isLoading: reviewsLoading } = useQuery({
    queryKey: ["admin-reviews", selectedProduct?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/${selectedProduct._id}/reviews`);
      // API shape: { data: { reviews: [...], averageRating, reviewCount } }
      // or shape:  { data: [...] }
      // Handle both:
      const payload = res.data?.data || res.data;
      if (Array.isArray(payload)) return { reviews: payload, averageRating: 0, reviewCount: payload.length };
      return {
        reviews: payload?.reviews || [],
        averageRating: payload?.averageRating || 0,
        reviewCount: payload?.reviewCount || payload?.reviews?.length || 0,
      };
    },
    enabled: !!selectedProduct?._id && openModal,
  });

  // Normalize so the rest of the component always has { reviews, averageRating, reviewCount }
  const reviewsData = useMemo(() => {
    if (!reviewsRaw) return null;
    return reviewsRaw;
  }, [reviewsRaw]);

  // ── Discount Calculations ──────────────────────────────────────────────────
  const calculateDiscountedPrice = useMemo(() => {
    if (!discount.isActive || discount.value <= 0 || !priceValue) return priceValue;
    const price = parseFloat(priceValue);
    return discount.type === 'percentage'
      ? price * (1 - discount.value / 100)
      : Math.max(0, price - discount.value);
  }, [priceValue, discount]);

  const discountPercentage = useMemo(() => {
    if (!discount.isActive || discount.value <= 0 || !priceValue) return 0;
    const price = parseFloat(priceValue);
    return discount.type === 'percentage'
      ? discount.value
      : (discount.value / price) * 100;
  }, [priceValue, discount]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  // ── Dropzones ──────────────────────────────────────────────────────────────
  const featuredDropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1, maxSize: MAX_FILE_SIZE,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        if (featuredPreview?.startsWith("blob:")) URL.revokeObjectURL(featuredPreview);
        setFeaturedImageFile(accepted[0]);
        setFeaturedPreview(URL.createObjectURL(accepted[0]));
        markDirty();
      }
    },
    onDropRejected: (rejected) => {
      const err = rejected[0].errors[0];
      addAlert("error", err.code === "file-too-large" ? "File is too large (max 5MB)" : "Invalid file type.");
    },
  });

  const galleryDropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxSize: MAX_FILE_SIZE,
    onDrop: (accepted) => {
      const remaining = MAX_GALLERY_IMAGES - galleryItems.length;
      if (remaining <= 0) { addAlert("error", "Maximum 4 gallery images allowed"); return; }
      setGalleryItems((prev) => [
        ...prev,
        ...accepted.slice(0, remaining).map((file) => ({ file, preview: URL.createObjectURL(file), isExisting: false })),
      ]);
      markDirty();
    },
    onDropRejected: (rejected) => {
      const err = rejected[0].errors[0];
      addAlert("error", err.code === "file-too-large" ? "File is too large (max 5MB)" : "Invalid file type.");
    },
  });

  const handleRemoveFeatured = () => {
    if (featuredPreview?.startsWith("blob:")) URL.revokeObjectURL(featuredPreview);
    setFeaturedImageFile(null); setFeaturedPreview(null); markDirty();
  };

  const handleRemoveGallery = (index) => {
    setGalleryItems((prev) => {
      const item = prev[index];
      if (!item.isExisting) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
    markDirty();
  };

  // ── Form Helpers ───────────────────────────────────────────────────────────
  const resetForm = () => {
    reset(defaultFormValues);
    setDescription(""); setFeatures("");
    if (featuredPreview?.startsWith("blob:")) URL.revokeObjectURL(featuredPreview);
    setFeaturedImageFile(null); setFeaturedPreview(null);
    galleryItems.forEach((item) => { if (!item.isExisting) URL.revokeObjectURL(item.preview); });
    setGalleryItems([]);
    setEditFormDirty(false); setModalTab(0); setProductOptions([]);
    setDiscount({ type: 'percentage', value: 0, startDate: '', endDate: '', isActive: false });
  };

  const handleOpenModal = (mode, product = null) => {
    setModalMode(mode); setEditFormDirty(false); setModalTab(0);
    if (product) {
      setSelectedProduct(product);
      reset({
        title: product.title || "", price: product.price || "",
        category: product.category || "", material: product.material || "",
        inStock: product.inStock !== undefined ? product.inStock : true,
        isFeatured: product.isFeatured || false, stock: product.stock || 1,
      });
      setDescription(product.description || "");
      setFeatures(product.features || "");
      setFeaturedPreview(product.featuredImage || null);
      setFeaturedImageFile(null);
      setGalleryItems((product.gallery || []).map((url) => ({ file: null, preview: url, isExisting: true })));
      setProductOptions(product.options || []);
      setDiscount(product.discount || { type: 'percentage', value: 0, startDate: '', endDate: '', isActive: false });
    } else {
      setSelectedProduct(null); reset(defaultFormValues);
      setDescription(""); setFeatures(""); setFeaturedPreview(null);
      setFeaturedImageFile(null); setGalleryItems([]); setProductOptions([]);
      setDiscount({ type: 'percentage', value: 0, startDate: '', endDate: '', isActive: false });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => { setOpenModal(false); setSelectedProduct(null); resetForm(); };

  // ── Delete Handlers ────────────────────────────────────────────────────────
  const handleDeleteClick = (product) => { setProductToDelete(product); setDeleteDialogOpen(true); };
  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    deleteMutation.mutate(productToDelete._id, {
      onSuccess: () => { setDeleteDialogOpen(false); setProductToDelete(null); },
      onError: () => { setDeleteDialogOpen(false); setProductToDelete(null); },
    });
  };
  const handleDeleteCancel = () => { setDeleteDialogOpen(false); setProductToDelete(null); };

  // ── Product Options Helpers ────────────────────────────────────────────────
  const addOption = () => {
    setProductOptions(prev => [...prev, { id: Date.now().toString(), name: "", values: [{ id: Date.now().toString() + "v", value: "", priceModifier: 0 }] }]);
    markDirty();
  };
  const removeOption = (optionId) => { setProductOptions(prev => prev.filter(o => o.id !== optionId)); markDirty(); };
  const updateOptionName = (optionId, name) => { setProductOptions(prev => prev.map(o => o.id === optionId ? { ...o, name } : o)); markDirty(); };
  const addOptionValue = (optionId) => {
    setProductOptions(prev => prev.map(o => o.id === optionId ? { ...o, values: [...o.values, { id: Date.now().toString(), value: "", priceModifier: 0 }] } : o));
    markDirty();
  };
  const removeOptionValue = (optionId, valueId) => {
    setProductOptions(prev => prev.map(o => o.id === optionId ? { ...o, values: o.values.filter(v => v.id !== valueId) } : o));
    markDirty();
  };
  const updateOptionValue = (optionId, valueId, field, val) => {
    setProductOptions(prev => prev.map(o => o.id === optionId ? { ...o, values: o.values.map(v => v.id === valueId ? { ...v, [field]: val } : v) } : o));
    markDirty();
  };

  // ── Build FormData ─────────────────────────────────────────────────────────
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
    formData.append("discount", JSON.stringify(discount));
    if (featuredImageFile) formData.append("featuredImage", featuredImageFile);
    const existingGallery = galleryItems.filter((i) => i.isExisting).map((i) => i.preview);
    formData.append("gallery", JSON.stringify(existingGallery));
    galleryItems.filter((i) => !i.isExisting).forEach((item) => formData.append("gallery", item.file));
    return formData;
  };

  // ── Submit Handler ─────────────────────────────────────────────────────────
  const onSubmit = (data) => {
    if (!description || description === "<p><br></p>") { addAlert("error", "Description is required."); return; }
    if (modalMode === "create" && !featuredImageFile) { addAlert("error", "Please select a featured image."); return; }
    const formData = buildFormData(data);
    if (modalMode === "edit" && selectedProduct) {
      updateMutation.mutate({ id: selectedProduct._id, formData }, { onSuccess: () => handleCloseModal() });
    } else {
      createMutation.mutate(formData, { onSuccess: () => handleCloseModal() });
    }
  };

  const isSubmitDisabled = () => {
    if (createMutation.isPending || updateMutation.isPending) return true;
    if (modalMode === "create") return !isValid || !description || description === "<p><br></p>" || !featuredImageFile;
    return !editFormDirty && !isDirty;
  };

  // ── Stock Inline Handlers ──────────────────────────────────────────────────
  const handleStockEditStart = (product) => { setEditingStockId(product._id); setStockInputValue(String(product.stock || 0)); };
  const handleStockSave = (product) => {
    const newStock = parseInt(stockInputValue, 10);
    if (isNaN(newStock) || newStock < 0) { addAlert("error", "Please enter a valid stock number."); return; }
    updateStockMutation.mutate(
      { id: product._id, stock: newStock, inStock: newStock > 0 },
      { onSuccess: () => setEditingStockId(null), onError: () => setEditingStockId(null) }
    );
  };
  const handleStockKeyDown = (e, product) => {
    if (e.key === "Enter") handleStockSave(product);
    if (e.key === "Escape") setEditingStockId(null);
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box>
      <Helmet>
        <title>Products Management - FatherOfMeow</title>
        <meta name="description" content="Manage your products with stock, discounts, and options" />
      </Helmet>

      {/* ── Delete Dialog ──────────────────────────────────────────────────── */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: { xs: "0.9rem", sm: "1rem" }, py: { xs: 1.5, sm: 2 }, px: { xs: 2, sm: 3 } }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
          <Typography variant="body2" sx={{ color: TEXT_PRIMARY, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
            Are you sure you want to delete "<strong>{productToDelete?.title}</strong>"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
          <OutlineButton onClick={handleDeleteCancel} size="small" disabled={deleteMutation.isPending}>Cancel</OutlineButton>
          <Button onClick={handleDeleteConfirm} size="small" variant="contained" color="error" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? <CircularProgress size={16} sx={{ color: "white" }} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2, mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: { xs: "0.9rem", sm: "1rem" } }}>Products Management</Typography>
          <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7), fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
            Manage your product listings, inventory, discounts, and options
          </Typography>
        </Box>
        <GradientButton variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal("create")} size="small" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
          Add New Product
        </GradientButton>
      </Box>

      {/* ── Statistics Cards ──────────────────────────────────────────────── */}
      <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 3 }}>
        {[
          { label: "Total Products", value: stats.totalProducts, icon: <ShoppingBagIcon />, color: COLORS.primary, trend: `${stats.uniqueCategories} categories` },
          { label: "In Stock", value: stats.inStockCount, icon: <CheckIcon />, color: COLORS.success, trend: `${stats.stockPercentage}% available` },
          { label: "Out of Stock", value: stats.outOfStockCount, icon: <CloseIcon />, color: COLORS.danger, trend: `${((stats.outOfStockCount / stats.totalProducts) * 100 || 0).toFixed(1)}% unavailable` },
          { label: "Total Stock Units", value: stats.totalStock, icon: <InventoryIcon />, color: COLORS.info, trend: `Across ${stats.totalProducts} products` },
          { label: "Featured", value: stats.featuredCount, icon: <StarIcon />, color: COLORS.warning, trend: `${stats.totalProducts > 0 ? ((stats.featuredCount / stats.totalProducts) * 100).toFixed(1) : 0}% featured` },
          { label: "On Discount", value: stats.productsWithDiscount, icon: <DiscountIcon />, color: COLORS.discount, trend: `${stats.productsWithDiscount} products on sale` },
          { label: "Avg Price", value: `৳${stats.avgPrice.toFixed(0)}`, icon: <TrendingUpIcon />, color: COLORS.purple, trend: `Min: ৳${stats.minPrice.toFixed(0)} • Max: ৳${stats.maxPrice.toFixed(0)}` },
          { label: "Avg Rating", value: stats.avgRating, icon: <StarIcon />, color: COLORS.info, trend: `${stats.totalReviews} reviews from ${stats.productsWithReviews} products` },
          { label: "Total Reviews", value: stats.totalReviews, icon: <RateReviewIcon />, color: COLORS.primary, trend: `${stats.productsWithReviews} products reviewed` },
          { label: "Gallery Images", value: stats.totalGalleryImages, icon: <ImageIcon />, color: COLORS.warning, trend: `Avg ${stats.totalProducts > 0 ? (stats.totalGalleryImages / stats.totalProducts).toFixed(1) : 0} per product` },
        ].map(({ label, value, icon, color, trend }) => (
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2.4 }} key={label}>
            <Tooltip title={trend} arrow>
              <StatCard>
                <StatIcon color={color}>{icon}</StatIcon>
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
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 1, border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, overflow: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: alpha(BLUE_COLOR, 0.05) }}>
              {(isMobile
                ? ["Image", "Title", "Price", "Stock"]
                : ["Image", "Title", "Price", "Discounted", "Category", "Stock", "In Stock", "Featured", "Discount", "Reviews", "Options"]
              ).map((label) => (
                <TableCell key={label} sx={{ fontWeight: 600, color: TEXT_PRIMARY, borderBottom: `1px solid ${theme.palette.divider}`, py: { xs: 1, sm: 1.5 }, fontSize: { xs: "0.7rem", sm: "0.75rem" }, whiteSpace: "nowrap" }}>
                  {label}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600, color: TEXT_PRIMARY, borderBottom: `1px solid ${theme.palette.divider}`, py: { xs: 1, sm: 1.5 }, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={12} align="center" sx={{ py: 4 }}><CircularProgress size={28} sx={{ color: BLUE_COLOR }} /></TableCell></TableRow>
            ) : paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                  <ShoppingBagIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: alpha(TEXT_PRIMARY, 0.2), mb: 1 }} />
                  <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7), fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>No products found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => {
                const hasDiscount = product.discount?.isActive && product.discount.value > 0;
                const discountedPrice = product.discountedPrice || product.price;
                return (
                  <TableRow key={product._id} hover sx={{ "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.03) }, "&:last-child td": { borderBottom: 0 } }}>

                    {/* Image */}
                    <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                      {product.featuredImage ? (
                        <Avatar src={product.featuredImage} alt={product.title}
                          sx={{ width: { xs: 36, sm: 40, md: 48 }, height: { xs: 36, sm: 40, md: 48 }, borderRadius: 1, cursor: "pointer" }}
                          onClick={() => handleOpenModal("view", product)} />
                      ) : (
                        <Box sx={{ width: { xs: 36, sm: 40, md: 48 }, height: { xs: 36, sm: 40, md: 48 }, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: alpha(BLUE_COLOR, 0.05), borderRadius: 1, border: `1px dashed ${theme.palette.divider}` }}>
                          <ImageIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 }, color: alpha(TEXT_PRIMARY, 0.3) }} />
                        </Box>
                      )}
                    </TableCell>

                    {/* Title */}
                    <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>{product.title}</Typography>
                      {!isMobile && <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontSize: "0.65rem" }}>{product.title_id}</Typography>}
                    </TableCell>

                    {/* Price */}
                    <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                      <Chip label={`৳${parseFloat(product.price).toFixed(2)}`} size="small"
                        sx={{ fontWeight: 600, fontSize: { xs: "0.65rem", sm: "0.7rem" }, height: { xs: 20, sm: 22 }, backgroundColor: alpha(GREEN_COLOR, 0.1), color: GREEN_COLOR }} />
                    </TableCell>

                    {!isMobile && (
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                        {hasDiscount ? (
                          <Box>
                            <Chip label={`৳${discountedPrice.toFixed(2)}`} size="small" sx={{ fontWeight: 600, fontSize: "0.7rem", height: 22, backgroundColor: alpha(COLORS.discount, 0.1), color: COLORS.discount }} />
                            <Chip label={`-${product.discount.type === 'percentage' ? product.discount.value : ((product.discount.value / product.price) * 100).toFixed(0)}%`} size="small"
                              sx={{ fontWeight: 600, fontSize: "0.6rem", height: 16, ml: 0.5, backgroundColor: alpha(COLORS.discount, 0.2), color: COLORS.discount }} />
                          </Box>
                        ) : <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.4), fontSize: "0.7rem" }}>—</Typography>}
                      </TableCell>
                    )}

                    {!isMobile && (
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                        {product.category
                          ? <Chip label={product.category} size="small" sx={{ fontWeight: 500, fontSize: "0.7rem", height: 22, backgroundColor: alpha(BLUE_COLOR, 0.08), color: BLUE_COLOR }} />
                          : <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.4), fontSize: "0.7rem" }}>—</Typography>}
                      </TableCell>
                    )}

                    {/* Stock (inline editable) */}
                    <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                      {editingStockId === product._id ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <TextField size="small" type="text" value={stockInputValue}
                            onChange={(e) => setStockInputValue(e.target.value)}
                            onKeyDown={(e) => handleStockKeyDown(e, product)}
                            autoFocus inputProps={{ min: 0, style: { padding: "2px 4px", width: 50, fontSize: 11 } }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1, fontSize: "0.7rem" } }} />
                          <IconButton size="small" onClick={() => handleStockSave(product)} disabled={updateStockMutation.isPending} sx={{ color: GREEN_COLOR, p: 0.4 }}>
                            {updateStockMutation.isPending && updateStockMutation.variables?.id === product._id ? <CircularProgress size={12} /> : <SaveIcon sx={{ fontSize: 14 }} />}
                          </IconButton>
                          <IconButton size="small" onClick={() => setEditingStockId(null)} sx={{ color: RED_COLOR, p: 0.4 }}>
                            <CloseIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      ) : (
                        <Tooltip title="Click to edit stock" arrow>
                          <Box onClick={() => handleStockEditStart(product)} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer", px: 0.5, py: 0.25, borderRadius: 1, "&:hover": { bgcolor: alpha(BLUE_COLOR, 0.04) } }}>
                            <InventoryIcon sx={{ fontSize: { xs: 12, sm: 14 }, color: alpha(TEXT_PRIMARY, 0.5) }} />
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>{product.stock ?? 0}</Typography>
                            <EditIcon sx={{ fontSize: { xs: 10, sm: 12 }, color: alpha(TEXT_PRIMARY, 0.3) }} />
                          </Box>
                        </Tooltip>
                      )}
                    </TableCell>

                    {!isMobile && (
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                        <Tooltip title={product.inStock ? "Mark as Out of Stock" : "Mark as In Stock"} arrow>
                          <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                            {toggleInStockMutation.isPending && toggleInStockMutation.variables?.id === product._id
                              ? <CircularProgress size={16} />
                              : <Switch size="small" checked={!!product.inStock} onChange={(e) => toggleInStockMutation.mutate({ id: product._id, inStock: e.target.checked })} color={product.inStock ? "success" : "default"} />}
                            <Typography variant="caption" sx={{ color: product.inStock ? GREEN_COLOR : RED_COLOR, fontWeight: 600, ml: 0.5, fontSize: "0.65rem" }}>
                              {product.inStock ? "Yes" : "No"}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                    )}

                    {!isMobile && (
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                        {product.isFeatured
                          ? <StarIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, color: theme.palette.warning.main }} />
                          : <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.4), fontSize: "0.7rem" }}>—</Typography>}
                      </TableCell>
                    )}

                    {!isMobile && (
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                        {hasDiscount ? (
                          <Tooltip title={`${product.discount.type === 'percentage' ? `${product.discount.value}% off` : `৳${product.discount.value} off`}`} arrow>
                            <Chip icon={<LocalOfferIcon sx={{ fontSize: 12 }} />}
                              label={`${product.discount.value}${product.discount.type === 'percentage' ? '%' : '৳'}`} size="small"
                              sx={{ fontSize: "0.65rem", height: 20, backgroundColor: alpha(COLORS.discount, 0.15), color: COLORS.discount }} />
                          </Tooltip>
                        ) : <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.4), fontSize: "0.7rem" }}>—</Typography>}
                      </TableCell>
                    )}

                    {!isMobile && (
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <RateReviewIcon sx={{ fontSize: { xs: 12, sm: 14, md: 16 }, color: alpha(TEXT_PRIMARY, 0.5) }} />
                          <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>{product.reviewCount || 0}</Typography>
                          {product.averageRating > 0 && (
                            <Typography variant="caption" sx={{ color: theme.palette.warning.dark, fontSize: "0.7rem" }}>★ {product.averageRating.toFixed(1)}</Typography>
                          )}
                        </Box>
                      </TableCell>
                    )}

                    {!isMobile && (
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                        <Tooltip title={product.options?.length ? `${product.options.length} options configured` : "No options"}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <TuneIcon sx={{ fontSize: { xs: 12, sm: 14, md: 16 }, color: alpha(TEXT_PRIMARY, 0.5) }} />
                            <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>{product.options?.length || 0}</Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                    )}

                    {/* Actions */}
                    <TableCell align="right" sx={{ py: { xs: 0.5, sm: 1 } }}>
                      <IconButton size="small" onClick={() => handleOpenModal("view", product)} sx={{ color: BLUE_COLOR, mr: 0.5, p: { xs: 0.5, sm: 0.8 } }}><VisibilityIcon fontSize="small" sx={{ fontSize: { xs: 16, sm: 18 } }} /></IconButton>
                      <IconButton size="small" onClick={() => handleOpenModal("edit", product)} sx={{ color: BLUE_COLOR, mr: 0.5, p: { xs: 0.5, sm: 0.8 } }}><EditIcon fontSize="small" sx={{ fontSize: { xs: 16, sm: 18 } }} /></IconButton>
                      <IconButton size="small" onClick={() => handleDeleteClick(product)} sx={{ color: RED_COLOR, p: { xs: 0.5, sm: 0.8 } }}><DeleteIcon fontSize="small" sx={{ fontSize: { xs: 16, sm: 18 } }} /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={allProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: `1px solid ${theme.palette.divider}`, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
        />
      </TableContainer>

      {/* ── Create / Edit / View Modal ─────────────────────────────────────── */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: { xs: "0.9rem", sm: "1rem" }, py: { xs: 1.5, sm: 2 }, px: { xs: 2, sm: 3 } }}>
          {modalMode === "create" && "Add New Product"}
          {modalMode === "edit" && "Edit Product"}
          {modalMode === "view" && "Product Details"}
        </DialogTitle>

        <Box sx={{ px: { xs: 2, sm: 3 }, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Tabs value={modalTab} onChange={(_, v) => setModalTab(v)} textColor="primary" indicatorColor="primary" sx={{ minHeight: { xs: 36, sm: 40 } }}>
            <Tab label="Product Info" sx={{ minHeight: { xs: 36, sm: 40 }, textTransform: "none", fontSize: { xs: "0.7rem", sm: "0.8rem" } }} />
            <Tab label="Features" sx={{ minHeight: { xs: 36, sm: 40 }, textTransform: "none", fontSize: { xs: "0.7rem", sm: "0.8rem" } }} />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TuneIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                  <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>
                    {`Options${productOptions.length > 0 ? ` (${productOptions.length})` : ""}`}
                  </Typography>
                </Box>
              }
              sx={{ minHeight: { xs: 36, sm: 40 }, textTransform: "none" }}
            />
            {(modalMode === "view" || modalMode === "edit") && (
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <RateReviewIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                    <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>
                      {`Reviews (${reviewsData?.reviewCount ?? selectedProduct?.reviewCount ?? 0})`}
                    </Typography>
                  </Box>
                }
                sx={{ minHeight: { xs: 36, sm: 40 }, textTransform: "none" }}
              />
            )}
          </Tabs>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 }, maxHeight: "calc(90vh - 180px)", overflow: "auto" }}>

            {/* ── TAB 0: Product Info ──────────────────────────────────────── */}
            {modalTab === 0 && (
              <Grid container spacing={3}>
                {/* Left — Images */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ mb: 1 }}>
                      <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>Featured Image</Typography>
                      {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                    </Box>
                    {modalMode !== "view" ? (
                      <>
                        <DropzoneWrapper {...featuredDropzone.getRootProps()} className={featuredDropzone.isDragActive ? "active" : ""}>
                          <input {...featuredDropzone.getInputProps()} />
                          <CloudUpload sx={{ fontSize: 32, color: BLUE_COLOR, mb: 1 }} />
                          <Typography variant="body2" sx={{ color: TEXT_PRIMARY, fontSize: "0.75rem" }}>
                            {featuredDropzone.isDragActive ? "Drop the image here" : "Click or drag to upload"}
                          </Typography>
                          <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.7), fontSize: "0.65rem" }}>Max 5MB • JPG, PNG, WEBP</Typography>
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

                  <Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
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
                            <Typography variant="caption" sx={{ textAlign: "center", px: 0.5, fontSize: "0.65rem" }}>Add Image</Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Grid>

                {/* Right — Product Info */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Paper elevation={0} sx={{ p: 2.5, bgcolor: alpha(BLUE_COLOR, 0.02), borderRadius: 1, border: 1, borderColor: theme.palette.divider }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5, color: TEXT_PRIMARY, fontSize: { xs: "0.85rem", sm: "0.9rem" } }}>Product Information</Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ mb: 0.5 }}>
                          <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: "0.75rem" }}>Title</Typography>
                          {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                        </Box>
                        <Controller name="title" control={control}
                          rules={{ required: "Title is required", minLength: { value: 3, message: "Must be at least 3 characters" }, maxLength: { value: 120, message: "Cannot exceed 120 characters" } }}
                          render={({ field }) => (
                            <StyledTextField {...field} fullWidth size="small" disabled={modalMode === "view"}
                              error={!!errors.title} helperText={errors.title?.message} placeholder="Enter product title"
                              onChange={(e) => { field.onChange(e); markDirty(); }}
                              sx={{ "& .MuiInputBase-input": { fontSize: "0.75rem" } }} />
                          )} />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ mb: 0.5 }}>
                          <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: "0.75rem" }}>Price (৳)</Typography>
                          {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                        </Box>
                        <Controller name="price" control={control}
                          rules={{ required: "Price is required", min: { value: 0, message: "Price cannot be negative" } }}
                          render={({ field }) => (
                            <StyledTextField {...field} fullWidth size="small" type="text" disabled={modalMode === "view"}
                              error={!!errors.price} helperText={errors.price?.message} placeholder="e.g. 29.99"
                              onChange={(e) => { field.onChange(e); markDirty(); }}
                              sx={{ "& .MuiInputBase-input": { fontSize: "0.75rem" } }} />
                          )} />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ mb: 0.5 }}>
                          <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: "0.75rem" }}>Stock Quantity</Typography>
                          {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                        </Box>
                        <Controller name="stock" control={control}
                          rules={{ required: "Stock is required", min: { value: 0, message: "Cannot be negative" } }}
                          render={({ field }) => (
                            <StyledTextField {...field} fullWidth size="small" type="text" disabled={modalMode === "view"}
                              error={!!errors.stock} helperText={errors.stock?.message} placeholder="e.g. 10"
                              InputProps={{ startAdornment: <InputAdornment position="start"><InventoryIcon sx={{ fontSize: 16, color: alpha(TEXT_PRIMARY, 0.4) }} /></InputAdornment> }}
                              onChange={(e) => { field.onChange(e); markDirty(); }}
                              sx={{ "& .MuiInputBase-input": { fontSize: "0.75rem" } }} />
                          )} />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ mb: 0.5 }}><Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: "0.75rem" }}>Category</Typography></Box>
                        <Controller name="category" control={control}
                          render={({ field }) => (
                            <StyledTextField {...field} fullWidth size="small" disabled={modalMode === "view"} placeholder="e.g. Food, Toy, Accessory"
                              onChange={(e) => { field.onChange(e); markDirty(); }} sx={{ "& .MuiInputBase-input": { fontSize: "0.75rem" } }} />
                          )} />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ mb: 0.5 }}><Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: "0.75rem" }}>Material</Typography></Box>
                        <Controller name="material" control={control}
                          render={({ field }) => (
                            <StyledTextField {...field} fullWidth size="small" disabled={modalMode === "view"} placeholder="e.g. Cotton, Plastic, Leather"
                              onChange={(e) => { field.onChange(e); markDirty(); }} sx={{ "& .MuiInputBase-input": { fontSize: "0.75rem" } }} />
                          )} />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ mb: 0.5 }}><Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: "0.75rem" }}>In Stock Status</Typography></Box>
                        <Controller name="inStock" control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={<Switch {...field} checked={field.value} onChange={(e) => { field.onChange(e.target.checked); markDirty(); }} disabled={modalMode === "view"} color="success" size="small" />}
                              label={<Typography variant="body2" sx={{ color: field.value ? GREEN_COLOR : RED_COLOR, fontWeight: 600, fontSize: "0.75rem" }}>{field.value ? "In Stock" : "Out of Stock"}</Typography>}
                            />
                          )} />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ mb: 0.5 }}><Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: "0.75rem" }}>Featured Product</Typography></Box>
                        <Controller name="isFeatured" control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={<Switch {...field} checked={field.value} onChange={(e) => { field.onChange(e.target.checked); markDirty(); }} disabled={modalMode === "view"} color="primary" size="small" />}
                              label={<Typography sx={{ fontSize: "0.75rem" }}>{field.value ? "Mark as Featured" : "Not Featured"}</Typography>}
                            />
                          )} />
                        <FormHelperText sx={{ color: alpha(TEXT_PRIMARY, 0.6), fontSize: "0.65rem" }}>Mark this product as featured to highlight it on the homepage</FormHelperText>
                      </Grid>

                      {/* Discount Section */}
                      <Grid size={{ xs: 12 }}>
                        <Paper elevation={0} sx={{ p: 2, mt: 1, bgcolor: alpha(COLORS.discount, 0.03), borderRadius: 2, border: `1px solid ${alpha(COLORS.discount, 0.2)}` }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            <DiscountIcon sx={{ color: COLORS.discount, fontSize: 20 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: "0.8rem" }}>Discount Settings</Typography>
                            <FormControlLabel
                              control={<Switch size="small" checked={discount.isActive} onChange={(e) => { setDiscount(prev => ({ ...prev, isActive: e.target.checked })); markDirty(); }} disabled={modalMode === "view"} color="success" />}
                              label={<Typography variant="caption" sx={{ fontSize: "0.7rem" }}>Enable Discount</Typography>}
                              sx={{ ml: 1 }}
                            />
                          </Box>
                          {discount.isActive && (
                            <Grid container spacing={2}>
                              <Grid size={{ xs: 6 }}>
                                <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', mb: 0.5, fontSize: "0.7rem" }}>Discount Type</Typography>
                                <FormControl fullWidth size="small" disabled={modalMode === "view"}>
                                  <Select value={discount.type} onChange={(e) => { setDiscount(prev => ({ ...prev, type: e.target.value })); markDirty(); }} sx={{ fontSize: "0.75rem" }}>
                                    <MenuItem value="percentage" sx={{ fontSize: "0.75rem" }}>Percentage (%)</MenuItem>
                                    <MenuItem value="fixed" sx={{ fontSize: "0.75rem" }}>Fixed Amount (৳)</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid size={{ xs: 6 }}>
                                <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', mb: 0.5, fontSize: "0.7rem" }}>
                                  {discount.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount (৳)'}
                                </Typography>
                                <TextField fullWidth size="small" type="text" value={discount.value}
                                  onChange={(e) => { setDiscount(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 })); markDirty(); }}
                                  disabled={modalMode === "view"}
                                  InputProps={{ endAdornment: <InputAdornment position="end"><Typography sx={{ fontSize: "0.7rem" }}>{discount.type === 'percentage' ? '%' : '৳'}</Typography></InputAdornment> }}
                                  sx={{ "& .MuiInputBase-input": { fontSize: "0.75rem" } }} />
                              </Grid>
                              <Grid size={{ xs: 6 }}>
                                <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', mb: 0.5, fontSize: "0.7rem" }}>Start Date (Optional)</Typography>
                                <TextField fullWidth size="small" type="date" value={discount.startDate ? discount.startDate.split('T')[0] : ''}
                                  onChange={(e) => { setDiscount(prev => ({ ...prev, startDate: e.target.value })); markDirty(); }}
                                  disabled={modalMode === "view"} InputLabelProps={{ shrink: true }} sx={{ "& .MuiInputBase-input": { fontSize: "0.75rem" } }} />
                              </Grid>
                              <Grid size={{ xs: 6 }}>
                                <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', mb: 0.5, fontSize: "0.7rem" }}>End Date (Optional)</Typography>
                                <TextField fullWidth size="small" type="date" value={discount.endDate ? discount.endDate.split('T')[0] : ''}
                                  onChange={(e) => { setDiscount(prev => ({ ...prev, endDate: e.target.value })); markDirty(); }}
                                  disabled={modalMode === "view"} InputLabelProps={{ shrink: true }} sx={{ "& .MuiInputBase-input": { fontSize: "0.75rem" } }} />
                              </Grid>
                              {discount.value > 0 && priceValue > 0 && (
                                <Grid size={{ xs: 12 }}>
                                  <Box sx={{ p: 1.5, bgcolor: alpha(COLORS.discount, 0.1), borderRadius: 1 }}>
                                    <Typography variant="caption" sx={{ color: TEXT_PRIMARY, fontWeight: 500, fontSize: "0.75rem" }}>
                                      Final Price: <strong style={{ color: COLORS.discount, fontSize: '0.85rem' }}>৳{calculateDiscountedPrice.toFixed(2)}</strong>
                                      {discount.type === 'percentage' && ` (${discount.value}% off)`}
                                      {discount.type === 'fixed' && ` (${discount.value}৳ off)`}
                                      {discountPercentage > 0 && ` • ${discountPercentage.toFixed(0)}% savings`}
                                    </Typography>
                                  </Box>
                                </Grid>
                              )}
                            </Grid>
                          )}
                        </Paper>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ mb: 1 }}>
                          <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: "0.75rem" }}>Description</Typography>
                          {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                        </Box>
                        {modalMode !== "view" ? (
                          <Box sx={{ "& .quill": { "& .ql-toolbar": { borderColor: theme.palette.divider, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: alpha(BLUE_COLOR, 0.02) }, "& .ql-container": { borderColor: theme.palette.divider, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, minHeight: 120, fontSize: "0.75rem", backgroundColor: theme.palette.background.paper }, "& .ql-editor": { minHeight: 120, fontSize: "0.75rem" } } }}>
                            <ReactQuill value={description} onChange={(val) => { setDescription(val); markDirty(); }} theme="snow" modules={quillModules} formats={quillFormats} placeholder="Enter product description..." />
                          </Box>
                        ) : (
                          <Box sx={{ mt: 1, fontSize: "0.75rem", color: alpha(TEXT_PRIMARY, 0.85), "& p": { margin: 0 } }} dangerouslySetInnerHTML={{ __html: description || "<p>No description provided.</p>" }} />
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* ── TAB 1: Features ──────────────────────────────────────────── */}
            {modalTab === 1 && (
              <Box>
                <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7), mb: 2, fontSize: "0.75rem" }}>
                  Use this section to highlight product features, bullet points, or any additional information shown in the "Features" tab on the product page.
                </Typography>
                {modalMode !== "view" ? (
                  <Box sx={{ "& .quill": { "& .ql-toolbar": { borderColor: theme.palette.divider, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: alpha(BLUE_COLOR, 0.02) }, "& .ql-container": { borderColor: theme.palette.divider, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, minHeight: 300, fontSize: "0.75rem", backgroundColor: theme.palette.background.paper }, "& .ql-editor": { minHeight: 300, fontSize: "0.75rem" } } }}>
                    <ReactQuill value={features} onChange={(val) => { setFeatures(val); markDirty(); }} theme="snow" modules={quillModules} formats={quillFormats} placeholder="Add product features, highlights, specifications..." />
                  </Box>
                ) : (
                  <Paper elevation={0} sx={{ p: 2.5, bgcolor: alpha(BLUE_COLOR, 0.02), borderRadius: 1, border: 1, borderColor: theme.palette.divider }}>
                    <Box sx={{ fontSize: "0.75rem", color: alpha(TEXT_PRIMARY, 0.85), "& p": { margin: 0 }, "& ul, & ol": { paddingLeft: "1.5rem" } }} dangerouslySetInnerHTML={{ __html: features || "<p>No features provided.</p>" }} />
                  </Paper>
                )}
              </Box>
            )}

            {/* ── TAB 2: Product Options ───────────────────────────────────── */}
            {modalTab === 2 && (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: "0.8rem" }}>Product Options</Typography>
                    <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.6), fontSize: "0.65rem" }}>
                      Add options like size, color, material — each can have multiple values with optional price modifiers.
                    </Typography>
                  </Box>
                  {modalMode !== "view" && (
                    <GradientButton size="small" startIcon={<AddOptionIcon />} onClick={addOption} sx={{ fontSize: "0.7rem" }}>Add Option</GradientButton>
                  )}
                </Box>

                {productOptions.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 6, border: `2px dashed ${theme.palette.divider}`, borderRadius: 2 }}>
                    <TuneIcon sx={{ fontSize: 48, color: alpha(TEXT_PRIMARY, 0.15), mb: 1 }} />
                    <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontSize: "0.75rem" }}>
                      {modalMode === "view" ? "No options configured for this product." : 'No options yet. Click "Add Option" to create one.'}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {productOptions.map((option, optIdx) => (
                      <Paper key={option.id} elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, bgcolor: alpha(BLUE_COLOR, 0.01) }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 500, color: alpha(TEXT_PRIMARY, 0.7), mb: 0.5, display: "block", fontSize: "0.65rem" }}>Option Name</Typography>
                            {modalMode !== "view" ? (
                              <StyledTextField fullWidth size="small" value={option.name} onChange={(e) => updateOptionName(option.id, e.target.value)} placeholder="Option name..." sx={{ "& .MuiInputBase-input": { fontSize: "0.7rem" } }} />
                            ) : (
                              <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: "0.75rem" }}>{option.name || "—"}</Typography>
                            )}
                          </Box>
                          {modalMode !== "view" && (
                            <Tooltip title="Remove this option" arrow>
                              <IconButton size="small" onClick={() => removeOption(option.id)} sx={{ color: RED_COLOR, mt: 2.5, "&:hover": { bgcolor: alpha(RED_COLOR, 0.1) } }}>
                                <RemoveOptionIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                        <Divider sx={{ mb: 1.5 }} />
                        <Typography variant="caption" sx={{ fontWeight: 500, color: alpha(TEXT_PRIMARY, 0.7), mb: 1, display: "block", fontSize: "0.65rem" }}>Values</Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          {option.values.map((val, valIdx) => (
                            <Box key={val.id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box sx={{ minWidth: 24, height: 24, borderRadius: "50%", bgcolor: alpha(BLUE_COLOR, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: BLUE_COLOR, fontSize: 10 }}>{valIdx + 1}</Typography>
                              </Box>
                              {modalMode !== "view" ? (
                                <>
                                  <StyledTextField size="small" fullWidth value={val.value} onChange={(e) => updateOptionValue(option.id, val.id, "value", e.target.value)} placeholder="Value (e.g. Red, Large, Cotton)" sx={{ flex: 2, "& .MuiInputBase-input": { fontSize: "0.7rem" } }} />
                                  <StyledTextField size="small" type="number" value={val.priceModifier} onChange={(e) => updateOptionValue(option.id, val.id, "priceModifier", parseFloat(e.target.value) || 0)} placeholder="±Price" sx={{ width: 110, flexShrink: 0, "& .MuiInputBase-input": { fontSize: "0.7rem" } }}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: "0.7rem" }}>৳</Typography></InputAdornment> }} />
                                  <Tooltip title="Remove value" arrow>
                                    <IconButton size="small" onClick={() => removeOptionValue(option.id, val.id)} disabled={option.values.length === 1}
                                      sx={{ color: RED_COLOR, flexShrink: 0, "&:hover": { bgcolor: alpha(RED_COLOR, 0.1) }, "&.Mui-disabled": { color: alpha(TEXT_PRIMARY, 0.2) } }}>
                                      <CloseIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                                  <Chip label={val.value || "—"} size="small" sx={{ fontSize: "0.7rem" }} />
                                  {val.priceModifier !== 0 && (
                                    <Chip label={`${val.priceModifier > 0 ? "+" : ""}৳${val.priceModifier}`} size="small"
                                      sx={{ fontSize: "0.6rem", bgcolor: val.priceModifier > 0 ? alpha(GREEN_COLOR, 0.1) : alpha(RED_COLOR, 0.1), color: val.priceModifier > 0 ? GREEN_COLOR : RED_COLOR }} />
                                  )}
                                </Box>
                              )}
                            </Box>
                          ))}
                          {modalMode !== "view" && (
                            <Button size="small" startIcon={<AddOptionIcon sx={{ fontSize: 14 }} />} onClick={() => addOptionValue(option.id)}
                              sx={{ alignSelf: "flex-start", textTransform: "none", fontSize: "0.7rem", color: BLUE_COLOR, mt: 0.5, px: 1 }}>
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

            {/* ── TAB 3: Reviews ───────────────────────────────────────────── */}
            {modalTab === 3 && (
              <Box>
                {/* Summary row */}
                {reviewsData && reviewsData.reviewCount > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, p: 2, bgcolor: alpha(BLUE_COLOR, 0.04), borderRadius: 1 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.dark, fontSize: { xs: "1.5rem", sm: "1.8rem" } }}>
                        {typeof reviewsData.averageRating === 'number' ? reviewsData.averageRating.toFixed(1) : reviewsData.averageRating}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>out of 5</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: "0.8rem" }}>
                        {reviewsData.reviewCount} review{reviewsData.reviewCount !== 1 ? "s" : ""}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.25 }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <StarIcon key={s} sx={{ fontSize: 14, color: s <= Math.round(reviewsData.averageRating) ? theme.palette.warning.main : alpha(TEXT_PRIMARY, 0.2) }} />
                        ))}
                      </Box>
                    </Box>
                    {/* Legend */}
                    <Box sx={{ ml: "auto", display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Chip size="small" label="Approved" sx={{ fontSize: "0.65rem", height: 20, bgcolor: alpha(GREEN_COLOR, 0.1), color: GREEN_COLOR }} />
                      <Chip size="small" label="Pending" sx={{ fontSize: "0.65rem", height: 20, bgcolor: alpha(COLORS.warning, 0.1), color: COLORS.warning }} />
                    </Box>
                  </Box>
                )}

                {/* Loading */}
                {reviewsLoading && (
                  <Box sx={{ textAlign: "center", py: 4 }}><CircularProgress size={28} sx={{ color: BLUE_COLOR }} /></Box>
                )}

                {/* Empty */}
                {!reviewsLoading && reviewsData && reviewsData.reviews.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <RateReviewIcon sx={{ fontSize: 48, color: alpha(TEXT_PRIMARY, 0.2), mb: 1 }} />
                    <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7), fontSize: "0.75rem" }}>No reviews yet.</Typography>
                  </Box>
                )}

                {/* Review list — shows ALL reviews (approved + pending) for admin */}
                {!reviewsLoading && reviewsData?.reviews.map((review) => (
                  <Paper key={review._id} elevation={0}
                    sx={{
                      p: 2, mb: 1.5, borderRadius: 1,
                      border: `1px solid ${review.approved ? alpha(GREEN_COLOR, 0.3) : alpha(COLORS.warning, 0.3)}`,
                      bgcolor: review.approved ? alpha(GREEN_COLOR, 0.02) : alpha(COLORS.warning, 0.02),
                    }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                      {/* Left: review content */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: "0.8rem" }}>{review.name}</Typography>
                          <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontSize: "0.65rem" }}>{review.email}</Typography>
                          <Chip
                            size="small"
                            label={review.approved ? "Approved" : "Pending"}
                            sx={{
                              fontSize: "0.6rem", height: 18,
                              bgcolor: review.approved ? alpha(GREEN_COLOR, 0.12) : alpha(COLORS.warning, 0.12),
                              color: review.approved ? GREEN_COLOR : COLORS.warning,
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", gap: 0.25, mb: 0.5 }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon key={s} sx={{ fontSize: 12, color: s <= review.rating ? theme.palette.warning.main : alpha(TEXT_PRIMARY, 0.2) }} />
                          ))}
                        </Box>
                        <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.8), fontSize: "0.75rem", mb: 0.5 }}>{review.comment}</Typography>
                        <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.4), fontSize: "0.6rem" }}>
                          {new Date(review.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </Typography>
                      </Box>

                      {/* Right: action buttons */}
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flexShrink: 0 }}>
                        {/* Approve / Unapprove toggle */}
                        {!review.approved && (
                          <Tooltip title="Approve this review" arrow>
                            <IconButton size="small"
                              onClick={() => approveReviewMutation.mutate({ productId: selectedProduct._id, reviewId: review._id })}
                              disabled={approveReviewMutation.isPending}
                              sx={{ color: GREEN_COLOR, "&:hover": { bgcolor: alpha(GREEN_COLOR, 0.1) } }}>
                              {approveReviewMutation.isPending && approveReviewMutation.variables?.reviewId === review._id
                                ? <CircularProgress size={14} />
                                : <CheckIcon sx={{ fontSize: 16 }} />}
                            </IconButton>
                          </Tooltip>
                        )}
                        {/* Delete */}
                        <Tooltip title="Delete this review" arrow>
                          <IconButton size="small"
                            onClick={() => deleteReviewMutation.mutate({ productId: selectedProduct._id, reviewId: review._id })}
                            disabled={deleteReviewMutation.isPending}
                            sx={{ color: RED_COLOR, "&:hover": { bgcolor: alpha(RED_COLOR, 0.1) } }}>
                            {deleteReviewMutation.isPending && deleteReviewMutation.variables?.reviewId === review._id
                              ? <CircularProgress size={14} />
                              : <DeleteIcon sx={{ fontSize: 16 }} />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 }, borderTop: `1px solid ${theme.palette.divider}` }}>
            <OutlineButton onClick={handleCloseModal} size="small" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
              {modalMode === "view" ? "Close" : "Cancel"}
            </OutlineButton>
            {modalMode !== "view" && (
              <GradientButton type="submit" size="small" disabled={isSubmitDisabled()} sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                {createMutation.isPending || updateMutation.isPending
                  ? <CircularProgress size={16} sx={{ color: "white" }} />
                  : modalMode === "create" ? "Add Product" : "Update Product"}
              </GradientButton>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}