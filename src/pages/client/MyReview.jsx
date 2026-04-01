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
    Chip,
    Rating,
    alpha,
    useTheme,
    Tooltip,
    CircularProgress,
    Card,
    CardContent,
    useMediaQuery,
} from '@mui/material';
import {
    Star as StarIcon,
    Verified as VerifiedIcon,
    Pending as PendingIcon,
    Pets as PetsIcon,
    ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { useClientApi } from '../../hooks/useClientApi';

export default function MyReview() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 3 : 5);

    const { useReviews } = useClientApi();
    const { data: reviewsData = [], isLoading } = useReviews();

    const stats = useMemo(() => {
        if (!reviewsData.length) {
            return { total: 0, avgRating: 0, approved: 0, pending: 0, petReviews: 0, productReviews: 0 };
        }

        const total = reviewsData.length;
        const avgRating = reviewsData.reduce((sum, r) => sum + (r.rating || 0), 0) / total;
        const approved = reviewsData.filter(r => r.approved === true).length;
        const pending = reviewsData.filter(r => r.approved === false).length;
        const petReviews = reviewsData.filter(r => r.type === 'cat' || r.type === 'dog' || r.type === 'pet').length;
        const productReviews = reviewsData.filter(r => r.type === 'product').length;

        return {
            total,
            avgRating: avgRating.toFixed(1),
            approved,
            pending,
            petReviews,
            productReviews,
        };
    }, [reviewsData]);

    const paginatedReviews = useMemo(() => {
        return reviewsData.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );
    }, [reviewsData, page, rowsPerPage]);

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const getApprovalStatusChip = (approved) => {
        if (approved) {
            return {
                label: 'Approved',
                color: theme.palette.success.main,
                icon: <VerifiedIcon sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }} />,
                bgColor: alpha(theme.palette.success.main, 0.1),
            };
        }
        return {
            label: 'Pending',
            color: theme.palette.warning.main,
            icon: <PendingIcon sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }} />,
            bgColor: alpha(theme.palette.warning.main, 0.1),
        };
    };

    const getItemTypeIcon = (type) => {
        if (type === 'cat' || type === 'dog' || type === 'pet') {
            return <PetsIcon sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }} />;
        }
        return <ShoppingBagIcon sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }} />;
    };

    const getItemTypeColor = (type) => {
        if (type === 'cat' || type === 'dog' || type === 'pet') {
            return theme.palette.info.main;
        }
        return theme.palette.secondary.main;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        if (isMobile) {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        }
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={32} />
            </Box>
        );
    }

    return (
        <Box sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
            <Helmet>
                <title>My Reviews | PetCare</title>
            </Helmet>

            <Box mb={isMobile ? 2 : 3}>
                <Typography sx={{ fontWeight: 600, fontSize: isMobile ? '0.9rem' : '0.95rem', mb: 0.5 }}>
                    My Reviews
                </Typography>
                <Typography sx={{ fontSize: isMobile ? '0.68rem' : '0.72rem', color: 'text.secondary' }}>
                    Manage and track all your product and pet reviews
                </Typography>
            </Box>

            <Grid container spacing={isMobile ? 1.5 : 2} sx={{ mb: isMobile ? 2 : 3 }}>
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total"
                        value={stats.total}
                        icon={<StarIcon sx={{ fontSize: isMobile ? '1rem' : '1.1rem' }} />}
                        color={theme.palette.primary.main}
                        isMobile={isMobile}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <StatCard
                        title="Avg Rating"
                        value={`${stats.avgRating}`}
                        icon={<StarIcon sx={{ fontSize: isMobile ? '1rem' : '1.1rem' }} />}
                        color={theme.palette.warning.main}
                        subtitle={
                            <Rating value={parseFloat(stats.avgRating)} readOnly size="small" precision={0.5} sx={{ mt: 0.5 }} />
                        }
                        isMobile={isMobile}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <StatCard
                        title="Pet"
                        value={stats.petReviews}
                        icon={<PetsIcon sx={{ fontSize: isMobile ? '1rem' : '1.1rem' }} />}
                        color={theme.palette.info.main}
                        isMobile={isMobile}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <StatCard
                        title="Product"
                        value={stats.productReviews}
                        icon={<ShoppingBagIcon sx={{ fontSize: isMobile ? '1rem' : '1.1rem' }} />}
                        color={theme.palette.secondary.main}
                        isMobile={isMobile}
                    />
                </Grid>
            </Grid>

            {isMobile ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {paginatedReviews.length === 0 ? (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                borderRadius: 1.5,
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <StarIcon sx={{ fontSize: 42, color: alpha(theme.palette.text.primary, 0.15), mb: 1.5 }} />
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                No reviews yet.
                            </Typography>
                        </Paper>
                    ) : (
                        paginatedReviews.map((review) => {
                            const status = getApprovalStatusChip(review.approved);
                            const itemTypeColor = getItemTypeColor(review.type);
                            
                            return (
                                <Card
                                    key={review._id}
                                    elevation={0}
                                    sx={{
                                        borderRadius: 1.5,
                                        border: `1px solid ${theme.palette.divider}`,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <CardContent sx={{ p: 1.5 }}>
                                        <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                                            <Box
                                                component="img"
                                                src={review.featuredImage || 'https://via.placeholder.com/50x50?text=No+Image'}
                                                alt={review.itemName}
                                                onError={handleImageError}
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    objectFit: 'cover',
                                                    borderRadius: 1.5,
                                                    border: `1px solid ${theme.palette.divider}`,
                                                    backgroundColor: theme.palette.background.default,
                                                }}
                                            />
                                            
                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                                    {review.itemName}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                                                    By: {review.name || 'Anonymous'}
                                                </Typography>
                                            </Box>
                                            
                                            <Chip
                                                label={status.label}
                                                size="small"
                                                sx={{
                                                    backgroundColor: status.bgColor,
                                                    color: status.color,
                                                    fontWeight: 500,
                                                    fontSize: '0.65rem',
                                                    height: 22,
                                                }}
                                            />
                                        </Box>

                                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Chip
                                                    label={review.type === 'product' ? 'Product' : 'Pet'}
                                                    size="small"
                                                    icon={getItemTypeIcon(review.type)}
                                                    sx={{
                                                        backgroundColor: alpha(itemTypeColor, 0.1),
                                                        color: itemTypeColor,
                                                        fontWeight: 500,
                                                        fontSize: '0.65rem',
                                                        height: 22,
                                                    }}
                                                />
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <Rating
                                                        value={review.rating}
                                                        readOnly
                                                        size="small"
                                                        precision={0.5}
                                                        sx={{ fontSize: '0.9rem' }}
                                                    />
                                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                                                        ({review.rating})
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                                                {formatDate(review.createdAt)}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            sx={{
                                                fontSize: '0.78rem',
                                                color: 'text.secondary',
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {review.comment}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </Box>
            ) : (
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: 1.5,
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: 'auto',
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', py: 1.5 }}>Product / Pet</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', py: 1.5 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', py: 1.5 }}>Rating</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', py: 1.5 }}>Review</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', py: 1.5 }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', py: 1.5 }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedReviews.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <Box py={3}>
                                            <StarIcon sx={{ fontSize: 42, color: alpha(theme.palette.text.primary, 0.15), mb: 1.5 }} />
                                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                                No reviews yet. Start reviewing your purchased products or pets!
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedReviews.map((review) => {
                                    const status = getApprovalStatusChip(review.approved);
                                    const itemTypeColor = getItemTypeColor(review.type);
                                    
                                    return (
                                        <TableRow
                                            key={review._id}
                                            hover
                                            sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.02) } }}
                                        >
                                            <TableCell sx={{ py: 1.5 }}>
                                                <Box display="flex" alignItems="center" gap={1.5}>
                                                    <Box
                                                        component="img"
                                                        src={review.featuredImage || 'https://via.placeholder.com/50x50?text=No+Image'}
                                                        alt={review.itemName}
                                                        onError={handleImageError}
                                                        sx={{
                                                            width: 44,
                                                            height: 44,
                                                            objectFit: 'cover',
                                                            borderRadius: 1.5,
                                                            border: `1px solid ${theme.palette.divider}`,
                                                            backgroundColor: theme.palette.background.default,
                                                        }}
                                                    />
                                                    
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
                                                            {review.itemName}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary' }}>
                                                            ID: {review.itemId?.slice(-8)}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary' }}>
                                                            By: {review.name || 'Anonymous'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            <TableCell sx={{ py: 1.5 }}>
                                                <Chip
                                                    label={review.type === 'product' ? 'Product' : 'Pet'}
                                                    size="small"
                                                    icon={getItemTypeIcon(review.type)}
                                                    sx={{
                                                        backgroundColor: alpha(itemTypeColor, 0.1),
                                                        color: itemTypeColor,
                                                        fontWeight: 500,
                                                        fontSize: '0.68rem',
                                                        height: 24,
                                                        textTransform: 'capitalize',
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell sx={{ py: 1.5 }}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Rating
                                                        value={review.rating}
                                                        readOnly
                                                        size="small"
                                                        precision={0.5}
                                                        sx={{ fontSize: '1rem' }}
                                                    />
                                                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 600 }}>
                                                        ({review.rating})
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            <TableCell sx={{ py: 1.5 }}>
                                                <Tooltip title={review.comment} arrow>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '0.8rem',
                                                            maxWidth: 250,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        {review.comment}
                                                    </Typography>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{ py: 1.5 }}>
                                                <Typography sx={{ fontSize: '0.78rem' }}>
                                                    {formatDate(review.createdAt)}
                                                </Typography>
                                            </TableCell>

                                            <TableCell sx={{ py: 1.5 }}>
                                                <Chip
                                                    label={status.label}
                                                    size="small"
                                                    icon={status.icon}
                                                    sx={{
                                                        backgroundColor: status.bgColor,
                                                        color: status.color,
                                                        fontWeight: 500,
                                                        fontSize: '0.68rem',
                                                        height: 24,
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>

                    {reviewsData.length > 0 && (
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={reviewsData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{
                                borderTop: `1px solid ${theme.palette.divider}`,
                                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                    fontSize: '0.72rem',
                                },
                                '& .MuiSelect-select': { fontSize: '0.72rem' },
                                '& .MuiTablePagination-actions button': { fontSize: '0.72rem' },
                            }}
                        />
                    )}
                </TableContainer>
            )}
        </Box>
    );
}

const StatCard = ({ title, value, icon, color, subtitle, isMobile }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: isMobile ? 1.5 : 2,
                borderRadius: 1.5,
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                    borderColor: color,
                    boxShadow: `0 4px 12px ${alpha(color, 0.1)}`,
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography sx={{ 
                        fontSize: isMobile ? '0.6rem' : '0.65rem', 
                        color: 'text.secondary', 
                        fontWeight: 600, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.5px' 
                    }}>
                        {title}
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: isMobile ? '1.1rem' : '1.25rem', mt: 0.5, color: 'text.primary' }}>
                        {value}
                    </Typography>
                    {subtitle && (
                        <Box sx={{ mt: 0.5 }}>
                            {subtitle}
                        </Box>
                    )}
                </Box>
                <Box
                    sx={{
                        width: isMobile ? 32 : 36,
                        height: isMobile ? 32 : 36,
                        borderRadius: 1.5,
                        backgroundColor: alpha(color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: color,
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </Paper>
    );
};