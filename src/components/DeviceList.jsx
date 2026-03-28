import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    alpha,
    useTheme,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    Laptop as LaptopIcon,
    PhoneAndroid as PhoneIcon,
    Tablet as TabletIcon,
    Computer as ComputerIcon,
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import axiosInstance from '../api/axios';
import OutlineButton from './ui/OutlineButton';
import GradientButton from './ui/GradientButton';

const DeviceList = ({ devices = [], userId, onDeviceRemoved }) => {
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Use theme colors
    const BLUE_COLOR = theme.palette.primary.main;
    const BLUE_DARK = theme.palette.primary.dark || theme.palette.primary.main;
    const GREEN_COLOR = theme.palette.success.main;
    const GREEN_DARK = theme.palette.success.dark || theme.palette.success.main;
    const RED_COLOR = theme.palette.error.main;
    const TEXT_PRIMARY = theme.palette.text.primary;

    const getDeviceIcon = (deviceType) => {
        const type = deviceType?.toLowerCase();
        if (type === 'mobile') return <PhoneIcon sx={{ color: BLUE_COLOR, fontSize: '0.9rem' }} />;
        if (type === 'tablet') return <TabletIcon sx={{ color: BLUE_COLOR, fontSize: '0.9rem' }} />;
        if (type === 'laptop') return <LaptopIcon sx={{ color: BLUE_COLOR, fontSize: '0.9rem' }} />;
        return <ComputerIcon sx={{ color: BLUE_COLOR, fontSize: '0.9rem' }} />;
    };

    const formatDate = (date) => {
        if (!date) return 'Unknown';
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleRemoveClick = (device) => {
        setSelectedDevice(device);
        setOpenDialog(true);
    };

    const handleConfirmRemove = async () => {
        if (!selectedDevice || !selectedDevice._id) {
            setError('Invalid device information');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.delete(
                `/users/${userId}/devices/${selectedDevice._id}`
            );

            if (response.data.success) {
                setSuccess('Device removed successfully');
                setOpenDialog(false);
                setSelectedDevice(null);

                // Call the callback to refetch the profile (and updated device list)
                if (onDeviceRemoved) {
                    onDeviceRemoved();
                }

                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to remove device';
            setError(errorMessage);
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDialog = () => {
        if (!loading) {
            setOpenDialog(false);
            setSelectedDevice(null);
        }
    };

    if (!devices || devices.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    borderRadius: 1.5,
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.mode === 'dark'
                        ? alpha(BLUE_COLOR, 0.05)
                        : alpha(BLUE_COLOR, 0.02),
                }}
            >
                <Typography variant="caption" color={TEXT_PRIMARY} sx={{ fontSize: '0.75rem' }}>
                    No active devices found
                </Typography>
            </Paper>
        );
    }

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                    <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color={TEXT_PRIMARY}
                        sx={{ fontSize: '0.85rem' }}
                    >
                        Active Devices
                    </Typography>
                    <Chip
                        label={`${devices.length} ${devices.length === 1 ? 'Device' : 'Devices'}`}
                        size="small"
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark'
                                ? alpha(BLUE_COLOR, 0.2)
                                : alpha(BLUE_COLOR, 0.1),
                            color: BLUE_COLOR,
                            borderColor: BLUE_COLOR,
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            height: 22,
                            '& .MuiChip-label': {
                                px: 1,
                                py: 0.25,
                            },
                        }}
                        variant="outlined"
                    />
                </Box>

                <List sx={{ p: 0 }}>
                    {devices.map((device, index) => (
                        <React.Fragment key={device._id || index}>
                            <ListItem
                                sx={{
                                    px: 1.5,
                                    py: 1,
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? alpha(BLUE_COLOR, 0.08)
                                            : alpha(BLUE_COLOR, 0.03),
                                    },
                                }}
                            >
                                <Box display="flex" alignItems="flex-start" flex={1}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        {getDeviceIcon(device.deviceType)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center" gap={0.75}>
                                                <Typography variant="caption" fontWeight={600} color={TEXT_PRIMARY} sx={{ fontSize: '0.8rem' }}>
                                                    {device.deviceType || 'Desktop'}
                                                </Typography>
                                                {index === 0 && (
                                                    <Chip
                                                        icon={<CheckCircleIcon sx={{ fontSize: '0.7rem' }} />}
                                                        label="Current"
                                                        size="small"
                                                        sx={{
                                                            height: 18,
                                                            backgroundColor: theme.palette.mode === 'dark'
                                                                ? alpha(GREEN_COLOR, 0.2)
                                                                : alpha(GREEN_COLOR, 0.1),
                                                            color: GREEN_COLOR,
                                                            borderColor: GREEN_COLOR,
                                                            fontWeight: 500,
                                                            fontSize: '0.65rem',
                                                            '& .MuiChip-icon': {
                                                                color: GREEN_COLOR,
                                                                fontSize: '0.65rem',
                                                                ml: 0.5,
                                                            },
                                                            '& .MuiChip-label': {
                                                                px: 0.75,
                                                                py: 0,
                                                            },
                                                        }}
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 0.25 }}>
                                                <Typography display="block" color={TEXT_PRIMARY} sx={{ fontSize: '0.75rem' }}>
                                                    {device.browser} {device.browserVersion && `v${device.browserVersion}`} • {device.os} {device.osVersion}
                                                </Typography>
                                                <Typography display="block" color={TEXT_PRIMARY} sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                                    Last active: {formatDate(device.lastActive || device.lastLogin)}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </Box>
                                {index !== 0 && (
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveClick(device)}
                                        disabled={loading}
                                        sx={{
                                            ml: 1,
                                            color: RED_COLOR,
                                            '&:hover': {
                                                backgroundColor: alpha(RED_COLOR, 0.1),
                                            },
                                        }}
                                    >
                                        <CloseIcon sx={{ fontSize: '1rem' }} />
                                    </IconButton>
                                )}
                            </ListItem>
                            {index < devices.length - 1 && (
                                <Divider
                                    component="li"
                                    sx={{
                                        backgroundColor: theme.palette.divider,
                                        margin: '2px 0',
                                    }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>

            {/* Remove Device Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                    }
                }}
            >
                <DialogTitle sx={{
                    color: TEXT_PRIMARY,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                }}>
                    Remove Device
                </DialogTitle>
                <DialogContent sx={{ py: 2 }}>
                    <Typography color={TEXT_PRIMARY} sx={{ fontSize: '0.85rem' }}>
                        Are you sure you want to remove <strong>{selectedDevice?.deviceType}</strong> from your devices?
                    </Typography>
                    <Typography color={TEXT_PRIMARY} sx={{ fontSize: '0.75rem', mt: 1, opacity: 0.8 }}>
                        {selectedDevice?.browser} • {selectedDevice?.os}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
                    <OutlineButton
                        onClick={handleCloseDialog}
                        disabled={loading}
                        size="small"
                    >
                        Cancel
                    </OutlineButton>
                    <GradientButton
                        onClick={handleConfirmRemove}
                        disabled={loading}
                        size="small"
                        sx={{
                            background: `linear-gradient(135deg, ${RED_COLOR} 0%, ${RED_COLOR} 100%)`,
                        }}
                    >
                        {loading ? 'Removing...' : 'Remove'}
                    </GradientButton>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            <Snackbar
                open={!!success}
                autoHideDuration={3000}
                onClose={() => setSuccess('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSuccess('')}
                    severity="success"
                    sx={{
                        width: '100%',
                        borderRadius: 1,
                        backgroundColor: theme.palette.mode === 'dark'
                            ? alpha(GREEN_COLOR, 0.1)
                            : alpha(GREEN_COLOR, 0.05),
                        borderLeft: `3px solid ${GREEN_COLOR}`,
                        color: TEXT_PRIMARY,
                    }}
                >
                    {success}
                </Alert>
            </Snackbar>

            {/* Error Snackbar */}
            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setError('')}
                    severity="error"
                    sx={{
                        width: '100%',
                        borderRadius: 1,
                        backgroundColor: theme.palette.mode === 'dark'
                            ? alpha(RED_COLOR, 0.1)
                            : alpha(RED_COLOR, 0.05),
                        borderLeft: `3px solid ${RED_COLOR}`,
                        color: TEXT_PRIMARY,
                    }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DeviceList;