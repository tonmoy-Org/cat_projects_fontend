import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Pagination,
  PaginationItem,
  useTheme,
  styled,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Colors
const primaryColor = '#ff6b6b';
const iconBgColor = '#db89ca';
const textColor = '#2b2b2b';

// Styled components
const BlogSection = styled(Box)({
  padding: '80px 0',
  backgroundColor: '#fff',
});

const SectionHeader = styled(Box)({
  textAlign: 'center',
  marginBottom: '50px',
});

const SectionSubtitle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#777',
  marginBottom: '10px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

const IconWrapper = styled(Box)({
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: iconBgColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  '& svg': {
    fontSize: '16px',
  },
});

const SectionTitle = styled(Typography)({
  fontSize: '36px',
  fontWeight: 700,
  color: textColor,
  fontFamily: '"Playfair Display", serif',
  marginBottom: '15px',
  lineHeight: 1.2,
  '@media (max-width: 600px)': {
    fontSize: '28px',
  },
});

// Blog Card Styles
const BlogCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  height: '100%',
  width: '100%',
  boxShadow: 'none',
  border: '1px solid #f0f0f0',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
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
}));

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

const CategoryTag = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '15px',
  right: '15px',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  padding: '6px 15px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: 500,
  transition: 'all 0.3s ease',
  zIndex: 10,
  cursor: 'pointer',
  opacity: 0,
  visibility: 'hidden',
  transform: 'translateY(-10px)',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  }
}));

const BlogContent = styled(Box)({
  padding: '20px 18px',
  position: 'relative',
  pointerEvents: 'none',
});

const BlogTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 600,
  marginBottom: '10px',
  lineHeight: 1.4,
  color: '#333',
}));

const BlogDescription = styled(Typography)({
  color: '#666',
  fontSize: '14px',
  lineHeight: 1.6,
  marginBottom: '15px',
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

const AuthorLink = styled('span')(({ theme }) => ({
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
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.3s ease',
  },
  '&:hover::after': {
    width: '100%',
  }
}));

// Pagination Styles - Fixed to show numbers
const PaginationWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '50px',
  width: '100%',
});

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
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      borderColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      }
    }
  },
  '& .MuiPaginationItem-previousNext': {
    fontSize: '18px',
    '& svg': {
      fontSize: '20px',
    }
  }
}));

// Blog data
const blogPosts = [
  {
    id: 1,
    title: "Pet dental care",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    date: "13 Mar 2025",
    author: "Lily Duru",
    category: "Care",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/01.jpg",
    slug: "pet-dental-care"
  },
  {
    id: 2,
    title: "Dog grooming styles",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    date: "13 Mar 2025",
    author: "Frank White",
    category: "Pet",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/06.jpg",
    slug: "dog-grooming-styles"
  },
  {
    id: 3,
    title: "Pet safety tips",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    date: "13 Mar 2025",
    author: "Olivia Dan",
    category: "Dental",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/03.jpg",
    slug: "pet-safety-tips"
  },
  {
    id: 4,
    title: "Pet parasites",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    date: "13 Mar 2025",
    author: "Frank White",
    category: "Surgery",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/04.jpg",
    slug: "pet-parasites"
  },
  {
    id: 5,
    title: "Puppy sleeping habits",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    date: "13 Mar 2025",
    author: "Lily Duru",
    category: "Diagnostic",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/05.jpg",
    slug: "puppy-sleeping-habits"
  },
  {
    id: 6,
    title: "Cat microchipping",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    date: "12 Mar 2025",
    author: "Olivia Dan",
    category: "Safety",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/02.jpg",
    slug: "cat-microchipping"
  }
];

const POSTS_PER_PAGE = 3;

const BlogArticles = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = blogPosts.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (post) => {
    navigate(`/blog/${post.slug}`, { state: { post } });
  };

  const handleAuthorClick = (e, author) => {
    e.stopPropagation();
    navigate(`/author/${author.toLowerCase().replace(' ', '-')}`);
  };

  const handleCategoryClick = (e, category) => {
    e.stopPropagation();
    navigate(`/category/${category.toLowerCase()}`);
  };

  return (
    <BlogSection>
      <Container maxWidth="lg">
        {/* Header */}
        <SectionHeader>
          <SectionSubtitle>
            <IconWrapper>
              <PetsIcon />
            </IconWrapper>
            Latest News
          </SectionSubtitle>
          <SectionTitle>Browse articles & news.</SectionTitle>
        </SectionHeader>

        {/* Blog Grid - Shows only 3 posts per page */}
        <Grid container spacing={3}>
          {currentPosts.map((post) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
              <BlogCard onClick={() => handleCardClick(post)}>
                <Box className="blog-image-wrapper">
                  <ImageWrapper>
                    <BlogImage
                      src={post.image}
                      alt={post.title}
                      className="blog-image"
                    />
                    <CategoryTag
                      className="blog-category"
                      onClick={(e) => handleCategoryClick(e, post.category)}
                    >
                      {post.category}
                    </CategoryTag>
                  </ImageWrapper>
                </Box>

                <BlogContent>
                  <BlogTitle>
                    {post.title}
                  </BlogTitle>

                  <BlogDescription>
                    {post.description}
                  </BlogDescription>

                  <AuthorInfoWrapper>
                    {/* Initially visible - only date */}
                    <DateOnly className="date-only">
                      {post.date}
                    </DateOnly>

                    {/* Shown on hover - full author info */}
                    <AuthorInfo className="author-info">
                      <DateText variant="body2">
                        {post.date}
                      </DateText>
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
                    </AuthorInfo>
                  </AuthorInfoWrapper>
                </BlogContent>
              </BlogCard>
            </Grid>
          ))}
        </Grid>

        {/* Pagination - Shows numbers correctly */}
        {totalPages > 1 && (
          <PaginationWrapper>
            <StyledPagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              showFirstButton={false}
              showLastButton={false}
              siblingCount={1}
              boundaryCount={1}
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  components={{
                    previous: ChevronLeftIcon,
                    next: ChevronRightIcon,
                  }}
                />
              )}
            />
          </PaginationWrapper>
        )}
      </Container>
    </BlogSection>
  );
};

export default BlogArticles;