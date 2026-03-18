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
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SectionTile from '../../components/SectionTile';

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

const OrderSection = styled(Box)({
    backgroundColor: '#ffffff',
    padding: '80px 0',
    width: '100%',
    '@media (max-width: 900px)': { padding: '60px 0' },
    '@media (max-width: 600px)': { padding: '40px 0' },
});

const CouponToggle = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '30px',
    padding: '16px 20px',
    backgroundColor,
    borderRadius: '8px',
    border: `1px solid ${borderColor}`,
    fontSize: '16px',
    color: darkGray,
    '& svg': { color: primaryColor, fontSize: '22px' },
    '& a': {
        color: primaryColor,
        textDecoration: 'none',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        '&:hover': { textDecoration: 'underline' },
    },
});

const CouponForm = styled(Box)({
    marginBottom: '40px',
    padding: '25px',
    backgroundColor,
    borderRadius: '8px',
    border: `1px solid ${borderColor}`,
    display: 'none',
    '&.active': { display: 'block' },
    '& p': {
        marginBottom: '15px',
        color: darkGray,
        fontSize: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
});

const CouponRow = styled(Box)({
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    '@media (max-width: 600px)': { flexDirection: 'column', alignItems: 'stretch' },
});

const CouponInput = styled(TextField)({
    flex: 1,
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#fff',
        height: '48px',
        '& fieldset': { borderColor },
        '&:hover fieldset': { borderColor: primaryColor },
        '&.Mui-focused fieldset': { borderColor: primaryColor },
    },
    '& .MuiInputBase-input': { padding: '12px 14px' },
});

const ApplyButton = styled(Button)({
    backgroundColor: primaryColor,
    color: '#fff',
    padding: '12px 25px',
    fontSize: '15px',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '8px',
    minWidth: '120px',
    height: '48px',
    '&:hover': { backgroundColor: '#c06bb0' },
    '@media (max-width: 600px)': { padding: '10px 20px', height: '44px' },
});

const BillingWrapper = styled(Box)({
    backgroundColor: '#ffffff',
    paddingRight: '30px',
    '@media (max-width: 1200px)': { paddingRight: '0' },
});

const SectionTitle = styled(Typography)({
    fontSize: '24px',
    fontWeight: 700,
    color: textColor,
    marginBottom: '30px',
    '@media (max-width: 600px)': { fontSize: '22px', marginBottom: '25px' },
});

const FormRow = styled(Box)({
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    '@media (max-width: 600px)': { flexDirection: 'column', gap: '15px' },
});

const FormField = styled(Box)({
    flex: 1,
    marginBottom: '20px',
    '& .MuiTextField-root, & .MuiFormControl-root': { width: '100%' },
    '& .MuiInputLabel-root': {
        fontSize: '14px',
        color: darkGray,
        '& .optional': { color: '#999', fontSize: '13px', fontWeight: 'normal' },
        '& .required': { color: '#ff0000' },
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#fff',
        height: '48px',
        '& fieldset': { borderColor },
        '&:hover fieldset': { borderColor: primaryColor },
        '&.Mui-focused fieldset': { borderColor: primaryColor },
    },
    '& .MuiInputBase-input': { padding: '12px 14px' },
    '& .MuiSelect-select': { padding: '12px 14px' },
    '& .MuiInputBase-inputMultiline': { height: 'auto' },
});

const Label = styled(Box)({
    fontSize: '14px',
    fontWeight: 500,
    color: textColor,
    marginBottom: '8px',
    '& .required': { color: '#ff0000' },
    '& .optional': { color: '#999', fontWeight: 'normal' },
});

const OrderSummaryWrapper = styled(Box)({
    backgroundColor,
    padding: '30px',
    borderRadius: '10px',
    border: `1px solid ${borderColor}`,
    '@media (max-width: 600px)': { padding: '20px' },
});

const StyledTableContainer = styled(TableContainer)({
    marginBottom: '25px',
    backgroundColor: '#ffffff',
    border: `1px solid ${borderColor}`,
    borderRadius: '8px',
    overflow: 'hidden',
});

const StyledTable = styled(Table)({
    '& .MuiTableCell-root': {
        border: `1px solid ${borderColor}`,
        padding: '15px',
        fontSize: '15px',
        color: darkGray,
        backgroundColor,
    },
    '& .MuiTableCell-head': {
        backgroundColor,
        fontWeight: 600,
        color: textColor,
        fontSize: '16px',
        borderBottom: `2px solid ${borderColor}`,
    },
    '& .MuiTableCell-body': { '&:last-child': { textAlign: 'right' } },
});

const TotalRow = styled(TableRow)({
    '& .MuiTableCell-root': {
        fontWeight: 700,
        color: textColor,
        fontSize: '18px',
        backgroundColor: '#fff',
        borderTop: `2px solid ${borderColor}`,
    },
});

const PaymentMessage = styled(Box)({
    padding: '20px',
    backgroundColor: '#fff',
    border: `1px solid ${borderColor}`,
    borderRadius: '8px',
    marginBottom: '25px',
    color: darkGray,
    fontSize: '15px',
    lineHeight: 1.6,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    '& svg': { color: primaryColor, fontSize: '24px', flexShrink: 0, marginTop: '2px' },
});

const PrivacyText = styled(Typography)({
    fontSize: '14px',
    color: darkGray,
    lineHeight: 1.7,
    marginBottom: '20px',
    '& a': {
        color: primaryColor,
        textDecoration: 'none',
        fontWeight: 500,
        '&:hover': { textDecoration: 'underline' },
    },
});

