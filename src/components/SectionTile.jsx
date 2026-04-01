import React from "react";
import { Box, Container, Typography, useTheme, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import PetsIcon from '@mui/icons-material/Pets';

// Theme colors matching your components
const PRIMARY_COLOR = '#db89ca';
const PRIMARY_LIGHT = '#c06bb0';

const BannerHeader = styled(Box)(({ theme, bgimage }) => ({
  position: "relative",
  padding: "80px 0",
  backgroundImage: `url(${bgimage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  width: "100%",
  overflow: "hidden",
  
  // Responsive padding - reduced to match your components
  [theme.breakpoints.down("lg")]: {
    padding: "70px 0",
  },
  [theme.breakpoints.down("md")]: {
    padding: "60px 0",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "50px 0",
  },
  [theme.breakpoints.down("xs")]: {
    padding: "40px 0",
  },

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
    transition: "background-color 0.3s ease",
  },
}));

const ContentWrapper = styled(Box)({
  position: "relative",
  zIndex: 2,
  display: "flex",
  alignItems: "center",
  minHeight: "220px",
  width: "100%",
  
  "@media (max-width: 768px)": {
    minHeight: "120px",
  },
  "@media (max-width: 480px)": {
    minHeight: "100px",
  },
});

const IconWrapper = styled(Box)(({ theme }) => ({
  marginRight: "8px",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  backgroundColor: PRIMARY_COLOR,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  flexShrink: 0,
  
  "& i": {
    fontSize: "12px",
    color: "#fff",
    transition: "transform 0.3s ease",
  },
  "& svg": {
    fontSize: "12px",
    color: "#fff",
    transition: "transform 0.3s ease",
  },
  "&:hover": {
    backgroundColor: PRIMARY_LIGHT,
    transform: "scale(1.1)",
    "& i, & svg": {
      transform: "rotate(5deg)",
    },
  },
  
  // Responsive sizing
  [theme.breakpoints.down("sm")]: {
    marginRight: "6px",
    width: "18px",
    height: "18px",
    "& svg": {
      fontSize: "10px",
    },
  },
}));

const SubtitleWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "12px",
  flexWrap: "wrap",
  
  "@media (max-width: 768px)": {
    marginBottom: "10px",
  },
  "@media (max-width: 480px)": {
    marginBottom: "8px",
  },
});

const Subtitle = styled(Typography)(({ theme }) => ({
  color: "#fff",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "1.5px",
  display: "flex",
  alignItems: "center",
  textTransform: "uppercase",
  
  [theme.breakpoints.down("sm")]: {
    fontSize: "11px",
    letterSpacing: "1px",
  },
  [theme.breakpoints.down("xs")]: {
    fontSize: "10px",
    letterSpacing: "1px",
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  color: "#fff",
  fontSize: "28px",
  fontWeight: 700,
  lineHeight: 1.2,
  textAlign: "left",
  margin: 0,
  
  [theme.breakpoints.down("lg")]: {
    fontSize: "26px",
  },
  [theme.breakpoints.down("md")]: {
    fontSize: "24px",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "22px",
  },
  [theme.breakpoints.down("xs")]: {
    fontSize: "20px",
  },
}));

export default function SectionTile({
  bgImage = "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg",
  subtitle = "Who are we",
  title = "About Us",
  icon = true,
  iconColor = PRIMARY_COLOR,
  iconSize = 20,
  overlayOpacity = 0.4,
  titleMaxLines = 2,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Responsive icon size - reduced to match your components
  const responsiveIconSize = isMobile ? 18 : isTablet ? 20 : 22;
  
  return (
    <Box 
      className="elementor-widget-container"
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <BannerHeader 
        bgimage={bgImage}
        sx={{
          "&::before": {
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          }
        }}
      >
        <ContentWrapper className="v-middle">
          <Container 
            maxWidth="lg"
            sx={{
              px: {
                xs: 2,
                sm: 3,
                md: 4,
                lg: 0,
              },
            }}
          >
            <Box className="row" sx={{ width: "100%" }}>
              <Box 
                className="col-md-12" 
                sx={{ 
                  textAlign: "left",
                  width: "100%",
                }}
              >
                {subtitle && (
                  <SubtitleWrapper>
                    <Subtitle variant="h6" component="div">
                      {icon && (
                        <IconWrapper 
                          sx={{ 
                            backgroundColor: iconColor,
                            width: responsiveIconSize,
                            height: responsiveIconSize,
                          }}
                        >
                          <PetsIcon 
                            sx={{ 
                              fontSize: responsiveIconSize * 0.6,
                              width: responsiveIconSize * 0.6,
                              height: responsiveIconSize * 0.6,
                            }} 
                          />
                        </IconWrapper>
                      )}
                      {subtitle}
                    </Subtitle>
                  </SubtitleWrapper>
                )}
                
                <Title 
                  variant="h1" 
                  component="h1"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: titleMaxLines,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordBreak: "break-word",
                  }}
                >
                  {title}
                </Title>
              </Box>
            </Box>
          </Container>
        </ContentWrapper>
      </BannerHeader>
    </Box>
  );
}