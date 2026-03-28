import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Box, Typography, styled, CircularProgress, Button, Snackbar, Alert,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { useCart } from '../../context/CartContext';

// ── Colors ────────────────────────────────────────────────────────────────────
const PRIMARY_COLOR = '#5C4D91';
const PRIMARY_DARK = '#4A3D75';
const iconColor = '#db89ca';
const primaryColor = '#ff6b6b';
const textColor = '#1a1a1a';

// ── Styled Components ─────────────────────────────────────────────────────────

const ShopSection = styled(Box)({
  padding: '80px 0',
  backgroundColor: '#fff',
  '@media (max-width: 900px)': { padding: '60px 0' },
  '@media (max-width: 600px)': { padding: '20px 0' },
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
  marginBottom: '15px',
  flexWrap: 'wrap',
});

const SectionIconWrapper = styled(Box)({
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: iconColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const SectionSubtitle = styled(Typography)({
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#666',
  textTransform: 'uppercase',
});

const SectionTitle = styled(Typography)({
  fontSize: '38px',
  fontWeight: 700,
  color: textColor,
  lineHeight: 1.2,
  '@media (max-width: 900px)': { fontSize: '32px' },
  '@media (max-width: 600px)': { fontSize: '28px', padding: '0 15px' },
});

// ── Product Card ───────────────────────────────────────────────────────────────

const ProductCard = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '10px',
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.15)' },
  '&:hover .product-image': { transform: 'scale(1.05)' },
});

const ImageWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  flexShrink: 0,
});

const ProductImage = styled('img')({
  width: '100%',
  height: '280px',
  objectFit: 'cover',
  display: 'block',
  transition: 'transform 0.5s ease',
  '@media (max-width: 900px)': { height: '220px' },
  '@media (max-width: 600px)': { height: '180px' },  // CHANGED: Much smaller on mobile
});

const PriceOverlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isVisible',
})(({ isVisible }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  opacity: isVisible ? 1 : 0,
  visibility: isVisible ? 'visible' : 'hidden',
  transition: 'all 0.3s ease',
  zIndex: 2,
  '@media (max-width: 600px)': { width: '60px', height: '60px' },  // CHANGED: Smaller overlay
}));

const FeaturedBadge = styled(Box)({
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: '#ec407a',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  zIndex: 10,
  boxShadow: '0 2px 8px rgba(236,64,122,0.3)',
  '@media (max-width: 600px)': {  // ADDED: Smaller badge on mobile
    padding: '4px 8px',
    fontSize: '10px',
  },
});

const CardBody = styled(Box)({
  padding: '14px 12px 16px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'space-between',
  '@media (max-width: 600px)': {  // ADDED: Less padding on mobile
    padding: '10px 8px 12px',
  },
});

const ProductName = styled(Typography)({
  fontSize: '16px',
  fontWeight: 600,
  color: '#1a1a1a',
  marginBottom: '6px',
  minHeight: '24px',
  '@media (max-width: 600px)': {
    fontSize: '13px',
    minHeight: '18px',
    marginBottom: '4px',
  },
});

const ProductCategory = styled(Typography)({
  fontSize: '13px',
  color: '#888',
  marginBottom: '8px',
  minHeight: '20px',
  '@media (max-width: 600px)': {
    fontSize: '11px',
    minHeight: '16px',
    marginBottom: '4px',
  },
});

const ProductPrice = styled(Typography)({
  fontSize: '16px',
  fontWeight: 700,
  color: PRIMARY_COLOR,
  marginBottom: '12px',
  minHeight: '24px',
  '@media (max-width: 600px)': {
    fontSize: '13px',
    minHeight: '18px',
    marginBottom: '8px',
  },
});

const AddToCartBtn = styled(Button)({
  backgroundColor: iconColor,
  color: '#fff',
  fontSize: '13px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '30px',
  padding: '7px 18px',
  width: '100%',
  gap: '6px',
  transition: 'all 0.3s ease',
  minHeight: '36px',
  '@media (max-width: 600px)': {
    fontSize: '11px',
    padding: '5px 10px',
    minHeight: '30px',
  },
  '&:hover': {
    backgroundColor: '#c96db8',
    boxShadow: '0 4px 12px rgba(219,137,202,0.4)',
  },
});

const ViewCartBtn = styled(Button)({
  backgroundColor: 'transparent',
  color: iconColor,
  fontSize: '13px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '30px',
  padding: '7px 18px',
  width: '100%',
  gap: '6px',
  border: `2px solid ${iconColor}`,
  transition: 'all 0.3s ease',
  minHeight: '36px',
  '@media (max-width: 600px)': {
    fontSize: '11px',
    padding: '5px 10px',
    minHeight: '30px',
  },
  '&:hover': {
    backgroundColor: iconColor,
    color: '#fff',
    boxShadow: '0 4px 12px rgba(219,137,202,0.4)',
  },
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
});

const SectionInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '50px',
  gap: '30px',
  flexWrap: 'wrap',
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    gap: '20px',
    marginTop: '40px',
    padding: '0 20px',
  },
});

const ViewAllBtn = styled(Button)({
  backgroundColor: PRIMARY_COLOR,
  color: '#fff',
  padding: '10px 24px',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: '25px',
  boxShadow: 'none',
  minWidth: '140px',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: PRIMARY_DARK,
    boxShadow: '0 5px 15px rgba(92,77,145,0.3)',
  },
  '@media (max-width: 600px)': {
    padding: '8px 20px',
    fontSize: '13px',
    minWidth: '120px',
  },
});

const NoProductsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '300px',
  textAlign: 'center',
});

// ── Helper ────────────────────────────────────────────────────────────────────

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ── ProductCardItem ───────────────────────────────────────────────────────────

const ProductCardItem = ({ product, onAddToCart }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToCart(true);
    onAddToCart(product.title);
  };

  const handleViewCart = (e) => {
    e.stopPropagation();
    navigate('/cart');
  };

  const handleCardClick = () => {
    navigate(`/shop/${product.title_id}`);
  };

  return (
    <ProductCard
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
    >
      <ImageWrapper>
        {product.isFeatured && (
          <FeaturedBadge>♡ Featured</FeaturedBadge>
        )}
        <ProductImage
          className="product-image"
          src={product.featuredImage}
          alt={product.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />
        <PriceOverlay isVisible={hovered}>
          <Typography sx={{ 
            fontWeight: 600, 
            fontSize: { xs: '14px', sm: '20px' },  // CHANGED: Smaller price on mobile
            color: primaryColor 
          }}>
            ৳{product.price}
          </Typography>
        </PriceOverlay>
      </ImageWrapper>

      <CardBody>
        <Box>
          <ProductName>Name : {product.title}</ProductName>
          <ProductCategory>Category : {product.category}</ProductCategory>
          <ProductPrice>Price : ৳ {product.price}</ProductPrice>
        </Box>

        {addedToCart ? (
          <ViewCartBtn variant="outlined" onClick={handleViewCart}>
            <ShoppingCartIcon sx={{ fontSize: { xs: '14px', sm: '17px' } }} />
            View Cart
          </ViewCartBtn>
        ) : (
          <AddToCartBtn onClick={handleAddToCart}>
            <ShoppingCartIcon sx={{ fontSize: { xs: '14px', sm: '17px' } }} />
            Add to Cart
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
            <PetsIcon sx={{ color: '#fff', fontSize: 18 }} />
          </SectionIconWrapper>
          <SectionSubtitle>Pet Shop</SectionSubtitle>
        </HeaderTopRow>
        <SectionTitle>Our featured products</SectionTitle>
      </SectionHeaderWrapper>
    </Grid>
  </Grid>
);

// ── Main Component ────────────────────────────────────────────────────────────

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [displayProducts, setDisplayProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products-featured'],
    queryFn: async () => {
      const response = await axiosInstance.get('/products');
      const products = response.data.data || response.data || [];
      return { data: Array.isArray(products) ? products : [] };
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const products = productsData?.data || [];
    if (products.length > 0) {
      const featured = products.filter((p) => p.isFeatured === true);
      const nonFeatured = shuffleArray(products.filter((p) => p.isFeatured !== true));
      const selected = [...featured, ...nonFeatured].slice(0, 4);
      setDisplayProducts(selected);
    }
  }, [productsData]);

  const handleAddToCart = (productName) => {
    setSnackbar({ open: true, message: `${productName} added to cart!`, severity: 'success' });
  };

  const handleViewAllPets = () => {
    navigate('/shop');
  };

  if (isLoading) {
    return (
      <ShopSection>
        <Container maxWidth="lg">
          <SectionHeader />
          <LoadingContainer>
            <CircularProgress sx={{ color: primaryColor }} />
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
              Unable to load products at the moment. Please try again later.
            </Typography>
          </NoProductsContainer>
        </Container>
      </ShopSection>
    );
  }

  return (
    <ShopSection>
      <Container maxWidth="lg">
        <SectionHeader />

        <Grid container spacing={3}>
          {displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <Grid size={{ xs: 6, sm: 6, md: 3 }} key={product._id}>
                <ProductCardItem product={product} onAddToCart={handleAddToCart} />
              </Grid>
            ))
          ) : (
            <Grid size={{ xs: 12 }}>
              <NoProductsContainer>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  No products available at the moment.
                </Typography>
              </NoProductsContainer>
            </Grid>
          )}
        </Grid>

        <SectionInfo>
          <ViewAllBtn variant="contained" onClick={handleViewAllPets}>
            View all products
          </ViewAllBtn>
        </SectionInfo>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ShopSection>
  );
};

export default FeaturedProducts;