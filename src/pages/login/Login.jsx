import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import {
  Box,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
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

export const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Use theme colors
  const BLUE_COLOR = theme.palette.primary.main;
  const BLUE_DARK = theme.palette.primary.dark || theme.palette.primary.main;
  const RED_COLOR = theme.palette.error.main;
  const TEXT_PRIMARY = theme.palette.text.primary;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Determine redirect path based on user role
  const getRedirectPath = (userRole) => {
    if (!userRole) return '/';
    
    const role = userRole.toLowerCase();
    if (role === 'superadmin' || role === 'admin') {
      return '/superadmin-dashboard';
    }
    return '/';
  };

  // Login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const loggedInUser = await login(email, password);
      
      // Store email if Remember Me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Redirect based on user role
      const redirectPath = getRedirectPath(loggedInUser?.role);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

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
              Sign in to your account
            </Typography>
          </Box>

          {error && (
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
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ '& > *': { mb: 2.5 } }}>
            <StyledTextField
              fullWidth
              label="Email Address"
              type="email"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <StyledTextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              size="small"
              sx={{ my: 2 }}
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

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
              mb: 2,
              flexWrap: 'wrap',
              gap: 1,
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                    sx={{
                      color: BLUE_COLOR,
                      '&.Mui-checked': { color: BLUE_COLOR },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.875rem', color: TEXT_PRIMARY }}>
                    Remember me
                  </Typography>
                }
              />

              <Link
                to="/forgot-password"
                style={{
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  color: BLUE_COLOR,
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </Link>
            </Box>

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
                  Signing in...
                </Box>
              ) : (
                'Sign In'
              )}
            </GradientButton>
          </Box>

          {/* Sign Up Link */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color={alpha(TEXT_PRIMARY, 0.8)} sx={{ display: 'inline', mr: 0.5 }}>
              Don't have an account?
            </Typography>
            <Link
              to="/signup"
              style={{
                textDecoration: 'none',
                fontSize: '0.9rem',
                color: BLUE_COLOR,
                fontWeight: 600,
              }}
            >
              Sign Up
            </Link>
          </Box>

          <Box sx={{
            mt: 2,
            pt: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            textAlign: 'center',
          }}>
            <Typography variant="body2" color={alpha(TEXT_PRIMARY, 0.7)}>
              Need help? Contact your administrator
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;