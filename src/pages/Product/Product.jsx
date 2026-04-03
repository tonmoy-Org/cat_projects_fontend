import React, { useEffect, useState } from 'react';
import {
    Container, Grid, Box, Typography, styled, Button, Pagination,
    PaginationItem, InputAdornment, TextField, ToggleButton, ToggleButtonGroup,
    Slider, Chip, MenuItem, Select, FormControl, useTheme, useMediaQuery,
    CircularProgress, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, alpha, Rating,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockIcon from '@mui/icons-material/Lock';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useNavigate } from 'react-router-dom';
import SectionTile from '../../components/SectionTile';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../auth/AuthProvider';
import { useShopApi } from '../../hooks/useShopApi';

const PRIMARY = '#5C4D91';
const PRIMARY_DARK = '#4A3D75';
const ACCENT = '#db89ca';
const PRICE_COLOR = '#ff6b6b';
const DISCOUNT_COLOR = '#10b981';
const NO_IMAGE = 'https://via.placeholder.com/400x400?text=No+Image';
const HERO_IMAGE = 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/2.jpg';

const ProductSection = styled(Box)({
    backgroundColor: '#fff',
    padding: '80px 0',
    width: '100%',
    '@media (max-width: 900px)': { padding: '60px 0' },
    '@media (max-width: 600px)': { padding: '40px 0' },
});

const FilterBar = styled(Box)(({ theme }) => ({
    backgroundColor: '#faf8ff',
    border: '1px solid #ede8f7',
    borderRadius: '12px',
    padding: '20px 24px',
    marginBottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    [theme.breakpoints.down('sm')]: { padding: '16px', gap: '14px', marginBottom: '20px' },
}));

const FilterRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.down('sm')]: { gap: '12px', flexDirection: 'column', alignItems: 'stretch' },
}));

const FilterLabel = styled(Typography)({
    fontSize: '11px',
    fontWeight: 600,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    minWidth: 'max-content',
});

const SearchInput = styled(TextField)(({ theme }) => ({
    flex: '1 1 280px',
    minWidth: '200px',
    '& .MuiOutlinedInput-root': {
        borderRadius: '30px',
        backgroundColor: '#fff',
        fontSize: '13px',
        '& fieldset': { borderColor: '#e0d9f5' },
        '&:hover fieldset': { borderColor: PRIMARY },
        '&.Mui-focused fieldset': { borderColor: PRIMARY },
    },
    '& input': { padding: '8px 14px' },
    [theme.breakpoints.down('sm')]: { flex: '1 1 100%', width: '100%' },
}));

const CategorySelect = styled(Select)(({ theme }) => ({
    borderRadius: '30px',
    backgroundColor: '#fff',
    fontSize: '13px',
    minWidth: '160px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0d9f5' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
    '& .MuiSelect-select': { padding: '8px 14px' },
    [theme.breakpoints.down('sm')]: { width: '100%', minWidth: 'unset' },
}));

const StockToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButton-root': {
        border: '1px solid #e0d9f5',
        borderRadius: '30px !important',
        padding: '5px 18px',
        fontSize: '12px',
        fontWeight: 500,
        color: '#555',
        textTransform: 'none',
        marginRight: '8px',
        transition: 'all 0.2s ease',
        '&.Mui-selected': { backgroundColor: PRIMARY, color: '#fff', borderColor: PRIMARY, '&:hover': { backgroundColor: PRIMARY_DARK } },
        '&:hover': { borderColor: PRIMARY, color: PRIMARY },
    },
    [theme.breakpoints.down('sm')]: {
        display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%',
        '& .MuiToggleButton-root': { padding: '5px 10px', fontSize: '11px', marginRight: 0, flex: '1 1 auto' },
    },
}));

const PriceSliderWrapper = styled(Box)(({ theme }) => ({
    display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 300px', minWidth: '200px',
    [theme.breakpoints.down('sm')]: { width: '100%', flex: '1 1 100%' },
}));

