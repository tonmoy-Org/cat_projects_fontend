import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  alpha,
  useTheme,
  Divider,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as ClockIcon,
  Inventory2 as BoxIcon,
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../auth/AuthProvider';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useClientApi } from '../../hooks/useClientApi';
import { useOrderStatus } from '../../hooks/useOrderStatus';

export const ClientDashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { useOrders } = useClientApi();
  const { getOrderStatusStyle, getPaymentStatusStyle } = useOrderStatus();
  
  const BLUE = theme.palette.primary.main;
  const GREEN = theme.palette.success.main;
  const WARNING = theme.palette.warning.main;
  const INFO = theme.palette.info.main;
  const TEXT = theme.palette.text.primary;
  const dark = theme.palette.mode === 'dark';
  const BG = theme.palette.background.paper;
  const DIVIDER = theme.palette.divider;

  const { data: ordersData = [], isLoading } = useOrders();

  const stats = useMemo(() => {
    if (!ordersData.length)
      return { totalOrders: 0, totalSpent: 0, completed: 0, pending: 0, shipped: 0, paid: 0, completionRate: 0 };
    
    const totalSpent = ordersData.reduce(
      (s, o) => s + (parseFloat(o.totalAmount) || parseFloat(o.total) || 0), 0
    );
    const completed = ordersData.filter(o => ['delivered', 'completed'].includes((o.orderStatus || o.status || '').toLowerCase())).length;
    const pending = ordersData.filter(o => ['pending'].includes((o.orderStatus || o.status || '').toLowerCase())).length;
    const shipped = ordersData.filter(o => ['shipped'].includes((o.orderStatus || o.status || '').toLowerCase())).length;
    const paid = ordersData.filter(o => ['completed', 'paid'].includes(o.paymentStatus || '')).length;
    
    return {
      totalOrders: ordersData.length,
      totalSpent: totalSpent.toFixed(2),
      completed,
      pending,
      shipped,
      paid,
      completionRate: ordersData.length ? ((completed / ordersData.length) * 100).toFixed(0) : 0,
    };
  }, [ordersData]);

  const recentOrder = useMemo(() => {
    if (!ordersData.length) return null;
    return [...ordersData].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
  }, [ordersData]);

  const recentList = useMemo(() => {
    if (!ordersData.length) return [];
    return [...ordersData]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(1, 5);
  }, [ordersData]);

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingCartIcon sx={{ fontSize: '1rem' }} />, color: BLUE },
    { label: 'Total Spent', value: `৳${parseInt(stats.totalSpent).toLocaleString()}`, icon: <PaymentIcon sx={{ fontSize: '1rem' }} />, color: GREEN },
    { label: 'Delivered', value: stats.completed, icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />, color: GREEN },
    { label: 'In Transit', value: stats.shipped, icon: <ShippingIcon sx={{ fontSize: '1rem' }} />, color: WARNING },
    { label: 'Pending', value: stats.pending, icon: <ClockIcon sx={{ fontSize: '1rem' }} />, color: INFO },
    { label: 'Paid', value: stats.paid, icon: <TrendingUpIcon sx={{ fontSize: '1rem' }} />, color: GREEN },
  ];

  const cardSx = (color) => ({
    borderRadius: 2,
    border: `1px solid ${DIVIDER}`,
    backgroundColor: BG,
    height: '100%',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: color,
      boxShadow: `0 4px 12px ${alpha(color, 0.12)}`,
      transform: 'translateY(-2px)',
    },
  });

  const labelSx = {
    fontSize: '0.65rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: alpha(TEXT, 0.55),
  };

  return (
    <Box>
      <Helmet>
        <title>Dashboard | FatherOfMeow</title>
        <meta name="description" content="Client dashboard" />
      </Helmet>

      <Box
        mb={3}
        p={2.5}
        sx={{
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(BLUE, dark ? 0.25 : 0.1)} 0%, ${alpha(BLUE, dark ? 0.08 : 0.03)} 100%)`,
          border: `1px solid ${alpha(BLUE, 0.2)}`,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar sx={{ bgcolor: alpha(BLUE, 0.15), color: BLUE, width: 44, height: 44 }}>
          <PersonIcon />
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 600, color: TEXT, fontSize: '0.95rem', lineHeight: 1.3 }}>
            Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: alpha(TEXT, 0.55), mt: 0.25 }}>
            Here's a summary of your orders and activity.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map(({ label, value, icon, color }) => (
          <Grid size={{ xs: 6, sm: 4, md: 2 }} key={label}>
            <Card elevation={0} sx={cardSx(color)}>
              <CardContent sx={{ p: '14px !important', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Box sx={{
                  width: 32, height: 32, borderRadius: 1.5,
                  bgcolor: alpha(color, dark ? 0.2 : 0.1),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color,
                }}>
                  {icon}
                </Box>
                <Typography sx={{ fontSize: '1.15rem', fontWeight: 600, color: TEXT, lineHeight: 1 }}>
                  {value}
                </Typography>
                <Typography sx={labelSx}>{label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mb={3} p={2} sx={{ borderRadius: 2, border: `1px solid ${DIVIDER}`, bgcolor: BG }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: TEXT }}>Order Completion Rate</Typography>
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: GREEN }}>{stats.completionRate}%</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={parseFloat(stats.completionRate) || 0}
          sx={{
            height: 6, borderRadius: 3,
            bgcolor: alpha(GREEN, 0.12),
            '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: GREEN },
          }}
        />
        <Box display="flex" justifyContent="space-between" mt={0.75}>
          <Typography sx={{ fontSize: '0.68rem', color: alpha(TEXT, 0.45) }}>{stats.completed} delivered</Typography>
          <Typography sx={{ fontSize: '0.68rem', color: alpha(TEXT, 0.45) }}>{stats.totalOrders} total</Typography>
        </Box>
      </Box>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ ...cardSx(BLUE), height: 'auto' }}>
            <CardContent sx={{ p: '20px !important' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: TEXT }}>
                  Most Recent Order
                </Typography>
                <Box
                  onClick={() => navigate('/client-dashboard/my-orders')}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 0.4,
                    color: BLUE, cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600,
                    '&:hover': { opacity: 0.75 },
                  }}
                >
                  View All <ArrowForwardIcon sx={{ fontSize: '0.8rem' }} />
                </Box>
              </Box>
              {isLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress size={28} />
                </Box>
              ) : recentOrder ? (
                <Box>
                  <Box
                    p={1.5}
                    sx={{
                      borderRadius: 1.5,
                      bgcolor: alpha(BLUE, dark ? 0.1 : 0.05),
                      border: `1px solid ${alpha(BLUE, 0.15)}`,
                      mb: 2,
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ fontWeight: 600, color: BLUE, fontSize: '0.85rem' }}>
                        #{recentOrder.orderId || recentOrder._id?.slice(-8)}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: alpha(TEXT, 0.5) }}>
                        {recentOrder.createdAt
                          ? new Date(recentOrder.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={1.5} mb={2}>
                    {[
                      { label: 'Amount', value: `৳${parseFloat(recentOrder.totalAmount || recentOrder.total || 0).toFixed(2)}`, color: GREEN },
                      { label: 'Items', value: `${recentOrder.items?.length || 0} item${recentOrder.items?.length !== 1 ? 's' : ''}`, color: TEXT },
                    ].map(({ label, value, color }) => (
                      <Grid size={6} key={label}>
                        <Box p={1.25} sx={{ borderRadius: 1.5, border: `1px solid ${DIVIDER}` }}>
                          <Typography sx={labelSx}>{label}</Typography>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color, mt: 0.25 }}>
                            {value}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    {(() => {
                      const s = getOrderStatusStyle(recentOrder.orderStatus || recentOrder.status);
                      return (
                        <Chip
                          label={(recentOrder.orderStatus || recentOrder.status || 'Unknown')}
                          size="small"
                          sx={{
                            fontWeight: 600, fontSize: '0.7rem', height: 24,
                            textTransform: 'capitalize',
                            bgcolor: s.bg, color: s.color, border: `1px solid ${s.color}`,
                          }}
                        />
                      );
                    })()}
                    {(() => {
                      const p = getPaymentStatusStyle(recentOrder.paymentStatus);
                      return (
                        <Chip
                          label={recentOrder.paymentStatus || 'Unknown'}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 600, fontSize: '0.7rem', height: 24,
                            bgcolor: p.bg, color: p.color, borderColor: p.color,
                          }}
                        />
                      );
                    })()}
                  </Box>
                  
                  {recentOrder.items?.length > 0 && (
                    <Box>
                      <Typography sx={{ ...labelSx, mb: 1 }}>Order Items</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                        {recentOrder.items.slice(0, 4).map((item, idx) => (
                          <Box
                            key={idx}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            px={1.25}
                            py={0.75}
                            sx={{ borderRadius: 1.5, border: `1px solid ${DIVIDER}` }}
                          >
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box sx={{
                                width: 28, height: 28, borderRadius: 1,
                                bgcolor: alpha(BLUE, 0.1),
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <BoxIcon sx={{ fontSize: '0.75rem', color: BLUE }} />
                              </Box>
                              <Typography sx={{ fontSize: '0.78rem', color: TEXT, fontWeight: 500 }}>
                                {item.name}
                              </Typography>
                            </Box>
                            <Chip
                              label={`x${item.quantity}`}
                              size="small"
                              sx={{
                                height: 20, fontSize: '0.68rem', fontWeight: 600,
                                bgcolor: alpha(BLUE, 0.1), color: BLUE,
                              }}
                            />
                          </Box>
                        ))}
                        {recentOrder.items.length > 4 && (
                          <Typography sx={{ fontSize: '0.72rem', color: alpha(TEXT, 0.45), textAlign: 'center', pt: 0.5 }}>
                            +{recentOrder.items.length - 4} more item{recentOrder.items.length - 4 > 1 ? 's' : ''}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box py={4} textAlign="center">
                  <ShoppingCartIcon sx={{ fontSize: 40, color: alpha(TEXT, 0.15), mb: 1 }} />
                  <Typography sx={{ fontSize: '0.78rem', color: alpha(TEXT, 0.4) }}>No orders yet</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ ...cardSx(BLUE), height: 'auto' }}>
            <CardContent sx={{ p: '20px !important' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: TEXT }}>
                  Previous Orders
                </Typography>
                <Box
                  onClick={() => navigate('/client-dashboard/my-orders')}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 0.4,
                    color: BLUE, cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600,
                    '&:hover': { opacity: 0.75 },
                  }}
                >
                  See All <ArrowForwardIcon sx={{ fontSize: '0.8rem' }} />
                </Box>
              </Box>
              {isLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress size={28} />
                </Box>
              ) : recentList.length === 0 ? (
                <Box py={4} textAlign="center">
                  <ShoppingCartIcon sx={{ fontSize: 40, color: alpha(TEXT, 0.15), mb: 1 }} />
                  <Typography sx={{ fontSize: '0.78rem', color: alpha(TEXT, 0.4) }}>No previous orders</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {recentList.map((order, idx) => {
                    const s = getOrderStatusStyle(order.orderStatus || order.status);
                    return (
                      <React.Fragment key={order._id}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          py={1.5}
                          px={1}
                          sx={{
                            borderRadius: 1.5,
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                            '&:hover': { bgcolor: alpha(BLUE, dark ? 0.07 : 0.04) },
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Box sx={{
                              width: 36, height: 36, borderRadius: 1.5,
                              bgcolor: alpha(s.color, dark ? 0.18 : 0.1),
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <ShoppingCartIcon sx={{ fontSize: '0.9rem', color: s.color }} />
                            </Box>
                            <Box>
                              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: TEXT }}>
                                #{order.orderId || order._id?.slice(-8)}
                              </Typography>
                              <Typography sx={{ fontSize: '0.68rem', color: alpha(TEXT, 0.45) }}>
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                                  : 'N/A'
                                } · {order.items?.length || 0} items
                              </Typography>
                            </Box>
                          </Box>
                          <Box textAlign="right">
                            <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: GREEN }}>
                              ৳{parseFloat(order.totalAmount || order.total || 0).toFixed(2)}
                            </Typography>
                            <Chip
                              label={(order.orderStatus || order.status || 'Unknown')}
                              size="small"
                              sx={{
                                height: 18, fontSize: '0.62rem', fontWeight: 600,
                                textTransform: 'capitalize',
                                bgcolor: s.bg, color: s.color, mt: 0.25,
                              }}
                            />
                          </Box>
                        </Box>
                        {idx < recentList.length - 1 && (
                          <Divider sx={{ borderColor: alpha(DIVIDER, 0.6) }} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};