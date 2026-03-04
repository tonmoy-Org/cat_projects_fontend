// Home.jsx - Testimonial Section
import React, { useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  Button,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// Theme colors
const iconColor = '#db89ca';
const primaryColor = '#ff6b6b';
const starColor = '#ffb800';

// Styled components with animations
const TestimonialSection = styled(Box)({
  backgroundColor: '#f9f9f9',
  padding: '80px 0',
  width: '100%',
  overflow: 'hidden',
});

const SectionHeaderWrapper = styled(Box)({
  textAlign: 'center',
  marginBottom: '50px',
  animation: 'fadeInDown 1s ease',
});

const HeaderTopRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '15px',
  flexWrap: 'wrap',
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
    fontSize: '28px',
  },
});

const TestimonialCard = styled(Box)({
  backgroundColor: '#fff',
  borderRadius: '10px',
  padding: '30px 20px',
  textAlign: 'center',
  boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  height: '100%',
  animation: 'fadeInUp 1s ease',
  '&:hover': {
    transform: 'translateY(-15px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  },
  '&:hover .br-sh': {
    transform: 'rotate(0deg) scale(1.1)',
  },
  '@keyframes fadeInUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(30px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes fadeInDown': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-30px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
});

const ImageWrapper = styled(Box)({
  marginBottom: '25px',
  perspective: '1000px',
  '& .br-sh': {
    width: '140px',
    height: '140px',
    margin: '0 auto',
    overflow: 'hidden',
    borderRadius: '12px', // Slightly rounded corners for better look
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transform: 'rotate(-5deg)',
    '@media (max-width: 600px)': {
      width: '120px',
      height: '120px',
    },
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease',
  },
});

const ReviewerName = styled(Typography)({
  fontSize: '20px',
  fontWeight: 600,
  color: '#1a1a1a',
  marginBottom: '12px',
  transition: 'color 0.3s ease',
  '&::before': {
    content: '"@"',
    color: iconColor,
    fontWeight: 600,
  },
  '${TestimonialCard}:hover &': {
    color: iconColor,
  },
});

const StarRating = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '6px',
  marginBottom: '18px',
  '& svg': {
    fontSize: '20px',
    color: starColor,
    transition: 'transform 0.3s ease',
  },
  '${TestimonialCard}:hover & svg': {
    animation: 'starPulse 0.5s ease',
  },
  '@keyframes starPulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.2)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
});

const ReviewText = styled(Typography)({
  fontSize: '15px',
  color: '#666',
  lineHeight: 1.7,
  fontStyle: 'italic',
  margin: 0,
  transition: 'color 0.3s ease',
  '${TestimonialCard}:hover &': {
    color: '#444',
  },
});

const SectionInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '60px',
  gap: '20px',
  flexWrap: 'wrap',
  animation: 'fadeInUp 1s ease 0.5s',
  animationFillMode: 'both',
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    gap: '15px',
    padding: '0 20px',
  },
});

const PetLoversButton = styled(Button)({
  backgroundColor: 'transparent',
  color: primaryColor,
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  padding: '8px 20px',
  borderRadius: '30px',
  border: `2px solid ${primaryColor}`,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: '140px',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: primaryColor,
    color: '#fff',
    transform: 'translateY(-3px)',
    boxShadow: '0 5px 15px rgba(255,107,107,0.3)',
  },
  '& svg': {
    fontSize: '18px',
    transition: 'transform 0.3s ease',
  },
  '&:hover svg': {
    transform: 'rotate(360deg)',
  },
  '@media (max-width: 600px)': {
    fontSize: '14px',
    padding: '6px 16px',
    minWidth: '120px',
  },
});

const InfoDesc = styled(Typography)({
  fontSize: '20px',
  color: '#333',
  display: 'inline-flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  justifyContent: 'center',
  '@media (max-width: 600px)': {
    fontSize: '18px',
    textAlign: 'center',
  },
  '& span': {
    color: iconColor,
    fontWeight: 600,
    margin: '0 4px',
    position: 'relative',
    cursor: 'pointer',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-2px',
      left: 0,
      width: '100%',
      height: '2px',
      backgroundColor: iconColor,
      transform: 'scaleX(0)',
      transition: 'transform 0.3s ease',
    },
    '&:hover::after': {
      transform: 'scaleX(1)',
    },
  },
});

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: 'emily',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/01-4.jpg',
    rating: 5,
    text: 'Reliable, friendly, and can tell they love animals!',
  },
  {
    id: 2,
    name: 'sophia',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/02-4.jpg',
    rating: 4,
    text: 'My dog love walker and they are always so flexible.',
  },
  {
    id: 3,
    name: 'jason',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/03-4.jpg',
    rating: 4,
    text: 'Dependable, honest, and my rabbits love them!',
  },
  {
    id: 4,
    name: 'evelyn',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/04-4.jpg',
    rating: 4,
    text: 'Always a joy to see my babies being well taken of.',
  },
];

// Helper function to render stars
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<StarIcon key={i} />);
    } else {
      stars.push(<StarBorderIcon key={i} sx={{ color: '#ddd' }} />);
    }
  }
  return stars;
};

const Testimonial = () => {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 1s ease';
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <TestimonialSection>
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
                  Happy pet lovers
                </SectionSubtitle>
              </HeaderTopRow>
              <SectionTitle>
                Pepito reviews
              </SectionTitle>
            </SectionHeaderWrapper>
          </Grid>
        </Grid>

        {/* Testimonial Cards */}
        <Grid container spacing={{ xs: 3, sm: 3, md: 3 }}>
          {testimonials.map((testimonial, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 3 }}
              key={testimonial.id}
            >
              <TestimonialCard
                ref={(el) => (cardRefs.current[index] = el)}
                sx={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <ImageWrapper>
                  <div className="br-sh">
                    <img src={testimonial.image} alt={`@${testimonial.name}`} />
                  </div>
                </ImageWrapper>
                <ReviewerName>
                  {testimonial.name}
                </ReviewerName>
                <StarRating>
                  {renderStars(testimonial.rating)}
                </StarRating>
                <ReviewText>
                  {testimonial.text}
                </ReviewText>
              </TestimonialCard>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Info Section - Button and Text on same X-axis */}
        <Grid container justifyContent="center">
          <Grid size={{ xs: 12, md: 10 }}>
            <SectionInfo>
              <PetLoversButton
                variant="outlined"
                startIcon={<PetsIcon />}
              >
                Pet lovers
              </PetLoversButton>
              <InfoDesc>
                Genuine 1000+ people trusting <span>Pepito</span> pet care.
              </InfoDesc>
            </SectionInfo>
          </Grid>
        </Grid>
      </Container>
    </TestimonialSection>
  );
};

export default Testimonial;