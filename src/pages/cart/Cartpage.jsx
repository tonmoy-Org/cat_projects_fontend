import React, { useState } from 'react';
import {
  Box, Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, TextField,
  Button, Divider, styled, Paper, useTheme, useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  ShoppingCartOutlined as CartIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import SectionTile from '../../components/SectionTile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';

// ─── Theme ───────────────────────────────────────────────────────────────────
const primaryColor = '#db89ca';
const textColor = '#1a1a1a';
const darkGray = '#666666';
const mediumGray = '#e0e0e0';
const lightGray = '#f9f9f9';

// ─── Styled ───────────────────────────────────────────────────────────────────

const CartSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  padding: '80px 0',
  minHeight: '60vh',
  [theme.breakpoints.down('md')]: { padding: '60px 0' },
  [theme.breakpoints.down('sm')]: { padding: '40px 0' },
}));

const StyledTable = styled(Table)({
  borderCollapse: 'collapse',
  width: '100%',
});

const StyledTh = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '12px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: textColor,
  borderBottom: `2px solid ${mediumGray}`,
  padding: '12px 12px',
  backgroundColor: lightGray,
  '&:first-of-type': { borderRadius: '8px 0 0 0' },
  '&:last-of-type': { borderRadius: '0 8px 0 0' },
  [theme.breakpoints.down('sm')]: {
    fontSize: '10px',
    padding: '8px 8px',
  },
}));

const StyledTd = styled(TableCell)(({ theme }) => ({
  padding: '14px 12px',
  verticalAlign: 'middle',
  borderBottom: `1px solid ${mediumGray}`,
  color: textColor,
  fontSize: '14px',
  [theme.breakpoints.down('sm')]: {
    padding: '10px 8px',
    fontSize: '12px',
  },
}));

const ProductImg = styled('img')(({ theme }) => ({
  width: '70px',
  height: '70px',
  objectFit: 'cover',
  borderRadius: '10px',
  boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
  display: 'block',
  [theme.breakpoints.down('sm')]: {
    width: '55px',
    height: '55px',
  },
}));

const RemoveBtn = styled(IconButton)({
  width: '26px',
  height: '26px',
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

const QtyInput = styled(TextField)(({ theme }) => ({
  width: '65px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': { borderColor: mediumGray },
    '&:hover fieldset': { borderColor: primaryColor },
    '&.Mui-focused fieldset': { borderColor: primaryColor },
  },
  '& input': {
    textAlign: 'center',
    padding: '6px 4px',
    fontSize: '13px',
    fontWeight: 600,
    MozAppearance: 'textfield',
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': { WebkitAppearance: 'none' },
  },
  [theme.breakpoints.down('sm')]: {
    width: '55px',
    '& input': {
      padding: '5px 4px',
      fontSize: '12px',
    },
  },
}));

const UpdateBtn = styled(Button)(({ theme }) => ({
  backgroundColor: '#fff',
  color: textColor,
  fontWeight: 600,
  fontSize: '12px',
  textTransform: 'none',
  borderRadius: '3px',
  padding: '8px 22px',
  border: `1.5px solid ${mediumGray}`,
  letterSpacing: '0.03em',
  '&:hover': { borderColor: primaryColor, color: primaryColor },
  '&:disabled': { opacity: 0.45 },
  [theme.breakpoints.down('sm')]: {
    padding: '7px 18px',
    fontSize: '11px',
  },
}));

const TotalsCard = styled(Paper)(({ theme }) => ({
  borderRadius: '4px',
  padding: '26px',
  border: `1px solid ${mediumGray}`,
  backgroundColor: '#fff',
  position: 'sticky',
  top: '100px',
  [theme.breakpoints.down('md')]: {
    position: 'static',
    padding: '22px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '18px',
  },
}));

const TotalsRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '11px 0',
  borderBottom: `1px solid ${mediumGray}`,
  '&:last-of-type': { borderBottom: 'none' },
});

