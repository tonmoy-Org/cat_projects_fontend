import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import img3 from '../../public/About/pet3.png';

// Theme colors
const iconColor = '#db89ca';

// Styled components
const WhyChooseSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  [theme.breakpoints.up('lg')]: {
    marginBottom: '80px',
    paddingLeft: '300px',
  },
}));

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
  backgroundColor: '#db89ca',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const MainTitle = styled(Typography)({
  fontSize: '36px',
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
  maxWidth: '90%',
});

const WhyChooseImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  borderRadius: '10px',
  display: 'block',
  position: 'relative',
  zIndex: 1,
  maxHeight: '300px',
  [theme.breakpoints.up('md')]: {
    maxHeight: '400px',
  },
  [theme.breakpoints.up('lg')]: {
    maxHeight: '500px',
    margin: '-30px 0',
  },
}));

const WhyChooseSectionComponent = ({
  subtitle = "We love animals",
  title = "Why rely on us?",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing eliten lobortis the rhoncus sapien mana elemen auris fermen.",
  features = [
    "We love dogs",
    "Personalized care",
    "Convenience",
    "Peace of mind",
    "Transperency",
    "Teamwork",
    "Certified Groomer",
    "20+ Years Experience"
  ],
  imageSrc = img3,
  imageAlt = "Happy pet"
}) => {
  return (
    <WhyChooseSection>
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionTitleWrapper>
              <SectionIcon>
                <PetsIcon sx={{ color: '#fff', fontSize: 30 }} />
              </SectionIcon>
              <SectionTitle>{subtitle}</SectionTitle>
            </SectionTitleWrapper>
            <MainTitle sx={{ mb: 3 }}>{title}</MainTitle>
            <Description>{description}</Description>

            <Grid container spacing={1} sx={{ mt: 2 }}>
              {features.map((feature, index) => (
                <Grid size={{ xs: 6 }} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: iconColor }}>
                      <PetsIcon sx={{ fontSize: '20px' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>{feature}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <WhyChooseImage src={imageSrc} alt={imageAlt} />
          </Grid>
        </Grid>
      </Container>
    </WhyChooseSection>
  );
};

export default WhyChooseSectionComponent;