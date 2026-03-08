import React, { useState } from 'react';
import {
  Container, Grid, Box, Typography, styled, Button, TextField,
  Rating, Avatar, CircularProgress, Snackbar, Alert,
} from '@mui/material';
import {
  Star as StarIcon, StarBorder as StarBorderIcon,
  Pets as PetsIcon, Recycling as RecyclingIcon, Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';
import SectionTile from '../../components/SectionTile';
import { useCart } from '../../context/CartContext'; // ← ADDED

// ─── Theme ───────────────────────────────────────────────────────────────────
const primaryColor = '#db89ca';
const iconColor = '#db89ca';
const textColor = '#1a1a1a';
const lightGray = '#f5f5f5';
const mediumGray = '#e0e0e0';
const darkGray = '#666666';

// ─── Styled Components ───────────────────────────────────────────────────────

const ProductDetailSection = styled(Box)({
  backgroundColor: '#ffffff',
  padding: '80px 0',
  width: '100%',
  '@media (max-width: 900px)': { padding: '60px 0' },
  '@media (max-width: 600px)': { padding: '40px 0' },
});

const LoadingContainer = styled(Box)({
  display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px', width: '100%',
});

const ImageGalleryWrapper = styled(Box)({
  display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '450px', margin: '0 auto',
  '@media (max-width: 900px)': { maxWidth: '400px' },
  '@media (max-width: 600px)': { maxWidth: '100%' },
});

const MainImageWrapper = styled(Box)({
  width: '100%', borderRadius: '10px', overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)', backgroundColor: '#fff',
});

const MainImage = styled('img')({ width: '100%', height: 'auto', display: 'block' });

const ThumbnailWrapper = styled(Box)({
  display: 'flex', gap: '10px', flexWrap: 'wrap',
  '@media (max-width: 600px)': { justifyContent: 'center' },
});

const Thumbnail = styled('img')(({ active }) => ({
  width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer',
  border: active ? `3px solid ${primaryColor}` : '3px solid transparent',
  opacity: active ? 1 : 0.7, transition: 'all 0.2s ease',
  '&:hover': { opacity: 1, borderColor: primaryColor },
  '@media (max-width: 600px)': { width: '60px', height: '60px' },
}));

const ProductInfoWrapper = styled(Box)({
  padding: '20px',
  '@media (max-width: 900px)': { padding: '20px 0' },
});

const ProductTitle = styled(Typography)({
  fontSize: '32px', fontWeight: 700, color: textColor, marginBottom: '20px',
  '@media (max-width: 600px)': { fontSize: '28px' },
});

const ProductDescription = styled(Typography)({
  fontSize: '16px', color: darkGray, lineHeight: 1.6, marginBottom: '30px',
});

const ProductPrice = styled(Typography)({
  fontSize: '36px', fontWeight: 700, color: primaryColor, marginBottom: '15px',
  '@media (max-width: 600px)': { fontSize: '32px' },
});

const RatingWrapper = styled(Box)({
  display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px',
});

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': { color: '#ffb400' },
  '& .MuiRating-iconHover': { color: '#ffb400' },
});

const AddToCartWrapper = styled(Box)({
  display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap',
  '@media (max-width: 600px)': { flexDirection: 'column' },
});

const QuantityInput = styled(TextField)({
  width: '80px',
  '& .MuiOutlinedInput-root': { borderRadius: '8px', '& fieldset': { borderColor: mediumGray }, '&:hover fieldset': { borderColor: primaryColor } },
  '& input': { textAlign: 'center', padding: '8px 0', fontSize: '14px' },
  '@media (max-width: 600px)': { width: '100%' },
});

const AddToCartButton = styled(Button)({
  backgroundColor: primaryColor, color: '#fff', fontSize: '14px', fontWeight: 600,
  textTransform: 'none', borderRadius: '8px', padding: '6px 16px', minWidth: '120px',
  '&:hover': { backgroundColor: '#c06bb0' },
  '@media (max-width: 600px)': { width: '100%', padding: '8px 16px' },
});

