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
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';

// Theme colors
const PRIMARY_COLOR = '#5C4D91';
const PRIMARY_DARK = '#4A3D75';
const textColor = '#999';
const lightText = '#fff';

const FooterWrapper = styled(Box)({
    backgroundColor: '#1a1a1a',
    color: textColor,
});

const TopSection = styled(Box)({
    padding: '60px 0',
});

const FooterLogo = styled('img')({
    maxWidth: '150px',
    marginBottom: '20px',
});

const FooterText = styled(Typography)({
    color: textColor,
    fontSize: '14px',
    lineHeight: 1.8,
    marginBottom: '20px',
});

const SocialIcons = styled(Box)({
    display: 'flex',
    gap: '15px',
});

const SocialIcon = styled(IconButton)({
    color: textColor,
    backgroundColor: 'rgba(255,255,255,0.05)',
    width: '40px',
    height: '40px',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: PRIMARY_COLOR,
        color: lightText,
        transform: 'translateY(-3px)',
    },
    '& svg': {
        fontSize: '18px',
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
    },
});

const ContactInfo = styled(Box)({
    '& .location': {
        color: textColor,
        fontSize: '14px',
        lineHeight: 1.8,
        marginBottom: '15px',
    },
    '& .phone, & .mail': {
        marginBottom: '10px',
        '& a': {
            color: textColor,
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.3s ease',
            '&:hover': {
                color: PRIMARY_COLOR,
            },
        },
    },
});

const NewsletterForm = styled('form')({
    display: 'flex',
    marginTop: '20px',
    '& .MuiTextField-root': {
        flex: 1,
    },
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '30px',
        '& fieldset': {
            borderColor: 'rgba(255,255,255,0.1)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255,255,255,0.2)',
        },
        '&.Mui-focused fieldset': {
            borderColor: PRIMARY_COLOR,
        },
        '& input': {
            color: lightText,
            padding: '12px 20px',
        },
    },
});

const SubscribeButton = styled(IconButton)({
    backgroundColor: PRIMARY_COLOR,
    color: lightText,
    width: '48px',
    height: '48px',
    marginLeft: '10px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: PRIMARY_DARK,
        transform: 'scale(1.05)',
    },
    '& svg': {
        fontSize: '20px',
    },
});

const Divider = styled(Box)({
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '100%',
    margin: '0 0 30px',
});

const BottomSection = styled(Box)({
    padding: '25px 0',
});

const FooterLinks = styled(Box)({
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
        justifyContent: 'center',
        gap: '20px',
    },
});

const FooterLink = styled(Link)({
    color: textColor,
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.3s ease',
    '&:hover': {
        color: PRIMARY_COLOR,
    },
});

const CopyrightText = styled(Typography)({
    color: textColor,
    fontSize: '14px',
    textAlign: 'right',
    '@media (max-width: 768px)': {
        textAlign: 'center',
        marginTop: '15px',
    },
    '& a': {
        color: PRIMARY_COLOR,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
});

const Footer = () => {
    const currentYear = new Date().getFullYear();

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
                    <Grid container spacing={4}>
                        {/* Logo and Social Section */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box className="item">
                                <FooterLogo
                                    src="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/04/logo-light.png"
                                    alt="Logo"
                                />
                                <FooterText className="mb-20">
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

                        {/* Contact Section - with offset */}
                        <Grid size={{ xs: 12, md: 3, offset: 1 }}>
                            <Box className="item">
                                <FooterTitle>Contact</FooterTitle>
                                <ContactInfo>
                                    <div className="location">
                                        0665 Broadway st.
                                        <br />
                                        10234 NY, USA
                                    </div>
                                    <div className="phone">
                                        <Link href="tel:+1234567890">+123 456 7890</Link>
                                    </div>
                                    <div className="mail">
                                        <Link href="mailto:hello@Pepito.com">hello@Pepito.com</Link>
                                    </div>
                                </ContactInfo>
                            </Box>
                        </Grid>

                        {/* Subscribe Section */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box className="item">
                                <FooterTitle>Subscribe</FooterTitle>
                                <FooterText className="mb-20">
                                    Want to be notified about our services. Just sign up and we'll send you a notification by email.
                                </FooterText>
                                <NewsletterForm onSubmit={handleSubmit}>
                                    <TextField
                                        placeholder="Email Address"
                                        type="email"
                                        required
                                        variant="outlined"
                                        size="small"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <SubscribeButton type="submit" aria-label="Subscribe">
                                                        <ArrowForwardIcon />
                                                    </SubscribeButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
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
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <FooterLinks>
                                <FooterLink href="/">Home</FooterLink>
                                <FooterLink href="/about">About</FooterLink>
                                <FooterLink href="/services">Services</FooterLink>
                                <FooterLink href="/adoption">Adoption</FooterLink>
                                <FooterLink href="/blog">Blog</FooterLink>
                                <FooterLink href="/contact">Contact</FooterLink>
                            </FooterLinks>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <CopyrightText>
                                Copyright © {currentYear} | Alright reserved by @{' '}
                                <Link
                                    href="https://themeforest.net/user/shtheme/portfolio"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: PRIMARY_COLOR, textDecoration: 'none' }}
                                >
                                    Shtheme
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