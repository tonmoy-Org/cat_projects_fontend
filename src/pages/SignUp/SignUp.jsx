// SignUp.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import {
    Box,
    Paper,
    Typography,
    Alert,
    CircularProgress,
    Container,
    alpha,
    useTheme,
    InputAdornment,
    IconButton,
    Zoom,
    Fade,
} from '@mui/material';
import GradientButton from '../../components/ui/GradientButton';
import StyledTextField from '../../components/ui/StyledTextField';

export const SignUp = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [touchedFields, setTouchedFields] = useState({});
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: '',
        requirements: {
            length: false,
            uppercase: false,
            number: false,
            special: false,
        },
    });

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'name':
                if (!value.trim()) {
                    newErrors.name = 'Name is required';
                } else if (value.trim().length < 2) {
                    newErrors.name = 'Name must be at least 2 characters';
                } else {
                    delete newErrors.name;
                }
                break;

            case 'email':
                if (!value) {
                    newErrors.email = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newErrors.email = 'Please enter a valid email address';
                } else {
                    delete newErrors.email;
                }
                break;

            case 'password':
                if (!value) {
                    newErrors.password = 'Password is required';
                } else if (value.length < 6) {
                    newErrors.password = 'Password must be at least 6 characters';
                } else {
                    delete newErrors.password;
                }
                checkPasswordStrength(value);
                break;

            case 'confirmPassword':
                if (!value) {
                    newErrors.confirmPassword = 'Please confirm your password';
                } else if (value !== formData.password) {
                    newErrors.confirmPassword = 'Passwords do not match';
                } else {
                    delete newErrors.confirmPassword;
                }
                break;

            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouchedFields(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Real-time validation for password fields
        if (name === 'password' || name === 'confirmPassword') {
            if (touchedFields[name]) {
                validateField(name, value);
            }
            if (name === 'password' && formData.confirmPassword && touchedFields.confirmPassword) {
                validateField('confirmPassword', formData.confirmPassword);
            }
        }
    };

    const checkPasswordStrength = (password) => {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        };

        const score = Object.values(requirements).filter(Boolean).length;

        let message = '';
        if (password.length === 0) message = '';
        else if (score < 2) message = 'Weak password';
        else if (score < 3) message = 'Fair password';
        else if (score < 4) message = 'Good password';
        else message = 'Strong password';

        setPasswordStrength({ score, message, requirements });
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength.score < 2) return theme.palette.error.main;
        if (passwordStrength.score < 3) return theme.palette.warning.main;
        if (passwordStrength.score < 4) return theme.palette.info.main;
        return theme.palette.success.main;
    };

    const getPasswordStrengthWidth = () => {
        return `${(passwordStrength.score / 4) * 100}%`;
    };

    const validateForm = () => {
        // Validate all fields
        Object.keys(formData).forEach(key => {
            validateField(key, formData[key]);
        });

        return Object.keys(errors).length === 0 &&
            formData.name &&
            formData.email &&
            formData.password &&
            formData.confirmPassword;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setSuccess('');

        // Mark all fields as touched
        const allTouched = {};
        Object.keys(formData).forEach(key => {
            allTouched[key] = true;
        });
        setTouchedFields(allTouched);

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await signup(formData.email, formData.password, formData.name);

            setSuccess('Account created successfully! Redirecting to login...');

            // Clear form
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setApiError(err.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                py: 4,
                background: theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${alpha('#1a1a1a', 0.95)} 0%, ${alpha('#2d2d2d', 0.95)} 100%)`
                    : `linear-gradient(135deg, ${alpha('#667eea', 0.05)} 0%, ${alpha('#764ba2', 0.05)} 100%)`,
            }}
        >
            <Container maxWidth="xs">
                <Fade in={true} timeout={500}>
                    <Paper
                        elevation={theme.palette.mode === 'dark' ? 3 : 1}
                        sx={{
                            p: { xs: 2, md: 4 },
                            borderRadius: 0.5,
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 10px 40px rgba(0, 0, 0, 0.3)'
                                : '0 10px 40px rgba(0, 0, 0, 0.08)',
                            border: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.paper,
                        }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 0.5,
                                    fontSize: '1.5rem',
                                }}
                            >
                                Father Of Meow
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create your account to get started
                            </Typography>
                        </Box>

                        {apiError && (
                            <Zoom in={true}>
                                <Alert
                                    severity="error"
                                    icon={<AlertCircle size={20} />}
                                    sx={{
                                        mb: 3,
                                        borderRadius: 1,
                                        '& .MuiAlert-icon': {
                                            color: theme.palette.error.main,
                                        },
                                    }}
                                    onClose={() => setApiError('')}
                                >
                                    {apiError}
                                </Alert>
                            </Zoom>
                        )}

                        {success && (
                            <Zoom in={true}>
                                <Alert
                                    severity="success"
                                    icon={<CheckCircle size={20} />}
                                    sx={{
                                        mb: 3,
                                        borderRadius: 1,
                                        '& .MuiAlert-icon': {
                                            color: theme.palette.success.main,
                                        },
                                    }}
                                >
                                    {success}
                                </Alert>
                            </Zoom>
                        )}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <Box sx={{ mb: 2 }}>
                                <StyledTextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your full name"
                                    required
                                    error={touchedFields.name && !!errors.name}
                                    helperText={touchedFields.name && errors.name}
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            transition: 'all 0.2s ease',
                                        },
                                    }}
                                />
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <StyledTextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your email"
                                    required
                                    error={touchedFields.email && !!errors.email}
                                    helperText={touchedFields.email && errors.email}
                                    size="small"
                                />
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <StyledTextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Create a password"
                                    required
                                    error={touchedFields.password && !!errors.password}
                                    helperText={touchedFields.password && errors.password}
                                    size="small"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    size="small"
                                                    sx={{
                                                        color: theme.palette.text.secondary,
                                                        '&:hover': {
                                                            color: theme.palette.primary.main,
                                                        },
                                                    }}
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {formData.password && (
                                    <Fade in={true}>
                                        <Box sx={{ mt: 1.5, mb: 0.5 }}>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 0.5,
                                            }}>
                                                <Typography variant="caption" sx={{
                                                    color: getPasswordStrengthColor(),
                                                    fontWeight: 600,
                                                }}>
                                                    {passwordStrength.message}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {passwordStrength.score}/4
                                                </Typography>
                                            </Box>

                                            <Box sx={{
                                                height: 4,
                                                width: '100%',
                                                backgroundColor: alpha(theme.palette.text.primary, 0.1),
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                            }}>
                                                <Box
                                                    sx={{
                                                        height: '100%',
                                                        width: getPasswordStrengthWidth(),
                                                        backgroundColor: getPasswordStrengthColor(),
                                                        borderRadius: 2,
                                                        transition: 'width 0.3s ease, background-color 0.3s ease',
                                                    }}
                                                />
                                            </Box>

                                            <Box sx={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(2, 1fr)',
                                                gap: 1,
                                                mt: 1.5,
                                            }}>
                                                {Object.entries(passwordStrength.requirements).map(([key, met]) => (
                                                    <Box
                                                        key={key}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: 6,
                                                                height: 6,
                                                                borderRadius: '50%',
                                                                backgroundColor: met
                                                                    ? theme.palette.success.main
                                                                    : alpha(theme.palette.text.primary, 0.2),
                                                                transition: 'background-color 0.2s ease',
                                                            }}
                                                        />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {key === 'length' && '8+ characters'}
                                                            {key === 'uppercase' && 'Uppercase'}
                                                            {key === 'number' && 'Number'}
                                                            {key === 'special' && 'Special char'}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    </Fade>
                                )}
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <StyledTextField
                                    fullWidth
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Confirm your password"
                                    required
                                    error={touchedFields.confirmPassword && !!errors.confirmPassword}
                                    helperText={touchedFields.confirmPassword && errors.confirmPassword}
                                    size="small"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                    size="small"
                                                    sx={{
                                                        color: theme.palette.text.secondary,
                                                        '&:hover': {
                                                            color: theme.palette.primary.main,
                                                        },
                                                    }}
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <GradientButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CircularProgress size={20} sx={{ color: 'white' }} />
                                        <Typography sx={{ color: 'white' }}>
                                            Creating account...
                                        </Typography>
                                    </Box>
                                ) : (
                                    'Create Account'
                                )}
                            </GradientButton>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 0.5,
                                my: 3,
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?
                                </Typography>
                                <Link
                                    to="/login"
                                    style={{
                                        textDecoration: 'none',
                                        color: theme.palette.primary.main,
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    Sign In
                                </Link>
                            </Box>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                align="center"
                                sx={{
                                    display: 'block',
                                    mt: 2,
                                }}
                            >
                                By creating an account, you agree to our{' '}
                                <Link
                                    to="/terms"
                                    style={{
                                        color: theme.palette.primary.main,
                                        textDecoration: 'none',
                                    }}
                                >
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link
                                    to="/privacy"
                                    style={{
                                        color: theme.palette.primary.main,
                                        textDecoration: 'none',
                                    }}
                                >
                                    Privacy Policy
                                </Link>
                            </Typography>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};