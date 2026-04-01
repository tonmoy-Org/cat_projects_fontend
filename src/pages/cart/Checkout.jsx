// Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Grid,
    Box,
    Typography,
    TextField,
    Button,
    styled,
    Paper,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    CircularProgress,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SectionTile from '../../components/SectionTile';
import { useAuth } from '../../auth/AuthProvider';

// ─── Theme ────────────────────────────────────────────────────────────────────

const primaryColor = '#db89ca';
const primaryLight = '#e8b3d4';
const borderColor = '#e0e0e0';
const textColor = '#1a1a1a';
const darkGray = '#666666';
const backgroundColor = '#f9f9f9';

// ─── Shipping rates (must mirror the backend SHIPPING_RATES map) ──────────────

const SHIPPING_RATES = {
    dhaka: 50,
    chittagong: 100,
    rajshahi: 120,
    khulna: 120,
    barisal: 150,
    sylhet: 150,
    rangpur: 130,
    mymensingh: 100,
};

const TAX_RATE = 0.15; // 15% VAT

// ─── Styled components ────────────────────────────────────────────────────────

const OrderSection = styled(Box)(({ theme }) => ({
    backgroundColor: '#ffffff',
    padding: '80px 0',
    width: '100%',
    [theme.breakpoints.down('md')]: { padding: '60px 0' },
    [theme.breakpoints.down('sm')]: { padding: '40px 0' },
}));

const CouponToggle = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '30px',
    padding: '14px 20px',
    backgroundColor,
    borderRadius: '8px',
    border: `1px solid ${borderColor}`,
    fontSize: '13px',
    color: darkGray,
    '& svg': { color: primaryColor, fontSize: '18px' },
    '& a': {
        color: primaryColor,
        textDecoration: 'none',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '13px',
        '&:hover': { textDecoration: 'underline' },
    },
    [theme.breakpoints.down('sm')]: {
        padding: '12px 16px',
        fontSize: '12px',
        gap: '8px',
    },
}));

const CouponForm = styled(Box)(({ theme }) => ({
    marginBottom: '40px',
    padding: '20px 25px',
    backgroundColor,
    borderRadius: '8px',
    border: `1px solid ${borderColor}`,
    display: 'none',
    '&.active': { display: 'block' },
    '& p': {
        marginBottom: '15px',
        color: darkGray,
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '16px 20px',
        '& p': { fontSize: '12px' },
    },
}));

const CouponRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: { flexDirection: 'column', alignItems: 'stretch' },
}));

const CouponInput = styled(TextField)(({ theme }) => ({
    flex: 1,
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#fff',
        height: '44px',
        '& fieldset': { borderColor },
        '&:hover fieldset': { borderColor: primaryColor },
        '&.Mui-focused fieldset': { borderColor: primaryColor },
    },
    '& .MuiInputBase-input': { padding: '10px 14px', fontSize: '13px' },
    [theme.breakpoints.down('sm')]: {
        '& .MuiOutlinedInput-root': { height: '42px' },
    },
}));

const ApplyButton = styled(Button)(({ theme }) => ({
    backgroundColor: primaryColor,
    color: '#fff',
    padding: '10px 24px',
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '8px',
    minWidth: '110px',
    height: '44px',
    '&:hover': { backgroundColor: '#c06bb0' },
    [theme.breakpoints.down('sm')]: { padding: '8px 20px', height: '42px', fontSize: '12px' },
}));

const BillingWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: '#ffffff',
    paddingRight: '30px',
    [theme.breakpoints.down('md')]: { paddingRight: '0' },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: '20px',
    fontWeight: 700,
    color: textColor,
    marginBottom: '25px',
    [theme.breakpoints.down('sm')]: { fontSize: '18px', marginBottom: '20px' },
}));

const FormRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '20px',
    marginBottom: '18px',
    [theme.breakpoints.down('sm')]: { flexDirection: 'column', gap: '12px', marginBottom: '12px' },
}));

