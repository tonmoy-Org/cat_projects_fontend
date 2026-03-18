import React, { useState } from 'react';
import {
  Box, Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, TextField,
  Button, Divider, styled, Paper, Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  ShoppingCartOutlined as CartIcon,
  ArrowForward as ArrowForwardIcon,
  LocalOffer as CouponIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import SectionTile from '../../components/SectionTile';

// ─── Theme ───────────────────────────────────────────────────────────────────
const primaryColor = '#db89ca';
const textColor = '#1a1a1a';
const darkGray = '#666666';
const mediumGray = '#e0e0e0';
const lightGray = '#f9f9f9';

// ─── Styled ───────────────────────────────────────────────────────────────────

const CartSection = styled(Box)({
  backgroundColor: '#fff',
  padding: '80px 0',
  minHeight: '60vh',
  '@media (max-width: 600px)': { padding: '40px 0' },
});

const StyledTable = styled(Table)({
  borderCollapse: 'collapse',
  width: '100%',
});

const StyledTh = styled(TableCell)({
  fontWeight: 700,
  fontSize: '13px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: textColor,
  borderBottom: `2px solid ${mediumGray}`,
  padding: '14px 12px',
  backgroundColor: lightGray,
  '&:first-of-type': { borderRadius: '8px 0 0 0' },
  '&:last-of-type': { borderRadius: '0 8px 0 0' },
});

const StyledTd = styled(TableCell)({
  padding: '18px 12px',
  verticalAlign: 'middle',
  borderBottom: `1px solid ${mediumGray}`,
  color: textColor,
  fontSize: '15px',
});

const ProductImg = styled('img')({
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '10px',
  boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
  display: 'block',
});

const RemoveBtn = styled(IconButton)({
  width: '28px',
  height: '28px',
  backgroundColor: '#fff',
  border: `1.5px solid ${mediumGray}`,
  color: darkGray,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#ff4d4f',
    borderColor: '#ff4d4f',
    color: '#fff',
  },
});

const QtyInput = styled(TextField)({
  width: '72px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': { borderColor: mediumGray },
    '&:hover fieldset': { borderColor: primaryColor },
    '&.Mui-focused fieldset': { borderColor: primaryColor },
  },
  '& input': {
    textAlign: 'center',
    padding: '8px 4px',
    fontSize: '15px',
    fontWeight: 600,
    MozAppearance: 'textfield',
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': { WebkitAppearance: 'none' },
  },
});

const CouponInput = styled(TextField)({
  flex: 1,
  maxWidth: '240px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': { borderColor: mediumGray },
    '&:hover fieldset': { borderColor: primaryColor },
    '&.Mui-focused fieldset': { borderColor: primaryColor },
  },
  '& input': { padding: '10px 14px', fontSize: '14px' },
});

const ApplyBtn = styled(Button)({
  backgroundColor: textColor,
  color: '#fff',
  fontWeight: 600,
  fontSize: '13px',
  textTransform: 'none',
  borderRadius: '8px',
  padding: '10px 20px',
  letterSpacing: '0.03em',
  '&:hover': { backgroundColor: '#333' },
});

const UpdateBtn = styled(Button)({
  backgroundColor: '#fff',
  color: textColor,
  fontWeight: 600,
  fontSize: '13px',
  textTransform: 'none',
  borderRadius: '8px',
  padding: '10px 20px',
  border: `1.5px solid ${mediumGray}`,
  letterSpacing: '0.03em',
  '&:hover': { borderColor: primaryColor, color: primaryColor },
  '&:disabled': { opacity: 0.45 },
});

const TotalsCard = styled(Paper)({
  borderRadius: '14px',
  padding: '30px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
  border: `1px solid ${mediumGray}`,
  backgroundColor: '#fff',
  position: 'sticky',
  top: '100px',
});

const TotalsRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '13px 0',
  borderBottom: `1px solid ${mediumGray}`,
  '&:last-of-type': { borderBottom: 'none' },
});

const TotalsLabel = styled(Typography)({
  fontSize: '14px',
  color: darkGray,
  fontWeight: 500,
});

const TotalsValue = styled(Typography)({
  fontSize: '15px',
  color: textColor,
  fontWeight: 600,
});

const CheckoutBtn = styled(Button)({
  backgroundColor: primaryColor,
  color: '#fff',
  fontWeight: 700,
  fontSize: '15px',
  textTransform: 'none',
  borderRadius: '10px',
  padding: '14px 28px',
  width: '100%',
  letterSpacing: '0.03em',
  marginTop: '22px',
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': { backgroundColor: '#c06bb0' },
});

