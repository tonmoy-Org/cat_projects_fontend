// OrderManagement.jsx
import React, { useState, useMemo } from 'react';
import {
    Box, Typography, styled, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TablePagination, alpha, CircularProgress, Select, MenuItem,
    FormControl, TextField, InputAdornment, Tooltip, Divider, Paper,
    Grid, Button,
    Chip,
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    ShoppingBag as OrderIcon,
    Refresh as RefreshIcon,
    Receipt as ReceiptIcon,
    CheckCircle as CheckIcon,
    HourglassEmpty as PendingIcon,
    LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';
import { useAlert } from '../../components/ui/AlertProvider';
import { Helmet } from 'react-helmet-async';

// ─── Theme ────────────────────────────────────────────────────────────────────
const PRIMARY = '#db89ca';
const PRIMARY_DK = '#c06bb0';
const BORDER = '#e0e0e0';
const TEXT = '#1a1a1a';
const GRAY = '#666666';
const BG = '#f9f9f9';

// ─── Status config ────────────────────────────────────────────────────────────
const PAYMENT_STATUS = {
    completed: { label: 'Completed', color: '#2e7d32', bg: '#f0fbf1', border: '#c3e6c5' },
    pending: { label: 'Pending', color: '#b45309', bg: '#fffbeb', border: '#fcd34d' },
    failed: { label: 'Failed', color: '#b91c1c', bg: '#fff1f1', border: '#fca5a5' },
    refunded: { label: 'Refunded', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
    cancelled: { label: 'Cancelled', color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db' },
};

const ORDER_STATUS = {
    pending: { label: 'Pending', color: '#b45309', bg: '#fffbeb', border: '#fcd34d' },
    confirmed: { label: 'Confirmed', color: '#2e7d32', bg: '#f0fbf1', border: '#c3e6c5' },
    processing: { label: 'Processing', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
    shipped: { label: 'Shipped', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
    delivered: { label: 'Delivered', color: '#047857', bg: '#ecfdf5', border: '#6ee7b7' },
    cancelled: { label: 'Cancelled', color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db' },
    returned: { label: 'Returned', color: '#b91c1c', bg: '#fff1f1', border: '#fca5a5' },
};

const fmt = (n) => `৳${parseFloat(n || 0).toLocaleString('en-BD')}`;

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

const fmtDateTime = (d) =>
    d ? new Date(d).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    }) : '—';

// ─── Styled ───────────────────────────────────────────────────────────────────
const StatusChip = styled(Box)(({ statuscolor, statusbg, statusborder }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    color: statuscolor,
    backgroundColor: statusbg,
    border: `1px solid ${statusborder}`,
    whiteSpace: 'nowrap',
}));

const StatCard = styled(Box)({
    backgroundColor: '#fff',
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
});

const StyledTableRow = styled(TableRow)({
    '&:hover': { backgroundColor: alpha(PRIMARY, 0.03) },
    '&:last-child td': { borderBottom: 0 },
    transition: 'background 0.15s',
});

const FilterSelect = styled(Select)({
    fontSize: 13,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#fff',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
});

const SearchField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: 8,
        height: 38,
        fontSize: 13,
        backgroundColor: '#fff',
        '& fieldset': { borderColor: BORDER },
        '&:hover fieldset': { borderColor: PRIMARY },
        '&.Mui-focused fieldset': { borderColor: PRIMARY },
    },
});

const ActionIconBtn = styled(IconButton)(({ btncolor }) => ({
    width: 30,
    height: 30,
    color: btncolor || GRAY,
    '&:hover': { backgroundColor: alpha(btncolor || GRAY, 0.1) },
}));

const SectionLabel = styled(Typography)({
    fontSize: 11,
    fontWeight: 700,
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 10,
    marginTop: 20,
    '&:first-of-type': { marginTop: 0 },
});

const DetailRow = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '9px 0',
    borderBottom: `1px dashed ${BORDER}`,
    '&:last-child': { borderBottom: 'none' },
});

