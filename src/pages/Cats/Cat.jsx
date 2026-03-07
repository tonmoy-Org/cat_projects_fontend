import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  Button,
  Pagination,
  PaginationItem,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import CakeIcon from '@mui/icons-material/Cake';
import HotelIcon from '@mui/icons-material/Hotel';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SectionTile from '../../components/SectionTile';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

const PRIMARY_COLOR = '#5C4D91';
const PRIMARY_DARK = '#4A3D75';
const iconColor = '#db89ca';

const AdoptionSection = styled(Box)({
  backgroundColor: '#ffffff',
  padding: '80px 0',
  width: '100%',
  '@media (max-width: 900px)': { padding: '60px 0' },
  '@media (max-width: 600px)': { padding: '40px 0' },
});

const AdoptionCard = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '300px',
  borderRadius: '10px',
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.15)' },
  '&:hover .back-wrap': { bottom: 0 },
  '@media (max-width: 1200px)': { height: '280px' },
  '@media (max-width: 900px)': { height: '260px' },
  '@media (max-width: 600px)': { height: '280px' },
});

const PetImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  transition: 'transform 0.5s ease',
  '&:hover': { transform: 'scale(1.05)' },
});

const FrontHeader = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
  padding: '20px',
  textAlign: 'center',
  zIndex: 2,
});

const FrontTitle = styled(Typography)({
  fontSize: '22px',
  fontWeight: 600,
  color: '#fff',
  margin: 0,
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  '@media (max-width: 900px)': { fontSize: '20px' },
  '@media (max-width: 600px)': { fontSize: '18px' },
});

const BackWrap = styled(Box)({
  position: 'absolute',
  bottom: '-100%',
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  padding: '25px 20px',
  transition: 'bottom 0.3s ease',
  zIndex: 3,
  textAlign: 'center',
  borderTop: `3px solid ${iconColor}`,
  '& a': { textDecoration: 'none', color: 'inherit', display: 'block' },
});

const BackTitle = styled(Typography)({
  fontSize: '20px',
  fontWeight: 600,
  color: '#1a1a1a',
  marginBottom: '15px',
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-5px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40px',
    height: '2px',
    backgroundColor: iconColor,
  },
});

const InfoList = styled(Box)({ '& ul': { listStyle: 'none', padding: 0, margin: 0 } });

const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontSize: '14px',
  color: '#666',
  padding: '6px 0',
  '& svg': { fontSize: '18px', color: iconColor },
});

const BottomInfoWrapper = styled(Box)({
  display: 'flex',
  gap: '30px',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '50px',
  textAlign: 'center',
  '@media (max-width: 900px)': { gap: '25px', marginTop: '45px', flexDirection: 'column' },
  '@media (max-width: 600px)': { gap: '20px', marginTop: '40px', padding: '0 20px' },
});

const InfoText = styled(Typography)({
  fontSize: '18px',
  color: '#333',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  flexWrap: 'wrap',
  '& .phone-number': { color: iconColor, fontWeight: 700, fontSize: '20px' },
});

const AdoptButton = styled(Button)({
  backgroundColor: PRIMARY_COLOR,
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '30px',
  boxShadow: '0 5px 15px rgba(92, 77, 145, 0.3)',
  minWidth: '120px',
  padding: '10px 25px',
  '&:hover': {
    backgroundColor: '#4A3D75',
    boxShadow: '0 8px 20px rgba(92, 77, 145, 0.4)',
  },
});

// ── Pagination matching Blog page exactly ──
const PaginationWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '50px',
  width: '100%',
  [theme.breakpoints.down('sm')]: { marginTop: '30px' },
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    margin: '0 5px',
    minWidth: '40px',
    height: '40px',
    borderRadius: '40px',
    fontSize: '15px',
    fontWeight: 500,
    color: '#333',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    transition: 'all 0.3s ease',
    [theme.breakpoints.down('sm')]: {
      minWidth: '36px',
      height: '36px',
      fontSize: '14px',
      margin: '0 3px',
    },
    '&:hover': {
      backgroundColor: PRIMARY_COLOR,
      color: '#fff',
      borderColor: PRIMARY_COLOR,
    },
    '&.Mui-selected': {
      backgroundColor: PRIMARY_COLOR,
      color: '#fff',
      borderColor: PRIMARY_COLOR,
      '&:hover': { backgroundColor: PRIMARY_DARK },
    },
  },
  '& .MuiPaginationItem-previousNext': {
    fontSize: '18px',
    '& svg': {
      fontSize: '20px',
      [theme.breakpoints.down('sm')]: { fontSize: '18px' },
    },
  },
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
  width: '100%',
});

const getAgeLabel = (formattedAge) => {
  const ageNum = parseInt(formattedAge, 10);
  return `${formattedAge} ${ageNum === 1 ? 'year' : 'years'}`;
};

const getGenderIcon = (gender) =>
  gender?.toLowerCase() === 'male' ? <MaleIcon /> : <FemaleIcon />;

const formatNeutered = (neutered) => (neutered ? 'Yes' : 'No');

const CatCard = ({ cat }) => (
  <AdoptionCard>
    <PetImage src={cat.featuredImage} alt={cat.name} />
    <FrontHeader>
      <FrontTitle>{cat.name}</FrontTitle>
    </FrontHeader>
    <BackWrap className="back-wrap">
      <a href={`/adoption/${cat.title_id}`}>
        <BackTitle>{cat.name}</BackTitle>
        <InfoList>
          <ul>
            <li>
              <InfoItem>
                {getGenderIcon(cat.gender)}
                <span>Gender: {cat.gender}</span>
              </InfoItem>
            </li>
            <li>
              <InfoItem>
                <HotelIcon />
                <span>Neutered: {formatNeutered(cat.neutered)}</span>
              </InfoItem>
            </li>
            <li>
              <InfoItem>
                <CakeIcon />
                <span>Age: {getAgeLabel(cat.formattedAge)}</span>
              </InfoItem>
            </li>
          </ul>
        </InfoList>
      </a>
    </BackWrap>
  </AdoptionCard>
);

const ITEMS_PER_PAGE = 8;

const Cat = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = React.useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['cats', page],
    queryFn: async () => {
      const response = await axiosInstance.get(`/cats?page=${page}&limit=${ITEMS_PER_PAGE}`);
      return response.data;
    },
  });

  const cats = data?.data || [];
  const totalPages = data?.pagination?.totalPages || Math.ceil((data?.total || cats.length) / ITEMS_PER_PAGE) || 1;

  const handlePageChange = (_, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <Typography align="center" color="error">Error loading cats: {error.message}</Typography>
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
          {cats.length === 0 ? (
            <Typography align="center" variant="h6" color="text.secondary">No cats found</Typography>
          ) : (
            <>
              <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
                {cats.map((cat) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={cat._id}>
                    <CatCard cat={cat} />
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
    </Box>
  );
};

export default Cat;