import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

// Theme colors
const iconColor = '#5C4D91';

// Styled components
const WhyChooseSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  paddingTop: '80px',
}));

const SectionSubtitle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '15px',
});

const SubtitleText = styled(Typography)({
  fontSize: '15px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#333',
  textTransform: 'uppercase',
});

const IconWrapper = styled(Box)({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: '#db89ca',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const SectionTitle = styled(Typography)({
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
  marginBottom: '30px',
});

const FeatureList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

const FeatureItem = styled('li')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '12px',
});

const FeatureIcon = styled(Box)({
  color: iconColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    fontSize: '20px',
  },
});

const FeatureText = styled(Typography)({
  fontWeight: 500,
  fontSize: '14px',
  color: '#333',
});

// Updated ImageWrapper with better positioning for larger image
const ImageWrapper = styled(Box)({
  textAlign: 'right',
  marginTop: '30px',
  position: 'relative',
  right: '-20px',
  '@media (min-width: 900px)': {
    marginTop: 0,
    right: '-40px',
  },
  '@media (min-width: 1200px)': {
    right: '-60px',
  },
});

// Updated WhyChooseImage with increased size
const WhyChooseImage = styled('img')({
  width: '130%', // 30% larger than container
  maxWidth: '130%',
  height: 'auto',
  display: 'block',
  objectFit: 'contain',
  '@media (max-width: 899px)': {
    width: '100%',
    maxWidth: '100%',
    margin: '0 auto',
  },
});

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
  imageSrc = "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/pet3.png",
  imageAlt = "Happy pet"
}) => {
  // Split features into two columns
  const midIndex = Math.ceil(features.length / 2);
  const leftColumnFeatures = features.slice(0, midIndex);
  const rightColumnFeatures = features.slice(midIndex);

  return (
    <WhyChooseSection className="banner section-padding">
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Column - Content */}
          <Grid size={{ xs: 12, lg: 6, md: 12 }}>
            <Box className="content">
              <SectionSubtitle className="section-subtitle">
                <SubtitleText>{subtitle}</SubtitleText>
              </SectionSubtitle>

              <SectionTitle className="section-title">
                {title}
              </SectionTitle>

              <Description>
                {description}
              </Description>

              {/* Features Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6, md: 6 }}>
                  <FeatureList className="listext list-unstyled">
                    {leftColumnFeatures.map((feature, index) => (
                      <FeatureItem key={`left-${index}`}>
                        <FeatureIcon className="listext-icon">
                          <PetsIcon />
                        </FeatureIcon>
                        <FeatureText className="listext-text">
                          {feature}
                        </FeatureText>
                      </FeatureItem>
                    ))}
                  </FeatureList>
                </Grid>
                <Grid size={{ xs: 12, lg: 6, md: 6 }}>
                  <FeatureList className="listext list-unstyled">
                    {rightColumnFeatures.map((feature, index) => (
                      <FeatureItem key={`right-${index}`}>
                        <FeatureIcon className="listext-icon">
                          <PetsIcon />
                        </FeatureIcon>
                        <FeatureText className="listext-text">
                          {feature}
                        </FeatureText>
                      </FeatureItem>
                    ))}
                  </FeatureList>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Column - Image with adjusted offset for larger image */}
          <Grid size={{ xs: 12, lg: 5, md: 12 }} offset={{ lg: 1 }}>
            <ImageWrapper className="img">
              <WhyChooseImage
                src={imageSrc}
                alt={imageAlt}
                className="img-fluid"
              />
            </ImageWrapper>
          </Grid>
        </Grid>
      </Container>
    </WhyChooseSection>
  );
};

export default WhyChooseSectionComponent;