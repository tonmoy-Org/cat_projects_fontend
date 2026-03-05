// Home.jsx - Services Section with Carousel
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  styled,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Import real icons from MUI
import HomeIcon from '@mui/icons-material/Home';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import PuppyIcon from '@mui/icons-material/Pets'; // Using PetsIcon as fallback
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HotelIcon from '@mui/icons-material/Hotel';

// Theme colors
const iconColor = '#5C4D91';
const primaryColor = '#5C4D91';

// Styled components
const ServicesSection = styled(Box)({
  backgroundColor: '#f9f9f9',
  padding: '80px 0',
  width: '100%',
  overflow: 'hidden',
});

const SectionHeaderWrapper = styled(Box)({
  textAlign: 'center',
  marginBottom: '50px',
});

const SectionIconWrapper = styled(Box)({
  width: 50,
  height: 50,
  borderRadius: '50%',
  backgroundColor: iconColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 15px',
});

const SectionSubtitle = styled(Typography)({
  fontSize: '15px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#333',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
});

const SectionTitle = styled(Typography)({
  fontSize: '36px',
  fontWeight: 700,
  color: '#1a1a1a',
  lineHeight: 1.2,
  '@media (max-width: 600px)': {
    fontSize: '28px',
  },
});

const CarouselContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  padding: '0 40px',
  '@media (max-width: 600px)': {
    padding: '0 20px',
  },
});

const CardsWrapper = styled(Box)({
  display: 'flex',
  transition: 'transform 0.5s ease',
  gap: '20px',
});

const CardWrapper = styled(Box)({
  flex: '0 0 calc(25% - 15px)',
  minWidth: '250px',
  '@media (max-width: 900px)': {
    flex: '0 0 calc(50% - 10px)',
  },
  '@media (max-width: 600px)': {
    flex: '0 0 100%',
  },
});

const FlipCard = styled(Box)({
  backgroundColor: 'transparent',
  width: '100%',
  height: '320px',
  perspective: '1000px',
  cursor: 'pointer',
  '&:hover .flip-card-inner': {
    transform: 'rotateY(180deg)',
  },
});

const FlipCardInner = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  transition: 'transform 0.6s',
  transformStyle: 'preserve-3d',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  borderRadius: '10px',
});

const FlipCardFront = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  backgroundColor: '#fff',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '30px 20px',
});

const FlipCardBack = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  backgroundColor: '#fff',
  borderRadius: '10px',
  transform: 'rotateY(180deg)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const CardImage = styled('img')({
  width: '100%',
  height: '160px',
  objectFit: 'cover',
});

const CardContentBack = styled(Box)({
  padding: '20px',
  textAlign: 'center',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

const IconWrapper = styled(Box)(({ bgcolor }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: bgcolor || iconColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  '& svg': {
    fontSize: '40px',
    color: '#fff',
  },
}));

const CardTitle = styled(Typography)({
  fontSize: '20px',
  fontWeight: 600,
  color: '#1a1a1a',
  marginBottom: '15px',
  '& a': {
    color: 'inherit',
    textDecoration: 'none',
  },
});

const CardText = styled(Typography)({
  fontSize: '14px',
  color: '#666',
  lineHeight: 1.6,
  marginBottom: '15px',
});

const ReadMoreButton = styled(Button)({
  backgroundColor: primaryColor,
  color: '#fff',
  padding: '8px 20px',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: '30px',
  boxShadow: 'none',
  marginTop: 'auto',
  '&:hover': {
    backgroundColor: '#ff5252',
  },
});

const NavButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: '#fff',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  zIndex: 10,
});

const PrevButton = styled(NavButton)({
  left: '0',
});

const NextButton = styled(NavButton)({
  right: '0',
});

const DotsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  marginTop: '40px',
});

const Dot = styled(Box)(({ active }) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: active ? primaryColor : '#ddd',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: active ? primaryColor : '#ccc',
  },
}));

