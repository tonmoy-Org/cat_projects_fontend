// Home.jsx - Adoption Section
import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import { Button } from '@mui/material';
import { Link } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import CakeIcon from '@mui/icons-material/Cake';
import HotelIcon from '@mui/icons-material/Hotel';

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
  height: '350px',
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

// Adoption data
const adoptionPets = [
  {
    id: 1,
    name: 'Missy',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/01-2.jpg',
    gender: 'Male',
    neutered: 'No',
    age: '5 years',
    link: '/adoption/missy',
  },
  {
    id: 2,
    name: 'Bella',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/02-2.jpg',
    gender: 'Female',
    neutered: 'Yes',
    age: '3 years',
    link: '/adoption/bella',
  },
  {
    id: 3,
    name: 'Kitty',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/03-2.jpg',
    gender: 'Female',
    neutered: 'No',
    age: '2 years',
    link: '/adoption/kitty',
  },
  {
    id: 4,
    name: 'Penny',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/04-2.jpg',
    gender: 'Male',
    neutered: 'Yes',
    age: '4 years',
    link: '/adoption/penny',
  },
];

// Helper function to get gender icon
const getGenderIcon = (gender) => {
  return gender === 'Male' ? <MaleIcon /> : <FemaleIcon />;
};

const Adoption = () => {
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
          {adoptionPets.map((pet) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={pet.id}>
              <AdoptionCard>
                <PetImage src={pet.image} alt={pet.name} />
                <FrontHeader>
                  <FrontTitle>{pet.name}</FrontTitle>
                </FrontHeader>
                <BackWrap className="back-wrap">
                  <a href={pet.link}>
                    <BackTitle>{pet.name}</BackTitle>
                    <InfoList>
                      <ul>
                        <li>
                          <InfoItem>
                            {getGenderIcon(pet.gender)}
                            <span>Gender: {pet.gender}</span>
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
                  </a>
                </BackWrap>
              </AdoptionCard>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Info Section */}
        <SectionInfo>
          <AdoptButton variant="contained">
            View all pets
          </AdoptButton>
          <InfoText>
            Can't adopt? <a href="/sponsor">Sponsor a pet</a>
          </InfoText>
        </SectionInfo>
      </Container>
    </AdoptionSection>
  );
};

export default Adoption;