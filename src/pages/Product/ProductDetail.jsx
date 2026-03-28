import React, { useState } from 'react';
import {
  Container, Grid, Box, Typography, styled, Button, TextField,
  Rating, Avatar, CircularProgress, Snackbar, Alert, Chip,
  FormControl, InputLabel, Select, MenuItem, Stack, Divider,
  Paper, IconButton, Tooltip, Badge as MuiBadge,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Pets as PetsIcon,
  Recycling as RecyclingIcon,
  Favorite as FavoriteIcon,
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  AddShoppingCart as AddShoppingCartIcon,
  ShoppingCartCheckout as ShoppingCartCheckoutIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';
import SectionTile from '../../components/SectionTile';
import { useCart } from '../../context/CartContext';

// ==================== CONSTANTS ====================
const COLORS = {
  primary: '#db89ca',
  primaryDark: '#c06bb0',
  text: '#1a1a1a',
  textLight: '#666666',
  border: '#e0e0e0',
  background: '#f5f5f5',
  price: '#ff6b6b',
  rating: '#ffb400',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
};

// ==================== STYLED COMPONENTS ====================
const ProductDetailSection = styled(Box)({
  backgroundColor: '#ffffff',
  padding: '80px 0',
  width: '100%',
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '500px',
  width: '100%',
});

const ImageGalleryWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

const MainImageWrapper = styled(Box)({
  width: '100%',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  backgroundColor: '#fff',
});

const MainImage = styled('img')({
  width: '100%',
  height: 'auto',
  display: 'block',
});

const ThumbnailWrapper = styled(Box)({
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
});

const Thumbnail = styled('img')(({ active }) => ({
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '8px',
  cursor: 'pointer',
  border: active ? `2px solid ${COLORS.primary}` : '2px solid transparent',
  opacity: active ? 1 : 0.7,
  transition: 'all 0.2s ease',
  '&:hover': {
    opacity: 1,
    borderColor: COLORS.primary,
  },
}));

const ProductInfoWrapper = styled(Box)({
  padding: '0 20px',
});

const ProductTitle = styled(Typography)({
  fontSize: '32px',
  fontWeight: 700,
  color: COLORS.text,
  marginBottom: '16px',
  lineHeight: 1.2,
});

const ProductDescription = styled(Typography)({
  fontSize: '15px',
  color: COLORS.textLight,
  lineHeight: 1.6,
  marginBottom: '24px',
});

const ProductPrice = styled(Typography)({
  fontSize: '32px',
  fontWeight: 700,
  color: COLORS.price,
  marginBottom: '16px',
});

const RatingWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '24px',
});

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: COLORS.rating,
  },
  '& .MuiRating-iconHover': {
    color: COLORS.rating,
  },
});

const AddToCartWrapper = styled(Box)({
  display: 'flex',
  gap: '16px',
  marginBottom: '32px',
  flexWrap: 'wrap',
});

const QuantityInput = styled(TextField)({
  width: '100px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
  '& input': {
    textAlign: 'center',
    padding: '10px 0',
  },
});

const AddToCartButton = styled(Button)({
  backgroundColor: COLORS.primary,
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  padding: '10px 24px',
  '&:hover': {
    backgroundColor: COLORS.primaryDark,
  },
  '&.Mui-disabled': {
    backgroundColor: '#e0e0e0',
    color: '#9e9e9e',
  },
});

const ViewCartButton = styled(Button)({
  backgroundColor: 'transparent',
  color: COLORS.primary,
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  padding: '10px 24px',
  border: `2px solid ${COLORS.primary}`,
  '&:hover': {
    backgroundColor: COLORS.primary,
    color: '#fff',
  },
});

const FeatureItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
  '& svg': {
    fontSize: '20px',
    color: COLORS.primary,
  },
  '& p': {
    fontSize: '14px',
    color: COLORS.text,
    margin: 0,
  },
});

const BadgeRow = styled(Box)({
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  marginBottom: '20px',
});

