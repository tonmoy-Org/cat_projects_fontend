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
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import SectionTile from "../../components/SectionTile";
import { useBlogApi } from "../../hooks/useBlogApi";

// Theme colors
const PRIMARY_COLOR = '#5C4D91';
const PRIMARY_DARK = '#4A3D75';
const ACCENT = '#db89ca';

// Styled components
const BlogSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffffff",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  padding: '80px 0',
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3, 0),
  },
}));

const FilterBar = styled(Box)(({ theme }) => ({
  backgroundColor: '#faf8ff',
  border: '1px solid #ede8f7',
  borderRadius: '12px',
  padding: '20px 24px',
  marginBottom: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  [theme.breakpoints.down('sm')]: { padding: '16px', gap: '14px', marginBottom: '20px' },
}));

const FilterRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  alignItems: 'center',
  width: '100%',
  [theme.breakpoints.down('sm')]: { gap: '12px', flexDirection: 'column', alignItems: 'stretch' },
}));

const FilterLabel = styled(Typography)({
  fontSize: '11px',
  fontWeight: 600,
  color: '#999',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
  minWidth: 'max-content',
});

const SearchInput = styled(TextField)(({ theme }) => ({
  flex: '1 1 280px',
  minWidth: '200px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '30px',
    backgroundColor: '#fff',
    fontSize: '13px',
    '& fieldset': { borderColor: '#e0d9f5' },
    '&:hover fieldset': { borderColor: PRIMARY_COLOR },
    '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
  },
  '& input': { padding: '8px 14px' },
  [theme.breakpoints.down('sm')]: { flex: '1 1 100%', width: '100%' },
}));

const CategorySelect = styled(Select)(({ theme }) => ({
  borderRadius: '30px',
  backgroundColor: '#fff',
  fontSize: '13px',
  minWidth: '160px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0d9f5' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY_COLOR },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY_COLOR },
  '& .MuiSelect-select': { padding: '8px 14px' },
  [theme.breakpoints.down('sm')]: { width: '100%', minWidth: 'unset' },
}));

const ActiveFiltersRow = styled(Box)({ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '14px' });

const BlogCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: "3px",
  overflow: "hidden",
  transition: "all 0.3s ease",
  height: "100%",
  width: "100%",
  boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
  border: "1px solid #f0f0f0",
  cursor: "pointer",
  position: "relative",
  "&:hover": {
    boxShadow: "0 8px 24px rgba(0,0,0,0.11)",
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
    },
    "& .author-info": {
      opacity: 1,
      visibility: "visible",
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& .blog-category": {
      opacity: 1,
      visibility: "visible",
      transform: "translateY(0)",
    },
    "& .author-info": {
      opacity: 1,
      visibility: "visible",
    },
  },
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  width: "100%",
  height: "220px",
  [theme.breakpoints.down("sm")]: {
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
  top: "12px",
  right: "12px",
  backgroundColor: PRIMARY_COLOR,
  color: "#fff",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "11px",
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
  [theme.breakpoints.down("sm")]: {
    opacity: 1,
    visibility: "visible",
    transform: "translateY(0)",
    padding: "4px 10px",
    fontSize: "10px",
  },
}));

const BlogContent = styled(Box)(({ theme }) => ({
  padding: "16px",
  position: "relative",
  pointerEvents: "none",
  [theme.breakpoints.down("sm")]: {
    padding: "12px",
  },
}));

const BlogTitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 600,
  marginBottom: "8px",
  lineHeight: 1.4,
  color: "#333",
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
    marginBottom: "6px",
  },
}));

const BlogDescription = styled(Typography)(({ theme }) => ({
  color: "#666",
  fontSize: "13px",
  lineHeight: 1.5,
  marginBottom: "12px",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
    marginBottom: "10px",
  },
}));

const MetaWrapper = styled(Box)({
  position: "relative",
  minHeight: "20px",
});

const DateOnly = styled(Typography)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  transition: "all 0.3s ease",
  opacity: 1,
  visibility: "visible",
  color: "#999",
  fontSize: "12px",
  [theme.breakpoints.down("sm")]: {
    position: "relative",
    opacity: 1,
    visibility: "visible",
  },
}));

const AuthorInfo = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  alignItems: "center",
  gap: "8px",
  transition: "all 0.3s ease",
  opacity: 0,
  visibility: "hidden",
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    position: "relative",
    opacity: 1,
    visibility: "visible",
    marginTop: "8px",
  },
}));

