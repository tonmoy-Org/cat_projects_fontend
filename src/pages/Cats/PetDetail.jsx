import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import PetsIcon from '@mui/icons-material/Pets';
import SectionTile from '../../components/SectionTile';

// Theme colors
const primaryColor = '#5C4D91';
const iconColor = '#db89ca';
const textColor = '#666';
const borderColor = '#eaeaea';

// ─── Styled Components ───────────────────────────────────────────────────────

const DetailSection = styled(Box)({
  backgroundColor: '#ffffff',
  padding: '80px 0',
  width: '100%',
  '@media (max-width: 900px)': { padding: '60px 0' },
  '@media (max-width: 600px)': { padding: '40px 0' },
});

const MainImage = styled(Box)({
  width: '100%',
  marginBottom: '30px',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  '& img': {
    width: '100%',
    height: 'auto',
    display: 'block',
    transition: 'transform 0.3s ease',
    '&:hover': { transform: 'scale(1.02)' },
  },
});

const SideImage = styled(Box)({
  width: '100%',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  '& img': {
    width: '100%',
    height: 'auto',
    display: 'block',
    transition: 'transform 0.3s ease',
    '&:hover': { transform: 'scale(1.02)' },
  },
});

const ContentWrapper = styled(Box)({
  paddingLeft: '30px',
  '@media (max-width: 1200px)': { paddingLeft: '0', marginTop: '40px' },
  '@media (max-width: 600px)': { marginTop: '30px' },
});

const PetName = styled(Typography)({
  fontSize: '24px',
  fontWeight: 600,
  color: '#1a1a1a',
  marginBottom: '25px',
  '@media (max-width: 600px)': { fontSize: '22px', marginBottom: '20px' },
});

