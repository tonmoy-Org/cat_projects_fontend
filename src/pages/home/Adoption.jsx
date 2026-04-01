// Home.jsx - Adoption Section with Featured Cats
import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Rating,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LockIcon from '@mui/icons-material/Lock';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../auth/AuthProvider';
import { usePetApi } from '../../hooks/usePetApi';

// Theme colors matching Product component
const PRIMARY = '#5C4D91';
const PRIMARY_DARK = '#4A3D75';
const ACCENT = '#db89ca';
const DISCOUNT_COLOR = '#10b981';
const NO_IMAGE = 'https://via.placeholder.com/400x400?text=No+Image';

// Styled components (made consistent with Product page)
const AdoptionSection = styled(Box)({
  backgroundColor: '#fff',
  padding: '80px 0',
  width: '100%',
  '@media (max-width: 900px)': { padding: '60px 0' },
  '@media (max-width: 600px)': { padding: '40px 0' },
});

const SectionHeaderWrapper = styled(Box)({
  textAlign: 'center',
  marginBottom: '50px',
  width: '100%',
});

const HeaderTopRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '10px',
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: { gap: '8px' },
}));

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

// Card design - Now matching Product component style
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
  backgroundColor: PRIMARY,
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
  color: isDiscounted ? DISCOUNT_COLOR : PRIMARY,
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
  marginBottom: '10px' 
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

// Helper functions
const getGenderIcon = (gender) => {
  return gender?.toLowerCase() === 'male' ? <MaleIcon sx={{ fontSize: '14px' }} /> : <FemaleIcon sx={{ fontSize: '14px' }} />;
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Updated Cat Card
const CatCard = ({ cat, onAddToCart, isAuthenticated, onAuthRequired }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    if (!cat.inStock) return;
    
    addToCart(cat, 1);
    setAddedToCart(true);
    onAddToCart(cat.name, true);
  };

  const handleViewCart = (e) => {
    e.stopPropagation();
    navigate('/cart');
  };

  const handleCardClick = () => {
    if (!cat.inStock) return;
    navigate(`/adoption/${cat.title_id || cat._id}`);
  };

  const averageRating = cat.averageRating || 0;
  const reviewCount = cat.reviewCount || 0;
  const discountedPrice = cat.discountedPrice || cat.price;
  const discountPercentage = cat.discountPercentage || 0;
  const hasDiscount = discountPercentage > 0 && cat.inStock;

  return (
    <ProductCard
      outOfStock={!cat.inStock}
      onClick={handleCardClick}
    >
      <ImageWrapper>
        {!cat.inStock && <OutOfStockBadge>Adopted</OutOfStockBadge>}
        {hasDiscount && (
          <DiscountBadge>
            <LocalOfferIcon sx={{ fontSize: '12px' }} />
            -{Math.round(discountPercentage)}%
          </DiscountBadge>
        )}
        {cat.isFeatured && (
          <FeaturedBadge>Featured</FeaturedBadge>
        )}
        <ProductImage
          className="product-image"
          src={cat.featuredImage}
          alt={cat.name}
          onError={(e) => { e.target.src = NO_IMAGE; }}
        />
      </ImageWrapper>

      <CardBody>
        <ProductName title={cat.name}>
          {cat.name}
        </ProductName>
        
        <ProductCategory>
          {getGenderIcon(cat.gender)} {cat.breed || 'Mixed Breed'}
        </ProductCategory>

        <PriceWrapper>
          <ProductPrice isDiscounted={hasDiscount}>
            ৳ {discountedPrice?.toLocaleString()}
          </ProductPrice>
          {hasDiscount && (
            <OriginalPrice>৳ {cat?.price?.toLocaleString()}</OriginalPrice>
          )}
        </PriceWrapper>

        <RatingSection>
          <StyledRating value={averageRating} readOnly precision={0.5} size="small" />
          <RatingText>
            {reviewCount > 0 ? `(${reviewCount})` : 'No reviews'}
          </RatingText>
        </RatingSection>

        {addedToCart ? (
          <ViewCartBtn onClick={handleViewCart}>
            <ShoppingCartIcon sx={{ fontSize: '13px' }} /> View Cart
          </ViewCartBtn>
        ) : (
          <AddToCartBtn onClick={handleAddToCart} disabled={!cat.inStock}>
            <ShoppingCartIcon sx={{ fontSize: '13px' }} />
            Add to Cart
          </AddToCartBtn>
        )}
      </CardBody>
    </ProductCard>
  );
};

