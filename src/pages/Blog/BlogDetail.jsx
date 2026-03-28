// BlogDetail.jsx
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  IconButton,
} from '@mui/material';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SectionTile from '../../components/SectionTile';

const primaryColor = '#ff6b6b';
const textColor = '#666';

const BlogDetailSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '80px 0',
  [theme.breakpoints.down('sm')]: {
    padding: '20px 0',
  },
}));

const ContentText = styled(Typography)({
  fontSize: '16px',
  color: textColor,
  lineHeight: 1.8,
  marginBottom: '25px',
});

const GalleryWrapper = styled(Box)({
  marginBottom: '30px',
});

const GalleryImage = styled('img')({
  width: '100%',
  height: 'auto',
  maxHeight: '620px',
  objectFit: 'cover',
  borderRadius: '8px',
  display: 'block',
  margin: '0 auto',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  '@media (max-width: 900px)': {
    maxHeight: '400px',
  },
  '@media (max-width: 600px)': {
    maxHeight: '220px',
    borderRadius: '6px',
  },
});

const GalleryImageContainer = styled(Box)({
  width: '100%',
  maxWidth: '100%',
  margin: '0 auto',
  overflow: 'hidden',
  borderRadius: '8px',
  '@media (max-width: 600px)': {
    borderRadius: '6px',
  },
});

const LatestNewsSection = styled(Box)({
  marginTop: '80px',
  padding: '60px 0',
  backgroundColor: '#f9f9f9',
});

const SectionHeaderWrapper = styled(Box)({
  textAlign: 'center',
  marginBottom: '40px',
});

const SectionIconWrapper = styled(Box)({
  width: 45,
  height: 45,
  borderRadius: '50%',
  backgroundColor: primaryColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 15px',
});

const SectionSubtitle = styled(Typography)({
  fontSize: '15px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#333',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
});

const SectionTitle = styled(Typography)({
  fontSize: '36px',
  fontWeight: 700,
  color: '#1a1a1a',
  lineHeight: 1.2,
  '@media (max-width: 600px)': {
    fontSize: '28px',
  },
});

const CarouselContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  padding: '0 40px',
  '@media (max-width: 600px)': {
    padding: '0 20px',
  },
});

const CardsWrapper = styled(Box)({
  display: 'flex',
  transition: 'transform 0.5s ease',
  gap: '20px',
});

const CardWrapper = styled(Box)({
  flex: '0 0 calc(33.333% - 14px)',
  minWidth: '280px',
  '@media (max-width: 900px)': {
    flex: '0 0 calc(50% - 10px)',
  },
  '@media (max-width: 600px)': {
    flex: '0 0 100%',
  },
});

const BlogCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  height: '100%',
  width: '100%',
  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    '& .blog-image': { transform: 'scale(1.05)' },
    '& .blog-category': { opacity: 1, visibility: 'visible', transform: 'translateY(0)' },
    '& .date-only': { opacity: 0, visibility: 'hidden', display: 'none' },
    '& .author-info': { opacity: 1, visibility: 'visible', display: 'flex' },
  },
}));

const CardImageWrapper = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '200px',
});

const CardImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
});

const CardCategory = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '15px',
  right: '15px',
  backgroundColor: primaryColor,
  color: '#fff',
  padding: '5px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 500,
  zIndex: 2,
  opacity: 0,
  visibility: 'hidden',
  transform: 'translateY(-10px)',
  transition: 'all 0.3s ease',
  '&:hover': { backgroundColor: '#ff5252' },
}));

const CardContent = styled(Box)({ padding: '20px 18px' });

const CardTitle = styled(Typography)({
  fontSize: '18px',
  fontWeight: 600,
  marginBottom: '10px',
  lineHeight: 1.4,
  color: '#333',
});

const CardDescription = styled(Typography)({
  color: '#666',
  fontSize: '14px',
  lineHeight: 1.6,
  marginBottom: '15px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const CardMeta = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#999',
  fontSize: '13px',
  position: 'relative',
  minHeight: '24px',
});

const CardDate = styled(Typography)({
  color: '#999',
  fontSize: '13px',
  transition: 'all 0.3s ease',
  opacity: 1,
  visibility: 'visible',
  display: 'block',
});

const CardAuthor = styled('span')({
  color: '#333',
  fontWeight: 500,
  fontSize: '13px',
  position: 'relative',
  cursor: 'pointer',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-2px',
    left: '0',
    width: '0',
    height: '1px',
    backgroundColor: primaryColor,
    transition: 'width 0.3s ease',
  },
  '&:hover::after': { width: '100%' },
});

const NavButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: '#fff',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  '&:hover': { backgroundColor: '#f5f5f5' },
  zIndex: 10,
});

const PrevButton = styled(NavButton)({ left: '0' });
const NextButton = styled(NavButton)({ right: '0' });

const DotsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  marginTop: '30px',
});

