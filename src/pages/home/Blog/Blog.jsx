// Blog.jsx
import React from 'react';
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
import { Link as RouterLink } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Styled components for custom hover effects
const BlogSection = styled(Box)({
  backgroundColor: '#ffffff',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});

const BlogCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  height: '100%',
  width: '100%',
  boxShadow: 'none',
  border: '1px solid #f0f0f0',
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
  zIndex: 2,
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
});

const BlogTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 600,
  marginBottom: '10px',
  lineHeight: 1.4,
  '& a': {
    color: '#333',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: theme.palette.primary.main,
    }
  }
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

const AuthorLink = styled('a')(({ theme }) => ({
  color: '#333',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '14px',
  whiteSpace: 'nowrap',
  position: 'relative',
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

// Blog data based on your screenshot
const blogPosts = [
  {
    id: 1,
    title: "Pet dental care",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    date: "13 Mar 2025",
    author: "Lily Duru",
    category: "Care",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/01.jpg",
    link: "/blog/pet-dental-care"
  },
  {
    id: 2,
    title: "Dog grooming styles",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    date: "13 Mar 2025",
    author: "Frank White",
    category: "Pet",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/06.jpg",
    link: "/blog/dog-grooming-styles"
  },
  {
    id: 3,
    title: "Pet safety tips",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    date: "13 Mar 2025",
    author: "Olivia Dan",
    category: "Dental",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/03.jpg",
    link: "/blog/pet-safety-tips"
  },
  {
    id: 4,
    title: "Pet parasites",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    date: "13 Mar 2025",
    author: "Frank White",
    category: "Surgery",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/04.jpg",
    link: "/blog/pet-parasites"
  },
  {
    id: 5,
    title: "Puppy sleeping habits",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    date: "13 Mar 2025",
    author: "Lily Duru",
    category: "Diagnostic",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/05.jpg",
    link: "/blog/puppy-sleeping-habits"
  },
  {
    id: 6,
    title: "Cat microchipping",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    date: "12 Mar 2025",
    author: "Olivia Dan",
    category: "Safety",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/02.jpg",
    link: "/blog/cat-microchipping"
  }
];

const Blog = () => {
  const theme = useTheme();
  const [page, setPage] = React.useState(1);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <BlogSection sx={{ py: 6 }}>
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 3 },
          margin: '0 auto',
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            margin: 0,
            width: '100%',
          }}
        >
          {blogPosts.map((post) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={post.id}
              sx={{
                padding: '0 12px !important',
                marginBottom: '24px',
              }}
            >
              <BlogCard>
                <Box className="blog-image-wrapper">
                  <ImageWrapper>
                    <RouterLink to={post.link}>
                      <BlogImage
                        src={post.image}
                        alt={post.title}
                        className="blog-image"
                      />
                    </RouterLink>
                    <CategoryTag className="blog-category">
                      {post.category}
                    </CategoryTag>
                  </ImageWrapper>
                </Box>

                <BlogContent>
                  <BlogTitle>
                    <RouterLink to={post.link}>
                      {post.title}
                    </RouterLink>
                  </BlogTitle>

                  <BlogDescription>
                    {post.description}
                  </BlogDescription>

                  <AuthorInfoWrapper>
                    {/* Initially visible - only date */}
                    <DateOnly className="date-only">
                      {post.date}
                    </DateOnly>

                    {/* Shown on hover - full author info (date hides completely) */}
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
                        <AuthorLink href={`/author/${post.author.toLowerCase().replace(' ', '-')}`}>
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

        <PaginationWrapper>
          <StyledPagination
            count={2}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            renderItem={(item) => (
              <PaginationItem
                {...item}
                components={{
                  next: ChevronRightIcon,
                  previous: ChevronLeftIcon
                }}
              />
            )}
          />
        </PaginationWrapper>
      </Container>
    </BlogSection>
  );
};

export default Blog;