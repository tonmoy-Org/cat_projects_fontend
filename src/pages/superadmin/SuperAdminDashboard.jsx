import React from 'react';
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
} from '@mui/icons-material';

// Styled Components
const DashboardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
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

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  background: theme.palette.background.paper,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
  },
}));

const StatCardContent = styled(CardContent)(({ theme }) => ({
  padding: '18px !important',
}));

const StatIcon = styled(Box)(({ theme, bgColor }) => ({
  width: '44px',
  height: '44px',
  borderRadius: '10px',
  backgroundColor: bgColor || alpha(theme.palette.primary.main, 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '12px',
  '& svg': {
    fontSize: '22px',
    color: bgColor ? '#fff' : theme.palette.primary.main,
  },
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '26px',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: '4px',
  lineHeight: 1.2,
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.text.secondary,
  fontWeight: 500,
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
}));

const StatChange = styled(Box)(({ theme, positive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginTop: '8px',
  fontSize: '12px',
  color: positive ? theme.palette.success.main : theme.palette.error.main,
  fontWeight: 600,
  '& svg': {
    fontSize: '14px',
  },
}));

const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '7px 0',
  fontSize: '12px',
  '& .label': {
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
  '& .value': {
    fontWeight: 700,
    color: theme.palette.text.primary,
    fontSize: '13px',
  },
}));

const DetailsList = styled(Box)(({ theme }) => ({
  marginTop: '12px',
  paddingTop: '12px',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '500px',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: '16px',
  marginTop: '0px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  '& svg': {
    fontSize: '16px',
    opacity: 0.7,
  },
}));

const LargeStatsCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  background: theme.palette.background.paper,
  height: '100%',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
  },
}));

