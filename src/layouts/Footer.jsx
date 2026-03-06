// Footer.jsx
import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    styled,
    IconButton,
    Link,
    TextField,
    InputAdornment,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import logo from '../public/logo-1.png'

// Theme colors
const PRIMARY_COLOR = '#5C4D91';
const PRIMARY_DARK = '#4A3D75';
const PRIMARY_LIGHT = '#7A6DB0';
const textColor = '#999';
const lightText = '#fff';
const darkBg = '#0f0f0f';

const FooterWrapper = styled(Box)({
    backgroundColor: darkBg,
    color: textColor,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${PRIMARY_LIGHT}, ${PRIMARY_COLOR})`,
        animation: 'gradientShift 3s ease infinite',
    },
    '@keyframes gradientShift': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
    },
});

const TopSection = styled(Box)({
    padding: '70px 0 50px',
    position: 'relative',
    '@media (max-width: 600px)': {
        padding: '50px 0 30px',
    },
});

const FooterLogo = styled('img')({
    maxWidth: '160px',
    marginBottom: '20px',
    marginTop: '-5px', // Moved logo 5px up
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
    },
    '@media (max-width: 600px)': {
        maxWidth: '140px',
        marginTop: '-3px', // Slightly less on mobile
    },
});

const FooterText = styled(Typography)({
    color: textColor,
    fontSize: '14px',
    lineHeight: 1.8,
    marginBottom: '25px',
    opacity: 0.9,
    maxWidth: '300px',
    '@media (max-width: 900px)': {
        maxWidth: '100%',
    },
});

const SocialIcons = styled(Box)({
    display: 'flex',
    gap: '12px',
});

const SocialIcon = styled(IconButton)({
    color: textColor,
    backgroundColor: 'rgba(255,255,255,0.05)',
    width: '42px',
    height: '42px',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '0',
        height: '0',
        borderRadius: '50%',
        backgroundColor: PRIMARY_COLOR,
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.4s ease',
        zIndex: 0,
    },
    '&:hover': {
        transform: 'translateY(-5px)',
        '&::before': {
            width: '100%',
            height: '100%',
        },
    },
    '& svg': {
        fontSize: '18px',
        position: 'relative',
        zIndex: 1,
    },
    '@media (max-width: 600px)': {
        width: '38px',
        height: '38px',
        '& svg': {
            fontSize: '16px',
        },
    },
});

const FooterTitle = styled(Typography)({
    color: lightText,
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '25px',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-10px',
        left: '0',
        width: '40px',
        height: '3px',
        backgroundColor: PRIMARY_COLOR,
        borderRadius: '2px',
        transition: 'width 0.3s ease',
    },
    '&:hover::after': {
        width: '60px',
    },
    '@media (max-width: 600px)': {
        fontSize: '18px',
        marginBottom: '20px',
    },
});

const ContactInfo = styled(Box)({
    '& .contact-item': {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '15px',
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'translateX(5px)',
        },
        '& svg': {
            color: PRIMARY_COLOR,
            fontSize: '18px',
            minWidth: '20px',
        },
        '& a, & span': {
            color: textColor,
            textDecoration: 'none',
            fontSize: '14px',
            lineHeight: 1.6,
            transition: 'color 0.3s ease',
            '&:hover': {
                color: PRIMARY_COLOR,
            },
        },
    },
});

const NewsletterForm = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
    '& .MuiTextField-root': {
        width: '100%',
    },
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: '50px',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.06)',
        },
        '& fieldset': {
            borderColor: 'rgba(255,255,255,0.1)',
            transition: 'border-color 0.3s ease',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255,255,255,0.2)',
        },
        '&.Mui-focused fieldset': {
            borderColor: PRIMARY_COLOR,
            borderWidth: '2px',
        },
        '& input': {
            color: lightText,
            padding: '14px 20px',
            fontSize: '14px',
            '&::placeholder': {
                color: 'rgba(255,255,255,0.4)',
                opacity: 1,
            },
        },
    },
});

const SubscribeButton = styled(IconButton)({
    backgroundColor: PRIMARY_COLOR,
    color: lightText,
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    marginLeft: '10px',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '0',
        height: '0',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.6s ease, height 0.6s ease',
    },
    '&:hover': {
        backgroundColor: PRIMARY_DARK,
        transform: 'scale(1.1)',
        '&::before': {
            width: '100%',
            height: '100%',
        },
    },
    '& svg': {
        fontSize: '20px',
        position: 'relative',
        zIndex: 1,
        transition: 'transform 0.3s ease',
    },
    '&:hover svg': {
        transform: 'translateX(3px)',
    },
    '@media (max-width: 600px)': {
        width: '44px',
        height: '44px',
        '& svg': {
            fontSize: '18px',
        },
    },
});

const Divider = styled(Box)({
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    width: '100%',
    margin: '0 auto',
});

const BottomSection = styled(Box)({
    padding: '25px 0',
    '@media (max-width: 600px)': {
        padding: '20px 0',
    },
});

const FooterLinks = styled(Box)({
    display: 'flex',
    gap: '35px',
    flexWrap: 'wrap',
    '@media (max-width: 900px)': {
        gap: '25px',
    },
    '@media (max-width: 600px)': {
        justifyContent: 'center',
        gap: '20px',
    },
});

const FooterLink = styled(Link)({
    color: textColor,
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    position: 'relative',
    padding: '5px 0',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '50%',
        width: '0',
        height: '2px',
        backgroundColor: PRIMARY_COLOR,
        transition: 'all 0.3s ease',
        transform: 'translateX(-50%)',
    },
    '&:hover': {
        color: PRIMARY_COLOR,
        transform: 'translateY(-2px)',
        '&::after': {
            width: '100%',
        },
    },
});

const CopyrightText = styled(Typography)({
    color: textColor,
    fontSize: '14px',
    textAlign: 'right',
    opacity: 0.8,
    '@media (max-width: 900px)': {
        textAlign: 'center',
        marginTop: '20px',
    },
    '& a': {
        color: PRIMARY_COLOR,
        textDecoration: 'none',
        fontWeight: 500,
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-2px',
            left: '0',
            width: '0',
            height: '1px',
            backgroundColor: PRIMARY_COLOR,
            transition: 'width 0.3s ease',
        },
        '&:hover::after': {
            width: '100%',
        },
    },
});

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle newsletter subscription
        console.log('Newsletter subscription');
    };

    return (
        <FooterWrapper>
            {/* Top Section */}
            <TopSection>
                <Container maxWidth="lg">
                    <Grid container spacing={isMobile ? 4 : 6}>
                        {/* Logo and Social Section */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{
                                textAlign: { xs: 'center', md: 'left' },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: { xs: 'center', md: 'flex-start' },
                            }}>
                                <FooterLogo
                                    src={logo}
                                    alt="Logo"
                                />
                                <FooterText>
                                    Lorem ipsum is simply dummy text of the printe and type setting industry in the fermen.
                                </FooterText>
                                <SocialIcons>
                                    <SocialIcon aria-label="Instagram">
                                        <InstagramIcon />
                                    </SocialIcon>
                                    <SocialIcon aria-label="Twitter">
                                        <TwitterIcon />
                                    </SocialIcon>
                                    <SocialIcon aria-label="Facebook">
                                        <FacebookIcon />
                                    </SocialIcon>
                                </SocialIcons>
                            </Box>
                        </Grid>

                        {/* Contact Section */}
                        <Grid size={{ xs: 12, sm: 6, md: 3, offset: isTablet ? 0 : 1 }}>
                            <Box sx={{
                                textAlign: { xs: 'center', sm: 'left' },
                            }}>
                                <FooterTitle>Contact</FooterTitle>
                                <ContactInfo>
                                    <Box className="contact-item">
                                        <LocationOnIcon />
                                        <span>
                                            0665 Broadway st.
                                            <br />
                                            10234 NY, USA
                                        </span>
                                    </Box>
                                    <Box className="contact-item">
                                        <PhoneIcon />
                                        <Link href="tel:+1234567890">+123 456 7890</Link>
                                    </Box>
                                    <Box className="contact-item">
                                        <EmailIcon />
                                        <Link href="mailto:hello@Pepito.com">hello@Pepito.com</Link>
                                    </Box>
                                </ContactInfo>
                            </Box>
                        </Grid>

                        {/* Subscribe Section */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{
                                textAlign: { xs: 'center', sm: 'left' },
                            }}>
                                <FooterTitle>Subscribe</FooterTitle>
                                <FooterText sx={{ maxWidth: '100%' }}>
                                    Want to be notified about our services. Just sign up and we'll send you a notification by email.
                                </FooterText>
                                <NewsletterForm onSubmit={handleSubmit}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <TextField
                                            placeholder="Email Address"
                                            type="email"
                                            required
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                        />
                                        <SubscribeButton type="submit" aria-label="Subscribe">
                                            <ArrowForwardIcon />
                                        </SubscribeButton>
                                    </Box>
                                </NewsletterForm>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </TopSection>

            {/* Divider */}
            <Container maxWidth="lg">
                <Grid container>
                    <Grid size={{ xs: 12 }}>
                        <Divider />
                    </Grid>
                </Grid>
            </Container>

            {/* Bottom Section */}
            <BottomSection>
                <Container maxWidth="lg">
                    <Grid container alignItems="center">
                        <Grid size={{ xs: 12, lg: 7 }}>
                            <FooterLinks>
                                <FooterLink href="/">Home</FooterLink>
                                <FooterLink href="/about">About</FooterLink>
                                <FooterLink href="/cats">Cats</FooterLink>
                                <FooterLink href="/product">Product</FooterLink>
                                <FooterLink href="/blog">Blog</FooterLink>
                                <FooterLink href="/video">Video</FooterLink>
                                <FooterLink href="/contact">Contact</FooterLink>
                            </FooterLinks>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 5 }}>
                            <CopyrightText>
                                Copyright © {currentYear} | All rights reserved by {' '}
                                <Link
                                    href="https://fatherofmeow.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Father Of Meow
                                </Link>
                            </CopyrightText>
                        </Grid>
                    </Grid>
                </Container>
            </BottomSection>
        </FooterWrapper>
    );
};

export default Footer;