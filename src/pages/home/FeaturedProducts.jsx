import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Box, Typography, styled, CircularProgress
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';

// Colors
const primaryColor = '#ff6b6b';
const iconColor = '#db89ca';
const textColor = '#1a1a1a';

// Styled components
const ShopSection = styled(Box)({
  padding: '80px 0',
  backgroundColor: '#fff',
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
  '@media (max-width: 900px)': {
    fontSize: '32px',
  },
  '@media (max-width: 600px)': {
    fontSize: '28px',
    padding: '0 15px',
  },
});

const ProductCard = styled(Box)({
  marginBottom: '30px',
  cursor: 'pointer',
});

const ProductItem = styled(Box)({
  textAlign: 'center',
  position: 'relative',
});

const ImageWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '10px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '& img': {
    width: '100%',
    height: 'auto',
    display: 'block',
    transition: 'transform 0.5s ease',
  },
  '&:hover': {
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
});

const ProductImage = styled('img')({
  width: '100%',
  height: 'auto',
  display: 'block',
});

const PriceOverlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isVisible'
})(({ isVisible }) => ({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '6px 16px',
  borderRadius: '25px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  opacity: isVisible ? 1 : 0,
  visibility: isVisible ? 'visible' : 'hidden',
  transition: 'all 0.3s ease',
  zIndex: 2,
  '& h4': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: textColor,
    margin: 0,
  },
  '& .hot': {
    color: primaryColor,
    fontWeight: 600,
    fontSize: '13px',
  },
  '& .price': {
    color: '#555',
    fontWeight: 600,
    fontSize: '14px',
  },
}));

const ProductTitle = styled(Box)({
  marginTop: '15px',
  '& h5': {
    fontSize: '18px',
    fontWeight: 600,
    color: textColor,
    margin: 0,
    '& a': {
      color: 'inherit',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      position: 'relative',
      display: 'inline-block',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-2px',
        left: '0',
        width: '100%',
        height: '1px',
        backgroundColor: primaryColor,
        transform: 'scaleX(0)',
        transition: 'transform 0.3s ease',
      },
      '&:hover': {
        color: primaryColor,
      },
      '&:hover::after': {
        transform: 'scaleX(1)',
      },
    },
  },
});

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
});

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
});

// Helper function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const FeaturedProducts = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const [displayProducts, setDisplayProducts] = useState([]);

  // Fetch products from API
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products-featured'],
    queryFn: async () => {
      const response = await axiosInstance.get('/products');
      const products = response.data.data || response.data || [];
      return { data: Array.isArray(products) ? products : [] };
    },
    staleTime: 1000 * 60 * 5,
  });

  // Process products data to display featured first, then random
  useEffect(() => {
    const products = productsData?.data || [];

    if (products.length > 0) {
      const featuredProducts = products.filter(product => product.isFeatured === true);
      const nonFeaturedProducts = products.filter(product => product.isFeatured !== true);
      const shuffledNonFeatured = shuffleArray(nonFeaturedProducts);

      let selected = [...featuredProducts];
      const remainingSlots = 4 - selected.length;

      if (remainingSlots > 0) {
        selected = [...selected, ...shuffledNonFeatured.slice(0, remainingSlots)];
      }

      setDisplayProducts(selected.slice(0, 4));
    }
  }, [productsData]);

  if (isLoading) {
    return (
      <ShopSection>
        <Container maxWidth="lg">
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

        <Grid container spacing={3}>
          {displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product._id}>
                <ProductCard
                  onMouseEnter={() => setHoveredId(product._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <ProductItem>
                    <ImageWrapper>
                      {product.isFeatured && (
                        <FeaturedBadge>♡ Featured</FeaturedBadge>
                      )}
                      <a
                        href={`/shop/${product.title_id}`}
                        style={{ textDecoration: 'none', display: 'block' }}
                      >
                        <ProductImage
                          src={product.featuredImage}
                          alt={product.title}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x300?text=Product+Image';
                          }}
                        />
                      </a>
                      <PriceOverlay isVisible={hoveredId === product._id}>
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '15px', color: '#ff6b6b' }}>
                          ৳{product.price}
                        </Typography>
                      </PriceOverlay>
                    </ImageWrapper>
                    <ProductTitle>
                      <h5>
                        <a href={`/shop/${product.title_id}`}>
                          {product.title}
                        </a>
                      </h5>
                    </ProductTitle>
                  </ProductItem>
                </ProductCard>
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
      </Container>
    </ShopSection>
  );
};

export default FeaturedProducts;