// Service data with real icons
const services = [
  {
    id: 1,
    title: 'Pet Sitting',
    description: 'Lorem ipsum dolor sit amet consectetur erimen elitnam obortis rhoncus sapien.',
    icon: <HomeIcon />,
    iconBg: iconColor,
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/01-1.jpg',
    link: '/services/pet-sitting',
  },
  {
    id: 2,
    title: 'Dog Walking',
    description: 'Lorem ipsum dolor sit amet consectetur erimen elitnam obortis rhoncus sapien.',
    icon: <DirectionsWalkIcon />,
    iconBg: '#ff9f4b',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/02-1.jpg',
    link: '/services/dog-walking',
  },
  {
    id: 3,
    title: 'Pet Dentistry',
    description: 'Lorem ipsum dolor sit amet consectetur erimen elitnam obortis rhoncus sapien.',
    icon: <MedicalServicesIcon />,
    iconBg: '#5c4d91',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/03-1.jpg',
    link: '/services/pet-dentistry',
  },
  {
    id: 4,
    title: 'Vaccinations',
    description: 'Lorem ipsum dolor sit amet consectetur erimen elitnam obortis rhoncus sapien.',
    icon: <VaccinesIcon />,
    iconBg: '#4caf50',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/04-1.jpg',
    link: '/services/vaccinations',
  },
  {
    id: 5,
    title: 'Pet Grooming',
    description: 'Lorem ipsum dolor sit amet consectetur erimen elitnam obortis rhoncus sapien.',
    icon: <ContentCutIcon />,
    iconBg: '#ff6b6b',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/05-1.jpg',
    link: '/services/pet-grooming',
  },
  {
    id: 6,
    title: 'Puppy Program',
    description: 'Lorem ipsum dolor sit amet consectetur erimen elitnam obortis rhoncus sapien.',
    icon: <PuppyIcon />,
    iconBg: '#9c27b0',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/06-1.jpg',
    link: '/services/puppy-program',
  },
  {
    id: 7,
    title: 'Veterinary Service',
    description: 'Lorem ipsum dolor sit amet consectetur erimen elitnam obortis rhoncus sapien.',
    icon: <LocalHospitalIcon />,
    iconBg: '#ff9800',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/07-1.jpg',
    link: '/services/veterinary-service',
  },
  {
    id: 8,
    title: 'Overnight Care',
    description: 'Lorem ipsum dolor sit amet consectetur erimen elitnam obortis rhoncus sapien.',
    icon: <HotelIcon />,
    iconBg: '#00bcd4',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/08-1.jpg',
    link: '/services/overnight-care',
  },
];

const Services = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 4;
  const totalSlides = Math.ceil(services.length / cardsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Get current cards to display
  const startIndex = currentIndex * cardsPerView;
  const visibleCards = services.slice(startIndex, startIndex + cardsPerView);

  return (
    <ServicesSection>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Grid container justifyContent="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <SectionHeaderWrapper>
              <SectionIconWrapper>
                <PetsIcon sx={{ color: '#fff', fontSize: 30 }} />
              </SectionIconWrapper>
              <SectionSubtitle>
                We love animals
              </SectionSubtitle>
              <SectionTitle>
                Our pet care services
              </SectionTitle>
            </SectionHeaderWrapper>
          </Grid>
        </Grid>

        {/* Carousel */}
        <CarouselContainer>
          <Box sx={{ overflow: 'hidden' }}>
            <CardsWrapper>
              {visibleCards.map((service) => (
                <CardWrapper key={service.id}>
                  <FlipCard>
                    <FlipCardInner className="flip-card-inner">
                      {/* Front of card - shown normally (icon, title, description) */}
                      <FlipCardFront>
                        <IconWrapper bgcolor={service.iconBg}>
                          {service.icon}
                        </IconWrapper>
                        <CardTitle>
                          <a href={service.link}>{service.title}</a>
                        </CardTitle>
                        <CardText>
                          {service.description}
                        </CardText>
                      </FlipCardFront>

                      {/* Back of card - shown on hover (image, title, description, button) */}
                      <FlipCardBack>
                        <CardImage
                          src={service.image}
                          alt={service.title}
                        />
                        <CardContentBack>
                          <CardTitle>
                            <a href={service.link}>{service.title}</a>
                          </CardTitle>
                          <CardText>
                            {service.description}
                          </CardText>
                          <ReadMoreButton href={service.link}>
                            Read more
                          </ReadMoreButton>
                        </CardContentBack>
                      </FlipCardBack>
                    </FlipCardInner>
                  </FlipCard>
                </CardWrapper>
              ))}
            </CardsWrapper>
          </Box>
        </CarouselContainer>

        {/* Carousel Dots */}
        <DotsContainer>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <Dot
              key={index}
              active={currentIndex === index}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </DotsContainer>
      </Container>
    </ServicesSection>
  );
};

export default Services;