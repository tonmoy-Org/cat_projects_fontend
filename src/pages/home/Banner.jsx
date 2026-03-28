// Banner.jsx
import React from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    CircularProgress,
    styled,
} from '@mui/material';
import { CCarousel, CCarouselItem } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';
import PetsIcon from '@mui/icons-material/Pets';

// Theme colors
const primaryColor = '#ff6b6b';
const iconColor = '#db89ca';

// Styled components
const BannerWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
}));

const SlideContainer = styled(Box)({
    position: 'relative',
    width: '100%',
    height: '600px',
    '@media (max-width: 900px)': {
        height: '500px',
    },
    '@media (max-width: 600px)': {
        height: '300px',
    },
});

const SlideImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const Overlay = styled(Box)({
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)',
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 600px)': {
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '20px',
    },
});

const ContentWrapper = styled(motion.div)({
    maxWidth: '600px',
    textAlign: 'left',
    '@media (max-width: 600px)': {
        textAlign: 'center',
        margin: '0 auto',
        maxWidth: '100%',
        padding: '0 20px',
    },
});

const SectionTitleWrapper = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
    '@media (max-width: 600px)': {
        justifyContent: 'center',
        marginBottom: '10px',
    },
});

const SectionTitle = styled(Typography)({
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '1px',
    color: '#666',
    textTransform: 'uppercase',
    '@media (max-width: 600px)': {
        fontSize: '12px',
    },
});

const SectionIcon = styled(Box)({
    width: 30,
    height: 30,
    borderRadius: '50%',
    backgroundColor: '#db89ca',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '@media (max-width: 600px)': {
        width: 25,
        height: 25,
    },
});

const SlideTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: '#fff',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    fontSize: '48px',
    lineHeight: 1.2,
    [theme.breakpoints.down('md')]: {
        fontSize: '42px',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '28px',
        textAlign: 'center',
        marginBottom: '15px',
    },
}));

const SlideDescription = styled(Typography)(({ theme }) => ({
    color: '#fff',
    marginBottom: '30px',
    fontSize: '16px',
    lineHeight: 1.7,
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
    maxWidth: '550px',
    [theme.breakpoints.down('md')]: {
        fontSize: '15px',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        textAlign: 'center',
        marginBottom: '20px',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '90%',
    },
}));

const OrderButton = styled(Button)(({ theme }) => ({
    backgroundColor: primaryColor,
    color: '#fff',
    borderRadius: '25px',
    fontWeight: 500,
    padding: '10px 28px',
    fontSize: '14px',
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(255,107,107,0.3)',
    '&:hover': {
        backgroundColor: '#ff5252',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(255,107,107,0.4)',
    },
    [theme.breakpoints.down('md')]: {
        padding: '9px 24px',
        fontSize: '13px',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '8px 20px',
        fontSize: '12px',
        display: 'block',
        margin: '0 auto',
        width: 'fit-content',
    },
}));

const LoadingContainer = styled(Box)({
    width: '100%',
    height: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    '@media (max-width: 900px)': {
        height: '500px',
    },
    '@media (max-width: 600px)': {
        height: '400px',
    },
});

const ErrorContainer = styled(Box)({
    width: '100%',
    height: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    '@media (max-width: 900px)': {
        height: '500px',
    },
    '@media (max-width: 600px)': {
        height: '400px',
    },
});

// Animation variants
const badgeVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const titleVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const descriptionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, delay: 0.2, ease: "easeOut" }
    }
};

const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay: 0.4, ease: "easeOut" }
    }
};

const Banner = () => {
    // Fetch banner data from API
    const { data, isLoading, error } = useQuery({
        queryKey: ['banner'],
        queryFn: async () => {
            const response = await axiosInstance.get('/carousel');
            return response.data;
        },
    });

    // Process API data - only if data exists
    const slides = data?.data || [];

    if (isLoading) {
        return (
            <BannerWrapper>
                <Container maxWidth="xl" fixed>
                    <LoadingContainer>
                        <CircularProgress sx={{ color: primaryColor }} />
                    </LoadingContainer>
                </Container>
            </BannerWrapper>
        );
    }

    if (error || !slides.length) {
        return (
            <BannerWrapper>
                <Container maxWidth="xl" fixed>
                    <ErrorContainer>
                        <Typography variant="h6" color="textSecondary">
                            No banner slides available
                        </Typography>
                    </ErrorContainer>
                </Container>
            </BannerWrapper>
        );
    }

    return (
        <BannerWrapper>
            <CCarousel
                indicators
                transition="crossfade"
                controls={false}
                interval={5000}
                wrap={true}
            >
                {slides.map((slide) => (
                    <CCarouselItem key={slide._id}>
                        <SlideContainer>
                            <SlideImage
                                src={slide.image}
                                alt={slide.smallTitle || slide.title || 'Banner slide'}
                            />
                            <Overlay>
                                <Container maxWidth="lg" fixed>
                                    <ContentWrapper
                                        initial="hidden"
                                        animate="visible"
                                        variants={{
                                            visible: {
                                                transition: { staggerChildren: 0.2 }
                                            }
                                        }}
                                    >
                                        <motion.div variants={badgeVariants}>
                                            <SectionTitleWrapper>
                                                <SectionIcon>
                                                    <PetsIcon sx={{ color: '#fff', fontSize: { xs: 16, sm: 18 } }} />
                                                </SectionIcon>
                                                <SectionTitle sx={{ color: '#fff' }}>Our Passion is Animals</SectionTitle>
                                            </SectionTitleWrapper>
                                        </motion.div>

                                        <motion.div variants={titleVariants}>
                                            <SlideTitle variant="h3">
                                                {slide.title || slide.smallTitle}
                                            </SlideTitle>
                                        </motion.div>

                                        <motion.div variants={descriptionVariants}>
                                            <SlideDescription variant="body1">
                                                {slide.paragraph || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'}
                                            </SlideDescription>
                                        </motion.div>

                                        <motion.div variants={buttonVariants}>
                                            <OrderButton
                                                variant="contained"
                                                href={slide.btnLink || '#'}
                                                size="large"
                                            >
                                                {slide.btnText || 'Learn More'}
                                            </OrderButton>
                                        </motion.div>
                                    </ContentWrapper>
                                </Container>
                            </Overlay>
                        </SlideContainer>
                    </CCarouselItem>
                ))}
            </CCarousel>
        </BannerWrapper>
    );
};

export default Banner;