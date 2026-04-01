import React from 'react';
import {
    Container, Grid, Box, Typography, styled, Button, TextField,
    Rating, Avatar, CircularProgress, FormControl, Select, MenuItem,
    Stack, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import {
    Pets as PetsIcon, Recycling as RecyclingIcon, Favorite as FavoriteIcon,
    Inventory as InventoryIcon, LocalShipping as LocalShippingIcon,
    CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Warning as WarningIcon,
    AddShoppingCart as AddShoppingCartIcon, ShoppingCartCheckout as ShoppingCartCheckoutIcon,
    Lock as LockIcon, LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import SectionTile from '../../components/SectionTile';
import { useAuth } from '../../auth/AuthProvider';
import { useShopApi } from '../../hooks/useShopApi';

const C = {
    primary: '#db89ca', primaryDark: '#c06bb0', text: '#1a1a1a', textLight: '#666',
    border: '#e0e0e0', bg: '#f5f5f5', price: '#ff6b6b', rating: '#ffb400',
    success: '#4caf50', warning: '#ff9800', error: '#f44336', discount: '#10b981',
};

const HERO_IMAGE = 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg';
const NO_IMAGE = 'https://via.placeholder.com';

const stripHtml = html => html ? html.replace(/<[^>]*>/g, '').trim() : '';
const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const getStockLevel = (stock, inStock) => {
    if (!inStock || stock <= 0) return { level: 'out', label: 'Out of Stock', icon: <CancelIcon sx={{ fontSize: '15px' }} /> };
    if (stock <= 5) return { level: 'low', label: 'Low Stock', icon: <WarningIcon sx={{ fontSize: '15px' }} /> };
    if (stock <= 20) return { level: 'medium', label: 'Limited Stock', icon: <InventoryIcon sx={{ fontSize: '15px' }} /> };
    return { level: 'high', label: 'In Stock', icon: <CheckCircleIcon sx={{ fontSize: '15px' }} /> };
};

const Section = styled(Box)(({ theme }) => ({
    backgroundColor: '#fff', padding: '60px 0', width: '100%',
    [theme.breakpoints.down('md')]: { padding: '40px 0' },
    [theme.breakpoints.down('sm')]: { padding: '30px 0' },
}));

const MainImageWrapper = styled(Box)(({ theme }) => ({
    width: '100%', borderRadius: '16px', overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.07)', backgroundColor: '#fafafa',
    aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
    [theme.breakpoints.down('sm')]: { borderRadius: '12px' },
}));

const DiscountBadgeLarge = styled(Box)({
    position: 'absolute',
    top: '16px',
    left: '16px',
    backgroundColor: C.discount,
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '30px',
    fontSize: '13px',
    fontWeight: 700,
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
});

const Thumbnail = styled('img')(({ active }) => ({
    width: '72px', height: '72px', objectFit: 'cover', borderRadius: '10px', cursor: 'pointer',
    border: active ? `3px solid ${C.primary}` : '2px solid transparent', opacity: active ? 1 : 0.65,
    transition: 'all 0.2s ease',
    '&:hover': { opacity: 1, borderColor: C.primary },
    '@media (max-width: 600px)': { width: '56px', height: '56px' },
}));

const InfoWrapper = styled(Box)(({ theme }) => ({
    padding: '0 20px',
    [theme.breakpoints.down('md')]: { padding: 0, marginTop: '24px' },
}));

const PTitle = styled(Typography)(({ theme }) => ({
    fontSize: '28px', fontWeight: 700, color: C.text, marginBottom: '14px', lineHeight: 1.2,
    [theme.breakpoints.down('sm')]: { fontSize: '22px', marginBottom: '10px' },
}));

const PDesc = styled(Typography)({ fontSize: '13px', color: C.textLight, lineHeight: 1.6, marginBottom: '20px' });

const BadgeRow = styled(Box)({ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' });

const InfoBadge = styled(Box)(({ variant }) => ({
    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
    backgroundColor: variant === 'stock' ? '#e8f5e9' : variant === 'category' ? '#f3e5f5' : '#e3f2fd',
    color: variant === 'stock' ? '#2e7d32' : variant === 'category' ? '#7b1fa2' : '#1565c0',
}));

const StockCard = styled(Paper)(({ theme }) => ({
    padding: '16px', marginBottom: '20px', borderRadius: '14px',
    border: `1px solid ${C.border}`, boxShadow: 'none',
    [theme.breakpoints.down('sm')]: { padding: '14px', marginBottom: '16px' },
}));

const StockIndicator = styled(Box)(({ stocklevel }) => ({
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '5px 12px', borderRadius: '30px', fontWeight: 600, fontSize: '12px',
    backgroundColor: stocklevel === 'high' ? '#e8f5e9' : stocklevel === 'medium' ? '#fff3e0' : stocklevel === 'low' ? '#ffebee' : '#f3e5f5',
    color: stocklevel === 'high' ? '#2e7d32' : stocklevel === 'medium' ? '#ed6c02' : stocklevel === 'low' ? '#d32f2f' : '#7b1fa2',
}));

const StockBar = styled(Box)(({ percentage }) => ({
    width: '100%', height: '5px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden', marginTop: '10px',
    '&::after': {
        content: '""', display: 'block', width: `${percentage}%`, height: '100%',
        backgroundColor: percentage > 60 ? C.success : percentage > 20 ? C.warning : C.error,
        borderRadius: '3px', transition: 'width 0.3s ease',
    },
}));

const PriceDisplay = styled(Typography)(({ theme }) => ({
    fontSize: '26px', fontWeight: 700, color: C.price, marginBottom: '14px',
    '& .orig': { fontSize: '14px', color: C.textLight, textDecoration: 'line-through', marginLeft: '10px', fontWeight: 400 },
    '& .discount': { fontSize: '12px', color: C.discount, marginLeft: '10px', fontWeight: 600, backgroundColor: '#e8f5e9', padding: '2px 8px', borderRadius: '20px' },
    [theme.breakpoints.down('sm')]: { fontSize: '22px' },
}));

const CartWrapper = styled(Box)(({ theme }) => ({
    display: 'flex', gap: '14px', marginBottom: '28px', flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: { gap: '10px', marginBottom: '20px' },
}));

const QtyInput = styled(TextField)({
    width: '90px',
    '& .MuiOutlinedInput-root': { borderRadius: '10px' },
    '& input': { textAlign: 'center', padding: '9px 0', fontSize: '13px' },
});

const AddBtn = styled(Button)({
    backgroundColor: C.primary, color: '#fff', fontSize: '13px', fontWeight: 600, textTransform: 'none',
    borderRadius: '10px', padding: '9px 24px',
    '&:hover': { backgroundColor: C.primaryDark },
    '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e', cursor: 'not-allowed' },
});

const ViewCartBtn = styled(Button)({
    backgroundColor: 'transparent', color: C.primary, fontSize: '13px', fontWeight: 600, textTransform: 'none',
    borderRadius: '10px', padding: '9px 24px', border: `2px solid ${C.primary}`,
    '&:hover': { backgroundColor: C.primary, color: '#fff' },
});

const FeatureItem = styled(Box)({
    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px',
    '& svg': { fontSize: '18px', color: C.primary },
    '& p': { fontSize: '13px', color: C.text, margin: 0 },
});

const TabHeaders = styled(Box)({ display: 'flex', gap: '28px', borderBottom: `1px solid ${C.border}`, marginBottom: '28px' });

const TabHeader = styled(Typography)(({ active }) => ({
    fontSize: '14px', fontWeight: 600, color: active ? C.primary : C.textLight,
    cursor: 'pointer', paddingBottom: '10px',
    borderBottom: active ? `2px solid ${C.primary}` : '2px solid transparent',
    transition: 'all 0.2s ease',
    '&:hover': { color: C.primary },
}));

const FeaturesList = styled('ul')({
    listStyle: 'none', padding: 0, margin: 0,
    '& li': { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '13px', color: C.textLight, '& svg': { color: C.primary, fontSize: '16px' } },
});

const ReviewItem = styled(Box)(({ theme }) => ({
    display: 'flex', gap: '14px', padding: '18px 0', borderBottom: `1px solid ${C.border}`,
    [theme.breakpoints.down('sm')]: { flexDirection: 'column', gap: '10px', padding: '14px 0' },
}));

const ReviewAvatar = styled(Avatar)({ width: '44px', height: '44px', backgroundColor: C.primary, fontSize: '13px' });

const ReviewFormWrapper = styled(Box)(({ theme }) => ({
    marginTop: '28px', padding: '20px', backgroundColor: C.bg, borderRadius: '14px',
    [theme.breakpoints.down('sm')]: { padding: '16px', marginTop: '20px' },
}));

const StyledField = styled(TextField)({
    marginBottom: '14px',
    '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#fff', fontSize: '13px' },
});

const SubmitBtn = styled(Button)({
    backgroundColor: C.primary, color: '#fff', fontSize: '13px', fontWeight: 600, textTransform: 'none',
    borderRadius: '10px', padding: '9px 22px',
    '&:hover': { backgroundColor: C.primaryDark },
    '&.Mui-disabled': { backgroundColor: '#e0e0e0', cursor: 'not-allowed' },
});

const RelatedCard = styled(Box)({
    cursor: 'pointer', transition: 'transform 0.2s ease',
});

const RelatedImgWrapper = styled(Box)({
    position: 'relative', width: '100%', aspectRatio: '1 / 1',
    overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
    '& img': { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' },
    '&:hover img': { transform: 'scale(1.05)' },
});

const RelatedPriceTag = styled(Box)({
    position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255,255,255,0.95)', padding: '3px 10px',
    borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', whiteSpace: 'nowrap',
    '& p': { fontSize: '12px', fontWeight: 600, color: C.price, margin: 0 },
});

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': { color: C.rating },
    '& .MuiRating-iconHover': { color: C.rating },
});

