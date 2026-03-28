import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  alpha,
  useTheme,
  styled,
  Tooltip,
  Chip,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';
import {
  People as PeopleIcon,
  Pets as PetsIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  VerifiedUser as VerifiedUserIcon,
  Favorite as FavoriteIcon,
  LocalOffer as LocalOfferIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  RateReview as RateReviewIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { AlertCircleIcon } from 'lucide-react';

// ─── Color Palette ────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec407a',
  text: '#1f2937',
  border: '#e5e7eb',
  bg: '#f9fafb',
};

// ─── Styled Components ────────────────────────────────────────────────────────
const DashboardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  padding: '0',
}));

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: '28px',
  '& h1': {
    fontSize: '28px',
    fontWeight: 700,
    color: theme.palette.text.primary,
    marginBottom: '4px',
  },
  '& p': {
    fontSize: '13px',
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  border: `1px solid ${COLORS.border}`,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  background: theme.palette.background.paper,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    borderColor: COLORS.primary,
    boxShadow: `0 4px 12px ${alpha(COLORS.primary, 0.08)}`,
    transform: 'translateY(-2px)',
  },
}));

const StatCardContent = styled(CardContent)(({ theme }) => ({
  padding: '18px !important',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const StatIcon = styled(Box)(({ bgColor }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  backgroundColor: alpha(bgColor || COLORS.primary, 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '10px',
  color: bgColor || COLORS.primary,
  '& svg': {
    fontSize: '20px',
  },
}));

const StatValue = styled(Typography)({
  fontSize: '20px',
  fontWeight: 700,
  color: COLORS.text,
  marginBottom: '2px',
  lineHeight: 1.2,
});

const StatLabel = styled(Typography)({
  fontSize: '11px',
  color: '#6b7280',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
  marginBottom: '6px',
});

const StatTrend = styled(Box)(({ positive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '11px',
  color: positive ? COLORS.success : COLORS.danger,
  fontWeight: 600,
  marginTop: '6px',
  '& svg': {
    fontSize: '12px',
  },
}));

const DetailRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '6px 0',
  fontSize: '12px',
  '& .label': {
    color: '#6b7280',
    fontWeight: 500,
  },
  '& .value': {
    fontWeight: 700,
    color: COLORS.text,
  },
});

const DetailsList = styled(Box)({
  marginTop: '10px',
  paddingTop: '10px',
  borderTop: `1px solid ${COLORS.border}`,
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '500px',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 700,
  color: COLORS.text,
  marginBottom: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
  '& svg': {
    fontSize: '14px',
    opacity: 0.7,
  },
}));