const InfoBadge = styled(Box)(({ variant }) => ({
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 600,
  backgroundColor: variant === 'stock' ? '#e8f5e9' : variant === 'category' ? '#f3e5f5' : '#e3f2fd',
  color: variant === 'stock' ? '#2e7d32' : variant === 'category' ? '#7b1fa2' : '#1565c0',
}));

const TabsWrapper = styled(Box)({
  marginTop: '60px',
});

const TabHeaders = styled(Box)({
  display: 'flex',
  gap: '32px',
  borderBottom: `1px solid ${COLORS.border}`,
  marginBottom: '32px',
});

const TabHeader = styled(Typography)(({ active }) => ({
  fontSize: '16px',
  fontWeight: 600,
  color: active ? COLORS.primary : COLORS.textLight,
  cursor: 'pointer',
  paddingBottom: '12px',
  borderBottom: active ? `2px solid ${COLORS.primary}` : '2px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: COLORS.primary,
  },
}));

const TabContent = styled(Box)({
  padding: '0 0 20px 0',
});

const FeaturesList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  '& li': {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    fontSize: '14px',
    color: COLORS.textLight,
    '& svg': {
      color: COLORS.primary,
      fontSize: '18px',
    },
  },
});

const StockStatusCard = styled(Paper)({
  padding: '20px',
  marginBottom: '24px',
  borderRadius: '12px',
  border: `1px solid ${COLORS.border}`,
  boxShadow: 'none',
});

const StockIndicator = styled(Box)(({ stocklevel }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 14px',
  borderRadius: '30px',
  backgroundColor: stocklevel === 'high' ? '#e8f5e9' : stocklevel === 'medium' ? '#fff3e0' : stocklevel === 'low' ? '#ffebee' : '#f3e5f5',
  color: stocklevel === 'high' ? '#2e7d32' : stocklevel === 'medium' ? '#ed6c02' : stocklevel === 'low' ? '#d32f2f' : '#7b1fa2',
  fontWeight: 600,
  fontSize: '13px',
}));

const StockBar = styled(Box)(({ percentage }) => ({
  width: '100%',
  height: '6px',
  backgroundColor: '#e0e0e0',
  borderRadius: '3px',
  overflow: 'hidden',
  marginTop: '12px',
  '&::after': {
    content: '""',
    display: 'block',
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: percentage > 60 ? COLORS.success : percentage > 20 ? COLORS.warning : COLORS.error,
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
}));

const OptionSelector = styled(Box)({
  marginBottom: '24px',
  '& .option-group': {
    marginBottom: '16px',
  },
  '& .option-label': {
    fontSize: '13px',
    fontWeight: 600,
    color: COLORS.text,
    marginBottom: '8px',
    display: 'block',
  },
});

const PriceWithModifier = styled(Typography)({
  fontSize: '28px',
  fontWeight: 700,
  color: COLORS.price,
  marginBottom: '16px',
  '& .original-price': {
    fontSize: '16px',
    color: COLORS.textLight,
    textDecoration: 'line-through',
    marginLeft: '10px',
    fontWeight: 400,
  },
  '& .modifier': {
    fontSize: '13px',
    color: COLORS.primary,
    marginLeft: '10px',
    fontWeight: 500,
  },
});

const ReviewsWrapper = styled(Box)({
  marginTop: '0',
});

const ReviewItem = styled(Box)({
  display: 'flex',
  gap: '16px',
  padding: '20px 0',
  borderBottom: `1px solid ${COLORS.border}`,
});

const ReviewAvatar = styled(Avatar)({
  width: '48px',
  height: '48px',
  backgroundColor: COLORS.primary,
});

const ReviewContent = styled(Box)({
  flex: 1,
});

const ReviewHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
  flexWrap: 'wrap',
  gap: '8px',
});

const ReviewAuthor = styled(Typography)({
  fontSize: '15px',
  fontWeight: 600,
  color: COLORS.text,
});