const InfoList = styled(Box)({
  marginBottom: '45px',
  '@media (max-width: 600px)': { marginBottom: '35px' },
  '& ul': { listStyle: 'none', padding: 0, margin: 0 },
  '& li': {
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${borderColor}`,
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
  color: textColor,
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '@media (max-width: 600px)': { fontSize: '15px' },
  '& p': { margin: 0 },
  '& svg': { fontSize: '18px', color: iconColor },
});

const SectionTitle = styled(Typography)({
  fontSize: '20px',
  fontWeight: 600,
  color: '#1a1a1a',
  marginBottom: '20px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '0',
    width: '50px',
    height: '2px',
    backgroundColor: iconColor,
  },
  '@media (max-width: 600px)': {
    fontSize: '18px',
    marginBottom: '15px',
    '&::after': { width: '40px', bottom: '-6px' },
  },
});

const Description = styled(Typography)({
  fontSize: '16px',
  color: textColor,
  lineHeight: 1.7,
  marginBottom: '30px',
  '@media (max-width: 600px)': { fontSize: '15px', lineHeight: 1.6, marginBottom: '25px' },
});

const TraitsList = styled(Box)({
  marginBottom: '45px',
  '@media (max-width: 600px)': { marginBottom: '35px' },
  '& ul': { listStyle: 'none', padding: 0, margin: 0 },
  '& li': {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '8px 0',
    '@media (max-width: 600px)': { gap: '12px', padding: '6px 0' },
  },
});

const TraitIcon = styled(Box)({
  width: '36px',
  height: '36px',
  backgroundColor: iconColor,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '& i': {
    fontSize: '20px',
    color: '#ffffff',
    '@media (max-width: 600px)': { fontSize: '18px' },
  },
});

const TraitText = styled(Box)({
  fontSize: '16px',
  color: textColor,
  '@media (max-width: 600px)': { fontSize: '15px' },
  '& p': { margin: 0 },
});

const StatusBadge = styled(Box)(({ status }) => ({
  display: 'inline-block',
  padding: '3px 12px',
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: 600,
  textTransform: 'capitalize',
  backgroundColor:
    status === 'available' ? '#e8f5e9' :
      status === 'adopted' ? '#fce4ec' : '#fff3e0',
  color:
    status === 'available' ? '#2e7d32' :
      status === 'adopted' ? '#c62828' : '#e65100',
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getGenderIcon = (gender) =>
  gender?.toLowerCase() === 'male' ? <MaleIcon /> : <FemaleIcon />;

const formatBool = (val) => (val ? 'Yes' : 'No');

const getAgeLabel = (age) => {
  const n = parseInt(age, 10);
  return `${age} ${n === 1 ? 'year' : 'years'}`;
};

// ─── Default traits (API doesn't return traits yet) ──────────────────────────
const DEFAULT_TRAITS = [
  'Friendly to other pets',
  'Good for Apartments',
  'Friendly with Kids',
];

// ─── Component ────────────────────────────────────────────────────────────────

const PetDetail = () => {
  // ✅ Get title_id from URL e.g. /adoption/kitty
  const { title_id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['cat', title_id],
    queryFn: async () => {
      // ✅ Fetch by title_id slug
      const response = await axiosInstance.get(`/cats/${title_id}`);
      return response.data;
    },
    enabled: !!title_id,
  });

  // ✅ Support both { data: {...} } and direct object responses
  const cat = data?.data || data || null;

  // ── Loading ──
  if (isLoading) {
    return (
      <DetailSection>
        <Container maxWidth="lg">
          <Typography align="center" sx={{ py: 10, color: textColor }}>
            Loading pet details...
          </Typography>
        </Container>
      </DetailSection>
    );
  }

  // ── Error ──
  if (error || !cat) {
    return (
      <DetailSection>
        <Container maxWidth="lg">
          <Typography align="center" color="error" sx={{ py: 10 }}>
            {error ? `Error: ${error.message}` : 'Pet not found.'}
          </Typography>
        </Container>
      </DetailSection>
    );
  }

  // ── Render ──
  return (
    <Box>
      <SectionTile
        bgImage={cat.featuredImage}
        title={`Pet name: ${cat.name}`}
        subtitle="Adopt a Pet"
        icon={false}
      />
      <DetailSection>
        <Container maxWidth="lg">
          <Grid container spacing={4}>

            {/* ── Left Column: Images ── */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Grid container spacing={3}>

                {/* Featured / main image */}
                <Grid size={{ xs: 12 }}>
                  <MainImage>
                    <img
                      src={cat.featuredImage}
                      alt={cat.name}
                      decoding="async"
                      className="img-fluid"
                    />
                  </MainImage>
                </Grid>

                {/* Gallery images (up to 2 side-by-side) */}
                {cat.gallery?.slice(0, 2).map((img, idx) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                    <SideImage>
                      <img
                        src={img}
                        alt={`${cat.name} ${idx + 1}`}
                        decoding="async"
                        className="img-fluid"
                      />
                    </SideImage>
                  </Grid>
                ))}

              </Grid>
            </Grid>

            {/* ── Right Column: Info ── */}
            <Grid size={{ xs: 12, md: 5 }}>
              <ContentWrapper>

                <PetName>Pet name: {cat.name}</PetName>

                {/* Info table */}
                <InfoList>
                  <ul>
                    <li>
                      <InfoLabel>Gender:</InfoLabel>
                      <InfoValue>
                        {getGenderIcon(cat.gender)}
                        <p style={{ textTransform: 'capitalize' }}>{cat.gender}</p>
                      </InfoValue>
                    </li>
                    <li>
                      <InfoLabel>Neutered:</InfoLabel>
                      <InfoValue><p>{formatBool(cat.neutered)}</p></InfoValue>
                    </li>
                    <li>
                      <InfoLabel>Age:</InfoLabel>
                      {/* ✅ Use formattedAge from API, fall back to age */}
                      <InfoValue><p>{getAgeLabel(cat.formattedAge ?? cat.age)}</p></InfoValue>
                    </li>
                    <li>
                      <InfoLabel>Breed:</InfoLabel>
                      <InfoValue><p>{cat.breed}</p></InfoValue>
                    </li>
                    <li>
                      <InfoLabel>Vaccinated:</InfoLabel>
                      <InfoValue><p>{formatBool(cat.vaccinated)}</p></InfoValue>
                    </li>
                    <li>
                      <InfoLabel>Size:</InfoLabel>
                      <InfoValue>
                        <p style={{ textTransform: 'capitalize' }}>{cat.size}</p>
                      </InfoValue>
                    </li>
                    <li>
                      <InfoLabel>Status:</InfoLabel>
                      <InfoValue>
                        <StatusBadge status={cat.status}>{cat.status}</StatusBadge>
                      </InfoValue>
                    </li>
                  </ul>
                </InfoList>

                {/* About */}
                <SectionTitle>About {cat.name}</SectionTitle>
                <Description>{cat.about}</Description>

                {/* Traits */}
                <TraitsList>
                  <ul>
                    {DEFAULT_TRAITS.map((trait, idx) => (
                      <li key={idx}>
                        <TraitIcon>
                          <PetsIcon sx={{ color: '#fff', fontSize: 20 }} />
                        </TraitIcon>
                        <TraitText><p>{trait}</p></TraitText>
                      </li>
                    ))}
                  </ul>
                </TraitsList>
              </ContentWrapper>
            </Grid>

          </Grid>
        </Container>
      </DetailSection>
    </Box>
  );
};

export default PetDetail;