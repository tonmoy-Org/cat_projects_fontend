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
import logo from '../public/logo-1.png';

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
        height: '3px',
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
    padding: '50px 0 40px',
    position: 'relative',
    '@media (max-width: 600px)': {
        padding: '40px 0 25px',
    },
});

const FooterLogo = styled('img')({
    maxWidth: '140px',
    marginBottom: '16px',
    marginTop: '-3px',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.03)',
    },
    '@media (max-width: 600px)': {
        maxWidth: '120px',
        marginBottom: '12px',
    },
});

const FooterText = styled(Typography)({
    color: textColor,
    fontSize: '13px',
    lineHeight: 1.6,
    marginBottom: '20px',
    opacity: 0.85,
    maxWidth: '280px',
    '@media (max-width: 900px)': {
        maxWidth: '100%',
    },
    '@media (max-width: 600px)': {
        fontSize: '12px',
        marginBottom: '16px',
    },
});

const SocialIcons = styled(Box)({
    display: 'flex',
    gap: '10px',
});

const SocialIcon = styled(IconButton)({
    color: textColor,
    backgroundColor: 'rgba(255,255,255,0.05)',
    width: '36px',
    height: '36px',
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
        transform: 'translateY(-3px)',
        '&::before': {
            width: '100%',
            height: '100%',
        },
    },
    '& svg': {
        fontSize: '16px',
        position: 'relative',
        zIndex: 1,
    },
    '@media (max-width: 600px)': {
        width: '34px',
        height: '34px',
        '& svg': {
            fontSize: '14px',
        },
    },
});

const FooterTitle = styled(Typography)({
    color: lightText,
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '20px',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-8px',
        left: '0',
        width: '35px',
        height: '2px',
        backgroundColor: PRIMARY_COLOR,
        borderRadius: '2px',
        transition: 'width 0.3s ease',
    },
    '&:hover::after': {
        width: '55px',
    },
    '@media (max-width: 600px)': {
        fontSize: '16px',
        marginBottom: '16px',
        textAlign: 'center',
        '&::after': {
            left: '50%',
            transform: 'translateX(-50%)',
        },
    },
});

const ContactInfo = styled(Box)({
    '& .contact-item': {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px',
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'translateX(4px)',
        },
        '& svg': {
            color: PRIMARY_COLOR,
            fontSize: '16px',
            minWidth: '18px',
        },
        '& a, & span': {
            color: textColor,
            textDecoration: 'none',
            fontSize: '13px',
            lineHeight: 1.5,
            transition: 'color 0.3s ease',
            '&:hover': {
                color: PRIMARY_COLOR,
            },
        },
    },
    '@media (max-width: 600px)': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& .contact-item': {
            width: 'fit-content',
            marginBottom: '10px',
            '& a, & span': {
                fontSize: '12px',
            },
            '& svg': {
                fontSize: '14px',
            },
        },
    },
});

const NewsletterForm = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    marginTop: '16px',
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
            padding: '12px 18px',
            fontSize: '13px',
            '&::placeholder': {
                color: 'rgba(255,255,255,0.4)',
                opacity: 1,
            },
        },
    },
    '@media (max-width: 600px)': {
        marginTop: '12px',
        '& .MuiOutlinedInput-root input': {
            padding: '10px 16px',
            fontSize: '12px',
        },
    },
});

const SubscribeButton = styled(IconButton)({
    backgroundColor: PRIMARY_COLOR,
    color: lightText,
    width: '42px',
    height: '42px',
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
        transform: 'scale(1.05)',
        '&::before': {
            width: '100%',
            height: '100%',
        },
    },
    '& svg': {
        fontSize: '18px',
        position: 'relative',
        zIndex: 1,
        transition: 'transform 0.3s ease',
    },
    '&:hover svg': {
        transform: 'translateX(2px)',
    },
    '@media (max-width: 600px)': {
        width: '38px',
        height: '38px',
        '& svg': {
            fontSize: '16px',
        },
    },
});