// ← ADDED: "View Cart" button shown after item is added
const ViewCartButton = styled(Button)({
  backgroundColor: 'transparent', color: primaryColor, fontSize: '14px', fontWeight: 600,
  textTransform: 'none', borderRadius: '8px', padding: '6px 16px', minWidth: '120px',
  border: `2px solid ${primaryColor}`,
  '&:hover': { backgroundColor: primaryColor, color: '#fff' },
  '@media (max-width: 600px)': { width: '100%', padding: '8px 16px' },
});

const FeatureItem = styled(Box)({
  display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px',
  '& svg': { fontSize: '24px', color: iconColor },
  '& p': { fontSize: '16px', color: textColor, margin: 0, fontWeight: 500 },
});

const BadgeRow = styled(Box)({ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' });

const Badge = styled(Box)(({ variant }) => ({
  padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
  backgroundColor: variant === 'stock' ? '#e8f5e9' : variant === 'category' ? '#f3e5f5' : '#e3f2fd',
  color: variant === 'stock' ? '#388e3c' : variant === 'category' ? '#7b1fa2' : '#1565c0',
}));

const TabsWrapper = styled(Box)({ marginTop: '50px' });

const TabHeaders = styled(Box)({
  display: 'flex', gap: '30px', borderBottom: `2px solid ${mediumGray}`, marginBottom: '30px',
});

const TabHeader = styled(Typography)(({ active }) => ({
  fontSize: '18px', fontWeight: 600, color: active ? primaryColor : darkGray, cursor: 'pointer',
  paddingBottom: '10px', borderBottom: active ? `3px solid ${primaryColor}` : '3px solid transparent',
  transition: 'all 0.2s ease', '&:hover': { color: primaryColor },
}));

const TabContent = styled(Box)({ padding: '20px 0' });

const FeaturesList = styled('ul')({
  listStyle: 'none', padding: 0, margin: 0,
  '& li': { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', fontSize: '16px', color: darkGray, '& svg': { color: iconColor, fontSize: '20px' } },
});

const ReviewsWrapper = styled(Box)({ marginTop: '30px' });

const ReviewItem = styled(Box)({
  display: 'flex', gap: '20px', padding: '20px 0', borderBottom: `1px solid ${mediumGray}`,
  '@media (max-width: 600px)': { flexDirection: 'column', gap: '10px' },
});

const ReviewAvatar = styled(Avatar)({ width: '60px', height: '60px', backgroundColor: iconColor });
const ReviewContent = styled(Box)({ flex: 1 });
const ReviewHeader = styled(Box)({
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px',
});
const ReviewAuthor = styled(Typography)({ fontSize: '16px', fontWeight: 600, color: textColor });
const ReviewDate = styled(Typography)({ fontSize: '14px', color: darkGray });
const ReviewText = styled(Typography)({ fontSize: '15px', color: darkGray, lineHeight: 1.6, marginTop: '10px' });

const ReviewFormWrapper = styled(Box)({
  marginTop: '30px', padding: '30px', backgroundColor: lightGray, borderRadius: '10px',
});

const FormTitle = styled(Typography)({ fontSize: '20px', fontWeight: 600, color: textColor, marginBottom: '20px' });

const StyledTextField = styled(TextField)({
  marginBottom: '20px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px', backgroundColor: '#fff',
    '& fieldset': { borderColor: mediumGray },
    '&:hover fieldset': { borderColor: primaryColor },
    '&.Mui-focused fieldset': { borderColor: primaryColor },
  },
});

const SubmitButton = styled(Button)({
  backgroundColor: primaryColor, color: '#fff', fontSize: '16px', fontWeight: 600,
  textTransform: 'none', borderRadius: '8px', padding: '12px 30px',
  '&:hover': { backgroundColor: '#c06bb0' },
});

const RelatedProductsWrapper = styled(Box)({ marginTop: '60px' });
const RelatedTitle = styled(Typography)({ fontSize: '24px', fontWeight: 700, color: textColor, marginBottom: '30px', textAlign: 'center' });
const RelatedProductCard = styled(Box)({ marginBottom: '30px', cursor: 'pointer' });
const RelatedProductItem = styled(Box)({ textAlign: 'center', position: 'relative' });
const RelatedImageWrapper = styled(Box)({
  position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: '10px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)', transition: 'all 0.3s ease',
  '& img': { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },
  '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.15)' },
  '&:hover img': { transform: 'scale(1.05)' },
});
const RelatedPriceOverlay = styled(Box)({
  position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
  backgroundColor: 'rgba(255,255,255,0.95)', padding: '6px 16px', borderRadius: '25px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)', zIndex: 2, whiteSpace: 'nowrap',
  '& h4': { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: textColor, margin: 0 },
  '& .hot': { color: primaryColor, fontWeight: 600, fontSize: '13px' },
  '& .price': { color: '#555', fontWeight: 600, fontSize: '14px' },
});
const RelatedProductTitle = styled(Box)({
  marginTop: '15px',
  '& h5': { fontSize: '16px', fontWeight: 600, color: textColor, margin: 0, '& a': { color: 'inherit', textDecoration: 'none', transition: 'color 0.2s ease', '&:hover': { color: primaryColor } } },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

const getRandomFour = (arr, excludeId) => {
  const filtered = arr.filter((p) => p._id !== excludeId);
  return [...filtered].sort(() => Math.random() - 0.5).slice(0, 4);
};

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

// ─── Component ───────────────────────────────────────────────────────────────

const ProductDetail = () => {
  const { title_id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToCart } = useCart(); // ← ADDED

  const [activeImage, setActiveImage] = useState(null);
  const [activeTab, setActiveTab] = useState('features');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false); // ← ADDED

  // Review form state
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', comment: '', rating: 0 });
  const [formError, setFormError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: productRes, isLoading, error } = useQuery({
    queryKey: ['product', title_id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/${title_id}`);
      return res.data;
    },
    enabled: !!title_id,
  });

  const { data: allProductsRes } = useQuery({
    queryKey: ['products-all'],
    queryFn: async () => {
      const res = await axiosInstance.get('/products');
      return res.data;
    },
  });

  const product = productRes?.data || productRes;
  const allProducts = allProductsRes?.data || [];
  const relatedProducts = product ? getRandomFour(allProducts, product._id) : [];

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', title_id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/${title_id}/reviews`);
      return res.data;
    },
    enabled: !!title_id && activeTab === 'reviews',
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const res = await axiosInstance.post(`/products/${title_id}/reviews`, reviewData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', title_id] });
      queryClient.invalidateQueries({ queryKey: ['product', title_id] });
      setReviewForm({ name: '', email: '', comment: '', rating: 0 });
      setFormError('');
      setSnackbar({ open: true, message: 'Review submitted successfully!', severity: 'success' });
    },
    onError: (err) => {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to submit review.', severity: 'error' });
    },
  });

  const mainImage = activeImage || product?.featuredImage;
  const allImages = product ? [product.featuredImage, ...(product.gallery || [])].filter(Boolean) : [];

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (val > 0) setQuantity(val);
  };

  // ← ADDED: add to cart handler
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setSnackbar({ open: true, message: `${product.title} added to cart!`, severity: 'success' });
  };

  const handleReviewSubmit = () => {
    if (!reviewForm.name.trim()) { setFormError('Name is required.'); return; }
    if (!reviewForm.email.trim()) { setFormError('Email is required.'); return; }
    if (!reviewForm.rating) { setFormError('Please select a rating.'); return; }
    if (!reviewForm.comment.trim()) { setFormError('Review comment is required.'); return; }
    setFormError('');
    submitReviewMutation.mutate({
      name: reviewForm.name,
      email: reviewForm.email,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'reviews') {
      queryClient.invalidateQueries({ queryKey: ['reviews', title_id] });
    }
  };

  // ── Loading / Error ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <ProductDetailSection>
        <Container maxWidth="lg">
          <LoadingContainer><CircularProgress sx={{ color: primaryColor }} /></LoadingContainer>
        </Container>
      </ProductDetailSection>
    );
  }

  if (error || !product) {
    return (
      <ProductDetailSection>
        <Container maxWidth="lg">
          <Typography textAlign="center" color="error">
            {error ? `Error: ${error.message}` : 'Product not found'}
          </Typography>
        </Container>
      </ProductDetailSection>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box>
      <SectionTile
        bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg"
        subtitle="Find a new friend"
        title="Shop Detail"
        icon={true}
        iconClass="flaticon-custom-icon"
      />

      <ProductDetailSection>
        <Container maxWidth="lg">

          <Grid container spacing={4} justifyContent="center" alignItems="flex-start">

            {/* Image Gallery */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ImageGalleryWrapper>
                <MainImageWrapper>
                  <MainImage
                    src={mainImage}
                    alt={product.title}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/450x450?text=No+Image'; }}
                  />
                </MainImageWrapper>
                {allImages.length > 1 && (
                  <ThumbnailWrapper>
                    {allImages.map((img, i) => (
                      <Thumbnail
                        key={i} src={img} alt={`Thumbnail ${i + 1}`}
                        active={mainImage === img ? 1 : 0}
                        onClick={() => setActiveImage(img)}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/70x70?text=No+Image'; }}
                      />
                    ))}
                  </ThumbnailWrapper>
                )}
              </ImageGalleryWrapper>
            </Grid>

            {/* Product Info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ProductInfoWrapper>
                <ProductTitle variant="h3">{product.title}</ProductTitle>

                <BadgeRow>
                  {product.category && <Badge variant="category">{product.category}</Badge>}
                  {product.material && <Badge variant="material">{product.material}</Badge>}
                  <Badge variant="stock">{product.inStock ? '✓ In Stock' : '✗ Out of Stock'}</Badge>
                </BadgeRow>

                <ProductDescription>{stripHtml(product.description)}</ProductDescription>

                <ProductPrice>${product.price}</ProductPrice>

                <RatingWrapper>
                  <StyledRating
                    value={product.averageRating || 0}
                    readOnly precision={0.5}
                    icon={<StarIcon fontSize="inherit" />}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                  />
                  <Typography sx={{ fontSize: '14px', color: darkGray }}>
                    {product.reviewCount > 0
                      ? `${product.reviewCount} review${product.reviewCount !== 1 ? 's' : ''} · ${product.averageRating} / 5`
                      : 'Be the first to review'}
                  </Typography>
                </RatingWrapper>

                {/* ── Add to Cart / View Cart ── */}
                <AddToCartWrapper>
                  <QuantityInput
                    type="number" value={quantity} onChange={handleQuantityChange}
                    inputProps={{ min: 1 }} size="small"
                  />

                  {/*
                    ← CHANGED from original:
                    - Calls handleAddToCart on click
                    - After adding, swaps to "View Cart" button that navigates to /cart
                  */}
                  {addedToCart ? (
                    <ViewCartButton variant="outlined" onClick={() => navigate('/cart')}>
                      View Cart
                    </ViewCartButton>
                  ) : (
                    <AddToCartButton
                      variant="contained"
                      disabled={!product.inStock}
                      onClick={handleAddToCart}
                    >
                      {product.inStock ? 'Add to cart' : 'Out of Stock'}
                    </AddToCartButton>
                  )}
                </AddToCartWrapper>

                <Box sx={{ mb: '30px' }}>
                  <FeatureItem>
                    <PetsIcon />
                    <p>Give the fun to your best friend!</p>
                  </FeatureItem>
                  <FeatureItem>
                    <RecyclingIcon />
                    <p>100% quality guaranteed</p>
                  </FeatureItem>
                </Box>
              </ProductInfoWrapper>
            </Grid>
          </Grid>

          {/* ── Tabs ──────────────────────────────────────────────────────── */}
          <TabsWrapper>
            <TabHeaders>
              <TabHeader active={activeTab === 'features' ? 1 : 0} onClick={() => handleTabChange('features')}>
                Features
              </TabHeader>
              <TabHeader active={activeTab === 'reviews' ? 1 : 0} onClick={() => handleTabChange('reviews')}>
                Reviews {product.reviewCount > 0 ? `(${product.reviewCount})` : ''}
              </TabHeader>
            </TabHeaders>

            <TabContent>
              {activeTab === 'features' && (
                <Box>
                  {product.features && product.features !== '<p><br></p>' ? (
                    <Box
                      sx={{ fontSize: '16px', color: darkGray, lineHeight: 1.8, '& ul, & ol': { paddingLeft: '1.5rem' }, '& li': { marginBottom: '8px' }, '& h1,& h2,& h3': { color: textColor, fontWeight: 600, marginBottom: '12px' } }}
                      dangerouslySetInnerHTML={{ __html: product.features }}
                    />
                  ) : (
                    <Box>
                      <Typography sx={{ mb: 3, color: darkGray, lineHeight: 1.8 }}>
                        {stripHtml(product.description)}
                      </Typography>
                      <FeaturesList>
                        {product.category && <li><FavoriteIcon />Category: {product.category}</li>}
                        {product.material && <li><FavoriteIcon />Material: {product.material}</li>}
                        <li><FavoriteIcon />High quality pet product</li>
                        <li><FavoriteIcon />Safe for your pets</li>
                      </FeaturesList>
                    </Box>
                  )}
                </Box>
              )}

              {activeTab === 'reviews' && (
                <ReviewsWrapper>
                  {reviewsLoading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress sx={{ color: primaryColor }} /></Box>
                  ) : !reviewsData || reviewsData.data.length === 0 ? (
                    <Typography sx={{ color: darkGray, mb: 3 }}>No reviews yet. Be the first to leave a review!</Typography>
                  ) : (
                    <Box sx={{ mb: 3 }}>
                      {reviewsData.data.map((review) => (
                        <ReviewItem key={review._id}>
                          <ReviewAvatar>{getInitials(review.name)}</ReviewAvatar>
                          <ReviewContent>
                            <ReviewHeader>
                              <ReviewAuthor>{review.name}</ReviewAuthor>
                              <ReviewDate>{new Date(review.createdAt).toLocaleDateString()}</ReviewDate>
                            </ReviewHeader>
                            <StyledRating
                              value={review.rating} readOnly size="small"
                              icon={<StarIcon fontSize="inherit" />}
                              emptyIcon={<StarBorderIcon fontSize="inherit" />}
                            />
                            <ReviewText>{review.comment}</ReviewText>
                          </ReviewContent>
                        </ReviewItem>
                      ))}
                    </Box>
                  )}

                  <ReviewFormWrapper>
                    <FormTitle>Add a review</FormTitle>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontSize: '14px', color: darkGray, mb: 0.5 }}>Your Rating *</Typography>
                      <StyledRating
                        value={reviewForm.rating}
                        onChange={(_, val) => setReviewForm((prev) => ({ ...prev, rating: val }))}
                        name="rating" size="large"
                        icon={<StarIcon fontSize="inherit" />}
                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                      />
                    </Box>
                    <StyledTextField
                      fullWidth placeholder="Name *" required size="small"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <StyledTextField
                      fullWidth placeholder="Email *" type="email" required size="small"
                      value={reviewForm.email}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, email: e.target.value }))}
                    />
                    <StyledTextField
                      fullWidth placeholder="Your Review *" multiline rows={4} required
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                    />
                    {formError && (
                      <Typography sx={{ color: 'error.main', fontSize: '13px', mb: 1 }}>{formError}</Typography>
                    )}
                    <SubmitButton
                      variant="contained"
                      onClick={handleReviewSubmit}
                      disabled={submitReviewMutation.isPending}
                    >
                      {submitReviewMutation.isPending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Submit Review'}
                    </SubmitButton>
                  </ReviewFormWrapper>
                </ReviewsWrapper>
              )}
            </TabContent>
          </TabsWrapper>

          {/* ── Related Products ──────────────────────────────────────────── */}
          {relatedProducts.length > 0 && (
            <RelatedProductsWrapper>
              <RelatedTitle variant="h4">Related products</RelatedTitle>
              <Grid container spacing={3}>
                {relatedProducts.map((rp) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={rp._id}>
                    <RelatedProductCard onClick={() => navigate(`/shop/${rp.title_id}`)}>
                      <RelatedProductItem>
                        <RelatedImageWrapper>
                          <img
                            src={rp.featuredImage} alt={rp.title}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                          />
                          <RelatedPriceOverlay>
                            <h4>
                              <span className="hot">Hot</span>
                              <span className="price">${rp.price}</span>
                            </h4>
                          </RelatedPriceOverlay>
                        </RelatedImageWrapper>
                        <RelatedProductTitle>
                          <h5><a href={`/shop/${rp.title_id}`} onClick={(e) => e.preventDefault()}>{rp.title}</a></h5>
                        </RelatedProductTitle>
                      </RelatedProductItem>
                    </RelatedProductCard>
                  </Grid>
                ))}
              </Grid>
            </RelatedProductsWrapper>
          )}

        </Container>
      </ProductDetailSection>

      {/* Toast */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetail;