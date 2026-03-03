// BlogDetail.jsx
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Avatar,
  IconButton,
} from '@mui/material';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ReplyIcon from '@mui/icons-material/Reply';
import PetsIcon from '@mui/icons-material/Pets';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Theme colors
const primaryColor = '#ff6b6b';
const textColor = '#666';

// Styled components for main content
const BlogDetailSection = styled(Box)({
  backgroundColor: '#ffffff',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '80px 0',
});

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
  borderRadius: '8px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

const CommentSection = styled(Box)({
  marginTop: '50px',
  paddingTop: '30px',
  borderTop: '1px solid #f0f0f0',
});

const CommentCard = styled(Box)({
  display: 'flex',
  gap: '20px',
  padding: '30px',
  backgroundColor: '#f9f9f9',
  borderRadius: '10px',
  marginBottom: '30px',
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    padding: '20px',
  },
});

const CommentAvatar = styled(Avatar)({
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  border: '3px solid #fff',
  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
});

const CommentContent = styled(Box)({
  flex: 1,
});

const CommentHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
  flexWrap: 'wrap',
  gap: '10px',
});

const CommentAuthor = styled(Typography)({
  fontSize: '18px',
  fontWeight: 600,
  color: '#333',
});

const CommentDate = styled(Typography)({
  fontSize: '14px',
  color: '#999',
});

const CommentText = styled(Typography)({
  fontSize: '15px',
  color: textColor,
  lineHeight: 1.7,
  marginBottom: '15px',
});

const ReplyButton = styled(Button)({
  color: primaryColor,
  padding: '5px 0',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'transparent',
    textDecoration: 'underline',
  },
  '& svg': {
    marginRight: '5px',
    fontSize: '16px',
  },
});

const CommentFormWrapper = styled(Box)({
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0',
});

const FormTitle = styled(Typography)({
  fontSize: '24px',
  fontWeight: 600,
  color: '#333',
  marginBottom: '30px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '0',
    width: '50px',
    height: '3px',
    backgroundColor: primaryColor,
  },
});

const StyledTextField = styled(TextField)({
  marginBottom: '20px',
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#ccc',
    },
    '&.Mui-focused fieldset': {
      borderColor: primaryColor,
    }
  },
  '& .MuiInputBase-input': {
    padding: '14px 14px',
    fontSize: '15px',
  },
});

const StyledCheckbox = styled(Checkbox)({
  color: '#ccc',
  '&.Mui-checked': {
    color: primaryColor,
  },
});

const SubmitButton = styled(Button)({
  backgroundColor: primaryColor,
  color: '#fff',
  padding: '14px 30px',
  fontSize: '16px',
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: '8px',
  boxShadow: 'none',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: '#ff5252',
    boxShadow: '0 5px 20px rgba(255,107,107,0.3)',
  },
});

// Latest News Section Styled Components
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
  '&:hover': {
    backgroundColor: '#ff5252',
  }
}));

const CardContent = styled(Box)({
  padding: '20px 18px',
});

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
  '&:hover::after': {
    width: '100%',
  }
});

const NavButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: '#fff',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  zIndex: 10,
});

const PrevButton = styled(NavButton)({
  left: '0',
});

const NextButton = styled(NavButton)({
  right: '0',
});

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
  '&:hover': {
    backgroundColor: active ? primaryColor : '#ccc',
  },
}));

