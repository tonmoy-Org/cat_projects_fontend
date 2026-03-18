// PaymentSuccess.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Typography,
    Box,
    Divider,
    styled,
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

const Card = styled(Box)({
    backgroundColor: '#ffffff',
    border: `1px solid ${borderColor}`,
    borderRadius: '12px',
    padding: '56px 48px',
    width: '100%',
    maxWidth: 560,
    textAlign: 'center',
    animation: `${fadeUp} 0.5s ease both`,
    '@media (max-width: 600px)': {
        padding: '40px 24px',
    },
});

const IconRing = styled(Box)({
    position: 'relative',
    width: 88,
    height: 88,
    margin: '0 auto 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    // ripple pseudo-element via Box child
});

const RippleCircle = styled(Box)({
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: `2px solid ${primaryColor}`,
    animation: `${ripple} 2s ease-out infinite`,
});

const IconCircle = styled(Box)({
    width: 88,
    height: 88,
    borderRadius: '50%',
    backgroundColor: '#fdf4fb',
    border: `2px solid ${primaryColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: `${scaleIn} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
    position: 'relative',
    zIndex: 1,
});

const DetailRow = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    '&:not(:last-child)': {
        borderBottom: `1px dashed ${borderColor}`,
    },
});

const DetailLabel = styled(Typography)({
    fontSize: '14px',
    color: darkGray,
    fontWeight: 500,
});

const DetailValue = styled(Typography)({
    fontSize: '14px',
    color: textColor,
    fontWeight: 600,
    textAlign: 'right',
    maxWidth: '55%',
    wordBreak: 'break-all',
});

const PrimaryButton = styled(Button)({
    backgroundColor: primaryColor,
    color: '#fff',
    padding: '13px 28px',
    fontSize: '15px',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '8px',
    flex: 1,
    '&:hover': {
        backgroundColor: '#c06bb0',
    },
});

const OutlineBtn = styled(Button)({
    color: primaryColor,
    border: `1.5px solid ${primaryColor}`,
    padding: '13px 28px',
    fontSize: '15px',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '8px',
    flex: 1,
    backgroundColor: 'transparent',
    '&:hover': {
        backgroundColor: '#fdf4fb',
        border: `1.5px solid ${primaryColor}`,
    },
});

const StatusBadge = styled(Box)({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#f0fbf1',
    border: '1px solid #c3e6c5',
    borderRadius: '20px',
    padding: '5px 14px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#2e7d32',
    marginBottom: '20px',
});

// ─── Component ────────────────────────────────────────────────────────────────
const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

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
                                sx={{ fontSize: 44, color: primaryColor }}
                            />
                        </IconCircle>
                    </IconRing>

                    {/* Status badge */}
                    <StatusBadge>
                        <Box
                            sx={{
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                backgroundColor: '#4caf50',
                            }}
                        />
                        Payment Confirmed
                    </StatusBadge>

                    {/* Heading */}
                    <Typography
                        sx={{
                            fontSize: { xs: '1.5rem', md: '1.9rem' },
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
                            fontSize: '15px',
                            color: darkGray,
                            mb: 4,
                            maxWidth: '80%',
                            mx: 'auto',
                            lineHeight: 1.7,
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
                            padding: '4px 20px',
                            mb: 4,
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
                            startIcon={<ShoppingBagOutlinedIcon />}
                            onClick={() => navigate('/orders')}
                        >
                            My Orders
                        </OutlineBtn>
                        <PrimaryButton
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate('/shop')}
                        >
                            Continue Shopping
                        </PrimaryButton>
                    </Box>

                    {/* Back to home link */}
                    <Button
                        startIcon={<HomeOutlinedIcon sx={{ fontSize: '16px' }} />}
                        onClick={() => navigate('/')}
                        sx={{
                            mt: 2.5,
                            color: darkGray,
                            fontSize: '13px',
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