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
        backgroundColor: "rgba(0,0,0,0.45)",
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
    minHeight: "280px",
});

const SectionSubtitle = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "12px",
    color: "#fff",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
});

const IconWrapper = styled(Box)({
    width: 26,
    height: 26,
    borderRadius: "50%",
    backgroundColor: PRIMARY_COLOR,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    '& svg': {
        color: "#fff",
        fontSize: 18,
    },
});

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: "26px",
    fontWeight: 700,
    color: "#fff",
    lineHeight: 1.2,
    marginBottom: "40px",
    textAlign: "center",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.down('md')]: {
        fontSize: "32px",
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: "28px",
        marginBottom: "30px",
    },
}));

const PlayButton = styled(IconButton)({
    backgroundColor: PRIMARY_COLOR,
    color: "#fff",
    width: "80px",
    height: "80px",
    transition: "all 0.3s ease",
    '&:hover': {
        backgroundColor: PRIMARY_DARK,
        transform: "scale(1.12)",
    },
    '& svg': {
        fontSize: "42px",
    },
    '@media (max-width: 600px)': {
        width: "70px",
        height: "70px",
        '& svg': {
            fontSize: "38px",
        },
    },
});

const PlayButtonContainer = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
});

// Modal Styles
const ModalWrapper = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const CustomBackdrop = styled(Backdrop)({
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
});

const ModalContent = styled(Box)({
    position: 'relative',
    width: '90%',
    maxWidth: '900px',
    backgroundColor: '#000',
    borderRadius: '12px',
    overflow: 'hidden',
    outline: 'none',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
});

const CloseButton = styled(IconButton)({
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    zIndex: 10,
    width: '42px',
    height: '42px',
    '&:hover': {
        backgroundColor: PRIMARY_COLOR,
    },
});

const VideoIframe = styled('iframe')({
    width: '100%',
    height: '500px',
    border: 'none',
    '@media (max-width: 900px)': {
        height: '420px',
    },
    '@media (max-width: 600px)': {
        height: '280px',
    },
});

// Helper function to extract YouTube video ID
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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const videoId = getYouTubeVideoId(videoUrl);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';

    return (
        <>
            <VideoSectionWrapper
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <ContentWrapper>
                        <SectionSubtitle>
                            {icon && (
                                <IconWrapper>
                                    <PetsIcon />
                                </IconWrapper>
                            )}
                            {subtitle}
                        </SectionSubtitle>

                        <SectionTitle>{title}</SectionTitle>

                        <PlayButtonContainer>
                            <PlayButton onClick={handleOpen} aria-label="Play video">
                                <PlayCircleOutlineIcon />
                            </PlayButton>
                        </PlayButtonContainer>
                    </ContentWrapper>
                </Container>
            </VideoSectionWrapper>

            {/* Video Modal */}
            <ModalWrapper
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={CustomBackdrop}
                BackdropProps={{ timeout: 500 }}
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