const PriceInputRow = styled(Box)({ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' });

const PriceInput = styled(TextField)({
    width: '84px',
    '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#fff', fontSize: '11px', '& fieldset': { borderColor: '#e0d9f5' }, '&:hover fieldset': { borderColor: PRIMARY }, '&.Mui-focused fieldset': { borderColor: PRIMARY } },
    '& input': { padding: '5px 6px', textAlign: 'center', fontWeight: 600, color: PRIMARY, fontSize: '11px' },
});

const StyledSlider = styled(Slider)({
    color: PRIMARY, flex: 1, minWidth: '150px',
    '& .MuiSlider-thumb': { width: '14px', height: '14px', '&:hover': { boxShadow: `0 0 0 8px rgba(92,77,145,0.1)` } },
    '& .MuiSlider-rail': { backgroundColor: '#e0d9f5' },
});

const RefreshBtn = styled(IconButton)({
    backgroundColor: '#f0ecfb', color: PRIMARY, padding: '6px',
    '&:hover': { backgroundColor: PRIMARY, color: '#fff' },
    '&.Mui-disabled': { backgroundColor: '#f0ecfb', opacity: 0.5 },
});

const ActiveFiltersRow = styled(Box)({ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '14px' });

const ProductCard = styled(Box, { shouldForwardProp: p => p !== 'outOfStock' })(({ outOfStock }) => ({
    width: '100%',
    overflow: 'hidden',
    cursor: outOfStock ? 'not-allowed' : 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
    transition: 'all 0.3s ease',
    backgroundColor: '#fff',
    border: '1px solid #f0f0f0',
    opacity: outOfStock ? 0.6 : 1,
    filter: outOfStock ? 'grayscale(100%)' : 'none',
    '&:hover': outOfStock ? {} : {
        boxShadow: '0 8px 24px rgba(0,0,0,0.11)',
    },
    '&:hover .product-image': outOfStock ? {} : {
        transform: 'scale(1.05)',
    },
}));

const ImageWrapper = styled(Box)({ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: '#f5f5f5' });

const ProductImage = styled('img')({
    width: '100%', height: '240px', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease',
    '@media (max-width: 900px)': { height: '200px' },
    '@media (max-width: 600px)': { height: '170px' },
});

const DiscountBadge = styled(Box)({
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: DISCOUNT_COLOR,
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 700,
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
});

const CardBody = styled(Box)({ padding: '12px 12px 16px', textAlign: 'start' });

const ProductName = styled(Typography)({ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });

const ProductCategory = styled(Typography)({ fontSize: '11px', color: '#999', marginBottom: '6px' });

const PriceWrapper = styled(Box)({ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' });

const ProductPrice = styled(Typography, { shouldForwardProp: p => p !== 'isDiscounted' })(({ isDiscounted }) => ({
    fontSize: '14px',
    fontWeight: 700,
    color: isDiscounted ? DISCOUNT_COLOR : PRICE_COLOR,
}));

const OriginalPrice = styled(Typography)({
    fontSize: '11px',
    color: '#999',
    textDecoration: 'line-through',
});

const RatingSection = styled(Box)({ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '6px', marginBottom: '10px' });

const RatingText = styled(Typography)({ fontSize: '11px', color: '#999', fontWeight: 500 });

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': { color: '#ffb400', fontSize: '14px' },
    '& .MuiRating-iconEmpty': { color: '#ddd', fontSize: '14px' },
});

const AddToCartBtn = styled(Button)({
    backgroundColor: ACCENT, color: '#fff', fontSize: '11px', fontWeight: 600, textTransform: 'none',
    borderRadius: '30px', padding: '6px 14px', width: '100%', gap: '5px', transition: 'all 0.3s ease',
    '&:hover': { backgroundColor: '#c96db8', boxShadow: '0 4px 12px rgba(219,137,202,0.4)' },
    '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#999', cursor: 'not-allowed' },
});

const ViewCartBtn = styled(Button)({
    backgroundColor: 'transparent', color: ACCENT, fontSize: '11px', fontWeight: 600, textTransform: 'none',
    borderRadius: '30px', padding: '6px 14px', width: '100%', gap: '5px', border: `2px solid ${ACCENT}`, transition: 'all 0.3s ease',
    '&:hover': { backgroundColor: ACCENT, color: '#fff', boxShadow: '0 4px 12px rgba(219,137,202,0.4)' },
});

