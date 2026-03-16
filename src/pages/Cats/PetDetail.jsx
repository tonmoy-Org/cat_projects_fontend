import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  Button,
  TextField,
  Rating,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  Pets as PetsIcon,
  Recycling as RecyclingIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';
import SectionTile from '../../components/SectionTile';
import { useCart } from '../../context/CartContext';

// ─── THEME COLORS (SAME AS PRODUCTDETAIL) ────────────────────────────────────
const primaryColor = '#db89ca';
const iconColor = '#db89ca';
const textColor = '#1a1a1a';
const lightGray = '#f5f5f5';
const mediumGray = '#e0e0e0';
const darkGray = '#666666';

// ─── STYLED COMPONENTS (IDENTICAL TO PRODUCTDETAIL) ──────────────────────────

const PetDetailSection = styled(Box)({
  backgroundColor: '#ffffff',
  padding: '80px 0',
  width: '100%',
  '@media (max-width: 900px)': { padding: '60px 0' },
  '@media (max-width: 600px)': { padding: '40px 0' },
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '500px',
  width: '100%',
});

const ImageGalleryWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  maxWidth: '450px',
  margin: '0 auto',
  '@media (max-width: 900px)': { maxWidth: '400px' },
  '@media (max-width: 600px)': { maxWidth: '100%' },
});

const MainImageWrapper = styled(Box)({
  width: '100%',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  backgroundColor: '#fff',
});

const MainImage = styled('img')({ width: '100%', height: 'auto', display: 'block' });

const ThumbnailWrapper = styled(Box)({
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  '@media (max-width: 600px)': { justifyContent: 'center' },
});

const Thumbnail = styled('img')(({ active }) => ({
  width: '70px',
  height: '70px',
  objectFit: 'cover',
  borderRadius: '8px',
  cursor: 'pointer',
  border: active ? `3px solid ${primaryColor}` : '3px solid transparent',
  opacity: active ? 1 : 0.7,
  transition: 'all 0.2s ease',
  '&:hover': { opacity: 1, borderColor: primaryColor },
  '@media (max-width: 600px)': { width: '60px', height: '60px' },
}));

const PetInfoWrapper = styled(Box)({
  padding: '20px',
  '@media (max-width: 900px)': { padding: '20px 0' },
});

const PetTitle = styled(Typography)({
  fontSize: '32px',
  fontWeight: 700,
  color: textColor,
  marginBottom: '20px',
  '@media (max-width: 600px)': { fontSize: '28px' },
});

const PetDescription = styled(Typography)({
  fontSize: '16px',
  color: darkGray,
  lineHeight: 1.6,
  marginBottom: '30px',
});

const PetPrice = styled(Typography)({
  fontSize: '30px',
  fontWeight: 700,
  color: '#ff6b6b',
  marginBottom: '15px',
  '@media (max-width: 600px)': { fontSize: '32px' },
});

const RatingWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  marginBottom: '30px',
});

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': { color: '#ffb400' },
  '& .MuiRating-iconHover': { color: '#ffb400' },
});

const AddToCartWrapper = styled(Box)({
  display: 'flex',
  gap: '15px',
  marginBottom: '30px',
  flexWrap: 'wrap',
  '@media (max-width: 600px)': { flexDirection: 'column' },
});

const QuantityInput = styled(TextField)({
  width: '80px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': { borderColor: mediumGray },
    '&:hover fieldset': { borderColor: primaryColor },
  },
  '& input': { textAlign: 'center', padding: '8px 0', fontSize: '14px' },
  '@media (max-width: 600px)': { width: '100%' },
});

const AddToCartButton = styled(Button)({
  backgroundColor: primaryColor,
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  padding: '6px 16px',
  minWidth: '120px',
  '&:hover': { backgroundColor: '#c06bb0' },
  '@media (max-width: 600px)': { width: '100%', padding: '8px 16px' },
});

