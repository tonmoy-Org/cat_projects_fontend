// Order.jsx
import React, { useState } from 'react';
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
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer'; // Icon for coupon
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Icon for payment message
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // Icon for coupon help

// Theme colors
const primaryColor = '#5C4D91';
const primaryLight = '#7A6DB0';
const borderColor = '#eaeaea';
const textColor = '#666';
const backgroundColor = '#f9f9f9';

// Styled components
const OrderSection = styled(Box)({
  backgroundColor: '#ffffff',
  padding: '80px 0',
  width: '100%',
  '@media (max-width: 900px)': {
    padding: '60px 0',
  },
  '@media (max-width: 600px)': {
    padding: '40px 0',
  },
});

const CouponToggle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '30px',
  padding: '16px 20px',
  backgroundColor: backgroundColor,
  borderRadius: '5px',
  border: `1px solid ${borderColor}`,
  fontSize: '16px',
  color: textColor,
  '& svg': {
    color: primaryColor,
    fontSize: '22px',
  },
  '& a': {
    color: primaryColor,
    textDecoration: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const CouponForm = styled(Box)({
  marginBottom: '40px',
  padding: '25px',
  backgroundColor: backgroundColor,
  borderRadius: '5px',
  border: `1px solid ${borderColor}`,
  display: 'none',
  '&.active': {
    display: 'block',
  },
  '& p': {
    marginBottom: '15px',
    color: textColor,
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
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});

const CouponInput = styled(TextField)({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: '5px',
    backgroundColor: '#fff',
    height: '48px',
    '& fieldset': {
      borderColor: borderColor,
    },
    '&:hover fieldset': {
      borderColor: primaryColor,
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 14px',
  },
});

const ApplyButton = styled(Button)({
  backgroundColor: primaryColor,
  color: '#fff',
  padding: '12px 25px',
  fontSize: '15px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '5px',
  minWidth: '120px',
  height: '48px',
  '&:hover': {
    backgroundColor: '#4A3D75',
  },
  '@media (max-width: 600px)': {
    padding: '10px 20px',
    height: '44px',
  },
});

const BillingWrapper = styled(Box)({
  backgroundColor: '#ffffff',
  paddingRight: '30px',
  '@media (max-width: 1200px)': {
    paddingRight: '0',
  },
});

const SectionTitle = styled(Typography)({
  fontSize: '24px',
  fontWeight: 600,
  color: '#1a1a1a',
  marginBottom: '30px',
  '@media (max-width: 600px)': {
    fontSize: '22px',
    marginBottom: '25px',
  },
});

const FormRow = styled(Box)({
  display: 'flex',
  gap: '20px',
  marginBottom: '20px',
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    gap: '15px',
  },
});

const FormField = styled(Box)({
  flex: 1,
  marginBottom: '20px',
  '& .MuiTextField-root, & .MuiFormControl-root': {
    width: '100%',
  },
  '& .MuiInputLabel-root': {
    fontSize: '14px',
    color: textColor,
    '& .optional': {
      color: '#999',
      fontSize: '13px',
      fontWeight: 'normal',
    },
    '& .required': {
      color: '#ff0000',
    },
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '5px',
    backgroundColor: '#fff',
    height: '48px',
    '& fieldset': {
      borderColor: borderColor,
    },
    '&:hover fieldset': {
      borderColor: primaryColor,
    },
    '&.Mui-focused fieldset': {
      borderColor: primaryColor,
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 14px',
  },
  '& .MuiSelect-select': {
    padding: '12px 14px',
  },
  '& .MuiInputBase-inputMultiline': {
    height: 'auto',
  },
});

const Label = styled(Box)({
  fontSize: '14px',
  fontWeight: 500,
  color: '#333',
  marginBottom: '8px',
  '& .required': {
    color: '#ff0000',
  },
  '& .optional': {
    color: '#999',
    fontWeight: 'normal',
  },
});

const OrderSummaryWrapper = styled(Box)({
  backgroundColor: backgroundColor,
  padding: '30px',
  borderRadius: '10px',
  border: `1px solid ${borderColor}`,
  '@media (max-width: 600px)': {
    padding: '20px',
  },
});

// Styled Table components with borders on all sides
const StyledTableContainer = styled(TableContainer)({
  marginBottom: '25px',
  backgroundColor: '#ffffff',
  border: `1px solid ${borderColor}`,
  borderRadius: '5px',
  overflow: 'hidden',
});

const StyledTable = styled(Table)({
  '& .MuiTableCell-root': {
    border: `1px solid ${borderColor}`,
    padding: '15px',
    fontSize: '15px',
    color: textColor,
    backgroundColor: '#f9f9f9',
  },
  '& .MuiTableCell-head': {
    backgroundColor: '#f9f9f9',
    fontWeight: 600,
    color: '#333',
    fontSize: '16px',
    borderBottom: `1px solid ${borderColor}`,
  },
  '& .MuiTableCell-body': {
    '&:last-child': {
      textAlign: 'right',
    },
  },
});

// No background color for total row
const TotalRow = styled(TableRow)({
  '& .MuiTableCell-root': {
    fontWeight: 700,
    color: '#1a1a1a',
    fontSize: '18px',
    backgroundColor: '#f9f9f9',
    borderTop: `2px solid ${borderColor}`, // Slightly thicker top border for total row
  },
});

const PaymentMessage = styled(Box)({
  padding: '20px',
  backgroundColor: '#fff',
  border: `1px solid ${borderColor}`,
  borderRadius: '5px',
  marginBottom: '25px',
  color: textColor,
  fontSize: '15px',
  lineHeight: 1.6,
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  '& svg': {
    color: primaryColor,
    fontSize: '24px',
    flexShrink: 0,
    marginTop: '2px',
  },
});

const PrivacyText = styled(Typography)({
  fontSize: '14px',
  color: textColor,
  lineHeight: 1.7,
  marginBottom: '20px',
  '& a': {
    color: primaryColor,
    textDecoration: 'none',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const PlaceOrderButton = styled(Button)({
  backgroundColor: primaryColor,
  color: '#fff',
  padding: '16px 30px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '5px',
  width: '100%',
  '&:hover': {
    backgroundColor: '#4A3D75',
  },
});

const AdditionalInfoWrapper = styled(Box)({
  marginTop: '40px',
});

const TextAreaField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '5px',
    backgroundColor: '#fff',
    height: 'auto',
    '& fieldset': {
      borderColor: borderColor,
    },
    '&:hover fieldset': {
      borderColor: primaryColor,
    },
  },
  '& .MuiInputBase-inputMultiline': {
    padding: '12px 14px',
  },
});

const Order = () => {
  const [showCoupon, setShowCoupon] = useState(false);
  const [country, setCountry] = useState('US');
  const [state, setState] = useState('CA');

  // Sample order data
  const orderItems = [
    {
      name: 'Small Dog Dish',
      quantity: 2,
      price: 25.00,
      subtotal: 50.00
    }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const total = subtotal; // Add tax/shipping if needed

  return (
    <OrderSection>
      <Container maxWidth="lg">
        {/* Coupon Section with Icon */}
        <Grid container spacing={0}>
          <Grid size={{ xs: 12 }}>
            <CouponToggle>
              <LocalOfferIcon />
              <span>
                Have a coupon?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setShowCoupon(!showCoupon); }}>
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
                <ApplyButton variant="contained">
                  Apply coupon
                </ApplyButton>
              </CouponRow>
            </CouponForm>
          </Grid>
        </Grid>

        {/* Main Checkout Form */}
        <form>
          <Grid container spacing={4}>
            {/* Billing Details Column */}
            <Grid size={{ xs: 12, md: 7 }}>
              <BillingWrapper>
                <SectionTitle>Billing Details</SectionTitle>
                
                {/* First Name & Last Name */}
                <FormRow>
                  <FormField>
                    <Label>First name <span className="required">*</span></Label>
                    <TextField 
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Last name <span className="required">*</span></Label>
                    <TextField 
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </FormField>
                </FormRow>

                {/* Country */}
                <FormField>
                  <Label>Country / Region <span className="required">*</span></Label>
                  <FormControl fullWidth>
                    <Select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="US">United States (US)</MenuItem>
                      <MenuItem value="CA">Canada</MenuItem>
                      <MenuItem value="UK">United Kingdom</MenuItem>
                    </Select>
                  </FormControl>
                </FormField>

                {/* Street Address */}
                <FormField>
                  <Label>Street address <span className="required">*</span></Label>
                  <TextField 
                    variant="outlined"
                    fullWidth
                    required
                    placeholder="House number and street name"
                  />
                </FormField>

                {/* Address Line 2 */}
                <FormField>
                  <TextField 
                    variant="outlined"
                    fullWidth
                    placeholder="Apartment, suite, unit, etc. (optional)"
                  />
                </FormField>

                {/* Town/City */}
                <FormField>
                  <Label>Town / City <span className="required">*</span></Label>
                  <TextField 
                    variant="outlined"
                    fullWidth
                    required
                  />
                </FormField>

                {/* State */}
                <FormField>
                  <Label>State <span className="required">*</span></Label>
                  <FormControl fullWidth>
                    <Select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="AL">Alabama</MenuItem>
                      <MenuItem value="AK">Alaska</MenuItem>
                      <MenuItem value="AZ">Arizona</MenuItem>
                      <MenuItem value="AR">Arkansas</MenuItem>
                      <MenuItem value="CA">California</MenuItem>
                      <MenuItem value="CO">Colorado</MenuItem>
                      <MenuItem value="CT">Connecticut</MenuItem>
                      <MenuItem value="DE">Delaware</MenuItem>
                      <MenuItem value="FL">Florida</MenuItem>
                      <MenuItem value="GA">Georgia</MenuItem>
                    </Select>
                  </FormControl>
                </FormField>

                {/* ZIP Code */}
                <FormField>
                  <Label>ZIP Code <span className="required">*</span></Label>
                  <TextField 
                    variant="outlined"
                    fullWidth
                    required
                  />
                </FormField>

                {/* Phone */}
                <FormField>
                  <Label>Phone <span className="optional">(optional)</span></Label>
                  <TextField 
                    variant="outlined"
                    fullWidth
                  />
                </FormField>

                {/* Email */}
                <FormField>
                  <Label>Email address <span className="required">*</span></Label>
                  <TextField 
                    variant="outlined"
                    fullWidth
                    required
                    type="email"
                  />
                </FormField>

                {/* Additional Information */}
                <AdditionalInfoWrapper>
                  <SectionTitle>Additional information</SectionTitle>
                  
                  <FormField>
                    <Label>Order notes <span className="optional">(optional)</span></Label>
                    <TextAreaField 
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

            {/* Order Summary Column */}
            <Grid size={{ xs: 12, md: 5 }}>
              <OrderSummaryWrapper>
                <SectionTitle>Your order</SectionTitle>
                
                {/* Order Summary Table with borders on all sides */}
                <StyledTableContainer>
                  <StyledTable>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Order Items */}
                      {orderItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {item.name} <strong>× {item.quantity}</strong>
                          </TableCell>
                          <TableCell align="right">
                            ${item.subtotal.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Subtotal Row */}
                      <TableRow>
                        <TableCell>Subtotal</TableCell>
                        <TableCell align="right">${subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                      
                      {/* Total Row - No background color */}
                      <TotalRow>
                        <TableCell>Total</TableCell>
                        <TableCell align="right">${total.toFixed(2)}</TableCell>
                      </TotalRow>
                    </TableBody>
                  </StyledTable>
                </StyledTableContainer>

                {/* Payment Message with Icon */}
                <PaymentMessage>
                  <ErrorOutlineIcon />
                  <span>
                    Sorry, it seems that there are no available payment methods. 
                    Please contact us if you require assistance or wish to make alternate arrangements.
                  </span>
                </PaymentMessage>

                {/* Privacy Policy */}
                <PrivacyText>
                  Your personal data will be used to process your order, support your experience 
                  throughout this website, and for other purposes described in our{' '}
                  <a href="/privacy-policy">privacy policy</a>.
                </PrivacyText>

                {/* Place Order Button */}
                <PlaceOrderButton variant="contained">
                  Place order
                </PlaceOrderButton>
              </OrderSummaryWrapper>
            </Grid>
          </Grid>
        </form>
      </Container>
    </OrderSection>
  );
};

export default Order;