// PaymentFail.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Typography,
    Box,
    styled,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import { keyframes } from '@emotion/react';

// ─── Theme (mirrors Checkout.jsx) ─────────────────────────────────────────────
const primaryColor = '#db89ca';
const errorColor = '#ef4444';
const errorLight = '#fee2e2';
const borderColor = '#e0e0e0';
const textColor = '#1a1a1a';
const darkGray = '#666666';
const backgroundColor = '#f9f9f9';

// ─── Animations ───────────────────────────────────────────────────────────────
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
`;

const fadeUp = keyframes`
  from { transform: translateY(18px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
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

const IconCircle = styled(Box)(({ theme }) => ({
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: errorLight,
    border: `2px solid ${errorColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 28px',
    animation: `${shake} 0.5s ease-in-out`,
    [theme.breakpoints.down('sm')]: {
        width: 70,
        height: 70,
    },
}));

const StatusBadge = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: errorLight,
    border: `1px solid ${errorColor}`,
    borderRadius: '20px',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: 600,
    color: errorColor,
    marginBottom: '18px',
    [theme.breakpoints.down('sm')]: {
        fontSize: '11px',
        padding: '3px 10px',
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

const RetryButton = styled(Button)(({ theme }) => ({
    backgroundColor: errorColor,
    color: '#fff',
    padding: '11px 24px',
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '8px',
    flex: 1,
    '&:hover': {
        backgroundColor: '#dc2626',
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

const HelpBox = styled(Box)(({ theme }) => ({
    backgroundColor: backgroundColor,
    border: `1px solid ${borderColor}`,
    borderRadius: '8px',
    padding: '16px 20px',
    marginTop: '24px',
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
        padding: '14px 16px',
        marginTop: '20px',
    },
}));

// ─── Component ────────────────────────────────────────────────────────────────
const PaymentFail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const query = new URLSearchParams(location.search);
    const transactionId = query.get('transactionId');
    const orderId = query.get('orderId');
    const errorMessage = query.get('error') || 'Payment could not be processed at this time.';

    const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const handleRetryPayment = () => {
        navigate('/cart');
    };

    const handleContactSupport = () => {
        window.location.href = 'mailto:support@FatherOfMeow.com?subject=Payment%20Issue%20-%20Order%20#' + (orderId || 'Unknown');
    };

    return (
        <PageWrapper>
            <Container maxWidth="sm">
                <Card>
                    {/* Animated icon */}
                    <IconCircle>
                        <ErrorOutlineIcon
                            sx={{ fontSize: { xs: 36, sm: 40 }, color: errorColor }}
                        />
                    </IconCircle>

                    {/* Status badge */}
                    <StatusBadge>
                        <Box
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: errorColor,
                                animation: `${pulse} 1.5s ease-in-out infinite`,
                            }}
                        />
                        Payment Failed
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
                        Oops! Payment Failed
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
                        {errorMessage}
                    </Typography>

                    {/* Details card */}
                    {(orderId || transactionId) && (
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
                                <DetailValue sx={{ color: errorColor }}>Failed</DetailValue>
                            </DetailRow>
                        </Box>
                    )}

                    {/* Common Reasons Section */}
                    <HelpBox>
                        <Typography
                            sx={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: textColor,
                                mb: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <HelpOutlineIcon sx={{ fontSize: '18px', color: primaryColor }} />
                            Common reasons for payment failure:
                        </Typography>
                        <Box component="ul" sx={{ m: 0, pl: '20px' }}>
                            <Typography component="li" sx={{ fontSize: '12px', color: darkGray, mb: 0.5 }}>
                                Insufficient balance in your account
                            </Typography>
                            <Typography component="li" sx={{ fontSize: '12px', color: darkGray, mb: 0.5 }}>
                                Incorrect card details or OTP
                            </Typography>
                            <Typography component="li" sx={{ fontSize: '12px', color: darkGray, mb: 0.5 }}>
                                Bank server timeout or connectivity issues
                            </Typography>
                            <Typography component="li" sx={{ fontSize: '12px', color: darkGray }}>
                                Payment gateway technical error
                            </Typography>
                        </Box>
                    </HelpBox>

                    {/* Action buttons */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '12px',
                            mt: 3,
                            '@media (max-width: 480px)': {
                                flexDirection: 'column',
                            },
                        }}
                    >
                        <OutlineBtn
                            variant="outlined"
                            startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: '18px' }} />}
                            onClick={() => navigate('/cart')}
                        >
                            View Cart
                        </OutlineBtn>
                        <RetryButton
                            variant="contained"
                            startIcon={<ReplayIcon sx={{ fontSize: '18px' }} />}
                            onClick={handleRetryPayment}
                        >
                            Try Again
                        </RetryButton>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: '12px',
                            mt: 1.5,
                            '@media (max-width: 480px)': {
                                flexDirection: 'column',
                            },
                        }}
                    >
                        <OutlineBtn
                            variant="outlined"
                            startIcon={<ArrowBackIcon sx={{ fontSize: '18px' }} />}
                            onClick={() => navigate('/checkout')}
                        >
                            Back to Checkout
                        </OutlineBtn>
                        <PrimaryButton
                            variant="contained"
                            endIcon={<HelpOutlineIcon sx={{ fontSize: '16px' }} />}
                            onClick={handleContactSupport}
                        >
                            Contact Support
                        </PrimaryButton>
                    </Box>

                    {/* Back to home link */}
                    <Button
                        startIcon={<HomeOutlinedIcon sx={{ fontSize: '14px' }} />}
                        onClick={() => navigate('/')}
                        sx={{
                            mt: 2.5,
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

export default PaymentFail;