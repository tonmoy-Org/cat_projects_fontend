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
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";

// Colors
const primaryColor = '#ff6b6b';
const iconColor = '#db89ca';
const textColor = '#1a1a1a';

// Styled components
const BlogSection = styled(Box)({
  padding: '80px 0',
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
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: iconColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const SectionSubtitle = styled(Typography)({
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#666',
  textTransform: 'uppercase',
});

const SectionTitle = styled(Typography)({
  fontSize: '38px',
  fontWeight: 700,
  color: textColor,
  lineHeight: 1.2,
  '@media (max-width: 900px)': {
    fontSize: '32px',
  },
  '@media (max-width: 600px)': {
    fontSize: '28px',
    padding: '0 15px',
  },
});

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

// Blog Card Styles
const BlogCard = styled(Box)({
  backgroundColor: '#fff',
  borderRadius: '10px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  height: '100%',
  width: '100%',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
    '& .blog-image': {
      transform: 'scale(1.05)',
    },
    '& .blog-category': {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateY(0)',
    },
    '& .date-only': {
      opacity: 0,
      visibility: 'hidden',
      display: 'none',
    },
    '& .author-info': {
      opacity: 1,
      visibility: 'visible',
      display: 'flex',
    }
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
  pointerEvents: 'none',
});

const CategoryTag = styled(Box)({
  position: 'absolute',
  top: '15px',
  right: '15px',
  backgroundColor: primaryColor,
  color: '#fff',
  padding: '5px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 500,
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
  padding: '20px 18px',
  position: 'relative',
  pointerEvents: 'none',
});

const BlogTitle = styled(Typography)({
  fontSize: '20px',
  fontWeight: 600,
  marginBottom: '10px',
  lineHeight: 1.4,
  color: '#1a1a1a',
  position: 'relative',
  display: 'inline-block',
  '& a': {
    color: 'inherit',
    textDecoration: 'none',
  },
});

const BlogDescription = styled(Typography)({
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

const AuthorInfoWrapper = styled(Box)({
  position: 'relative',
  minHeight: '24px',
});

const DateOnly = styled(Typography)({
  position: 'absolute',
  top: 0,
  left: 0,
  transition: 'all 0.3s ease',
  opacity: 1,
  visibility: 'visible',
  display: 'block',
  color: '#999',
  fontSize: '14px',
  fontWeight: 400,
});

const AuthorInfo = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  alignItems: 'center',
  gap: '15px',
  transition: 'all 0.3s ease',
  opacity: 0,
  visibility: 'hidden',
  display: 'none',
});

const DateText = styled(Typography)({
  color: '#999',
  fontSize: '14px',
  fontWeight: 400,
  whiteSpace: 'nowrap',
});

const AuthorLink = styled('span')({
  color: '#333',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '14px',
  whiteSpace: 'nowrap',
  position: 'relative',
  cursor: 'pointer',
  zIndex: 20,
  pointerEvents: 'auto',
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
  '&:hover::after': {
    width: '100%',
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

  // Fetch blogs from API
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/blogs`);
      return response.data;
    },
  });

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handleCardClick = (post) => {
    // Use title_id or create slug from title
    const slug = post.title_id || post.title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/blog/${slug}`, { state: { post } });
  };

  const handleAuthorClick = (e, author) => {
    e.stopPropagation();
    navigate(`/author/${author.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleCategoryClick = (e, category) => {
    e.stopPropagation();
    navigate(`/category/${category.toLowerCase()}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <BlogSection>
        <Container maxWidth="lg">
          <Grid container justifyContent="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <SectionHeaderWrapper>
                <HeaderTopRow>
                  <SectionIconWrapper>
                    <PetsIcon sx={{ color: '#fff', fontSize: 18 }} />
                  </SectionIconWrapper>
                  <SectionSubtitle>
                    Latest News
                  </SectionSubtitle>
                </HeaderTopRow>
                <SectionTitle>
                  Browse articles & news.
                </SectionTitle>
              </SectionHeaderWrapper>
            </Grid>
          </Grid>
          <LoadingContainer>
            <CircularProgress sx={{ color: primaryColor }} />
          </LoadingContainer>
        </Container>
      </BlogSection>
    );
  }

  // Show error state
  if (error) {
    return (
      <BlogSection>
        <Container maxWidth="lg">
          <Grid container justifyContent="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <SectionHeaderWrapper>
                <HeaderTopRow>
                  <SectionIconWrapper>
                    <PetsIcon sx={{ color: '#fff', fontSize: 18 }} />
                  </SectionIconWrapper>
                  <SectionSubtitle>
                    Latest News
                  </SectionSubtitle>
                </HeaderTopRow>
                <SectionTitle>
                  Browse articles & news.
                </SectionTitle>
              </SectionHeaderWrapper>
            </Grid>
          </Grid>
          <LoadingContainer>
            <Alert severity="error">Error loading blog posts. Please try again later.</Alert>
          </LoadingContainer>
        </Container>
      </BlogSection>
    );
  }

  // Get blogs from API response - data is the array directly
  const blogs = data?.blogs || [];
  const totalSlides = Math.ceil(blogs.length / CARDS_PER_VIEW);

  // Get current cards to display
  const startIndex = currentIndex * CARDS_PER_VIEW;
  const visibleCards = blogs.slice(startIndex, startIndex + CARDS_PER_VIEW);

  return (
    <BlogSection>
      <Container maxWidth="lg">
        {/* Header */}
        <Grid container justifyContent="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <SectionHeaderWrapper>
              <HeaderTopRow>
                <SectionIconWrapper>
                  <PetsIcon sx={{ color: '#fff', fontSize: 18 }} />
                </SectionIconWrapper>
                <SectionSubtitle>
                  Latest News
                </SectionSubtitle>
              </HeaderTopRow>
              <SectionTitle>
                Browse articles & news.
              </SectionTitle>
            </SectionHeaderWrapper>
          </Grid>
        </Grid>

        {/* Show message if no blogs */}
        {blogs.length === 0 ? (
          <LoadingContainer>
            <Alert severity="info">No blog posts available at the moment.</Alert>
          </LoadingContainer>
        ) : (
          <>
            {/* Carousel */}
            <CarouselContainer>
              <Box sx={{ overflow: 'hidden' }}>
                <CardsWrapper>
                  {visibleCards.map((post) => (
                    <CardWrapper key={post._id || post.id}>
                      <BlogCard onClick={() => handleCardClick(post)}>
                        <Box className="blog-image-wrapper">
                          <ImageWrapper>
                            <BlogImage
                              src={post.imageUrl || 'https://via.placeholder.com/400x240'}
                              alt={post.title}
                              className="blog-image"
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
                        </Box>

                        <BlogContent>
                          <BlogTitle>
                            {post.title}
                          </BlogTitle>

                          <BlogDescription>
                            {post.excerpt || 'No description available.'}
                          </BlogDescription>

                          <AuthorInfoWrapper>
                            {/* Initially visible - only date */}
                            <DateOnly className="date-only">
                              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              }) : 'No date'}
                            </DateOnly>

                            {/* Shown on hover - full author info */}
                            <AuthorInfo className="author-info">
                              <DateText variant="body2">
                                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                }) : 'No date'}
                              </DateText>
                              {post.author && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: '#666',
                                      fontSize: '14px',
                                    }}
                                  >
                                    by
                                  </Typography>
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

            {/* Carousel Dots - Only show if there are multiple slides */}
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