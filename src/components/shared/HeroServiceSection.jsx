import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  styled,
  Avatar,
  Card,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import PhoneIcon from '@mui/icons-material/Phone';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import img1 from '../../public/About/pet1.png';

// Theme colors
const primaryColor = '#ff6b6b';
const iconColor = '#db89ca';

// Styled components
const HeroSection = styled(Box)({
  backgroundColor: '#f9f9f9',
  padding: '80px 0',
  position: 'relative',
  overflow: 'hidden',
});

const SectionTitleWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '15px',
});

const SectionTitle = styled(Typography)({
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#666',
  textTransform: 'uppercase',
});

const SectionIcon = styled(Box)({
  width: 30,
  height: 30,
  borderRadius: '50%',
  backgroundColor: '#db89ca',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const MainTitle = styled(Typography)({
  fontSize: '38px',
  fontWeight: 700,
  color: '#1a1a1a',
  lineHeight: 1.2,
  marginBottom: '20px',
  '@media (max-width: 600px)': {
    fontSize: '28px',
  },
});

const Description = styled(Typography)({
  fontSize: '15px',
  color: '#666',
  lineHeight: 1.7,
  marginBottom: '25px',
});

const StyledButton = styled(Button)({
  backgroundColor: primaryColor,
  color: '#fff',
  padding: '10px 24px',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: '25px',
  boxShadow: 'none',
  whiteSpace: 'nowrap',
  minWidth: '120px',
  '&:hover': {
    backgroundColor: '#ff5252',
    boxShadow: '0 5px 15px rgba(255,107,107,0.3)',
  },
  '@media (max-width: 400px)': {
    padding: '8px 20px',
    fontSize: '13px',
    minWidth: '100px',
  },
});

const ActionButtons = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginTop: '30px',
  flexWrap: 'wrap',
  '@media (max-width: 500px)': {
    gap: '15px',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const PhoneBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

const PhoneIconWrapper = styled(Box)({
  backgroundColor: '#db89ca',
  borderRadius: '50%',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  '@media (max-width: 400px)': {
    width: '32px',
    height: '32px',
    padding: '4px',
  },
});

const PhoneNumber = styled(Typography)({
  fontSize: '18px',
  fontWeight: 600,
  color: '#1a1a1a',
  whiteSpace: 'nowrap',
  '@media (max-width: 600px)': {
    fontSize: '16px',
  },
  '@media (max-width: 400px)': {
    fontSize: '14px',
  },
});

const ImageWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  borderRadius: '10px',
  overflow: 'hidden',
  '&:hover .testimonial-card': {
    transform: 'scale(1.05) translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    backgroundColor: '#ffffff',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
});

const HeroImage = styled('img')({
  width: '100%',
  height: 'auto',
  display: 'block',
  borderRadius: '10px',
  transition: 'transform 0.5s ease',
});

const TestimonialCard = styled(Card)({
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '12px 16px',
  borderRadius: '8px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(5px)',
  maxWidth: '220px',
  zIndex: 10,
  opacity: 1,
  visibility: 'visible',
  transform: 'translateY(0)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  '@media (max-width: 600px)': {
    maxWidth: '180px',
    padding: '8px 12px',
    bottom: '10px',
    right: '10px',
  },
  '@media (max-width: 400px)': {
    maxWidth: '160px',
    padding: '6px 10px',
  },
});

const TestimonialText = styled(Typography)({
  fontSize: '12px',
  fontStyle: 'italic',
  color: '#444',
  lineHeight: 1.4,
  marginBottom: '8px',
  fontWeight: 500,
  '@media (max-width: 600px)': {
    fontSize: '11px',
  },
});

const TestimonialAuthor = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const AuthorAvatar = styled(Avatar)({
  width: '28px',
  height: '28px',
  '@media (max-width: 600px)': {
    width: '24px',
    height: '24px',
  },
});

const AuthorName = styled(Typography)({
  fontSize: '12px',
  fontWeight: 600,
  color: '#333',
  '@media (max-width: 600px)': {
    fontSize: '11px',
  },
});

const AuthorTitle = styled(Typography)({
  fontSize: '10px',
  color: '#999',
  '@media (max-width: 600px)': {
    fontSize: '9px',
  },
});

const HeroServiceSection = ({
  subtitle = "Our passion is animals",
  title = "We offer services for special pets!",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit lobortis rhoncus sapien mana elemen auris fermen.",
  features = [
    "Over +20 years of experience",
    "20 talented vets ready to help you"
  ],
  buttonText = "Read more",
  phoneNumber = "123 456 7890",
  imageUrl = img1,
  testimonial = {
    text: "Take care of animals as if they were your children!",
    author: "Olivia Martin",
    role: "Pet Owner",
    avatar: "https://images.unsplash.com/photo-1494790108777-466d68e70449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80"
  },
  rating = 5
}) => {
  return (
    <HeroSection>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionTitleWrapper>
              <SectionIcon>
                <PetsIcon sx={{ color: '#fff', fontSize: 18 }} />
              </SectionIcon>
              <SectionTitle>{subtitle}</SectionTitle>
            </SectionTitleWrapper>
            <MainTitle>{title}</MainTitle>
            <Description>{description}</Description>

            <Box sx={{ mb: 3 }}>
              {features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ color: iconColor, display: 'flex' }}>
                    <PetsIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '14px' }}>{feature}</Typography>
                </Box>
              ))}
            </Box>

            <ActionButtons>
              <StyledButton endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}>
                {buttonText}
              </StyledButton>
              <PhoneBox>
                <PhoneIconWrapper>
                  <PhoneIcon sx={{ color: '#fff', fontSize: 18 }} />
                </PhoneIconWrapper>
                <PhoneNumber>{phoneNumber}</PhoneNumber>
              </PhoneBox>
            </ActionButtons>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ImageWrapper>
              <HeroImage src={imageUrl} alt="Happy pet" />
              <TestimonialCard className="testimonial-card">
                <Box sx={{ display: 'flex', mb: 0.5 }}>
                  {[...Array(rating)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: iconColor, fontSize: '12px' }} />
                  ))}
                </Box>
                <TestimonialText>"{testimonial.text}"</TestimonialText>
                <TestimonialAuthor>
                  <AuthorAvatar src={testimonial.avatar} />
                  <Box>
                    <AuthorName>{testimonial.author}</AuthorName>
                    <AuthorTitle>{testimonial.role}</AuthorTitle>
                  </Box>
                </TestimonialAuthor>
              </TestimonialCard>
            </ImageWrapper>
          </Grid>
        </Grid>
      </Container>
    </HeroSection>
  );
};

export default HeroServiceSection;