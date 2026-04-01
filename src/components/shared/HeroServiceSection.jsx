// HeroServiceSection.jsx
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

// Styled components with consistent font sizes
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#f9f9f9',
  padding: '80px 0',
  position: 'relative',
  overflow: 'hidden',

  [theme.breakpoints.down('sm')]: {
    padding: '50px 0',
  },
}));

const SectionTitleWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '12px',
});

const SectionTitle = styled(Typography)({
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#666',
  textTransform: 'uppercase',
});

const SectionIcon = styled(Box)({
  width: 26,
  height: 26,
  borderRadius: '50%',
  backgroundColor: iconColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const MainTitle = styled(Typography)(({ theme }) => ({
  fontSize: '26px',
  fontWeight: 700,
  color: '#1a1a1a',
  lineHeight: 1.2,
  marginBottom: '20px',
  [theme.breakpoints.down('md')]: {
    fontSize: '32px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '28px',
  },
}));

const Description = styled(Typography)({
  fontSize: '15px',
  color: '#666',
  lineHeight: 1.65,
  marginBottom: '28px',
});

const StyledButton = styled(Button)({
  backgroundColor: primaryColor,
  color: '#fff',
  padding: '10px 28px',
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '25px',
  boxShadow: 'none',
  whiteSpace: 'nowrap',
  minWidth: '140px',
  '&:hover': {
    backgroundColor: '#ff5252',
    boxShadow: '0 5px 15px rgba(255,107,107,0.3)',
    transform: 'translateY(-2px)',
  },
  '@media (max-width: 600px)': {
    padding: '9px 24px',
    fontSize: '13px',
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
  backgroundColor: iconColor,
  borderRadius: '50%',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
});

const PhoneNumber = styled(Typography)({
  fontSize: '17px',
  fontWeight: 600,
  color: '#1a1a1a',
  whiteSpace: 'nowrap',
  '@media (max-width: 600px)': {
    fontSize: '15px',
  },
});

const ImageWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
  '&:hover .testimonial-card': {
    transform: 'scale(1.03) translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
});

const HeroImage = styled('img')({
  width: '100%',
  height: 'auto',
  display: 'block',
  borderRadius: '12px',
  transition: 'transform 0.5s ease',
});

const TestimonialCard = styled(Card)({
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '14px 18px',
  borderRadius: '10px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(8px)',
  maxWidth: '220px',
  zIndex: 10,
  transition: 'all 0.4s ease',
  '@media (max-width: 600px)': {
    maxWidth: '190px',
    padding: '10px 14px',
    bottom: '12px',
    right: '12px',
  },
});

const TestimonialText = styled(Typography)({
  fontSize: '13px',
  fontStyle: 'italic',
  color: '#444',
  lineHeight: 1.45,
  marginBottom: '10px',
});

const TestimonialAuthor = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const AuthorAvatar = styled(Avatar)({
  width: '28px',
  height: '28px',
});

const AuthorName = styled(Typography)({
  fontSize: '13px',
  fontWeight: 600,
  color: '#333',
});

const AuthorTitle = styled(Typography)({
  fontSize: '11px',
  color: '#999',
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

            <Box sx={{ mb: 4 }}>
              {features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.8 }}>
                  <Box sx={{ color: iconColor }}>
                    <PetsIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#444' }}>
                    {feature}
                  </Typography>
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
                <Box sx={{ display: 'flex', mb: 1 }}>
                  {[...Array(rating)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: iconColor, fontSize: '14px' }} />
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