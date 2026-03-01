import { Button, styled } from '@mui/material';

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #5C4D91 0%, #6B5CA3 100%)',
    color: 'white',
    borderRadius: '5px',
    padding: '6px 16px',
    fontWeight: 500,
    fontSize: '0.85rem',
    textTransform: 'none',
    boxShadow: '0 2px 8px rgba(92, 77, 145, 0.25)',
    transition: 'all 0.3s ease',

    '&:hover': {
        background: 'linear-gradient(135deg, #4A3D75 0%, #5C4D91 100%)',
        boxShadow: '0 6px 14px rgba(92, 77, 145, 0.35)',
    },

    '&:disabled': {
        background: theme.palette.grey[300],
        color: theme.palette.grey[500],
    },
}));

export default GradientButton;