import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SectionTile from '../../components/SectionTile';
import { useBlogApi } from '../../hooks/useBlogApi';

const PRIMARY_COLOR = '#5C4D91';
const ACCENT = '#db89ca';
const textColor = '#666';

const C = {
  primary: '#db89ca',
  primaryDark: '#c06bb0',
  text: '#1a1a1a',
  textLight: '#666',
  border: '#e0e0e0',
  bg: '#f5f5f5',
  price: '#ff6b6b',
  rating: '#ffb400',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
};

const BlogDetailSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '60px 0',
  [theme.breakpoints.down('sm')]: {
    padding: '40px 0',
  },
}));

const ContentText = styled(Typography)({
  fontSize: '15px',
  color: textColor,
  lineHeight: 1.8,
  marginBottom: '20px',
});

const GalleryImage = styled('img')({
  width: '100%',
  height: 'auto',
  maxHeight: '500px',
  objectFit: 'cover',
  borderRadius: '12px',
  display: 'block',
  margin: '0 auto',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  '@media (max-width: 600px)': {
    maxHeight: '250px',
    borderRadius: '8px',
  },
});

const RelatedSection = styled(Box)({
  marginTop: '60px',
  padding: '60px 0',
  backgroundColor: '#f9f9f9',
});

const SectionHeaderWrapper = styled(Box)({
  textAlign: 'center',
  marginBottom: '40px',
});

const SectionIconWrapper = styled(Box)({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: ACCENT,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 12px',
});

const SectionSubtitle = styled(Typography)({
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#999',
  textTransform: 'uppercase',
  marginBottom: '8px',
});

const SectionTitle = styled(Typography)({
  fontSize: '28px',
  fontWeight: 700,
  color: '#1a1a1a',
  lineHeight: 1.2,
  '@media (max-width: 600px)': {
    fontSize: '22px',
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

const RelatedCard = styled(Box)({
  backgroundColor: '#fff',
  borderRadius: '3px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  height: '100%',
  boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
  border: '1px solid #f0f0f0',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.11)',
    '& .related-image': { transform: 'scale(1.05)' },
  },
});

const RelatedImageWrapper = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '180px',
});

const RelatedImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
});

const RelatedCategory = styled(Box)({
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: PRIMARY_COLOR,
  color: '#fff',
  padding: '3px 10px',
  borderRadius: '20px',
  fontSize: '10px',
  fontWeight: 500,
  zIndex: 2,
});

const RelatedContent = styled(Box)({
  padding: '12px',
});

const RelatedTitle = styled(Typography)({
  fontSize: '14px',
  fontWeight: 600,
  marginBottom: '6px',
  lineHeight: 1.4,
  color: '#333',
});

const RelatedMeta = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#999',
  fontSize: '11px',
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
  gap: '8px',
  marginTop: '24px',
});

const Dot = styled(Box)(({ active }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: active ? PRIMARY_COLOR : '#ddd',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
});