const FormField = styled(Box)(({ theme }) => ({
    flex: 1,
    marginBottom: '18px',
    '& .MuiTextField-root, & .MuiFormControl-root': { width: '100%' },
    '& .MuiInputLabel-root': {
        fontSize: '13px',
        color: darkGray,
        '& .optional': { color: '#999', fontSize: '12px', fontWeight: 'normal' },
        '& .required': { color: '#ff0000' },
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#fff',
        height: '44px',
        '& fieldset': { borderColor },
        '&:hover fieldset': { borderColor: primaryColor },
        '&.Mui-focused fieldset': { borderColor: primaryColor },
    },
    '& .MuiInputBase-input': { padding: '10px 14px', fontSize: '13px' },
    '& .MuiSelect-select': { padding: '10px 14px', fontSize: '13px' },
    '& .MuiInputBase-inputMultiline': { height: 'auto' },
    [theme.breakpoints.down('sm')]: {
        marginBottom: '14px',
        '& .MuiOutlinedInput-root': { height: '42px' },
    },
}));

const Label = styled(Box)(({ theme }) => ({
    fontSize: '13px',
    fontWeight: 500,
    color: textColor,
    marginBottom: '6px',
    '& .required': { color: '#ff0000' },
    '& .optional': { color: '#999', fontWeight: 'normal' },
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
}));

const OrderSummaryWrapper = styled(Box)(({ theme }) => ({
    backgroundColor,
    padding: '28px',
    borderRadius: '10px',
    border: `1px solid ${borderColor}`,
    [theme.breakpoints.down('sm')]: { padding: '20px' },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginBottom: '22px',
    backgroundColor: '#ffffff',
    border: `1px solid ${borderColor}`,
    borderRadius: '8px',
    overflow: 'hidden',
}));

const StyledTable = styled(Table)(({ theme }) => ({
    '& .MuiTableCell-root': {
        border: `1px solid ${borderColor}`,
        padding: '12px 15px',
        fontSize: '13px',
        color: darkGray,
        backgroundColor,
    },
    '& .MuiTableCell-head': {
        backgroundColor,
        fontWeight: 600,
        color: textColor,
        fontSize: '14px',
        borderBottom: `2px solid ${borderColor}`,
    },
    '& .MuiTableCell-body': { '&:last-child': { textAlign: 'right' } },
    [theme.breakpoints.down('sm')]: {
        '& .MuiTableCell-root': {
            padding: '10px 12px',
            fontSize: '12px',
        },
        '& .MuiTableCell-head': {
            fontSize: '13px',
        },
    },
}));

const TotalRow = styled(TableRow)({
    '& .MuiTableCell-root': {
        fontWeight: 700,
        color: textColor,
        fontSize: '16px',
        backgroundColor: '#fff',
        borderTop: `2px solid ${borderColor}`,
    },
});

const PaymentMessage = styled(Box)(({ theme }) => ({
    padding: '16px 20px',
    backgroundColor: '#fff',
    border: `1px solid ${borderColor}`,
    borderRadius: '8px',
    marginBottom: '22px',
    color: darkGray,
    fontSize: '13px',
    lineHeight: 1.5,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    '& svg': { color: primaryColor, fontSize: '20px', flexShrink: 0, marginTop: '2px' },
    [theme.breakpoints.down('sm')]: {
        padding: '14px 16px',
        fontSize: '12px',
        gap: '10px',
        '& svg': { fontSize: '18px' },
    },
}));

const PrivacyText = styled(Typography)(({ theme }) => ({
    fontSize: '12px',
    color: darkGray,
    lineHeight: 1.6,
    marginBottom: '18px',
    '& a': {
        color: primaryColor,
        textDecoration: 'none',
        fontWeight: 500,
        '&:hover': { textDecoration: 'underline' },
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '11px',
    },
}));

const PlaceOrderButton = styled(Button)(({ theme }) => ({
    backgroundColor: primaryColor,
    color: '#fff',
    padding: '14px 28px',
    fontSize: '14px',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '8px',
    width: '100%',
    '&:hover': { backgroundColor: '#c06bb0' },
    '&.Mui-disabled': { backgroundColor: '#e0c0d8', color: '#fff' },
    [theme.breakpoints.down('sm')]: {
        padding: '12px 24px',
        fontSize: '13px',
    },
}));

