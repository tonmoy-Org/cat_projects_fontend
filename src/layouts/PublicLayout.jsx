import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';
import GradientButton from '../components/ui/GradientButton';
import { Helmet } from 'react-helmet-async';

export const PublicLayout = ({ children, title, description }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const BLUE_COLOR = theme.palette.primary.main;
    const BLUE_DARK = theme.palette.primary.dark || theme.palette.primary.main;
    const TEXT_PRIMARY = theme.palette.text.primary;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${alpha('#1a1a1a', 1)} 0%, ${alpha('#2d2d2d', 1)} 100%)`
                    : `linear-gradient(135deg, ${alpha('#f8fafc', 1)} 0%, ${alpha('#f1f5f9', 1)} 100%)`,
            }}
        >
            {title && description && (
                <Helmet>
                    <title>{title} | FatherOfMeow</title>
                    <meta name="description" content={description} />
                </Helmet>
            )}

            {/* Navbar */}
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
                                cursor: 'pointer',
                            }}
                            onClick={() => navigate('/')}
                        >
                            FatherOfMeow
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

            {/* Main Content */}
            <Box sx={{ flex: 1 }}>
                {children}
            </Box>

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
                        © {new Date().getFullYear()} FatherOfMeow. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};