import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Grid, Box, Typography, styled, CircularProgress, Button, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Rating,
  Tooltip, Chip
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LockIcon from '@mui/icons-material/Lock';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../auth/AuthProvider';
import { useShopApi } from '../../hooks/useShopApi';

// ── Colors ────────────────────────────────────────────────────────────────────
const PRIMARY_COLOR = '#5C4D91';
const PRICE_COLOR = '#ff6b6b';
const PRIMARY_DARK = '#4A3D75';
const ACCENT = '#db89ca';
const DISCOUNT_COLOR = '#10b981';
const NO_IMAGE = 'https://via.placeholder.com/400x400?text=No+Image';

// ── Styled Components ─────────────────────────────────────────────────────────

const ShopSection = styled(Box)({
  padding: '40px 0',
  backgroundColor: '#fff',
  '@media (max-width: 900px)': { padding: '60px 0' },
  '@media (max-width: 600px)': { padding: '40px 0' },
});

const SectionHeaderWrapper = styled(Box)({
  textAlign: 'center',
  marginBottom: '50px',
});

const HeaderTopRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '10px',
  flexWrap: 'wrap',
});

const SectionIconWrapper = styled(Box)({
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  backgroundColor: ACCENT,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const SectionSubtitle = styled(Typography)({
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#666',
  textTransform: 'uppercase',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '26px',
  fontWeight: 700,
  color: '#1a1a1a',
  lineHeight: 1.2,
  [theme.breakpoints.down('md')]: { fontSize: '32px' },
  [theme.breakpoints.down('sm')]: { fontSize: '28px', padding: '0 15px' },
}));

// Card design - Consistent with Product listing
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
    transform: 'translateY(-2px)',
  },
  '&:hover .product-image': outOfStock ? {} : {
    transform: 'scale(1.05)',
  },
}));

const ImageWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  backgroundColor: '#f5f5f5'
});

const ProductImage = styled('img')({
  width: '100%',
  height: '240px',
  objectFit: 'cover',
  display: 'block',
  transition: 'transform 0.5s ease',
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

const OutOfStockBadge = styled(Box)({
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: '#fff',
  padding: '3px 10px',
  borderRadius: '20px',
  fontSize: '10px',
  fontWeight: 600,
  zIndex: 2,
});

const FeaturedBadge = styled(Box)({
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: PRIMARY_COLOR,
  color: '#fff',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: 600,
  zIndex: 2,
});

const CardBody = styled(Box)({
  padding: '12px 12px 16px',
  textAlign: 'start'
});

const ProductName = styled(Typography)({
  fontSize: '13px',
  fontWeight: 600,
  color: '#1a1a1a',
  marginBottom: '4px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

const ProductCategory = styled(Typography)({
  fontSize: '11px',
  color: '#999',
  marginBottom: '6px'
});

const PriceWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '8px',
  flexWrap: 'wrap'
});

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

const RatingSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '10px',
  flexWrap: 'wrap',
});

const RatingText = styled(Typography)({
  fontSize: '11px',
  color: '#999',
  fontWeight: 500
});

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': { color: '#ffb400', fontSize: '14px' },
  '& .MuiRating-iconEmpty': { color: '#ddd', fontSize: '14px' },
});

const AddToCartBtn = styled(Button)({
  backgroundColor: ACCENT,
  color: '#fff',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '30px',
  padding: '6px 14px',
  width: '100%',
  gap: '5px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#c96db8',
    boxShadow: '0 4px 12px rgba(219,137,202,0.4)'
  },
  '&.Mui-disabled': {
    backgroundColor: '#e0e0e0',
    color: '#999',
    cursor: 'not-allowed'
  },
});

