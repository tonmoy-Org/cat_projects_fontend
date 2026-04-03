// About.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  styled,
  Grid,
  Card,
  CircularProgress,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import { useQuery } from "@tanstack/react-query";
import HeroServiceSection from "../../components/shared/HeroServiceSection";
import WhyChooseSection from "../../components/shared/WhyChooseSectionComponent";
import SectionTile from "../../components/SectionTile";
import VideoSection from "../../components/shared/VideoSection";
import axiosInstance from "../../api/axios";

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
  marginBottom: "12px",
});

const SectionTitle = styled(Typography)({
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "1px",
  color: "#666",
  textTransform: "uppercase",
});

const SectionIcon = styled(Box)({
  width: 26,
  height: 26,
  borderRadius: '50%',
  backgroundColor: '#db89ca',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const MainTitle = styled(Typography)(({ theme }) => ({
  fontSize: "26px",
  fontWeight: 700,
  color: "#1a1a1a",
  lineHeight: 1.2,
  marginBottom: "30px",
  textAlign: "center",
  [theme.breakpoints.down('md')]: {
    fontSize: "32px",
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: "28px",
  },
}));

const GalleryCard = styled(Card)({
  borderRadius: "12px",
  overflow: "hidden",
  position: "relative",
  cursor: "pointer",
  boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
  '&:hover .gallery-category': {
    opacity: 1,
    visibility: 'visible',
    transform: 'translateY(0)',
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
  padding: "5px 14px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: 600,
  zIndex: 2,
  opacity: 0,
  visibility: "hidden",
  transform: "translateY(10px)",
  transition: "all 0.3s ease",
  textTransform: "capitalize",
});

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "400px",
});

const NoGalleryContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "300px",
  textAlign: "center",
});

const About = () => {
  const [displayGallery, setDisplayGallery] = useState([]);

  // Fetch cats from API for gallery
  const { data: catsData = [], isLoading } = useQuery({
    queryKey: ["cats-gallery"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/cats?status=available");
        const cats = Array.isArray(response.data) ? response.data : (response.data.data || []);
        return cats;
      } catch (error) {
        console.error("Failed to fetch cats for gallery:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Process cats data to create gallery items
  useEffect(() => {
    if (catsData && catsData.length > 0) {
      const galleryItems = catsData.map((cat) => ({
        id: cat._id,
        image: cat.featuredImage,
        category: cat.gender === "male" ? "Male" : "Female",
        title: cat.name,
      }));

      setDisplayGallery(galleryItems.slice(0, 8));
    }
  }, [catsData]);

  if (isLoading) {
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
        <VideoSection
          videoUrl="https://youtu.be/545E1RCSzLw"
          backgroundImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/3.jpg"
          subtitle="Promo video"
          title="Watch pepito video"
          icon={true}
        />
        <WhyChooseSection />
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
            <LoadingContainer>
              <CircularProgress sx={{ color: PRIMARY_COLOR }} />
            </LoadingContainer>
          </Container>
        </GallerySection>
      </Box>
    );
  }

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

      {/* Video Section */}
      <VideoSection
        videoUrl="https://youtu.be/545E1RCSzLw"
        backgroundImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/3.jpg"
        subtitle="Watch our promo video"
        title="Discover the world of Father Of Meow"
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
            {displayGallery.length > 0 ? (
              displayGallery.map((item) => (
                <Grid size={{ xs: 6, sm: 6, md: 3 }} key={item.id}>
                  <GalleryCard>
                    <GalleryImage
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x250?text=Gallery+Image';
                      }}
                    />
                    <GalleryCategory className="gallery-category">
                      {item.category}
                    </GalleryCategory>
                  </GalleryCard>
                </Grid>
              ))
            ) : (
              <Grid size={{ xs: 12 }}>
                <NoGalleryContainer>
                  <Typography variant="body1" sx={{ color: "#666" }}>
                    No gallery images available at the moment.
                  </Typography>
                </NoGalleryContainer>
              </Grid>
            )}
          </Grid>
        </Container>
      </GallerySection>
    </Box>
  );
};

export default About;