const Divider = styled(Box)(({ theme }) => ({
  height: '1px',
  background: theme.palette.divider,
  margin: '0 -18px',
}));

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
  const userStats = React.useMemo(() => {
    if (!usersData || usersData.length === 0) {
      return { total: 0, admins: 0, users: 0, verified: 0 };
    }
    return {
      total: usersData.length,
      admins: usersData.filter(u => u.role === 'admin' || u.role === 'superadmin').length,
      users: usersData.filter(u => u.role === 'user').length,
      verified: usersData.filter(u => u.isVerified === true).length,
    };
  }, [usersData]);

  // Calculate Cat Stats
  const catStats = React.useMemo(() => {
    if (!catsData || catsData.length === 0) {
      return { total: 0, available: 0, adopted: 0, featured: 0, male: 0, female: 0, avgRating: 0 };
    }
    return {
      total: catsData.length,
      available: catsData.filter(c => c.status === 'available').length,
      adopted: catsData.filter(c => c.status === 'adopted').length,
      featured: catsData.filter(c => c.isFeatured === true).length,
      male: catsData.filter(c => c.gender === 'male').length,
      female: catsData.filter(c => c.gender === 'female').length,
      avgRating: catsData.length > 0
        ? (catsData.reduce((sum, c) => sum + (c.averageRating || 0), 0) / catsData.length).toFixed(1)
        : 0,
    };
  }, [catsData]);

  // Calculate Product Stats
  const productStats = React.useMemo(() => {
    if (!productsData || productsData.length === 0) {
      return { total: 0, inStock: 0, outOfStock: 0, featured: 0, totalValue: 0, avgPrice: 0, avgRating: 0 };
    }
    const totalValue = productsData.reduce((sum, p) => sum + (p.price || 0), 0);
    const avgPrice = (totalValue / productsData.length).toFixed(2);
    const avgRating = (productsData.reduce((sum, p) => sum + (p.rating || 0), 0) / productsData.length).toFixed(1);

    return {
      total: productsData.length,
      inStock: productsData.filter(p => p.inStock === true).length,
      outOfStock: productsData.filter(p => p.inStock === false).length,
      featured: productsData.filter(p => p.isFeatured === true).length,
      totalValue: totalValue.toFixed(2),
      avgPrice: avgPrice,
      avgRating: avgRating,
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
          <CircularProgress size={32} />
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
        <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_PRIMARY, fontSize: '22px', mb: '3px' }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.55), fontSize: '13px' }}>
          Platform overview — users, cats & inventory at a glance.
        </Typography>
      </PageHeader>

      {/* ==================== ROW 1: Users Section (8) + Key Stats (4) ==================== */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {/* Users Card - Large (8 cols) */}
        <Grid size={{ xs: 12, md: 8 }}>
          <LargeStatsCard>
            <StatCardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <StatIcon bgColor={theme.palette.primary.main}>
                  <PeopleIcon />
                </StatIcon>
                <Box>
                  <StatValue sx={{ mb: 0 }}>{userStats.total}</StatValue>
                  <StatLabel sx={{ mb: 0 }}>Total Users</StatLabel>
                </Box>
              </Box>
              <DetailsList>
                <DetailRow>
                  <span className="label">✓ Verified Users</span>
                  <span className="value">{userStats.verified}</span>
                </DetailRow>
                <DetailRow>
                  <span className="label">🔑 Admin Users</span>
                  <span className="value">{userStats.admins}</span>
                </DetailRow>
                <DetailRow>
                  <span className="label">👤 Regular Users</span>
                  <span className="value">{userStats.users}</span>
                </DetailRow>
                <DetailRow>
                  <span className="label">Verification Rate</span>
                  <span className="value">
                    {userStats.total > 0 ? ((userStats.verified / userStats.total) * 100).toFixed(1) : 0}%
                  </span>
                </DetailRow>
              </DetailsList>
              <LinearProgress
                variant="determinate"
                value={userStats.total > 0 ? (userStats.verified / userStats.total) * 100 : 0}
                sx={{ mt: 2, height: 5, borderRadius: 3 }}
              />
            </StatCardContent>
          </LargeStatsCard>
        </Grid>

        {/* Quick Stats - Small (4 cols) */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard sx={{ height: '100%' }}>
            <StatCardContent>
              <StatIcon bgColor="#4CAF50">
                <VerifiedUserIcon />
              </StatIcon>
              <StatValue>{userStats.verified}</StatValue>
              <StatLabel>Verified</StatLabel>
              <StatChange positive={true}>
                <TrendingUpIcon /> {userStats.total > 0 ? ((userStats.verified / userStats.total) * 100).toFixed(0) : 0}% Active
              </StatChange>
            </StatCardContent>
          </StatsCard>
        </Grid>
      </Grid>

      {/* ==================== ROW 2: Small Stats (4 + 4 + 4) ==================== */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard>
            <StatCardContent>
              <StatIcon bgColor="#FF9800">
                <PetsIcon />
              </StatIcon>
              <StatValue>{catStats.total}</StatValue>
              <StatLabel>Total Cats</StatLabel>
              <StatChange positive={true}>
                <TrendingUpIcon /> {catStats.featured} Featured
              </StatChange>
            </StatCardContent>
          </StatsCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard>
            <StatCardContent>
              <StatIcon bgColor="#2196F3">
                <ShoppingCartIcon />
              </StatIcon>
              <StatValue>{productStats.total}</StatValue>
              <StatLabel>Total Products</StatLabel>
              <StatChange positive={true}>
                <TrendingUpIcon /> {productStats.featured} Featured
              </StatChange>
            </StatCardContent>
          </StatsCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard>
            <StatCardContent>
              <StatIcon bgColor="#E91E63">
                <LocalOfferIcon />
              </StatIcon>
              <StatValue>৳{productStats.totalValue}</StatValue>
              <StatLabel>Inventory Value</StatLabel>
            </StatCardContent>
          </StatsCard>
        </Grid>
      </Grid>

      {/* ==================== ROW 3: Cats Section (4) + Products Section (8) ==================== */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {/* Cats Quick Stats - Small (4 cols) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <LargeStatsCard>
            <StatCardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <StatIcon bgColor="#FF9800">
                  <PetsIcon />
                </StatIcon>
                <Box>
                  <StatValue sx={{ mb: 0 }}>{catStats.total}</StatValue>
                  <StatLabel sx={{ mb: 0 }}>Cats in System</StatLabel>
                </Box>
              </Box>
              <DetailsList>
                <DetailRow>
                  <span className="label">Available</span>
                  <span className="value">{catStats.available}</span>
                </DetailRow>
                <DetailRow>
                  <span className="label">Adopted</span>
                  <span className="value">{catStats.adopted}</span>
                </DetailRow>
                <DetailRow>
                  <span className="label">Featured</span>
                  <span className="value">{catStats.featured}</span>
                </DetailRow>
                <DetailRow>
                  <span className="label">Rating</span>
                  <span className="value">{catStats.avgRating} ⭐</span>
                </DetailRow>
              </DetailsList>
              <LinearProgress
                variant="determinate"
                value={catStats.total > 0 ? (catStats.available / catStats.total) * 100 : 0}
                sx={{ mt: 2, height: 5, borderRadius: 3 }}
              />
            </StatCardContent>
          </LargeStatsCard>
        </Grid>

        {/* Products Details - Large (8 cols) */}
        <Grid size={{ xs: 12, md: 8 }}>
          <LargeStatsCard>
            <StatCardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <StatIcon bgColor="#2196F3">
                  <ShoppingCartIcon />
                </StatIcon>
                <Box>
                  <StatValue sx={{ mb: 0 }}>{productStats.total}</StatValue>
                  <StatLabel sx={{ mb: 0 }}>Products Available</StatLabel>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <DetailsList sx={{ mt: 0, pt: 0, borderTop: 'none' }}>
                    <DetailRow>
                      <span className="label">In Stock</span>
                      <span className="value">{productStats.inStock}</span>
                    </DetailRow>
                    <DetailRow>
                      <span className="label">Out of Stock</span>
                      <span className="value">{productStats.outOfStock}</span>
                    </DetailRow>
                  </DetailsList>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <DetailsList sx={{ mt: 0, pt: 0, borderTop: 'none' }}>
                    <DetailRow>
                      <span className="label">Avg Price</span>
                      <span className="value">৳{productStats.avgPrice}</span>
                    </DetailRow>
                    <DetailRow>
                      <span className="label">Avg Rating</span>
                      <span className="value">{productStats.avgRating} ⭐</span>
                    </DetailRow>
                  </DetailsList>
                </Grid>
              </Grid>
              <LinearProgress
                variant="determinate"
                value={productStats.total > 0 ? (productStats.inStock / productStats.total) * 100 : 0}
                sx={{ mt: 2, height: 5, borderRadius: 3 }}
              />
            </StatCardContent>
          </LargeStatsCard>
        </Grid>
      </Grid>

      {/* ==================== ROW 4: Gender Distribution + Stock Status ==================== */}
      <Grid container spacing={2.5}>
        {/* Cats Gender - Large (8 cols) */}
        <Grid size={{ xs: 12, md: 8 }}>
          <LargeStatsCard>
            <StatCardContent>
              <SectionTitle>
                <PetsIcon /> Cat Gender Distribution
              </SectionTitle>
              <Grid container spacing={3}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <StatIcon bgColor="#9C27B0" sx={{ mx: 'auto', mb: 1.5 }}>
                      <PetsIcon />
                    </StatIcon>
                    <StatValue>{catStats.male}</StatValue>
                    <StatLabel>Male Cats</StatLabel>
                    <LinearProgress
                      variant="determinate"
                      value={catStats.total > 0 ? (catStats.male / catStats.total) * 100 : 0}
                      sx={{ mt: 1.5, height: 5, borderRadius: 3 }}
                    />
                    <Typography sx={{ mt: 0.75, fontSize: '11px', color: theme.palette.text.secondary, fontWeight: 600 }}>
                      {catStats.total > 0 ? ((catStats.male / catStats.total) * 100).toFixed(1) : 0}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <StatIcon bgColor="#E91E63" sx={{ mx: 'auto', mb: 1.5 }}>
                      <PetsIcon />
                    </StatIcon>
                    <StatValue>{catStats.female}</StatValue>
                    <StatLabel>Female Cats</StatLabel>
                    <LinearProgress
                      variant="determinate"
                      value={catStats.total > 0 ? (catStats.female / catStats.total) * 100 : 0}
                      sx={{ mt: 1.5, height: 5, borderRadius: 3 }}
                    />
                    <Typography sx={{ mt: 0.75, fontSize: '11px', color: theme.palette.text.secondary, fontWeight: 600 }}>
                      {catStats.total > 0 ? ((catStats.female / catStats.total) * 100).toFixed(1) : 0}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </StatCardContent>
          </LargeStatsCard>
        </Grid>

        {/* Stock Status - Small (4 cols) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <LargeStatsCard>
            <StatCardContent>
              <SectionTitle>
                <CheckCircleIcon /> Stock Overview
              </SectionTitle>
              <DetailsList sx={{ mt: 0, pt: 0, borderTop: 'none' }}>
                <DetailRow sx={{ py: 1.5 }}>
                  <span className="label">✓ In Stock</span>
                  <span className="value">{productStats.inStock}</span>
                </DetailRow>
                <DetailRow sx={{ py: 1.5 }}>
                  <span className="label">✗ Out of Stock</span>
                  <span className="value">{productStats.outOfStock}</span>
                </DetailRow>
                <DetailRow sx={{ py: 1.5 }}>
                  <span className="label">Stock Rate</span>
                  <span className="value">
                    {productStats.total > 0 ? ((productStats.inStock / productStats.total) * 100).toFixed(1) : 0}%
                  </span>
                </DetailRow>
              </DetailsList>
              <LinearProgress
                variant="determinate"
                value={productStats.total > 0 ? (productStats.inStock / productStats.total) * 100 : 0}
                sx={{ mt: 2, height: 5, borderRadius: 3 }}
              />
            </StatCardContent>
          </LargeStatsCard>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default SuperAdminDashboard;