// Blog data
const blogPosts = [
  {
    id: 1,
    title: "Pet dental care",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    fullContent: [
      "Quisque pretium fermentum quam, sit amet cursus ante sollicitudin vel. Morbi consequat risus consequat, porttitor orci sit amet, iaculis nisl. Integer quis sapien nec elit ultrices euismon sit amet id lacus. Sed a imperdiet erat. Duis eu est dignissim lacus dictum hendrerit quis vitae mi. Fusce eu nulla ac nisi cursus tincidunt. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer tristique sem eget leo faucibus porttiton.",
      "Nulla vitae metus tincidunt, varius nunc quis, porta nulla. Pellentesque vel dui nec libero auctor pretium id sed arcu. Nunc consequat diam id nisl blandit dignissim. Etiam commodo diam dolor, at scelerisque sem finibus sit amet. Curabitur id lectus eget purus finibus laoreet."
    ],
    date: "13 Mar 2025",
    author: "Lily Duru",
    category: "Care",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/01.jpg",
    gallery: [
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/01.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/07.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/08.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/09.jpg',
    ],
    slug: "pet-dental-care"
  },
  {
    id: 2,
    title: "Dog grooming styles",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    fullContent: [
      "Quisque pretium fermentum quam, sit amet cursus ante sollicitudin vel. Morbi consequat risus consequat, porttitor orci sit amet, iaculis nisl. Integer quis sapien nec elit ultrices euismon sit amet id lacus. Sed a imperdiet erat. Duis eu est dignissim lacus dictum hendrerit quis vitae mi. Fusce eu nulla ac nisi cursus tincidunt. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer tristique sem eget leo faucibus porttiton.",
      "Nulla vitae metus tincidunt, varius nunc quis, porta nulla. Pellentesque vel dui nec libero auctor pretium id sed arcu. Nunc consequat diam id nisl blandit dignissim. Etiam commodo diam dolor, at scelerisque sem finibus sit amet. Curabitur id lectus eget purus finibus laoreet."
    ],
    date: "13 Mar 2025",
    author: "Frank White",
    category: "Pet",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/06.jpg",
    gallery: [
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/06.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/07.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/08.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/09.jpg',
    ],
    slug: "dog-grooming-styles"
  },
  {
    id: 3,
    title: "Pet safety tips",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    fullContent: [
      "Quisque pretium fermentum quam, sit amet cursus ante sollicitudin vel. Morbi consequat risus consequat, porttitor orci sit amet, iaculis nisl. Integer quis sapien nec elit ultrices euismon sit amet id lacus. Sed a imperdiet erat. Duis eu est dignissim lacus dictum hendrerit quis vitae mi. Fusce eu nulla ac nisi cursus tincidunt. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer tristique sem eget leo faucibus porttiton.",
      "Nulla vitae metus tincidunt, varius nunc quis, porta nulla. Pellentesque vel dui nec libero auctor pretium id sed arcu. Nunc consequat diam id nisl blandit dignissim. Etiam commodo diam dolor, at scelerisque sem finibus sit amet. Curabitur id lectus eget purus finibus laoreet."
    ],
    date: "13 Mar 2025",
    author: "Olivia Dan",
    category: "Dental",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/03.jpg",
    gallery: [
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/03.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/07.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/08.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/09.jpg',
    ],
    slug: "pet-safety-tips"
  },
  {
    id: 4,
    title: "Pet parasites",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    fullContent: [
      "Quisque pretium fermentum quam, sit amet cursus ante sollicitudin vel. Morbi consequat risus consequat, porttitor orci sit amet, iaculis nisl. Integer quis sapien nec elit ultrices euismon sit amet id lacus. Sed a imperdiet erat. Duis eu est dignissim lacus dictum hendrerit quis vitae mi. Fusce eu nulla ac nisi cursus tincidunt. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer tristique sem eget leo faucibus porttiton.",
      "Nulla vitae metus tincidunt, varius nunc quis, porta nulla. Pellentesque vel dui nec libero auctor pretium id sed arcu. Nunc consequat diam id nisl blandit dignissim. Etiam commodo diam dolor, at scelerisque sem finibus sit amet. Curabitur id lectus eget purus finibus laoreet."
    ],
    date: "13 Mar 2025",
    author: "Frank White",
    category: "Surgery",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/04.jpg",
    gallery: [
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/04.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/07.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/08.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/09.jpg',
    ],
    slug: "pet-parasites"
  },
  {
    id: 5,
    title: "Puppy sleeping habits",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    fullContent: [
      "Quisque pretium fermentum quam, sit amet cursus ante sollicitudin vel. Morbi consequat risus consequat, porttitor orci sit amet, iaculis nisl. Integer quis sapien nec elit ultrices euismon sit amet id lacus. Sed a imperdiet erat. Duis eu est dignissim lacus dictum hendrerit quis vitae mi. Fusce eu nulla ac nisi cursus tincidunt. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer tristique sem eget leo faucibus porttiton.",
      "Nulla vitae metus tincidunt, varius nunc quis, porta nulla. Pellentesque vel dui nec libero auctor pretium id sed arcu. Nunc consequat diam id nisl blandit dignissim. Etiam commodo diam dolor, at scelerisque sem finibus sit amet. Curabitur id lectus eget purus finibus laoreet."
    ],
    date: "13 Mar 2025",
    author: "Lily Duru",
    category: "Diagnostic",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/05.jpg",
    gallery: [
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/05.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/07.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/08.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/09.jpg',
    ],
    slug: "puppy-sleeping-habits"
  },
  {
    id: 6,
    title: "Cat microchipping",
    description: "Lorem ipsum quisque sodales miss the varius rana duru fermen.",
    fullContent: [
      "Quisque pretium fermentum quam, sit amet cursus ante sollicitudin vel. Morbi consequat risus consequat, porttitor orci sit amet, iaculis nisl. Integer quis sapien nec elit ultrices euismon sit amet id lacus. Sed a imperdiet erat. Duis eu est dignissim lacus dictum hendrerit quis vitae mi. Fusce eu nulla ac nisi cursus tincidunt. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer tristique sem eget leo faucibus porttiton.",
      "Nulla vitae metus tincidunt, varius nunc quis, porta nulla. Pellentesque vel dui nec libero auctor pretium id sed arcu. Nunc consequat diam id nisl blandit dignissim. Etiam commodo diam dolor, at scelerisque sem finibus sit amet. Curabitur id lectus eget purus finibus laoreet."
    ],
    date: "12 Mar 2025",
    author: "Olivia Dan",
    category: "Safety",
    image: "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/02.jpg",
    gallery: [
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/02.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/07.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/08.jpg',
      'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/09.jpg',
    ],
    slug: "cat-microchipping"
  }
];