const AuthorLink = styled("span")(({ theme }) => ({
  color: PRIMARY_COLOR,
  textDecoration: "none",
  fontWeight: 500,
  fontSize: "12px",
  cursor: "pointer",
  pointerEvents: "auto",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const PaginationWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: "48px",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    marginTop: "32px",
  },
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    margin: "0 5px",
    minWidth: "36px",
    height: "36px",
    borderRadius: "36px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#333",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    transition: "all 0.3s ease",
    [theme.breakpoints.down("sm")]: {
      minWidth: "32px",
      height: "32px",
      fontSize: "12px",
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
}));

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "400px",
  width: "100%",
});

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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const { useBlogs } = useBlogApi();
  const {
    blogs,
    paginatedBlogs,
    pagination,
    totalPages,
    page,
    setPage,
    search,
    setSearch,
    category,
    setCategory,
    categoryOptions,
    activeFilters,
    isLoading,
    error,
    handleBlogClick,
    handleRefresh,
    clearFilters,
  } = useBlogs();

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuthorClick = (e, author) => {
    e.stopPropagation();
    navigate(`/author/${author.toLowerCase().replace(/\s+/g, "-")}`);
  };

  const handleCategoryClick = (e, categoryName) => {
    e.stopPropagation();
    setCategory(categoryName);
  };

  const clearFilter = (key) => {
    if (key === 'search') setSearch('');
    if (key === 'category') setCategory('All');
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
            <Typography textAlign="center" color="error" sx={{ py: 4 }}>
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
      <BlogSection>
        <Container maxWidth="lg">
          {/* Filter Bar */}
          <FilterBar>
            <FilterRow>
              <SearchInput
                placeholder="Search blogs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '16px', color: '#bbb' }} /></InputAdornment>,
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <CloseIcon sx={{ fontSize: '14px', color: '#bbb', cursor: 'pointer' }} onClick={() => setSearch('')} />
                    </InputAdornment>
                  ) : null,
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1' }}>
                <FilterLabel>Category</FilterLabel>
                <FormControl size="small" sx={{ flex: '1', minWidth: '140px' }}>
                  <CategorySelect value={category} onChange={e => setCategory(e.target.value)} displayEmpty>
                    {categoryOptions.map(c => <MenuItem key={c} value={c} sx={{ fontSize: '13px' }}>{c}</MenuItem>)}
                  </CategorySelect>
                </FormControl>
              </Box>
            </FilterRow>
          </FilterBar>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <ActiveFiltersRow>
              <Typography sx={{ fontSize: '11px', color: '#999', mr: '4px' }}>Active:</Typography>
              {activeFilters.map(f => (
                <Chip 
                  key={f.key} 
                  label={f.label} 
                  size="small" 
                  onDelete={() => clearFilter(f.key)}
                  sx={{ backgroundColor: '#f0ecfb', color: PRIMARY_COLOR, fontWeight: 500, fontSize: '11px', height: '22px' }}
                />
              ))}
              <Button 
                size="small" 
                onClick={clearFilters}
                sx={{ fontSize: '11px', color: PRIMARY_COLOR, textTransform: 'none', fontWeight: 500 }}
              >
                Clear All
              </Button>
            </ActiveFiltersRow>
          )}

          {/* Results Count */}
          <Typography sx={{ fontSize: '12px', color: '#999', mb: '14px' }}>
            Showing {paginatedBlogs.length} of {pagination.totalBlogs || 0} blog{pagination.totalBlogs !== 1 ? 's' : ''}
          </Typography>

          {/* Blog Grid */}
          {paginatedBlogs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ fontSize: '14px', color: '#666', mb: 2 }}>
                No blogs match your filters
              </Typography>
              <Button 
                onClick={clearFilters} 
                variant="outlined"
                sx={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
              >
                Clear All Filters
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={isMobile ? 2 : 3}>
                {paginatedBlogs.map((post) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post._id}>
                    <BlogCard onClick={() => handleBlogClick(post)}>
                      <ImageWrapper>
                        <BlogImage
                          src={post.imageUrl || post.image}
                          alt={post.title}
                          className="blog-image"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                          }}
                        />
                        <CategoryTag
                          className="blog-category"
                          onClick={(e) => handleCategoryClick(e, post.category)}
                        >
                          {post.category}
                        </CategoryTag>
                      </ImageWrapper>

                      <BlogContent>
                        <BlogTitle>{post.title}</BlogTitle>
                        <BlogDescription>
                          {post.excerpt ||
                            post.content
                              ?.replace(/<[^>]*>/g, "")
                              .substring(0, 100) + "..."}
                        </BlogDescription>

                        <MetaWrapper>
                          {!isMobile && (
                            <DateOnly className="date-only">
                              {formatDate(post.publishedAt || post.date)}
                            </DateOnly>
                          )}
                          <AuthorInfo className="author-info">
                            <Typography sx={{ color: '#999', fontSize: '11px' }}>
                              {formatDate(post.publishedAt || post.date)}
                            </Typography>
                            {post.author && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Typography sx={{ color: '#999', fontSize: '11px' }}>by</Typography>
                                <AuthorLink onClick={(e) => handleAuthorClick(e, post.author)}>
                                  {post.author}
                                </AuthorLink>
                              </Box>
                            )}
                          </AuthorInfo>
                        </MetaWrapper>
                      </BlogContent>
                    </BlogCard>
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