const EmptyCartBox = styled(Box)({
  textAlign: 'center',
  padding: '80px 20px',
  '& svg': { fontSize: '72px', color: mediumGray, marginBottom: '20px' },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n) => `৳${parseFloat(n).toFixed(0)}`;

// ─── Cart Context / Hook ──────────────────────────────────────────────────────
// This component receives cart state as props. Wire it to your global cart state
// (Context, Redux, Zustand, etc.).

const CartPage = ({ cartItems = [], onRemove, onUpdateQty, onClearCart }) => {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  // Local qty state so "Update cart" button can be shown
  const [localQtys, setLocalQtys] = useState(() =>
    Object.fromEntries(cartItems.map((item) => [item._id, item.quantity]))
  );

  const handleQtyChange = (id, val) => {
    const n = Math.max(0, parseInt(val) || 0);
    setLocalQtys((prev) => ({ ...prev, [id]: n }));
    setIsDirty(true);
  };

  const handleUpdateCart = () => {
    cartItems.forEach((item) => {
      const newQty = localQtys[item._id];
      if (newQty === 0) {
        onRemove(item._id);
      } else if (newQty !== item.quantity) {
        onUpdateQty(item._id, newQty);
      }
    });
    setIsDirty(false);
  };

  const handleApplyCoupon = () => {
    // Stub: replace with real coupon validation
    if (coupon.trim().toUpperCase() === 'PETCARE10') {
      setDiscount(0.1);
      setCouponApplied(true);
    } else {
      setCouponApplied(false);
      setDiscount(0);
      alert('Invalid coupon code.');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (localQtys[item._id] ?? item.quantity), 0);
  const discountAmt = subtotal * discount;
  const total = subtotal - discountAmt;

  // Pass cart data to checkout via navigation state
  const handleProceedToCheckout = () => {
    navigate('/checkout', {
      state: {
        cartItems,
        localQtys,
        subtotal,
        discountAmt,
        total,
        couponApplied,
        discount,
      },
    });
  };

  return (
    <Box>
      <SectionTile
        bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg"
        subtitle="Your selections"
        title="Shopping Cart"
        icon={true}
        iconClass="flaticon-custom-icon"
      />

      <CartSection>
        <Container maxWidth="lg">

          {cartItems.length === 0 ? (
            /* ── Empty state ─────────────────────────────────────────────── */
            <EmptyCartBox>
              <CartIcon />
              <Typography sx={{ fontSize: '22px', fontWeight: 700, color: textColor, mb: 1 }}>
                Your cart is empty
              </Typography>
              <Typography sx={{ fontSize: '15px', color: darkGray, mb: 3 }}>
                Looks like you haven't added anything yet.
              </Typography>
              <Button
                component={Link} to="/shop"
                sx={{ backgroundColor: primaryColor, color: '#fff', fontWeight: 600, fontSize: '14px', textTransform: 'none', borderRadius: '8px', padding: '12px 28px', '&:hover': { backgroundColor: '#c06bb0' } }}
              >
                Continue Shopping
              </Button>
            </EmptyCartBox>
          ) : (
            /* ── Cart layout ─────────────────────────────────────────────── */
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 340px' }, gap: '40px', alignItems: 'flex-start' }}>

              {/* ── Left: Cart Table ──────────────────────────────────────── */}
              <Box>
                <TableContainer sx={{ borderRadius: '12px', border: `1px solid ${mediumGray}`, overflow: 'hidden' }}>
                  <StyledTable>
                    <TableHead>
                      <TableRow>
                        <StyledTh sx={{ width: 40 }} />
                        <StyledTh sx={{ width: 100 }}>Image</StyledTh>
                        <StyledTh>Product</StyledTh>
                        <StyledTh>Price</StyledTh>
                        <StyledTh>Quantity</StyledTh>
                        <StyledTh align="right">Subtotal</StyledTh>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => {
                        const qty = localQtys[item._id] ?? item.quantity;
                        return (
                          <TableRow key={item._id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>

                            {/* Remove */}
                            <StyledTd>
                              <RemoveBtn size="small" onClick={() => onRemove(item._id)} aria-label="Remove item">
                                <CloseIcon sx={{ fontSize: '14px' }} />
                              </RemoveBtn>
                            </StyledTd>

                            {/* Thumbnail */}
                            <StyledTd>
                              <Link to={`/shop/${item.title_id}`}>
                                <ProductImg
                                  src={item.featuredImage}
                                  alt={item.title}
                                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }}
                                />
                              </Link>
                            </StyledTd>

                            {/* Name */}
                            <StyledTd>
                              <Link to={`/shop/${item.title_id}`} style={{ textDecoration: 'none', color: textColor, fontWeight: 600, fontSize: '15px', '&:hover': { color: primaryColor } }}>
                                {item.title}
                              </Link>
                              {item.category && (
                                <Typography sx={{ fontSize: '12px', color: darkGray, mt: 0.4 }}>{item.category}</Typography>
                              )}
                            </StyledTd>

                            {/* Price */}
                            <StyledTd>
                              <Typography sx={{ fontSize: '15px', color: darkGray }}>{fmt(item.price)}</Typography>
                            </StyledTd>

                            {/* Qty */}
                            <StyledTd>
                              <QtyInput
                                type="number"
                                value={qty}
                                onChange={(e) => handleQtyChange(item._id, e.target.value)}
                                inputProps={{ min: 0 }}
                                size="small"
                              />
                            </StyledTd>

                            {/* Subtotal */}
                            <StyledTd align="right">
                              <Typography sx={{ fontSize: '15px', fontWeight: 700, color: primaryColor }}>
                                {fmt(item.price * qty)}
                              </Typography>
                            </StyledTd>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </StyledTable>
                </TableContainer>

                {/* ── Actions Row ──────────────────────────────────────────── */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right', flexWrap: 'wrap', gap: 2, mt: 3 }}>
                  {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <CouponIcon sx={{ color: darkGray, fontSize: '20px' }} />
                    <CouponInput
                      placeholder="Coupon code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      size="small"
                    />
                    <ApplyBtn onClick={handleApplyCoupon}>Apply coupon</ApplyBtn>
                    {couponApplied && (
                      <Chip label="10% off applied!" size="small"
                        sx={{ backgroundColor: '#e8f5e9', color: '#388e3c', fontWeight: 600, fontSize: '12px' }} />
                    )}
                  </Box> */}

                  {/* Update cart */}
                  <UpdateBtn onClick={handleUpdateCart} disabled={!isDirty}>
                    Update cart
                  </UpdateBtn>
                </Box>
              </Box>

              {/* ── Right: Cart Totals ────────────────────────────────────── */}
              <TotalsCard elevation={0}>
                <Typography sx={{ fontSize: '20px', fontWeight: 700, color: textColor, mb: 2.5, letterSpacing: '-0.01em' }}>
                  Cart totals
                </Typography>

                <TotalsRow>
                  <TotalsLabel>Subtotal</TotalsLabel>
                  <TotalsValue>{fmt(subtotal)}</TotalsValue>
                </TotalsRow>

                {couponApplied && (
                  <TotalsRow>
                    <TotalsLabel sx={{ color: '#388e3c' }}>Discount (10%)</TotalsLabel>
                    <TotalsValue sx={{ color: '#388e3c' }}>− {fmt(discountAmt)}</TotalsValue>
                  </TotalsRow>
                )}

                <TotalsRow>
                  <TotalsLabel>Shipping</TotalsLabel>
                  <TotalsValue sx={{ color: '#388e3c', fontSize: '13px' }}>Calculated at checkout</TotalsValue>
                </TotalsRow>

                <Divider sx={{ my: 1.5 }} />

                <TotalsRow sx={{ borderBottom: 'none !important' }}>
                  <Typography sx={{ fontSize: '17px', fontWeight: 700, color: textColor }}>Total</Typography>
                  <Typography sx={{ fontSize: '22px', fontWeight: 800, color: primaryColor }}>{fmt(total)}</Typography>
                </TotalsRow>

                <CheckoutBtn onClick={handleProceedToCheckout}>
                  Proceed to Checkout <ArrowForwardIcon sx={{ fontSize: '18px' }} />
                </CheckoutBtn>

                <Button
                  component={Link} to="/shop"
                  sx={{ width: '100%', mt: 1.5, color: darkGray, fontSize: '13px', textTransform: 'none', fontWeight: 500, '&:hover': { color: primaryColor, backgroundColor: 'transparent' } }}
                >
                  ← Continue Shopping
                </Button>
              </TotalsCard>
            </Box>
          )}
        </Container>
      </CartSection>
    </Box>
  );
};

export default CartPage;