const BackButton = styled(Button)(({ theme }) => ({
    color: primaryColor,
    fontSize: '13px',
    textTransform: 'none',
    fontWeight: 600,
    marginBottom: '28px',
    padding: 0,
    '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
    '& svg': { marginRight: '6px', fontSize: '16px' },
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
        marginBottom: '20px',
    },
}));

const AdditionalInfoWrapper = styled(Box)(({ theme }) => ({
    marginTop: '32px',
    [theme.breakpoints.down('sm')]: { marginTop: '24px' },
}));

const TextAreaField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#fff',
        height: 'auto',
        '& fieldset': { borderColor },
        '&:hover fieldset': { borderColor: primaryColor },
        '&.Mui-focused fieldset': { borderColor: primaryColor },
    },
    '& .MuiInputBase-inputMultiline': { padding: '10px 14px', fontSize: '13px' },
    [theme.breakpoints.down('sm')]: {
        '& .MuiInputBase-inputMultiline': { fontSize: '12px' },
    },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => `৳${parseFloat(n || 0).toFixed(0)}`;

// ─── Component ────────────────────────────────────────────────────────────────

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [showCoupon, setShowCoupon] = useState(false);
    const [country, setCountry] = useState('BD');
    const [district, setDistrict] = useState('');
    const [validationError, setValidationError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state for controlled inputs
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        streetAddress: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        orderNotes: ''
    });

    // Cart data passed from the Cart page via navigate(state)
    const {
        cartItems = [],
        subtotal = 0,
        discountAmt = 0,
        total = 0,
        couponApplied = false,
        discount = 0,
        couponCode = '',
    } = location.state || {};

    // ── Auto-fill user information when available ─────────────────────────────
    useEffect(() => {
        if (user && user.email) {
            // Parse user's full name
            const fullName = user.name || '';
            const nameParts = fullName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Parse address if available
            let streetAddress = '';
            let city = '';
            let postalCode = '';
            
            if (user.address) {
                // Try to parse address - assuming format: "street, city, postalCode"
                const addressParts = user.address.split(',');
                streetAddress = addressParts[0]?.trim() || '';
                city = addressParts[1]?.trim() || '';
                postalCode = addressParts[2]?.trim() || '';
            }
            
            // Try to extract district from address or set default
            let userDistrict = '';
            if (user.address) {
                const addressLower = user.address.toLowerCase();
                for (const d in SHIPPING_RATES) {
                    if (addressLower.includes(d)) {
                        userDistrict = d;
                        break;
                    }
                }
            }
            
            setFormValues({
                firstName: firstName,
                lastName: lastName,
                email: user.email,
                phone: user.phone || '',
                streetAddress: streetAddress,
                addressLine2: '',
                city: city,
                postalCode: postalCode,
                orderNotes: ''
            });
            
            // Auto-set district if found in address
            if (userDistrict) {
                setDistrict(userDistrict);
            }
        }
    }, [user]);

    // ── Handle form field changes ────────────────────────────────────────────
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ── Derived totals (calculated live so shipping is always accurate) ────────
    const shippingCost = district
        ? (SHIPPING_RATES[district.toLowerCase()] ?? 0)
        : 0;

    const tax = subtotal * TAX_RATE;
    const grandTotal = subtotal - discountAmt + shippingCost + tax;

    // ── Guard: redirect to cart if no items ───────────────────────────────────
    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            navigate('/cart', { replace: true });
        }
    }, [cartItems, navigate]);

    // ── Form submit ───────────────────────────────────────────────────────────
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setValidationError('');

        const firstName = formValues.firstName.trim();
        const lastName = formValues.lastName.trim();
        const email = formValues.email.trim();
        const phone = formValues.phone.trim();
        const street = formValues.streetAddress.trim();
        const addressLine2 = formValues.addressLine2.trim();
        const city = formValues.city.trim();
        const postalCode = formValues.postalCode.trim();
        const orderNotes = formValues.orderNotes.trim();

        // ── Client-side validation ────────────────────────────────────────────
        if (!firstName || !lastName) return setValidationError('First name and last name are required.');
        if (!email) return setValidationError('Email address is required.');
        if (!phone) return setValidationError('Phone number is required.');
        if (!street) return setValidationError('Street address is required.');
        if (!city) return setValidationError('Town / City is required.');
        if (!district) return setValidationError('Please select a district.');
        if (!postalCode) return setValidationError('Postal code is required.');

        // ── Build API payload ─────────────────────────────────────────────────
        const items = cartItems.map((item) => ({
            productId: item._id || item.productId,
            quantity: item.quantity,
            itemType: item.itemType || 'product',
        }));

        const payload = {
            items,
            customerEmail: email,
            customerName: `${firstName} ${lastName}`,
            customerPhone: phone,
            customerAddress: {
                street: street + (addressLine2 ? `, ${addressLine2}` : ''),
                city,
                district,
                postalCode,
                country: country === 'BD' ? 'Bangladesh' : country,
            },
            couponCode,
            discount: discountAmt,
            shippingDistrict: district,
            shippingMethod: 'standard',
            orderNotes,
        };

        setIsSubmitting(true);

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/payment/sslcommerz/initiate`,
                payload
            );

            if (data.success && data.GatewayPageURL) {
                window.location.href = data.GatewayPageURL;
            } else {
                setValidationError(data.message || 'Payment initiation failed. Please try again.');
            }
        } catch (err) {
            console.error('Payment initiation error:', err);
            const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
            setValidationError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!cartItems || cartItems.length === 0) return null;

    return (
        <Box>
            <SectionTile
                bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg"
                subtitle="Find a new friend"
                title="Checkout"
                icon={true}
                iconClass="flaticon-custom-icon"
            />

            <OrderSection>
                <Container maxWidth="lg">
                    <BackButton startIcon={<ArrowBackIcon />} onClick={() => navigate('/cart')}>
                        Back to Cart
                    </BackButton>

                    {/* Coupon Section */}
                    <Grid container spacing={0}>
                        <Grid size={{ xs: 12 }}>
                            <CouponToggle>
                                <LocalOfferIcon />
                                <span>
                                    Have a coupon?{' '}
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowCoupon(!showCoupon);
                                        }}
                                    >
                                        Click here to enter your code <HelpOutlineIcon fontSize="small" />
                                    </a>
                                </span>
                            </CouponToggle>

                            <CouponForm className={showCoupon ? 'active' : ''}>
                                <p>
                                    <LocalOfferIcon fontSize="small" />
                                    If you have a coupon code, please apply it below.
                                </p>
                                <CouponRow>
                                    <CouponInput
                                        placeholder="Coupon code"
                                        variant="outlined"
                                        size="small"
                                    />
                                    <ApplyButton variant="contained">Apply coupon</ApplyButton>
                                </CouponRow>
                            </CouponForm>
                        </Grid>
                    </Grid>

                    {/* Validation Error */}
                    {validationError && (
                        <Alert severity="error" sx={{ mb: 2.5, '& .MuiAlert-message': { fontSize: '13px' } }}>
                            {validationError}
                        </Alert>
                    )}

                    {/* Checkout Form */}
                    <form onSubmit={handlePlaceOrder}>
                        <Grid container spacing={4}>

                            {/* ── Billing Details ──────────────────────────────── */}
                            <Grid size={{ xs: 12, md: 7 }}>
                                <BillingWrapper>
                                    <SectionTitle>Billing Details</SectionTitle>

                                    {/* First / Last name */}
                                    <FormRow>
                                        <FormField>
                                            <Label>First name <span className="required">*</span></Label>
                                            <TextField
                                                name="firstName"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                placeholder="John"
                                                value={formValues.firstName}
                                                onChange={handleInputChange}
                                            />
                                        </FormField>
                                        <FormField>
                                            <Label>Last name <span className="required">*</span></Label>
                                            <TextField
                                                name="lastName"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                placeholder="Doe"
                                                value={formValues.lastName}
                                                onChange={handleInputChange}
                                            />
                                        </FormField>
                                    </FormRow>

                                    {/* Country */}
                                    <FormField>
                                        <Label>Country / Region <span className="required">*</span></Label>
                                        <FormControl fullWidth>
                                            <Select
                                                name="country"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                sx={{ fontSize: '13px' }}
                                            >
                                                <MenuItem value="BD" sx={{ fontSize: '13px' }}>Bangladesh</MenuItem>
                                                <MenuItem value="IN" sx={{ fontSize: '13px' }}>India</MenuItem>
                                                <MenuItem value="PK" sx={{ fontSize: '13px' }}>Pakistan</MenuItem>
                                                <MenuItem value="US" sx={{ fontSize: '13px' }}>United States</MenuItem>
                                                <MenuItem value="UK" sx={{ fontSize: '13px' }}>United Kingdom</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </FormField>

                                    {/* Street address */}
                                    <FormField>
                                        <Label>Street address <span className="required">*</span></Label>
                                        <TextField
                                            name="streetAddress"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            placeholder="House number and street name"
                                            value={formValues.streetAddress}
                                            onChange={handleInputChange}
                                        />
                                    </FormField>

                                    {/* Address line 2 */}
                                    <FormField>
                                        <TextField
                                            name="addressLine2"
                                            variant="outlined"
                                            fullWidth
                                            placeholder="Apartment, suite, unit, etc. (optional)"
                                            value={formValues.addressLine2}
                                            onChange={handleInputChange}
                                        />
                                    </FormField>

                                    {/* City */}
                                    <FormField>
                                        <Label>Town / City <span className="required">*</span></Label>
                                        <TextField
                                            name="city"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            placeholder="Dhaka"
                                            value={formValues.city}
                                            onChange={handleInputChange}
                                        />
                                    </FormField>

                                    {/* District — controls shipping cost */}
                                    <FormField>
                                        <Label>District <span className="required">*</span></Label>
                                        <FormControl fullWidth>
                                            <Select
                                                name="district"
                                                value={district}
                                                onChange={(e) => setDistrict(e.target.value)}
                                                displayEmpty
                                                required
                                                sx={{ fontSize: '13px' }}
                                            >
                                                <MenuItem value="" disabled sx={{ fontSize: '13px' }}>
                                                    <em>Select a district</em>
                                                </MenuItem>
                                                <MenuItem value="dhaka" sx={{ fontSize: '13px' }}>Dhaka</MenuItem>
                                                <MenuItem value="chittagong" sx={{ fontSize: '13px' }}>Chittagong</MenuItem>
                                                <MenuItem value="rajshahi" sx={{ fontSize: '13px' }}>Rajshahi</MenuItem>
                                                <MenuItem value="khulna" sx={{ fontSize: '13px' }}>Khulna</MenuItem>
                                                <MenuItem value="barisal" sx={{ fontSize: '13px' }}>Barisal</MenuItem>
                                                <MenuItem value="sylhet" sx={{ fontSize: '13px' }}>Sylhet</MenuItem>
                                                <MenuItem value="rangpur" sx={{ fontSize: '13px' }}>Rangpur</MenuItem>
                                                <MenuItem value="mymensingh" sx={{ fontSize: '13px' }}>Mymensingh</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </FormField>

                                    {/* Postal code */}
                                    <FormField>
                                        <Label>ZIP / Postal Code <span className="required">*</span></Label>
                                        <TextField
                                            name="postalCode"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            placeholder="1000"
                                            value={formValues.postalCode}
                                            onChange={handleInputChange}
                                        />
                                    </FormField>

                                    {/* Phone */}
                                    <FormField>
                                        <Label>
                                            Phone <span className="required">*</span>
                                        </Label>
                                        <TextField
                                            name="phone"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            placeholder="+880-1X-XXXX-XXXX"
                                            value={formValues.phone}
                                            onChange={handleInputChange}
                                        />
                                    </FormField>

                                    {/* Email */}
                                    <FormField>
                                        <Label>Email address <span className="required">*</span></Label>
                                        <TextField
                                            name="email"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            type="email"
                                            placeholder="name@example.com"
                                            value={formValues.email}
                                            onChange={handleInputChange}
                                        />
                                    </FormField>

                                    {/* Additional info */}
                                    <AdditionalInfoWrapper>
                                        <SectionTitle>Additional information</SectionTitle>
                                        <FormField>
                                            <Label>Order notes <span className="optional">(optional)</span></Label>
                                            <TextAreaField
                                                name="orderNotes"
                                                variant="outlined"
                                                multiline
                                                rows={4}
                                                fullWidth
                                                placeholder="Notes about your order, e.g. special notes for delivery."
                                                value={formValues.orderNotes}
                                                onChange={handleInputChange}
                                            />
                                        </FormField>
                                    </AdditionalInfoWrapper>
                                </BillingWrapper>
                            </Grid>

                            {/* ── Order Summary ─────────────────────────────────── */}
                            <Grid size={{ xs: 12, md: 5 }}>
                                <OrderSummaryWrapper>
                                    <SectionTitle>Your order</SectionTitle>

                                    <StyledTableContainer>
                                        <StyledTable>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Product</TableCell>
                                                    <TableCell align="right">Subtotal</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {/* Line items */}
                                                {cartItems.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {item.title || item.name}{' '}
                                                            <strong>× {item.quantity}</strong>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {fmt(item.price * item.quantity)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                                {/* Subtotal */}
                                                <TableRow>
                                                    <TableCell>Subtotal</TableCell>
                                                    <TableCell align="right">{fmt(subtotal)}</TableCell>
                                                </TableRow>

                                                {/* Discount */}
                                                {couponApplied && (
                                                    <TableRow>
                                                        <TableCell>
                                                            Discount ({Math.round(discount * 100)}%)
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ color: '#388e3c' }}>
                                                            − {fmt(discountAmt)}
                                                        </TableCell>
                                                    </TableRow>
                                                )}

                                                {/* Shipping — live once district is selected */}
                                                <TableRow>
                                                    <TableCell>Shipping</TableCell>
                                                    <TableCell align="right">
                                                        {district ? fmt(shippingCost) : 'Select district'}
                                                    </TableCell>
                                                </TableRow>

                                                {/* Tax */}
                                                <TableRow>
                                                    <TableCell>Tax (15% VAT)</TableCell>
                                                    <TableCell align="right">{fmt(tax)}</TableCell>
                                                </TableRow>

                                                {/* Grand total */}
                                                <TotalRow>
                                                    <TableCell>Total</TableCell>
                                                    <TableCell align="right" sx={{ color: primaryColor }}>
                                                        {fmt(grandTotal)}
                                                    </TableCell>
                                                </TotalRow>
                                            </TableBody>
                                        </StyledTable>
                                    </StyledTableContainer>

                                    {/* Payment message */}
                                    <PaymentMessage>
                                        <ErrorOutlineIcon />
                                        <span>
                                            Please review your order. You will be redirected to
                                            SSLCommerz to complete payment securely.
                                        </span>
                                    </PaymentMessage>

                                    {/* Privacy policy */}
                                    <PrivacyText>
                                        Your personal data will be used to process your order and
                                        support your experience throughout this website, as described in
                                        our{' '}
                                        <a href="/privacy-policy">privacy policy</a>.
                                    </PrivacyText>

                                    {/* Submit */}
                                    <PlaceOrderButton
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        startIcon={
                                            isSubmitting ? (
                                                <CircularProgress size={16} sx={{ color: '#fff' }} />
                                            ) : null
                                        }
                                    >
                                        {isSubmitting ? 'Redirecting to payment…' : 'Place Order'}
                                    </PlaceOrderButton>

                                    {/* Continue shopping */}
                                    <Button
                                        fullWidth
                                        onClick={() => navigate('/shop')}
                                        disabled={isSubmitting}
                                        sx={{
                                            mt: 1.5,
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
                                        ← Continue Shopping
                                    </Button>
                                </OrderSummaryWrapper>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </OrderSection>
        </Box>
    );
};

export default Checkout;