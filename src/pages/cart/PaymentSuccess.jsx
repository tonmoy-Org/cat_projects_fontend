// PaymentSuccess.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Typography,
    Box,
    Divider,
    styled,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { keyframes } from '@emotion/react';

// ─── Theme (mirrors Checkout.jsx) ─────────────────────────────────────────────
const primaryColor   = '#db89ca';
const borderColor    = '#e0e0e0';
const textColor      = '#1a1a1a';
const darkGray       = '#666666';
const backgroundColor = '#f9f9f9';

// ─── Animations ───────────────────────────────────────────────────────────────
const scaleIn = keyframes`
  0%   { transform: scale(0.6); opacity: 0; }
  70%  { transform: scale(1.08); }
  100% { transform: scale(1);   opacity: 1; }
`;

const fadeUp = keyframes`
  from { transform: translateY(18px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const ripple = keyframes`
  0%   { transform: scale(1);   opacity: 0.35; }
  100% { transform: scale(2.4); opacity: 0;    }
`;

// ─── Styled Components ────────────────────────────────────────────────────────
const PageWrapper = styled(Box)({
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
});

const Card = styled(Box)(({ theme }) => ({
    backgroundColor: '#ffffff',
    border: `1px solid ${borderColor}`,
    borderRadius: '12px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: 560,
    textAlign: 'center',
    animation: `${fadeUp} 0.5s ease both`,
    [theme.breakpoints.down('sm')]: {
        padding: '32px 24px',
    },
}));

const IconRing = styled(Box)({
    position: 'relative',
    width: 80,
    height: 80,
    margin: '0 auto 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const RippleCircle = styled(Box)({
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: `2px solid ${primaryColor}`,
    animation: `${ripple} 2s ease-out infinite`,
});

const IconCircle = styled(Box)(({ theme }) => ({
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: '#fdf4fb',
    border: `2px solid ${primaryColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: `${scaleIn} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
        width: 70,
        height: 70,
    },
}));

const DetailRow = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    '&:not(:last-child)': {
        borderBottom: `1px dashed ${borderColor}`,
    },
});

const DetailLabel = styled(Typography)(({ theme }) => ({
    fontSize: '13px',
    color: darkGray,
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
}));

const DetailValue = styled(Typography)(({ theme }) => ({
    fontSize: '13px',
    color: textColor,
    fontWeight: 600,
    textAlign: 'right',
    maxWidth: '55%',
    wordBreak: 'break-all',
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
    backgroundColor: primaryColor,
    color: '#fff',
    padding: '11px 24px',
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '8px',
    flex: 1,
    '&:hover': {
        backgroundColor: '#c06bb0',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '10px 20px',
        fontSize: '12px',
    },
}));

const OutlineBtn = styled(Button)(({ theme }) => ({
    color: primaryColor,
    border: `1.5px solid ${primaryColor}`,
    padding: '11px 24px',
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '8px',
    flex: 1,
    backgroundColor: 'transparent',
    '&:hover': {
        backgroundColor: '#fdf4fb',
        border: `1.5px solid ${primaryColor}`,
    },
    [theme.breakpoints.down('sm')]: {
        padding: '10px 20px',
        fontSize: '12px',
    },
}));

const StatusBadge = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#f0fbf1',
    border: '1px solid #c3e6c5',
    borderRadius: '20px',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#2e7d32',
    marginBottom: '18px',
    [theme.breakpoints.down('sm')]: {
        fontSize: '11px',
        padding: '3px 10px',
    },
}));

// ─── Component ────────────────────────────────────────────────────────────────
const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const query         = new URLSearchParams(location.search);
    const transactionId = query.get('transactionId');
    const orderId       = query.get('orderId');

    const formattedDate = new Date().toLocaleDateString('en-US', {
        year:  'numeric',
        month: 'long',
        day:   'numeric',
    });

    const formattedTime = new Date().toLocaleTimeString('en-US', {
        hour:   '2-digit',
        minute: '2-digit',
    });

    return (
        <PageWrapper>
            <Container maxWidth="sm">
                <Card>
                    {/* Animated icon */}
                    <IconRing>
                        <RippleCircle />
                        <IconCircle>
                            <CheckCircleOutlineIcon
                                sx={{ fontSize: { xs: 36, sm: 40 }, color: primaryColor }}
                            />
                        </IconCircle>
                    </IconRing>

                    {/* Status badge */}
                    <StatusBadge>
                        <Box
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: '#4caf50',
                            }}
                        />
                        Payment Confirmed
                    </StatusBadge>

                    {/* Heading */}
                    <Typography
                        sx={{
                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                            fontWeight: 700,
                            color: textColor,
                            mb: 1.5,
                            lineHeight: 1.2,
                        }}
                    >
                        Thank you for your order!
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: { xs: '12px', sm: '13px' },
                            color: darkGray,
                            mb: 3,
                            maxWidth: '80%',
                            mx: 'auto',
                            lineHeight: 1.6,
                        }}
                    >
                        Your payment was processed successfully. A confirmation
                        email has been sent to your inbox.
                    </Typography>

                    {/* Details card */}
                    <Box
                        sx={{
                            backgroundColor,
                            border: `1px solid ${borderColor}`,
                            borderRadius: '8px',
                            padding: '2px 18px',
                            mb: 3,
                            textAlign: 'left',
                        }}
                    >
                        {orderId && (
                            <DetailRow>
                                <DetailLabel>Order ID</DetailLabel>
                                <DetailValue>#{orderId}</DetailValue>
                            </DetailRow>
                        )}
                        {transactionId && (
                            <DetailRow>
                                <DetailLabel>Transaction ID</DetailLabel>
                                <DetailValue>{transactionId}</DetailValue>
                            </DetailRow>
                        )}
                        <DetailRow>
                            <DetailLabel>Date</DetailLabel>
                            <DetailValue>{formattedDate}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                            <DetailLabel>Time</DetailLabel>
                            <DetailValue>{formattedTime}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                            <DetailLabel>Payment Method</DetailLabel>
                            <DetailValue>SSLCommerz</DetailValue>
                        </DetailRow>
                        <DetailRow>
                            <DetailLabel>Status</DetailLabel>
                            <DetailValue sx={{ color: '#2e7d32' }}>Paid</DetailValue>
                        </DetailRow>
                    </Box>

                    {/* Action buttons */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '12px',
                            '@media (max-width: 480px)': {
                                flexDirection: 'column',
                            },
                        }}
                    >
                        <OutlineBtn
                            variant="outlined"
                            startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: '18px' }} />}
                            onClick={() => navigate('/orders')}
                        >
                            My Orders
                        </OutlineBtn>
                        <PrimaryButton
                            variant="contained"
                            endIcon={<ArrowForwardIcon sx={{ fontSize: '16px' }} />}
                            onClick={() => navigate('/shop')}
                        >
                            Continue Shopping
                        </PrimaryButton>
                    </Box>

                    {/* Back to home link */}
                    <Button
                        startIcon={<HomeOutlinedIcon sx={{ fontSize: '14px' }} />}
                        onClick={() => navigate('/')}
                        sx={{
                            mt: 2,
                            color: darkGray,
                            fontSize: '12px',
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                                color: primaryColor,
                                backgroundColor: 'transparent',
                            },
                        }}
                    >
                        Back to Home
                    </Button>
                </Card>
            </Container>
        </PageWrapper>
    );
};

export default PaymentSuccess;