const Divider = styled(Box)({
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
    width: '100%',
    margin: '0 auto',
});

const BottomSection = styled(Box)({
    padding: '20px 0',
    '@media (max-width: 600px)': {
        padding: '16px 0',
    },
});

const FooterLinks = styled(Box)({
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
    '@media (max-width: 900px)': {
        gap: '20px',
    },
    '@media (max-width: 600px)': {
        justifyContent: 'center',
        gap: '16px',
    },
});

const FooterLink = styled(Link)({
    color: textColor,
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    position: 'relative',
    padding: '3px 0',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '50%',
        width: '0',
        height: '1.5px',
        backgroundColor: PRIMARY_COLOR,
        transition: 'all 0.3s ease',
        transform: 'translateX(-50%)',
    },
    '&:hover': {
        color: PRIMARY_COLOR,
        transform: 'translateY(-1px)',
        '&::after': {
            width: '100%',
        },
    },
    '@media (max-width: 600px)': {
        fontSize: '12px',
    },
});

const PolicyLinks = styled(Box)({
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '12px',
    '@media (max-width: 600px)': {
        gap: '15px',
        marginBottom: '10px',
    },
});

const PolicyLink = styled(Link)({
    color: textColor,
    textDecoration: 'none',
    fontSize: '12px',
    transition: 'color 0.3s ease',
    position: 'relative',
    '&:hover': {
        color: PRIMARY_COLOR,
    },
    '@media (max-width: 600px)': {
        fontSize: '11px',
    },
});

const CopyrightText = styled(Typography)({
    color: textColor,
    fontSize: '12px',
    textAlign: 'right',
    opacity: 0.7,
    '@media (max-width: 900px)': {
        textAlign: 'center',
        marginTop: '16px',
    },
    '@media (max-width: 600px)': {
        fontSize: '11px',
        marginTop: '12px',
    },
    '& a': {
        color: PRIMARY_COLOR,
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'opacity 0.3s ease',
        '&:hover': {
            opacity: 0.8,
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
        console.log('Newsletter subscription');
    };

    // Policy and legal links
    const policyLinks = [
        { label: 'Privacy Policy', path: '/privacy-policy' },
        { label: 'Cookie Policy', path: '/cookie-policy' },
    ];

    return (
        <FooterWrapper>
            {/* Top Section */}
            <TopSection>
                <Container maxWidth="lg">
                    <Grid container spacing={isMobile ? 4 : 5}>
                        {/* Logo and Social Section */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{
                                textAlign: { xs: 'center', md: 'left' },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: { xs: 'center', md: 'flex-start' },
                            }}>
                                <FooterLogo src={logo} alt="Logo" />
                                <FooterText>
                                    Premium cat products and accessories for your feline friends. Quality and comfort guaranteed.
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
                                            0665 Broadway St.
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
                                        <Link href="mailto:hello@fatherofmeow.com">hello@fatherofmeow.com</Link>
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
                                    Get the latest updates on new products and exclusive offers.
                                </FooterText>
                                <NewsletterForm onSubmit={handleSubmit}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <TextField
                                            placeholder="Your email address"
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
                    {/* Policy Links Row */}
                    <Grid container alignItems="center">
                        <Grid size={{ xs: 12, lg: 7 }}>
                            <FooterLinks>
                                <FooterLink href="/">Home</FooterLink>
                                <FooterLink href="/about">About</FooterLink>
                                <FooterLink href="/cats">Cats</FooterLink>
                                <FooterLink href="/shop">Product</FooterLink>
                                <FooterLink href="/blog">Blog</FooterLink>
                                <FooterLink href="/videos">Video</FooterLink>
                                <FooterLink href="/contact">Contact</FooterLink>
                                <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                                <FooterLink href="/cookie-policy">Cookie Policy</FooterLink>
                            </FooterLinks>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 5 }}>
                            <CopyrightText>
                                Copyright © {currentYear} | All rights reserved by{' '}
                                <Link
                                    href="https://fatherofmeow.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ textDecoration: 'none' }}
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