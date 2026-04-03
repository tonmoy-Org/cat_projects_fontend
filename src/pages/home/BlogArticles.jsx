import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import { useBlogApi } from '../../hooks/useBlogApi';

// Colors
const primaryColor = '#ff6b6b';
const iconColor = '#db89ca';
const textColor = '#1a1a1a';

// Styled components with consistent font sizes
const BlogSection = styled(Box)({
  paddingBottom: '80px',
  backgroundColor: '#fff',
  overflow: 'hidden',
});

const SectionHeaderWrapper = styled(Box)({
  textAlign: 'center',
  marginBottom: '50px',
});

const HeaderTopRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '15px',
  flexWrap: 'wrap',
});

const SectionIconWrapper = styled(Box)({
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  backgroundColor: iconColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const SectionSubtitle = styled(Typography)({
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#666',
  textTransform: 'uppercase',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '26px',
  fontWeight: 700,
  color: textColor,
  lineHeight: 1.2,
  [theme.breakpoints.down('md')]: {
    fontSize: '32px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '28px',
    padding: '0 15px',
  },
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
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

// Blog Card Styles - Consistent with previous sections
const BlogCard = styled(Box)({
  backgroundColor: '#fff',
  borderRadius: '3px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  height: '100%',
  width: '100%',
  boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.11)',
    '& .blog-image': {
      transform: 'scale(1.05)',
    },
    '& .blog-category': {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateY(0)',
    },
  }
});

const ImageWrapper = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '240px',
});

const BlogImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
});

const CategoryTag = styled(Box)({
  position: 'absolute',
  top: '15px',
  right: '15px',
  backgroundColor: primaryColor,
  color: '#fff',
  padding: '5px 12px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  zIndex: 10,
  cursor: 'pointer',
  opacity: 0,
  visibility: 'hidden',
  transform: 'translateY(-10px)',
  '&:hover': {
    backgroundColor: '#ff5252',
  }
});

const BlogContent = styled(Box)({
  padding: '18px 18px 20px',
});

const BlogTitle = styled(Typography)({
  fontSize: '16px',
  fontWeight: 600,
  marginBottom: '10px',
  lineHeight: 1.4,
  color: '#1a1a1a',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const BlogDescription = styled(Typography)({
  color: '#666',
  fontSize: '13px',
  lineHeight: 1.6,
  marginBottom: '15px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const AuthorInfoWrapper = styled(Box)({
  position: 'relative',
  minHeight: '22px',
});

const DateOnly = styled(Typography)({
  color: '#999',
  fontSize: '13px',
  fontWeight: 400,
});

const AuthorInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: '#666',
  fontSize: '13px',
});

const DateText = styled(Typography)({
  color: '#999',
  fontSize: '13px',
  fontWeight: 400,
});

const AuthorLink = styled('span')({
  color: '#333',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '13px',
  cursor: 'pointer',
  '&:hover': {
    color: primaryColor,
    textDecoration: 'underline',
  }
});

const DotsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  marginTop: '40px',
});

const Dot = styled(Box)(({ active }) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: active ? primaryColor : '#ddd',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: active ? primaryColor : '#ccc',
  },
}));

const CARDS_PER_VIEW = 3;

