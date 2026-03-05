// About.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  styled,
  Grid,
  Card,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import HeroServiceSection from "../../../components/shared/HeroServiceSection";
import WhyChooseSection from "../../../components/shared/WhyChooseSectionComponent";
import SectionTile from "../../../components/SectionTile";
import VideoSection from "../../../components/shared/VideoSection";

// Theme colors
const PRIMARY_COLOR = '#5C4D91';

// Gallery Section
const GallerySection = styled(Box)({
  padding: "80px 0",
  backgroundColor: "#f5f5f7",
});

const SectionTitleWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  marginBottom: "15px",
});

const SectionTitle = styled(Typography)({
  fontSize: "15px",
  fontWeight: 600,
  letterSpacing: "1px",
  color: "#333",
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
  fontSize: "36px",
  fontWeight: 700,
  color: "#1a1a1a",
  lineHeight: 1.2,
  marginBottom: "20px",
  textAlign: "center",
  "@media (max-width: 600px)": {
    fontSize: "32px",
  },
});

const GalleryCard = styled(Card)({
  borderRadius: "10px",
  overflow: "hidden",
  position: "relative",
  "&:hover .gallery-category": {
    opacity: 1,
    visibility: "visible",
    transform: "translateY(0)",
  },
  "&:hover img": {
    transform: "scale(1.05)",
  },
});

const GalleryImage = styled("img")({
  width: "100%",
  height: "250px",
  objectFit: "cover",
  transition: "transform 0.5s ease",
});

const GalleryCategory = styled(Box)({
  position: "absolute",
  bottom: "15px",
  left: "15px",
  backgroundColor: PRIMARY_COLOR,
  color: "#fff",
  padding: "5px 15px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 500,
  zIndex: 2,
  opacity: 0,
  visibility: "hidden",
  transform: "translateY(10px)",
  transition: "all 0.3s ease",
  textTransform: "capitalize",
});

// Gallery data
const galleryImages = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
    category: "Cat",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1588&q=80",
    category: "Dog",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1574231164645-d6f0e8553590?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1586&q=80",
    category: "Rabbit",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1534351450181-ea9f78427fe8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
    category: "Bird",
  },
];


const About = () => {
  return (
    <Box>
      <SectionTile
        bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/4.jpg"
        subtitle="Our Services"
        title="About Father Of Meow"
        icon={true}
        iconClass="flaticon-custom-icon"
      />
      <HeroServiceSection />

      {/* Video Section - Using the reusable component */}
      <VideoSection
        videoUrl="https://youtu.be/545E1RCSzLw"
        backgroundImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/3.jpg"
        subtitle="Promo video"
        title="Watch pepito video"
        icon={true}
      />

      {/* Why Choose Us Section */}
      <WhyChooseSection />

      {/* Gallery Section */}
      <GallerySection>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <SectionTitleWrapper>
              <SectionIcon>
                <PetsIcon sx={{ color: "#fff", fontSize: 18 }} />
              </SectionIcon>
              <SectionTitle>Pet gallery</SectionTitle>
            </SectionTitleWrapper>
            <MainTitle>Looking & smelling great!</MainTitle>
          </Box>

          <Grid container spacing={3}>
            {galleryImages.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
                <GalleryCard>
                  <GalleryImage
                    src={item.image}
                    alt={`Pet gallery ${item.id}`}
                  />
                  <GalleryCategory className="gallery-category">
                    {item.category}
                  </GalleryCategory>
                </GalleryCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </GallerySection>
    </Box>
  );
};

export default About;