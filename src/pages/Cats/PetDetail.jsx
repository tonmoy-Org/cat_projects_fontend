// PetDetail.jsx
import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
} from '@mui/material';
import { useParams } from 'react-router-dom';

// Theme colors
const primaryColor = '#5C4D91';
const iconColor = '#db89ca';
const textColor = '#666';
const borderColor = '#eaeaea';

// Styled components
const DetailSection = styled(Box)({
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

const ImageGrid = styled(Grid)({
  display: 'flex',
  flexWrap: 'wrap',
});

const MainImage = styled(Box)({
  width: '100%',
  marginBottom: '30px',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  '& img': {
    width: '100%',
    height: 'auto',
    display: 'block',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
});

const SideImage = styled(Box)({
  width: '100%',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  '& img': {
    width: '100%',
    height: 'auto',
    display: 'block',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
});

const ContentWrapper = styled(Box)({
  paddingLeft: '30px',
  '@media (max-width: 1200px)': {
    paddingLeft: '0',
    marginTop: '40px',
  },
  '@media (max-width: 600px)': {
    marginTop: '30px',
  },
});

const PetName = styled(Typography)({
  fontSize: '24px',
  fontWeight: 600,
  color: '#1a1a1a',
  marginBottom: '25px',
  '@media (max-width: 600px)': {
    fontSize: '22px',
    marginBottom: '20px',
  },
});

const InfoList = styled(Box)({
  marginBottom: '45px',
  '@media (max-width: 600px)': {
    marginBottom: '35px',
  },
  '& ul': {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  '& li': {
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${borderColor}`,
    padding: '12px 0',
    '@media (max-width: 600px)': {
      padding: '10px 0',
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
});

const InfoLabel = styled(Box)({
  minWidth: '120px',
  fontSize: '16px',
  fontWeight: 500,
  color: '#333',
  '@media (max-width: 600px)': {
    minWidth: '100px',
    fontSize: '15px',
  },
});

const InfoValue = styled(Box)({
  fontSize: '16px',
  color: textColor,
  '@media (max-width: 600px)': {
    fontSize: '15px',
  },
  '& p': {
    margin: 0,
  },
});

const SectionTitle = styled(Typography)({
  fontSize: '20px',
  fontWeight: 600,
  color: '#1a1a1a',
  marginBottom: '20px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '0',
    width: '50px',
    height: '2px',
    backgroundColor: iconColor,
  },
  '@media (max-width: 600px)': {
    fontSize: '18px',
    marginBottom: '15px',
    '&::after': {
      width: '40px',
      bottom: '-6px',
    },
  },
});

const Description = styled(Typography)({
  fontSize: '16px',
  color: textColor,
  lineHeight: 1.7,
  marginBottom: '30px',
  '@media (max-width: 600px)': {
    fontSize: '15px',
    lineHeight: 1.6,
    marginBottom: '25px',
  },
});

const TraitsList = styled(Box)({
  marginBottom: '45px',
  '@media (max-width: 600px)': {
    marginBottom: '35px',
  },
  '& ul': {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  '& li': {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '8px 0',
    '@media (max-width: 600px)': {
      gap: '12px',
      padding: '6px 0',
    },
  },
});

// Updated TraitIcon with pink background
const TraitIcon = styled(Box)({
  width: '36px',
  height: '36px',
  backgroundColor: iconColor, // Pink background
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& i': {
    fontSize: '20px',
    color: '#ffffff', // White icon
    '@media (max-width: 600px)': {
      fontSize: '18px',
    },
  },
});

const TraitText = styled(Box)({
  fontSize: '16px',
  color: textColor,
  '@media (max-width: 600px)': {
    fontSize: '15px',
  },
  '& p': {
    margin: 0,
  },
});

// Sample pet data (in real app, this would come from an API)
const petData = {
  id: 1,
  name: 'Missy',
  mainImage: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/adoption.jpg',
  sideImages: [
    'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/04-2.jpg',
    'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/09-2.jpg',
  ],
  gender: 'Female',
  neutered: 'Yes',
  age: '2 Years',
  breed: 'Poodle',
  vaccinated: 'Yes',
  size: 'Medium',
  about: 'Penny is a very sweet and active dog, she is ready for a new home!',
  traits: [
    'Friendly to other dogs',
    'Good for Apartments',
    'Friendly with Kids',
  ],
  rules: 'Lorem ipsum dolor sit amet consectetu in adsiscin miss rhoncus sapien suscipit fermentum mana elementum auris alisuet molestie in the miss fermen.',
};

const PetDetail = () => {
  // In real app, you'd get the pet ID from URL params
  // const { id } = useParams();
  // Then fetch pet data based on ID

  return (
    <DetailSection>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Column - Images */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={3}>
              {/* Main Image - Full width */}
              <Grid size={{ xs: 12 }}>
                <MainImage>
                  <img
                    decoding="async"
                    src={petData.mainImage}
                    className="img-fluid"
                    alt={petData.name}
                  />
                </MainImage>
              </Grid>

              {/* Side Images - Two in same row */}
              {petData.sideImages.map((image, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                  <SideImage>
                    <img
                      decoding="async"
                      src={image}
                      className="img-fluid"
                      alt={`${petData.name} ${index + 1}`}
                    />
                  </SideImage>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Right Column - Content */}
          <Grid size={{ xs: 12, md: 5 }}>
            <ContentWrapper>
              <PetName>Pet name: {petData.name}</PetName>

              {/* Info List */}
              <InfoList>
                <ul>
                  <li>
                    <InfoLabel>Gender:</InfoLabel>
                    <InfoValue><p>{petData.gender}</p></InfoValue>
                  </li>
                  <li>
                    <InfoLabel>Neutered:</InfoLabel>
                    <InfoValue><p>{petData.neutered}</p></InfoValue>
                  </li>
                  <li>
                    <InfoLabel>Age:</InfoLabel>
                    <InfoValue><p>{petData.age}</p></InfoValue>
                  </li>
                  <li>
                    <InfoLabel>Breed:</InfoLabel>
                    <InfoValue><p>{petData.breed}</p></InfoValue>
                  </li>
                  <li>
                    <InfoLabel>Vaccinated:</InfoLabel>
                    <InfoValue><p>{petData.vaccinated}</p></InfoValue>
                  </li>
                  <li>
                    <InfoLabel>Size:</InfoLabel>
                    <InfoValue><p>{petData.size}</p></InfoValue>
                  </li>
                </ul>
              </InfoList>

              {/* About Section */}
              <SectionTitle>About {petData.name}</SectionTitle>
              <Description>{petData.about}</Description>

              {/* Traits List with Pink Background Icons - Using Font Awesome */}
              <TraitsList>
                <ul>
                  {petData.traits.map((trait, index) => (
                    <li key={index}>
                      <TraitIcon>
                        <i className="fas fa-paw"></i> {/* Font Awesome paw icon */}
                      </TraitIcon>
                      <TraitText>
                        <p>{trait}</p>
                      </TraitText>
                    </li>
                  ))}
                </ul>
              </TraitsList>

              {/* Adoption Rules */}
              <SectionTitle>Adoption Rules</SectionTitle>
              <Description>{petData.rules}</Description>
            </ContentWrapper>
          </Grid>
        </Grid>
      </Container>
    </DetailSection>
  );
};

export default PetDetail;