const OutOfStockBadge = styled(Box)({
    position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, zIndex: 2,
});

const PaginationWrapper = styled(Box)(({ theme }) => ({
    display: 'flex', justifyContent: 'center', marginTop: '48px', width: '100%',
    [theme.breakpoints.down('sm')]: { marginTop: '28px' },
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
    '& .MuiPaginationItem-root': {
        margin: '0 3px', minWidth: '36px', height: '36px', borderRadius: '36px',
        fontSize: '13px', fontWeight: 500, color: '#333', backgroundColor: '#fff',
        border: '1px solid #e0e0e0', transition: 'all 0.3s ease',
        [theme.breakpoints.down('sm')]: { minWidth: '32px', height: '32px', fontSize: '12px' },
        '&:hover': { backgroundColor: PRIMARY, color: '#fff', borderColor: PRIMARY },
        '&.Mui-selected': { backgroundColor: PRIMARY, color: '#fff', borderColor: PRIMARY, '&:hover': { backgroundColor: PRIMARY_DARK } },
    },
}));

// ── ProductCardItem ───────────────────────────────────────────────────────────

const ProductCardItem = ({ product, onCardClick, isAuthenticated, onAuthRequired, onAddedToCart }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [addedToCart, setAddedToCart] = useState(false);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (!isAuthenticated) { onAuthRequired(); return; }
        if (!product.inStock) return;
        addToCart(product, 1);
        setAddedToCart(true);
        onAddedToCart?.(product);
    };

    const handleCardClick = () => {
        if (!product.inStock) return;
        onCardClick(product);
    };

    const averageRating = product.averageRating || 0;
    const reviewCount = product.reviewCount || 0;
    const discountedPrice = product.discountedPrice || product.price;
    const discountPercentage = product.discountPercentage || 0;
    const hasDiscount = discountPercentage > 0 && product.inStock;

    return (
        <ProductCard
            outOfStock={!product.inStock}
            onClick={handleCardClick}
        >
            <ImageWrapper>
                {!product.inStock && <OutOfStockBadge>Out of Stock</OutOfStockBadge>}
                {hasDiscount && (
                    <DiscountBadge>
                        <LocalOfferIcon sx={{ fontSize: '12px' }} />
                        -{Math.round(discountPercentage)}%
                    </DiscountBadge>
                )}
                <ProductImage
                    className="product-image"
                    src={product.featuredImage}
                    alt={product.title}
                    onError={e => { e.target.src = NO_IMAGE; }}
                />
            </ImageWrapper>
            <CardBody>
                <ProductName title={product.title}>{product.title}</ProductName>
                <ProductCategory>{product.category || 'General'}</ProductCategory>

                <PriceWrapper>
                    <ProductPrice isDiscounted={hasDiscount}>
                        ৳ {discountedPrice.toLocaleString()}
                    </ProductPrice>
                    {hasDiscount && (
                        <OriginalPrice>৳ {product.price.toLocaleString()}</OriginalPrice>
                    )}
                </PriceWrapper>

                <RatingSection>
                    <StyledRating value={averageRating} readOnly precision={0.5} size="small" />
                    <RatingText>
                        {reviewCount > 0 ? `(${reviewCount})` : 'No reviews'}
                    </RatingText>
                </RatingSection>

                {addedToCart ? (
                    <ViewCartBtn onClick={e => { e.stopPropagation(); navigate('/cart'); }}>
                        <ShoppingCartIcon sx={{ fontSize: '13px' }} /> View Cart
                    </ViewCartBtn>
                ) : (
                    <AddToCartBtn onClick={handleAddToCart} disabled={!product.inStock}>
                        <ShoppingCartIcon sx={{ fontSize: '13px' }} />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </AddToCartBtn>
                )}
            </CardBody>
        </ProductCard>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────

const Product = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [authDialogOpen, setAuthDialogOpen] = useState(false);

    const { useProducts } = useShopApi();
    const {
        filteredProducts, paginatedProducts, isLoading, error,
        page, setPage, totalPages,
        search, setSearch, category, setCategory, stock, setStock,
        priceRange, minInput, maxInput, priceMin, priceMax, priceInitialized,
        categoryOptions, activeFilters, isRefreshing,
        handleRefresh, handleSliderChange, handleMinInput, handleMaxInput,
        clearFilter, clearAll, handleProductClick,
    } = useProducts();
    console.log(filteredProducts);

    useEffect(() => { setPage(1); }, [search, category, stock, priceRange]);

    const handlePageChange = (_, value) => {
        setPage(value);
        const el = document.getElementById('products-section');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
    };

    if (isLoading || authLoading) {
        return (
            <Box>
                <SectionTile bgImage={HERO_IMAGE} subtitle="Pet Shop" title="Our Products" icon iconClass="flaticon-custom-icon" />
                <ProductSection>
                    <Container maxWidth="lg">
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                            <CircularProgress sx={{ color: PRIMARY }} />
                        </Box>
                    </Container>
                </ProductSection>
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <SectionTile bgImage={HERO_IMAGE} subtitle="Pet Shop" title="Our Products" icon iconClass="flaticon-custom-icon" />
                <ProductSection>
                    <Container maxWidth="lg">
                        <Typography textAlign="center" color="error" sx={{ py: 4, fontSize: '13px' }}>
                            Error loading products: {error.message}
                        </Typography>
                    </Container>
                </ProductSection>
            </Box>
        );
    }

    return (
        <Box>
            <SectionTile bgImage={HERO_IMAGE} subtitle="Pet Shop" title="Our Products" icon iconClass="flaticon-custom-icon" />

            <ProductSection id="products-section">
                <Container maxWidth="lg">
                    <FilterBar>
                        <FilterRow>
                            <SearchInput
                                placeholder="Search by product name..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '16px', color: '#bbb' }} /></InputAdornment>,
                                    endAdornment: search ? (
                                        <InputAdornment position="end">
                                            <CloseIcon sx={{ fontSize: '14px', color: '#bbb', cursor: 'pointer' }} onClick={() => setSearch('')} />
                                        </InputAdornment>
                                    ) : null,
                                }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1' }}>
                                <FilterLabel>Category</FilterLabel>
                                <FormControl size="small" sx={{ flex: '1', minWidth: '140px' }}>
                                    <CategorySelect value={category} onChange={e => setCategory(e.target.value)} displayEmpty>
                                        <MenuItem value="">All Categories</MenuItem>
                                        {categoryOptions.map(c => <MenuItem key={c} value={c} sx={{ fontSize: '13px' }}>{c}</MenuItem>)}
                                    </CategorySelect>
                                </FormControl>
                            </Box>
                        </FilterRow>

                        <FilterRow>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                <FilterLabel>Stock</FilterLabel>
                                <StockToggleGroup value={stock} exclusive onChange={(_, val) => { if (val !== null) setStock(val); }} size="small">
                                    <ToggleButton value="all">All</ToggleButton>
                                    <ToggleButton value="instock">In Stock</ToggleButton>
                                    <ToggleButton value="outofstock">Out of Stock</ToggleButton>
                                </StockToggleGroup>
                            </Box>

                            {priceInitialized && priceMin !== priceMax && (
                                <PriceSliderWrapper>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                        <FilterLabel>
                                            <FilterListIcon sx={{ fontSize: '12px', mr: '4px', verticalAlign: 'middle' }} />
                                            Price Range
                                        </FilterLabel>
                                        <Tooltip title="Refresh & reset filters">
                                            <RefreshBtn onClick={handleRefresh} disabled={isRefreshing} size="small">
                                                <RefreshIcon sx={{ fontSize: '15px', animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                                            </RefreshBtn>
                                        </Tooltip>
                                    </Box>
                                    <PriceInputRow>
                                        <PriceInput
                                            size="small"
                                            value={minInput}
                                            onChange={handleMinInput}
                                            inputProps={{ type: 'number', min: priceMin, max: priceRange[1] }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '10px', color: PRIMARY, fontWeight: 700 }}>৳</Typography></InputAdornment>
                                            }}
                                        />
                                        <Typography sx={{ fontSize: '11px', color: '#ccc' }}>–</Typography>
                                        <PriceInput
                                            size="small"
                                            value={maxInput}
                                            onChange={handleMaxInput}
                                            inputProps={{ type: 'number', min: priceRange[0], max: priceMax }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '10px', color: PRIMARY, fontWeight: 700 }}>৳</Typography></InputAdornment>
                                            }}
                                        />
                                        <StyledSlider
                                            value={priceRange}
                                            onChange={handleSliderChange}
                                            min={priceMin}
                                            max={priceMax}
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={v => `৳${v}`}
                                        />
                                    </PriceInputRow>
                                </PriceSliderWrapper>
                            )}
                        </FilterRow>
                    </FilterBar>

                    {activeFilters.length > 0 && (
                        <ActiveFiltersRow>
                            <Typography sx={{ fontSize: '11px', color: '#999', mr: '4px' }}>Active:</Typography>
                            {activeFilters.map(f => (
                                <Chip
                                    key={f.key}
                                    label={f.label}
                                    size="small"
                                    onDelete={() => clearFilter(f.key)}
                                    sx={{
                                        backgroundColor: '#f0ecfb',
                                        color: PRIMARY,
                                        fontWeight: 500,
                                        fontSize: '11px',
                                        height: '22px',
                                        '& .MuiChip-deleteIcon': { color: PRIMARY, fontSize: '14px' }
                                    }}
                                />
                            ))}
                            <Button size="small" onClick={clearAll}
                                sx={{ fontSize: '11px', color: PRIMARY, textTransform: 'none', fontWeight: 500, '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}>
                                Clear All
                            </Button>
                        </ActiveFiltersRow>
                    )}

                    <Typography sx={{ fontSize: '12px', color: '#999', mb: '14px' }}>
                        Showing {paginatedProducts.length} of {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                    </Typography>

                    {paginatedProducts.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: '56px' }}>
                            <Typography sx={{ fontSize: '14px', color: 'text.secondary', mb: 2 }}>No products match your filters</Typography>
                            <Button onClick={clearAll} variant="outlined"
                                sx={{ color: PRIMARY, borderColor: PRIMARY, textTransform: 'none', fontWeight: 600, fontSize: '13px', '&:hover': { borderColor: PRIMARY, backgroundColor: alpha(PRIMARY, 0.05) } }}>
                                Clear All Filters
                            </Button>
                        </Box>
                    ) : (
                        <>
                            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
                                {paginatedProducts.map(product => (
                                    <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={product._id}>
                                        <ProductCardItem
                                            product={product}
                                            onCardClick={handleProductClick}
                                            isAuthenticated={isAuthenticated}
                                            onAuthRequired={() => setAuthDialogOpen(true)}
                                        />
                                    </Grid>
                                ))}
                            </Grid>

                            {totalPages > 1 && (
                                <PaginationWrapper>
                                    <StyledPagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        variant="outlined"
                                        shape="rounded"
                                        size={isMobile ? 'small' : 'medium'}
                                        renderItem={item => <PaginationItem {...item} components={{ next: ChevronRightIcon, previous: ChevronLeftIcon }} />}
                                    />
                                </PaginationWrapper>
                            )}
                        </>
                    )}
                </Container>
            </ProductSection>

            <Dialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: '16px', padding: '8px', maxWidth: '400px' } }}>
                <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LockIcon sx={{ color: PRIMARY, fontSize: '20px' }} />
                    <Typography variant="h6" component="span" fontWeight={600} fontSize="15px">Authentication Required</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#666', fontSize: '13px' }}>
                        Please sign in to add items to your cart and continue shopping.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
                    <Button onClick={() => setAuthDialogOpen(false)} sx={{ color: '#888', textTransform: 'none', fontSize: '13px', '&:hover': { backgroundColor: '#f5f5f5' } }}>Cancel</Button>
                    <Button onClick={() => { setAuthDialogOpen(false); navigate('/login', { state: { from: '/shop' } }); }} variant="contained"
                        sx={{ backgroundColor: PRIMARY, textTransform: 'none', fontWeight: 600, fontSize: '13px', borderRadius: '8px', '&:hover': { backgroundColor: PRIMARY_DARK } }}>
                        Sign In
                    </Button>
                </DialogActions>
            </Dialog>

            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </Box>
    );
};

export default Product;