const ReviewDate = styled(Typography)({
  fontSize: '12px',
  color: COLORS.textLight,
});

const ReviewText = styled(Typography)({
  fontSize: '14px',
  color: COLORS.textLight,
  lineHeight: 1.5,
  marginTop: '8px',
});

const ReviewFormWrapper = styled(Box)({
  marginTop: '32px',
  padding: '24px',
  backgroundColor: COLORS.background,
  borderRadius: '12px',
});

const FormTitle = styled(Typography)({
  fontSize: '18px',
  fontWeight: 600,
  color: COLORS.text,
  marginBottom: '20px',
});

const StyledTextField = styled(TextField)({
  marginBottom: '16px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
});

const SubmitButton = styled(Button)({
  backgroundColor: COLORS.primary,
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  padding: '10px 24px',
  '&:hover': {
    backgroundColor: COLORS.primaryDark,
  },
  '&.Mui-disabled': {
    backgroundColor: '#e0e0e0',
  },
});

const RelatedProductsWrapper = styled(Box)({
  marginTop: '60px',
});

const RelatedTitle = styled(Typography)({
  fontSize: '24px',
  fontWeight: 700,
  color: COLORS.text,
  marginBottom: '32px',
  textAlign: 'center',
});

const RelatedProductCard = styled(Box)({
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
});

const RelatedImageWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
});

const RelatedPriceOverlay = styled(Box)({
  position: 'absolute',
  bottom: '16px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(255,255,255,0.95)',
  padding: '4px 12px',
  borderRadius: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  whiteSpace: 'nowrap',
  '& p': {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.price,
    margin: 0,
  },
});

const RelatedProductTitle = styled(Box)({
  marginTop: '12px',
  textAlign: 'center',
  '& h5': {
    fontSize: '14px',
    fontWeight: 500,
    color: COLORS.text,
    margin: 0,
    '& a': {
      color: 'inherit',
      textDecoration: 'none',
      '&:hover': {
        color: COLORS.primary,
      },
    },
  },
});

// ==================== HELPER FUNCTIONS ====================
const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

const getRandomFour = (arr, excludeId) => {
  const filtered = arr.filter((p) => p._id !== excludeId);
  return [...filtered].sort(() => Math.random() - 0.5).slice(0, 4);
};

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const getStockLevel = (stock, inStock) => {
  if (!inStock || stock <= 0) {
    return { level: 'out', label: 'Out of Stock', icon: <CancelIcon sx={{ fontSize: '16px' }} /> };
  }
  if (stock <= 5) {
    return { level: 'low', label: 'Low Stock', icon: <WarningIcon sx={{ fontSize: '16px' }} /> };
  }
  if (stock <= 20) {
    return { level: 'medium', label: 'Limited Stock', icon: <InventoryIcon sx={{ fontSize: '16px' }} /> };
  }
  return { level: 'high', label: 'In Stock', icon: <CheckCircleIcon sx={{ fontSize: '16px' }} /> };
};