const ViewCartButton = styled(Button)({
  backgroundColor: 'transparent',
  color: primaryColor,
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  padding: '6px 16px',
  minWidth: '120px',
  border: `2px solid ${primaryColor}`,
  '&:hover': { backgroundColor: primaryColor, color: '#fff' },
  '@media (max-width: 600px)': { width: '100%', padding: '8px 16px' },
});

const FeatureItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  marginBottom: '15px',
  '& svg': { fontSize: '24px', color: iconColor },
  '& p': { fontSize: '16px', color: textColor, margin: 0, fontWeight: 500 },
});

const BadgeRow = styled(Box)({ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' });

const Badge = styled(Box)(({ variant }) => ({
  padding: '4px 14px',
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: 600,
  backgroundColor:
    variant === 'stock' ? '#e8f5e9' :
      variant === 'category' ? '#f3e5f5' : '#e3f2fd',
  color:
    variant === 'stock' ? '#388e3c' :
      variant === 'category' ? '#7b1fa2' : '#1565c0',
}));

const TabsWrapper = styled(Box)({ marginTop: '50px' });

const TabHeaders = styled(Box)({
  display: 'flex',
  gap: '30px',
  borderBottom: `2px solid ${mediumGray}`,
  marginBottom: '30px',
});

const TabHeader = styled(Typography)(({ active }) => ({
  fontSize: '18px',
  fontWeight: 600,
  color: active ? primaryColor : darkGray,
  cursor: 'pointer',
  paddingBottom: '10px',
  borderBottom: active ? `3px solid ${primaryColor}` : '3px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': { color: primaryColor },
}));

const TabContent = styled(Box)({ padding: '20px 0' });

const FeaturesList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  '& li': {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px',
    fontSize: '16px',
    color: darkGray,
    '& svg': { color: iconColor, fontSize: '20px' },
  },
});

const ReviewsWrapper = styled(Box)({ marginTop: '30px' });

const ReviewItem = styled(Box)({
  display: 'flex',
  gap: '20px',
  padding: '20px 0',
  borderBottom: `1px solid ${mediumGray}`,
  '@media (max-width: 600px)': { flexDirection: 'column', gap: '10px' },
});

const ReviewAvatar = styled(Avatar)({ width: '60px', height: '60px', backgroundColor: iconColor });
const ReviewContent = styled(Box)({ flex: 1 });
const ReviewHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
  flexWrap: 'wrap',
  gap: '10px',
});
const ReviewAuthor = styled(Typography)({ fontSize: '16px', fontWeight: 600, color: textColor });
const ReviewDate = styled(Typography)({ fontSize: '14px', color: darkGray });
const ReviewText = styled(Typography)({ fontSize: '15px', color: darkGray, lineHeight: 1.6, marginTop: '10px' });

const ReviewFormWrapper = styled(Box)({
  marginTop: '30px',
  padding: '30px',
  backgroundColor: lightGray,
  borderRadius: '10px',
});

const FormTitle = styled(Typography)({ fontSize: '20px', fontWeight: 600, color: textColor, marginBottom: '20px' });

const StyledTextField = styled(TextField)({
  marginBottom: '20px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#fff',
    '& fieldset': { borderColor: mediumGray },
    '&:hover fieldset': { borderColor: primaryColor },
    '&.Mui-focused fieldset': { borderColor: primaryColor },
  },
});

const SubmitButton = styled(Button)({
  backgroundColor: primaryColor,
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  padding: '12px 30px',
  '&:hover': { backgroundColor: '#c06bb0' },
});

