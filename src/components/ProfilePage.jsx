import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Alert,
    CircularProgress,
    Avatar,
    Divider,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    useTheme,
    useMediaQuery,
    alpha,
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Security as SecurityIcon,
    Email as EmailIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import axiosInstance from '../api/axios';
import { useAuth } from '../auth/AuthProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StyledTextField from './ui/StyledTextField';
import GradientButton from './ui/GradientButton';
import OutlineButton from './ui/OutlineButton';
import DeviceList from './DeviceList';
import { useGlobalSnackbar } from '../context/GlobalSnackbarContext';

const TEXT_COLOR = '#0F1115';

export const ProfilePage = ({ roleLabel }) => {
    const { user, updateUser } = useAuth();
    const { showSnackbar } = useGlobalSnackbar();
    const queryClient = useQueryClient();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const BLUE_COLOR = theme.palette.primary.main;
    const BLUE_DARK = theme.palette.primary.dark || theme.palette.primary.main;
    const RED_COLOR = theme.palette.error.main;
    const GREEN_COLOR = theme.palette.success.main;
    const TEXT_PRIMARY = theme.palette.text.primary;

    const [isEditing, setIsEditing] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    const {
        data: profile,
        isLoading,
        isError,
        error: fetchError,
        refetch: refetchProfile,
    } = useQuery({
        queryKey: ['userProfile', user?.id],
        queryFn: async () => {
            const response = await axiosInstance.get('/auth/me');
            const userData = response?.data?.user || response?.data?.data || response?.data;
            return userData;
        },
        enabled: !!user?.id,
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
            });
        }
    }, [profile]);

    const updateProfileMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await axiosInstance.put('/auth/profile', formData);
            return response.data.data || response.data;
        },
        onMutate: async (newData) => {
            await queryClient.cancelQueries({ queryKey: ['userProfile', user?.id] });
            const previousProfile = queryClient.getQueryData(['userProfile', user?.id]);

            const optimisticProfile = {
                ...previousProfile,
                ...newData,
                updatedAt: new Date().toISOString(),
            };

            queryClient.setQueryData(['userProfile', user?.id], optimisticProfile);
            setFormData(newData);

            if (updateUser) {
                updateUser(newData);
            }

            return { previousProfile };
        },
        onSuccess: (updatedData) => {
            setFormData({
                name: updatedData.name || '',
                email: updatedData.email || '',
            });

            if (updateUser) {
                updateUser(updatedData);
            }

            setIsEditing(false);
            showSnackbar('Profile updated successfully!', 'success');
        },
        onError: (err, newData, context) => {
            if (context?.previousProfile) {
                queryClient.setQueryData(['userProfile', user?.id], context.previousProfile);
                setFormData({
                    name: context.previousProfile.name || '',
                    email: context.previousProfile.email || '',
                });

                if (updateUser) {
                    updateUser(context.previousProfile);
                }
            }

            showSnackbar(err.response?.data?.message || 'Failed to update profile. Please try again.', 'error');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
        },
    });

    const changePasswordMutation = useMutation({
        mutationFn: async (passwordData) => {
            const response = await axiosInstance.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            return response.data;
        },
        onSuccess: () => {
            showSnackbar('Password changed successfully!', 'success');
            setOpenPasswordDialog(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        },
        onError: (err) => {
            setPasswordError(err.response?.data?.message || 'Failed to change password. Please check your current password.');
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!formData.name?.trim()) {
            showSnackbar('Name is required', 'error');
            return;
        }

        if (!formData.email?.trim()) {
            showSnackbar('Email is required', 'error');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            showSnackbar('Please enter a valid email address', 'error');
            return;
        }

        updateProfileMutation.mutate(formData);
    };

    const handleCancel = () => {
        setIsEditing(false);
        const currentProfile = queryClient.getQueryData(['userProfile', user?.id]);
        if (currentProfile) {
            setFormData({
                name: currentProfile.name || '',
                email: currentProfile.email || '',
            });
        } else if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
            });
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        if (passwordError) {
            setPasswordError('');
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        changePasswordMutation.mutate(passwordData);
    };

    const handleClosePasswordDialog = () => {
        setOpenPasswordDialog(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setPasswordError('');
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={32} sx={{ color: BLUE_COLOR }} />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Alert severity="error" sx={{
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 1.5,
                    backgroundColor: theme.palette.mode === 'dark'
                        ? alpha(RED_COLOR, 0.1)
                        : alpha(RED_COLOR, 0.05),
                    borderLeft: `3px solid ${RED_COLOR}`,
                    color: TEXT_PRIMARY,
                    py: 0.75,
                    px: 1.5,
                }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', mb: 0.5, color: RED_COLOR }}>
                        Failed to load profile
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: TEXT_PRIMARY }}>
                        {fetchError?.message || 'Please try again later.'}
                    </Typography>
                </Alert>
            </Box>
        );
    }

    if (!profile && !isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Alert severity="warning" sx={{
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 1.5,
                    backgroundColor: theme.palette.mode === 'dark'
                        ? alpha('#f59e0b', 0.1)
                        : alpha('#f59e0b', 0.05),
                    borderLeft: `3px solid #f59e0b`,
                    color: TEXT_PRIMARY,
                    py: 0.75,
                    px: 1.5,
                }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', mb: 0.5, color: '#d97706' }}>
                        Profile not found
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: TEXT_PRIMARY }}>
                        Unable to load profile data. Please refresh the page.
                    </Typography>
                </Alert>
            </Box>
        );
    }

    const updating = updateProfileMutation.isPending;

    return (
        <Box position="relative">
            {(updateProfileMutation.isPending || changePasswordMutation.isPending) && (
                <LinearProgress
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        height: 2,
                        backgroundColor: theme.palette.mode === 'dark'
                            ? alpha(BLUE_COLOR, 0.2)
                            : alpha(BLUE_COLOR, 0.1),
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: BLUE_COLOR,
                        },
                    }}
                />
            )}

            <Box sx={{ display: { xs: '', lg: 'flex' } }} justifyContent="space-between" alignItems="center" mb={2}>
                <Box mb={isMobile ? 2 : 0}>
                    <Typography sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        fontSize: '0.95rem',
                        background: `linear-gradient(135deg, ${BLUE_DARK} 0%, ${BLUE_COLOR} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        My Profile
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: TEXT_PRIMARY }}>
                        Manage your account settings and preferences
                    </Typography>
                </Box>
                {!isEditing ? (
                    <GradientButton
                        variant="contained"
                        startIcon={<EditIcon sx={{ fontSize: '0.85rem' }} />}
                        onClick={() => setIsEditing(true)}
                        disabled={updating}
                        size={isMobile ? "small" : "small"}
                        sx={{ fontSize: '0.78rem', py: 0.6, px: 1.5 }}
                    >
                        Edit Profile
                    </GradientButton>
                ) : (
                    <Box display="flex" gap={1.5}>
                        <OutlineButton
                            startIcon={<CancelIcon sx={{ fontSize: '0.85rem' }} />}
                            onClick={handleCancel}
                            disabled={updating}
                            size='small'
                            sx={{ fontSize: '0.78rem', py: 0.6, px: 1.5 }}
                        >
                            Cancel
                        </OutlineButton>
                        <GradientButton
                            variant="contained"
                            startIcon={<SaveIcon sx={{ fontSize: '0.85rem' }} />}
                            onClick={handleSave}
                            disabled={updating}
                            size='small'
                            sx={{ fontSize: '0.78rem', py: 0.6, px: 1.5 }}
                        >
                            {updating ? 'Saving...' : 'Save Changes'}
                        </GradientButton>
                    </Box>
                )}
            </Box>

            {updating && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(0, 0, 0, 0.7)'
                            : 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        borderRadius: 2,
                    }}
                >
                    <CircularProgress size={32} sx={{ color: BLUE_COLOR }} />
                </Box>
            )}

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            height: '100%',
                            borderRadius: 1.5,
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Box display="flex" alignItems="center" mb={2}>
                            <Typography sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.85rem' }}>
                                Personal Information
                            </Typography>
                        </Box>

                        <Grid container spacing={1.5}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <StyledTextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing || updating}
                                    error={!formData.name?.trim() && isEditing}
                                    helperText={!formData.name?.trim() && isEditing ? "Name is required" : ""}
                                    InputProps={{
                                        startAdornment: <PersonIcon sx={{ mr: 1, fontSize: '0.85rem', color: TEXT_PRIMARY }} />,
                                    }}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        mb: 1.5,
                                        '& .MuiInputBase-input': {
                                            fontSize: '0.78rem',
                                            color: TEXT_PRIMARY,
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontSize: '0.78rem',
                                            color: TEXT_PRIMARY,
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: alpha(TEXT_PRIMARY, 0.3),
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <StyledTextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing || updating}
                                    error={(!/\S+@\S+\.\S+/.test(formData.email)) && isEditing && formData.email}
                                    helperText={(!/\S+@\S+\.\S+/.test(formData.email)) && isEditing && formData.email ? "Enter valid email" : ""}
                                    InputProps={{
                                        startAdornment: <EmailIcon sx={{ mr: 1, fontSize: '0.85rem', color: TEXT_PRIMARY }} />,
                                    }}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        mb: 1.5,
                                        '& .MuiInputBase-input': {
                                            fontSize: '0.78rem',
                                            color: TEXT_PRIMARY,
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontSize: '0.78rem',
                                            color: TEXT_PRIMARY,
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: alpha(TEXT_PRIMARY, 0.3),
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{
                            my: 2,
                            backgroundColor: theme.palette.divider,
                        }} />

                        <DeviceList
                            devices={profile?.devices || []}
                            userId={user?.id}
                            onDeviceRemoved={refetchProfile}
                        />

                        {profile?.createdAt && (
                            <Box mt={2}>
                                <Typography sx={{ fontSize: '0.68rem', color: TEXT_PRIMARY }}>
                                    Account created: {new Date(profile.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            height: '100%',
                            borderRadius: 1.5,
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Avatar
                                sx={{
                                    width: 72,
                                    height: 72,
                                    fontSize: 28,
                                    fontWeight: 600,
                                    mb: 1.5,
                                    bgcolor: BLUE_COLOR,
                                    color: theme.palette.getContrastText(BLUE_COLOR),
                                }}
                            >
                                {(formData.name?.charAt(0) || profile?.name?.charAt(0) || user?.name?.charAt(0) || 'U')?.toUpperCase()}
                            </Avatar>

                            <Typography sx={{ fontWeight: 600, textAlign: 'center', mb: 0.5, fontSize: '0.85rem', color: TEXT_PRIMARY }}>
                                {formData.name || profile?.name || user?.name || 'User'}
                            </Typography>
                            <Typography sx={{ fontSize: '0.72rem', textAlign: 'center', mb: 1.5, color: TEXT_PRIMARY }}>
                                {formData.email || profile?.email || user?.email || ''}
                            </Typography>

                            <Chip
                                icon={<SecurityIcon sx={{ fontSize: '0.75rem', color: BLUE_COLOR }} />}
                                label={roleLabel || (profile?.role || user?.role || 'USER').replace('_', ' ').toUpperCase()}
                                size="small"
                                sx={{
                                    mb: 2.5,
                                    fontWeight: 500,
                                    px: 1.5,
                                    py: 0.5,
                                    fontSize: '0.68rem',
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? alpha(BLUE_COLOR, 0.2)
                                        : alpha(BLUE_COLOR, 0.1),
                                    color: BLUE_COLOR,
                                    '& .MuiChip-label': {
                                        color: BLUE_COLOR,
                                        fontSize: '0.68rem',
                                    },
                                }}
                            />
                        </Box>

                        <Divider sx={{
                            my: 2.5,
                            backgroundColor: theme.palette.divider,
                        }} />

                        <Box display="flex" flexDirection="column" gap={1.5}>
                            <OutlineButton
                                fullWidth
                                onClick={() => setOpenPasswordDialog(true)}
                                disabled={updating || changePasswordMutation.isPending}
                                size="small"
                                sx={{ fontSize: '0.78rem', py: 0.6 }}
                            >
                                Change Password
                            </OutlineButton>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog
                open={openPasswordDialog}
                onClose={handleClosePasswordDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        p: 1,
                    }
                }}
            >
                <DialogTitle sx={{
                    color: TEXT_PRIMARY,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    py: 1.5,
                    px: 2,
                }}>
                    Change Password
                </DialogTitle>
                <DialogContent sx={{ px: 2, py: 1 }}>
                    <Box>
                        {passwordError && (
                            <Alert severity="error" sx={{
                                borderRadius: 1,
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? alpha(RED_COLOR, 0.1)
                                    : alpha(RED_COLOR, 0.05),
                                borderLeft: `3px solid ${RED_COLOR}`,
                                color: TEXT_PRIMARY,
                                py: 0.5,
                                px: 1.5,
                                mb: 1.5,
                                '& .MuiAlert-message': { fontSize: '0.72rem' },
                            }}>
                                {passwordError}
                            </Alert>
                        )}

                        <StyledTextField
                            fullWidth
                            label="Current Password"
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            margin="dense"
                            required
                            size='small'
                            disabled={changePasswordMutation.isPending}
                            variant="outlined"
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontSize: '0.78rem',
                                    color: TEXT_PRIMARY,
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: '0.78rem',
                                    color: TEXT_PRIMARY,
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: alpha(TEXT_PRIMARY, 0.3),
                                    },
                                },
                                mb: 1,
                            }}
                        />

                        <StyledTextField
                            fullWidth
                            label="New Password"
                            name="newPassword"
                            type="password"
                            size='small'
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            margin="dense"
                            required
                            helperText="Password must be at least 6 characters"
                            disabled={changePasswordMutation.isPending}
                            variant="outlined"
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontSize: '0.78rem',
                                    color: TEXT_PRIMARY,
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: '0.78rem',
                                    color: TEXT_PRIMARY,
                                },
                                '& .MuiFormHelperText-root': {
                                    fontSize: '0.68rem',
                                    color: TEXT_PRIMARY,
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: alpha(TEXT_PRIMARY, 0.3),
                                    },
                                },
                                mb: 1,
                            }}
                        />

                        <StyledTextField
                            fullWidth
                            label="Confirm New Password"
                            name="confirmPassword"
                            type="password"
                            size='small'
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            margin="dense"
                            required
                            disabled={changePasswordMutation.isPending}
                            variant="outlined"
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontSize: '0.78rem',
                                    color: TEXT_PRIMARY,
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: '0.78rem',
                                    color: TEXT_PRIMARY,
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: alpha(TEXT_PRIMARY, 0.3),
                                    },
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 2, py: 1.5 }}>
                    <OutlineButton
                        onClick={handleClosePasswordDialog}
                        disabled={changePasswordMutation.isPending}
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: '0.78rem', py: 0.4, px: 1.5 }}
                    >
                        Cancel
                    </OutlineButton>
                    <GradientButton
                        onClick={handleChangePassword}
                        variant="contained"
                        disabled={changePasswordMutation.isPending}
                        size="small"
                        sx={{ fontSize: '0.78rem', py: 0.4, px: 1.5 }}
                    >
                        {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                    </GradientButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};