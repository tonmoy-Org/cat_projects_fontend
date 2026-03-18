import React, { useState, useMemo } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  Button,
  Pagination,
  PaginationItem,
  Snackbar,
  Alert,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  Chip,
  MenuItem,
  Select,
  FormControl,
  useTheme,
  useMediaQuery,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RefreshIcon from '@mui/icons-material/Refresh';
import SectionTile from '../../components/SectionTile';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { useCart } from '../../context/CartContext';

const PRIMARY_COLOR = '#5C4D91';
const PRIMARY_DARK = '#4A3D75';
const iconColor = '#db89ca';

// ── Styled Components ─────────────────────────────────────────────────────────

const AdoptionSection = styled(Box)({
  backgroundColor: '#ffffff',
  padding: '80px 0',
  width: '100%',
  '@media (max-width: 900px)': { padding: '60px 0' },
  '@media (max-width: 600px)': { padding: '40px 0' },
});

const FilterBar = styled(Box)({
  backgroundColor: '#faf8ff',
  border: '1px solid #ede8f7',
  borderRadius: '12px',
  padding: '20px 24px',
  marginBottom: '36px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  alignItems: 'center',
  '@media (max-width: 600px)': { padding: '16px', gap: '12px' },
});

const FilterLabel = styled(Typography)({
  fontSize: '13px',
  fontWeight: 600,
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
  minWidth: 'max-content',
});

const SearchInput = styled(TextField)({
  flex: '1 1 220px',
  minWidth: '200px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '30px',
    backgroundColor: '#fff',
    fontSize: '14px',
    '& fieldset': { borderColor: '#e0d9f5' },
    '&:hover fieldset': { borderColor: PRIMARY_COLOR },
    '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
  },
  '& input': { padding: '9px 14px' },
});

const BreedSelect = styled(Select)({
  borderRadius: '30px',
  backgroundColor: '#fff',
  fontSize: '14px',
  minWidth: '160px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0d9f5' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY_COLOR },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY_COLOR },
  '& .MuiSelect-select': { padding: '9px 14px' },
});

const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  '& .MuiToggleButton-root': {
    border: '1px solid #e0d9f5',
    borderRadius: '30px !important',
    padding: '5px 16px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#555',
    textTransform: 'none',
    marginRight: '6px',
    transition: 'all 0.2s ease',
    '&.Mui-selected': {
      backgroundColor: PRIMARY_COLOR,
      color: '#fff',
      borderColor: PRIMARY_COLOR,
      '&:hover': { backgroundColor: PRIMARY_DARK },
    },
    '&:hover': { borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR },
  },
});

const PriceSliderWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  flex: '1 1 260px',
  minWidth: '240px',
  maxWidth: '100%',
});

const PriceInputRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const PriceInput = styled(TextField)({
  width: '85px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#fff',
    fontSize: '12px',
    '& fieldset': { borderColor: '#e0d9f5' },
    '&:hover fieldset': { borderColor: PRIMARY_COLOR },
    '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
  },
  '& input': {
    padding: '5px 4px',
    textAlign: 'center',
    fontWeight: 600,
    color: PRIMARY_COLOR,
    fontSize: '12px',
  },
});

const StyledSlider = styled(Slider)({
  color: PRIMARY_COLOR,
  '& .MuiSlider-thumb': {
    width: '16px',
    height: '16px',
    '&:hover': { boxShadow: `0 0 0 8px rgba(92,77,145,0.1)` },
  },
  '& .MuiSlider-rail': { backgroundColor: '#e0d9f5' },
});

const RefreshButton = styled(IconButton)({
  backgroundColor: '#f0ecfb',
  color: PRIMARY_COLOR,
  padding: '8px',
  marginLeft: '8px',
  '&:hover': {
    backgroundColor: PRIMARY_COLOR,
    color: '#fff',
  },
  '&.Mui-disabled': {
    backgroundColor: '#f0ecfb',
    opacity: 0.5,
  },
});