const TotalsLabel = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  color: darkGray,
  fontWeight: 500,
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
}));

const TotalsValue = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: textColor,
  fontWeight: 600,
  [theme.breakpoints.down('sm')]: {
    fontSize: '13px',
  },
}));

const CheckoutBtn = styled(Button)(({ theme }) => ({
  backgroundColor: primaryColor,
  color: '#fff',
  fontWeight: 700,
  fontSize: '14px',
  textTransform: 'none',
  borderRadius: '10px',
  padding: '12px 24px',
  width: '100%',
  letterSpacing: '0.03em',
  marginTop: '20px',
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': { backgroundColor: '#c06bb0' },
  [theme.breakpoints.down('sm')]: {
    fontSize: '13px',
    padding: '10px 20px',
  },
}));

const EmptyCartBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: '70px 20px',
  '& svg': { fontSize: '64px', color: mediumGray, marginBottom: '18px' },
  [theme.breakpoints.down('sm')]: {
    padding: '50px 20px',
    '& svg': { fontSize: '56px' },
  },
}));

const MobileProductInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
});

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
  gap: '14px',
  marginTop: '22px',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    gap: '10px',
  },
}));

const CartLayout = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: '36px',
  alignItems: 'flex-start',
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1fr 320px',
  },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n) => `৳${parseFloat(n).toFixed(0)}`;

// ─── API ─────────────────────────────────────────────────────────────────────

const updateCartItem = async ({ itemId, quantity }) => {
  const { data } = await axiosInstance.put(`/cart/item/${itemId}`, { quantity });
  return data.cart;
};

// ─── Component ───────────────────────────────────────────────────────────────