const Dot = styled(Box)(({ active }) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: active ? primaryColor : '#ddd',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': { backgroundColor: active ? primaryColor : '#ccc' },
}));

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const stripHtmlTags = (html) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const BlogDetail = () => {
  const location = useLocation();
  const { title_id } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  let post = location.state?.post;

  if (!post) {
    return (
      <BlogDetailSection>
        <Container>
          <Typography variant="h4" sx={{ textAlign: 'center', color: '#666' }}>
            Blog post not found
          </Typography>
        </Container>
      </BlogDetailSection>
    );
  }

  const contentParagraphs = post.content
    ? post.content.split('</p>').map(p => p.replace(/<[^>]*>/g, '')).filter(p => p.trim())
    : [post.excerpt || ''];

  const galleryImages = post.imageUrl ? [post.imageUrl] : [];
  const otherPosts = [];
  const cardsPerView = 3;
  const totalSlides = Math.ceil(otherPosts.length / cardsPerView);

  const handlePrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  const handleDotClick = (index) => setCurrentIndex(index);

  const handleCardClick = (post) => {
    navigate(`/blog/${post.title_id}`, { state: { post } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIndex = currentIndex * cardsPerView;
  const visibleCards = otherPosts.slice(startIndex, startIndex + cardsPerView);

  return (
    <Box>
      <SectionTile
        bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg"
        subtitle="Our Services"
        title="What We Offer"
        icon={true}
        iconClass="flaticon-custom-icon"
      />
      <BlogDetailSection>
        <Container>
          <Grid container justifyContent="center">
            <Grid size={{ lg: 12, md: 8 }}>
              <Box className="post-content">

                {/* Blog Title */}
                <Typography
                  variant="h4"
                  sx={{
                    mb: 3,
                    fontWeight: 700,
                    fontSize: { xs: '22px', sm: '26px', md: '32px' },
                  }}
                >
                  {post.title}
                </Typography>

                {/* Blog Meta Info */}
                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 4,
                  color: '#999',
                  flexWrap: 'wrap',
                  fontSize: { xs: '13px', sm: '14px' },
                }}>
                  <Typography>By {post.author || 'Admin'}</Typography>
                  <Typography>•</Typography>
                  <Typography>{formatDate(post.publishedAt || post.date)}</Typography>
                  <Typography>•</Typography>
                  <Typography>{post.category}</Typography>
                </Box>

                {/* ── Blog Content FIRST ── */}
                <Box className="col-md-12" sx={{ mb: 4 }}>
                  {contentParagraphs.map((paragraph, index) => (
                    <ContentText key={index} paragraph>
                      {paragraph}
                    </ContentText>
                  ))}
                </Box>

                {/* ── Gallery / Image AFTER content ── */}
                {galleryImages.length > 0 && (
                  <GalleryWrapper>
                    <Grid container spacing={3}>
                      {galleryImages.map((image, index) => (
                        <Grid size={{ xs: 12 }} key={index}>
                          <Box className="gallery-masonry-wrapper">
                            <a href={image} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                              <Box className="gallery-box">
                                <Box className="gallery-img">
                                  <GalleryImageContainer>
                                    <GalleryImage
                                      src={image}
                                      alt={`Gallery ${index + 1}`}
                                      className="img-fluid"
                                    />
                                  </GalleryImageContainer>
                                </Box>
                              </Box>
                            </a>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </GalleryWrapper>
                )}

              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Latest News Carousel */}
        {otherPosts.length > 0 && (
          <LatestNewsSection>
            <Container maxWidth="lg">
              <Grid container justifyContent="center">
                <Grid size={{ xs: 12, md: 8 }}>
                  <SectionHeaderWrapper>
                    <SectionIconWrapper>
                      <PetsIcon sx={{ color: '#fff', fontSize: 20 }} />
                    </SectionIconWrapper>
                    <SectionSubtitle>Latest News</SectionSubtitle>
                    <SectionTitle>Browse articles & news.</SectionTitle>
                  </SectionHeaderWrapper>
                </Grid>
              </Grid>

              <CarouselContainer>
                <Box sx={{ overflow: 'hidden' }}>
                  <CardsWrapper>
                    {visibleCards.map((post) => (
                      <CardWrapper key={post._id || post.id}>
                        <BlogCard onClick={() => handleCardClick(post)}>
                          <CardImageWrapper>
                            <CardImage src={post.imageUrl || post.image} alt={post.title} className="blog-image" />
                            <CardCategory className="blog-category">{post.category}</CardCategory>
                          </CardImageWrapper>
                          <CardContent>
                            <CardTitle>{post.title}</CardTitle>
                            <CardDescription>
                              {post.excerpt || stripHtmlTags(post.content).substring(0, 100) + '...'}
                            </CardDescription>
                            <CardMeta>
                              <CardDate className="date-only">
                                {formatDate(post.publishedAt || post.date)}
                              </CardDate>
                              <Box className="author-info" sx={{
                                display: 'none',
                                alignItems: 'center',
                                gap: '4px',
                                opacity: 0,
                                transition: 'all 0.3s ease',
                              }}>
                                <Typography sx={{ color: '#999', fontSize: '13px' }}>by</Typography>
                                <CardAuthor>{post.author || 'Admin'}</CardAuthor>
                              </Box>
                            </CardMeta>
                          </CardContent>
                        </BlogCard>
                      </CardWrapper>
                    ))}
                  </CardsWrapper>
                </Box>

                {totalSlides > 1 && (
                  <>
                    <PrevButton onClick={handlePrev}><ChevronLeftIcon /></PrevButton>
                    <NextButton onClick={handleNext}><ChevronRightIcon /></NextButton>
                  </>
                )}
              </CarouselContainer>

              {totalSlides > 1 && (
                <DotsContainer>
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <Dot key={index} active={currentIndex === index} onClick={() => handleDotClick(index)} />
                  ))}
                </DotsContainer>
              )}
            </Container>
          </LatestNewsSection>
        )}
      </BlogDetailSection>
    </Box>
  );
};

export default BlogDetail;