const PlaceOrderButton = styled(Button)({
    backgroundColor: primaryColor,
    color: '#fff',
    padding: '16px 30px',
    fontSize: '16px',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '8px',
    width: '100%',
    '&:hover': { backgroundColor: '#c06bb0' },
    '&.Mui-disabled': { backgroundColor: '#e0c0d8', color: '#fff' },
});

const BackButton = styled(Button)({
    color: primaryColor,
    fontSize: '14px',
    textTransform: 'none',
    fontWeight: 600,
    marginBottom: '30px',
    padding: 0,
    '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
    '& svg': { marginRight: '6px', fontSize: '18px' },
});

const AdditionalInfoWrapper = styled(Box)({ marginTop: '40px' });

const TextAreaField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#fff',
        height: 'auto',
        '& fieldset': { borderColor },
        '&:hover fieldset': { borderColor: primaryColor },
        '&.Mui-focused fieldset': { borderColor: primaryColor },
    },
    '& .MuiInputBase-inputMultiline': { padding: '12px 14px' },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => `৳${parseFloat(n || 0).toFixed(0)}`;

// ─── Component ────────────────────────────────────────────────────────────────

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [showCoupon, setShowCoupon] = useState(false);
    const [country, setCountry] = useState('BD');
    const [district, setDistrict] = useState('');
    const [validationError, setValidationError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        const fd = new FormData(e.target);

        const firstName   = (fd.get('firstName') || '').trim();
        const lastName    = (fd.get('lastName') || '').trim();
        const email       = (fd.get('email') || '').trim();
        const phone       = (fd.get('phone') || '').trim();
        const street      = (fd.get('streetAddress') || '').trim();
        const addressLine2 = (fd.get('addressLine2') || '').trim();
        const city        = (fd.get('city') || '').trim();
        const postalCode  = (fd.get('postalCode') || '').trim();
        const orderNotes  = (fd.get('orderNotes') || '').trim();

        // ── Client-side validation ────────────────────────────────────────────
        if (!firstName || !lastName)  return setValidationError('First name and last name are required.');
        if (!email)                   return setValidationError('Email address is required.');
        if (!phone)                   return setValidationError('Phone number is required.');
        if (!street)                  return setValidationError('Street address is required.');
        if (!city)                    return setValidationError('Town / City is required.');
        if (!district)                return setValidationError('Please select a district.');
        if (!postalCode)              return setValidationError('Postal code is required.');

        // ── Build API payload ─────────────────────────────────────────────────
        //
        // Each cart item must carry:
        //   { productId, quantity, itemType }
        //
        // The Cart page should set itemType to 'cat' or 'product' when building
        // cartItems.  We fall back to 'product' when the flag is absent so
        // existing product-only carts keep working without changes.
        const items = cartItems.map((item) => ({
            productId: item._id || item.productId,
            quantity:  item.quantity,
            itemType:  item.itemType || 'product', // 'cat' | 'product'
        }));

        const payload = {
            items,
            customerEmail:   email,
            customerName:    `${firstName} ${lastName}`,
            customerPhone:   phone,
            customerAddress: {
                street:     street + (addressLine2 ? `, ${addressLine2}` : ''),
                city,
                district,
                postalCode,
                country:    country === 'BD' ? 'Bangladesh' : country,
            },
            couponCode,
            discount:        discountAmt,
            shippingDistrict: district,
            shippingMethod:  'standard',
            orderNotes,
        };

        setIsSubmitting(true);

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/payment/sslcommerz/initiate`,
                payload
            );

            if (data.success && data.GatewayPageURL) {
                // Redirect the browser to the SSLCommerz payment page
                window.location.href = data.GatewayPageURL;
            } else {
                setValidationError(data.message || 'Payment initiation failed. Please try again.');
            }
        } catch (err) {
            console.error('Payment initiation error:', err);
            const msg =
                err?.response?.data?.message ||
                'Something went wrong. Please try again.';
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
                        <Alert severity="error" sx={{ mb: 3 }}>
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
                                            >
                                                <MenuItem value="BD">Bangladesh</MenuItem>
                                                <MenuItem value="IN">India</MenuItem>
                                                <MenuItem value="PK">Pakistan</MenuItem>
                                                <MenuItem value="US">United States</MenuItem>
                                                <MenuItem value="UK">United Kingdom</MenuItem>
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
                                        />
                                    </FormField>

                                    {/* Address line 2 */}
                                    <FormField>
                                        <TextField
                                            name="addressLine2"
                                            variant="outlined"
                                            fullWidth
                                            placeholder="Apartment, suite, unit, etc. (optional)"
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
                                            >
                                                <MenuItem value=""><em>Select a district</em></MenuItem>
                                                <MenuItem value="dhaka">Dhaka</MenuItem>
                                                <MenuItem value="chittagong">Chittagong</MenuItem>
                                                <MenuItem value="rajshahi">Rajshahi</MenuItem>
                                                <MenuItem value="khulna">Khulna</MenuItem>
                                                <MenuItem value="barisal">Barisal</MenuItem>
                                                <MenuItem value="sylhet">Sylhet</MenuItem>
                                                <MenuItem value="rangpur">Rangpur</MenuItem>
                                                <MenuItem value="mymensingh">Mymensingh</MenuItem>
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
                                                <CircularProgress size={18} sx={{ color: '#fff' }} />
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
                                            fontSize: '13px',
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