const ViewCartBtn = styled(Button)({
  backgroundColor: 'transparent',
  color: ACCENT,
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '30px',
  padding: '6px 14px',
  width: '100%',
  gap: '5px',
  border: `2px solid ${ACCENT}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: ACCENT,
    color: '#fff',
    boxShadow: '0 4px 12px rgba(219,137,202,0.4)'
  },
});

const SectionInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '50px',
  gap: '30px',
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '20px',
    marginTop: '40px',
    padding: '0 20px',
  },
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
});

const NoProductsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '300px',
  textAlign: 'center',
  flexDirection: 'column',
  gap: '16px',
});

// ── Helper Functions ─────────────────────────────────────────────────────────

const shuffleArray = (array) => {
  if (!array || array.length === 0) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ── ProductCardItem ───────────────────────────────────────────────────────────

const ProductCardItem = ({ product, onAddToCart, isAuthenticated, onAuthRequired }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    if (!product.inStock) {
      onAddToCart(product.title, false);
      return;
    }

    addToCart(product, 1);
    setAddedToCart(true);
    onAddToCart(product.title, true);

    // Reset the "Added to Cart" state after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const handleViewCart = (e) => {
    e.stopPropagation();
    navigate('/cart');
  };

  const handleCardClick = () => {
    if (!product.inStock) return;
    navigate(`/shop/${product.title_id}`);
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

        {product.isFeatured && (
          <FeaturedBadge>
            <StarIcon sx={{ fontSize: '12px', mr: 0.5 }} />
            Featured
          </FeaturedBadge>
        )}

        <ProductImage
          className="product-image"
          src={product.featuredImage}
          alt={product.title}
          onError={(e) => { e.target.src = NO_IMAGE; }}
          loading="lazy"
        />
      </ImageWrapper>

      <CardBody>
        <ProductName title={product.title}>
          {product.title}
        </ProductName>

        <ProductCategory>
          {product.category || 'General'}
        </ProductCategory>

        <PriceWrapper>
          <ProductPrice isDiscounted={hasDiscount}>
            ৳ {discountedPrice?.toLocaleString()}
          </ProductPrice>
          {hasDiscount && (
            <OriginalPrice>৳ {product?.price?.toLocaleString()}</OriginalPrice>
          )}
        </PriceWrapper>

        <RatingSection>
          <StyledRating 
            value={averageRating} 
            readOnly 
            precision={0.5} 
            size="small" 
          />
          <RatingText>
            {reviewCount > 0 ? `(${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})` : 'No reviews yet'}
          </RatingText>
        </RatingSection>

        {addedToCart ? (
          <ViewCartBtn onClick={handleViewCart}>
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

// ── Section Header ────────────────────────────────────────────────────────────

const SectionHeader = () => (
  <Grid container justifyContent="center">
    <Grid size={{ xs: 12, md: 8 }}>
      <SectionHeaderWrapper>
        <HeaderTopRow>
          <SectionIconWrapper>
            <PetsIcon sx={{ color: '#fff', fontSize: 15 }} />
          </SectionIconWrapper>
          <SectionSubtitle>Pet Shop</SectionSubtitle>
        </HeaderTopRow>
        <SectionTitle>Our featured products</SectionTitle>
        <Typography variant="body2" sx={{ color: '#666', mt: 1, maxWidth: '600px', mx: 'auto' }}>
          Discover our handpicked selection of premium pet products
        </Typography>
      </SectionHeaderWrapper>
    </Grid>
  </Grid>
);

// ── Main Component ────────────────────────────────────────────────────────────

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [displayProducts, setDisplayProducts] = useState([]);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { useProducts } = useShopApi();
  const {
    allProducts,
    isLoading,
    error,
    refetch,
  } = useProducts();

  // Memoize featured products selection for better performance
  const featuredAndRandomProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    // First, get all featured products
    const featuredProducts = allProducts.filter((p) => p.isFeatured === true);
    
    // Then, get non-featured products (excluding already selected featured ones)
    const featuredIds = new Set(featuredProducts.map(p => p._id));
    const nonFeaturedProducts = shuffleArray(
      allProducts.filter((p) => !featuredIds.has(p._id))
    );

    // Combine: all featured products + fill remaining slots with random products
    let selected = [...featuredProducts];
    const remainingSlots = 4 - selected.length;

    if (remainingSlots > 0 && nonFeaturedProducts.length > 0) {
      selected = [...selected, ...nonFeaturedProducts.slice(0, remainingSlots)];
    }

    // If still not enough products, repeat some (fallback)
    if (selected.length < 4 && allProducts.length > 0) {
      while (selected.length < 4 && selected.length < allProducts.length) {
        selected.push(allProducts[selected.length % allProducts.length]);
      }
    }

    return selected.slice(0, 4);
  }, [allProducts]);

  // Update display products when memoized value changes
  useEffect(() => {
    setDisplayProducts(featuredAndRandomProducts);
  }, [featuredAndRandomProducts]);

  const handleAddToCart = (productName, success = true) => {
    if (success) {
      setSnackbar({ open: true, message: `${productName} added to cart!`, severity: 'success' });
    } else {
      setSnackbar({ open: true, message: `${productName} is out of stock!`, severity: 'warning' });
    }
  };

  const handleAuthRequired = () => {
    setAuthDialogOpen(true);
  };

  const handleAuthDialogClose = () => setAuthDialogOpen(false);

  const handleNavigateToLogin = () => {
    setAuthDialogOpen(false);
    navigate('/login', { state: { from: window.location.pathname } });
  };

  const handleViewAllProducts = () => {
    navigate('/shop');
  };

  const handleRetry = () => {
    refetch();
  };

  if (isLoading || authLoading) {
    return (
      <ShopSection>
        <Container maxWidth="lg">
          <SectionHeader />
          <LoadingContainer>
            <CircularProgress sx={{ color: PRIMARY_COLOR }} size={50} />
          </LoadingContainer>
        </Container>
      </ShopSection>
    );
  }

  if (error) {
    return (
      <ShopSection>
        <Container maxWidth="lg">
          <SectionHeader />
          <NoProductsContainer>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Unable to load products at the moment.
            </Typography>
            <Typography variant="body2" sx={{ color: '#999', mb: 1 }}>
              {error.message || 'Please check your connection and try again.'}
            </Typography>
            <Button
              variant="contained"
              onClick={handleRetry}
              sx={{ 
                backgroundColor: PRIMARY_COLOR,
                '&:hover': { backgroundColor: PRIMARY_DARK },
                textTransform: 'none'
              }}
            >
              Try Again
            </Button>
          </NoProductsContainer>
        </Container>
      </ShopSection>
    );
  }

  return (
    <ShopSection>
      <Container maxWidth="lg">
        <SectionHeader />

        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
          {displayProducts.length > 0 ? (
            displayProducts.map((product, index) => (
              <Grid 
                size={{ xs: 6, sm: 6, md: 3 }} 
                key={product._id || index}
                sx={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                  '@keyframes fadeInUp': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                <ProductCardItem
                  product={product}
                  onAddToCart={handleAddToCart}
                  isAuthenticated={isAuthenticated}
                  onAuthRequired={handleAuthRequired}
                />
              </Grid>
            ))
          ) : (
            <Grid size={{ xs: 12 }}>
              <NoProductsContainer>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  No featured products available at the moment.
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  Check back soon for new products!
                </Typography>
              </NoProductsContainer>
            </Grid>
          )}
        </Grid>

        {displayProducts.length > 0 && (
          <SectionInfo>
            <Button
              variant="contained"
              onClick={handleViewAllProducts}
              sx={{
                backgroundColor: PRIMARY_COLOR,
                px: 4,
                py: 1,
                borderRadius: '30px',
                fontSize: '14px',
                fontWeight: 600,
                '&:hover': { 
                  backgroundColor: PRIMARY_DARK,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(92,77,145,0.3)'
                },
                textTransform: 'none',
                transition: 'all 0.3s ease',
              }}
            >
              View All Products
            </Button>
          </SectionInfo>
        )}
      </Container>

      {/* Authentication Required Dialog */}
      <Dialog
        open={authDialogOpen}
        onClose={handleAuthDialogClose}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: '8px',
            maxWidth: '400px',
            width: '90%',
            margin: '16px',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LockIcon sx={{ color: PRIMARY_COLOR, fontSize: '28px' }} />
          <Typography variant="h6" component="span" fontWeight={700}>
            Sign In Required
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#666', fontSize: '14px', lineHeight: 1.5 }}>
            Please sign in to add items to your cart and continue shopping.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, gap: 1.5 }}>
          <Button
            onClick={handleAuthDialogClose}
            sx={{ 
              color: '#888', 
              textTransform: 'none', 
              fontWeight: 500, 
              borderRadius: '10px',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleNavigateToLogin}
            variant="contained"
            sx={{
              backgroundColor: PRIMARY_COLOR,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              padding: '8px 20px',
              '&:hover': { backgroundColor: PRIMARY_DARK },
            }}
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
          sx={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ShopSection>
  );
};

export default FeaturedProducts;