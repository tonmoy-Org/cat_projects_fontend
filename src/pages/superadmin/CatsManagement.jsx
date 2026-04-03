import React from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, IconButton, Chip, Dialog,
    DialogTitle, DialogContent, DialogActions, Grid, FormControl, Select,
    MenuItem, FormControlLabel, Switch, alpha, useTheme, CircularProgress,
    Avatar, FormHelperText, Button, Tabs, Tab, Tooltip, Divider, TextField,
    InputAdornment, useMediaQuery,
} from '@mui/material';
import {
    Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
    Visibility as VisibilityIcon, Pets as PetsIcon, Female as FemaleIcon,
    Male as MaleIcon, CloudUpload, Image as ImageIcon, AddPhotoAlternate,
    Star as StarIcon, RateReview as RateReviewIcon, Check as CheckIcon,
    Close as CloseIcon, Favorite as FavoriteIcon, LocalOffer as PriceIcon,
    Inventory as InventoryIcon, Save as SaveIcon,
    AddCircleOutline as AddOptionIcon, RemoveCircleOutline as RemoveOptionIcon,
    Tune as TuneIcon, Discount as DiscountIcon,
} from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import GradientButton from '../../components/ui/GradientButton';
import OutlineButton from '../../components/ui/OutlineButton';
import StyledTextField from '../../components/ui/StyledTextField';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useCatsManagement } from '../../hooks/usePetApi';

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    purple: '#8b5cf6',
    pink: '#ec407a',
    text: '#1f2937',
    border: '#e5e7eb',
    bg: '#f9fafb',
    discount: '#10b981',
};

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        [{ color: [] }],
        ['clean'],
    ],
};

const quillFormats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'color'];

// ─── Styled Components ────────────────────────────────────────────────────────

const DropzoneWrapper = styled('div')(({ theme }) => ({
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.5),
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(['background-color', 'border-color']),
    '&:hover': { borderColor: theme.palette.primary.dark, backgroundColor: theme.palette.action.hover },
    '&.active': { borderColor: theme.palette.primary.main, backgroundColor: theme.palette.action.selected },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1) },
}));

const PreviewWrapper = styled('div')(({ theme }) => ({
    position: 'relative',
    display: 'inline-block',
    marginTop: theme.spacing(1),
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    boxShadow: theme.shadows[1],
}));

const RequiredAsterisk = styled('span')(({ theme }) => ({
    color: theme.palette.error.main,
    marginLeft: 1,
}));

const StatCard = styled(Box)(({ theme }) => ({
    backgroundColor: '#fff',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: theme.spacing(1.5, 2),
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        transform: 'translateY(-2px)',
    },
    [theme.breakpoints.up('sm')]: { padding: theme.spacing(2, 2.5), gap: 16 },
    [theme.breakpoints.up('md')]: { padding: theme.spacing(2.5, 3) },
}));

const StatIcon = styled(Box)(({ color, theme }) => ({
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(color, 0.1),
    color: color,
    fontSize: 18,
    [theme.breakpoints.up('sm')]: { width: 40, height: 40, fontSize: 20 },
    [theme.breakpoints.up('md')]: { width: 44, height: 44, fontSize: 22 },
}));

const StatValue = styled(Typography)(({ theme }) => ({
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.text,
    lineHeight: 1,
    margin: 0,
    [theme.breakpoints.up('sm')]: { fontSize: 18 },
    [theme.breakpoints.up('md')]: { fontSize: 20 },
}));

