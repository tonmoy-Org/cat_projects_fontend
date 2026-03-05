import React, { useState } from 'react';
import { Container, Grid, Box, Typography, styled } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

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

const products = [
  {
    id: 1,
    title: 'Small dog dish',
    price: '25.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/01-1.png',
    alt: 'Small dog dish',
  },
  {
    id: 2,
    title: 'Cat ball',
    price: '35.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1-1.jpg',
    alt: 'Cat ball',
  },
  {
    id: 3,
    title: 'Sand shovel',
    price: '40.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/03-1.png',
    alt: 'Sand shovel',
  },
  {
    id: 4,
    title: '3 toy dog bones',
    price: '45.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/06-1.png',
    alt: '3 toy dog bones',
  },
];

const FeaturedProducts = () => {
  const [hoveredId, setHoveredId] = useState(null);

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
                <SectionSubtitle>
                  Pet Shop
                </SectionSubtitle>
              </HeaderTopRow>
              <SectionTitle>
                Our featured products
              </SectionTitle>
            </SectionHeaderWrapper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
              <ProductCard
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <ProductItem>
                  <ImageWrapper>
                    <a href={`#product-${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <ProductImage
                        src={product.image}
                        alt={product.alt}
                      />
                    </a>
                    <PriceOverlay isVisible={hoveredId === product.id}>
                      <a href={`#product-${product.id}`} style={{ textDecoration: 'none' }}>
                        <h4>
                          <span className="hot">Hot</span>
                          <span className="price">${product.price}</span>
                        </h4>
                      </a>
                    </PriceOverlay>
                  </ImageWrapper>
                  <ProductTitle>
                    <h5>
                      <a href={`#product-${product.id}`}>
                        {product.title}
                      </a>
                    </h5>
                  </ProductTitle>
                </ProductItem>
              </ProductCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ShopSection>
  );
};

export default FeaturedProducts;