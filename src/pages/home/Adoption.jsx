// Home.jsx - Adoption Section with Featured Cats
import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  CircularProgress,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import { Button } from '@mui/material';
import { Link } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import CakeIcon from '@mui/icons-material/Cake';
import HotelIcon from '@mui/icons-material/Hotel';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';

// Theme colors
const primaryColor = '#ff6b6b';
const iconColor = '#db89ca';

// Styled components
const AdoptionSection = styled(Box)({
  backgroundColor: '#f9f9f9',
  padding: '80px 0',
  width: '100%',
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

const AdoptionCard = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '300px',
  borderRadius: '10px',
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  },
  '&:hover .back-wrap': {
    bottom: 0,
  },
  '@media (max-width: 600px)': {
    height: '320px',
  },
});

const PetImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  transition: 'transform 0.5s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const FrontHeader = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
  padding: '20px',
  textAlign: 'center',
  zIndex: 2,
  '@media (max-width: 600px)': {
    padding: '15px',
  },
});

const FrontTitle = styled(Typography)({
  fontSize: '22px',
  fontWeight: 600,
  color: '#fff',
  margin: 0,
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  '@media (max-width: 600px)': {
    fontSize: '20px',
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

const BackWrap = styled(Box)({
  position: 'absolute',
  bottom: '-100%',
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  padding: '25px 20px',
  transition: 'bottom 0.3s ease',
  zIndex: 3,
  textAlign: 'center',
  borderTop: `3px solid ${primaryColor}`,
  '& a': {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
  '@media (max-width: 600px)': {
    padding: '20px 15px',
  },
});

const BackTitle = styled(Typography)({
  fontSize: '20px',
  fontWeight: 600,
  color: '#1a1a1a',
  marginBottom: '15px',
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-5px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40px',
    height: '2px',
    backgroundColor: primaryColor,
  },
  '@media (max-width: 600px)': {
    fontSize: '18px',
    marginBottom: '15px',
  },
});

const InfoList = styled(Box)({
  '& ul': {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
});

const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontSize: '14px',
  color: '#666',
  padding: '6px 0',
  '& svg': {
    fontSize: '18px',
    color: iconColor,
  },
  '@media (max-width: 600px)': {
    fontSize: '13px',
    padding: '4px 0',
    '& svg': {
      fontSize: '16px',
    },
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

const AdoptButton = styled(Button)({
  backgroundColor: primaryColor,
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
    backgroundColor: '#ff5252',
    boxShadow: '0 5px 15px rgba(255,107,107,0.3)',
  },
  '@media (max-width: 600px)': {
    padding: '8px 20px',
    fontSize: '13px',
    minWidth: '120px',
  },
});

const InfoText = styled(Typography)({
  fontSize: '16px',
  color: '#666',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  '@media (max-width: 600px)': {
    fontSize: '14px',
  },
  '& a': {
    color: iconColor,
    textDecoration: 'none',
    fontWeight: 600,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-2px',
      left: 0,
      width: '100%',
      height: '1px',
      backgroundColor: iconColor,
      transform: 'scaleX(0)',
      transition: 'transform 0.3s ease',
    },
    '&:hover::after': {
      transform: 'scaleX(1)',
    },
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
  return gender === 'male' ? <MaleIcon /> : <FemaleIcon />;
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

const Adoption = () => {
  const [displayPets, setDisplayPets] = useState([]);

  // Fetch cats from API
  const { data: catsData = [], isLoading } = useQuery({
    queryKey: ['cats-adoption'],
    queryFn: async () => {
      const response = await axiosInstance.get('/cats?status=available');
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    },
  });

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

  // Format cat data to match expected format
  const formatCats = (cats) => {
    return cats.map(cat => ({
      id: cat._id,
      name: cat.name,
      image: cat.featuredImage,
      gender: cat.gender,
      neutered: cat.neutered ? 'Yes' : 'No',
      age: cat.age,
      isFeatured: cat.isFeatured,
      link: `/adoption/${cat.title_id || cat._id}`,
    }));
  };

  const formattedPets = formatCats(displayPets);

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
            <CircularProgress sx={{ color: primaryColor }} />
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

        {/* Adoption Cards */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
          {formattedPets.length > 0 ? (
            formattedPets.map((pet) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={pet.id}>
                <AdoptionCard>
                  {pet.isFeatured && (
                    <FeaturedBadge>
                      ♡ Featured
                    </FeaturedBadge>
                  )}
                  <PetImage src={pet.image} alt={pet.name} />
                  <FrontHeader>
                    <FrontTitle>{pet.name}</FrontTitle>
                  </FrontHeader>
                  <BackWrap className="back-wrap">
                    <Link href={pet.link} sx={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                      <BackTitle>{pet.name}</BackTitle>
                      <InfoList>
                        <ul>
                          <li>
                            <InfoItem>
                              {getGenderIcon(pet.gender)}
                              <span>Gender: {pet.gender === 'male' ? 'Male' : 'Female'}</span>
                            </InfoItem>
                          </li>
                          <li>
                            <InfoItem>
                              <HotelIcon />
                              <span>Neutered: {pet.neutered}</span>
                            </InfoItem>
                          </li>
                          <li>
                            <InfoItem>
                              <CakeIcon />
                              <span>Age: {pet.age}</span>
                            </InfoItem>
                          </li>
                        </ul>
                      </InfoList>
                    </Link>
                  </BackWrap>
                </AdoptionCard>
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

        {/* Bottom Info Section */}
        <SectionInfo>
          <AdoptButton variant="contained" href="/adoption">
            View all pets
          </AdoptButton>
          <InfoText>
            Can't adopt? <Link href="/sponsor" sx={{ color: iconColor, textDecoration: 'none', fontWeight: 600 }}>Sponsor a pet</Link>
          </InfoText>
        </SectionInfo>
      </Container>
    </AdoptionSection>
  );
};

export default Adoption;