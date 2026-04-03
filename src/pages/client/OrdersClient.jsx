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
    Divider,
    Stack,
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
    Receipt as ReceiptIcon,
    Person as PersonIcon,
    LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import OutlineButton from '../../components/ui/OutlineButton';
import StyledTextField from '../../components/ui/StyledTextField';
import { useClientApi } from '../../hooks/useClientApi';
import { useOrderStatus } from '../../hooks/useOrderStatus';

export default function OrdersClient() {
    const theme = useTheme();
    const { useOrders } = useClientApi();
    const { 
        getOrderStatusStyle, 
        getPaymentStatusStyle,
        getOrderStatusLabel,
        getPaymentStatusLabel 
    } = useOrderStatus();

    const BLUE_COLOR = theme.palette.primary.main;
    const GREEN_COLOR = theme.palette.success.main;
    const WARNING_COLOR = theme.palette.warning.main;
    const INFO_COLOR = theme.palette.info.main;
    const TEXT_PRIMARY = theme.palette.text.primary;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { data: ordersData = [], isLoading } = useOrders();

    const filteredOrders = useMemo(() => {
        if (!searchQuery.trim()) return ordersData;
        const query = searchQuery.toLowerCase();
        return ordersData.filter(order =>
            (order.orderId || order._id)?.toLowerCase().includes(query) ||
            (order.orderStatus || order.status)?.toLowerCase().includes(query) ||
            (order.paymentStatus)?.toLowerCase().includes(query)
        );
    }, [ordersData, searchQuery]);

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
            o => o.orderStatus === 'shipped' || o.status === 'shipped' || o.orderStatus === 'confirmed'
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

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setViewDialogOpen(true);
    };

    const handleCloseViewDialog = () => {
        setViewDialogOpen(false);
        setSelectedOrder(null);
    };

    const statCards = [
        {
            label: 'Total Orders',
            value: stats.totalOrders,
            icon: <ShoppingCartIcon sx={{ fontSize: '1rem' }} />,
            color: BLUE_COLOR,
            trend: `${stats.completedOrders} completed`,
        },
        {
            label: 'Total Spent',
            value: `৳${parseInt(stats.totalSpent).toLocaleString()}`,
            icon: <PaymentIcon sx={{ fontSize: '1rem' }} />,
            color: GREEN_COLOR,
            trend: `Avg ৳${parseInt(stats.avgOrderValue).toLocaleString()}`,
        },
        {
            label: 'Delivered',
            value: stats.completedOrders,
            icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />,
            color: GREEN_COLOR,
            trend: `${stats.completionRate}% completion`,
        },
        {
            label: 'In Transit',
            value: stats.shippedOrders,
            icon: <ShippingIcon sx={{ fontSize: '1rem' }} />,
            color: WARNING_COLOR,
            trend: 'On the way',
        },
        {
            label: 'Pending',
            value: stats.pendingOrders,
            icon: <ClockIcon sx={{ fontSize: '1rem' }} />,
            color: INFO_COLOR,
            trend: 'Awaiting confirmation',
        },
        {
            label: 'Paid',
            value: stats.paidOrders,
            icon: <TrendingUpIcon sx={{ fontSize: '1rem' }} />,
            color: GREEN_COLOR,
            trend: 'Payment confirmed',
        },
    ];

    return (
        <Box>
            <Helmet>
                <title>My Orders | FatherOfMeow</title>
            </Helmet>

            <Box mb={3}>
                <Typography sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.95rem' }}>
                    My Orders
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', color: TEXT_PRIMARY }}>
                    Track and manage all your orders
                </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                {statCards.map(({ label, value, icon, color, trend }) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={label}>
                        <Tooltip title={trend} arrow>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 1.5,
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
                                <CardContent sx={{ p: '12px !important', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                                    <Box sx={{
                                        width: 32, height: 32, borderRadius: 1.5,
                                        backgroundColor: alpha(color, theme.palette.mode === 'dark' ? 0.2 : 0.1),
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color,
                                    }}>
                                        {icon}
                                    </Box>
                                    <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: TEXT_PRIMARY, lineHeight: 1 }}>
                                        {value}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.65rem', color: alpha(TEXT_PRIMARY, 0.6), fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                                        {label}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: alpha(TEXT_PRIMARY, 0.5) }}>
                                        <TrendingUpIcon sx={{ fontSize: '0.7rem' }} />
                                        <Typography sx={{ fontSize: '0.65rem' }}>{trend}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Tooltip>
                    </Grid>
                ))}
            </Grid>

            <Box mb={3}>
                <StyledTextField
                    fullWidth
                    placeholder="Search orders by ID, status, or payment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: TEXT_PRIMARY, fontSize: '0.85rem', opacity: 0.7 }} />,
                    }}
                    size="small"
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem', color: TEXT_PRIMARY } }}
                />
            </Box>

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: 1.5,
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
                        <CircularProgress size={32} />
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
                                        fontSize: '0.78rem',
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
                                        <ShoppingCartIcon sx={{ fontSize: 42, color: alpha(TEXT_PRIMARY, 0.15), mb: 1.5 }} />
                                        <Typography sx={{ fontSize: '0.8rem', color: TEXT_PRIMARY }}>
                                            {searchQuery ? 'No orders found matching your search' : 'No orders yet. Start shopping!'}
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedOrders.map((order) => {
                                const orderStatusStyle = getOrderStatusStyle(order.orderStatus || order.status);
                                const paymentStatusStyle = getPaymentStatusStyle(order.paymentStatus);
                                
                                return (
                                    <TableRow
                                        key={order._id}
                                        hover
                                        sx={{
                                            '&:hover': { backgroundColor: alpha(BLUE_COLOR, theme.palette.mode === 'dark' ? 0.05 : 0.03) },
                                            '&:last-child td': { borderBottom: 0 },
                                        }}
                                    >
                                        <TableCell sx={{ py: 1.5 }}>
                                            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: TEXT_PRIMARY }}>
                                                #{order.orderId || order._id?.slice(-8)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell sx={{ py: 1.5 }}>
                                            <Typography sx={{ fontSize: '0.78rem', color: TEXT_PRIMARY }}>
                                                {order.createdAt
                                                    ? new Date(order.createdAt).toLocaleDateString()
                                                    : 'N/A'}
                                            </Typography>
                                        </TableCell>

                                        <TableCell sx={{ py: 1.5 }}>
                                            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: GREEN_COLOR }}>
                                                ৳{parseFloat(order.totalAmount || order.total || 0).toFixed(2)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell sx={{ py: 1.5 }}>
                                            <Typography sx={{ fontSize: '0.78rem', color: TEXT_PRIMARY }}>
                                                {order.items?.length || 0} items
                                            </Typography>
                                        </TableCell>

                                        <TableCell sx={{ py: 1.5 }}>
                                            <Chip
                                                label={getOrderStatusLabel(order.orderStatus || order.status)}
                                                size="small"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: '0.7rem',
                                                    height: 24,
                                                    textTransform: 'capitalize',
                                                    backgroundColor: orderStatusStyle.bg,
                                                    color: orderStatusStyle.color,
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell sx={{ py: 1.5 }}>
                                            <Chip
                                                label={getPaymentStatusLabel(order.paymentStatus)}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: '0.7rem',
                                                    height: 24,
                                                    backgroundColor: paymentStatusStyle.bg,
                                                    color: paymentStatusStyle.color,
                                                    borderColor: paymentStatusStyle.borderColor,
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell align="right" sx={{ py: 1.5 }}>
                                            <Tooltip title="View Order">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewOrder(order)}
                                                    sx={{ color: BLUE_COLOR }}
                                                >
                                                    <VisibilityIcon sx={{ fontSize: '0.85rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
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
                            fontSize: '0.72rem',
                            color: TEXT_PRIMARY,
                        },
                    }}
                />
            </TableContainer>

            <Dialog
                open={viewDialogOpen}
                onClose={handleCloseViewDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}
            >
                {selectedOrder && (
                    <>
                        <DialogTitle sx={{
                            backgroundColor: alpha(BLUE_COLOR, 0.05),
                            color: TEXT_PRIMARY,
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            py: 1.5,
                            px: 2.5,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <ReceiptIcon sx={{ color: BLUE_COLOR, fontSize: '1rem' }} />
                                <span>Order Details</span>
                            </Box>
                            <Chip
                                label={getOrderStatusLabel(selectedOrder.orderStatus || selectedOrder.status)}
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.68rem',
                                    height: 24,
                                    textTransform: 'capitalize',
                                    backgroundColor: getOrderStatusStyle(selectedOrder.orderStatus || selectedOrder.status).bg,
                                    color: getOrderStatusStyle(selectedOrder.orderStatus || selectedOrder.status).color,
                                }}
                            />
                        </DialogTitle>

                        <DialogContent sx={{ px: 2.5, py: 2.5, backgroundColor: theme.palette.background.default }}>
                            <Stack spacing={2.5}>
                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: BLUE_COLOR, mb: 1.5, fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                        ORDER SUMMARY
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                                                <ReceiptIcon sx={{ fontSize: '0.8rem', color: alpha(TEXT_PRIMARY, 0.5) }} />
                                                <Typography sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontWeight: 600, fontSize: '0.65rem' }}>
                                                    ORDER ID
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.82rem', pl: 3 }}>
                                                {selectedOrder.orderId || selectedOrder._id}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                                                <PaymentIcon sx={{ fontSize: '0.8rem', color: alpha(TEXT_PRIMARY, 0.5) }} />
                                                <Typography sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontWeight: 600, fontSize: '0.65rem' }}>
                                                    TRANSACTION ID
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.8rem', pl: 3 }}>
                                                {selectedOrder.transactionId || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                                                <ClockIcon sx={{ fontSize: '0.8rem', color: alpha(TEXT_PRIMARY, 0.5) }} />
                                                <Typography sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontWeight: 600, fontSize: '0.65rem' }}>
                                                    ORDER DATE
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.8rem', pl: 3 }}>
                                                {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                                                <TrendingUpIcon sx={{ fontSize: '0.8rem', color: alpha(TEXT_PRIMARY, 0.5) }} />
                                                <Typography sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontWeight: 600, fontSize: '0.65rem' }}>
                                                    PAYMENT METHOD
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.8rem', pl: 3, textTransform: 'capitalize' }}>
                                                {selectedOrder.paymentMethod || 'N/A'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: BLUE_COLOR, mb: 1.5, fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                        CUSTOMER INFORMATION
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                                                <PersonIcon sx={{ fontSize: '0.8rem', color: alpha(TEXT_PRIMARY, 0.5) }} />
                                                <Typography sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontWeight: 600, fontSize: '0.65rem' }}>
                                                    NAME
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.8rem', pl: 3 }}>
                                                {selectedOrder.customerName || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                                                <PersonIcon sx={{ fontSize: '0.8rem', color: alpha(TEXT_PRIMARY, 0.5) }} />
                                                <Typography sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontWeight: 600, fontSize: '0.65rem' }}>
                                                    EMAIL
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.8rem', pl: 3 }}>
                                                {selectedOrder.customerEmail || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                                                <PersonIcon sx={{ fontSize: '0.8rem', color: alpha(TEXT_PRIMARY, 0.5) }} />
                                                <Typography sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontWeight: 600, fontSize: '0.65rem' }}>
                                                    PHONE
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.8rem', pl: 3 }}>
                                                {selectedOrder.customerPhone || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                                                <LocationOnIcon sx={{ fontSize: '0.8rem', color: alpha(TEXT_PRIMARY, 0.5) }} />
                                                <Typography sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontWeight: 600, fontSize: '0.65rem' }}>
                                                    SHIPPING DISTRICT
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.8rem', pl: 3, textTransform: 'capitalize' }}>
                                                {selectedOrder.shippingDistrict || 'N/A'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    {selectedOrder.customerAddress && (
                                        <Box sx={{ mt: 1.5, pl: 3 }}>
                                            <Typography sx={{ color: alpha(TEXT_PRIMARY, 0.5), fontWeight: 600, fontSize: '0.65rem' }}>
                                                FULL ADDRESS
                                            </Typography>
                                            <Typography sx={{ fontWeight: 500, color: TEXT_PRIMARY, fontSize: '0.8rem', mt: 0.5 }}>
                                                {selectedOrder.customerAddress.street}, {selectedOrder.customerAddress.city}, {selectedOrder.customerAddress.district} - {selectedOrder.customerAddress.postalCode}, {selectedOrder.customerAddress.country}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: BLUE_COLOR, mb: 1.5, fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                        ORDER ITEMS ({selectedOrder.items?.length || 0})
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        {selectedOrder.items?.map((item, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    p: 1.5,
                                                    borderRadius: 1.5,
                                                    backgroundColor: theme.palette.background.paper,
                                                    border: `1px solid ${theme.palette.divider}`,
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={item.details?.featuredImage || item.image || 'https://via.placeholder.com/60'}
                                                    alt={item.productName || item.name}
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        objectFit: 'cover',
                                                        borderRadius: 1.5,
                                                        border: `1px solid ${theme.palette.divider}`,
                                                        backgroundColor: theme.palette.background.default,
                                                    }}
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                                                />
                                                
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.82rem', mb: 0.25 }}>
                                                        {item.productName || item.name}
                                                    </Typography>
                                                    <Typography sx={{ color: alpha(TEXT_PRIMARY, 0.6), fontSize: '0.68rem' }}>
                                                        {item.itemType === 'pet' ? 'Pet' : 'Product'}
                                                    </Typography>
                                                    {item.details?.breed && (
                                                        <Typography sx={{ color: alpha(TEXT_PRIMARY, 0.6), fontSize: '0.68rem' }}>
                                                            Breed: {item.details.breed}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography sx={{ fontWeight: 700, color: GREEN_COLOR, fontSize: '0.82rem' }}>
                                                        ৳{item.price?.toFixed(2) || 0}
                                                    </Typography>
                                                    <Chip
                                                        label={`x${item.quantity}`}
                                                        size="small"
                                                        sx={{
                                                            fontSize: '0.68rem',
                                                            height: 20,
                                                            mt: 0.5,
                                                            backgroundColor: alpha(BLUE_COLOR, 0.1),
                                                            color: BLUE_COLOR,
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                    <Typography sx={{ color: alpha(TEXT_PRIMARY, 0.6), fontSize: '0.68rem', mt: 0.5 }}>
                                                        Subtotal: ৳{item.subtotal?.toFixed(2) || (item.price * item.quantity).toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: BLUE_COLOR, mb: 1.5, fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                        PRICE BREAKDOWN
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, pl: 1 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography sx={{ fontSize: '0.78rem', color: alpha(TEXT_PRIMARY, 0.7) }}>Subtotal</Typography>
                                            <Typography sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.8rem' }}>
                                                ৳{selectedOrder.subtotal?.toFixed(2) || 0}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography sx={{ fontSize: '0.78rem', color: alpha(TEXT_PRIMARY, 0.7) }}>Shipping Cost</Typography>
                                            <Typography sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.8rem' }}>
                                                ৳{selectedOrder.shippingCost?.toFixed(2) || 0}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography sx={{ fontSize: '0.78rem', color: alpha(TEXT_PRIMARY, 0.7) }}>Tax</Typography>
                                            <Typography sx={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.8rem' }}>
                                                ৳{selectedOrder.tax?.toFixed(2) || 0}
                                            </Typography>
                                        </Box>
                                        {selectedOrder.discount > 0 && (
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography sx={{ fontSize: '0.78rem', color: alpha(TEXT_PRIMARY, 0.7) }}>Discount</Typography>
                                                <Typography sx={{ fontWeight: 600, color: theme.palette.error.main, fontSize: '0.8rem' }}>
                                                    -৳{selectedOrder.discount?.toFixed(2) || 0}
                                                </Typography>
                                            </Box>
                                        )}
                                        {selectedOrder.couponCode && (
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography sx={{ fontSize: '0.7rem', color: alpha(TEXT_PRIMARY, 0.5) }}>Coupon: {selectedOrder.couponCode}</Typography>
                                            </Box>
                                        )}
                                        <Divider sx={{ my: 0.5 }} />
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography sx={{ fontWeight: 800, color: TEXT_PRIMARY, fontSize: '0.88rem' }}>Total Amount</Typography>
                                            <Typography sx={{ fontWeight: 800, color: GREEN_COLOR, fontSize: '1rem' }}>
                                                ৳{selectedOrder.totalAmount?.toFixed(2) || 0}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: BLUE_COLOR, mb: 1.5, fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                        PAYMENT STATUS
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Chip
                                            label={getPaymentStatusLabel(selectedOrder.paymentStatus)}
                                            size="medium"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '0.75rem',
                                                px: 1,
                                                backgroundColor: getPaymentStatusStyle(selectedOrder.paymentStatus).bg,
                                                color: getPaymentStatusStyle(selectedOrder.paymentStatus).color,
                                                borderColor: getPaymentStatusStyle(selectedOrder.paymentStatus).borderColor,
                                            }}
                                        />
                                        {selectedOrder.paymentStatus === 'completed' && (
                                            <Typography sx={{ color: GREEN_COLOR, fontSize: '0.68rem' }}>
                                                ✓ Payment has been confirmed
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Stack>
                        </DialogContent>

                        <DialogActions sx={{
                            px: 2.5,
                            py: 1.5,
                            borderTop: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.paper,
                        }}>
                            <OutlineButton onClick={handleCloseViewDialog} size="medium" sx={{ fontSize: '0.8rem', px: 3 }}>
                                Close
                            </OutlineButton>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}