// ─── Main Component ───────────────────────────────────────────────────────────
export const SuperAdminDashboard = () => {
  const theme = useTheme();
  const TEXT_PRIMARY = theme.palette.text.primary;

  // Fetch Users Stats
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users-stats'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/users');
        const users = response.data.data || response.data || [];
        return Array.isArray(users) ? users : [];
      } catch (error) {
        console.error('Failed to fetch users:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch Cats Stats
  const { data: catsData, isLoading: catsLoading } = useQuery({
    queryKey: ['admin-cats-stats'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/cats?limit=100');
        const cats = response.data.data || response.data || [];
        return Array.isArray(cats) ? cats : [];
      } catch (error) {
        console.error('Failed to fetch cats:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch Products Stats
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products-stats'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/products?limit=100');
        const products = response.data.data || response.data || [];
        return Array.isArray(products) ? products : [];
      } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Calculate User Stats
  const userStats = useMemo(() => {
    if (!usersData || usersData.length === 0) {
      return {
        total: 0,
        admins: 0,
        users: 0,
        verified: 0,
        unverified: 0,
        verificationRate: 0,
      };
    }
    const verified = usersData.filter(u => u.isVerified === true).length;
    return {
      total: usersData.length,
      admins: usersData.filter(u => u.role === 'admin' || u.role === 'superadmin').length,
      users: usersData.filter(u => u.role === 'user').length,
      verified: verified,
      unverified: usersData.length - verified,
      verificationRate: ((verified / usersData.length) * 100).toFixed(1),
    };
  }, [usersData]);

  // Calculate Cat Stats
  const catStats = useMemo(() => {
    if (!catsData || catsData.length === 0) {
      return {
        total: 0,
        available: 0,
        adopted: 0,
        featured: 0,
        male: 0,
        female: 0,
        avgRating: 0,
        totalReviews: 0,
        catsWithReviews: 0,
        neuteredCount: 0,
        vaccinatedCount: 0,
        totalGalleryImages: 0,
        uniqueBreeds: 0,
      };
    }

    const totalReviews = catsData.reduce((sum, c) => sum + (c.reviews?.length || 0), 0);
    const catsWithReviews = catsData.filter(c => (c.reviews?.length || 0) > 0).length;
    const avgRating = catsWithReviews > 0
      ? (catsData.reduce((sum, c) => sum + (c.reviews?.reduce((rsum, r) => rsum + r.rating, 0) || 0), 0) / totalReviews).toFixed(1)
      : 0;

    const breedsSet = new Set(catsData.filter(c => c.breed).map(c => c.breed));

    return {
      total: catsData.length,
      available: catsData.filter(c => c.status === 'available' || c.inStock === true).length,
      adopted: catsData.filter(c => c.status === 'adopted').length,
      featured: catsData.filter(c => c.isFeatured === true).length,
      male: catsData.filter(c => c.gender === 'male').length,
      female: catsData.filter(c => c.gender === 'female').length,
      avgRating: avgRating,
      totalReviews: totalReviews,
      catsWithReviews: catsWithReviews,
      neuteredCount: catsData.filter(c => c.neutered).length,
      vaccinatedCount: catsData.filter(c => c.vaccinated).length,
      totalGalleryImages: catsData.reduce((sum, c) => sum + (c.gallery?.length || 0), 0),
      uniqueBreeds: breedsSet.size,
    };
  }, [catsData]);

  // Calculate Product Stats
  const productStats = useMemo(() => {
    if (!productsData || productsData.length === 0) {
      return {
        total: 0,
        inStock: 0,
        outOfStock: 0,
        featured: 0,
        totalValue: 0,
        avgPrice: 0,
        avgRating: 0,
        totalReviews: 0,
        productsWithReviews: 0,
        totalGalleryImages: 0,
        uniqueCategories: 0,
        stockPercentage: 0,
      };
    }

    const totalValue = productsData.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);
    const avgPrice = (totalValue / productsData.length).toFixed(2);

    const totalReviews = productsData.reduce((sum, p) => sum + (p.reviews?.length || 0), 0);
    const productsWithReviews = productsData.filter(p => (p.reviews?.length || 0) > 0).length;
    const avgRating = productsWithReviews > 0
      ? (productsData.reduce((sum, p) => sum + (p.reviews?.reduce((rsum, r) => rsum + r.rating, 0) || 0), 0) / totalReviews).toFixed(1)
      : 0;

    const categoriesSet = new Set(productsData.filter(p => p.category).map(p => p.category));
    const inStock = productsData.filter(p => p.inStock === true).length;

    return {
      total: productsData.length,
      inStock: inStock,
      outOfStock: productsData.filter(p => p.inStock === false).length,
      featured: productsData.filter(p => p.isFeatured === true).length,
      totalValue: totalValue.toFixed(2),
      avgPrice: avgPrice,
      avgRating: avgRating,
      totalReviews: totalReviews,
      productsWithReviews: productsWithReviews,
      totalGalleryImages: productsData.reduce((sum, p) => sum + (p.gallery?.length || 0), 0),
      uniqueCategories: categoriesSet.size,
      stockPercentage: ((inStock / productsData.length) * 100).toFixed(1),
    };
  }, [productsData]);

  const isLoading = usersLoading || catsLoading || productsLoading;

  if (isLoading) {
    return (
      <DashboardContainer>
        <Helmet>
          <title>Dashboard | FatherOfMeow</title>
          <meta name="description" content="Admin dashboard" />
        </Helmet>
        <LoadingContainer>
          <CircularProgress size={40} />
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Helmet>
        <title>Dashboard | FatherOfMeow</title>
        <meta name="description" content="Admin dashboard" />
      </Helmet>

      {/* Page Header */}
      <PageHeader>
        <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_PRIMARY, fontSize: '1rem', mb: '4px' }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.6), fontSize: '13px' }}>
          Platform overview — users, cats, products & inventory at a glance.
        </Typography>
      </PageHeader>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 1: USERS STATISTICS (8 cards)
          ════════════════════════════════════════════════════════════════ */}
      <Box sx={{ mb: 3.5 }}>
        <SectionTitle>
          <PeopleIcon /> Users Analytics
        </SectionTitle>
        <Grid container spacing={2}>
          {[
            {
              label: 'Total Users',
              value: userStats.total,
              icon: <PeopleIcon />,
              color: COLORS.primary,
              trend: `${userStats.verified} verified`,
            },
            {
              label: 'Admin Users',
              value: userStats.admins,
              icon: <VerifiedUserIcon />,
              color: COLORS.success,
              trend: `${((userStats.admins / userStats.total) * 100).toFixed(1)}% of total`,
            },
            {
              label: 'Regular Users',
              value: userStats.users,
              icon: <PeopleIcon />,
              color: COLORS.info,
              trend: `${((userStats.users / userStats.total) * 100).toFixed(1)}% of total`,
            },
            {
              label: 'Verified',
              value: userStats.verified,
              icon: <CheckCircleIcon />,
              color: COLORS.success,
              trend: `${userStats.verificationRate}% verified`,
            },
            {
              label: 'Unverified',
              value: userStats.unverified,
              icon: <AlertCircleIcon />,
              color: COLORS.danger,
              trend: `${(100 - parseFloat(userStats.verificationRate)).toFixed(1)}% pending`,
            },
          ].map(({ label, value, icon, color, trend }) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={label}>
              <Tooltip title={trend} arrow>
                <StatCard>
                  <StatCardContent>
                    <StatIcon bgColor={color}>{icon}</StatIcon>
                    <StatValue>{value}</StatValue>
                    <StatLabel>{label}</StatLabel>
                    <StatTrend positive={true}>
                      <TrendingUpIcon /> {trend}
                    </StatTrend>
                  </StatCardContent>
                </StatCard>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 2: CATS STATISTICS (12 cards)
          ════════════════════════════════════════════════════════════════ */}
      <Box sx={{ mb: 3.5 }}>
        <SectionTitle>
          <PetsIcon /> Cats Management
        </SectionTitle>
        <Grid container spacing={2}>
          {[
            {
              label: 'Total Cats',
              value: catStats.total,
              icon: <PetsIcon />,
              color: COLORS.primary,
              trend: `${catStats.uniqueBreeds} breeds`,
            },
            {
              label: 'Available',
              value: catStats.available,
              icon: <CheckCircleIcon />,
              color: COLORS.success,
              trend: `${catStats.total > 0 ? ((catStats.available / catStats.total) * 100).toFixed(1) : 0}% available`,
            },
            {
              label: 'Adopted',
              value: catStats.adopted,
              icon: <FavoriteIcon />,
              color: COLORS.pink,
              trend: `${catStats.total > 0 ? ((catStats.adopted / catStats.total) * 100).toFixed(1) : 0}% adopted`,
            },
            {
              label: 'Featured',
              value: catStats.featured,
              icon: <StarIcon />,
              color: COLORS.warning,
              trend: `${catStats.total > 0 ? ((catStats.featured / catStats.total) * 100).toFixed(1) : 0}% featured`,
            },
            {
              label: 'Female',
              value: catStats.female,
              icon: <FemaleIcon />,
              color: COLORS.danger,
              trend: `${catStats.total > 0 ? ((catStats.female / catStats.total) * 100).toFixed(1) : 0}% female`,
            },
            {
              label: 'Male',
              value: catStats.male,
              icon: <MaleIcon />,
              color: COLORS.primary,
              trend: `${catStats.total > 0 ? ((catStats.male / catStats.total) * 100).toFixed(1) : 0}% male`,
            },
            {
              label: 'Neutered',
              value: catStats.neuteredCount,
              icon: <CheckCircleIcon />,
              color: COLORS.info,
              trend: `${catStats.total > 0 ? ((catStats.neuteredCount / catStats.total) * 100).toFixed(1) : 0}% neutered`,
            },
            {
              label: 'Vaccinated',
              value: catStats.vaccinatedCount,
              icon: <CheckCircleIcon />,
              color: COLORS.success,
              trend: `${catStats.total > 0 ? ((catStats.vaccinatedCount / catStats.total) * 100).toFixed(1) : 0}% vaccinated`,
            },
            {
              label: 'Avg Rating',
              value: catStats.avgRating,
              icon: <StarIcon />,
              color: COLORS.warning,
              trend: `${catStats.totalReviews} reviews`,
            },
            {
              label: 'Total Reviews',
              value: catStats.totalReviews,
              icon: <RateReviewIcon />,
              color: COLORS.primary,
              trend: `${catStats.catsWithReviews} with reviews`,
            },
            {
              label: 'Gallery Images',
              value: catStats.totalGalleryImages,
              icon: <ImageIcon />,
              color: COLORS.warning,
              trend: `Avg ${catStats.total > 0 ? (catStats.totalGalleryImages / catStats.total).toFixed(1) : 0} per cat`,
            },
            {
              label: 'Unique Breeds',
              value: catStats.uniqueBreeds,
              icon: <PetsIcon />,
              color: COLORS.purple,
              trend: `${catStats.total} cats total`,
            },
          ].map(({ label, value, icon, color, trend }) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={label}>
              <Tooltip title={trend} arrow>
                <StatCard>
                  <StatCardContent>
                    <StatIcon bgColor={color}>{icon}</StatIcon>
                    <StatValue>{value}</StatValue>
                    <StatLabel>{label}</StatLabel>
                    <StatTrend positive={true}>
                      <TrendingUpIcon /> {trend}
                    </StatTrend>
                  </StatCardContent>
                </StatCard>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 3: PRODUCTS STATISTICS (12 cards)
          ════════════════════════════════════════════════════════════════ */}
      <Box sx={{ mb: 3.5 }}>
        <SectionTitle>
          <ShoppingCartIcon /> Products Inventory
        </SectionTitle>
        <Grid container spacing={2}>
          {[
            {
              label: 'Total Products',
              value: productStats.total,
              icon: <ShoppingCartIcon />,
              color: COLORS.primary,
              trend: `${productStats.uniqueCategories} categories`,
            },
            {
              label: 'In Stock',
              value: productStats.inStock,
              icon: <CheckCircleIcon />,
              color: COLORS.success,
              trend: `${productStats.stockPercentage}% available`,
            },
            {
              label: 'Out of Stock',
              value: productStats.outOfStock,
              icon: <AlertCircleIcon />,
              color: COLORS.danger,
              trend: `${(100 - parseFloat(productStats.stockPercentage)).toFixed(1)}% unavailable`,
            },
            {
              label: 'Featured',
              value: productStats.featured,
              icon: <StarIcon />,
              color: COLORS.warning,
              trend: `${productStats.total > 0 ? ((productStats.featured / productStats.total) * 100).toFixed(1) : 0}% featured`,
            },
            {
              label: 'Total Value',
              value: `৳${parseInt(productStats.totalValue).toLocaleString()}`,
              icon: <LocalOfferIcon />,
              color: COLORS.success,
              trend: `${productStats.total} products`,
            },
            {
              label: 'Avg Price',
              value: `৳${parseInt(productStats.avgPrice).toLocaleString()}`,
              icon: <LocalOfferIcon />,
              color: COLORS.purple,
              trend: `Per product average`,
            },
            {
              label: 'Avg Rating',
              value: productStats.avgRating,
              icon: <StarIcon />,
              color: COLORS.warning,
              trend: `${productStats.totalReviews} reviews`,
            },
            {
              label: 'Total Reviews',
              value: productStats.totalReviews,
              icon: <RateReviewIcon />,
              color: COLORS.primary,
              trend: `${productStats.productsWithReviews} with reviews`,
            },
            {
              label: 'Gallery Images',
              value: productStats.totalGalleryImages,
              icon: <ImageIcon />,
              color: COLORS.warning,
              trend: `Avg ${productStats.total > 0 ? (productStats.totalGalleryImages / productStats.total).toFixed(1) : 0} per product`,
            },
            {
              label: 'Categories',
              value: productStats.uniqueCategories,
              icon: <ShoppingCartIcon />,
              color: COLORS.info,
              trend: `${productStats.total} products`,
            },
            {
              label: 'Stock Rate',
              value: `${productStats.stockPercentage}%`,
              icon: <CheckCircleIcon />,
              color: COLORS.success,
              trend: `${productStats.inStock}/${productStats.total} in stock`,
            },
            {
              label: 'Reviewed',
              value: productStats.productsWithReviews,
              icon: <CheckCircleIcon />,
              color: COLORS.info,
              trend: `${((productStats.productsWithReviews / productStats.total) * 100).toFixed(1)}% reviewed`,
            },
          ].map(({ label, value, icon, color, trend }) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={label}>
              <Tooltip title={trend} arrow>
                <StatCard>
                  <StatCardContent>
                    <StatIcon bgColor={color}>{icon}</StatIcon>
                    <StatValue>{value}</StatValue>
                    <StatLabel>{label}</StatLabel>
                    <StatTrend positive={true}>
                      <TrendingUpIcon /> {trend}
                    </StatTrend>
                  </StatCardContent>
                </StatCard>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 4: PLATFORM SUMMARY (Quick Overview)
          ════════════════════════════════════════════════════════════════ */}
      <Box>
        <SectionTitle>
          <TrendingUpIcon /> Platform Summary
        </SectionTitle>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard>
              <StatCardContent>
                <StatIcon bgColor={COLORS.primary}>
                  <PeopleIcon />
                </StatIcon>
                <StatValue>{userStats.total}</StatValue>
                <StatLabel>Total Users</StatLabel>
                <DetailsList>
                  <DetailRow>
                    <span className="label">Verified</span>
                    <span className="value">{userStats.verified}</span>
                  </DetailRow>
                  <DetailRow>
                    <span className="label">Admins</span>
                    <span className="value">{userStats.admins}</span>
                  </DetailRow>
                </DetailsList>
              </StatCardContent>
            </StatCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard>
              <StatCardContent>
                <StatIcon bgColor={COLORS.pink}>
                  <PetsIcon />
                </StatIcon>
                <StatValue>{catStats.total}</StatValue>
                <StatLabel>Total Cats</StatLabel>
                <DetailsList>
                  <DetailRow>
                    <span className="label">Available</span>
                    <span className="value">{catStats.available}</span>
                  </DetailRow>
                  <DetailRow>
                    <span className="label">Rating</span>
                    <span className="value">⭐ {catStats.avgRating}</span>
                  </DetailRow>
                </DetailsList>
              </StatCardContent>
            </StatCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard>
              <StatCardContent>
                <StatIcon bgColor={COLORS.warning}>
                  <ShoppingCartIcon />
                </StatIcon>
                <StatValue>{productStats.total}</StatValue>
                <StatLabel>Total Products</StatLabel>
                <DetailsList>
                  <DetailRow>
                    <span className="label">In Stock</span>
                    <span className="value">{productStats.inStock}</span>
                  </DetailRow>
                  <DetailRow>
                    <span className="label">Rating</span>
                    <span className="value">⭐ {productStats.avgRating}</span>
                  </DetailRow>
                </DetailsList>
              </StatCardContent>
            </StatCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard>
              <StatCardContent>
                <StatIcon bgColor={COLORS.success}>
                  <LocalOfferIcon />
                </StatIcon>
                <StatValue>৳{parseInt(productStats.totalValue).toLocaleString()}</StatValue>
                <StatLabel>Inventory Value</StatLabel>
                <DetailsList>
                  <DetailRow>
                    <span className="label">Avg Price</span>
                    <span className="value">৳{parseInt(productStats.avgPrice).toLocaleString()}</span>
                  </DetailRow>
                  <DetailRow>
                    <span className="label">Categories</span>
                    <span className="value">{productStats.uniqueCategories}</span>
                  </DetailRow>
                </DetailsList>
              </StatCardContent>
            </StatCard>
          </Grid>
        </Grid>
      </Box>
    </DashboardContainer>
  );
};

export default SuperAdminDashboard;