const BlogDetail = () => {
  const { title_id } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { useBlogDetail } = useBlogApi();
  const {
    blog,
    relatedBlogs,
    formatDate,
    stripHtmlTags,
    isLoading,
    error,
    handleBlogClick,
  } = useBlogDetail(title_id);

  const cardsPerView = 3;
  const totalSlides = Math.ceil(relatedBlogs.length / cardsPerView);

  const handlePrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  const handleDotClick = (index) => setCurrentIndex(index);

  const startIndex = currentIndex * cardsPerView;
  const visibleCards = relatedBlogs.slice(startIndex, startIndex + cardsPerView);

  if (isLoading) {
    return (
      <Box>
        <SectionTile
          bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg"
          subtitle="Blog Detail"
          title="Read Our Latest News"
          icon={true}
          iconClass="flaticon-custom-icon"
        />
        <BlogDetailSection>
          <Container>
            <LoadingContainer>
              <CircularProgress sx={{ color: PRIMARY_COLOR }} />
            </LoadingContainer>
          </Container>
        </BlogDetailSection>
      </Box>
    );
  }

  if (error || !blog) {
    return (
      <Box>
        <SectionTile
          bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg"
          subtitle="Blog Detail"
          title="Read Our Latest News"
          icon={true}
          iconClass="flaticon-custom-icon"
        />
        <BlogDetailSection>
          <Container>
            <Typography textAlign="center" color="error" sx={{ py: 4 }}>
              {error ? `Error: ${error.message}` : 'Blog post not found'}
            </Typography>
          </Container>
        </BlogDetailSection>
      </Box>
    );
  }

  const contentParagraphs = blog.content
    ? blog.content.split('</p>').map(p => p.replace(/<[^>]*>/g, '')).filter(p => p.trim())
    : [blog.excerpt || ''];

  const galleryImages = blog.imageUrl ? [blog.imageUrl] : [];

  return (
    <Box>
      <SectionTile
        bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg"
        subtitle="Blog Detail"
        title={blog.title}
        icon={true}
        iconClass="flaticon-custom-icon"
      />

      <BlogDetailSection>
        <Container>
          <Grid container justifyContent="center">
            <Grid size={{ lg: 10, md: 10 }}>
              <Box className="post-content">
                {/* Blog Meta Info */}
                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 3,
                  color: '#999',
                  flexWrap: 'wrap',
                  fontSize: { xs: '12px', sm: '13px' },
                }}>
                  <Typography>By {blog.author || 'Admin'}</Typography>
                  <Typography>•</Typography>
                  <Typography>{formatDate(blog.publishedAt || blog.date)}</Typography>
                  <Typography>•</Typography>
                  <Typography>{blog.category}</Typography>
                </Box>

                {/* Blog Content */}
                <Box sx={{ mb: 4 }}>
                  {contentParagraphs.map((paragraph, index) => (
                    <ContentText key={index} paragraph>
                      {paragraph}
                    </ContentText>
                  ))}
                </Box>

                {/* Gallery / Image */}
                {galleryImages.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                      {galleryImages.map((image, index) => (
                        <Grid size={{ xs: 12 }} key={index}>
                          <GalleryImage
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/800x500?text=No+Image';
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Related Blogs Carousel */}
        {relatedBlogs.length > 0 && (
          <RelatedSection>
            <Container maxWidth="lg">
              <Typography sx={{ fontSize: '20px', fontWeight: 700, color: C.text, mb: '28px', textAlign: 'center' }}>
                Other Blogs You Might Like
              </Typography>
              <CarouselContainer>
                <Box sx={{ overflow: 'hidden' }}>
                  <CardsWrapper
                    sx={{
                      transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                    }}
                  >
                    {relatedBlogs.map((post) => (
                      <CardWrapper key={post._id}>
                        <RelatedCard onClick={() => handleBlogClick(post)}>
                          <RelatedImageWrapper>
                            <RelatedImage
                              className="related-image"
                              src={post.imageUrl || post.image}
                              alt={post.title}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
                              }}
                            />
                            <RelatedCategory>{post.category}</RelatedCategory>
                          </RelatedImageWrapper>
                          <RelatedContent>
                            <RelatedTitle>{post.title}</RelatedTitle>
                            <RelatedMeta>
                              <span>{formatDate(post.publishedAt || post.date)}</span>
                              <span>•</span>
                              <span>By {post.author || 'Admin'}</span>
                            </RelatedMeta>
                          </RelatedContent>
                        </RelatedCard>
                      </CardWrapper>
                    ))}
                  </CardsWrapper>
                </Box>

                {totalSlides > 1 && (
                  <>
                    <PrevButton onClick={handlePrev}>
                      <ChevronLeftIcon />
                    </PrevButton>
                    <NextButton onClick={handleNext}>
                      <ChevronRightIcon />
                    </NextButton>
                  </>
                )}
              </CarouselContainer>

              {totalSlides > 1 && (
                <DotsContainer>
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <Dot
                      key={index}
                      active={currentIndex === index}
                      onClick={() => handleDotClick(index)}
                    />
                  ))}
                </DotsContainer>
              )}
            </Container>
          </RelatedSection>
        )}
      </BlogDetailSection>
    </Box>
  );
};

export default BlogDetail;