const Adoption = () => {
  const [displayPets, setDisplayPets] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const { useCats } = usePetApi();
  const { 
    allCats, 
    isLoading, 
    error,
  } = useCats();

  useEffect(() => {
    if (allCats && allCats.length > 0) {
      const featuredCats = allCats.filter(cat => cat.isFeatured && cat.inStock);
      const nonFeaturedCats = allCats.filter(cat => !cat.isFeatured && cat.inStock);

      const shuffledNonFeatured = shuffleArray(nonFeaturedCats);

      let selected = [...featuredCats];
      const remainingSlots = 4 - selected.length;
      
      if (remainingSlots > 0) {
        selected = [...selected, ...shuffledNonFeatured.slice(0, remainingSlots)];
      }

      if (selected.length < 4) {
        const otherCats = allCats.filter(cat => !selected.find(s => s._id === cat._id));
        selected = [...selected, ...otherCats.slice(0, 4 - selected.length)];
      }

      setDisplayPets(selected.slice(0, 4));
    }
  }, [allCats]);

  const handleAddToCart = (catName, success = true) => {
    if (success) {
      setSnackbar({ open: true, message: `${catName} added to cart!`, severity: 'success' });
    } else {
      setSnackbar({ open: true, message: `${catName} is not available for adoption!`, severity: 'warning' });
    }
  };

  const handleAuthRequired = () => {
    setAuthDialogOpen(true);
  };

  const handleAuthDialogClose = () => setAuthDialogOpen(false);

  const handleNavigateToLogin = () => {
    setAuthDialogOpen(false);
    navigate('/login', { state: { from: '/' } });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewAllPets = () => {
    navigate('/cats');
  };

  if (isLoading || authLoading) {
    return (
      <AdoptionSection>
        <Container maxWidth="lg">
          <SectionHeaderWrapper>
            <HeaderTopRow>
              <SectionIconWrapper><PetsIcon sx={{ color: '#fff', fontSize: 15 }} /></SectionIconWrapper>
              <SectionSubtitle>Adopt a pet</SectionSubtitle>
            </HeaderTopRow>
            <SectionTitle>Find a new furry friend</SectionTitle>
          </SectionHeaderWrapper>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: PRIMARY }} />
          </Box>
        </Container>
      </AdoptionSection>
    );
  }

  if (error) {
    return (
      <AdoptionSection>
        <Container maxWidth="lg">
          <SectionHeaderWrapper>
            <HeaderTopRow>
              <SectionIconWrapper><PetsIcon sx={{ color: '#fff', fontSize: 18 }} /></SectionIconWrapper>
              <SectionSubtitle>Adopt a pet</SectionSubtitle>
            </HeaderTopRow>
            <SectionTitle>Find a new furry friend</SectionTitle>
          </SectionHeaderWrapper>
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ color: '#666', mb: 2 }}>Unable to load cats at the moment.</Typography>
            <Button variant="contained" onClick={() => window.location.reload()} sx={{ backgroundColor: PRIMARY }}>
              Try Again
            </Button>
          </Box>
        </Container>
      </AdoptionSection>
    );
  }

  return (
    <AdoptionSection>
      <Container maxWidth="lg">
        <SectionHeaderWrapper>
          <HeaderTopRow>
            <SectionIconWrapper>
              <PetsIcon sx={{ color: '#fff', fontSize: 18 }} />
            </SectionIconWrapper>
            <SectionSubtitle>Adopt a pet</SectionSubtitle>
          </HeaderTopRow>
          <SectionTitle>Find a new furry friend</SectionTitle>
        </SectionHeaderWrapper>

        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
          {displayPets.length > 0 ? (
            displayPets.map((pet) => (
              <Grid size={{ xs: 6, sm: 6, md: 3 }} key={pet._id}>
                <CatCard 
                  cat={pet} 
                  onAddToCart={handleAddToCart}
                  isAuthenticated={isAuthenticated}
                  onAuthRequired={handleAuthRequired}
                />
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography sx={{ color: '#666' }}>No cats available for adoption at the moment.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button 
            variant="contained" 
            onClick={handleViewAllPets}
            sx={{
              backgroundColor: PRIMARY,
              px: 3,
              py: 0.9,
              borderRadius: '25px',
              fontSize: '14px',
              '&:hover': { backgroundColor: PRIMARY_DARK },
              textTransform: 'none',
            }}
          >
            View All Pets
          </Button>
        </Box>
      </Container>

      {/* Auth Dialog */}
      <Dialog open={authDialogOpen} onClose={handleAuthDialogClose} PaperProps={{ sx: { borderRadius: '20px', maxWidth: '400px' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LockIcon sx={{ color: PRIMARY, fontSize: '28px' }} />
          Sign In Required
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#666', fontSize: '14px' }}>
            Please sign in to add pets to your cart and start the adoption process.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
          <Button onClick={handleAuthDialogClose} sx={{ color: '#888' }}>Cancel</Button>
          <Button onClick={handleNavigateToLogin} variant="contained" sx={{ backgroundColor: PRIMARY }}>
            Sign In
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ borderRadius: '12px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdoptionSection>
  );
};

export default Adoption;