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

// Styled components with consistent font sizes
const BannerWrapper = styled(Box)({
    width: '100%',
});

const SlideContainer = styled(Box)({
    position: 'relative',
    width: '100%',
    height: '600px',
    '@media (max-width: 900px)': {
        height: '500px',
    },
    '@media (max-width: 600px)': {
        height: '420px',
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
    background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 100%)',
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 600px)': {
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 30%, rgba(0,0,0,0.4) 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '30px',
    },
});

const ContentWrapper = styled(motion.div)({
    maxWidth: '620px',
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
        marginBottom: '12px',
    },
});

const SectionTitle = styled(Typography)({
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '1px',
    color: '#fff',
    textTransform: 'uppercase',
    '@media (max-width: 600px)': {
        fontSize: '10px',
    },
});

const SectionIcon = styled(Box)({
    width: 30,
    height: 30,
    borderRadius: '50%',
    backgroundColor: iconColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '@media (max-width: 600px)': {
        width: 26,
        height: 26,
    },
});

const SlideTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: '#fff',
    marginBottom: '22px',
    textShadow: '2px 2px 6px rgba(0,0,0,0.4)',
    fontSize: '35px',
    lineHeight: 1.2,
    [theme.breakpoints.down('md')]: {
        fontSize: '38px',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '32px',
        textAlign: 'center',
        marginBottom: '18px',
    },
}));

const SlideDescription = styled(Typography)(({ theme }) => ({
    color: '#fff',
    marginBottom: '32px',
    fontSize: '16px',
    lineHeight: 1.6,
    textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
    maxWidth: '520px',
    [theme.breakpoints.down('md')]: {
        fontSize: '15px',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '90%',
        marginBottom: '28px',
    },
}));

const OrderButton = styled(Button)(({ theme }) => ({
    backgroundColor: primaryColor,
    color: '#fff',
    borderRadius: '30px',
    fontWeight: 600,
    padding: '10px 32px',
    fontSize: '14px',
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(255,107,107,0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: '#ff5252',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(255,107,107,0.4)',
    },
    [theme.breakpoints.down('md')]: {
        padding: '8px 28px',
        fontSize: '13px',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '8px 28px',
        fontSize: '13px',
        display: 'inline-block',
    },
}));

const LoadingContainer = styled(Box)({
    width: '100%',
    height: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    '@media (max-width: 900px)': { height: '500px' },
    '@media (max-width: 600px)': { height: '420px' },
});

const ErrorContainer = styled(Box)({
    width: '100%',
    height: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    '@media (max-width: 900px)': { height: '500px' },
    '@media (max-width: 600px)': { height: '420px' },
});

// Animation variants
const badgeVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const titleVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

const descriptionVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.15 } }
};

const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.35 } }
};

const Banner = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['banner'],
        queryFn: async () => {
            const response = await axiosInstance.get('/carousel');
            return response.data;
        },
    });

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
                                alt={slide.title || 'Banner'}
                            />
                            <Overlay>
                                <Container maxWidth="lg" fixed>
                                    <ContentWrapper
                                        initial="hidden"
                                        animate="visible"
                                        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
                                    >
                                        <motion.div variants={badgeVariants}>
                                            <SectionTitleWrapper>
                                                <SectionIcon>
                                                    <PetsIcon sx={{ color: '#fff', fontSize: 18 }} />
                                                </SectionIcon>
                                                <SectionTitle>Our Passion is Animals</SectionTitle>
                                            </SectionTitleWrapper>
                                        </motion.div>

                                        <motion.div variants={titleVariants}>
                                            <SlideTitle>
                                                {slide.title || slide.smallTitle}
                                            </SlideTitle>
                                        </motion.div>

                                        <motion.div variants={descriptionVariants}>
                                            <SlideDescription>
                                                {slide.paragraph || 'Discover our wide range of premium pet products and find the perfect companion for your furry friend.'}
                                            </SlideDescription>
                                        </motion.div>

                                        <motion.div variants={buttonVariants}>
                                            <OrderButton
                                                variant="contained"
                                                href={slide.btnLink || '#'}
                                            >
                                                {slide.btnText || 'Shop Now'}
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