const CartPage = ({ cartItems = [], onRemove, onUpdateQty, onClearCart }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const queryClient = useQueryClient();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  // Local qty state so "Update cart" button can be shown
  const [localQtys, setLocalQtys] = useState(() =>
    Object.fromEntries(cartItems.map((item) => [item._id, item.quantity]))
  );

  // ─── Mutation ───────────────────────────────────────────────────────────
  const { mutate: updateItem, isPending: isUpdating } = useMutation({
    mutationFn: updateCartItem,
    onSuccess: (updatedCart) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setIsDirty(false);
    },
    onError: (err) => {
      console.error('Failed to update cart item:', err);
      alert('Could not update cart. Please try again.');
    },
  });

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
        updateItem(
          { itemId: item._id, quantity: newQty },
          {
            onSuccess: () => {
              onUpdateQty(item._id, newQty);
            },
          }
        );
      }
    });
    setIsDirty(false);
  };

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'FatherOfMeow10') {
      setDiscount(0.1);
      setCouponApplied(true);
    } else {
      setCouponApplied(false);
      setDiscount(0);
      alert('Invalid coupon code.');
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (localQtys[item._id] ?? item.quantity),
    0
  );
  const discountAmt = subtotal * discount;
  const total = subtotal - discountAmt;

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

  // Mobile card view for cart items
  const MobileCartItem = ({ item }) => {
    const qty = localQtys[item._id] ?? item.quantity;
    
    return (
      <Paper sx={{ p: 2, mb: 2, borderRadius: '12px', border: `1px solid ${mediumGray}` }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link to={`/shop/${item.title_id}`}>
            <ProductImg
              src={item.featuredImage}
              alt={item.title}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }}
            />
          </Link>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <MobileProductInfo>
                <Link to={`/shop/${item.title_id}`} style={{ textDecoration: 'none', color: textColor, fontWeight: 600, fontSize: '14px' }}>
                  {item.title || item.name}
                </Link>
                {item.category && (
                  <Typography sx={{ fontSize: '11px', color: darkGray }}>{item.category}</Typography>
                )}
                {item.breed && (
                  <Typography sx={{ fontSize: '11px', color: darkGray }}>{item.breed}</Typography>
                )}
              </MobileProductInfo>
              <RemoveBtn size="small" onClick={() => onRemove(item._id)} aria-label="Remove item">
                <CloseIcon sx={{ fontSize: '13px' }} />
              </RemoveBtn>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '12px', color: darkGray, mb: 0.5 }}>Price</Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: textColor }}>{fmt(item.price)}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '12px', color: darkGray, mb: 0.5 }}>Quantity</Typography>
                <QtyInput
                  type="number"
                  value={qty}
                  onChange={(e) => handleQtyChange(item._id, e.target.value)}
                  inputProps={{ min: 0 }}
                  size="small"
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '12px', color: darkGray, mb: 0.5 }}>Subtotal</Typography>
                <Typography sx={{ fontSize: '15px', fontWeight: 700, color: primaryColor }}>
                  {fmt(item.price * qty)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    );
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
              <Typography sx={{ fontSize: { xs: '18px', sm: '20px' }, fontWeight: 700, color: textColor, mb: 1 }}>
                Your cart is empty
              </Typography>
              <Typography sx={{ fontSize: { xs: '13px', sm: '14px' }, color: darkGray, mb: 3 }}>
                Looks like you haven't added anything yet.
              </Typography>
              <Button
                component={Link} to="/shop"
                sx={{ backgroundColor: primaryColor, color: '#fff', fontWeight: 600, fontSize: '13px', textTransform: 'none', borderRadius: '8px', padding: { xs: '8px 22px', sm: '10px 26px' }, '&:hover': { backgroundColor: '#c06bb0' } }}
              >
                Continue Shopping
              </Button>
            </EmptyCartBox>
          ) : (
            /* ── Cart layout ─────────────────────────────────────────────── */
            <CartLayout>

              {/* ── Left: Cart Items ──────────────────────────────────────── */}
              <Box>
                {isMobile ? (
                  // Mobile view - Card layout
                  <>
                    {cartItems.map((item) => (
                      <MobileCartItem key={item._id} item={item} />
                    ))}
                    <ActionButtons>
                      <UpdateBtn onClick={handleUpdateCart} disabled={!isDirty || isUpdating}>
                        {isUpdating ? 'Updating…' : 'Update Cart'}
                      </UpdateBtn>
                    </ActionButtons>
                  </>
                ) : (
                  // Desktop/Tablet view - Table layout
                  <>
                    <TableContainer sx={{ borderRadius: '12px', border: `1px solid ${mediumGray}`, overflow: 'auto' }}>
                      <StyledTable>
                        <TableHead>
                          <TableRow>
                            <StyledTh sx={{ width: 40 }} />
                            <StyledTh sx={{ width: 90 }}>Image</StyledTh>
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
                                <StyledTd>
                                  <RemoveBtn size="small" onClick={() => onRemove(item._id)} aria-label="Remove item">
                                    <CloseIcon sx={{ fontSize: '13px' }} />
                                  </RemoveBtn>
                                </StyledTd>
                                <StyledTd>
                                  <Link to={`/shop/${item.title_id}`}>
                                    <ProductImg
                                      src={item.featuredImage}
                                      alt={item.title}
                                      onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }}
                                    />
                                  </Link>
                                </StyledTd>
                                <StyledTd>
                                  <Link to={`/shop/${item.title_id}`} style={{ textDecoration: 'none', color: textColor, fontWeight: 600, fontSize: '14px' }}>
                                    {item.title || item.name}
                                  </Link>
                                  {item.category && (
                                    <Typography sx={{ fontSize: '11px', color: darkGray, mt: 0.4 }}>{item.category}</Typography>
                                  )}
                                  {item.breed && (
                                    <Typography sx={{ fontSize: '11px', color: darkGray, mt: 0.4 }}>{item.breed}</Typography>
                                  )}
                                </StyledTd>
                                <StyledTd>
                                  <Typography sx={{ fontSize: '14px', color: darkGray }}>{fmt(item.price)}</Typography>
                                </StyledTd>
                                <StyledTd>
                                  <QtyInput
                                    type="number"
                                    value={qty}
                                    onChange={(e) => handleQtyChange(item._id, e.target.value)}
                                    inputProps={{ min: 0 }}
                                    size="small"
                                  />
                                </StyledTd>
                                <StyledTd align="right">
                                  <Typography sx={{ fontSize: '14px', fontWeight: 700, color: primaryColor }}>
                                    {fmt(item.price * qty)}
                                  </Typography>
                                </StyledTd>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </StyledTable>
                    </TableContainer>

                    <ActionButtons>
                      <UpdateBtn onClick={handleUpdateCart} disabled={!isDirty || isUpdating}>
                        {isUpdating ? 'Updating…' : 'Update Cart'}
                      </UpdateBtn>
                    </ActionButtons>
                  </>
                )}
              </Box>

              {/* ── Right: Cart Totals ────────────────────────────────────── */}
              <TotalsCard elevation={0}>
                <Typography sx={{ fontSize: { xs: '17px', sm: '18px' }, fontWeight: 700, color: textColor, mb: 2, letterSpacing: '-0.01em' }}>
                  Cart totals
                </Typography>

                <TotalsRow>
                  <TotalsLabel>Subtotal</TotalsLabel>
                  <TotalsValue>{fmt(subtotal)}</TotalsValue>
                </TotalsRow>

                {/* Coupon Section */}
                <Box sx={{ mt: 1.5, mb: 1.5 }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <TextField
                      size="small"
                      placeholder="Coupon code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      sx={{ 
                        flex: 1, 
                        minWidth: '120px',
                        '& .MuiInputBase-input': {
                          fontSize: '12px',
                          padding: '8px 12px',
                        },
                      }}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      sx={{
                        backgroundColor: textColor,
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '11px',
                        textTransform: 'none',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        whiteSpace: 'nowrap',
                        '&:hover': { backgroundColor: '#333' },
                      }}
                    >
                      Apply Coupon
                    </Button>
                  </Box>
                  {couponApplied && (
                    <Typography sx={{ fontSize: '11px', color: '#388e3c', mt: 1 }}>
                      ✓ Coupon applied! 10% discount
                    </Typography>
                  )}
                </Box>

                {couponApplied && (
                  <TotalsRow>
                    <TotalsLabel sx={{ color: '#388e3c' }}>Discount (10%)</TotalsLabel>
                    <TotalsValue sx={{ color: '#388e3c' }}>− {fmt(discountAmt)}</TotalsValue>
                  </TotalsRow>
                )}

                <TotalsRow>
                  <TotalsLabel>Shipping</TotalsLabel>
                  <TotalsValue sx={{ color: '#388e3c', fontSize: '12px' }}>Calculated at checkout</TotalsValue>
                </TotalsRow>

                <Divider sx={{ my: 1 }} />

                <TotalsRow sx={{ borderBottom: 'none !important' }}>
                  <Typography sx={{ fontSize: { xs: '15px', sm: '16px' }, fontWeight: 700, color: textColor }}>Total</Typography>
                  <Typography sx={{ fontSize: { xs: '18px', sm: '20px' }, fontWeight: 800, color: primaryColor }}>{fmt(total)}</Typography>
                </TotalsRow>

                <CheckoutBtn onClick={handleProceedToCheckout}>
                  Proceed to Checkout <ArrowForwardIcon sx={{ fontSize: '16px' }} />
                </CheckoutBtn>

                <Button
                  component={Link} to="/"
                  sx={{ width: '100%', mt: 1.5, color: darkGray, fontSize: '12px', textTransform: 'none', fontWeight: 500, '&:hover': { color: primaryColor, backgroundColor: 'transparent' } }}
                >
                  ← Continue Shopping
                </Button>
              </TotalsCard>
            </CartLayout>
          )}
        </Container>
      </CartSection>
    </Box>
  );
};

export default CartPage;