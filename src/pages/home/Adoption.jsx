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
const iconColor = '#5C4D91';
const primaryColor = '#5C4D91';

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
  width: 45,
  height: 45,
  borderRadius: '50%',
  backgroundColor: iconColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 600px)': {
    width: 40,
    height: 40,
  },
});

const SectionSubtitle = styled(Typography)({
  fontSize: '16px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#333',
  '@media (max-width: 600px)': {
    fontSize: '14px',
  },
});

const SectionTitle = styled(Typography)({
  fontSize: '36px',
  fontWeight: 700,
  color: '#1a1a1a',
  lineHeight: 1.2,
  '@media (max-width: 900px)': {
    fontSize: '32px',
  },
  '@media (max-width: 600px)': {
    fontSize: '26px',
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
});

const FrontHeader = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: '15px 20px',
  textAlign: 'center',
  zIndex: 2,
  '@media (max-width: 600px)': {
    padding: '12px 15px',
  },
});

const FrontTitle = styled(Typography)({
  fontSize: '24px',
  fontWeight: 600,
  color: '#fff',
  margin: 0,
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
  '@media (max-width: 600px)': {
    fontSize: '18px',
    marginBottom: '12px',
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
  gap: '10px',
  fontSize: '14px',
  color: '#666',
  padding: '8px 0',
  '& svg': {
    fontSize: '18px',
    color: iconColor,
  },
  '@media (max-width: 600px)': {
    fontSize: '13px',
    padding: '6px 0',
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
  gap: '20px',
  flexWrap: 'wrap',
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    gap: '15px',
    marginTop: '40px',
    padding: '0 20px',
  },
});

const AdoptButton = styled(Button)({
  backgroundColor: iconColor,
  borderRadius: '30px',
  padding: '8px 25px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '16px',
  minWidth: '140px',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: '#c774b6',
  },
  '@media (max-width: 600px)': {
    padding: '6px 20px',
    fontSize: '14px',
    minWidth: '120px',
  },
});

const InfoText = styled(Typography)({
  fontSize: '18px',
  color: '#333',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  '@media (max-width: 600px)': {
    fontSize: '16px',
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
                  <PetsIcon sx={{ color: '#fff', fontSize: 20 }} />
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
        <Grid container justifyContent="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <SectionInfo>
              <AdoptButton variant="contained">
                Adopt a pet
              </AdoptButton>
              <InfoText>
                Call us{' '}
                <Link
                  href="tel:+1234567890"
                  underline="none"
                >
                  +123 456 7890
                </Link>{' '}
                for detailed information!
              </InfoText>
            </SectionInfo>
          </Grid>
        </Grid>
      </Container>
    </AdoptionSection>
  );
};

export default Adoption;