const BlogDetail = () => {
  const location = useLocation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get post from state (when coming from card click) or find by slug (when direct URL)
  let post = location.state?.post;

  // If no post in state (direct URL access), find by slug
  if (!post) {
    post = blogPosts.find(p => p.slug === slug);
  }

  // Filter out current post and get other posts for carousel
  const otherPosts = blogPosts.filter(p => p.slug !== slug);
  const cardsPerView = 3;
  const totalSlides = Math.ceil(otherPosts.length / cardsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handleCardClick = (post) => {
    navigate(`/blog/${post.slug}`, { state: { post } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get current cards to display
  const startIndex = currentIndex * cardsPerView;
  const visibleCards = otherPosts.slice(startIndex, startIndex + cardsPerView);

  // If still no post found, show error
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

  // Sample comment data
  const comment = {
    author: "Emma Emily",
    date: "March 13, 2025",
    text: "Lorem in the ultricies nibh non dolor miss miss inte molliser faubs neque the dunte aliquam eraten in the teore. Fusce eu nulla ac nisi cursus tincidunt. Interdum et malesuada fames ac ante ipsum primis in faucibus.",
    avatar: "https://secure.gravatar.com/avatar/58fdddf10d345cc42e4ec0f7c5b747cb750d415be93f0618aecaa03b269f0316?s=100&d=mm&r=g"
  };

  return (
    <BlogDetailSection>
      <Container maxWidth="lg">
        <Grid container justifyContent="center">
          <Grid size={{ xs: 12, md: 10 }}>
            <Box className="post-content">
              {/* Blog Title */}
              <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
                {post.title}
              </Typography>

              {/* Blog Meta Info */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4, color: '#999', flexWrap: 'wrap' }}>
                <Typography>By {post.author}</Typography>
                <Typography>•</Typography>
                <Typography>{post.date}</Typography>
                <Typography>•</Typography>
                <Typography>{post.category}</Typography>
              </Box>

              {/* Blog Content */}
              <Box className="col-md-12" sx={{ mb: 4 }}>
                {post.fullContent.map((paragraph, index) => (
                  <ContentText key={index} paragraph>
                    {paragraph}
                  </ContentText>
                ))}
              </Box>

              {/* Gallery Section */}
              <GalleryWrapper>
                <Grid container spacing={3}>
                  {post.gallery.map((image, index) => (
                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                      <Box className="gallery-masonry-wrapper">
                        <a href={image} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <Box className="gallery-box">
                            <Box className="gallery-img">
                              <GalleryImage
                                src={image}
                                alt={`Gallery ${index + 1}`}
                                className="img-fluid"
                              />
                            </Box>
                          </Box>
                        </a>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </GalleryWrapper>

              {/* Comment Section */}
              <CommentSection>
                <Grid container spacing={4}>
                  {/* Comment Card */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CommentCard>
                      <CommentAvatar
                        src={comment.avatar}
                        alt={comment.author}
                      />
                      <CommentContent>
                        <CommentHeader>
                          <CommentAuthor>{comment.author}</CommentAuthor>
                          <CommentDate>{comment.date}</CommentDate>
                        </CommentHeader>
                        <CommentText>
                          {comment.text}
                        </CommentText>
                      </CommentContent>
                    </CommentCard>
                  </Grid>
                </Grid>
              </CommentSection>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Latest News Section with Carousel */}
      <LatestNewsSection>
        <Container maxWidth="lg">
          {/* Section Header */}
          <Grid container justifyContent="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <SectionHeaderWrapper>
                <SectionIconWrapper>
                  <PetsIcon sx={{ color: '#fff', fontSize: 20 }} />
                </SectionIconWrapper>
                <SectionSubtitle>
                  Latest News
                </SectionSubtitle>
                <SectionTitle>
                  Browse articles & news.
                </SectionTitle>
              </SectionHeaderWrapper>
            </Grid>
          </Grid>

          {/* Carousel */}
          <CarouselContainer>
            <Box sx={{ overflow: 'hidden' }}>
              <CardsWrapper>
                {visibleCards.map((post) => (
                  <CardWrapper key={post.id}>
                    <BlogCard onClick={() => handleCardClick(post)}>
                      <CardImageWrapper>
                        <CardImage
                          src={post.image}
                          alt={post.title}
                          className="blog-image"
                        />
                        <CardCategory className="blog-category">
                          {post.category}
                        </CardCategory>
                      </CardImageWrapper>
                      <CardContent>
                        <CardTitle>
                          {post.title}
                        </CardTitle>
                        <CardDescription>
                          {post.description}
                        </CardDescription>
                        <CardMeta>
                          {/* Initially visible - only date */}
                          <CardDate className="date-only">{post.date}</CardDate>

                          {/* Shown on hover - full author info */}
                          <Box className="author-info" sx={{
                            display: 'none',
                            alignItems: 'center',
                            gap: '4px',
                            opacity: 0,
                            transition: 'all 0.3s ease'
                          }}>
                            <Typography sx={{ color: '#999', fontSize: '13px' }}>by</Typography>
                            <CardAuthor>
                              {post.author}
                            </CardAuthor>
                          </Box>
                        </CardMeta>
                      </CardContent>
                    </BlogCard>
                  </CardWrapper>
                ))}
              </CardsWrapper>
            </Box>
          </CarouselContainer>

          {/* Carousel Dots */}
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
      </LatestNewsSection>
    </BlogDetailSection>
  );
};

export default BlogDetail;