const ActiveFiltersRow = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  alignItems: 'center',
  marginBottom: '20px',
});

const ResultCount = styled(Typography)({
  fontSize: '14px',
  color: '#888',
  marginBottom: '20px',
});

const AdoptionCard = styled(Box)({
  width: '100%',
  borderRadius: '10px',
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.15)' },
  '&:hover .pet-image': { transform: 'scale(1.05)' },
});

const ImageWrapper = styled(Box)({ width: '100%', overflow: 'hidden' });

const PetImage = styled('img')({
  width: '100%',
  height: '280px',
  objectFit: 'cover',
  display: 'block',
  transition: 'transform 0.5s ease',
  '@media (max-width: 900px)': { height: '240px' },
  '@media (max-width: 600px)': { height: '220px' },
});

const CardBody = styled(Box)({ padding: '14px 12px', textAlign: 'center' });

const PetName = styled(Typography)({
  fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px',
});

const PetGender = styled(Typography)({
  fontSize: '13px', color: '#888', marginBottom: '8px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
  '& svg': { fontSize: '16px', color: iconColor },
});

const PetPrice = styled(Typography)({
  fontSize: '16px', fontWeight: 700, color: PRIMARY_COLOR, marginBottom: '12px',
});

const AddToCartBtn = styled(Button)({
  backgroundColor: iconColor, color: '#fff', fontSize: '13px', fontWeight: 600,
  textTransform: 'none', borderRadius: '8px', padding: '7px 16px', width: '100%',
  gap: '6px', transition: 'all 0.3s ease',
  '&:hover': { backgroundColor: '#c06bb0' },
});

const ViewCartBtn = styled(Button)({
  backgroundColor: 'transparent', color: iconColor, fontSize: '13px', fontWeight: 600,
  textTransform: 'none', borderRadius: '8px', padding: '7px 16px', width: '100%',
  gap: '6px', border: `2px solid ${iconColor}`, transition: 'all 0.3s ease',
  '&:hover': { backgroundColor: iconColor, color: '#fff' },
});

const BottomInfoWrapper = styled(Box)({
  display: 'flex', gap: '30px', alignItems: 'center', justifyContent: 'center',
  marginTop: '50px', textAlign: 'center',
  '@media (max-width: 900px)': { gap: '25px', marginTop: '45px', flexDirection: 'column' },
  '@media (max-width: 600px)': { gap: '20px', marginTop: '40px', padding: '0 20px' },
});

const InfoText = styled(Typography)({
  fontSize: '18px', color: '#333', fontWeight: 500,
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap',
  '& .phone-number': { color: iconColor, fontWeight: 700, fontSize: '20px' },
});

const AdoptButton = styled(Button)({
  backgroundColor: PRIMARY_COLOR, color: '#fff', fontSize: '16px', fontWeight: 600,
  textTransform: 'none', borderRadius: '30px',
  boxShadow: '0 5px 15px rgba(92, 77, 145, 0.3)', minWidth: '120px', padding: '10px 25px',
  '&:hover': { backgroundColor: '#4A3D75', boxShadow: '0 8px 20px rgba(92, 77, 145, 0.4)' },
});

const PaginationWrapper = styled(Box)(({ theme }) => ({
  display: 'flex', justifyContent: 'center', marginTop: '50px', width: '100%',
  [theme.breakpoints.down('sm')]: { marginTop: '30px' },
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    margin: '0 5px', minWidth: '40px', height: '40px', borderRadius: '40px',
    fontSize: '15px', fontWeight: 500, color: '#333', backgroundColor: '#fff',
    border: '1px solid #e0e0e0', transition: 'all 0.3s ease',
    [theme.breakpoints.down('sm')]: { minWidth: '36px', height: '36px', fontSize: '14px', margin: '0 3px' },
    '&:hover': { backgroundColor: PRIMARY_COLOR, color: '#fff', borderColor: PRIMARY_COLOR },
    '&.Mui-selected': {
      backgroundColor: PRIMARY_COLOR, color: '#fff', borderColor: PRIMARY_COLOR,
      '&:hover': { backgroundColor: PRIMARY_DARK },
    },
  },
  '& .MuiPaginationItem-previousNext': {
    fontSize: '18px',
    '& svg': { fontSize: '20px', [theme.breakpoints.down('sm')]: { fontSize: '18px' } },
  },
}));

