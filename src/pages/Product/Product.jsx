import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  Pagination,
  PaginationItem,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import SectionTile from '../../components/SectionTile';

const PRIMARY_COLOR = '#5C4D91';
const PRIMARY_DARK = '#4A3D75';
const primaryColor = '#ff6b6b';
const textColor = '#1a1a1a';

const ProductSection = styled(Box)({
  backgroundColor: '#ffffff',
  padding: '80px 0',
  width: '100%',
  '@media (max-width: 900px)': { padding: '60px 0' },
  '@media (max-width: 600px)': { padding: '40px 0' },
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
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  borderRadius: '10px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.5s ease',
  },
  '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.15)' },
  '&:hover img': { transform: 'scale(1.05)' },
});

const ProductImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
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
    '& .price': { fontSize: '18px' },
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
      '&:hover': { color: primaryColor },
      '&:hover::after': { transform: 'scaleX(1)' },
    },
  },
});

// ── Pagination matching Blog page exactly ──
const PaginationWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '50px',
  width: '100%',
  [theme.breakpoints.down('sm')]: { marginTop: '30px' },
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    margin: '0 5px',
    minWidth: '40px',
    height: '40px',
    borderRadius: '40px',
    fontSize: '15px',
    fontWeight: 500,
    color: '#333',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    transition: 'all 0.3s ease',
    [theme.breakpoints.down('sm')]: {
      minWidth: '36px',
      height: '36px',
      fontSize: '14px',
      margin: '0 3px',
    },
    '&:hover': {
      backgroundColor: PRIMARY_COLOR,
      color: '#fff',
      borderColor: PRIMARY_COLOR,
    },
    '&.Mui-selected': {
      backgroundColor: PRIMARY_COLOR,
      color: '#fff',
      borderColor: PRIMARY_COLOR,
      '&:hover': { backgroundColor: PRIMARY_DARK },
    },
  },
  '& .MuiPaginationItem-previousNext': {
    fontSize: '18px',
    '& svg': {
      fontSize: '20px',
      [theme.breakpoints.down('sm')]: { fontSize: '18px' },
    },
  },
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
  width: '100%',
});

const ITEMS_PER_PAGE = 6;

const Product = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hoveredId, setHoveredId] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products?page=${page}&limit=${ITEMS_PER_PAGE}`);
      return response.data;
    },
  });

  const products = data?.data || [];
  const totalPages = data?.pages || Math.ceil((data?.total || products.length) / ITEMS_PER_PAGE) || 1;

  const handlePageChange = (_, value) => {
    setPage(value);
    window.scrollTo({
      top: document.getElementById('products-section')?.offsetTop - 100,
      behavior: 'smooth',
    });
  };

  const handleProductClick = (product) => {
    navigate(`/shop/${product.title_id}`);
  };

  return (
    <Box>
      <SectionTile
        bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/2.jpg"
        subtitle="Pet Shop"
        title="Our products"
        icon={true}
        iconClass="flaticon-custom-icon"
      />
      <ProductSection id="products-section">
        <Container maxWidth="lg">
          {isLoading ? (
            <LoadingContainer><CircularProgress sx={{ color: PRIMARY_COLOR }} /></LoadingContainer>
          ) : error ? (
            <Typography textAlign="center" color="error">Error loading products: {error.message}</Typography>
          ) : products.length === 0 ? (
            <Typography textAlign="center" variant="h6" color="text.secondary">No products found</Typography>
          ) : (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                    <ProductCard
                      onMouseEnter={() => setHoveredId(product._id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleProductClick(product)}
                    >
                      <ProductItem>
                        <ImageWrapper>
                          <ProductImage
                            src={product.featuredImage}
                            alt={product.title}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
                          />
                          <PriceOverlay isVisible={hoveredId === product._id}>
                            <span className="price">${product.price}</span>
                          </PriceOverlay>
                        </ImageWrapper>
                        <ProductTitle>
                          <h5>
                            <a
                              href={`/shop/${product.title_id}`}
                              onClick={(e) => e.preventDefault()}
                            >
                              {product.title}
                            </a>
                          </h5>
                        </ProductTitle>
                      </ProductItem>
                    </ProductCard>
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <PaginationWrapper>
                  <StyledPagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                    size={isMobile ? 'small' : 'medium'}
                    renderItem={(item) => (
                      <PaginationItem
                        {...item}
                        components={{ next: ChevronRightIcon, previous: ChevronLeftIcon }}
                      />
                    )}
                  />
                </PaginationWrapper>
              )}
            </>
          )}
        </Container>
      </ProductSection>
    </Box>
  );
};

export default Product;