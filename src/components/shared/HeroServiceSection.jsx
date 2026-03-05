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

// Theme colors
const PRIMARY_COLOR = '#5C4D91';
const PRIMARY_DARK = '#4A3D75';

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
  fontSize: '15px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#333',
});

const SectionIcon = styled(Box)({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: PRIMARY_COLOR,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const MainTitle = styled(Typography)({
  fontSize: '42px',
  fontWeight: 700,
  color: '#1a1a1a',
  lineHeight: 1.2,
  marginBottom: '20px',
  '@media (max-width: 600px)': {
    fontSize: '32px',
  },
});

const Description = styled(Typography)({
  fontSize: '16px',
  color: '#666',
  lineHeight: 1.8,
  marginBottom: '25px',
});

const StyledButton = styled(Button)({
  backgroundColor: PRIMARY_COLOR,
  color: '#fff',
  padding: '12px 30px',
  fontSize: '16px',
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: '30px',
  boxShadow: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: PRIMARY_DARK,
    boxShadow: '0 5px 20px rgba(92,77,145,0.3)',
  },
  '@media (max-width: 400px)': {
    padding: '10px 20px',
    fontSize: '14px',
  },
});

const ActionButtons = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '30px',
  marginTop: '30px',
  flexWrap: 'wrap',
  '@media (max-width: 500px)': {
    gap: '20px',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const PhoneBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
});

const PhoneIconWrapper = styled(Box)({
  backgroundColor: PRIMARY_COLOR,
  borderRadius: '50%',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '45px',
  height: '45px',
  '@media (max-width: 400px)': {
    width: '40px',
    height: '40px',
    padding: '6px',
  },
});

const PhoneNumber = styled(Typography)({
  fontSize: '24px',
  fontWeight: 700,
  color: '#1a1a1a',
  whiteSpace: 'nowrap',
  '@media (max-width: 600px)': {
    fontSize: '20px',
  },
  '@media (max-width: 400px)': {
    fontSize: '18px',
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
  padding: '15px 20px',
  borderRadius: '10px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  backdropFilter: 'blur(5px)',
  maxWidth: '250px',
  zIndex: 10,
  opacity: 1,
  visibility: 'visible',
  transform: 'translateY(0)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  '@media (max-width: 600px)': {
    maxWidth: '200px',
    padding: '10px 15px',
    bottom: '10px',
    right: '10px',
  },
  '@media (max-width: 400px)': {
    maxWidth: '180px',
    padding: '8px 12px',
  },
});

const TestimonialText = styled(Typography)({
  fontSize: '14px',
  fontStyle: 'italic',
  color: '#333',
  lineHeight: 1.5,
  marginBottom: '10px',
  fontWeight: 500,
  '@media (max-width: 600px)': {
    fontSize: '12px',
  },
});

const TestimonialAuthor = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

const AuthorAvatar = styled(Avatar)({
  width: '35px',
  height: '35px',
  '@media (max-width: 600px)': {
    width: '30px',
    height: '30px',
  },
});

const AuthorName = styled(Typography)({
  fontSize: '13px',
  fontWeight: 600,
  color: '#333',
  '@media (max-width: 600px)': {
    fontSize: '12px',
  },
});

const AuthorTitle = styled(Typography)({
  fontSize: '11px',
  color: '#999',
  '@media (max-width: 600px)': {
    fontSize: '10px',
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
  imageUrl = "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
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
                <PetsIcon sx={{ color: '#fff', fontSize: 30 }} />
              </SectionIcon>
              <SectionTitle>{subtitle}</SectionTitle>
            </SectionTitleWrapper>
            <MainTitle>{title}</MainTitle>
            <Description>{description}</Description>

            <Box sx={{ mb: 3 }}>
              {features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ color: PRIMARY_COLOR, display: 'flex' }}>
                    <PetsIcon />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{feature}</Typography>
                </Box>
              ))}
            </Box>

            <ActionButtons>
              <StyledButton endIcon={<ArrowForwardIcon />}>
                {buttonText}
              </StyledButton>
              <PhoneBox>
                <PhoneIconWrapper>
                  <PhoneIcon sx={{ color: '#fff', fontSize: '24px' }} />
                </PhoneIconWrapper>
                <PhoneNumber>{phoneNumber}</PhoneNumber>
              </PhoneBox>
            </ActionButtons>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ImageWrapper>
              <HeroImage src={imageUrl} alt="Happy pet" />
              <TestimonialCard className="testimonial-card">
                <Box sx={{ display: 'flex', mb: 1 }}>
                  {[...Array(rating)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: PRIMARY_COLOR, fontSize: '14px' }} />
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