import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  IconButton,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Theme colors
const primaryColor = '#ff6b6b';
const iconColor = '#db89ca';
const textColor = '#1a1a1a';

// Styled components
const ProductSection = styled(Box)({
  backgroundColor: '#ffffff',
  padding: '80px 0',
  width: '100%',
  '@media (max-width: 900px)': {
    padding: '60px 0',
  },
  '@media (max-width: 600px)': {
    padding: '40px 0',
  },
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
  height: '100%',
});

const ProductItem = styled(Box)({
  textAlign: 'center',
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const ImageWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1', // Forces square aspect ratio
  overflow: 'hidden',
  borderRadius: '10px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ensures image covers the square area uniformly
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
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

const PriceOverlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isVisible'
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
  '& .price': {
    color: primaryColor,
    fontWeight: 800,
    fontSize: '23px',
    textAlign: 'center',
    lineHeight: 1.2,
  },
  '@media (max-width: 600px)': {
    width: '70px',
    height: '70px',
    '& .price': {
      fontSize: '18px',
    },
  },
}));

const ProductTitle = styled(Box)({
  marginTop: '15px',
  flex: 1,
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

// Pagination Controls
const PaginationWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
  marginTop: '50px',
  '@media (max-width: 600px)': {
    gap: '15px',
    marginTop: '40px',
  },
});

const PageButton = styled(IconButton)({
  backgroundColor: '#f5f5f5',
  color: '#666',
  width: '45px',
  height: '45px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: primaryColor,
    color: '#fff',
  },
  '&.Mui-disabled': {
    backgroundColor: '#f0f0f0',
    color: '#ccc',
  },
  '@media (max-width: 600px)': {
    width: '40px',
    height: '40px',
  },
});

const PageIndicator = styled(Typography)({
  fontSize: '16px',
  fontWeight: 500,
  color: '#666',
  backgroundColor: '#f5f5f5',
  padding: '8px 20px',
  borderRadius: '30px',
  '@media (max-width: 600px)': {
    fontSize: '14px',
    padding: '6px 16px',
  },
});

// Product data - 12 products
const allProducts = [
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
  {
    id: 5,
    title: 'Cat scratching post',
    price: '55.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/04-2.jpg',
    alt: 'Cat scratching post',
  },
  {
    id: 6,
    title: 'Pet bed',
    price: '65.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/01-4.jpg',
    alt: 'Pet bed',
  },
  {
    id: 7,
    title: 'Dog leash',
    price: '30.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/03-4.jpg',
    alt: 'Dog leash',
  },
  {
    id: 8,
    title: 'Catnip toy',
    price: '20.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/02-4.jpg',
    alt: 'Catnip toy',
  },
  {
    id: 9,
    title: 'Pet carrier',
    price: '85.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/01-2.jpg',
    alt: 'Pet carrier',
  },
  {
    id: 10,
    title: 'Grooming brush',
    price: '22.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/02-2.jpg',
    alt: 'Grooming brush',
  },
  {
    id: 11,
    title: 'Pet food bowl',
    price: '28.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/03-2.jpg',
    alt: 'Pet food bowl',
  },
  {
    id: 12,
    title: 'Dog toy set',
    price: '38.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/04-4.jpg',
    alt: 'Dog toy set',
  },
];

// Items per page (6 items - 2 rows of 3)
const ITEMS_PER_PAGE = 6;

const Product = () => {
  const [page, setPage] = useState(1);
  const [hoveredId, setHoveredId] = useState(null);

  // Calculate pagination
  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = allProducts.slice(startIndex, endIndex);

  // Split current products into rows (3 per row)
  const firstRowProducts = currentProducts.slice(0, 3);
  const secondRowProducts = currentProducts.slice(3, 6);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      scrollToTop();
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: document.getElementById('products-section')?.offsetTop - 100,
      behavior: 'smooth',
    });
  };

  return (
    <ProductSection id="products-section">
      <Container maxWidth="lg">
        {/* Section Header */}
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
                Our products
              </SectionTitle>
            </SectionHeaderWrapper>
          </Grid>
        </Grid>

        {/* First Row - 3 Cards */}
        {firstRowProducts.length > 0 && (
          <Grid container spacing={3} sx={{ marginBottom: '30px' }}>
            {firstRowProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <ProductCard
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <ProductItem>
                    <ImageWrapper>
                      <a href={`#product-${product.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                        <ProductImage
                          src={product.image}
                          alt={product.alt}
                        />
                      </a>
                      <PriceOverlay isVisible={hoveredId === product.id}>
                        <span className="price">${product.price}</span>
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
        )}

        {/* Second Row - 3 Cards */}
        {secondRowProducts.length > 0 && (
          <Grid container spacing={3}>
            {secondRowProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <ProductCard
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <ProductItem>
                    <ImageWrapper>
                      <a href={`#product-${product.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                        <ProductImage
                          src={product.image}
                          alt={product.alt}
                        />
                      </a>
                      <PriceOverlay isVisible={hoveredId === product.id}>
                        <span className="price">${product.price}</span>
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
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <PaginationWrapper>
            <PageButton
              onClick={handlePrevPage}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeftIcon />
            </PageButton>

            <PageIndicator>
              Page {page} of {totalPages}
            </PageIndicator>

            <PageButton
              onClick={handleNextPage}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRightIcon />
            </PageButton>
          </PaginationWrapper>
        )}
      </Container>
    </ProductSection>
  );
};

export default Product;