const PrimaryBtn = styled(Button)({
    backgroundColor: PRIMARY,
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: 8,
    padding: '7px 20px',
    '&:hover': { backgroundColor: PRIMARY_DK },
    '&.Mui-disabled': { backgroundColor: alpha(PRIMARY, 0.4), color: '#fff' },
});

const OutlineBtn = styled(Button)({
    color: GRAY,
    border: `1px solid ${BORDER}`,
    fontSize: 13,
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: 8,
    padding: '7px 20px',
    '&:hover': { borderColor: PRIMARY, color: PRIMARY, backgroundColor: 'transparent' },
});

const DangerBtn = styled(Button)({
    backgroundColor: '#b91c1c',
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: 8,
    padding: '7px 20px',
    '&:hover': { backgroundColor: '#991b1b' },
    '&.Mui-disabled': { backgroundColor: alpha('#b91c1c', 0.4), color: '#fff' },
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OrderManagement() {
    const queryClient = useQueryClient();
    const { addAlert } = useAlert();

    // ── State ─────────────────────────────────────────────────────────────────
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [filterPayment, setFilterPayment] = useState('all');
    const [filterOrder, setFilterOrder] = useState('all');
    const [viewOrder, setViewOrder] = useState(null);
    const [editOrder, setEditOrder] = useState(null);
    const [editStatus, setEditStatus] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);

    // ── Fetch orders ──────────────────────────────────────────────────────────
    const { data: ordersData = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const res = await axiosInstance.get('/orders');
            return res.data.orders || res.data.data || res.data;
        },
    });

    // ── Derived stats ─────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const all = ordersData.length;
        const completed = ordersData.filter(o => o.paymentStatus === 'completed').length;
        const pending = ordersData.filter(o => o.paymentStatus === 'pending').length;
        const revenue = ordersData
            .filter(o => o.paymentStatus === 'completed')
            .reduce((s, o) => s + (o.totalAmount || 0), 0);
        return { all, completed, pending, revenue };
    }, [ordersData]);

    // ── Filtered + searched orders ────────────────────────────────────────────
    const filtered = useMemo(() => {
        return ordersData.filter(o => {
            const matchSearch =
                !search ||
                o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
                o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
                o.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
                o.transactionId?.toLowerCase().includes(search.toLowerCase());
            const matchPayment = filterPayment === 'all' || o.paymentStatus === filterPayment;
            const matchOrder = filterOrder === 'all' || o.orderStatus === filterOrder;
            return matchSearch && matchPayment && matchOrder;
        });
    }, [ordersData, search, filterPayment, filterOrder]);

    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // ── Update order status mutation ──────────────────────────────────────────
    const updateMutation = useMutation({
        mutationFn: async ({ orderId, status }) => {
            const res = await axiosInstance.put(`/orders/${orderId}/status`, { status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            addAlert('success', 'Order status updated successfully!');
            setEditOrder(null);
        },
        onError: (err) => {
            addAlert('error', err.response?.data?.message || 'Failed to update order status.');
        },
    });

    // ── Delete order mutation ─────────────────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosInstance.delete(`/orders/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            addAlert('success', 'Order deleted successfully!');
            setDeleteTarget(null);
            if ((filtered.length - 1) % rowsPerPage === 0 && page > 0) {
                setPage(page - 1);
            }
        },
        onError: (err) => {
            addAlert('error', err.response?.data?.message || 'Failed to delete order.');
            setDeleteTarget(null);
        },
    });

    // ── Helpers ───────────────────────────────────────────────────────────────
    const openEdit = (order) => {
        setEditOrder(order);
        setEditStatus(order.orderStatus);
    };

    const handleUpdateStatus = () => {
        if (!editStatus || editStatus === editOrder.orderStatus) return;
        updateMutation.mutate({ orderId: editOrder.orderId, status: editStatus });
    };

    const resetPage = () => { setPage(0); };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <Box>
            <Helmet>
                <title>Order Management — Admin</title>
            </Helmet>

            {/* ── Header ──────────────────────────────────────────────────── */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: TEXT }}>
                        Order Management
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: GRAY, mt: 0.3 }}>
                        View and manage all customer orders
                    </Typography>
                </Box>
                <Tooltip title="Refresh">
                    <ActionIconBtn btncolor={PRIMARY} onClick={() => refetch()} size="small">
                        <RefreshIcon fontSize="small" />
                    </ActionIconBtn>
                </Tooltip>
            </Box>

            {/* ── Stat cards ──────────────────────────────────────────────── */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Total Orders', value: stats.all, icon: <OrderIcon />, color: PRIMARY },
                    { label: 'Paid Orders', value: stats.completed, icon: <CheckIcon />, color: '#2e7d32' },
                    { label: 'Pending', value: stats.pending, icon: <PendingIcon />, color: '#b45309' },
                    { label: 'Total Revenue', value: fmt(stats.revenue), icon: <ReceiptIcon />, color: '#7c3aed' },
                ].map(({ label, value, icon, color }) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={label}>
                        <StatCard>
                            <Box sx={{
                                width: 44, height: 44, borderRadius: '10px',
                                backgroundColor: alpha(color, 0.1),
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color,
                            }}>
                                {icon}
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: 20, fontWeight: 700, color: TEXT, lineHeight: 1 }}>
                                    {value}
                                </Typography>
                                <Typography sx={{ fontSize: 12, color: GRAY, mt: 0.4 }}>
                                    {label}
                                </Typography>
                            </Box>
                        </StatCard>
                    </Grid>
                ))}
            </Grid>

            {/* ── Filters ─────────────────────────────────────────────────── */}
            <Box sx={{
                display: 'flex', gap: 1.5, mb: 2,
                flexWrap: 'wrap', alignItems: 'center',
            }}>
                <SearchField
                    placeholder="Search order, customer, email…"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                    sx={{ minWidth: 260, flex: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: 17, color: GRAY }} />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl size="small">
                    <FilterSelect
                        value={filterPayment}
                        onChange={(e) => { setFilterPayment(e.target.value); resetPage(); }}
                        displayEmpty
                    >
                        <MenuItem value="all">All Payments</MenuItem>
                        {Object.entries(PAYMENT_STATUS).map(([k, v]) => (
                            <MenuItem key={k} value={k}>{v.label}</MenuItem>
                        ))}
                    </FilterSelect>
                </FormControl>
                <FormControl size="small">
                    <FilterSelect
                        value={filterOrder}
                        onChange={(e) => { setFilterOrder(e.target.value); resetPage(); }}
                        displayEmpty
                    >
                        <MenuItem value="all">All Statuses</MenuItem>
                        {Object.entries(ORDER_STATUS).map(([k, v]) => (
                            <MenuItem key={k} value={k}>{v.label}</MenuItem>
                        ))}
                    </FilterSelect>
                </FormControl>
                {(search || filterPayment !== 'all' || filterOrder !== 'all') && (
                    <OutlineBtn
                        size="small"
                        onClick={() => { setSearch(''); setFilterPayment('all'); setFilterOrder('all'); resetPage(); }}
                    >
                        Clear
                    </OutlineBtn>
                )}
            </Box>

            {/* ── Table ───────────────────────────────────────────────────── */}
            <TableContainer component={Paper} elevation={0} sx={{
                border: `1px solid ${BORDER}`, borderRadius: 1.5,
                backgroundColor: '#fff', overflow: 'hidden',
            }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: BG }}>
                            {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Order Status', 'Date', 'Actions'].map(h => (
                                <TableCell key={h} sx={{
                                    fontSize: 12, fontWeight: 700, color: TEXT,
                                    borderBottom: `1px solid ${BORDER}`, py: 1.5,
                                    whiteSpace: 'nowrap',
                                    ...(h === 'Actions' ? { textAlign: 'right' } : {}),
                                }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                    <CircularProgress size={30} sx={{ color: PRIMARY }} />
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                    <Typography sx={{ color: '#b91c1c', fontSize: 14 }}>
                                        Failed to load orders.{' '}
                                        <span
                                            style={{ color: PRIMARY, cursor: 'pointer', fontWeight: 600 }}
                                            onClick={() => refetch()}
                                        >
                                            Retry
                                        </span>
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : paginated.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                    <OrderIcon sx={{ fontSize: 44, color: alpha(TEXT, 0.15), mb: 1, display: 'block', mx: 'auto' }} />
                                    <Typography sx={{ fontSize: 14, color: GRAY }}>
                                        No orders found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginated.map((order) => {
                                const ps = PAYMENT_STATUS[order.paymentStatus] || PAYMENT_STATUS.pending;
                                const os = ORDER_STATUS[order.orderStatus] || ORDER_STATUS.pending;
                                const isDeleting = deleteMutation.isPending && deleteTarget?._id === order._id;
                                return (
                                    <StyledTableRow key={order._id} sx={{ opacity: isDeleting ? 0.5 : 1 }}>
                                        <TableCell sx={{ py: 1.2 }}>
                                            <Typography sx={{ fontSize: 12, fontWeight: 700, color: PRIMARY }}>
                                                {order.orderId}
                                            </Typography>
                                            <Typography sx={{ fontSize: 11, color: GRAY }}>
                                                {order.transactionId?.slice(0, 20)}…
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 1.2 }}>
                                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: TEXT }}>
                                                {order.customerName}
                                            </Typography>
                                            <Typography sx={{ fontSize: 11, color: GRAY }}>
                                                {order.customerEmail}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 1.2 }}>
                                            <Typography sx={{ fontSize: 12, color: TEXT }}>
                                                {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                                            </Typography>
                                            <Typography sx={{ fontSize: 11, color: GRAY, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {order.items?.map(i => i.productName).join(', ')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 1.2 }}>
                                            <Typography sx={{ fontSize: 13, fontWeight: 700, color: TEXT }}>
                                                {fmt(order.totalAmount)}
                                            </Typography>
                                            <Typography sx={{ fontSize: 11, color: GRAY }}>
                                                {order.shippingDistrict?.charAt(0).toUpperCase() + order.shippingDistrict?.slice(1)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 1.2 }}>
                                            <StatusChip statuscolor={ps.color} statusbg={ps.bg} statusborder={ps.border}>
                                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: ps.color, flexShrink: 0 }} />
                                                {ps.label}
                                            </StatusChip>
                                        </TableCell>
                                        <TableCell sx={{ py: 1.2 }}>
                                            <StatusChip statuscolor={os.color} statusbg={os.bg} statusborder={os.border}>
                                                {os.label}
                                            </StatusChip>
                                        </TableCell>
                                        <TableCell sx={{ py: 1.2 }}>
                                            <Typography sx={{ fontSize: 12, color: TEXT, whiteSpace: 'nowrap' }}>
                                                {fmtDate(order.createdAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 1.2 }} align="right">
                                            <Tooltip title="View Details">
                                                <ActionIconBtn btncolor={PRIMARY} onClick={() => setViewOrder(order)}>
                                                    <ViewIcon sx={{ fontSize: 17 }} />
                                                </ActionIconBtn>
                                            </Tooltip>
                                            <Tooltip title="Update Status">
                                                <ActionIconBtn btncolor="#7c3aed" onClick={() => openEdit(order)}>
                                                    <EditIcon sx={{ fontSize: 17 }} />
                                                </ActionIconBtn>
                                            </Tooltip>
                                            <Tooltip title="Delete Order">
                                                <ActionIconBtn
                                                    btncolor="#b91c1c"
                                                    onClick={() => setDeleteTarget(order)}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting
                                                        ? <CircularProgress size={14} sx={{ color: '#b91c1c' }} />
                                                        : <DeleteIcon sx={{ fontSize: 17 }} />
                                                    }
                                                </ActionIconBtn>
                                            </Tooltip>
                                        </TableCell>
                                    </StyledTableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filtered.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, p) => setPage(p)}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    sx={{ borderTop: `1px solid ${BORDER}`, fontSize: 13 }}
                />
            </TableContainer>

            {/* ── View Order Dialog - Enhanced with images and all details ───── */}
            <Dialog
                open={!!viewOrder}
                onClose={() => setViewOrder(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2, border: `1px solid ${BORDER}`, overflow: 'hidden' } }}
            >
                {viewOrder && (() => {
                    const ps = PAYMENT_STATUS[viewOrder.paymentStatus] || PAYMENT_STATUS.pending;
                    const os = ORDER_STATUS[viewOrder.orderStatus] || ORDER_STATUS.pending;
                    return (
                        <>
                            <DialogTitle sx={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                py: 2, px: 3, backgroundColor: alpha(PRIMARY, 0.04),
                            }}>
                                <Box>
                                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: TEXT }}>
                                        Order Details
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, color: PRIMARY, fontWeight: 600 }}>
                                        {viewOrder.orderId}
                                    </Typography>
                                </Box>
                                <IconButton size="small" onClick={() => setViewOrder(null)} sx={{ color: GRAY }}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </DialogTitle>
                            <Divider />
                            <DialogContent sx={{ px: 3, py: 3, backgroundColor: BG }}>
                                {/* Status badges */}
                                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                                    <StatusChip statuscolor={ps.color} statusbg={ps.bg} statusborder={ps.border}>
                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: ps.color }} />
                                        Payment: {ps.label}
                                    </StatusChip>
                                    <StatusChip statuscolor={os.color} statusbg={os.bg} statusborder={os.border}>
                                        Order: {os.label}
                                    </StatusChip>
                                </Box>

                                {/* Customer Information */}
                                <SectionLabel>Customer Information</SectionLabel>
                                <Box sx={{ backgroundColor: '#fff', borderRadius: 1.5, p: 2, mb: 0, border: `1px solid ${BORDER}` }}>
                                    {[
                                        ['Name', viewOrder.customerName],
                                        ['Email', viewOrder.customerEmail],
                                        ['Phone', viewOrder.customerPhone],
                                        ['Address', `${viewOrder.customerAddress?.street}, ${viewOrder.customerAddress?.city}, ${viewOrder.customerAddress?.district?.toUpperCase()}, ${viewOrder.customerAddress?.postalCode}`],
                                        ['District', viewOrder.shippingDistrict?.charAt(0).toUpperCase() + viewOrder.shippingDistrict?.slice(1)],
                                    ].map(([k, v]) => (
                                        <DetailRow key={k}>
                                            <Typography sx={{ fontSize: 12, color: GRAY, fontWeight: 500 }}>{k}</Typography>
                                            <Typography sx={{ fontSize: 12, color: TEXT, fontWeight: 600, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{v || '—'}</Typography>
                                        </DetailRow>
                                    ))}
                                </Box>

                                {/* Order Items with Images */}
                                <SectionLabel>Order Items ({viewOrder.items?.length || 0})</SectionLabel>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                                    {viewOrder.items?.map((item, idx) => (
                                        <Box
                                            key={idx}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                p: 1.5,
                                                borderRadius: 2,
                                                backgroundColor: '#fff',
                                                border: `1px solid ${BORDER}`,
                                            }}
                                        >
                                            {/* Product Image */}
                                            <Box
                                                component="img"
                                                src={item.details?.featuredImage || item.image || 'https://via.placeholder.com/60'}
                                                alt={item.productName || item.name}
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    objectFit: 'cover',
                                                    borderRadius: 1.5,
                                                    border: `1px solid ${BORDER}`,
                                                    backgroundColor: BG,
                                                }}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                                            />
                                            
                                            {/* Product Details */}
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT, fontSize: '0.85rem', mb: 0.5 }}>
                                                    {item.productName || item.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: GRAY, fontSize: '0.7rem' }}>
                                                    {item.itemType === 'pet' ? 'Pet' : 'Product'}
                                                </Typography>
                                                {item.details?.breed && (
                                                    <Typography variant="caption" sx={{ color: GRAY, fontSize: '0.7rem', display: 'block' }}>
                                                        Breed: {item.details.breed}
                                                    </Typography>
                                                )}
                                            </Box>
                                            
                                            {/* Price and Quantity */}
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#2e7d32', fontSize: '0.85rem' }}>
                                                    {fmt(item.price)}
                                                </Typography>
                                                <Chip
                                                    label={`x${item.quantity}`}
                                                    size="small"
                                                    sx={{
                                                        fontSize: '0.7rem',
                                                        height: 22,
                                                        mt: 0.5,
                                                        backgroundColor: alpha(PRIMARY, 0.1),
                                                        color: PRIMARY,
                                                        fontWeight: 600,
                                                    }}
                                                />
                                                <Typography variant="caption" sx={{ color: GRAY, fontSize: '0.7rem', display: 'block', mt: 0.5 }}>
                                                    Subtotal: {fmt(item.subtotal)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

                                {/* Pricing Breakdown */}
                                <SectionLabel>Pricing Breakdown</SectionLabel>
                                <Box sx={{ backgroundColor: '#fff', borderRadius: 1.5, p: 2, border: `1px solid ${BORDER}` }}>
                                    {[
                                        ['Subtotal', fmt(viewOrder.subtotal)],
                                        ['Discount', viewOrder.discount > 0 ? `− ${fmt(viewOrder.discount)}` : '৳0'],
                                        ['Shipping Cost', fmt(viewOrder.shippingCost)],
                                        ['Tax', fmt(viewOrder.tax)],
                                    ].map(([k, v]) => (
                                        <DetailRow key={k}>
                                            <Typography sx={{ fontSize: 12, color: GRAY }}>{k}</Typography>
                                            <Typography sx={{ fontSize: 12, color: TEXT, fontWeight: 500 }}>{v}</Typography>
                                        </DetailRow>
                                    ))}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.5, mt: 0.5, borderTop: `2px solid ${BORDER}` }}>
                                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Total Amount</Typography>
                                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: PRIMARY }}>{fmt(viewOrder.totalAmount)}</Typography>
                                    </Box>
                                </Box>

                                {/* Payment Info */}
                                <SectionLabel>Payment Information</SectionLabel>
                                <Box sx={{ backgroundColor: '#fff', borderRadius: 1.5, p: 2, border: `1px solid ${BORDER}` }}>
                                    {[
                                        ['Transaction ID', viewOrder.transactionId],
                                        ['Payment Method', viewOrder.paymentMethod?.toUpperCase()],
                                        ['Currency', viewOrder.currency],
                                        ['Created At', fmtDateTime(viewOrder.createdAt)],
                                        ['Paid At', viewOrder.paidAt ? fmtDateTime(viewOrder.paidAt) : 'Not paid yet'],
                                    ].map(([k, v]) => (
                                        <DetailRow key={k}>
                                            <Typography sx={{ fontSize: 12, color: GRAY, fontWeight: 500 }}>{k}</Typography>
                                            <Typography sx={{ fontSize: 12, color: TEXT, fontWeight: 600, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>{v || '—'}</Typography>
                                        </DetailRow>
                                    ))}
                                </Box>
                            </DialogContent>
                            <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${BORDER}`, gap: 1, backgroundColor: '#fff' }}>
                                <DangerBtn
                                    onClick={() => {
                                        const target = viewOrder;
                                        setViewOrder(null);
                                        setDeleteTarget(target);
                                    }}
                                >
                                    Delete Order
                                </DangerBtn>
                                <PrimaryBtn onClick={() => { setViewOrder(null); openEdit(viewOrder); }}>
                                    Update Status
                                </PrimaryBtn>
                                <OutlineBtn onClick={() => setViewOrder(null)}>Close</OutlineBtn>
                            </DialogActions>
                        </>
                    );
                })()}
            </Dialog>

            {/* ── Edit Status Dialog ───────────────────────────────────────── */}
            <Dialog
                open={!!editOrder}
                onClose={() => setEditOrder(null)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2, border: `1px solid ${BORDER}` } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 3 }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Update Order Status</Typography>
                    <IconButton size="small" onClick={() => setEditOrder(null)} sx={{ color: GRAY }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ px: 3, py: 2.5 }}>
                    <Typography sx={{ fontSize: 12, color: GRAY, mb: 0.5 }}>Order</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: PRIMARY, mb: 2 }}>
                        {editOrder?.orderId}
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: TEXT, mb: 1 }}>
                        New Order Status
                    </Typography>
                    <FormControl fullWidth size="small">
                        <FilterSelect
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            sx={{ width: '100%', height: 42 }}
                        >
                            {Object.entries(ORDER_STATUS).map(([k, v]) => (
                                <MenuItem key={k} value={k}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: v.color }} />
                                        {v.label}
                                    </Box>
                                </MenuItem>
                            ))}
                        </FilterSelect>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${BORDER}`, gap: 1 }}>
                    <OutlineBtn onClick={() => setEditOrder(null)} disabled={updateMutation.isPending}>
                        Cancel
                    </OutlineBtn>
                    <PrimaryBtn
                        onClick={handleUpdateStatus}
                        disabled={updateMutation.isPending || !editStatus || editStatus === editOrder?.orderStatus}
                    >
                        {updateMutation.isPending
                            ? <CircularProgress size={16} sx={{ color: '#fff' }} />
                            : 'Update Status'
                        }
                    </PrimaryBtn>
                </DialogActions>
            </Dialog>

            {/* ── Delete Confirm Dialog ────────────────────────────────────── */}
            <Dialog
                open={!!deleteTarget}
                onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2, border: `1px solid ${BORDER}` } }}
            >
                <DialogTitle sx={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', py: 2, px: 3,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            width: 32, height: 32, borderRadius: '8px',
                            backgroundColor: alpha('#b91c1c', 0.1),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <DeleteIcon sx={{ fontSize: 17, color: '#b91c1c' }} />
                        </Box>
                        <Typography sx={{ fontSize: 15, fontWeight: 700, color: TEXT }}>
                            Delete Order
                        </Typography>
                    </Box>
                    <IconButton
                        size="small"
                        onClick={() => !deleteMutation.isPending && setDeleteTarget(null)}
                        sx={{ color: GRAY }}
                        disabled={deleteMutation.isPending}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ px: 3, py: 2.5 }}>
                    <Typography sx={{ fontSize: 13, color: TEXT, lineHeight: 1.8 }}>
                        Are you sure you want to delete order{' '}
                        <strong style={{ color: PRIMARY }}>{deleteTarget?.orderId}</strong>?
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: GRAY, mt: 0.5 }}>
                        This action is permanent and cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${BORDER}`, gap: 1 }}>
                    <OutlineBtn
                        onClick={() => setDeleteTarget(null)}
                        disabled={deleteMutation.isPending}
                    >
                        Cancel
                    </OutlineBtn>
                    <DangerBtn
                        onClick={() => deleteMutation.mutate(deleteTarget._id)}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending
                            ? <CircularProgress size={16} sx={{ color: '#fff' }} />
                            : 'Delete Order'
                        }
                    </DangerBtn>
                </DialogActions>
            </Dialog>
        </Box>
    );
}