const BlogArticles = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { useBlogs } = useBlogApi();
  const {
    blogs,
    isLoading,
    error,
    handleBlogClick,
  } = useBlogs();

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handleAuthorClick = (e, author) => {
    e.stopPropagation();
    navigate(`/author/${author.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleCategoryClick = (e, category) => {
    e.stopPropagation();
    navigate(`/category/${category.toLowerCase()}`);
  };

  const totalSlides = Math.ceil(blogs.length / CARDS_PER_VIEW);
  const startIndex = currentIndex * CARDS_PER_VIEW;
  const visibleCards = blogs.slice(startIndex, startIndex + CARDS_PER_VIEW);

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <BlogSection>
        <Container maxWidth="lg">
          <SectionHeaderWrapper>
            <HeaderTopRow>
              <SectionIconWrapper>
                <PetsIcon sx={{ color: '#fff', fontSize: 18 }} />
              </SectionIconWrapper>
              <SectionSubtitle>Latest News</SectionSubtitle>
            </HeaderTopRow>
            <SectionTitle>Browse articles & news.</SectionTitle>
          </SectionHeaderWrapper>
          <LoadingContainer>
            <CircularProgress sx={{ color: primaryColor }} />
          </LoadingContainer>
        </Container>
      </BlogSection>
    );
  }

  if (error) {
    return (
      <BlogSection>
        <Container maxWidth="lg">
          <SectionHeaderWrapper>
            <HeaderTopRow>
              <SectionIconWrapper>
                <PetsIcon sx={{ color: '#fff', fontSize: 18 }} />
              </SectionIconWrapper>
              <SectionSubtitle>Latest News</SectionSubtitle>
            </HeaderTopRow>
            <SectionTitle>Browse articles & news.</SectionTitle>
          </SectionHeaderWrapper>
          <LoadingContainer>
            <Alert severity="error">Error loading blog posts. Please try again later.</Alert>
          </LoadingContainer>
        </Container>
      </BlogSection>
    );
  }

  return (
    <BlogSection>
      <Container maxWidth="lg">
        {/* Header */}
        <SectionHeaderWrapper>
          <HeaderTopRow>
            <SectionIconWrapper>
              <PetsIcon sx={{ color: '#fff', fontSize: 18 }} />
            </SectionIconWrapper>
            <SectionSubtitle>Latest News</SectionSubtitle>
          </HeaderTopRow>
          <SectionTitle>Browse articles & news.</SectionTitle>
        </SectionHeaderWrapper>

        {blogs.length === 0 ? (
          <LoadingContainer>
            <Alert severity="info">No blog posts available at the moment.</Alert>
          </LoadingContainer>
        ) : (
          <>
            <CarouselContainer>
              <Box sx={{ overflow: 'hidden' }}>
                <CardsWrapper
                  sx={{
                    transform: `translateX(-${currentIndex * (100 / CARDS_PER_VIEW)}%)`,
                  }}
                >
                  {visibleCards.map((post) => (
                    <CardWrapper key={post._id || post.id}>
                      <BlogCard onClick={() => handleBlogClick(post)}>
                        <ImageWrapper>
                          <BlogImage
                            src={post.imageUrl || 'https://via.placeholder.com/400x240'}
                            alt={post.title}
                            className="blog-image"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x240?text=No+Image';
                            }}
                          />
                          {post.category && (
                            <CategoryTag
                              className="blog-category"
                              onClick={(e) => handleCategoryClick(e, post.category)}
                            >
                              {post.category}
                            </CategoryTag>
                          )}
                        </ImageWrapper>

                        <BlogContent>
                          <BlogTitle>
                            {post.title}
                          </BlogTitle>

                          <BlogDescription>
                            {post.excerpt || 'No description available.'}
                          </BlogDescription>

                          <AuthorInfoWrapper>
                            <DateOnly className="date-only">
                              {formatDate(post.publishedAt || post.date)}
                            </DateOnly>

                            <AuthorInfo className="author-info">
                              <DateText>
                                {formatDate(post.publishedAt || post.date)}
                              </DateText>
                              {post.author && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span>by</span>
                                  <AuthorLink onClick={(e) => handleAuthorClick(e, post.author)}>
                                    {post.author}
                                  </AuthorLink>
                                </Box>
                              )}
                            </AuthorInfo>
                          </AuthorInfoWrapper>
                        </BlogContent>
                      </BlogCard>
                    </CardWrapper>
                  ))}
                </CardsWrapper>
              </Box>
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
          </>
        )}
      </Container>
    </BlogSection>
  );
};

export default BlogArticles;