const StatLabel = styled(Typography)(({ theme }) => ({
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: 500,
    [theme.breakpoints.up('sm')]: { fontSize: 11 },
    [theme.breakpoints.up('md')]: { fontSize: 12 },
}));

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CatsManagement() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const BLUE_COLOR = theme.palette.primary.main;
    const RED_COLOR = theme.palette.error.main;
    const GREEN_COLOR = theme.palette.success.main;
    const TEXT_PRIMARY = theme.palette.text.primary;
    const PINK_COLOR = '#ec407a';

    const {
        // Data
        cats, paginatedCats, stats, catsLoading,

        // Pagination
        page, rowsPerPage, handleChangePage, handleChangeRowsPerPage,

        // Modal
        openModal, modalMode, modalTab, setModalTab,
        selectedCat, setSelectedCat,
        handleOpenModal, handleCloseModal, syncSelectedCat,

        // Delete Dialog
        deleteDialogOpen, catToDelete,
        handleDeleteClick, handleDeleteConfirm, handleDeleteCancel,

        // Form
        control, handleSubmit, watch, errors, onSubmit, isSubmitDisabled,

        // Images
        featuredPreview, galleryItems,
        featuredDropzone, galleryDropzone,
        handleRemoveFeatured, handleRemoveGallery,

        // Features
        features, setFeatures,

        // Discount
        discount, handleDiscountChange,
        calculateDiscountedPrice, discountPercentage, priceValue,

        // Product Options
        productOptions,
        addOption, removeOption, updateOptionName,
        addOptionValue, removeOptionValue, updateOptionValue,

        // Inline stock edit
        editingStockId, stockInputValue, setStockInputValue,
        handleStockEditStart, handleStockSave, handleStockKeyDown,

        // Reviews
        reviews, reviewCount, averageRating,

        // Mutations
        createCatMutation, updateCatMutation, deleteCatMutation,
        updateStockMutation, toggleInStockMutation,
        deleteReviewMutation, toggleReviewApprovalMutation,

        // Constants
        MAX_GALLERY_IMAGES,
    } = useCatsManagement();

    // Sync selectedCat when cats query data updates
    React.useEffect(() => {
        syncSelectedCat();
    }, [syncSelectedCat]);

    const getGenderIcon = (gender) =>
        gender === 'female'
            ? <FemaleIcon sx={{ color: RED_COLOR, fontSize: 16 }} />
            : <MaleIcon sx={{ color: BLUE_COLOR, fontSize: 16 }} />;

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <Box>
            <Helmet>
                <title>Cat Management - FatherOfMeow</title>
                <meta name="description" content="Manage your cat profiles" />
            </Helmet>

            {/* ── Delete Dialog ──────────────────────────────────────────────── */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' }, py: { xs: 1.5, sm: 2 }, px: { xs: 2, sm: 3 } }}>
                    Confirm Delete
                </DialogTitle>
                <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
                    <Typography variant="body2" sx={{ color: TEXT_PRIMARY, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                        Are you sure you want to delete "<strong>{catToDelete?.name}</strong>"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
                    <OutlineButton onClick={handleDeleteCancel} size="small" disabled={deleteCatMutation.isPending}>
                        Cancel
                    </OutlineButton>
                    <Button onClick={handleDeleteConfirm} size="small" variant="contained" color="error" disabled={deleteCatMutation.isPending}>
                        {deleteCatMutation.isPending ? <CircularProgress size={16} sx={{ color: 'white' }} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Header ────────────────────────────────────────────────────── */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
                <Box>
                    <Typography sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        Cat Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7), fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                        Manage your cat profiles and inventory
                    </Typography>
                </Box>
                <GradientButton variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal('create')} size="small" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Add New Cat
                </GradientButton>
            </Box>

            {/* ── Statistics Cards ───────────────────────────────────────────── */}
            <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 3 }}>
                {[
                    { label: 'Total Cats', value: stats.totalCats, icon: <PetsIcon />, color: COLORS.primary, trend: `${stats.uniqueBreeds} breeds` },
                    { label: 'In Stock', value: stats.inStockCount, icon: <CheckIcon />, color: COLORS.success, trend: `${stats.stockPercentage}% available` },
                    { label: 'Out of Stock', value: stats.outOfStockCount, icon: <CloseIcon />, color: COLORS.danger, trend: `${stats.totalCats > 0 ? ((stats.outOfStockCount / stats.totalCats) * 100).toFixed(1) : 0}% unavailable` },
                    { label: 'Total Stock Units', value: stats.totalStock, icon: <InventoryIcon />, color: COLORS.info, trend: `Across ${stats.totalCats} cats` },
                    { label: 'Featured', value: stats.featuredCount, icon: <FavoriteIcon />, color: COLORS.pink, trend: `${stats.totalCats > 0 ? ((stats.featuredCount / stats.totalCats) * 100).toFixed(1) : 0}% featured` },
                    { label: 'On Discount', value: stats.catsWithDiscount, icon: <DiscountIcon />, color: COLORS.discount, trend: `${stats.catsWithDiscount} cats on sale` },
                    { label: 'Female', value: stats.femaleCount, icon: <FemaleIcon />, color: COLORS.danger, trend: `${stats.totalCats > 0 ? ((stats.femaleCount / stats.totalCats) * 100).toFixed(1) : 0}% female` },
                    { label: 'Male', value: stats.maleCount, icon: <MaleIcon />, color: COLORS.primary, trend: `${stats.totalCats > 0 ? ((stats.maleCount / stats.totalCats) * 100).toFixed(1) : 0}% male` },
                    { label: 'Avg Price', value: `৳${stats.avgPrice.toFixed(0)}`, icon: <PriceIcon />, color: COLORS.success, trend: `Min: ৳${stats.minPrice.toFixed(0)} • Max: ৳${stats.maxPrice.toFixed(0)}` },
                    { label: 'Avg Rating', value: stats.avgRating, icon: <StarIcon />, color: COLORS.warning, trend: `${stats.totalReviews} reviews from ${stats.catsWithReviews} cats` },
                    { label: 'Total Reviews', value: stats.totalReviews, icon: <RateReviewIcon />, color: COLORS.primary, trend: `${stats.approvedReviews} approved • ${stats.pendingReviews} pending` },
                    { label: 'Neutered', value: stats.neuteredCount, icon: <CheckIcon />, color: COLORS.info, trend: `${stats.totalCats > 0 ? ((stats.neuteredCount / stats.totalCats) * 100).toFixed(1) : 0}% neutered` },
                    { label: 'Vaccinated', value: stats.vaccinatedCount, icon: <CheckIcon />, color: COLORS.success, trend: `${stats.totalCats > 0 ? ((stats.vaccinatedCount / stats.totalCats) * 100).toFixed(1) : 0}% vaccinated` },
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

            {/* ── Table ─────────────────────────────────────────────────────── */}
            <TableContainer component={Paper} elevation={0}
                sx={{ borderRadius: 1, border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, overflow: 'auto' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: alpha(BLUE_COLOR, 0.05) }}>
                            {(isMobile
                                ? ['Image', 'Name', 'Price', 'Stock']
                                : ['Image', 'Name', 'Gender', 'Price', 'Discounted', 'Breed', 'Stock', 'In Stock', 'Featured', 'Status', 'Reviews']
                            ).map((label) => (
                                <TableCell key={label} sx={{ fontWeight: 600, color: TEXT_PRIMARY, borderBottom: `1px solid ${theme.palette.divider}`, py: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.7rem', sm: '0.75rem' }, whiteSpace: 'nowrap' }}>
                                    {label}
                                </TableCell>
                            ))}
                            <TableCell align="right" sx={{ fontWeight: 600, color: TEXT_PRIMARY, borderBottom: `1px solid ${theme.palette.divider}`, py: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {catsLoading ? (
                            <TableRow>
                                <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                                    <CircularProgress size={28} sx={{ color: BLUE_COLOR }} />
                                </TableCell>
                            </TableRow>
                        ) : paginatedCats.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                                    <PetsIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: alpha(TEXT_PRIMARY, 0.2), mb: 1 }} />
                                    <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7), fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                        No cat profiles found. Add one to get started.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedCats.map((cat) => {
                                const hasDiscount = cat.discount?.isActive && cat.discount.value > 0;
                                const discountedPrice = cat.discountedPrice || cat.price;
                                return (
                                    <TableRow key={cat._id} hover sx={{ '&:hover': { backgroundColor: alpha(BLUE_COLOR, 0.03) }, '&:last-child td': { borderBottom: 0 } }}>

                                        {/* Image */}
                                        <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                                            {cat.featuredImage ? (
                                                <Avatar src={cat.featuredImage} alt={cat.name}
                                                    sx={{ width: { xs: 32, sm: 36, md: 40 }, height: { xs: 32, sm: 36, md: 40 }, borderRadius: 1, cursor: 'pointer' }}
                                                    onClick={() => handleOpenModal('view', cat)} />
                                            ) : (
                                                <Box sx={{ width: { xs: 32, sm: 36, md: 40 }, height: { xs: 32, sm: 36, md: 40 }, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: alpha(BLUE_COLOR, 0.05), borderRadius: 1, border: `1px dashed ${theme.palette.divider}` }}>
                                                    <ImageIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: alpha(TEXT_PRIMARY, 0.3) }} />
                                                </Box>
                                            )}
                                        </TableCell>

                                        {/* Name */}
                                        <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                                                {cat.name}
                                            </Typography>
                                            {!isMobile && (
                                                <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontSize: '0.65rem' }}>
                                                    {cat.title_id}
                                                </Typography>
                                            )}
                                        </TableCell>

                                        {/* Gender */}
                                        {!isMobile && (
                                            <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    {getGenderIcon(cat.gender)}
                                                    <Typography variant="body2" sx={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
                                                        {cat.gender}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        )}

                                        {/* Price */}
                                        <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                                            <Chip label={`৳${parseFloat(cat.price || 0).toFixed(2)}`} size="small"
                                                sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.7rem' }, height: { xs: 20, sm: 22 }, backgroundColor: alpha(GREEN_COLOR, 0.1), color: GREEN_COLOR }} />
                                        </TableCell>

                                        {/* Discounted Price */}
                                        {!isMobile && (
                                            <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                                                {hasDiscount ? (
                                                    <Box>
                                                        <Chip label={`৳${discountedPrice.toFixed(2)}`} size="small"
                                                            sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.7rem' }, height: { xs: 20, sm: 22 }, backgroundColor: alpha(COLORS.discount, 0.1), color: COLORS.discount }} />
                                                        <Chip
                                                            label={`-${cat.discount.type === 'percentage' ? cat.discount.value : ((cat.discount.value / cat.price) * 100).toFixed(0)}%`}
                                                            size="small"
                                                            sx={{ fontWeight: 600, fontSize: '0.6rem', height: 16, ml: 0.5, backgroundColor: alpha(COLORS.discount, 0.2), color: COLORS.discount }} />
                                                    </Box>
                                                ) : (
                                                    <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.4), fontSize: '0.7rem' }}>—</Typography>
                                                )}
                                            </TableCell>
                                        )}

                                        {/* Breed */}
                                        {!isMobile && (
                                            <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                                                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{cat.breed}</Typography>
                                            </TableCell>
                                        )}

                                        {/* Stock (inline editable) */}
                                        <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                                            {editingStockId === cat._id ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <TextField
                                                        size="small" type="text"
                                                        value={stockInputValue}
                                                        onChange={(e) => setStockInputValue(e.target.value)}
                                                        onKeyDown={(e) => handleStockKeyDown(e, cat)}
                                                        autoFocus
                                                        inputProps={{ min: 0, style: { padding: '2px 4px', width: 50, fontSize: 11 } }}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1, fontSize: '0.7rem' } }} />
                                                    <IconButton size="small" onClick={() => handleStockSave(cat)}
                                                        disabled={updateStockMutation.isPending}
                                                        sx={{ color: GREEN_COLOR, p: 0.4 }}>
                                                        {updateStockMutation.isPending && updateStockMutation.variables?.id === cat._id
                                                            ? <CircularProgress size={12} /> : <SaveIcon sx={{ fontSize: 14 }} />}
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => setStockInputValue('')}
                                                        sx={{ color: RED_COLOR, p: 0.4 }}>
                                                        <CloseIcon sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Box>
                                            ) : (
                                                <Tooltip title="Click to edit stock" arrow>
                                                    <Box onClick={() => handleStockEditStart(cat)}
                                                        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', px: 0.5, py: 0.25, borderRadius: 1, '&:hover': { bgcolor: alpha(BLUE_COLOR, 0.04) } }}>
                                                        <InventoryIcon sx={{ fontSize: { xs: 12, sm: 14 }, color: alpha(TEXT_PRIMARY, 0.5) }} />
                                                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                                            {cat.stock ?? 0}
                                                        </Typography>
                                                        <EditIcon sx={{ fontSize: { xs: 10, sm: 12 }, color: alpha(TEXT_PRIMARY, 0.3) }} />
                                                    </Box>
                                                </Tooltip>
                                            )}
                                        </TableCell>

                                        {/* In Stock Toggle */}
                                        {!isMobile && (
                                            <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                                                <Tooltip title={cat.inStock ? 'Mark as Out of Stock' : 'Mark as In Stock'} arrow>
                                                    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                                        {toggleInStockMutation.isPending && toggleInStockMutation.variables?.id === cat._id ? (
                                                            <CircularProgress size={16} />
                                                        ) : (
                                                            <Switch size="small" checked={!!cat.inStock}
                                                                onChange={(e) => toggleInStockMutation.mutate({ id: cat._id, inStock: e.target.checked })}
                                                                color={cat.inStock ? 'success' : 'default'} />
                                                        )}
                                                        <Typography variant="caption" sx={{ color: cat.inStock ? GREEN_COLOR : RED_COLOR, fontWeight: 600, ml: 0.5, fontSize: '0.65rem' }}>
                                                            {cat.inStock ? 'Yes' : 'No'}
                                                        </Typography>
                                                    </Box>
                                                </Tooltip>
                                            </TableCell>
                                        )}

                                        {/* Featured */}
                                        {!isMobile && (
                                            <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                                                {cat.isFeatured
                                                    ? <FavoriteIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: PINK_COLOR }} />
                                                    : <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.4), fontSize: '0.7rem' }}>—</Typography>}
                                            </TableCell>
                                        )}

                                        {/* Status */}
                                        {!isMobile && (
                                            <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                                                <Chip label={cat.status} size="small" sx={{ fontSize: '0.65rem', height: 20, backgroundColor: alpha(BLUE_COLOR, 0.1), color: BLUE_COLOR }} />
                                            </TableCell>
                                        )}

                                        {/* Reviews */}
                                        {!isMobile && (
                                            <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <RateReviewIcon sx={{ fontSize: { xs: 12, sm: 14 }, color: alpha(TEXT_PRIMARY, 0.5) }} />
                                                    <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{cat.reviews?.length || 0}</Typography>
                                                    {cat.reviews?.length > 0 && (
                                                        <Typography variant="caption" sx={{ color: theme.palette.warning.dark, fontSize: '0.7rem' }}>
                                                            ★ {(cat.reviews.reduce((sum, r) => sum + r.rating, 0) / cat.reviews.length).toFixed(1)}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        )}

                                        {/* Actions */}
                                        <TableCell align="right" sx={{ py: { xs: 0.5, sm: 1 } }}>
                                            <IconButton size="small" onClick={() => handleOpenModal('view', cat)} sx={{ color: BLUE_COLOR, mr: 0.5, p: { xs: 0.5, sm: 0.8 } }}>
                                                <VisibilityIcon fontSize="small" sx={{ fontSize: { xs: 16, sm: 18 } }} />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleOpenModal('edit', cat)} sx={{ color: BLUE_COLOR, mr: 0.5, p: { xs: 0.5, sm: 0.8 } }}>
                                                <EditIcon fontSize="small" sx={{ fontSize: { xs: 16, sm: 18 } }} />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDeleteClick(cat)} sx={{ color: RED_COLOR, p: { xs: 0.5, sm: 0.8 } }}>
                                                <DeleteIcon fontSize="small" sx={{ fontSize: { xs: 16, sm: 18 } }} />
                                            </IconButton>
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
                    count={cats.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ borderTop: `1px solid ${theme.palette.divider}`, fontSize: { xs: '0.7rem', sm: '0.75rem' } }} />
            </TableContainer>

            {/* ── Modal ─────────────────────────────────────────────────────── */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' }, py: { xs: 1.5, sm: 2 }, px: { xs: 2, sm: 3 } }}>
                    {modalMode === 'create' && 'Add New Cat'}
                    {modalMode === 'edit' && 'Edit Cat Profile'}
                    {modalMode === 'view' && 'Cat Details'}
                </DialogTitle>

                {/* Tabs */}
                <Box sx={{ px: { xs: 2, sm: 3 }, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Tabs value={modalTab} onChange={(_, v) => setModalTab(v)} textColor="primary" indicatorColor="primary" sx={{ minHeight: { xs: 36, sm: 40 } }}>
                        <Tab label="Cat Info" sx={{ minHeight: { xs: 36, sm: 40 }, textTransform: 'none', fontSize: { xs: '0.7rem', sm: '0.8rem' } }} />
                        <Tab label="Features" sx={{ minHeight: { xs: 36, sm: 40 }, textTransform: 'none', fontSize: { xs: '0.7rem', sm: '0.8rem' } }} />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <TuneIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                                    <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                                        {`Options${productOptions.length > 0 ? ` (${productOptions.length})` : ''}`}
                                    </Typography>
                                </Box>
                            }
                            sx={{ minHeight: { xs: 36, sm: 40 }, textTransform: 'none' }} />
                        {(modalMode === 'view' || modalMode === 'edit') && (
                            <Tab label={`Reviews (${reviewCount})`} sx={{ minHeight: { xs: 36, sm: 40 }, textTransform: 'none', fontSize: { xs: '0.7rem', sm: '0.8rem' } }} />
                        )}
                    </Tabs>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 }, maxHeight: 'calc(90vh - 180px)', overflow: 'auto' }}>

                        {/* ── TAB 0: Cat Info ────────────────────────────────── */}
                        {modalTab === 0 && (
                            <Grid container spacing={2}>
                                {/* Left — Images */}
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ mb: 0.5 }}>
                                            <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                                                Featured Image
                                            </Typography>
                                            {modalMode === 'create' && <RequiredAsterisk>*</RequiredAsterisk>}
                                        </Box>
                                        {modalMode !== 'view' ? (
                                            <>
                                                <DropzoneWrapper {...featuredDropzone.getRootProps()} className={featuredDropzone.isDragActive ? 'active' : ''}>
                                                    <input {...featuredDropzone.getInputProps()} />
                                                    <CloudUpload sx={{ fontSize: 28, color: BLUE_COLOR, mb: 0.5 }} />
                                                    <Typography variant="body2" sx={{ color: TEXT_PRIMARY, fontSize: '0.7rem' }}>
                                                        {featuredDropzone.isDragActive ? 'Drop the image here' : 'Click or drag to upload'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.7), fontSize: '0.6rem' }}>
                                                        Max 5MB • JPG, PNG, WEBP
                                                    </Typography>
                                                </DropzoneWrapper>
                                                {featuredPreview && (
                                                    <PreviewWrapper>
                                                        <img src={featuredPreview} alt="Featured" style={{ width: '100%', maxHeight: 180, objectFit: 'cover' }} />
                                                        <IconButton onClick={handleRemoveFeatured} size="small"
                                                            sx={{ position: 'absolute', top: 4, right: 4, bgcolor: RED_COLOR, color: 'white', '&:hover': { bgcolor: alpha(RED_COLOR, 0.8) }, width: 24, height: 24 }}>
                                                            <DeleteIcon sx={{ fontSize: 14 }} />
                                                        </IconButton>
                                                    </PreviewWrapper>
                                                )}
                                            </>
                                        ) : (
                                            featuredPreview && (
                                                <PreviewWrapper>
                                                    <img src={featuredPreview} alt="Featured" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 4 }} />
                                                </PreviewWrapper>
                                            )
                                        )}
                                    </Box>

                                    {/* Gallery */}
                                    <Box>
                                        <Box sx={{ mb: 0.5 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                                                Gallery ({galleryItems.length}/{MAX_GALLERY_IMAGES})
                                            </Typography>
                                        </Box>
                                        <Grid container spacing={1}>
                                            {galleryItems.map((item, index) => (
                                                <Grid size={{ xs: 6 }} key={index}>
                                                    <Box sx={{ position: 'relative' }}>
                                                        <img src={item.preview} alt={`Gallery ${index + 1}`} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 4 }} />
                                                        {modalMode !== 'view' && (
                                                            <IconButton onClick={() => handleRemoveGallery(index)} size="small"
                                                                sx={{ position: 'absolute', top: 2, right: 2, bgcolor: RED_COLOR, color: 'white', '&:hover': { bgcolor: alpha(RED_COLOR, 0.8) }, width: 20, height: 20 }}>
                                                                <DeleteIcon sx={{ fontSize: 12 }} />
                                                            </IconButton>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            ))}
                                            {modalMode !== 'view' && galleryItems.length < MAX_GALLERY_IMAGES && (
                                                <Grid size={{ xs: 6 }}>
                                                    <Box {...galleryDropzone.getRootProps()}
                                                        sx={{ border: `2px dashed ${theme.palette.primary.main}`, borderRadius: 1, height: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', bgcolor: alpha(BLUE_COLOR, 0.02), '&:hover': { bgcolor: alpha(BLUE_COLOR, 0.05) } }}>
                                                        <input {...galleryDropzone.getInputProps()} />
                                                        <AddPhotoAlternate sx={{ color: BLUE_COLOR, fontSize: 20 }} />
                                                        <Typography variant="caption" sx={{ textAlign: 'center', px: 0.5, fontSize: '0.6rem' }}>Add Image</Typography>
                                                    </Box>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Box>
                                </Grid>

                                {/* Right — Cat Info */}
                                <Grid size={{ xs: 12, md: 7 }}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(BLUE_COLOR, 0.02), borderRadius: 1, border: 1, borderColor: theme.palette.divider }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: TEXT_PRIMARY, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                                            Cat Information
                                        </Typography>
                                        <Grid container spacing={1.5}>

                                            {/* Name */}
                                            <Grid size={{ xs: 12 }}>
                                                <Box sx={{ mb: 0.5 }}>
                                                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>Name</Typography>
                                                    {modalMode === 'create' && <RequiredAsterisk>*</RequiredAsterisk>}
                                                </Box>
                                                <Controller name="name" control={control}
                                                    rules={{ required: 'Name is required', minLength: { value: 2, message: 'Must be at least 2 characters' } }}
                                                    render={({ field }) => (
                                                        <StyledTextField {...field} fullWidth size="small" disabled={modalMode === 'view'}
                                                            error={!!errors.name} helperText={errors.name?.message} placeholder="Enter cat's name"
                                                            sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem' } }} />
                                                    )} />
                                            </Grid>

                                            {/* Gender */}
                                            <Grid size={{ xs: 6 }}>
                                                <Box sx={{ mb: 0.5 }}>
                                                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>Gender</Typography>
                                                    {modalMode === 'create' && <RequiredAsterisk>*</RequiredAsterisk>}
                                                </Box>
                                                <Controller name="gender" control={control} rules={{ required: 'Gender is required' }}
                                                    render={({ field }) => (
                                                        <FormControl fullWidth size="small" error={!!errors.gender} disabled={modalMode === 'view'}>
                                                            <Select {...field} displayEmpty sx={{ fontSize: '0.75rem' }}>
                                                                <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>Select gender</MenuItem>
                                                                <MenuItem value="female" sx={{ fontSize: '0.75rem' }}>Female</MenuItem>
                                                                <MenuItem value="male" sx={{ fontSize: '0.75rem' }}>Male</MenuItem>
                                                            </Select>
                                                            {errors.gender && <FormHelperText sx={{ fontSize: '0.7rem' }}>{errors.gender.message}</FormHelperText>}
                                                        </FormControl>
                                                    )} />
                                            </Grid>

                                            {/* Price */}
                                            <Grid size={{ xs: 6 }}>
                                                <Box sx={{ mb: 0.5 }}>
                                                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>Price (৳)</Typography>
                                                    {modalMode === 'create' && <RequiredAsterisk>*</RequiredAsterisk>}
                                                </Box>
                                                <Controller name="price" control={control}
                                                    rules={{ required: 'Price is required', min: { value: 0, message: 'Price cannot be negative' } }}
                                                    render={({ field }) => (
                                                        <StyledTextField {...field} fullWidth size="small" type="text" disabled={modalMode === 'view'}
                                                            error={!!errors.price} helperText={errors.price?.message} placeholder="e.g. 0.00"
                                                            sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem' } }} />
                                                    )} />
                                            </Grid>

                                            {/* Age */}
                                            <Grid size={{ xs: 6 }}>
                                                <Box sx={{ mb: 0.5 }}>
                                                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>Age</Typography>
                                                    {modalMode === 'create' && <RequiredAsterisk>*</RequiredAsterisk>}
                                                </Box>
                                                <Controller name="age" control={control} rules={{ required: 'Age is required' }}
                                                    render={({ field }) => (
                                                        <StyledTextField {...field} fullWidth size="small" disabled={modalMode === 'view'} error={!!errors.age} helperText={errors.age?.message} placeholder="e.g., 2 Years"
                                                            sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem' } }} />
                                                    )} />
                                            </Grid>

                                            {/* Breed */}
                                            <Grid size={{ xs: 6 }}>
                                                <Box sx={{ mb: 0.5 }}>
                                                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>Breed</Typography>
                                                    {modalMode === 'create' && <RequiredAsterisk>*</RequiredAsterisk>}
                                                </Box>
                                                <Controller name="breed" control={control} rules={{ required: 'Breed is required' }}
                                                    render={({ field }) => (
                                                        <StyledTextField {...field} fullWidth size="small" disabled={modalMode === 'view'} error={!!errors.breed} helperText={errors.breed?.message} placeholder="Enter breed"
                                                            sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem' } }} />
                                                    )} />
                                            </Grid>

                                            {/* Stock */}
                                            <Grid size={{ xs: 6 }}>
                                                <Box sx={{ mb: 0.5 }}>
                                                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>Stock Quantity</Typography>
                                                    {modalMode === 'create' && <RequiredAsterisk>*</RequiredAsterisk>}
                                                </Box>
                                                <Controller name="stock" control={control}
                                                    rules={{ required: 'Stock is required', min: { value: 0, message: 'Cannot be negative' } }}
                                                    render={({ field }) => (
                                                        <StyledTextField {...field} fullWidth size="small" type="text" disabled={modalMode === 'view'}
                                                            error={!!errors.stock} helperText={errors.stock?.message} placeholder="e.g. 1"
                                                            InputProps={{ startAdornment: <InputAdornment position="start"><InventoryIcon sx={{ fontSize: 14, color: alpha(TEXT_PRIMARY, 0.4) }} /></InputAdornment> }}
                                                            sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem' } }} />
                                                    )} />
                                            </Grid>

                                            {/* Neutered */}
                                            <Grid size={{ xs: 6 }}>
                                                <Box sx={{ mb: 0.5 }}>
                                                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>Neutered</Typography>
                                                </Box>
                                                <Controller name="neutered" control={control}
                                                    render={({ field }) => (
                                                        <FormControlLabel
                                                            control={<Switch {...field} checked={field.value} disabled={modalMode === 'view'} color="primary" size="small" />}
                                                            label={<Typography sx={{ fontSize: '0.7rem' }}>{field.value ? 'Yes' : 'No'}</Typography>} />
                                                    )} />
                                            </Grid>

                                            {/* Vaccinated */}
                                            <Grid size={{ xs: 6 }}>
                                                <Box sx={{ mb: 0.5 }}>
                                                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>Vaccinated</Typography>
                                                </Box>
                                                <Controller name="vaccinated" control={control}
                                                    render={({ field }) => (
                                                        <FormControlLabel
                                                            control={<Switch {...field} checked={field.value} disabled={modalMode === 'view'} color="primary" size="small" />}
                                                            label={<Typography sx={{ fontSize: '0.7rem' }}>{field.value ? 'Yes' : 'No'}</Typography>} />
                                                    )} />
                                            </Grid>

                                            {/* Size */}
                                            <Grid size={{ xs: 6 }}>
                                                <Box sx={{ mb: 0.5 }}>
                                                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>Size</Typography>
                                                </Box>
                                                <Controller name="size" control={control}
                                                    render={({ field }) => (
                                                        <FormControl fullWidth size="small" disabled={modalMode === 'view'}>
                                                            <Select {...field} sx={{ fontSize: '0.75rem' }}>
                                                                <MenuItem value="small" sx={{ fontSize: '0.75rem' }}>Small</MenuItem>
                                                                <MenuItem value="medium" sx={{ fontSize: '0.75rem' }}>Medium</MenuItem>
                                                                <MenuItem value="large" sx={{ fontSize: '0.75rem' }}>Large</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    )} />
                                            </Grid>

                                            {/* In Stock */}
                                            <Grid size={{ xs: 6 }}>
                                                <Box sx={{ mb: 0.5 }}>
                                                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>In Stock</Typography>
                                                </Box>
                                                <Controller name="inStock" control={control}
                                                    render={({ field }) => (
                                                        <FormControlLabel
                                                            control={<Switch {...field} checked={field.value} disabled={modalMode === 'view'} color="success" size="small" />}
                                                            label={<Typography variant="body2" sx={{ color: field.value ? GREEN_COLOR : RED_COLOR, fontWeight: 600, fontSize: '0.7rem' }}>{field.value ? 'In Stock' : 'Out of Stock'}</Typography>} />
                                                    )} />
                                            </Grid>

                                            {/* Featured */}
                                            <Grid size={{ xs: 12 }}>
                                                <Box sx={{ mb: 0.5 }}>
                                                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>Featured</Typography>
                                                </Box>
                                                <Controller name="isFeatured" control={control}
                                                    render={({ field }) => (
                                                        <FormControlLabel
                                                            control={<Switch {...field} checked={field.value} disabled={modalMode === 'view'} color="primary" size="small" />}
                                                            label={<Typography sx={{ fontSize: '0.7rem' }}>{field.value ? 'Mark as Featured' : 'Not Featured'}</Typography>} />
                                                    )} />
                                                <FormHelperText sx={{ color: alpha(TEXT_PRIMARY, 0.6), fontSize: '0.65rem' }}>
                                                    Mark this cat as featured to highlight it on the homepage
                                                </FormHelperText>
                                            </Grid>

                                            {/* Discount Section */}
                                            <Grid size={{ xs: 12 }}>
                                                <Paper elevation={0} sx={{ p: 1.5, mt: 1, bgcolor: alpha(COLORS.discount, 0.03), borderRadius: 2, border: `1px solid ${alpha(COLORS.discount, 0.2)}` }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                                                        <DiscountIcon sx={{ color: COLORS.discount, fontSize: 18 }} />
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>
                                                            Discount Settings
                                                        </Typography>
                                                        <FormControlLabel
                                                            control={
                                                                <Switch size="small" checked={discount.isActive}
                                                                    onChange={(e) => handleDiscountChange('isActive', e.target.checked)}
                                                                    disabled={modalMode === 'view'} color="success" />
                                                            }
                                                            label={<Typography variant="caption" sx={{ fontSize: '0.65rem' }}>Enable Discount</Typography>}
                                                            sx={{ ml: 0.5 }} />
                                                    </Box>

                                                    {discount.isActive && (
                                                        <Grid container spacing={1.5}>
                                                            <Grid size={{ xs: 6 }}>
                                                                <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
                                                                    Discount Type
                                                                </Typography>
                                                                <FormControl fullWidth size="small" disabled={modalMode === 'view'}>
                                                                    <Select value={discount.type}
                                                                        onChange={(e) => handleDiscountChange('type', e.target.value)}
                                                                        sx={{ fontSize: '0.7rem' }}>
                                                                        <MenuItem value="percentage" sx={{ fontSize: '0.7rem' }}>Percentage (%)</MenuItem>
                                                                        <MenuItem value="fixed" sx={{ fontSize: '0.7rem' }}>Fixed Amount (৳)</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid size={{ xs: 6 }}>
                                                                <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
                                                                    {discount.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount (৳)'}
                                                                </Typography>
                                                                <TextField fullWidth size="small" type="text" value={discount.value}
                                                                    onChange={(e) => handleDiscountChange('value', parseFloat(e.target.value) || 0)}
                                                                    disabled={modalMode === 'view'}
                                                                    InputProps={{ endAdornment: <InputAdornment position="end"><Typography sx={{ fontSize: '0.7rem' }}>{discount.type === 'percentage' ? '%' : '৳'}</Typography></InputAdornment> }}
                                                                    sx={{ '& .MuiInputBase-input': { fontSize: '0.7rem' } }} />
                                                            </Grid>
                                                            <Grid size={{ xs: 6 }}>
                                                                <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
                                                                    Start Date (Optional)
                                                                </Typography>
                                                                <TextField fullWidth size="small" type="date"
                                                                    value={discount.startDate ? discount.startDate.split('T')[0] : ''}
                                                                    onChange={(e) => handleDiscountChange('startDate', e.target.value)}
                                                                    disabled={modalMode === 'view'}
                                                                    InputLabelProps={{ shrink: true }}
                                                                    sx={{ '& .MuiInputBase-input': { fontSize: '0.7rem' } }} />
                                                            </Grid>
                                                            <Grid size={{ xs: 6 }}>
                                                                <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
                                                                    End Date (Optional)
                                                                </Typography>
                                                                <TextField fullWidth size="small" type="date"
                                                                    value={discount.endDate ? discount.endDate.split('T')[0] : ''}
                                                                    onChange={(e) => handleDiscountChange('endDate', e.target.value)}
                                                                    disabled={modalMode === 'view'}
                                                                    InputLabelProps={{ shrink: true }}
                                                                    sx={{ '& .MuiInputBase-input': { fontSize: '0.7rem' } }} />
                                                            </Grid>
                                                            {discount.value > 0 && priceValue > 0 && (
                                                                <Grid size={{ xs: 12 }}>
                                                                    <Box sx={{ p: 1, bgcolor: alpha(COLORS.discount, 0.1), borderRadius: 1 }}>
                                                                        <Typography variant="caption" sx={{ color: TEXT_PRIMARY, fontWeight: 500, fontSize: '0.7rem' }}>
                                                                            Final Price: <strong style={{ color: COLORS.discount, fontSize: '0.8rem' }}>৳{calculateDiscountedPrice.toFixed(2)}</strong>
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

                                            {/* About */}
                                            <Grid size={{ xs: 12 }}>
                                                <Box sx={{ mb: 0.5 }}>
                                                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>About</Typography>
                                                </Box>
                                                {modalMode !== 'view' ? (
                                                    <Controller name="about" control={control}
                                                        render={({ field }) => (
                                                            <StyledTextField {...field} fullWidth multiline rows={3} disabled={modalMode === 'view'} placeholder="Write a description about the cat..."
                                                                sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem' } }} />
                                                        )} />
                                                ) : (
                                                    <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.8), mt: 1, fontSize: '0.75rem' }}>
                                                        {watch('about') || 'No description provided.'}
                                                    </Typography>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}

                        {/* ── TAB 1: Features ────────────────────────────────── */}
                        {modalTab === 1 && (
                            <Box>
                                <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7), mb: 2, fontSize: '0.75rem' }}>
                                    Use this section to highlight cat characteristics, personality traits, health notes, and other important information.
                                </Typography>
                                {modalMode !== 'view' ? (
                                    <Box sx={{ '& .quill': { '& .ql-toolbar': { borderColor: theme.palette.divider, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: alpha(BLUE_COLOR, 0.02) }, '& .ql-container': { borderColor: theme.palette.divider, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, minHeight: 250, fontSize: '0.75rem', backgroundColor: theme.palette.background.paper }, '& .ql-editor': { minHeight: 250, fontSize: '0.75rem' } } }}>
                                        <ReactQuill value={features} onChange={setFeatures}
                                            theme="snow" modules={quillModules} formats={quillFormats} placeholder="Add cat features, personality, health notes..." />
                                    </Box>
                                ) : (
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(BLUE_COLOR, 0.02), borderRadius: 1, border: 1, borderColor: theme.palette.divider }}>
                                        <Box sx={{ fontSize: '0.75rem', color: alpha(TEXT_PRIMARY, 0.85), '& p': { margin: 0 }, '& ul, & ol': { paddingLeft: '1.5rem' } }}
                                            dangerouslySetInnerHTML={{ __html: features || '<p>No features provided.</p>' }} />
                                    </Paper>
                                )}
                            </Box>
                        )}

                        {/* ── TAB 2: Product Options ─────────────────────────── */}
                        {modalTab === 2 && (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>Product Options</Typography>
                                        <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.6), fontSize: '0.65rem' }}>
                                            Add options like color, size, age group — each option can have multiple values with optional price modifiers.
                                        </Typography>
                                    </Box>
                                    {modalMode !== 'view' && (
                                        <GradientButton size="small" startIcon={<AddOptionIcon />} onClick={addOption} sx={{ fontSize: '0.7rem' }}>
                                            Add Option
                                        </GradientButton>
                                    )}
                                </Box>

                                {productOptions.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4, border: `2px dashed ${theme.palette.divider}`, borderRadius: 2 }}>
                                        <TuneIcon sx={{ fontSize: 40, color: alpha(TEXT_PRIMARY, 0.15), mb: 1 }} />
                                        <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontSize: '0.7rem' }}>
                                            {modalMode === 'view' ? 'No options configured for this product.' : 'No options yet. Click "Add Option" to create one.'}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {productOptions.map((option, optIdx) => (
                                            <Paper key={option.id} elevation={0}
                                                sx={{ p: 1.5, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, bgcolor: alpha(BLUE_COLOR, 0.01) }}>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 500, color: alpha(TEXT_PRIMARY, 0.7), mb: 0.5, display: 'block', fontSize: '0.6rem' }}>
                                                            Option Name (e.g. Color, Size, Age Group)
                                                        </Typography>
                                                        {modalMode !== 'view' ? (
                                                            <StyledTextField fullWidth size="small" value={option.name}
                                                                onChange={(e) => updateOptionName(option.id, e.target.value)}
                                                                placeholder="Option name..."
                                                                sx={{ '& .MuiInputBase-input': { fontSize: '0.7rem' } }} />
                                                        ) : (
                                                            <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.7rem' }}>{option.name || '—'}</Typography>
                                                        )}
                                                    </Box>
                                                    {modalMode !== 'view' && (
                                                        <Tooltip title="Remove this option" arrow>
                                                            <IconButton size="small" onClick={() => removeOption(option.id)}
                                                                sx={{ color: RED_COLOR, mt: 2, '&:hover': { bgcolor: alpha(RED_COLOR, 0.1) } }}>
                                                                <RemoveOptionIcon sx={{ fontSize: 18 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>

                                                <Divider sx={{ mb: 1 }} />
                                                <Typography variant="caption" sx={{ fontWeight: 500, color: alpha(TEXT_PRIMARY, 0.7), mb: 1, display: 'block', fontSize: '0.6rem' }}>
                                                    Values
                                                </Typography>

                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                    {option.values.map((val, valIdx) => (
                                                        <Box key={val.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Box sx={{ minWidth: 20, height: 20, borderRadius: '50%', bgcolor: alpha(BLUE_COLOR, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                                <Typography variant="caption" sx={{ fontWeight: 700, color: BLUE_COLOR, fontSize: 9 }}>{valIdx + 1}</Typography>
                                                            </Box>

                                                            {modalMode !== 'view' ? (
                                                                <>
                                                                    <StyledTextField size="small" fullWidth value={val.value}
                                                                        onChange={(e) => updateOptionValue(option.id, val.id, 'value', e.target.value)}
                                                                        placeholder="Value (e.g. Red, Large, Kitten)"
                                                                        sx={{ flex: 2, '& .MuiInputBase-input': { fontSize: '0.7rem' } }} />
                                                                    <StyledTextField size="small" type="text" value={val.priceModifier}
                                                                        onChange={(e) => updateOptionValue(option.id, val.id, 'priceModifier', parseFloat(e.target.value) || 0)}
                                                                        placeholder="±Price"
                                                                        sx={{ width: 90, flexShrink: 0, '& .MuiInputBase-input': { fontSize: '0.7rem' } }}
                                                                        InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.65rem' }}>৳</Typography></InputAdornment> }} />
                                                                    <Tooltip title="Remove value" arrow>
                                                                        <IconButton size="small" onClick={() => removeOptionValue(option.id, val.id)}
                                                                            disabled={option.values.length === 1}
                                                                            sx={{ color: RED_COLOR, flexShrink: 0, '&:hover': { bgcolor: alpha(RED_COLOR, 0.1) }, '&.Mui-disabled': { color: alpha(TEXT_PRIMARY, 0.2) } }}>
                                                                            <CloseIcon sx={{ fontSize: 14 }} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </>
                                                            ) : (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                                                    <Chip label={val.value || '—'} size="small" sx={{ fontSize: '0.65rem' }} />
                                                                    {val.priceModifier !== 0 && (
                                                                        <Chip
                                                                            label={`${val.priceModifier > 0 ? '+' : ''}৳${val.priceModifier}`}
                                                                            size="small"
                                                                            sx={{ fontSize: '0.6rem', bgcolor: val.priceModifier > 0 ? alpha(GREEN_COLOR, 0.1) : alpha(RED_COLOR, 0.1), color: val.priceModifier > 0 ? GREEN_COLOR : RED_COLOR }} />
                                                                    )}
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    ))}

                                                    {modalMode !== 'view' && (
                                                        <Button size="small" startIcon={<AddOptionIcon sx={{ fontSize: 12 }} />}
                                                            onClick={() => addOptionValue(option.id)}
                                                            sx={{ alignSelf: 'flex-start', textTransform: 'none', fontSize: '0.65rem', color: BLUE_COLOR, mt: 0.5, px: 1 }}>
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

                        {/* ── TAB 3: Reviews ─────────────────────────────────── */}
                        {modalTab === 3 && (modalMode === 'view' || modalMode === 'edit') && (
                            <Box>
                                {reviews.length > 0 && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 1.5, bgcolor: alpha(BLUE_COLOR, 0.04), borderRadius: 1 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.dark, fontSize: { xs: '1.3rem', sm: '1.5rem' } }}>
                                                {averageRating}
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>out of 5</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>
                                                {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 0.25 }}>
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <StarIcon key={s} sx={{ fontSize: 14, color: s <= Math.round(averageRating) ? theme.palette.warning.main : alpha(TEXT_PRIMARY, 0.2) }} />
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                )}

                                {reviews.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <RateReviewIcon sx={{ fontSize: 40, color: alpha(TEXT_PRIMARY, 0.2), mb: 1 }} />
                                        <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7), fontSize: '0.7rem' }}>No reviews yet.</Typography>
                                    </Box>
                                ) : (
                                    reviews.map((review) => (
                                        <Paper key={review._id} elevation={0}
                                            sx={{ p: 1.5, mb: 1, borderRadius: 1, border: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.paper }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.75rem' }}>{review.name}</Typography>
                                                        <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontSize: '0.6rem' }}>{review.email}</Typography>
                                                        {review.approved ? (
                                                            <Chip icon={<CheckIcon sx={{ fontSize: 12 }} />} label="Approved" size="small"
                                                                sx={{ height: 18, fontSize: '0.6rem', backgroundColor: alpha(GREEN_COLOR, 0.1), color: GREEN_COLOR, fontWeight: 600 }} />
                                                        ) : (
                                                            <Chip icon={<CloseIcon sx={{ fontSize: 12 }} />} label="Pending" size="small"
                                                                sx={{ height: 18, fontSize: '0.6rem', backgroundColor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main, fontWeight: 600 }} />
                                                        )}
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 0.25, mb: 0.5 }}>
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <StarIcon key={s} sx={{ fontSize: 12, color: s <= review.rating ? theme.palette.warning.main : alpha(TEXT_PRIMARY, 0.2) }} />
                                                        ))}
                                                    </Box>
                                                    <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.8), mb: 0.5, fontSize: '0.7rem' }}>{review.comment}</Typography>
                                                    <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.4), fontSize: '0.6rem' }}>
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                                                    <IconButton size="small"
                                                        onClick={() => toggleReviewApprovalMutation.mutate({ catId: selectedCat._id, reviewId: review._id })}
                                                        disabled={toggleReviewApprovalMutation.isPending}
                                                        sx={{ color: review.approved ? RED_COLOR : GREEN_COLOR, p: 0.5 }}
                                                        title={review.approved ? 'Disapprove review' : 'Approve review'}>
                                                        {review.approved ? <CloseIcon sx={{ fontSize: 14 }} /> : <CheckIcon sx={{ fontSize: 14 }} />}
                                                    </IconButton>
                                                    <IconButton size="small"
                                                        onClick={() => deleteReviewMutation.mutate({ catId: selectedCat._id, reviewId: review._id })}
                                                        disabled={deleteReviewMutation.isPending}
                                                        sx={{ color: RED_COLOR, p: 0.5 }} title="Delete review">
                                                        <DeleteIcon sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    ))
                                )}
                            </Box>
                        )}
                    </DialogContent>

                    <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 }, borderTop: `1px solid ${theme.palette.divider}` }}>
                        <OutlineButton onClick={handleCloseModal} size="small" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                            {modalMode === 'view' ? 'Close' : 'Cancel'}
                        </OutlineButton>
                        {modalMode !== 'view' && (
                            <GradientButton type="submit" size="small" disabled={isSubmitDisabled()} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                {createCatMutation.isPending || updateCatMutation.isPending
                                    ? <CircularProgress size={16} sx={{ color: 'white' }} />
                                    : modalMode === 'create' ? 'Add Cat' : 'Update Cat'}
                            </GradientButton>
                        )}
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}