// ==================== MAIN COMPONENT ====================
const ProductDetail = () => {
  const { title_id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToCart } = useCart();

  // State
  const [activeImage, setActiveImage] = useState(null);
  const [activeTab, setActiveTab] = useState('features');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', comment: '', rating: 0 });
  const [formError, setFormError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Queries
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

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', title_id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/${title_id}/reviews`);
      return res.data;
    },
    enabled: !!title_id && activeTab === 'reviews',
  });

  // Derived data
  const product = productRes?.data || productRes;
  const allProducts = allProductsRes?.data || [];
  const relatedProducts = product ? getRandomFour(allProducts, product._id) : [];

  // Price calculation
  const calculateCurrentPrice = () => {
    let currentPrice = parseFloat(product?.price) || 0;
    if (product?.options && selectedOptions) {
      Object.keys(selectedOptions).forEach(optionId => {
        const selectedValue = selectedOptions[optionId];
        if (selectedValue && selectedValue.priceModifier) {
          currentPrice += parseFloat(selectedValue.priceModifier) || 0;
        }
      });
    }
    return currentPrice;
  };

  const currentPrice = calculateCurrentPrice();
  const stockInfo = getStockLevel(product?.stock, product?.inStock);
  const maxQuantity = product?.inStock && product?.stock > 0 ? product.stock : 0;
  const mainImage = activeImage || product?.featuredImage;
  const allImages = product ? [product.featuredImage, ...(product.gallery || [])].filter(Boolean) : [];

  // Mutations
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
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to submit review.',
        severity: 'error',
      });
    },
  });

  // Handlers
  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (val > 0 && val <= maxQuantity) setQuantity(val);
    else if (val > maxQuantity) setQuantity(maxQuantity);
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      selectedOptions,
      selectedPrice: currentPrice,
      quantity,
    };
    addToCart(cartItem, quantity);
    setAddedToCart(true);
    setSnackbar({ open: true, message: `${product.title} added to cart!`, severity: 'success' });
  };

  const handleReviewSubmit = () => {
    if (!reviewForm.name.trim()) {
      setFormError('Name is required.');
      return;
    }
    if (!reviewForm.email.trim()) {
      setFormError('Email is required.');
      return;
    }
    if (!reviewForm.rating) {
      setFormError('Please select a rating.');
      return;
    }
    if (!reviewForm.comment.trim()) {
      setFormError('Review comment is required.');
      return;
    }
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

  const handleOptionChange = (optionId, valueId, valueObj) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: { id: valueId, value: valueObj.value, priceModifier: valueObj.priceModifier },
    }));
    setQuantity(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <ProductDetailSection>
        <Container maxWidth="lg">
          <LoadingContainer>
            <CircularProgress sx={{ color: COLORS.primary }} />
          </LoadingContainer>
        </Container>
      </ProductDetailSection>
    );
  }

  // Error state
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
          <Grid container spacing={4}>
            {/* Image Gallery */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ImageGalleryWrapper>
                <MainImageWrapper>
                  <MainImage
                    src={mainImage}
                    alt={product.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/450x450?text=No+Image';
                    }}
                  />
                </MainImageWrapper>
                {allImages.length > 1 && (
                  <ThumbnailWrapper>
                    {allImages.map((img, i) => (
                      <Thumbnail
                        key={i}
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        active={mainImage === img}
                        onClick={() => setActiveImage(img)}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                    ))}
                  </ThumbnailWrapper>
                )}
              </ImageGalleryWrapper>
            </Grid>

            {/* Product Info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ProductInfoWrapper>
                <ProductTitle variant="h1">{product.title}</ProductTitle>

                <BadgeRow>
                  {product.category && <InfoBadge variant="category">{product.category}</InfoBadge>}
                  {product.material && <InfoBadge variant="material">{product.material}</InfoBadge>}
                  <InfoBadge variant="stock">
                    {product.inStock && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </InfoBadge>
                </BadgeRow>

                <ProductDescription>{stripHtml(product.description)}</ProductDescription>

                {/* Stock Status */}
                <StockStatusCard elevation={0}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <StockIndicator stocklevel={stockInfo.level}>
                        {stockInfo.icon}
                        {stockInfo.label}
                      </StockIndicator>
                      {product.stock > 0 && (
                        <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                          {product.stock} units available
                        </Typography>
                      )}
                    </Box>

                    {product.stock > 0 && (
                      <>
                        <StockBar percentage={(product.stock / (product.stock + 20)) * 100} />
                        {product.stock <= 5 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WarningIcon sx={{ fontSize: '14px', color: COLORS.error }} />
                            <Typography variant="caption" sx={{ color: COLORS.error, fontWeight: 500 }}>
                              Only {product.stock} items left!
                            </Typography>
                          </Box>
                        )}
                      </>
                    )}
                  </Stack>
                </StockStatusCard>

                {/* Product Options */}
                {product.options && product.options.length > 0 && (
                  <OptionSelector>
                    {product.options.map((option) => (
                      <Box key={option.id} className="option-group">
                        <Typography className="option-label">{option.name}</Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={selectedOptions[option.id]?.id || ''}
                            onChange={(e) => {
                              const selectedVal = option.values.find(v => v.id === e.target.value);
                              if (selectedVal) {
                                handleOptionChange(option.id, selectedVal.id, selectedVal);
                              }
                            }}
                            displayEmpty
                            sx={{ borderRadius: '8px' }}
                          >
                            <MenuItem value="" disabled>Select {option.name}</MenuItem>
                            {option.values.map((value) => (
                              <MenuItem key={value.id} value={value.id}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                  <span>{value.value}</span>
                                  {value.priceModifier !== 0 && (
                                    <span style={{ color: value.priceModifier > 0 ? COLORS.price : COLORS.success }}>
                                      {value.priceModifier > 0 ? `+৳${value.priceModifier}` : `-৳${Math.abs(value.priceModifier)}`}
                                    </span>
                                  )}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    ))}
                  </OptionSelector>
                )}

                {/* Price */}
                <PriceWithModifier>
                  ৳{currentPrice.toFixed(2)}
                  {currentPrice !== parseFloat(product.price) && (
                    <>
                      <span className="original-price">৳{parseFloat(product.price).toFixed(2)}</span>
                      <span className="modifier">
                        {currentPrice > parseFloat(product.price) ? '+ options' : '- options'}
                      </span>
                    </>
                  )}
                </PriceWithModifier>

                {/* Rating */}
                <RatingWrapper>
                  <StyledRating
                    value={product.averageRating || 0}
                    readOnly
                    precision={0.5}
                    size="medium"
                  />
                  <Typography variant="body2" sx={{ color: COLORS.textLight }}>
                    {product.reviewCount > 0
                      ? `${product.reviewCount} review${product.reviewCount !== 1 ? 's' : ''} · ${product.averageRating}/5`
                      : 'No reviews yet'}
                  </Typography>
                </RatingWrapper>

                {/* Add to Cart */}
                <AddToCartWrapper>
                  {product.inStock && product.stock > 0 ? (
                    <>
                      <QuantityInput
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        inputProps={{ min: 1, max: maxQuantity }}
                        size="small"
                      />
                      {addedToCart ? (
                        <ViewCartButton variant="outlined" onClick={() => navigate('/cart')}>
                          <ShoppingCartCheckoutIcon sx={{ mr: 1, fontSize: '16px' }} />
                          View Cart
                        </ViewCartButton>
                      ) : (
                        <AddToCartButton variant="contained" onClick={handleAddToCart}>
                          <AddShoppingCartIcon sx={{ mr: 1, fontSize: '16px' }} />
                          Add to Cart
                        </AddToCartButton>
                      )}
                    </>
                  ) : (
                    <AddToCartButton variant="contained" disabled>
                      <CancelIcon sx={{ mr: 1, fontSize: '16px' }} />
                      Out of Stock
                    </AddToCartButton>
                  )}
                </AddToCartWrapper>

                {/* Features */}
                <Box>
                  <FeatureItem>
                    <PetsIcon />
                    <p>Give the fun to your best friend!</p>
                  </FeatureItem>
                  <FeatureItem>
                    <RecyclingIcon />
                    <p>100% quality guaranteed</p>
                  </FeatureItem>
                  {product.stock > 0 && (
                    <FeatureItem>
                      <LocalShippingIcon />
                      <p>Free shipping on orders over ৳500</p>
                    </FeatureItem>
                  )}
                </Box>
              </ProductInfoWrapper>
            </Grid>
          </Grid>

          {/* Tabs Section */}
          <TabsWrapper>
            <TabHeaders>
              <TabHeader active={activeTab === 'features'} onClick={() => handleTabChange('features')}>
                Features
              </TabHeader>
              <TabHeader active={activeTab === 'reviews'} onClick={() => handleTabChange('reviews')}>
                Reviews {product.reviewCount > 0 ? `(${product.reviewCount})` : ''}
              </TabHeader>
            </TabHeaders>

            <TabContent>
              {activeTab === 'features' && (
                <Box>
                  {product.features && product.features !== '<p><br></p>' ? (
                    <Box
                      sx={{
                        fontSize: '14px',
                        color: COLORS.textLight,
                        lineHeight: 1.6,
                        '& ul, & ol': { paddingLeft: '1.5rem' },
                        '& li': { marginBottom: '8px' },
                      }}
                      dangerouslySetInnerHTML={{ __html: product.features }}
                    />
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
                <ReviewsWrapper>
                  {reviewsLoading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress sx={{ color: COLORS.primary }} />
                    </Box>
                  ) : !reviewsData || reviewsData.data.length === 0 ? (
                    <Typography sx={{ color: COLORS.textLight, mb: 3 }}>
                      No reviews yet. Be the first to leave a review!
                    </Typography>
                  ) : (
                    <Box sx={{ mb: 4 }}>
                      {reviewsData.data.map((review) => (
                        <ReviewItem key={review._id}>
                          <ReviewAvatar>{getInitials(review.name)}</ReviewAvatar>
                          <ReviewContent>
                            <ReviewHeader>
                              <ReviewAuthor>{review.name}</ReviewAuthor>
                              <ReviewDate>
                                {new Date(review.createdAt).toLocaleDateString()}
                              </ReviewDate>
                            </ReviewHeader>
                            <StyledRating value={review.rating} readOnly size="small" />
                            <ReviewText>{review.comment}</ReviewText>
                          </ReviewContent>
                        </ReviewItem>
                      ))}
                    </Box>
                  )}

                  <ReviewFormWrapper>
                    <FormTitle>Write a Review</FormTitle>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Rating *
                      </Typography>
                      <StyledRating
                        value={reviewForm.rating}
                        onChange={(_, val) => setReviewForm(prev => ({ ...prev, rating: val }))}
                        size="large"
                      />
                    </Box>
                    <StyledTextField
                      fullWidth
                      placeholder="Name *"
                      size="small"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <StyledTextField
                      fullWidth
                      placeholder="Email *"
                      type="email"
                      size="small"
                      value={reviewForm.email}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <StyledTextField
                      fullWidth
                      placeholder="Your Review *"
                      multiline
                      rows={4}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    />
                    {formError && (
                      <Typography variant="caption" sx={{ color: COLORS.error, display: 'block', mb: 2 }}>
                        {formError}
                      </Typography>
                    )}
                    <SubmitButton
                      variant="contained"
                      onClick={handleReviewSubmit}
                      disabled={submitReviewMutation.isPending}
                    >
                      {submitReviewMutation.isPending ? (
                        <CircularProgress size={20} sx={{ color: '#fff' }} />
                      ) : (
                        'Submit Review'
                      )}
                    </SubmitButton>
                  </ReviewFormWrapper>
                </ReviewsWrapper>
              )}
            </TabContent>
          </TabsWrapper>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <RelatedProductsWrapper>
              <RelatedTitle>You May Also Like</RelatedTitle>
              <Grid container spacing={3}>
                {relatedProducts.map((rp) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={rp._id}>
                    <RelatedProductCard onClick={() => navigate(`/shop/${rp.title_id}`)}>
                      <RelatedImageWrapper>
                        <img
                          src={rp.featuredImage}
                          alt={rp.title}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                          }}
                        />
                        <RelatedPriceOverlay>
                          <Typography variant="body2">৳{rp.price}</Typography>
                        </RelatedPriceOverlay>
                      </RelatedImageWrapper>
                      <RelatedProductTitle>
                        <h5>{rp.title}</h5>
                      </RelatedProductTitle>
                    </RelatedProductCard>
                  </Grid>
                ))}
              </Grid>
            </RelatedProductsWrapper>
          )}
        </Container>
      </ProductDetailSection>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetail;