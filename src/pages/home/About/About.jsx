import React from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  styled,
  Grid,
  Card,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PetsIcon from "@mui/icons-material/Pets";
import HeroServiceSection from "../../../components/shared/HeroServiceSection";
import TeamSection from "../../../components/shared/TeamSectionComponent";
import WhyChooseSection from "../../../components/shared/WhyChooseSectionComponent";
import SectionTile from "../../../components/SectionTile";

// Video Section (kept as is since it's unique)
const VideoSection = styled(Box)({
  position: "relative",
  height: "600px",
  backgroundImage:
    "url(https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1586&q=80)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  backgroundRepeat: "no-repeat",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});

const PlayButton = styled(IconButton)({
  backgroundColor: "#db89ca",
  color: "#fff",
  width: "80px",
  height: "80px",
  position: "relative",
  zIndex: 2,
  "&:hover": {
    backgroundColor: "#ff6b6b",
    transform: "scale(1.1)",
  },
  "& svg": {
    fontSize: "50px",
  },
});

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
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: "#db89ca",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
  backgroundColor: "#ff5252",
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
        bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg"
        subtitle="Our Services"
        title="What We Offer"
        icon={true}
        iconClass="flaticon-custom-icon"
      />
      <HeroServiceSection />

      {/* Team Section - Now a reusable component */}
      <TeamSection />

      {/* Video Section - Kept as is */}
      <VideoSection>
        <PlayButton>
          <PlayCircleOutlineIcon />
        </PlayButton>
        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            bottom: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            zIndex: 2,
            fontWeight: 600,
          }}
        >
          Watch people video
        </Typography>
      </VideoSection>

      {/* Why Choose Us Section - Now a reusable component */}
      <WhyChooseSection />

      {/* Gallery Section */}
      <GallerySection>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <SectionTitleWrapper>
              <SectionIcon>
                <PetsIcon sx={{ color: "#fff", fontSize: 30 }} />
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
