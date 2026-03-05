import React from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Pagination,
  PaginationItem,
  useTheme,
  styled,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axios";
import SectionTile from "../../../components/SectionTile";

// Theme colors
const PRIMARY_COLOR = '#5C4D91';
const PRIMARY_DARK = '#4A3D75';

// Styled components for custom hover effects
const BlogSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffffff",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(4, 0),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3, 0),
  },
}));

const BlogCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: "8px",
  overflow: "hidden",
  transition: "all 0.3s ease",
  height: "100%",
  width: "100%",
  boxShadow: "none",
  border: "1px solid #f0f0f0",
  cursor: "pointer",
  position: "relative",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    "& .blog-image": {
      transform: "scale(1.05)",
    },
    "& .blog-category": {
      opacity: 1,
      visibility: "visible",
      transform: "translateY(0)",
    },
    "& .date-only": {
      opacity: 0,
      visibility: "hidden",
      display: "none",
    },
    "& .author-info": {
      opacity: 1,
      visibility: "visible",
      display: "flex",
    },
  },
  // Mobile touch optimization
  [theme.breakpoints.down("sm")]: {
    "&:active": {
      transform: "translateY(-3px)",
      boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    },
  },
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  width: "100%",
  height: "240px",
  [theme.breakpoints.down("sm")]: {
    height: "200px",
  },
  [theme.breakpoints.down("xs")]: {
    height: "180px",
  },
}));

const BlogImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.5s ease",
  pointerEvents: "none",
});

const CategoryTag = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "15px",
  right: "15px",
  backgroundColor: PRIMARY_COLOR,
  color: "#fff",
  padding: "6px 15px",
  borderRadius: "20px",
  fontSize: "14px",
  fontWeight: 500,
  transition: "all 0.3s ease",
  zIndex: 10,
  cursor: "pointer",
  opacity: 0,
  visibility: "hidden",
  transform: "translateY(-10px)",
  "&:hover": {
    backgroundColor: PRIMARY_DARK,
  },
  // Always show category on mobile for better UX
  [theme.breakpoints.down("sm")]: {
    opacity: 1,
    visibility: "visible",
    transform: "translateY(0)",
    padding: "4px 12px",
    fontSize: "12px",
    top: "10px",
    right: "10px",
  },
}));

const BlogContent = styled(Box)(({ theme }) => ({
  padding: "20px 18px",
  position: "relative",
  pointerEvents: "none",
  [theme.breakpoints.down("sm")]: {
    padding: "15px 12px",
  },
}));

const BlogTitle = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: 600,
  marginBottom: "10px",
  lineHeight: 1.4,
  color: "#333",
  [theme.breakpoints.down("sm")]: {
    fontSize: "16px",
    marginBottom: "8px",
  },
}));

const BlogDescription = styled(Typography)(({ theme }) => ({
  color: "#666",
  fontSize: "14px",
  lineHeight: 1.6,
  marginBottom: "15px",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  [theme.breakpoints.down("sm")]: {
    fontSize: "13px",
    marginBottom: "12px",
  },
}));

const AuthorInfoWrapper = styled(Box)({
  position: "relative",
  minHeight: "24px",
});

const DateOnly = styled(Typography)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  transition: "all 0.3s ease",
  opacity: 1,
  visibility: "visible",
  display: "block",
  color: "#999",
  fontSize: "14px",
  fontWeight: 400,
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
    position: "relative",
    opacity: 1,
    visibility: "visible",
    display: "block",
  },
}));

const AuthorInfo = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  alignItems: "center",
  gap: "15px",
  transition: "all 0.3s ease",
  opacity: 0,
  visibility: "hidden",
  display: "none",
  // Show author info on mobile with different layout
  [theme.breakpoints.down("sm")]: {
    position: "relative",
    opacity: 1,
    visibility: "visible",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "5px",
    marginTop: "10px",
  },
}));

const DateText = styled(Typography)(({ theme }) => ({
  color: "#999",
  fontSize: "14px",
  fontWeight: 400,
  whiteSpace: "nowrap",
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
}));

const AuthorLink = styled("span")(({ theme }) => ({
  color: "#333",
  textDecoration: "none",
  fontWeight: 500,
  fontSize: "14px",
  whiteSpace: "nowrap",
  position: "relative",
  cursor: "pointer",
  zIndex: 20,
  pointerEvents: "auto",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-2px",
    left: "0",
    width: "0",
    height: "1px",
    backgroundColor: PRIMARY_COLOR,
    transition: "width 0.3s ease",
  },
  "&:hover::after": {
    width: "100%",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "13px",
    "&::after": {
      display: "none",
    },
  },
}));

const PaginationWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: "50px",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    marginTop: "30px",
  },
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    margin: "0 5px",
    minWidth: "40px",
    height: "40px",
    borderRadius: "40px",
    fontSize: "15px",
    fontWeight: 500,
    color: "#333",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    transition: "all 0.3s ease",
    [theme.breakpoints.down("sm")]: {
      minWidth: "36px",
      height: "36px",
      fontSize: "14px",
      margin: "0 3px",
    },
    "&:hover": {
      backgroundColor: PRIMARY_COLOR,
      color: "#fff",
      borderColor: PRIMARY_COLOR,
    },
    "&.Mui-selected": {
      backgroundColor: PRIMARY_COLOR,
      color: "#fff",
      borderColor: PRIMARY_COLOR,
      "&:hover": {
        backgroundColor: PRIMARY_DARK,
      },
    },
  },
  "& .MuiPaginationItem-previousNext": {
    fontSize: "18px",
    "& svg": {
      fontSize: "20px",
      [theme.breakpoints.down("sm")]: {
        fontSize: "18px",
      },
    },
  },
}));

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "400px",
  width: "100%",
});

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Blog = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const itemsPerPage = 9;

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", page],
    queryFn: async () => {
      const response = await axiosInstance.get(`/blogs?page=${page}&limit=${itemsPerPage}`);
      return response.data;
    },
  });

  const blogs = data?.blogs || [];
  const pagination = data?.pagination || { totalPages: 1 };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCardClick = (post) => {
    navigate(`/blog/${post.title_id}`, { state: { post } });
  };

  const handleAuthorClick = (e, author) => {
    e.stopPropagation();
    navigate(`/author/${author.toLowerCase().replace(/\s+/g, "-")}`);
  };

  const handleCategoryClick = (e, category) => {
    e.stopPropagation();
    navigate(`/category/${category.toLowerCase()}`);
  };

  if (isLoading) {
    return (
      <Box>
        <SectionTile
          bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg"
          subtitle="Blog grid"
          title="Latest news"
          icon={true}
          iconClass="flaticon-custom-icon"
        />
        <BlogSection>
          <Container maxWidth="lg">
            <LoadingContainer>
              <CircularProgress sx={{ color: PRIMARY_COLOR }} />
            </LoadingContainer>
          </Container>
        </BlogSection>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <SectionTile
          bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg"
          subtitle="Blog grid"
          title="Latest news"
          icon={true}
          iconClass="flaticon-custom-icon"
        />
        <BlogSection>
          <Container maxWidth="lg">
            <Typography textAlign="center" color="error">
              Error loading blogs: {error.message}
            </Typography>
          </Container>
        </BlogSection>
      </Box>
    );
  }

  return (
    <Box>
      <SectionTile
        bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg"
        subtitle="Blog grid"
        title="Latest news"
        icon={true}
        iconClass="flaticon-custom-icon"
      />
      <BlogSection sx={{ py: { xs: 5, md: 12 } }}>
        <Container maxWidth="lg">
          {blogs.length === 0 ? (
            <Typography textAlign="center" variant="h6" color="text.secondary">
              No blogs found
            </Typography>
          ) : (
            <>
              <Grid container spacing={isMobile ? 2 : 3}>
                {blogs.map((post) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post._id}>
                    <BlogCard onClick={() => handleCardClick(post)}>
                      <Box className="blog-image-wrapper">
                        <ImageWrapper>
                          <BlogImage
                            src={post.imageUrl || post.image}
                            alt={post.title}
                            className="blog-image"
                            loading="lazy"
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
                        <BlogTitle>{post.title}</BlogTitle>

                        <BlogDescription>
                          {post.excerpt ||
                            post.content
                              ?.replace(/<[^>]*>/g, "")
                              .substring(0, 100) + "..."}
                        </BlogDescription>

                        <AuthorInfoWrapper>
                          {/* Initially visible - only date (hidden on mobile) */}
                          {!isMobile && (
                            <DateOnly className="date-only">
                              {formatDate(post.publishedAt || post.date)}
                            </DateOnly>
                          )}

                          {/* Author info - visible on hover (always visible on mobile) */}
                          <AuthorInfo className="author-info">
                            <DateText variant="body2">
                              {formatDate(post.publishedAt || post.date)}
                            </DateText>
                            {post.author && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#666",
                                    fontSize: isMobile ? "12px" : "14px",
                                  }}
                                >
                                  by
                                </Typography>
                                <AuthorLink
                                  onClick={(e) => handleAuthorClick(e, post.author)}
                                >
                                  {post.author}
                                </AuthorLink>
                              </Box>
                            )}
                          </AuthorInfo>
                        </AuthorInfoWrapper>
                      </BlogContent>
                    </BlogCard>
                  </Grid>
                ))}
              </Grid>

              {/* Show pagination only if total items > 9 */}
              {pagination.totalPages > 1 && (
                <PaginationWrapper>
                  <StyledPagination
                    count={pagination.totalPages}
                    page={page}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                    size={isMobile ? "small" : "medium"}
                    renderItem={(item) => (
                      <PaginationItem
                        {...item}
                        components={{
                          next: ChevronRightIcon,
                          previous: ChevronLeftIcon,
                        }}
                      />
                    )}
                  />
                </PaginationWrapper>
              )}
            </>
          )}
        </Container>
      </BlogSection>
    </Box>
  );
};

export default Blog;