// VideoSection.jsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    styled,
    Modal,
    Fade,
    Backdrop,
    Container,
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import PetsIcon from '@mui/icons-material/Pets';

// Theme colors
const PRIMARY_COLOR = '#5C4D91';
const PRIMARY_DARK = '#4A3D75';

const VideoSectionWrapper = styled(Box)({
    position: "relative",
    padding: "100px 0",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    '@media (max-width: 900px)': {
        padding: "80px 0",
        backgroundAttachment: "scroll",
    },
    '@media (max-width: 600px)': {
        padding: "60px 0",
    },
});

const ContentWrapper = styled(Box)({
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "300px",
});

const SectionSubtitle = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "15px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
});

const IconWrapper = styled(Box)({
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: PRIMARY_COLOR,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    '& svg': {
        color: "#fff",
        fontSize: 20,
    },
});

const SectionTitle = styled(Typography)({
    fontSize: "48px",
    fontWeight: 700,
    color: "#fff",
    lineHeight: 1.2,
    marginBottom: "40px",
    textAlign: "center",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
    '@media (max-width: 900px)': {
        fontSize: "42px",
        maxWidth: "600px",
    },
    '@media (max-width: 600px)': {
        fontSize: "32px",
        marginBottom: "30px",
        maxWidth: "400px",
    },
});

// Fixed play button size - made larger (was too small)
const PlayButton = styled(IconButton)({
    backgroundColor: PRIMARY_COLOR,
    color: "#fff",
    width: "80px",
    height: "80px", 
    position: "relative",
    zIndex: 2,
    transition: "all 0.3s ease",
    border: "4px solid rgba(255,255,255,0.5)",
    '&:hover': {
        backgroundColor: PRIMARY_DARK,
        borderColor: "#fff",
        transform: "scale(1.1)",
    },
    '& svg': {
        fontSize: "40px", // Increased from 60px
        color: "#fff",
    },
    '@media (max-width: 900px)': {
        width: "100px",
        height: "100px",
        '& svg': {
            fontSize: "55px",
        },
    },
    '@media (max-width: 600px)': {
        width: "80px",
        height: "80px",
        '& svg': {
            fontSize: "45px",
        },
    },
});

const PlayButtonContainer = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
});

// Modal Styles - Fixed the dark overlay issue
const ModalWrapper = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

// Custom Backdrop with less darkness
const CustomBackdrop = styled(Backdrop)({
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Less dark than default (was 0.9)
    backdropFilter: 'blur(3px)', // Optional: adds slight blur effect
});

const ModalContent = styled(Box)({
    position: 'relative',
    width: '90%',
    maxWidth: '900px',
    backgroundColor: '#000',
    borderRadius: '12px', // Slightly more rounded
    overflow: 'hidden',
    outline: 'none',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)', // Added shadow for depth
});

const CloseButton = styled(IconButton)({
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    zIndex: 10,
    width: '40px',
    height: '40px',
    '&:hover': {
        backgroundColor: PRIMARY_COLOR,
        transform: 'scale(1.1)',
    },
    '& svg': {
        fontSize: '24px',
    },
});

const VideoIframe = styled('iframe')({
    width: '100%',
    height: '500px',
    border: 'none',
    display: 'block',
    '@media (max-width: 900px)': {
        height: '400px',
    },
    '@media (max-width: 600px)': {
        height: '250px',
    },
});

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
    if (!url) return null;

    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
        /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
};

const VideoSection = ({
    videoUrl = "https://youtu.be/545E1RCSzLw",
    backgroundImage = "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/3.jpg",
    subtitle = "Promo video",
    title = "Watch pepito video",
    icon = true,
}) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const videoId = getYouTubeVideoId(videoUrl);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';

    return (
        <>
            <VideoSectionWrapper
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <ContentWrapper>
                        <SectionSubtitle>
                            {icon && (
                                <IconWrapper>
                                    <PetsIcon />
                                </IconWrapper>
                            )}
                            <Typography component="span" sx={{ color: '#fff' }}>
                                {subtitle}
                            </Typography>
                        </SectionSubtitle>

                        <SectionTitle variant="h2">
                            {title}
                        </SectionTitle>

                        <PlayButtonContainer>
                            <PlayButton onClick={handleOpen} aria-label="Play video">
                                <PlayCircleOutlineIcon />
                            </PlayButton>
                        </PlayButtonContainer>
                    </ContentWrapper>
                </Container>
            </VideoSectionWrapper>

            {/* Video Modal - Fixed backdrop darkness */}
            <ModalWrapper
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={CustomBackdrop} // Using custom backdrop instead of default
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <ModalContent>
                        <CloseButton onClick={handleClose}>
                            <CloseIcon />
                        </CloseButton>
                        {embedUrl ? (
                            <VideoIframe
                                src={embedUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <Box sx={{
                                height: '500px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <Typography variant="h5">Invalid video URL</Typography>
                                <Typography variant="body2">Please provide a valid YouTube URL</Typography>
                            </Box>
                        )}
                    </ModalContent>
                </Fade>
            </ModalWrapper>
        </>
    );
};

export default VideoSection;