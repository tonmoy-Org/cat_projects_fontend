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
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';
import { useCart } from '../../context/CartContext';

// Theme colors
const PRIMARY_COLOR = '#5C4D91';
const PRIMARY_DARK = '#4A3D75';
const iconColor = '#db89ca';

// Styled components
const AdoptionSection = styled(Box)({
  backgroundColor: '#f9f9f9',
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

const HeaderTopRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '15px',
  flexWrap: 'wrap',
  '@media (max-width: 600px)': {
    gap: '8px',
  },
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
  color: '#1a1a1a',
  lineHeight: 1.2,
  '@media (max-width: 900px)': {
    fontSize: '32px',
  },
  '@media (max-width: 600px)': {
    fontSize: '28px',
    padding: '0 15px',
  },
});

// Styled components matching the cart page design
const AdoptionCard = styled(Box)({
  width: '100%',
  borderRadius: '10px',
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  '&:hover': { 
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)' 
  },
  '&:hover .pet-image': { 
    transform: 'scale(1.05)' 
  },
});

const ImageWrapper = styled(Box)({ 
  width: '100%', 
  overflow: 'hidden',
  position: 'relative',
});

const PetImage = styled('img')({
  width: '100%',
  height: '280px',
  objectFit: 'cover',
  display: 'block',
  transition: 'transform 0.5s ease',
  '@media (max-width: 900px)': { height: '240px' },
  '@media (max-width: 600px)': { height: '220px' },
});

const FeaturedBadge = styled(Box)({
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: PRIMARY_COLOR,
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  zIndex: 10,
  boxShadow: '0 2px 8px rgba(92,77,145,0.3)',
});

const CardBody = styled(Box)({ 
  padding: '14px 12px', 
  textAlign: 'center' 
});

const PetName = styled(Typography)({
  fontSize: '16px', 
  fontWeight: 600, 
  color: '#1a1a1a', 
  marginBottom: '6px',
});

const PetGender = styled(Typography)({
  fontSize: '13px', 
  color: '#888', 
  marginBottom: '8px',
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  gap: '4px',
  '& svg': { 
    fontSize: '16px', 
    color: iconColor 
  },
});

const PetPrice = styled(Typography)({
  fontSize: '16px', 
  fontWeight: 700, 
  color: PRIMARY_COLOR, 
  marginBottom: '12px',
});

const AddToCartBtn = styled(Button)({
  backgroundColor: iconColor, 
  color: '#fff', 
  fontSize: '13px', 
  fontWeight: 600,
  textTransform: 'none', 
  borderRadius: '8px', 
  padding: '7px 16px', 
  width: '100%',
  gap: '6px', 
  transition: 'all 0.3s ease',
  '&:hover': { 
    backgroundColor: '#c06bb0' 
  },
});

const ViewCartBtn = styled(Button)({
  backgroundColor: 'transparent', 
  color: iconColor, 
  fontSize: '13px', 
  fontWeight: 600,
  textTransform: 'none', 
  borderRadius: '8px', 
  padding: '7px 16px', 
  width: '100%',
  gap: '6px', 
  border: `2px solid ${iconColor}`, 
  transition: 'all 0.3s ease',
  '&:hover': { 
    backgroundColor: iconColor, 
    color: '#fff' 
  },
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

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
});

// Helper function to get gender icon
const getGenderIcon = (gender) => {
  return gender?.toLowerCase() === 'male' ? <MaleIcon /> : <FemaleIcon />;
};

// Helper function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Cat Card Component matching cart page design - Only showing name, gender, and price
const CatCard = ({ cat, onAddToCart }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(cat, 1);
    setAddedToCart(true);
    onAddToCart(cat.name);
  };

  const handleViewCart = (e) => {
    e.stopPropagation();
    navigate('/cart');
  };

  const handleCardClick = () => {
    navigate(`/adoption/${cat.title_id || cat._id}`);
  };

  return (
    <AdoptionCard onClick={handleCardClick}>
      <ImageWrapper>
        {cat.isFeatured && (
          <FeaturedBadge>
            ♡ Featured
          </FeaturedBadge>
        )}
        <PetImage className="pet-image" src={cat.featuredImage} alt={cat.name} />
      </ImageWrapper>
      <CardBody>
        <PetName>Name : {cat.name}</PetName>
        <PetGender>
          Gender :
          {getGenderIcon(cat.gender)}
          {cat.gender}
        </PetGender>
        
        <PetPrice>Price : ৳ {cat.price || 0}</PetPrice>
        
        {addedToCart ? (
          <ViewCartBtn variant="outlined" onClick={handleViewCart}>
            <ShoppingCartIcon sx={{ fontSize: '16px' }} />
            View Cart
          </ViewCartBtn>
        ) : (
          <AddToCartBtn variant="contained" onClick={handleAddToCart}>
            <ShoppingCartIcon sx={{ fontSize: '16px' }} />
            Add to Cart
          </AddToCartBtn>
        )}
      </CardBody>
    </AdoptionCard>
  );
};

const Adoption = () => {
  const [displayPets, setDisplayPets] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  // Fetch cats from API
  const { data, isLoading } = useQuery({
    queryKey: ['cats-adoption'],
    queryFn: async () => {
      const response = await axiosInstance.get('/cats?status=available');
      return response.data;
    },
  });

  const catsData = data?.data || [];

  // Process cats data to display featured first, then random
  useEffect(() => {
    if (catsData.length > 0) {
      // Separate featured and non-featured cats
      const featuredCats = catsData.filter(cat => cat.isFeatured);
      const nonFeaturedCats = catsData.filter(cat => !cat.isFeatured);

      // Shuffle non-featured cats to get random ones
      const shuffledNonFeatured = shuffleArray(nonFeaturedCats);

      // Combine: featured first, then random non-featured to fill up to 4
      let selected = [...featuredCats];
      const remainingSlots = 4 - selected.length;
      
      if (remainingSlots > 0) {
        selected = [...selected, ...shuffledNonFeatured.slice(0, remainingSlots)];
      }

      // Take only the first 4
      setDisplayPets(selected.slice(0, 4));
    }
  }, [catsData]);

  const handleAddToCart = (catName) => {
    setSnackbar({ open: true, message: `${catName} added to cart!`, severity: 'success' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewAllPets = () => {
    navigate('/cats');
  };

  if (isLoading) {
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
          <LoadingContainer>
            <CircularProgress sx={{ color: PRIMARY_COLOR }} />
          </LoadingContainer>
        </Container>
      </AdoptionSection>
    );
  }

  return (
    <AdoptionSection>
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
                  Adopt a pet
                </SectionSubtitle>
              </HeaderTopRow>
              <SectionTitle>
                Find a new furry friend
              </SectionTitle>
            </SectionHeaderWrapper>
          </Grid>
        </Grid>

        {/* Adoption Cards - Using CatCard component - 4 cards in a row */}
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} justifyContent="center">
            {displayPets.length > 0 ? (
              displayPets.map((pet) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={pet._id}>
                  <CatCard cat={pet} onAddToCart={handleAddToCart} />
                </Grid>
              ))
            ) : (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    No cats available for adoption at the moment.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Bottom Info Section */}
        <SectionInfo>
          <ViewAllBtn variant="contained" onClick={handleViewAllPets}>
            View all pets
          </ViewAllBtn>
        </SectionInfo>
      </Container>

      {/* Snackbar for cart notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdoptionSection>
  );
};

export default Adoption;