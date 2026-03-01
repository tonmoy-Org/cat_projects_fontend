import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    alpha,
    useTheme,
} from '@mui/material';
import {
    Security as SecurityIcon,
    Speed as SpeedIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    TrendingUp as TrendingUpIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import GradientButton from '../../components/ui/GradientButton';
import { Helmet } from 'react-helmet-async';

export const Home = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const BLUE_COLOR = theme.palette.primary.main;
    const BLUE_DARK = theme.palette.primary.dark || theme.palette.primary.main;
    const TEXT_PRIMARY = theme.palette.text.primary;

    const features = [
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: 'Secure & Reliable',
            description: 'Enterprise-grade security with role-based access control and data encryption.',
        },
        {
            icon: <SpeedIcon sx={{ fontSize: 40 }} />,
            title: 'Fast & Efficient',
            description: 'Streamlined workflows and real-time updates for maximum productivity.',
        },
        {
            icon: <DashboardIcon sx={{ fontSize: 40 }} />,
            title: 'Intuitive Dashboard',
            description: 'Clean, modern interface designed for ease of use and quick navigation.',
        },
        {
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            title: 'Multi-Role Support',
            description: 'Designed for administrators, members, and clients with tailored experiences.',
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
            title: 'Real-Time Tracking',
            description: 'Monitor and track all activities with comprehensive reporting tools.',
        },
        {
            icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
            title: 'Easy to Use',
            description: 'No technical expertise required. Get started in minutes.',
        },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${alpha('#1a1a1a', 1)} 0%, ${alpha('#2d2d2d', 1)} 100%)`
                    : `linear-gradient(135deg, ${alpha('#f8fafc', 1)} 0%, ${alpha('#f1f5f9', 1)} 100%)`,
            }}
        >
            <Helmet>
                <title>Home | Finance Dashboard</title>
                <meta name="description" content="Professional finance management system for tracking and managing your financial operations" />
            </Helmet>

            {/* Header/Navbar */}
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    py: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: '1.5rem',
                                background: `linear-gradient(135deg, ${BLUE_DARK} 0%, ${BLUE_COLOR} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Finance Dashboard
                        </Typography>
                        <GradientButton
                            variant="contained"
                            onClick={() => navigate('/login')}
                            size="small"
                            sx={{ fontSize: '0.85rem', py: 0.8, px: 2.5 }}
                        >
                            Sign In
                        </GradientButton>
                    </Box>
                </Container>
            </Box>

            {/* Hero Section */}
            <Container maxWidth="lg">
                <Box
                    sx={{
                        textAlign: 'center',
                        pt: { xs: 8, md: 12 },
                        pb: { xs: 6, md: 8 },
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: '2rem', md: '3rem' },
                            mb: 2,
                            background: `linear-gradient(135deg, ${BLUE_DARK} 0%, ${BLUE_COLOR} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            lineHeight: 1.2,
                        }}
                    >
                        Modern Finance Management
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 4,
                            color: TEXT_PRIMARY,
                            opacity: 0.8,
                            fontSize: { xs: '1rem', md: '1.25rem' },
                            maxWidth: '700px',
                            mx: 'auto',
                        }}
                    >
                        Streamline your financial operations with our comprehensive management system.
                        Track, manage, and analyze with confidence.
                    </Typography>
                    <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                        <GradientButton
                            variant="contained"
                            onClick={() => navigate('/login')}
                            size="large"
                            sx={{ fontSize: '0.95rem', py: 1.2, px: 4 }}
                        >
                            Get Started
                        </GradientButton>
                    </Box>
                </Box>

                {/* Features Section */}
                <Box sx={{ pb: { xs: 8, md: 12 } }}>
                    <Typography
                        sx={{
                            fontWeight: 600,
                            fontSize: { xs: '1.75rem', md: '2.25rem' },
                            mb: 1,
                            textAlign: 'center',
                            color: TEXT_PRIMARY,
                        }}
                    >
                        Why Choose Us?
                    </Typography>
                    <Typography
                        sx={{
                            mb: 6,
                            textAlign: 'center',
                            color: TEXT_PRIMARY,
                            opacity: 0.7,
                            fontSize: '0.95rem',
                        }}
                    >
                        Everything you need to manage your finances effectively
                    </Typography>

                    <Grid container spacing={3}>
                        {features.map((feature, index) => (
                            <Grid size={{ xs: 12, md: 6 }} key={index}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        borderRadius: 2,
                                        border: `1px solid ${theme.palette.divider}`,
                                        backgroundColor: theme.palette.background.paper,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: theme.palette.mode === 'dark'
                                                ? `0 8px 24px ${alpha(BLUE_COLOR, 0.15)}`
                                                : `0 8px 24px ${alpha(BLUE_COLOR, 0.1)}`,
                                            borderColor: alpha(BLUE_COLOR, 0.3),
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: `linear-gradient(135deg, ${alpha(BLUE_COLOR, 0.1)} 0%, ${alpha(BLUE_DARK, 0.1)} 100%)`,
                                                color: BLUE_COLOR,
                                                mb: 2,
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                fontSize: '1.1rem',
                                                color: TEXT_PRIMARY,
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: TEXT_PRIMARY,
                                                opacity: 0.7,
                                                fontSize: '0.9rem',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* CTA Section */}
                <Box
                    sx={{
                        textAlign: 'center',
                        pb: { xs: 8, md: 12 },
                    }}
                >
                    <Box
                        sx={{
                            background: `linear-gradient(135deg, ${alpha(BLUE_COLOR, 0.1)} 0%, ${alpha(BLUE_DARK, 0.05)} 100%)`,
                            borderRadius: 3,
                            p: { xs: 4, md: 6 },
                            border: `1px solid ${alpha(BLUE_COLOR, 0.2)}`,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 600,
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                mb: 2,
                                color: TEXT_PRIMARY,
                            }}
                        >
                            Ready to get started?
                        </Typography>
                        <Typography
                            sx={{
                                mb: 4,
                                color: TEXT_PRIMARY,
                                opacity: 0.7,
                                fontSize: '0.95rem',
                            }}
                        >
                            Sign in to access your dashboard and start managing your finances today.
                        </Typography>
                        <GradientButton
                            variant="contained"
                            onClick={() => navigate('/login')}
                            size="large"
                            sx={{ fontSize: '0.95rem', py: 1.2, px: 4 }}
                        >
                            Sign In Now
                        </GradientButton>
                    </Box>
                </Box>
            </Container>

            {/* Footer */}
            <Box
                sx={{
                    borderTop: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    py: 3,
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{
                            color: TEXT_PRIMARY,
                            opacity: 0.6,
                            fontSize: '0.85rem',
                        }}
                    >
                        © {new Date().getFullYear()} Finance Dashboard. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};
