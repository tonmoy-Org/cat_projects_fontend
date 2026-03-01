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
        <>
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
                        Modern FatherOfMeow
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
            </Container>
        </>
    );
};