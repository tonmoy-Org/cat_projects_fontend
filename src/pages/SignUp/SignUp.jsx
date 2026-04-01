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
} from '@mui/material';
import GradientButton from '../../components/ui/GradientButton';
import StyledTextField from '../../components/ui/StyledTextField';

export const SignUp = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { register } = useAuth();

    // Use theme colors
    const BLUE_COLOR = theme.palette.primary.main;
    const RED_COLOR = theme.palette.error.main;
    const TEXT_PRIMARY = theme.palette.text.primary;

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

    // Password strength state
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Validate on change for better UX
        validateField(name, value);
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
        if (passwordStrength.score < 2) return RED_COLOR;
        if (passwordStrength.score < 3) return theme.palette.warning.main;
        if (passwordStrength.score < 4) return BLUE_COLOR;
        return theme.palette.success.main;
    };

    const validateForm = () => {
        // Validate all fields
        Object.keys(formData).forEach(key => validateField(key, formData[key]));
        
        return (
            Object.keys(errors).length === 0 &&
            formData.name.trim() &&
            formData.email &&
            formData.password &&
            formData.confirmPassword
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await register(formData.name, formData.email, formData.password);
            setSuccess('Account created successfully! Redirecting to login...');
            
            // Reset form
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            
            // Redirect after 2 seconds
            setTimeout(() => navigate('/login'), 2000);
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
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 4, sm: 6, md: 8 },
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: '3px',
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                mb: 0.5,
                                fontSize: '1.5rem',
                                color: TEXT_PRIMARY,
                            }}
                        >
                            Father Of Meow
                        </Typography>
                        <Typography sx={{ 
                            color: alpha(TEXT_PRIMARY, 0.7), 
                            fontSize: '0.9rem' 
                        }}>
                            Create your account to get started
                        </Typography>
                    </Box>

                    {apiError && (
                        <Alert
                            severity="error"
                            icon={<AlertCircle size={20} />}
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                backgroundColor: alpha(RED_COLOR, 0.08),
                                borderLeft: `4px solid ${RED_COLOR}`,
                                color: TEXT_PRIMARY,
                                '& .MuiAlert-icon': { color: RED_COLOR },
                            }}
                            onClose={() => setApiError('')}
                        >
                            {apiError}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            severity="success"
                            icon={<CheckCircle size={20} />}
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                backgroundColor: alpha(theme.palette.success.main, 0.08),
                                borderLeft: `4px solid ${theme.palette.success.main}`,
                                color: TEXT_PRIMARY,
                                '& .MuiAlert-icon': { color: theme.palette.success.main },
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <StyledTextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                            size="small"
                        />

                        <StyledTextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            error={!!errors.email}
                            helperText={errors.email}
                            size="small"
                            sx={{ my: 2 }}
                        />

                        <StyledTextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                            error={!!errors.password}
                            helperText={errors.password}
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <Box sx={{ mt: -1, mb: 1 }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    mb: 0.5 
                                }}>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: getPasswordStrengthColor(), 
                                            fontWeight: 500,
                                            fontSize: '0.7rem'
                                        }}
                                    >
                                        {passwordStrength.message}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: alpha(TEXT_PRIMARY, 0.6),
                                            fontSize: '0.7rem'
                                        }}
                                    >
                                        {passwordStrength.score}/4
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    height: 4, 
                                    width: '100%', 
                                    backgroundColor: alpha(TEXT_PRIMARY, 0.1), 
                                    borderRadius: 2, 
                                    overflow: 'hidden' 
                                }}>
                                    <Box sx={{ 
                                        height: '100%', 
                                        width: `${(passwordStrength.score / 4) * 100}%`, 
                                        backgroundColor: getPasswordStrengthColor(), 
                                        borderRadius: 2, 
                                        transition: 'width 0.3s ease' 
                                    }} />
                                </Box>
                                <Box sx={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(2, 1fr)', 
                                    gap: 1, 
                                    mt: 1 
                                }}>
                                    {Object.entries(passwordStrength.requirements).map(([key, met]) => (
                                        <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: met ? theme.palette.success.main : alpha(TEXT_PRIMARY, 0.2),
                                                transition: 'background-color 0.2s ease'
                                            }} />
                                            <Typography variant="caption" sx={{ 
                                                color: alpha(TEXT_PRIMARY, 0.7),
                                                fontSize: '0.7rem'
                                            }}>
                                                {key === 'length' && '8+ characters'}
                                                {key === 'uppercase' && 'Uppercase letter'}
                                                {key === 'number' && 'Number'}
                                                {key === 'special' && 'Special character'}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        <StyledTextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            size="small"
                            sx={{ my: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                            sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <GradientButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                py: 1.1,
                                fontSize: '0.95rem',
                                fontWeight: 600,
                            }}
                        >
                            {isLoading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
                                    <CircularProgress size={20} sx={{ color: 'white' }} />
                                    Creating account...
                                </Box>
                            ) : (
                                'Create Account'
                            )}
                        </GradientButton>

                        {/* Sign In Link */}
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2" color={alpha(TEXT_PRIMARY, 0.8)} sx={{ display: 'inline', mr: 0.5 }}>
                                Already have an account?
                            </Typography>
                            <Link
                                to="/login"
                                style={{
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    color: BLUE_COLOR,
                                    fontWeight: 600,
                                }}
                            >
                                Sign In
                            </Link>
                        </Box>

                        <Box sx={{
                            mt: 2,
                            pt: 3,
                            borderTop: `1px solid ${theme.palette.divider}`,
                            textAlign: 'center',
                        }}>
                            <Typography variant="body2" color={alpha(TEXT_PRIMARY, 0.6)} sx={{ fontSize: '0.7rem' }}>
                                By creating an account, you agree to our{' '}
                                <Link 
                                    to="/privacy-policy" 
                                    style={{ 
                                        color: BLUE_COLOR, 
                                        textDecoration: 'none',
                                        fontWeight: 500
                                    }}
                                >
                                    Privacy Policy
                                </Link>{' '}
                                and{' '}
                                <Link 
                                    to="/cookie-policy" 
                                    style={{ 
                                        color: BLUE_COLOR, 
                                        textDecoration: 'none',
                                        fontWeight: 500
                                    }}
                                >
                                    Cookie Policy
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default SignUp;