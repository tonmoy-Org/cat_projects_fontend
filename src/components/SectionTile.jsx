import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PetsIcon from '@mui/icons-material/Pets';

// Theme colors
const PRIMARY_COLOR = '#5C4D91';
const PRIMARY_LIGHT = '#7B6BA8';

const BannerHeader = styled(Box)(({ theme, bgimage }) => ({
  position: "relative",
  padding: "120px 0",
  backgroundImage: `url(${bgimage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: "100%",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1,
  },
}));

const ContentWrapper = styled(Box)({
  position: "relative",
  zIndex: 2,
  display: "flex",
  alignItems: "center",
  minHeight: "180px",
});

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  marginRight: "10px",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: PRIMARY_COLOR,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  "& i": {
    fontSize: "20px",
    color: "#fff",
  },
  "& svg": {
    fontSize: "20px",
    color: "#fff",
  },
  "&:hover": {
    backgroundColor: PRIMARY_LIGHT,
    transform: "scale(1.05)",
  },
}));

const SubtitleWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "5px",
});

const Subtitle = styled(Typography)(({ theme }) => ({
  color: "#fff",
  fontSize: "16px",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "2px",
  display: "flex",
  alignItems: "center",
}));

const Title = styled(Typography)({
  color: "#fff",
  fontSize: "40px",
  fontWeight: 700,
  lineHeight: 1.2,
  textAlign: "left",
  "@media (max-width: 768px)": {
    fontSize: "36px",
  },
  "@media (max-width: 480px)": {
    fontSize: "28px",
  },
});

export default function SectionTile({
  bgImage = "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg",
  subtitle = "Who are we",
  title = "About Pepito",
  icon = true,
  iconClass = "flaticon-prize-badge-with-paw-print",
  iconColor = PRIMARY_COLOR, // Allow custom color if needed
  iconSize = 40, // Allow custom size if needed
}) {
  return (
    <Box className="elementor-widget-container">
      <BannerHeader bgimage={bgImage} data-overlay-dark="3">
        <ContentWrapper className="v-middle">
          <Container maxWidth="lg">
            <Box className="row">
              <Box className="col-md-12" sx={{ textAlign: "left" }}>
                {subtitle && (
                  <SubtitleWrapper>
                    <Subtitle variant="h6">
                      {icon && (
                        <IconWrapper 
                          sx={{ 
                            backgroundColor: iconColor,
                            width: iconSize,
                            height: iconSize,
                          }}
                        >
                          <PetsIcon sx={{ fontSize: iconSize * 0.6 }} />
                        </IconWrapper>
                      )}
                      {subtitle}
                    </Subtitle>
                  </SubtitleWrapper>
                )}
                
                <Title variant="h1">{title}</Title>
              </Box>
            </Box>
          </Container>
        </ContentWrapper>
      </BannerHeader>
    </Box>
  );
}