const RatingSummary = styled(Box)({
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#faf8ff',
    borderRadius: '10px', marginBottom: '16px', flexWrap: 'wrap',
});

// ── Main Component ────────────────────────────────────────────────────────────

const ProductDetail = () => {
    const { title_id } = useParams();
    const { isLoading: authLoading } = useAuth();
    const { useProductDetail } = useShopApi();

    const {
        product, allImages, mainImage, relatedProducts, currentPrice, maxQuantity,
        setActiveImage, activeTab, handleTabChange, quantity, handleQuantityChange,
        addedToCart, selectedOptions, handleOptionChange, reviewForm, setReviewForm,
        formError, authDialogOpen, setAuthDialogOpen, reviewsData, reviewsLoading,
        submitReviewMutation, isLoading, error, handleAddToCart, handleReviewSubmit,
        handleNavigateToLogin, navigate,
    } = useProductDetail(title_id);

    if (isLoading || authLoading) {
        return (
            <Section>
                <Container maxWidth="lg">
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="500px">
                        <CircularProgress sx={{ color: C.primary }} />
                    </Box>
                </Container>
            </Section>
        );
    }

    if (error || !product) {
        return (
            <Section>
                <Container maxWidth="lg">
                    <Typography textAlign="center" color="error" sx={{ py: 4, fontSize: '13px' }}>
                        {error ? `Error: ${error.message}` : 'Product not found'}
                    </Typography>
                </Container>
            </Section>
        );
    }

    const stockInfo = getStockLevel(product.stock, product.inStock);
    const averageRating = product.averageRating || 0;
    const reviewCount = product.reviewCount || 0;
    const discountedPrice = product.discountedPrice || product.price;
    const discountPercentage = product.discountPercentage || 0;
    const hasDiscount = discountPercentage > 0 && product.inStock;

    return (
        <Box>
            <SectionTile bgImage={HERO_IMAGE} subtitle="Pet Shop" title="Shop Detail" icon iconClass="flaticon-custom-icon" />

            <Section>
                <Container maxWidth="lg">
                    <Grid container spacing={{ xs: 2, md: 4 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <MainImageWrapper>
                                    {hasDiscount && (
                                        <DiscountBadgeLarge>
                                            <LocalOfferIcon sx={{ fontSize: '16px' }} />
                                            {Math.round(discountPercentage)}% OFF
                                        </DiscountBadgeLarge>
                                    )}
                                    <Box component="img" src={mainImage} alt={product.title} onError={e => { e.target.src = `${NO_IMAGE}/450x450?text=No+Image`; }}
                                        sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                                </MainImageWrapper>
                                {allImages.length > 1 && (
                                    <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        {allImages.map((img, i) => (
                                            <Thumbnail key={i} src={img} alt={`Thumb ${i + 1}`} active={mainImage === img}
                                                onClick={() => setActiveImage(img)} onError={e => { e.target.src = `${NO_IMAGE}/80x80?text=No+Image`; }} />
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoWrapper>
                                <PTitle variant="h1">{product.title}</PTitle>

                                <BadgeRow>
                                    {product.category && <InfoBadge variant="category">{product.category}</InfoBadge>}
                                    {product.material && <InfoBadge variant="material">{product.material}</InfoBadge>}
                                    <InfoBadge variant="stock">{product.inStock && product.stock > 0 ? 'In Stock' : 'Out of Stock'}</InfoBadge>
                                    {hasDiscount && <InfoBadge variant="category" sx={{ backgroundColor: '#e8f5e9', color: C.discount }}>Sale</InfoBadge>}
                                </BadgeRow>

                                <PDesc>{stripHtml(product.description)}</PDesc>

                                <StockCard elevation={0}>
                                    <Stack spacing={1.5}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                            <StockIndicator stocklevel={stockInfo.level}>
                                                {stockInfo.icon} {stockInfo.label}
                                            </StockIndicator>
                                            {product.stock > 0 && (
                                                <Typography sx={{ color: C.textLight, fontSize: '12px' }}>{product.stock} units available</Typography>
                                            )}
                                        </Box>
                                        {product.stock > 0 && (
                                            <>
                                                <StockBar percentage={Math.min((product.stock / (product.stock + 20)) * 100, 100)} />
                                                {product.stock <= 5 && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                        <WarningIcon sx={{ fontSize: '13px', color: C.error }} />
                                                        <Typography variant="caption" sx={{ color: C.error, fontWeight: 500 }}>
                                                            Only {product.stock} items left! Order soon.
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                    </Stack>
                                </StockCard>

                                {/* Rating Summary */}
                                {reviewCount > 0 && (
                                    <RatingSummary>
                                        <StyledRating value={averageRating} readOnly precision={0.5} size="small" />
                                        <Box>
                                            <Typography sx={{ fontSize: '13px', fontWeight: 600, color: C.text }}>
                                                {averageRating.toFixed(1)} out of 5
                                            </Typography>
                                            <Typography sx={{ fontSize: '11px', color: C.textLight }}>
                                                Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                                            </Typography>
                                        </Box>
                                    </RatingSummary>
                                )}

                                {product.options?.length > 0 && (
                                    <Box sx={{ mb: '20px' }}>
                                        {product.options.map(option => (
                                            <Box key={option.id} sx={{ mb: '14px' }}>
                                                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: C.text, mb: '6px', display: 'block' }}>{option.name}</Typography>
                                                <FormControl fullWidth size="small">
                                                    <Select value={selectedOptions[option.id]?.id || ''} displayEmpty sx={{ borderRadius: '10px', fontSize: '13px' }}
                                                        onChange={e => {
                                                            const val = option.values.find(v => v.id === e.target.value);
                                                            if (val) handleOptionChange(option.id, val.id, val);
                                                        }}>
                                                        <MenuItem value="" disabled sx={{ fontSize: '13px' }}>Select {option.name}</MenuItem>
                                                        {option.values.map(v => (
                                                            <MenuItem key={v.id} value={v.id} sx={{ fontSize: '13px' }}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                                    <span>{v.value}</span>
                                                                    {v.priceModifier !== 0 && (
                                                                        <span style={{ color: v.priceModifier > 0 ? C.price : C.success, fontSize: '12px' }}>
                                                                            {v.priceModifier > 0 ? `+৳${v.priceModifier}` : `-৳${Math.abs(v.priceModifier)}`}
                                                                        </span>
                                                                    )}
                                                                </Box>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                <PriceDisplay>
                                    ৳{discountedPrice.toFixed(2)}
                                    {hasDiscount && (
                                        <>
                                            <span className="orig">৳{parseFloat(product.price).toFixed(2)}</span>
                                            <span className="discount">-{Math.round(discountPercentage)}% OFF</span>
                                        </>
                                    )}
                                </PriceDisplay>

                                <CartWrapper>
                                    {product.inStock && product.stock > 0 ? (
                                        <>
                                            <QtyInput type="text" value={quantity} onChange={handleQuantityChange}
                                                inputProps={{ min: 1, max: maxQuantity }} size="small" />
                                            {addedToCart ? (
                                                <ViewCartBtn variant="outlined" onClick={() => navigate('/cart')}>
                                                    <ShoppingCartCheckoutIcon sx={{ mr: 0.8, fontSize: '15px' }} /> View Cart
                                                </ViewCartBtn>
                                            ) : (
                                                <AddBtn variant="contained" onClick={handleAddToCart}>
                                                    <AddShoppingCartIcon sx={{ mr: 0.8, fontSize: '15px' }} /> Add to Cart
                                                </AddBtn>
                                            )}
                                        </>
                                    ) : (
                                        <AddBtn variant="contained" disabled>
                                            <CancelIcon sx={{ mr: 0.8, fontSize: '15px' }} /> Out of Stock
                                        </AddBtn>
                                    )}
                                </CartWrapper>

                                <Box>
                                    <FeatureItem><PetsIcon /><p>Give the fun to your best friend!</p></FeatureItem>
                                    <FeatureItem><RecyclingIcon /><p>100% quality guaranteed</p></FeatureItem>
                                    {product.stock > 0 && <FeatureItem><LocalShippingIcon /><p>Free shipping on orders over ৳500</p></FeatureItem>}
                                </Box>
                            </InfoWrapper>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: { xs: '30px', md: '56px' } }}>
                        <TabHeaders>
                            <TabHeader active={activeTab === 'features'} onClick={() => handleTabChange('features')}>Features</TabHeader>
                            <TabHeader active={activeTab === 'reviews'} onClick={() => handleTabChange('reviews')}>
                                Reviews {reviewCount > 0 ? `(${reviewCount})` : ''}
                            </TabHeader>
                        </TabHeaders>

                        {activeTab === 'features' && (
                            <Box>
                                {product.features && product.features !== '<p><br></p>' ? (
                                    <Box sx={{ fontSize: '13px', color: C.textLight, lineHeight: 1.6, '& ul, & ol': { paddingLeft: '1.5rem' }, '& li': { marginBottom: '8px' } }}
                                        dangerouslySetInnerHTML={{ __html: product.features }} />
                                ) : (
                                    <FeaturesList>
                                        {product.category && <li><FavoriteIcon />Category: {product.category}</li>}
                                        {product.material && <li><FavoriteIcon />Material: {product.material}</li>}
                                        <li><FavoriteIcon />High quality pet product</li>
                                        <li><FavoriteIcon />Safe for your pets</li>
                                        {product.stock > 0 && <li><InventoryIcon />Stock: {product.stock} units</li>}
                                    </FeaturesList>
                                )}
                            </Box>
                        )}

                        {activeTab === 'reviews' && (
                            <Box>
                                {reviewsLoading ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress sx={{ color: C.primary }} size={28} /></Box>
                                ) : !reviewsData || reviewsData.length === 0 ? (
                                    <Typography sx={{ color: C.textLight, mb: 3, fontSize: '13px' }}>
                                        No reviews yet. Be the first to leave a review!
                                    </Typography>
                                ) : (
                                    <Box sx={{ mb: 4 }}>
                                        {reviewsData.map(review => (
                                            <ReviewItem key={review._id}>
                                                <ReviewAvatar>{getInitials(review.name)}</ReviewAvatar>
                                                <Box flex={1}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8, flexWrap: 'wrap', gap: '6px' }}>
                                                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{review.name}</Typography>
                                                        <Typography sx={{ fontSize: '11px', color: C.textLight }}>{new Date(review.createdAt).toLocaleDateString()}</Typography>
                                                    </Box>
                                                    <StyledRating value={review.rating} readOnly size="small" />
                                                    <Typography sx={{ fontSize: '13px', color: C.textLight, lineHeight: 1.5, mt: 0.8 }}>{review.comment}</Typography>
                                                </Box>
                                            </ReviewItem>
                                        ))}
                                    </Box>
                                )}

                                <ReviewFormWrapper>
                                    <Typography sx={{ fontSize: '15px', fontWeight: 600, color: C.text, mb: '18px' }}>Write a Review</Typography>
                                    <Box sx={{ mb: 1.5 }}>
                                        <Typography sx={{ mb: 0.8, fontWeight: 500, fontSize: '12px' }}>Rating *</Typography>
                                        <StyledRating value={reviewForm.rating} onChange={(_, val) => setReviewForm(p => ({ ...p, rating: val }))} size="medium" />
                                    </Box>
                                    <StyledField fullWidth placeholder="Name *" size="small" value={reviewForm.name} onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))} />
                                    <StyledField fullWidth placeholder="Email *" type="email" size="small" value={reviewForm.email} onChange={e => setReviewForm(p => ({ ...p, email: e.target.value }))} />
                                    <StyledField fullWidth placeholder="Your Review *" multiline rows={4} value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} />
                                    {formError && <Typography variant="caption" sx={{ color: C.error, display: 'block', mb: 1.5 }}>{formError}</Typography>}
                                    <SubmitBtn variant="contained" onClick={handleReviewSubmit} disabled={submitReviewMutation.isPending}>
                                        {submitReviewMutation.isPending ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Submit Review'}
                                    </SubmitBtn>
                                </ReviewFormWrapper>
                            </Box>
                        )}
                    </Box>

                    {relatedProducts.length > 0 && (
                        <Box sx={{ mt: { xs: '30px', md: '56px' } }}>
                            <Typography sx={{ fontSize: '20px', fontWeight: 700, color: C.text, mb: '28px', textAlign: 'center' }}>
                                You May Also Like
                            </Typography>
                            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
                                {relatedProducts.map(rp => {
                                    const rpDiscount = rp.discountPercentage || 0;
                                    const rpHasDiscount = rpDiscount > 0 && rp.inStock;
                                    const rpDiscountedPrice = rp.discountedPrice || rp.price;

                                    return (
                                        <Grid size={{ xs: 6, sm: 6, md: 3 }} key={rp._id}>
                                            <RelatedCard onClick={() => navigate(`/shop/${rp.title_id}`)}>
                                                <RelatedImgWrapper>
                                                    {rpHasDiscount && (
                                                        <DiscountBadgeLarge sx={{ 
                                                            top: '12px', 
                                                            left: '12px', 
                                                            padding: '5px 11px', 
                                                            fontSize: '11px' 
                                                        }}>
                                                            <LocalOfferIcon sx={{ fontSize: '14px' }} />
                                                            {Math.round(rpDiscount)}% OFF
                                                        </DiscountBadgeLarge>
                                                    )}
                                                    <img src={rp.featuredImage} alt={rp.title} onError={e => { e.target.src = `${NO_IMAGE}/300x300?text=No+Image`; }} />
                                                    <RelatedPriceTag>
                                                        <Typography variant="body2">
                                                            ৳{rpDiscountedPrice}
                                                            {rpHasDiscount && (
                                                                <span style={{ 
                                                                    textDecoration: 'line-through', 
                                                                    color: '#999', 
                                                                    fontSize: '10px', 
                                                                    marginLeft: '6px' 
                                                                }}>
                                                                    ৳{rp.price}
                                                                </span>
                                                            )}
                                                        </Typography>
                                                    </RelatedPriceTag>
                                                </RelatedImgWrapper>
                                                <Box sx={{ mt: '10px', textAlign: 'center' }}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 500, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {rp.title}
                                                    </Typography>
                                                </Box>
                                            </RelatedCard>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    )}
                </Container>
            </Section>

            <Dialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: '18px', padding: '8px', maxWidth: '400px', width: '90%', margin: '16px' } }}>
                <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <LockIcon sx={{ color: C.primary, fontSize: '22px' }} />
                    <Typography variant="h6" component="span" fontWeight={700} fontSize="15px">Sign In Required</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: C.textLight, fontSize: '13px', lineHeight: 1.5 }}>
                        Please sign in to add items to your cart and complete your purchase.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0, gap: 1.5 }}>
                    <Button onClick={() => setAuthDialogOpen(false)} sx={{ color: C.textLight, textTransform: 'none', fontWeight: 500, fontSize: '13px', borderRadius: '10px', '&:hover': { backgroundColor: '#f5f5f5' } }}>
                        Cancel
                    </Button>
                    <Button onClick={handleNavigateToLogin} variant="contained"
                        sx={{ backgroundColor: C.primary, textTransform: 'none', fontWeight: 600, fontSize: '13px', borderRadius: '10px', padding: '8px 20px', '&:hover': { backgroundColor: C.primaryDark } }}>
                        Sign In
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductDetail;