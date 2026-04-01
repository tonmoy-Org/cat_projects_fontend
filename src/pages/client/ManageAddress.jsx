import React, { useState } from 'react';
import {
    Box, Typography, Paper, Grid, CircularProgress,
    Card, CardContent, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, useTheme, alpha, useMediaQuery,
} from '@mui/material';
import {
    Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
    LocationOn as LocationIcon, Home as HomeIcon, Work as WorkIcon,
    Close as CloseIcon, OtherHouses,
} from '@mui/icons-material';
import StyledTextField from '../../components/ui/StyledTextField';
import GradientButton from '../../components/ui/GradientButton';
import OutlineButton from '../../components/ui/OutlineButton';
import { useClientApi } from '../../hooks/useClientApi';

const EMPTY_FORM = {
    label: 'home', fullName: '', phoneNumber: '',
    street: '', city: '', state: '', postalCode: '', country: '', isDefault: false,
};

const ManageAddress = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const {
        useAddresses,
        useCreateAddress,
        useUpdateAddress,
        useDeleteAddress,
        useSetDefaultAddress,
    } = useClientApi();

    const BLUE_COLOR = theme.palette.primary.main;
    const BLUE_DARK = theme.palette.primary.dark || BLUE_COLOR;
    const RED_COLOR = theme.palette.error.main;
    const TEXT_PRIMARY = theme.palette.text.primary;

    const [openDialog, setOpenDialog] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

    const { data: addresses = [], isLoading: loadingAddresses } = useAddresses();
    const createMutation = useCreateAddress();
    const updateMutation = useUpdateAddress();
    const deleteMutation = useDeleteAddress();
    const defaultMutation = useSetDefaultAddress();

    const isMutating = createMutation.isPending || updateMutation.isPending
        || deleteMutation.isPending || defaultMutation.isPending;

    const handleOpenDialog = (address = null) => {
        setEditingAddress(address);
        setFormData(address ? {
            label: address.label || 'home',
            fullName: address.fullName || '',
            phoneNumber: address.phoneNumber || '',
            street: address.street || '',
            city: address.city || '',
            state: address.state || '',
            postalCode: address.postalCode || '',
            country: address.country || '',
            isDefault: address.isDefault || false,
        } : EMPTY_FORM);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingAddress(null);
        setFormData(EMPTY_FORM);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAddress = () => {
        if (!formData.fullName?.trim()) return;
        if (!formData.phoneNumber?.trim()) return;
        if (!formData.street?.trim()) return;
        if (!formData.city?.trim()) return;
        if (!formData.state?.trim()) return;
        if (!formData.postalCode?.trim()) return;
        if (!formData.country?.trim()) return;

        if (editingAddress) {
            updateMutation.mutate({ addressId: editingAddress._id, payload: formData });
            handleCloseDialog();
        } else {
            createMutation.mutate(formData);
            handleCloseDialog();
        }
    };

    const handleDeleteAddress = (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            deleteMutation.mutate(addressId);
        }
    };

    const getAddressTypeIcon = (label) => {
        const iconSize = isMobile ? '0.85rem' : '0.9rem';
        if (label === 'home') return <HomeIcon sx={{ fontSize: iconSize }} />;
        if (label === 'work') return <WorkIcon sx={{ fontSize: iconSize }} />;
        return <OtherHouses sx={{ fontSize: iconSize }} />;
    };

    const getAddressTypeColor = (label) => {
        if (label === 'home') return '#10b981';
        if (label === 'work') return '#3b82f6';
        return '#8b5cf6';
    };

    if (loadingAddresses) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={32} sx={{ color: BLUE_COLOR }} />
            </Box>
        );
    }

    return (
        <Box sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: { xs: 2, sm: 0 },
                mb: 3 
            }}>
                <Box>
                    <Typography sx={{
                        fontWeight: 600, 
                        mb: 0.5, 
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        background: `linear-gradient(135deg, ${BLUE_DARK} 0%, ${BLUE_COLOR} 100%)`,
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                        backgroundClip: 'text',
                    }}>
                        Manage Addresses
                    </Typography>
                    <Typography sx={{ fontSize: isMobile ? '0.68rem' : '0.72rem', color: TEXT_PRIMARY }}>
                        Add, edit, or remove your delivery addresses
                    </Typography>
                </Box>
                <GradientButton
                    variant="contained"
                    startIcon={<AddIcon sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }} />}
                    onClick={() => handleOpenDialog()}
                    size="small"
                    sx={{ 
                        fontSize: isMobile ? '0.75rem' : '0.78rem', 
                        py: 0.6, 
                        px: isMobile ? 1.2 : 1.5,
                        width: { xs: '100%', sm: 'auto' }
                    }}
                >
                    Add New Address
                </GradientButton>
            </Box>

            {addresses.length > 0 ? (
                <Grid container spacing={isMobile ? 1.5 : 2} sx={{ mt: 1 }}>
                    {addresses.map((address) => (
                        <Grid size={{ xs: 12, sm: 6, md: 6 }} key={address._id}>
                            <Card elevation={0} sx={{
                                border: `1px solid ${address.isDefault ? BLUE_COLOR : theme.palette.divider}`,
                                borderRadius: 1.5,
                                backgroundColor: theme.palette.background.paper,
                                transition: 'all 0.2s ease',
                                '&:hover': { 
                                    boxShadow: theme.shadows[2], 
                                    transform: 'translateY(-2px)' 
                                },
                                position: 'relative', 
                                overflow: 'visible',
                            }}>
                                {address.isDefault && (
                                    <Box sx={{
                                        position: 'absolute', 
                                        top: -10, 
                                        right: 16,
                                        backgroundColor: BLUE_COLOR, 
                                        color: 'white',
                                        px: isMobile ? 1 : 1.5, 
                                        py: 0.5, 
                                        borderRadius: 1,
                                        fontSize: isMobile ? '0.65rem' : '0.68rem', 
                                        fontWeight: 600, 
                                        zIndex: 1,
                                    }}>
                                        DEFAULT
                                    </Box>
                                )}
                                <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box sx={{
                                                width: isMobile ? 24 : 28, 
                                                height: isMobile ? 24 : 28, 
                                                borderRadius: 1,
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                backgroundColor: alpha(getAddressTypeColor(address.label), 0.1),
                                                color: getAddressTypeColor(address.label),
                                            }}>
                                                {getAddressTypeIcon(address.label)}
                                            </Box>
                                            <Typography fontWeight={600} color={TEXT_PRIMARY}
                                                sx={{ fontSize: isMobile ? '0.78rem' : '0.82rem', textTransform: 'capitalize' }}>
                                                {address.label}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <IconButton size="small" onClick={() => handleOpenDialog(address)}
                                                sx={{ mr: 0.5, color: TEXT_PRIMARY }}>
                                                <EditIcon sx={{ fontSize: isMobile ? '0.75rem' : '0.8rem' }} />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDeleteAddress(address._id)}
                                                sx={{ color: RED_COLOR }}>
                                                <DeleteIcon sx={{ fontSize: isMobile ? '0.75rem' : '0.8rem' }} />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Typography color={TEXT_PRIMARY}
                                        sx={{ fontSize: isMobile ? '0.75rem' : '0.78rem', fontWeight: 600, mb: 0.5 }}>
                                        {address.fullName}
                                    </Typography>
                                    <Typography color={TEXT_PRIMARY}
                                        sx={{ fontSize: isMobile ? '0.72rem' : '0.75rem', mb: 0.5, opacity: 0.8 }}>
                                        {address.phoneNumber}
                                    </Typography>

                                    <Typography color={TEXT_PRIMARY} sx={{ fontSize: isMobile ? '0.75rem' : '0.78rem', mb: 0.5 }}>
                                        {address.street}
                                    </Typography>
                                    <Typography color={TEXT_PRIMARY} sx={{ fontSize: isMobile ? '0.75rem' : '0.78rem', mb: 0.5 }}>
                                        {address.city}, {address.state} {address.postalCode}
                                    </Typography>
                                    <Typography color={TEXT_PRIMARY} sx={{ fontSize: isMobile ? '0.75rem' : '0.78rem', mb: 1.5 }}>
                                        {address.country}
                                    </Typography>

                                    {!address.isDefault && (
                                        <Button 
                                            variant="outlined" 
                                            size="small"
                                            fullWidth={isMobile}
                                            onClick={() => defaultMutation.mutate(address._id)}
                                            disabled={isMutating}
                                            sx={{
                                                fontSize: isMobile ? '0.65rem' : '0.68rem', 
                                                textTransform: 'none', 
                                                py: 0.5, 
                                                px: 1.5,
                                                borderColor: alpha(BLUE_COLOR, 0.3), 
                                                color: BLUE_COLOR,
                                                '&:hover': { 
                                                    borderColor: BLUE_COLOR, 
                                                    backgroundColor: alpha(BLUE_COLOR, 0.05) 
                                                },
                                            }}>
                                            Set as Default
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper elevation={0} sx={{
                    p: isMobile ? 3 : 4, 
                    textAlign: 'center', 
                    borderRadius: 1.5,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                }}>
                    <LocationIcon sx={{ fontSize: isMobile ? 40 : 48, color: alpha(TEXT_PRIMARY, 0.3), mb: 2 }} />
                    <Typography color={TEXT_PRIMARY} gutterBottom sx={{ fontSize: isMobile ? '0.85rem' : '0.88rem' }}>
                        No addresses found
                    </Typography>
                    <Typography sx={{ fontSize: isMobile ? '0.68rem' : '0.72rem', display: 'block', mb: 2, color: TEXT_PRIMARY }}>
                        Add your first delivery address to get started
                    </Typography>
                    <GradientButton 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()} 
                        size="small"
                        sx={{ fontSize: isMobile ? '0.75rem' : '0.78rem', py: 0.6, px: 1.5 }}>
                        Add Address
                    </GradientButton>
                </Paper>
            )}

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{ 
                    sx: { 
                        borderRadius: 2, 
                        backgroundColor: theme.palette.background.paper, 
                        p: isMobile ? 0.5 : 1,
                        m: isMobile ? 1 : 0,
                    } 
                }}
            >
                <DialogTitle sx={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    color: TEXT_PRIMARY, 
                    fontWeight: 600, 
                    fontSize: isMobile ? '0.88rem' : '0.92rem', 
                    py: isMobile ? 1 : 1.5, 
                    px: isMobile ? 1.5 : 2,
                }}>
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                    <IconButton size="small" onClick={handleCloseDialog}>
                        <CloseIcon sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }} />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ px: isMobile ? 1.5 : 2, py: 1 }}>
                    <Grid container spacing={isMobile ? 1 : 1.5}>
                        <Grid size={{ xs: 12 }}>
                            <StyledTextField 
                                fullWidth 
                                select 
                                name="label" 
                                value={formData.label} 
                                onChange={handleInputChange}
                                SelectProps={{ native: true }} 
                                size="small"
                                sx={{ 
                                    '& .MuiInputBase-input': { fontSize: isMobile ? '0.75rem' : '0.78rem', color: TEXT_PRIMARY }, 
                                    mb: 1 
                                }}>
                                <option value="home">Home</option>
                                <option value="work">Work</option>
                                <option value="other">Other</option>
                            </StyledTextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <StyledTextField 
                                fullWidth 
                                label="Full Name" 
                                name="fullName"
                                value={formData.fullName} 
                                onChange={handleInputChange}
                                required 
                                size="small"
                                sx={{ 
                                    '& .MuiInputBase-input': { fontSize: isMobile ? '0.75rem' : '0.78rem', color: TEXT_PRIMARY }, 
                                    mb: 1 
                                }} 
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <StyledTextField 
                                fullWidth 
                                label="Phone Number" 
                                name="phoneNumber"
                                value={formData.phoneNumber} 
                                onChange={handleInputChange}
                                required 
                                size="small"
                                sx={{ 
                                    '& .MuiInputBase-input': { fontSize: isMobile ? '0.75rem' : '0.78rem', color: TEXT_PRIMARY }, 
                                    mb: 1 
                                }} 
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <StyledTextField 
                                fullWidth 
                                label="Street Address" 
                                name="street"
                                value={formData.street} 
                                onChange={handleInputChange}
                                required 
                                size="small"
                                sx={{ 
                                    '& .MuiInputBase-input': { fontSize: isMobile ? '0.75rem' : '0.78rem', color: TEXT_PRIMARY }, 
                                    mb: 1 
                                }} 
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <StyledTextField 
                                fullWidth 
                                label="City" 
                                name="city"
                                value={formData.city} 
                                onChange={handleInputChange}
                                required 
                                size="small"
                                sx={{ 
                                    '& .MuiInputBase-input': { fontSize: isMobile ? '0.75rem' : '0.78rem', color: TEXT_PRIMARY }, 
                                    mb: 1 
                                }} 
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <StyledTextField 
                                fullWidth 
                                label="State / Province" 
                                name="state"
                                value={formData.state} 
                                onChange={handleInputChange}
                                required 
                                size="small"
                                sx={{ 
                                    '& .MuiInputBase-input': { fontSize: isMobile ? '0.75rem' : '0.78rem', color: TEXT_PRIMARY }, 
                                    mb: 1 
                                }} 
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <StyledTextField 
                                fullWidth 
                                label="ZIP / Postal Code" 
                                name="postalCode"
                                value={formData.postalCode} 
                                onChange={handleInputChange}
                                required 
                                size="small"
                                sx={{ 
                                    '& .MuiInputBase-input': { fontSize: isMobile ? '0.75rem' : '0.78rem', color: TEXT_PRIMARY }, 
                                    mb: 1 
                                }} 
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <StyledTextField 
                                fullWidth 
                                label="Country" 
                                name="country"
                                value={formData.country} 
                                onChange={handleInputChange}
                                required 
                                size="small"
                                sx={{ 
                                    '& .MuiInputBase-input': { fontSize: isMobile ? '0.75rem' : '0.78rem', color: TEXT_PRIMARY }, 
                                    mb: 1 
                                }} 
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                                <input 
                                    type="checkbox" 
                                    id="isDefault" 
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                                    style={{ cursor: 'pointer' }} 
                                />
                                <label htmlFor="isDefault"
                                    style={{ fontSize: isMobile ? '0.75rem' : '0.78rem', color: TEXT_PRIMARY, cursor: 'pointer' }}>
                                    Set as default address
                                </label>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ 
                    px: isMobile ? 1.5 : 2, 
                    py: isMobile ? 1 : 1.5,
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1, sm: 0 }
                }}>
                    <OutlineButton 
                        onClick={handleCloseDialog} 
                        disabled={isMutating}
                        size="small" 
                        sx={{ 
                            fontSize: isMobile ? '0.75rem' : '0.78rem', 
                            py: 0.4, 
                            px: 1.5,
                            width: { xs: '100%', sm: 'auto' }
                        }}>
                        Cancel
                    </OutlineButton>
                    <GradientButton 
                        onClick={handleSaveAddress} 
                        disabled={isMutating}
                        size="small" 
                        sx={{ 
                            fontSize: isMobile ? '0.75rem' : '0.78rem', 
                            py: 0.4, 
                            px: 1.5,
                            width: { xs: '100%', sm: 'auto' }
                        }}>
                        {isMutating ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                    </GradientButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageAddress;