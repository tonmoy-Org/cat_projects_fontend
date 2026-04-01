import { useState, useMemo } from "react";
import {
  Container,
  Box,
  Typography,
  Dialog,
  DialogContent,
  Pagination,
  PaginationItem,
  styled,
  useTheme,
  useMediaQuery,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Chip,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import SectionTile from "../../components/SectionTile";

const PRIMARY_COLOR = "#5C4D91";
const PRIMARY_DARK = "#4A3D75";
const VIDEO_ICON_COLOR = "#db89ca";
const VIDEO_ICON_DARK = "#c06bb0";

const VideoSection = styled(Box)({
  backgroundColor: "#ffffff",
  width: "100%",
  padding: '80px 0',
  display: "flex",
  justifyContent: "center",
});

// Filter Bar Styles
const FilterBar = styled(Box)(({ theme }) => ({
  backgroundColor: '#faf8ff',
  border: '1px solid #ede8f7',
  borderRadius: '12px',
  padding: '20px 24px',
  marginBottom: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  [theme.breakpoints.down('sm')]: { 
    padding: '16px', 
    gap: '14px', 
    marginBottom: '20px' 
  },
}));

const FilterRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  alignItems: 'center',
  width: '100%',
  [theme.breakpoints.down('sm')]: { 
    gap: '12px', 
    flexDirection: 'column', 
    alignItems: 'stretch' 
  },
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
    fontSize: '12px',
    '& fieldset': { borderColor: '#e0d9f5' },
    '&:hover fieldset': { borderColor: PRIMARY_COLOR },
    '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
  },
  '& input': { padding: '8px 14px', fontSize: '12px' },
  [theme.breakpoints.down('sm')]: { flex: '1 1 100%', width: '100%' },
}));

const CategorySelect = styled(Select)(({ theme }) => ({
  borderRadius: '30px',
  backgroundColor: '#fff',
  fontSize: '12px',
  minWidth: '160px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0d9f5' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY_COLOR },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY_COLOR },
  '& .MuiSelect-select': { padding: '8px 14px', fontSize: '12px' },
  [theme.breakpoints.down('sm')]: { width: '100%', minWidth: 'unset' },
}));

const ActiveFiltersRow = styled(Box)({ 
  display: 'flex', 
  flexWrap: 'wrap', 
  gap: '8px', 
  alignItems: 'center', 
  marginBottom: '14px' 
});

const VideoItem = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  borderRadius: "16px",
  cursor: "pointer",
  transition: "box-shadow 0.3s ease",
  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  "&:hover": {
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    "& .play-icon": { backgroundColor: VIDEO_ICON_DARK },
    "& img": { transform: "scale(1.08)" },
    "& .video-title-overlay": { opacity: 1, transform: "translateY(0)" },
  },
  "& img": {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
    transition: "transform 0.6s ease",
  },
});

const TitleOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  padding: "16px 20px",
  background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)",
  color: "#ffffff",
  zIndex: 5,
  opacity: 0,
  transform: "translateY(-10px)",
  transition: "opacity 0.3s ease, transform 0.3s ease",
  "& .title-text": {
    fontWeight: 600,
    fontSize: "0.9rem",
    lineHeight: 1.3,
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
});

const PlayButton = styled(Box)({
  position: "absolute",
  bottom: "20px",
  left: "20px",
  zIndex: 10,
  "& .vid": { display: "inline-block", textDecoration: "none" },
  "& .icon": {
    width: "50px",
    height: "50px",
    backgroundColor: VIDEO_ICON_COLOR,
    borderRadius: "50%",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s ease",
    "& svg": { fontSize: "32px", color: "#ffffff" },
    "&:hover": { backgroundColor: "#5c4d91" },
  },
  [theme => theme.breakpoints.down("sm")]: {
    "& .icon": {
      width: "40px",
      height: "40px",
      padding: "12px",
      "& svg": { fontSize: "24px" },
    },
  },
});

const StyledGrid = styled(Box)({ display: "flex", flexDirection: "column", gap: "40px" });

const Row = styled(Box)({ display: "grid", gap: "30px", width: "100%" });

const FirstRow = styled(Row)(({ theme }) => ({
  gridTemplateColumns: "repeat(4, 1fr)",
  [theme.breakpoints.down("lg")]: { gridTemplateColumns: "repeat(2, 1fr)" },
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "repeat(1, 1fr)" },
}));

const SecondRow = styled(Row)(({ theme }) => ({
  gridTemplateColumns: "repeat(3, 1fr)",
  [theme.breakpoints.down("lg")]: { gridTemplateColumns: "repeat(2, 1fr)" },
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "repeat(1, 1fr)" },
}));

const FirstRowCard = styled(Box)({ aspectRatio: "4/3", width: "100%" });
const SecondRowCard = styled(Box)({ aspectRatio: "16/9", width: "100%" });

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    width: "90vw",
    maxWidth: "1200px",
    height: "80vh",
    backgroundColor: "#000",
    position: "relative",
  },
  "& .MuiDialogContent-root": { padding: 0, backgroundColor: "#000" },
});

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: "10px",
  right: "10px",
  zIndex: 10,
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  color: "#000",
  "&:hover": { backgroundColor: "#ffffff" },
});

const PaginationWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: "48px",
  width: "100%",
  [theme.breakpoints.down("sm")]: { marginTop: "32px" },
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    margin: "0 5px",
    minWidth: "36px",
    height: "36px",
    borderRadius: "36px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#333",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    transition: "all 0.3s ease",
    [theme.breakpoints.down("sm")]: {
      minWidth: "32px",
      height: "32px",
      fontSize: "11px",
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
      "&:hover": { backgroundColor: PRIMARY_DARK },
    },
  },
  "& .MuiPaginationItem-previousNext": {
    fontSize: "14px",
    "& svg": {
      fontSize: "18px",
      [theme.breakpoints.down("sm")]: { fontSize: "16px" },
    },
  },
}));

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "500px",
  width: "100%",
});

const ResultsCount = styled(Typography)({
  fontSize: "12px",
  color: "#999",
  marginBottom: "14px",
});

const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeId(url);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : "https://via.placeholder.com/640x360?text=No+Thumbnail";
};

const getEmbedUrl = (url) => {
  const videoId = getYouTubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
};

const sectionBg = "https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/2.jpg";

export default function Video() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const itemsPerPage = 7;

  const { data: response, isLoading, error } = useQuery({
    queryKey: ["videos", page],
    queryFn: async () => {
      const res = await axiosInstance.get(`/videos?page=${page}&limit=${itemsPerPage}`);
      return res.data;
    },
  });

  const videos = response?.data || response?.videos || response || [];
  const totalVideosFromServer = response?.total || 0;

  // Extract unique categories from videos
  const categoryOptions = useMemo(() => {
    const categories = videos.map(video => video.category).filter(Boolean);
    return ["All", ...new Set(categories)];
  }, [videos]);

  // Filter videos based on search and category
  const filteredVideos = useMemo(() => {
    let filtered = [...videos];
    
    if (search) {
      filtered = filtered.filter(video =>
        video.title?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category !== "All") {
      filtered = filtered.filter(video => video.category === category);
    }
    
    return filtered;
  }, [videos, search, category]);

  // Get active filters
  const activeFilters = useMemo(() => {
    const filters = [];
    if (search) filters.push({ key: 'search', label: `Search: ${search}` });
    if (category !== "All") filters.push({ key: 'category', label: `Category: ${category}` });
    return filters;
  }, [search, category]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setPage(1);
  };

  const clearFilter = (key) => {
    if (key === 'search') setSearch('');
    if (key === 'category') setCategory('All');
    setPage(1);
  };

  const handleVideoClick = (video) => { 
    setSelectedVideo(video); 
    setOpen(true); 
  };
  
  const handleClose = () => { 
    setOpen(false); 
    setSelectedVideo(null); 
  };
  
  const handlePageChange = (_, value) => { 
    setPage(value); 
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  };

  // Get total pages from server response
  const totalPages = response?.pagination?.totalPages || Math.ceil(totalVideosFromServer / itemsPerPage) || 1;
  
  // Split filtered videos into rows (only for display, not for pagination)
  const firstRowVideos = filteredVideos.slice(0, 4);
  const secondRowVideos = filteredVideos.slice(4, 7);

  const header = (
    <SectionTile
      bgImage={sectionBg}
      subtitle="Our Services"
      title="What We Offer"
      icon={true}
      iconClass="flaticon-custom-icon"
    />
  );

  if (isLoading) {
    return (
      <Box>
        {header}
        <VideoSection>
          <Container maxWidth="lg">
            <LoadingContainer>
              <CircularProgress sx={{ color: PRIMARY_COLOR }} />
            </LoadingContainer>
          </Container>
        </VideoSection>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        {header}
        <VideoSection>
          <Container maxWidth="lg">
            <Typography textAlign="center" color="error" sx={{ fontSize: '0.9rem' }}>
              Error loading videos: {error.message}
            </Typography>
          </Container>
        </VideoSection>
      </Box>
    );
  }

  return (
    <Box>
      {header}
      <VideoSection>
        <Container maxWidth="lg">
          {/* Filter Bar */}
          <FilterBar>
            <FilterRow>
              <SearchInput
                placeholder="Search videos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: '16px', color: '#bbb' }} />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <CloseIcon 
                        sx={{ fontSize: '14px', color: '#bbb', cursor: 'pointer' }} 
                        onClick={() => setSearch('')} 
                      />
                    </InputAdornment>
                  ) : null,
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1' }}>
                <FilterLabel>Category</FilterLabel>
                <FormControl size="small" sx={{ flex: '1', minWidth: '140px' }}>
                  <CategorySelect 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    displayEmpty
                  >
                    {categoryOptions.map(c => (
                      <MenuItem key={c} value={c} sx={{ fontSize: '12px' }}>
                        {c}
                      </MenuItem>
                    ))}
                  </CategorySelect>
                </FormControl>
              </Box>
            </FilterRow>
          </FilterBar>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <ActiveFiltersRow>
              <Typography sx={{ fontSize: '11px', color: '#999', mr: '4px' }}>
                Active:
              </Typography>
              {activeFilters.map(f => (
                <Chip 
                  key={f.key} 
                  label={f.label} 
                  size="small" 
                  onDelete={() => clearFilter(f.key)}
                  sx={{ 
                    backgroundColor: '#f0ecfb', 
                    color: PRIMARY_COLOR, 
                    fontWeight: 500, 
                    fontSize: '11px', 
                    height: '22px' 
                  }}
                />
              ))}
              <Button 
                size="small" 
                onClick={clearFilters}
                sx={{ 
                  fontSize: '11px', 
                  color: PRIMARY_COLOR, 
                  textTransform: 'none', 
                  fontWeight: 500 
                }}
              >
                Clear All
              </Button>
            </ActiveFiltersRow>
          )}

          {/* Results Count */}
          <ResultsCount>
            Showing {filteredVideos.length} of {totalVideosFromServer} video{totalVideosFromServer !== 1 ? 's' : ''}
          </ResultsCount>

          {/* Video Grid */}
          {filteredVideos.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ fontSize: '14px', color: '#666', mb: 2 }}>
                No videos match your filters
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
              <StyledGrid>
                {firstRowVideos.length > 0 && (
                  <FirstRow>
                    {firstRowVideos.map((video) => (
                      <FirstRowCard key={video._id}>
                        <VideoItem onClick={() => handleVideoClick(video)}>
                          <TitleOverlay className="video-title-overlay">
                            <Typography className="title-text">
                              {video.title || "Untitled Video"}
                            </Typography>
                          </TitleOverlay>
                          <img
                            decoding="async"
                            src={getYouTubeThumbnail(video.url)}
                            alt={video.title}
                            onError={(e) => { 
                              e.target.src = "https://via.placeholder.com/640x360?text=Video+Thumbnail"; 
                            }}
                          />
                          <PlayButton>
                            <a href="#" className="vid" onClick={(e) => e.preventDefault()}>
                              <div className="icon play-icon">
                                <PlayArrowIcon />
                              </div>
                            </a>
                          </PlayButton>
                        </VideoItem>
                      </FirstRowCard>
                    ))}
                  </FirstRow>
                )}

                {secondRowVideos.length > 0 && (
                  <SecondRow>
                    {secondRowVideos.map((video) => (
                      <SecondRowCard key={video._id}>
                        <VideoItem onClick={() => handleVideoClick(video)}>
                          <TitleOverlay className="video-title-overlay">
                            <Typography className="title-text">
                              {video.title || "Untitled Video"}
                            </Typography>
                          </TitleOverlay>
                          <img
                            decoding="async"
                            src={getYouTubeThumbnail(video.url)}
                            alt={video.title}
                            onError={(e) => { 
                              e.target.src = "https://via.placeholder.com/640x360?text=Video+Thumbnail"; 
                            }}
                          />
                          <PlayButton>
                            <a href="#" className="vid" onClick={(e) => e.preventDefault()}>
                              <div className="icon play-icon">
                                <PlayArrowIcon />
                              </div>
                            </a>
                          </PlayButton>
                        </VideoItem>
                      </SecondRowCard>
                    ))}
                  </SecondRow>
                )}
              </StyledGrid>

              {/* Pagination - Always show when total pages > 1 */}
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
                          previous: ChevronLeftIcon 
                        }}
                      />
                    )}
                  />
                </PaginationWrapper>
              )}
            </>
          )}

          <StyledDialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <CloseButton onClick={handleClose}>
              <CloseIcon />
            </CloseButton>
            <DialogContent>
              {selectedVideo && (
                <iframe
                  src={getEmbedUrl(selectedVideo.url)}
                  title={selectedVideo.title}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ 
                    position: "absolute", 
                    top: 0, 
                    left: 0, 
                    width: "100%", 
                    height: "100%" 
                  }}
                />
              )}
            </DialogContent>
          </StyledDialog>
        </Container>
      </VideoSection>
    </Box>
  );
}