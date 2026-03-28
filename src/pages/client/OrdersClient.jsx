import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    Card,
    CardContent,
    CircularProgress,
    alpha,
    useTheme,
    Tooltip,
    DialogActions,
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    ShoppingCart as ShoppingCartIcon,
    TrendingUp as TrendingUpIcon,
    LocalShipping as ShippingIcon,
    Payment as PaymentIcon,
    CheckCircle as CheckCircleIcon,
    AccessTime as ClockIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../../auth/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';
import { Helmet } from 'react-helmet-async';
import OutlineButton from '../../components/ui/OutlineButton';
import StyledTextField from '../../components/ui/StyledTextField';

export default function OrdersClient() {
    const theme = useTheme();
    const { user } = useAuth();

    // ── Theme tokens ───────────────────────────────────────────────────────
    const BLUE_COLOR = theme.palette.primary.main;
    const GREEN_COLOR = theme.palette.success.main;
    const WARNING_COLOR = theme.palette.warning.main;
    const INFO_COLOR = theme.palette.info.main;
    const TEXT_PRIMARY = theme.palette.text.primary;

    // ── State ──────────────────────────────────────────────────────────────
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // ── Fetch Orders ───────────────────────────────────────────────────────
    const { data: ordersData = [], isLoading } = useQuery({
        queryKey: ['client-orders', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosInstance.get(`/orders/${user.email}`);
            const orders = res.data.orders || res.data.data || res.data || [];
            return Array.isArray(orders) ? orders : [];
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!user?.email,
    });

    // ── Search filter ──────────────────────────────────────────────────────
    const filteredOrders = useMemo(() => {
        if (!searchQuery.trim()) return ordersData;
        const query = searchQuery.toLowerCase();
        return ordersData.filter(order =>
            (order.orderId || order._id)?.toLowerCase().includes(query) ||
            (order.orderStatus || order.status)?.toLowerCase().includes(query) ||
            (order.paymentStatus)?.toLowerCase().includes(query)
        );
    }, [ordersData, searchQuery]);

    // ── Pagination ─────────────────────────────────────────────────────────
    const paginatedOrders = useMemo(() => {
        return filteredOrders.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );
    }, [filteredOrders, page, rowsPerPage]);

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    React.useEffect(() => {
        setPage(0);
    }, [searchQuery]);

    // ── Statistics ─────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        if (!ordersData.length) {
            return {
                totalOrders: 0, totalSpent: 0, completedOrders: 0,
                pendingOrders: 0, shippedOrders: 0, paidOrders: 0,
                avgOrderValue: 0, completionRate: 0,
            };
        }
        const totalSpent = ordersData.reduce((sum, o) =>
            sum + (parseFloat(o.totalAmount) || parseFloat(o.total) || 0), 0);
        const completedOrders = ordersData.filter(
            o => o.orderStatus === 'delivered' || o.status === 'completed'
        ).length;
        const pendingOrders = ordersData.filter(
            o => o.orderStatus === 'pending' || o.status === 'pending'
        ).length;
        const shippedOrders = ordersData.filter(
            o => o.orderStatus === 'shipped' || o.status === 'shipped'
        ).length;
        const paidOrders = ordersData.filter(
            o => o.paymentStatus === 'completed' || o.paymentStatus === 'paid'
        ).length;
        return {
            totalOrders: ordersData.length,
            totalSpent: totalSpent.toFixed(2),
            completedOrders,
            pendingOrders,
            shippedOrders,
            paidOrders,
            avgOrderValue: (totalSpent / ordersData.length).toFixed(2),
            completionRate: ((completedOrders / ordersData.length) * 100).toFixed(1),
        };
    }, [ordersData]);

    // ── Status helpers ─────────────────────────────────────────────────────
    const getOrderStatusStyle = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'delivered':
            case 'completed':
                return {
                    backgroundColor: alpha(GREEN_COLOR, theme.palette.mode === 'dark' ? 0.2 : 0.1),
                    color: GREEN_COLOR,
                    borderColor: GREEN_COLOR,
                };
            case 'shipped':
                return {
                    backgroundColor: alpha(WARNING_COLOR, theme.palette.mode === 'dark' ? 0.2 : 0.1),
                    color: WARNING_COLOR,
                    borderColor: WARNING_COLOR,
                };
            case 'pending':
                return {
                    backgroundColor: alpha(INFO_COLOR, theme.palette.mode === 'dark' ? 0.2 : 0.1),
                    color: INFO_COLOR,
                    borderColor: INFO_COLOR,
                };
            case 'cancelled':
                return {
                    backgroundColor: alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.2 : 0.1),
                    color: theme.palette.error.main,
                    borderColor: theme.palette.error.main,
                };
            default:
                return {};
        }
    };

    const getPaymentStatusStyle = (status) => {
        const isPaid = status === 'paid' || status === 'completed';
        return {
            backgroundColor: alpha(
                isPaid ? GREEN_COLOR : theme.palette.error.main,
                theme.palette.mode === 'dark' ? 0.2 : 0.1
            ),
            color: isPaid ? GREEN_COLOR : theme.palette.error.main,
            borderColor: isPaid ? GREEN_COLOR : theme.palette.error.main,
        };
    };

    // ── Handlers ───────────────────────────────────────────────────────────
    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setViewDialogOpen(true);
    };

    const handleCloseViewDialog = () => {
        setViewDialogOpen(false);
        setSelectedOrder(null);
    };

    // ── Stat cards config ──────────────────────────────────────────────────
    const statCards = [
        {
            label: 'Total Orders',
            value: stats.totalOrders,
            icon: <ShoppingCartIcon sx={{ fontSize: '1.1rem' }} />,
            color: BLUE_COLOR,
            trend: `${stats.completedOrders} completed`,
        },
        {
            label: 'Total Spent',
            value: `৳${parseInt(stats.totalSpent).toLocaleString()}`,
            icon: <PaymentIcon sx={{ fontSize: '1.1rem' }} />,
            color: GREEN_COLOR,
            trend: `Avg ৳${parseInt(stats.avgOrderValue).toLocaleString()}`,
        },
        {
            label: 'Delivered',
            value: stats.completedOrders,
            icon: <CheckCircleIcon sx={{ fontSize: '1.1rem' }} />,
            color: GREEN_COLOR,
            trend: `${stats.completionRate}% completion`,
        },
        {
            label: 'In Transit',
            value: stats.shippedOrders,
            icon: <ShippingIcon sx={{ fontSize: '1.1rem' }} />,
            color: WARNING_COLOR,
            trend: 'On the way',
        },
        {
            label: 'Pending',
            value: stats.pendingOrders,
            icon: <ClockIcon sx={{ fontSize: '1.1rem' }} />,
            color: INFO_COLOR,
            trend: 'Awaiting confirmation',
        },
        {
            label: 'Paid',
            value: stats.paidOrders,
            icon: <TrendingUpIcon sx={{ fontSize: '1.1rem' }} />,
            color: GREEN_COLOR,
            trend: 'Payment confirmed',
        },
    ];

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <Box>
            <Helmet>
                <title>My Orders | PetCare</title>
            </Helmet>

            {/* Header */}
            <Box mb={3}>
                <Typography sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '1rem' }}>
                    My Orders
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.75rem', color: TEXT_PRIMARY }}>
                    Track and manage all your orders
                </Typography>
            </Box>

            {/* Stat Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {statCards.map(({ label, value, icon, color, trend }) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={label}>
                        <Tooltip title={trend} arrow>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 2,
                                    border: `1px solid ${theme.palette.divider}`,
                                    backgroundColor: theme.palette.background.paper,
                                    height: '100%',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: color,
                                        boxShadow: `0 4px 12px ${alpha(color, 0.1)}`,
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: '14px !important', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                                    <Box sx={{
                                        width: 36, height: 36, borderRadius: 1.5,
                                        backgroundColor: alpha(color, theme.palette.mode === 'dark' ? 0.2 : 0.1),
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color,
                                    }}>
                                        {icon}
                                    </Box>
                                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: TEXT_PRIMARY, lineHeight: 1 }}>
                                        {value}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.7rem', color: alpha(TEXT_PRIMARY, 0.6), fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                                        {label}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: alpha(TEXT_PRIMARY, 0.5) }}>
                                        <TrendingUpIcon sx={{ fontSize: '0.75rem' }} />
                                        <Typography sx={{ fontSize: '0.7rem' }}>{trend}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Tooltip>
                    </Grid>
                ))}
            </Grid>

            {/* Search */}
            <Box mb={3}>
                <StyledTextField
                    fullWidth
                    placeholder="Search orders by ID, status, or payment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: TEXT_PRIMARY, fontSize: '0.9rem', opacity: 0.7 }} />,
                    }}
                    size="small"
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem', color: TEXT_PRIMARY } }}
                />
            </Box>

            {/* Orders Table */}
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    overflow: 'auto',
                    mb: 3,
                    position: 'relative',
                    minHeight: 380,
                }}
            >
                {isLoading && (
                    <Box
                        position="absolute" top={0} left={0} right={0} bottom={0}
                        display="flex" alignItems="center" justifyContent="center"
                        bgcolor="rgba(255,255,255,0.7)" zIndex={1}
                    >
                        <CircularProgress />
                    </Box>
                )}
                <Table size="medium">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: alpha(BLUE_COLOR, theme.palette.mode === 'dark' ? 0.1 : 0.05) }}>
                            {['Order ID', 'Date', 'Amount', 'Items', 'Status', 'Payment', 'Actions'].map((label) => (
                                <TableCell
                                    key={label}
                                    align={label === 'Actions' ? 'right' : 'left'}
                                    sx={{
                                        fontWeight: 600,
                                        color: TEXT_PRIMARY,
                                        borderBottom: `2px solid ${BLUE_COLOR}`,
                                        fontSize: '0.85rem',
                                        py: 1.5,
                                    }}
                                >
                                    {label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                    <Box py={3}>
                                        <ShoppingCartIcon sx={{ fontSize: 48, color: alpha(TEXT_PRIMARY, 0.2), mb: 2 }} />
                                        <Typography variant="body2" sx={{ fontSize: '0.85rem', color: TEXT_PRIMARY }}>
                                            {searchQuery ? 'No orders found matching your search' : 'No orders yet. Start shopping!'}
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedOrders.map((order) => (
                                <TableRow
                                    key={order._id}
                                    hover
                                    sx={{
                                        '&:hover': { backgroundColor: alpha(BLUE_COLOR, theme.palette.mode === 'dark' ? 0.05 : 0.03) },
                                        '&:last-child td': { borderBottom: 0 },
                                    }}
                                >
                                    <TableCell sx={{ py: 1.5 }}>
                                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.85rem', color: TEXT_PRIMARY }}>
                                            #{order.orderId || order._id?.slice(-8)}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ py: 1.5 }}>
                                        <Typography variant="body2" sx={{ fontSize: '0.85rem', color: TEXT_PRIMARY }}>
                                            {order.createdAt
                                                ? new Date(order.createdAt).toLocaleDateString()
                                                : 'N/A'}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ py: 1.5 }}>
                                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.85rem', color: GREEN_COLOR }}>
                                            ৳{parseFloat(order.totalAmount || order.total || 0).toFixed(2)}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ py: 1.5 }}>
                                        <Typography variant="body2" sx={{ fontSize: '0.85rem', color: TEXT_PRIMARY }}>
                                            {order.items?.length || 0} items
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ py: 1.5 }}>
                                        <Chip
                                            label={(order.orderStatus || order.status || 'Unknown').toLowerCase()}
                                            size="small"
                                            sx={{
                                                fontWeight: 500,
                                                fontSize: '0.75rem',
                                                height: 24,
                                                textTransform: 'capitalize',
                                                ...getOrderStatusStyle(order.orderStatus || order.status),
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell sx={{ py: 1.5 }}>
                                        <Chip
                                            label={order.paymentStatus || 'Unknown'}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                fontWeight: 500,
                                                fontSize: '0.75rem',
                                                height: 24,
                                                ...getPaymentStatusStyle(order.paymentStatus),
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell align="right" sx={{ py: 1.5 }}>
                                        <Tooltip title="View Order">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewOrder(order)}
                                                sx={{ color: BLUE_COLOR, fontSize: '0.9rem' }}
                                            >
                                                <VisibilityIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredOrders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        borderTop: `1px solid ${theme.palette.divider}`,
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            fontSize: '0.8rem',
                            color: TEXT_PRIMARY,
                        },
                    }}
                />
            </TableContainer>

            {/* View Order Dialog */}
            <Dialog
                open={viewDialogOpen}
                onClose={handleCloseViewDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2 } }}
            >
                <DialogTitle sx={{
                    color: TEXT_PRIMARY, fontWeight: 600, fontSize: '1rem',
                    py: 2, px: 3, borderBottom: `1px solid ${theme.palette.divider}`,
                }}>
                    Order Details
                </DialogTitle>
                <DialogContent sx={{ px: 3, py: 2 }}>
                    {selectedOrder && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            {[
                                { label: 'Order ID', value: `#${selectedOrder.orderId || selectedOrder._id}` },
                                { label: 'Order Date', value: selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : 'N/A' },
                            ].map(({ label, value }) => (
                                <Box key={label}>
                                    <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.3px' }}>
                                        {label}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.9rem', mt: 0.25 }}>
                                        {value}
                                    </Typography>
                                </Box>
                            ))}

                            <Box>
                                <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.3px' }}>
                                    Total Amount
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: GREEN_COLOR, fontSize: '1rem', mt: 0.25 }}>
                                    ৳{parseFloat(selectedOrder.totalAmount || selectedOrder.total || 0).toFixed(2)}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.3px' }}>
                                    Order Status
                                </Typography>
                                <Box mt={0.5}>
                                    <Chip
                                        label={(selectedOrder.orderStatus || selectedOrder.status || 'Unknown')}
                                        size="small"
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: '0.75rem',
                                            height: 24,
                                            textTransform: 'capitalize',
                                            ...getOrderStatusStyle(selectedOrder.orderStatus || selectedOrder.status),
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Box>
                                <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.3px' }}>
                                    Payment Status
                                </Typography>
                                <Box mt={0.5}>
                                    <Chip
                                        label={selectedOrder.paymentStatus || 'Unknown'}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: '0.75rem',
                                            height: 24,
                                            ...getPaymentStatusStyle(selectedOrder.paymentStatus),
                                        }}
                                    />
                                </Box>
                            </Box>

                            {selectedOrder.items?.length > 0 && (
                                <Box>
                                    <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.3px' }}>
                                        Items ({selectedOrder.items.length})
                                    </Typography>
                                    <Box mt={1} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        {selectedOrder.items.map((item, idx) => (
                                            <Box key={idx} display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: TEXT_PRIMARY }}>
                                                    {item.name}
                                                </Typography>
                                                <Chip
                                                    label={`x${item.quantity}`}
                                                    size="small"
                                                    sx={{
                                                        fontSize: '0.7rem',
                                                        height: 20,
                                                        backgroundColor: alpha(BLUE_COLOR, 0.1),
                                                        color: BLUE_COLOR,
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <OutlineButton onClick={handleCloseViewDialog} size="medium" sx={{ fontSize: '0.85rem', px: 2 }}>
                        Close
                    </OutlineButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
}