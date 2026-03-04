import React, { useState } from 'react';
import { Container, Grid, Box, Typography, styled } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

// Colors
const primaryColor = '#ff6b6b';
const iconBgColor = '#db89ca';
const textColor = '#2b2b2b';

// Styled components
const ShopSection = styled(Box)({
  padding: '80px 0',
  backgroundColor: '#fff',
});

const SectionHeader = styled(Box)({
  textAlign: 'center',
  marginBottom: '40px',
});

const SectionSubtitle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#777',
  marginBottom: '10px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

const IconWrapper = styled(Box)({
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: iconBgColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  '& svg': {
    fontSize: '16px',
  },
});

const SectionTitle = styled(Typography)({
  fontSize: '36px',
  fontWeight: 700,
  color: textColor,
  fontFamily: '"Playfair Display", serif',
  '@media (max-width: 600px)': {
    fontSize: '28px',
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
  borderRadius: '15px',
  '& img': {
    width: '100%',
    height: 'auto',
    display: 'block',
    transition: 'transform 0.3s ease',
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
  padding: '8px 20px',
  borderRadius: '30px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  opacity: isVisible ? 1 : 0,
  visibility: isVisible ? 'visible' : 'hidden',
  transition: 'all 0.3s ease',
  zIndex: 2,
  '& h4': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: 600,
    color: textColor,
    margin: 0,
  },
  '& .hot': {
    color: primaryColor,
    fontWeight: 700,
  },
  '& .price': {
    color: '#555',
    fontWeight: 600,
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
      '&:hover': {
        color: primaryColor,
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
        <Grid container>
          <Grid size={{ xs: 12 }}>
            <SectionHeader>
              <SectionSubtitle>
                <IconWrapper>
                  <PetsIcon />
                </IconWrapper>
                Pet Shop
              </SectionSubtitle>
              <SectionTitle>Our featured products</SectionTitle>
            </SectionHeader>
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