// Home.jsx - Adoption Section
import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  Button,
} from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import CakeIcon from '@mui/icons-material/Cake';
import HotelIcon from '@mui/icons-material/Hotel';

// Theme colors
const primaryColor = '#5C4D91';
const iconColor = '#db89ca';

// Styled components
const AdoptionSection = styled(Box)({
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
  '@media (max-width: 1200px)': {
    height: '280px',
  },
  '@media (max-width: 900px)': {
    height: '260px',
  },
  '@media (max-width: 600px)': {
    height: '280px',
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
  '@media (max-width: 900px)': {
    padding: '15px',
  },
  '@media (max-width: 600px)': {
    padding: '12px',
  },
});

const FrontTitle = styled(Typography)({
  fontSize: '22px',
  fontWeight: 600,
  color: '#fff',
  margin: 0,
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  '@media (max-width: 900px)': {
    fontSize: '20px',
  },
  '@media (max-width: 600px)': {
    fontSize: '18px',
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
  borderTop: `3px solid ${iconColor}`,
  '& a': {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
  '@media (max-width: 900px)': {
    padding: '20px 15px',
  },
  '@media (max-width: 600px)': {
    padding: '15px 10px',
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
    backgroundColor: iconColor,
  },
  '@media (max-width: 900px)': {
    fontSize: '18px',
    marginBottom: '12px',
  },
  '@media (max-width: 600px)': {
    fontSize: '16px',
    marginBottom: '10px',
    '&::after': {
      width: '30px',
      height: '2px',
    },
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
  '@media (max-width: 900px)': {
    fontSize: '13px',
    padding: '5px 0',
    '& svg': {
      fontSize: '16px',
    },
  },
  '@media (max-width: 600px)': {
    fontSize: '12px',
    padding: '4px 0',
    gap: '5px',
    '& svg': {
      fontSize: '14px',
    },
  },
});

// Bottom Info Section - Responsive
const BottomInfoWrapper = styled(Box)({
  display: 'flex',
  gap: '30px',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '50px',
  textAlign: 'center',
  '@media (max-width: 900px)': {
    gap: '25px',
    marginTop: '45px',
    flexDirection: 'column',
  },
  '@media (max-width: 600px)': {
    gap: '20px',
    marginTop: '40px',
    padding: '0 20px',
  },
});

const InfoText = styled(Typography)({
  fontSize: '18px',
  color: '#333',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  flexWrap: 'wrap',
  '@media (max-width: 900px)': {
    fontSize: '17px',
    gap: '8px',
  },
  '@media (max-width: 600px)': {
    fontSize: '15px',
    gap: '5px',
    flexDirection: 'column',
    lineHeight: 1.6,
  },
  '& .phone-number': {
    color: iconColor,
    fontWeight: 700,
    fontSize: '20px',
    '@media (max-width: 900px)': {
      fontSize: '19px',
    },
    '@media (max-width: 600px)': {
      fontSize: '18px',
    },
  },
});

const AdoptButton = styled(Button)({
  backgroundColor: primaryColor,
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '30px',
  boxShadow: '0 5px 15px rgba(92, 77, 145, 0.3)',
  minWidth: '120px',
  padding: '10px 25px',
  '&:hover': {
    backgroundColor: '#4A3D75',
    boxShadow: '0 8px 20px rgba(92, 77, 145, 0.4)',
  },
  '@media (max-width: 900px)': {
    fontSize: '15px',
    minWidth: '110px',
    padding: '8px 22px',
  },
  '@media (max-width: 600px)': {
    fontSize: '14px',
    minWidth: '100px',
    padding: '8px 20px',
  },
});

// Custom styled Grid for rows
const RowGrid = styled(Grid)({
  display: 'flex',
  flexWrap: 'wrap',
  marginBottom: '30px',
  '@media (max-width: 600px)': {
    marginBottom: '20px',
  },
});

// Adoption data - 8 pets for 4+4 layout
const adoptionPets = [
  {
    id: 1,
    name: 'Missy',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/01-2.jpg',
    gender: 'Female',
    neutered: 'Yes',
    age: '2 years',
    link: '/adoption/missy',
  },
  {
    id: 2,
    name: 'Kitty',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/02-2.jpg',
    gender: 'Female',
    neutered: 'Yes',
    age: '1 year',
    link: '/adoption/kitty',
  },
  {
    id: 3,
    name: 'Penny',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/03-2.jpg',
    gender: 'Female',
    neutered: 'No',
    age: '3 years',
    link: '/adoption/penny',
  },
  {
    id: 4,
    name: 'Tabby',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/04-2.jpg',
    gender: 'Male',
    neutered: 'Yes',
    age: '4 years',
    link: '/adoption/tabby',
  },
  {
    id: 5,
    name: 'Oscar',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/04-4.jpg',
    gender: 'Male',
    neutered: 'Yes',
    age: '5 years',
    link: '/adoption/oscar',
  },
  {
    id: 6,
    name: 'Buddy',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/01-4.jpg',
    gender: 'Male',
    neutered: 'No',
    age: '2 years',
    link: '/adoption/buddy',
  },
  {
    id: 7,
    name: 'Lucy',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/03-4.jpg',
    gender: 'Female',
    neutered: 'Yes',
    age: '3 years',
    link: '/adoption/lucy',
  },
  {
    id: 8,
    name: 'Max',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/02-4.jpg',
    gender: 'Male',
    neutered: 'Yes',
    age: '4 years',
    link: '/adoption/max',
  },
];

// Split pets into first 4 and next 4
const firstRowPets = adoptionPets.slice(0, 4);
const secondRowPets = adoptionPets.slice(4, 8);

// Helper function to get gender icon
const getGenderIcon = (gender) => {
  return gender === 'Male' ? <MaleIcon /> : <FemaleIcon />;
};

const Cat = () => {
  return (
    <AdoptionSection>
      <Container maxWidth="lg">
        {/* First Row - 4 Cards */}
        <RowGrid container spacing={{ xs: 2, sm: 2, md: 3 }}>
          {firstRowPets.map((pet) => (
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
        </RowGrid>

        {/* Second Row - 4 Cards */}
        <RowGrid container spacing={{ xs: 2, sm: 2, md: 3 }}>
          {secondRowPets.map((pet) => (
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
        </RowGrid>

        {/* Bottom Info Section - Centered with Adopt a pet button */}
        <BottomInfoWrapper>
          <AdoptButton variant="contained">
            Adopt a pet
          </AdoptButton>
          <InfoText>
            <span>Call us</span>
            <span className="phone-number">+123 456 7890</span>
            <span>for detailed information!</span>
          </InfoText>
        </BottomInfoWrapper>
      </Container>
    </AdoptionSection>
  );
};

export default Cat;