const LoadingContainer = styled(Box)({
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  minHeight: '400px', width: '100%',
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const getGenderIcon = (gender) =>
  gender?.toLowerCase() === 'male' ? <MaleIcon /> : <FemaleIcon />;

// ── CatCard ───────────────────────────────────────────────────────────────────

const CatCard = ({ cat, onAddToCart }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(cat, 1);
    setAddedToCart(true);
    onAddToCart(cat.name);
  };

  const handleViewCart = (e) => {
    e.stopPropagation();
    navigate('/cart');
  };

  return (
    <AdoptionCard onClick={() => navigate(`/adoption/${cat.title_id}`)}>
      <ImageWrapper>
        <PetImage className="pet-image" src={cat.featuredImage} alt={cat.name} />
      </ImageWrapper>
      <CardBody>
        <PetName>Name : {cat.name}</PetName>
        <PetGender>
          Gender :
          {getGenderIcon(cat.gender)}
          {cat.gender}
        </PetGender>
        <PetPrice>Price : ৳ {cat.price}</PetPrice>
        {addedToCart ? (
          <ViewCartBtn variant="outlined" onClick={handleViewCart}>
            <ShoppingCartIcon sx={{ fontSize: '16px' }} />
            View Cart
          </ViewCartBtn>
        ) : (
          <AddToCartBtn variant="contained" onClick={handleAddToCart}>
            <ShoppingCartIcon sx={{ fontSize: '16px' }} />
            Add to Cart
          </AddToCartBtn>
        )}
      </CardBody>
    </AdoptionCard>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8;

const Cat = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = React.useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Filter state ───────────────────────────────────────────────────────────
  const [search, setSearch]         = useState('');
  const [breed, setBreed]           = useState('All');
  const [gender, setGender]         = useState('all');
  const [stock, setStock]           = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minInput, setMinInput]     = useState('');
  const [maxInput, setMaxInput]     = useState('');
  const [priceInitialized, setPriceInitialized] = useState(false);

  // ── Fetch all cats once ────────────────────────────────────────────────────
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cats-all-filter'],
    queryFn: async () => {
      const response = await axiosInstance.get(`/cats?limit=1000`);
      return response.data;
    },
  });

  const allCats = data?.data || [];

  // Get unique breeds from the data
  const breedOptions = useMemo(() => {
    if (!allCats.length) return ['All'];
    
    // Extract unique breeds, filter out empty/null values, and sort
    const uniqueBreeds = [...new Set(allCats
      .map(cat => cat.breed)
      .filter(breed => breed && breed.trim() !== '')
    )].sort();
    
    return ['All', ...uniqueBreeds];
  }, [allCats]);

  // Initialize price range from real data
  React.useEffect(() => {
    if (allCats.length > 0 && !priceInitialized) {
      const prices = allCats.map((c) => Number(c.price) || 0);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setPriceRange([min, max]);
      setMinInput(String(min));
      setMaxInput(String(max));
      setPriceInitialized(true);
    }
  }, [allCats, priceInitialized]);

  // Update price range when data refreshes
  React.useEffect(() => {
    if (allCats.length > 0 && priceInitialized) {
      const prices = allCats.map((c) => Number(c.price) || 0);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setPriceRange([min, max]);
      setMinInput(String(min));
      setMaxInput(String(max));
    }
  }, [allCats]); // Removed priceInitialized dependency to avoid infinite loop

  const priceMin = priceInitialized
    ? Math.floor(Math.min(...allCats.map((c) => Number(c.price) || 0))) : 0;
  const priceMax = priceInitialized
    ? Math.ceil(Math.max(...allCats.map((c) => Number(c.price) || 0))) : 10000;

  // ── Refresh function ───────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      
      // Reset price filter to default values based on refreshed data
      if (allCats.length > 0) {
        const prices = allCats.map((c) => Number(c.price) || 0);
        const min = Math.floor(Math.min(...prices));
        const max = Math.ceil(Math.max(...prices));
        setPriceRange([min, max]);
        setMinInput(String(min));
        setMaxInput(String(max));
      }
      
      // Reset other filters to default
      setSearch('');
      setBreed('All');
      setGender('all');
      setStock('all');
      
      setSnackbar({ 
        open: true, 
        message: 'Data refreshed and filters reset successfully!', 
        severity: 'success' 
      });
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: 'Failed to refresh data', 
        severity: 'error' 
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // ── Sync slider → inputs ───────────────────────────────────────────────────
  const handleSliderChange = (_, val) => {
    setPriceRange(val);
    setMinInput(String(val[0]));
    setMaxInput(String(val[1]));
  };

  // ── Sync min input → slider ────────────────────────────────────────────────
  const handleMinInput = (e) => {
    const raw = e.target.value;
    setMinInput(raw);
    const num = Number(raw);
    if (!isNaN(num) && num >= priceMin && num <= priceRange[1]) {
      setPriceRange([num, priceRange[1]]);
    }
  };

  // ── Sync max input → slider ────────────────────────────────────────────────
  const handleMaxInput = (e) => {
    const raw = e.target.value;
    setMaxInput(raw);
    const num = Number(raw);
    if (!isNaN(num) && num <= priceMax && num >= priceRange[0]) {
      setPriceRange([priceRange[0], num]);
    }
  };

  // ── Filter logic ───────────────────────────────────────────────────────────
  const filteredCats = useMemo(() => {
    return allCats.filter((cat) => {
      // Search: name
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!cat.name?.toLowerCase().includes(q)) return false;
      }
      // Breed
      if (breed !== 'All') {
        if (cat.breed?.toLowerCase() !== breed.toLowerCase()) return false;
      }
      // Gender
      if (gender !== 'all' && cat.gender?.toLowerCase() !== gender) return false;
      // Stock
      if (stock === 'instock' && !cat.inStock) return false;
      if (stock === 'outofstock' && cat.inStock) return false;
      // Price
      const price = Number(cat.price) || 0;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      return true;
    });
  }, [allCats, search, breed, gender, stock, priceRange]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredCats.length / ITEMS_PER_PAGE) || 1;
  const paginatedCats = filteredCats.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  React.useEffect(() => { setPage(1); }, [search, breed, gender, stock, priceRange]);

  const handlePageChange = (_, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (catName) => {
    setSnackbar({ open: true, message: `${catName} added to cart!`, severity: 'success' });
  };

  // ── Active filter chips ────────────────────────────────────────────────────
  const activeFilters = [];
  if (search.trim()) activeFilters.push({ label: `"${search}"`, key: 'search' });
  if (breed !== 'All') activeFilters.push({ label: `Breed: ${breed}`, key: 'breed' });
  if (gender !== 'all') activeFilters.push({ label: gender === 'male' ? 'Male' : 'Female', key: 'gender' });
  if (stock !== 'all') activeFilters.push({ label: stock === 'instock' ? 'In Stock' : 'Out of Stock', key: 'stock' });
  if (priceInitialized && (priceRange[0] !== priceMin || priceRange[1] !== priceMax))
    activeFilters.push({ label: `৳${priceRange[0]} – ৳${priceRange[1]}`, key: 'price' });

  const clearFilter = (key) => {
    if (key === 'search') setSearch('');
    if (key === 'breed') setBreed('All');
    if (key === 'gender') setGender('all');
    if (key === 'stock') setStock('all');
    if (key === 'price') {
      setPriceRange([priceMin, priceMax]);
      setMinInput(String(priceMin));
      setMaxInput(String(priceMax));
    }
  };

  const clearAll = () => {
    setSearch('');
    setBreed('All');
    setGender('all');
    setStock('all');
    setPriceRange([priceMin, priceMax]);
    setMinInput(String(priceMin));
    setMaxInput(String(priceMax));
  };

  const sectionTile = (
    <SectionTile
      bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg"
      subtitle="Find a new friend"
      title="Find a new friend"
      icon={true}
      iconClass="flaticon-custom-icon"
    />
  );

  if (isLoading) {
    return (
      <Box>
        {sectionTile}
        <AdoptionSection>
          <Container maxWidth="lg">
            <LoadingContainer><CircularProgress sx={{ color: PRIMARY_COLOR }} /></LoadingContainer>
          </Container>
        </AdoptionSection>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        {sectionTile}
        <AdoptionSection>
          <Container maxWidth="lg">
            <Typography align="center" color="error">
              Error loading cats: {error.message}
            </Typography>
          </Container>
        </AdoptionSection>
      </Box>
    );
  }

  return (
    <Box>
      {sectionTile}
      <AdoptionSection>
        <Container maxWidth="lg">

          {/* ── Filter Bar ── */}
          <FilterBar>

            {/* Row 1: Search + Breed */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px', width: '100%', alignItems: 'center' }}>
              <SearchInput
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: '18px', color: '#aaa' }} />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <CloseIcon
                        sx={{ fontSize: '16px', color: '#aaa', cursor: 'pointer' }}
                        onClick={() => setSearch('')}
                      />
                    </InputAdornment>
                  ) : null,
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FilterLabel>Breed</FilterLabel>
                <FormControl size="small">
                  <BreedSelect
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    displayEmpty
                  >
                    {breedOptions.map((b) => (
                      <MenuItem key={b} value={b}>{b}</MenuItem>
                    ))}
                  </BreedSelect>
                </FormControl>
              </Box>
            </Box>

            {/* Row 2: Gender + Stock + Price */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px', width: '100%', alignItems: 'center' }}>

              {/* Gender */}
              <Box sx={{ display: 'flex', paddingTop: '40px', alignItems: 'center', gap: '10px' }}>
                <FilterLabel>Gender</FilterLabel>
                <StyledToggleButtonGroup
                  value={gender}
                  exclusive
                  onChange={(_, val) => { if (val) setGender(val); }}
                  size="small"
                >
                  <ToggleButton value="all">All</ToggleButton>
                  <ToggleButton value="male">
                    <MaleIcon sx={{ fontSize: '16px', mr: '4px' }} /> Male
                  </ToggleButton>
                  <ToggleButton value="female">
                    <FemaleIcon sx={{ fontSize: '16px', mr: '4px' }} /> Female
                  </ToggleButton>
                </StyledToggleButtonGroup>
              </Box>

              {/* Stock */}
              <Box sx={{ display: 'flex', paddingTop: '40px', alignItems: 'center', gap: '10px' }}>
                <FilterLabel>Stock</FilterLabel>
                <StyledToggleButtonGroup
                  value={stock}
                  exclusive
                  onChange={(_, val) => { if (val) setStock(val); }}
                  size="small"
                >
                  <ToggleButton value="all">All</ToggleButton>
                  <ToggleButton value="instock">In Stock</ToggleButton>
                  <ToggleButton value="outofstock">Out of Stock</ToggleButton>
                </StyledToggleButtonGroup>
              </Box>

              {/* Price: slider on top, inputs below */}
              {priceInitialized && priceMin !== priceMax && (
                <PriceSliderWrapper>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FilterLabel>
                      <FilterListIcon sx={{ fontSize: '14px', mr: '4px', verticalAlign: 'middle' }} />
                      Price Range
                    </FilterLabel>
                    <Tooltip title="Refresh data & reset filters">
                      <RefreshButton 
                        onClick={handleRefresh} 
                        disabled={isRefreshing}
                        size="small"
                      >
                        <RefreshIcon 
                          sx={{ 
                            fontSize: '18px', 
                            animation: isRefreshing ? 'spin 1s linear infinite' : 'none' 
                          }} 
                        />
                      </RefreshButton>
                    </Tooltip>
                  </Box>
                  {/* inputs first, then slider */}
                  <PriceInputRow>
                    <PriceInput
                      size="small"
                      value={minInput}
                      onChange={handleMinInput}
                      inputProps={{ type: 'number', min: priceMin, max: priceRange[1] }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ fontSize: '11px', color: PRIMARY_COLOR, fontWeight: 700 }}>৳</Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Typography sx={{ fontSize: '12px', color: '#aaa' }}>–</Typography>
                    <PriceInput
                      size="small"
                      value={maxInput}
                      onChange={handleMaxInput}
                      inputProps={{ type: 'number', min: priceRange[0], max: priceMax }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ fontSize: '11px', color: PRIMARY_COLOR, fontWeight: 700 }}>৳</Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <StyledSlider
                      value={priceRange}
                      onChange={handleSliderChange}
                      min={priceMin}
                      max={priceMax}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(v) => `৳${v}`}
                      sx={{ flex: 1 }}
                    />
                  </PriceInputRow>
                </PriceSliderWrapper>
              )}
            </Box>

          </FilterBar>

          {/* ── Active filter chips ── */}
          {activeFilters.length > 0 && (
            <ActiveFiltersRow>
              <Typography sx={{ fontSize: '13px', color: '#888', mr: '4px' }}>Active:</Typography>
              {activeFilters.map((f) => (
                <Chip
                  key={f.key}
                  label={f.label}
                  size="small"
                  onDelete={() => clearFilter(f.key)}
                  sx={{
                    backgroundColor: '#f0ecfb',
                    color: PRIMARY_COLOR,
                    fontWeight: 600,
                    fontSize: '12px',
                    '& .MuiChip-deleteIcon': { color: PRIMARY_COLOR },
                  }}
                />
              ))}
              <Button
                size="small"
                onClick={clearAll}
                sx={{ fontSize: '12px', color: '#aaa', textTransform: 'none', ml: '4px' }}
              >
                Clear all
              </Button>
            </ActiveFiltersRow>
          )}

          {/* ── Result count ── */}
          <ResultCount>
            Showing {paginatedCats.length} of {filteredCats.length} cats
          </ResultCount>

          {/* ── Grid ── */}
          {paginatedCats.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: '60px' }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No cats match your filters
              </Typography>
              <Button
                onClick={clearAll}
                sx={{ color: PRIMARY_COLOR, textTransform: 'none', fontWeight: 600 }}
              >
                Clear filters
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
                {paginatedCats.map((cat) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={cat._id}>
                    <CatCard cat={cat} onAddToCart={handleAddToCart} />
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <PaginationWrapper>
                  <StyledPagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                    size={isMobile ? 'small' : 'medium'}
                    renderItem={(item) => (
                      <PaginationItem
                        {...item}
                        components={{ next: ChevronRightIcon, previous: ChevronLeftIcon }}
                      />
                    )}
                  />
                </PaginationWrapper>
              )}
            </>
          )}

          <BottomInfoWrapper>
            <AdoptButton variant="contained">Adopt a pet</AdoptButton>
            <InfoText>
              <span>Call us</span>
              <span className="phone-number">+123 456 7890</span>
              <span>for detailed information!</span>
            </InfoText>
          </BottomInfoWrapper>
        </Container>
      </AdoptionSection>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Add keyframe animation for spinning refresh icon */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default Cat;