const PetInfoList = styled(Box)({
  marginBottom: '30px',
  '& ul': { listStyle: 'none', padding: 0, margin: 0 },
  '& li': {
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${mediumGray}`,
    padding: '12px 0',
    '@media (max-width: 600px)': { padding: '10px 0' },
    '&:last-child': { borderBottom: 'none' },
  },
});

const InfoLabel = styled(Box)({
  minWidth: '120px',
  fontSize: '16px',
  fontWeight: 500,
  color: '#333',
  '@media (max-width: 600px)': { minWidth: '100px', fontSize: '15px' },
});

const InfoValue = styled(Box)({
  fontSize: '16px',
  color: darkGray,
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '@media (max-width: 600px)': { fontSize: '15px' },
  '& p': { margin: 0 },
  '& svg': { fontSize: '18px', color: iconColor },
});

// 🔥 NEW: Related Cats Section Styles
const RelatedCatsWrapper = styled(Box)({ marginTop: '60px' });
const RelatedTitle = styled(Typography)({ fontSize: '24px', fontWeight: 700, color: textColor, marginBottom: '30px', textAlign: 'center' });

const RelatedCatCard = styled(Box)({
  cursor: 'pointer', borderRadius: '10px', overflow: 'hidden', transition: 'all 0.3s ease',
  '&:hover': { transform: 'translateY(-5px)' },
});

const RelatedImageWrapper = styled(Box)({
  position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: '10px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)', transition: 'all 0.3s ease',
  '& img': { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },
  '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.15)' },
  '&:hover img': { transform: 'scale(1.05)' },
});

const RelatedPriceOverlay = styled(Box)({
  position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
  backgroundColor: 'rgba(255,255,255,0.95)', padding: '6px 16px', borderRadius: '25px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)', zIndex: 2, whiteSpace: 'nowrap',
  '& h4': { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: textColor, margin: 0 },
  '& .hot': { color: primaryColor, fontWeight: 600, fontSize: '13px' },
  '& .price': { color: '#555', fontWeight: 600, fontSize: '14px' },
});

const QuickActionsOverlay = styled(Box)({
  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: 1, opacity: 0, transition: 'opacity 0.3s ease', zIndex: 10,
  '@media (max-width: 600px)': { opacity: 1, background: 'rgba(0,0,0,0.2)' },
});

const RelatedCatInfo = styled(Box)({
  padding: '15px 0', display: 'flex', flexDirection: 'column', gap: '8px',
});

const RelatedCatTitle = styled(Typography)({
  fontSize: '14px', fontWeight: 600, color: textColor, lineHeight: 1.4,
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  '&:hover': { color: primaryColor },
});

const QuickAddButton = styled(Button)({
  backgroundColor: primaryColor, color: '#fff', fontSize: '12px', fontWeight: 600,
  textTransform: 'none', borderRadius: '6px', padding: '6px 12px', minWidth: '80px',
  '&:hover': { backgroundColor: '#c06bb0' },
});

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const getGenderIcon = (gender) =>
  gender?.toLowerCase() === 'male' ? <MaleIcon /> : <FemaleIcon />;

const formatBool = (val) => (val ? 'Yes' : 'No');

const getAgeLabel = (age) => {
  const n = parseInt(age, 10);
  return `${age} ${n === 1 ? 'year' : 'years'}`;
};

// 🔥 NEW: Smart related cats selection
const getSmartRelatedCats = (currentCat, allCats, limit = 4) => {
  if (!currentCat || !allCats || allCats.length === 0) return [];

  // Priority 1: Same breed, in stock, with good rating
  const sameBreed = allCats
    .filter((cat) =>
      cat._id !== currentCat._id &&
      cat.inStock &&
      cat.breed === currentCat.breed &&
      (cat.averageRating || 0) >= 3
    )
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, limit);

  if (sameBreed.length >= limit) return sameBreed;

  // Priority 2: Any breed, in stock, with rating
  const fallback = allCats
    .filter((cat) =>
      !sameBreed.find((sb) => sb._id === cat._id) &&
      cat._id !== currentCat._id &&
      cat.inStock
    )
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, limit - sameBreed.length);

  return [...sameBreed, ...fallback];
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

const PetDetail = () => {
  const { title_id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToCart } = useCart();

  const [activeImage, setActiveImage] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [hoveredCatId, setHoveredCatId] = useState(null); // 🔥 NEW: Track hovered cat

  const [reviewForm, setReviewForm] = useState({ name: '', email: '', comment: '', rating: 0 });
  const [formError, setFormError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ── QUERIES ────────────────────────────────────────────────────────────────
  const { data: petRes, isLoading, error } = useQuery({
    queryKey: ['pet', title_id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/cats/${title_id}`);
      return res.data;
    },
    enabled: !!title_id,
  });

  // 🔥 NEW: Load all cats for smart selection
  const { data: allCatsRes } = useQuery({
    queryKey: ['cats-all'],
    queryFn: async () => {
      const res = await axiosInstance.get('/cats');
      return res.data;
    },
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', title_id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/cats/${title_id}/reviews`);
      return res.data;
    },
    enabled: !!title_id && activeTab === 'reviews',
  });

  // ── MUTATIONS ──────────────────────────────────────────────────────────────
  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const res = await axiosInstance.post(`/cats/${title_id}/reviews`, reviewData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', title_id] });
      queryClient.invalidateQueries({ queryKey: ['pet', title_id] });
      setReviewForm({ name: '', email: '', comment: '', rating: 0 });
      setFormError('');
      setSnackbar({ open: true, message: 'Review submitted successfully!', severity: 'success' });
    },
    onError: (err) => {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to submit review.', severity: 'error' });
    },
  });

  const pet = petRes?.data || petRes;
  const allCats = allCatsRes?.data || []; // 🔥 NEW
  const relatedCats = pet ? getSmartRelatedCats(pet, allCats, 4) : []; // 🔥 NEW
  const mainImage = activeImage || pet?.featuredImage;
  const allImages = pet ? [pet.featuredImage, ...(pet.gallery || [])].filter(Boolean) : [];

  // ── EVENT HANDLERS ─────────────────────────────────────────────────────────

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (val > 0) setQuantity(val);
  };

  const handleAddToCart = () => {
    addToCart(pet, quantity);
    setAddedToCart(true);
    setSnackbar({ open: true, message: `${pet.name} added to cart!`, severity: 'success' });
  };

  // 🔥 NEW: Quick add for related cats
  const handleQuickAddToCart = (relatedCat) => {
    addToCart(relatedCat, 1);
    setSnackbar({ open: true, message: `${relatedCat.name} added to cart!`, severity: 'success' });
  };

  const handleReviewSubmit = () => {
    if (!reviewForm.name.trim()) { setFormError('Name is required.'); return; }
    if (!reviewForm.email.trim()) { setFormError('Email is required.'); return; }
    if (!reviewForm.rating) { setFormError('Please select a rating.'); return; }
    if (!reviewForm.comment.trim()) { setFormError('Review comment is required.'); return; }
    setFormError('');
    submitReviewMutation.mutate({
      name: reviewForm.name,
      email: reviewForm.email,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'reviews') {
      queryClient.invalidateQueries({ queryKey: ['reviews', title_id] });
    }
  };

  // ── LOADING / ERROR ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <PetDetailSection>
        <Container maxWidth="lg">
          <LoadingContainer><CircularProgress sx={{ color: primaryColor }} /></LoadingContainer>
        </Container>
      </PetDetailSection>
    );
  }

  if (error || !pet) {
    return (
      <PetDetailSection>
        <Container maxWidth="lg">
          <Typography textAlign="center" color="error">
            {error ? `Error: ${error.message}` : 'Pet not found'}
          </Typography>
        </Container>
      </PetDetailSection>
    );
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <Box>
      <SectionTile
        bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg"
        subtitle="Find a new friend"
        title="Pet Details"
        icon={true}
        iconClass="flaticon-custom-icon"
      />

      <PetDetailSection>
        <Container maxWidth="lg">

          <Grid container spacing={4} justifyContent="center" alignItems="flex-start">

            {/* IMAGE GALLERY */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ImageGalleryWrapper>
                <MainImageWrapper>
                  <MainImage
                    src={mainImage}
                    alt={pet.name}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/450x450?text=No+Image'; }}
                  />
                </MainImageWrapper>
                {allImages.length > 1 && (
                  <ThumbnailWrapper>
                    {allImages.map((img, i) => (
                      <Thumbnail
                        key={i}
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        active={mainImage === img ? 1 : 0}
                        onClick={() => setActiveImage(img)}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/70x70?text=No+Image'; }}
                      />
                    ))}
                  </ThumbnailWrapper>
                )}
              </ImageGalleryWrapper>
            </Grid>

            {/* PET INFO */}
            <Grid size={{ xs: 12, md: 6 }}>
              <PetInfoWrapper>
                <PetTitle variant="h3">{pet.name}</PetTitle>

                <BadgeRow>
                  {pet.breed && <Badge variant="category">{pet.breed}</Badge>}
                  {pet.size && <Badge variant="category">{pet.size}</Badge>}
                  <Badge variant="stock">✓ Available for Sale</Badge>
                </BadgeRow>

                <PetDescription>{stripHtml(pet.about)}</PetDescription>

                <PetPrice>৳ {pet.price}</PetPrice>

                <RatingWrapper>
                  <StyledRating
                    value={pet.averageRating || 0}
                    readOnly
                    precision={0.5}
                    icon={<StarIcon fontSize="inherit" />}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                  />
                  <Typography sx={{ fontSize: '14px', color: darkGray }}>
                    {pet.reviewCount > 0
                      ? `${pet.reviewCount} review${pet.reviewCount !== 1 ? 's' : ''} · ${pet.averageRating} / 5`
                      : 'Be the first to review'}
                  </Typography>
                </RatingWrapper>

                {/* ADD TO CART */}
                <AddToCartWrapper>
                  <QuantityInput
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    inputProps={{ min: 1 }}
                    size="small"
                  />
                  {addedToCart ? (
                    <ViewCartButton variant="outlined" onClick={() => navigate('/cart')}>
                      View Cart
                    </ViewCartButton>
                  ) : (
                    <AddToCartButton
                      variant="contained"
                      disabled={!pet.price}
                      onClick={handleAddToCart}
                    >
                      Add to cart
                    </AddToCartButton>
                  )}
                </AddToCartWrapper>

                <Box sx={{ mb: '30px' }}>
                  <FeatureItem>
                    <PetsIcon />
                    <p>High quality pet for sale!</p>
                  </FeatureItem>
                  <FeatureItem>
                    <RecyclingIcon />
                    <p>100% quality guaranteed</p>
                  </FeatureItem>
                </Box>

                {/* PET INFO LIST */}
                <PetInfoList>
                  <ul>
                    <li>
                      <InfoLabel>Gender:</InfoLabel>
                      <InfoValue>
                        {getGenderIcon(pet.gender)}
                        <p style={{ textTransform: 'capitalize' }}>{pet.gender || 'N/A'}</p>
                      </InfoValue>
                    </li>
                    <li>
                      <InfoLabel>Age:</InfoLabel>
                      <InfoValue><p>{getAgeLabel(pet.age ?? '0')}</p></InfoValue>
                    </li>
                    <li>
                      <InfoLabel>Breed:</InfoLabel>
                      <InfoValue><p>{pet.breed || 'N/A'}</p></InfoValue>
                    </li>
                    <li>
                      <InfoLabel>Size:</InfoLabel>
                      <InfoValue>
                        <p style={{ textTransform: 'capitalize' }}>{pet.size || 'N/A'}</p>
                      </InfoValue>
                    </li>
                    <li>
                      <InfoLabel>Neutered:</InfoLabel>
                      <InfoValue><p>{formatBool(pet.neutered)}</p></InfoValue>
                    </li>
                    <li>
                      <InfoLabel>Vaccinated:</InfoLabel>
                      <InfoValue><p>{formatBool(pet.vaccinated)}</p></InfoValue>
                    </li>
                  </ul>
                </PetInfoList>
              </PetInfoWrapper>
            </Grid>
          </Grid>

          {/* TABS */}
          <TabsWrapper>
            <TabHeaders>
              <TabHeader active={activeTab === 'details' ? 1 : 0} onClick={() => handleTabChange('details')}>
                Details
              </TabHeader>
              <TabHeader active={activeTab === 'reviews' ? 1 : 0} onClick={() => handleTabChange('reviews')}>
                Reviews {pet.reviewCount > 0 ? `(${pet.reviewCount})` : ''}
              </TabHeader>
            </TabHeaders>

            <TabContent>
              {activeTab === 'details' && (
                <Box>
                  {pet.features && pet.features !== '<p><br></p>' ? (
                    <Box
                      sx={{
                        fontSize: '16px',
                        color: darkGray,
                        lineHeight: 1.8,
                        '& ul, & ol': { paddingLeft: '1.5rem' },
                        '& li': { marginBottom: '8px' },
                        '& h1,& h2,& h3': { color: textColor, fontWeight: 600, marginBottom: '12px' },
                      }}
                      dangerouslySetInnerHTML={{ __html: pet.features }}
                    />
                  ) : (
                    <Box>
                      <Typography sx={{ mb: 3, color: darkGray, lineHeight: 1.8 }}>
                        {stripHtml(pet.about)}
                      </Typography>
                      <FeaturesList>
                        {pet.breed && <li><FavoriteIcon />Breed: {pet.breed}</li>}
                        {pet.size && <li><FavoriteIcon />Size: {pet.size}</li>}
                        <li><FavoriteIcon />High quality pet</li>
                        <li><FavoriteIcon />Safe and healthy</li>
                      </FeaturesList>
                    </Box>
                  )}
                </Box>
              )}

              {activeTab === 'reviews' && (
                <ReviewsWrapper>
                  {reviewsLoading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress sx={{ color: primaryColor }} /></Box>
                  ) : !reviewsData || reviewsData.data.length === 0 ? (
                    <Typography sx={{ color: darkGray, mb: 3 }}>No reviews yet. Be the first to leave a review!</Typography>
                  ) : (
                    <Box sx={{ mb: 3 }}>
                      {reviewsData.data.map((review) => (
                        <ReviewItem key={review._id}>
                          <ReviewAvatar>{getInitials(review.name)}</ReviewAvatar>
                          <ReviewContent>
                            <ReviewHeader>
                              <ReviewAuthor>{review.name}</ReviewAuthor>
                              <ReviewDate>{new Date(review.createdAt).toLocaleDateString()}</ReviewDate>
                            </ReviewHeader>
                            <StyledRating
                              value={review.rating}
                              readOnly
                              size="small"
                              icon={<StarIcon fontSize="inherit" />}
                              emptyIcon={<StarBorderIcon fontSize="inherit" />}
                            />
                            <ReviewText>{review.comment}</ReviewText>
                          </ReviewContent>
                        </ReviewItem>
                      ))}
                    </Box>
                  )}

                  <ReviewFormWrapper>
                    <FormTitle>Add a review</FormTitle>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontSize: '14px', color: darkGray, mb: 0.5 }}>Your Rating *</Typography>
                      <StyledRating
                        value={reviewForm.rating}
                        onChange={(_, val) => setReviewForm((prev) => ({ ...prev, rating: val }))}
                        name="rating"
                        size="large"
                        icon={<StarIcon fontSize="inherit" />}
                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                      />
                    </Box>
                    <StyledTextField
                      fullWidth
                      placeholder="Name *"
                      required
                      size="small"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <StyledTextField
                      fullWidth
                      placeholder="Email *"
                      type="email"
                      required
                      size="small"
                      value={reviewForm.email}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, email: e.target.value }))}
                    />
                    <StyledTextField
                      fullWidth
                      placeholder="Your Review *"
                      multiline
                      rows={4}
                      required
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                    />
                    {formError && (
                      <Typography sx={{ color: 'error.main', fontSize: '13px', mb: 1 }}>{formError}</Typography>
                    )}
                    <SubmitButton
                      variant="contained"
                      onClick={handleReviewSubmit}
                      disabled={submitReviewMutation.isPending}
                    >
                      {submitReviewMutation.isPending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Submit Review'}
                    </SubmitButton>
                  </ReviewFormWrapper>
                </ReviewsWrapper>
              )}
            </TabContent>
          </TabsWrapper>

          {/* 🔥 NEW: RELATED CATS SECTION */}
          {relatedCats.length > 0 && (
            <RelatedCatsWrapper>
              <RelatedTitle variant="h4">Other cats you might like</RelatedTitle>
              <Grid container spacing={3}>
                {relatedCats.map((rc) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} key={rc._id}>
                    <RelatedCatCard
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/cats/${rc.title_id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          navigate(`/cats/${rc.title_id}`);
                        }
                      }}
                      onMouseEnter={() => setHoveredCatId(rc._id)}
                      onMouseLeave={() => setHoveredCatId(null)}
                    >
                      <RelatedImageWrapper>
                        <img
                          src={rc.featuredImage}
                          alt={rc.name}
                          loading="lazy"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                        />

                        {/* Price Overlay */}
                        <RelatedPriceOverlay>
                          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '15px', color: '#ff6b6b' }}>
                            ৳{rc.price}
                          </Typography>
                        </RelatedPriceOverlay>

                        {/* Quick Actions */}
                        <QuickActionsOverlay
                          sx={{
                            opacity: hoveredCatId === rc._id ? 1 : 0,
                            '@media (max-width: 600px)': { opacity: 1 },
                          }}
                        >
                          <QuickAddButton
                            variant="contained"
                            startIcon={<ShoppingCartIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAddToCart(rc);
                            }}
                          >
                            Add
                          </QuickAddButton>
                        </QuickActionsOverlay>
                      </RelatedImageWrapper>

                      {/* Cat Info */}
                      <RelatedCatInfo>
                        <RelatedCatTitle title={rc.name}>
                          {rc.name}
                        </RelatedCatTitle>

                        {/* Breed & Gender */}
                        <Typography sx={{ fontSize: '12px', color: darkGray }}>
                          {rc.breed && `${rc.breed}`}
                          {rc.breed && rc.gender && ' • '}
                          {rc.gender && <span style={{ textTransform: 'capitalize' }}>{rc.gender}</span>}
                        </Typography>

                        {/* Rating */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <StyledRating
                            value={rc.averageRating || 0}
                            readOnly
                            size="small"
                            icon={<StarIcon fontSize="inherit" sx={{ fontSize: '14px' }} />}
                            emptyIcon={<StarBorderIcon fontSize="inherit" sx={{ fontSize: '14px' }} />}
                          />
                          <Typography sx={{ fontSize: '12px', color: darkGray }}>
                            ({rc.reviewCount || 0})
                          </Typography>
                        </Box>

                        {/* Stock Status */}
                        <Typography sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: rc.inStock ? '#388e3c' : '#d32f2f',
                        }}>
                          {rc.inStock ? '✓ Available' : '✗ Not Available'}
                        </Typography>
                      </RelatedCatInfo>
                    </RelatedCatCard>
                  </Grid>
                ))}
              </Grid>
            </RelatedCatsWrapper>
          )}

        </Container>
      </PetDetailSection>

      {/* TOAST */}
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
    </Box>
  );
};

export default PetDetail;