import { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
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
  display: "flex",
  justifyContent: "center",
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
    fontSize: "1.1rem",
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
    width: "60px",
    height: "60px",
    backgroundColor: VIDEO_ICON_COLOR,
    borderRadius: "50%",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s ease",
    "& svg": { fontSize: "40px", color: "#ffffff" },
    "&:hover": { backgroundColor: "#5c4d91" },
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

// ── Pagination matching Blog page exactly ──
const PaginationWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: "50px",
  width: "100%",
  [theme.breakpoints.down("sm")]: { marginTop: "30px" },
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
      "&:hover": { backgroundColor: PRIMARY_DARK },
    },
  },
  "& .MuiPaginationItem-previousNext": {
    fontSize: "18px",
    "& svg": {
      fontSize: "20px",
      [theme.breakpoints.down("sm")]: { fontSize: "18px" },
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
  const itemsPerPage = 7;

  const { data: response, isLoading, error } = useQuery({
    queryKey: ["videos", page],
    queryFn: async () => {
      const res = await axiosInstance.get(`/videos?page=${page}&limit=${itemsPerPage}`);
      return res.data;
    },
  });

  const videos = response?.data || response?.videos || response || [];
  const pagination = response?.pagination || {
    totalPages: Math.ceil((response?.total || videos.length) / itemsPerPage) || 1,
  };

  const handleVideoClick = (video) => { setSelectedVideo(video); setOpen(true); };
  const handleClose = () => { setOpen(false); setSelectedVideo(null); };
  const handlePageChange = (_, value) => { setPage(value); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const firstRowVideos = videos.slice(0, 4);
  const secondRowVideos = videos.slice(4, 7);

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
        <VideoSection sx={{ py: { xs: 5, md: 12 } }}>
          <Container maxWidth="lg">
            <LoadingContainer><CircularProgress sx={{ color: PRIMARY_COLOR }} /></LoadingContainer>
          </Container>
        </VideoSection>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        {header}
        <VideoSection sx={{ py: { xs: 5, md: 12 } }}>
          <Container maxWidth="lg">
            <Typography textAlign="center" color="error">Error loading videos: {error.message}</Typography>
          </Container>
        </VideoSection>
      </Box>
    );
  }

  return (
    <Box>
      {header}
      <VideoSection sx={{ py: { xs: 5, md: 12 } }}>
        <Container maxWidth="lg">
          {!videos || videos.length === 0 ? (
            <Typography textAlign="center" variant="h6" color="text.secondary">No videos found</Typography>
          ) : (
            <>
              <StyledGrid>
                {firstRowVideos.length > 0 && (
                  <FirstRow>
                    {firstRowVideos.map((video) => (
                      <FirstRowCard key={video._id}>
                        <VideoItem onClick={() => handleVideoClick(video)}>
                          <TitleOverlay className="video-title-overlay">
                            <Typography className="title-text">{video.title || "Untitled Video"}</Typography>
                          </TitleOverlay>
                          <img
                            decoding="async"
                            src={getYouTubeThumbnail(video.url)}
                            alt={video.title}
                            onError={(e) => { e.target.src = "https://via.placeholder.com/640x360?text=Video+Thumbnail"; }}
                          />
                          <PlayButton>
                            <a href="#" className="vid" onClick={(e) => e.preventDefault()}>
                              <div className="icon play-icon"><PlayArrowIcon /></div>
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
                            <Typography className="title-text">{video.title || "Untitled Video"}</Typography>
                          </TitleOverlay>
                          <img
                            decoding="async"
                            src={getYouTubeThumbnail(video.url)}
                            alt={video.title}
                            onError={(e) => { e.target.src = "https://via.placeholder.com/640x360?text=Video+Thumbnail"; }}
                          />
                          <PlayButton>
                            <a href="#" className="vid" onClick={(e) => e.preventDefault()}>
                              <div className="icon play-icon"><PlayArrowIcon /></div>
                            </a>
                          </PlayButton>
                        </VideoItem>
                      </SecondRowCard>
                    ))}
                  </SecondRow>
                )}
              </StyledGrid>

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
                        components={{ next: ChevronRightIcon, previous: ChevronLeftIcon }}
                      />
                    )}
                  />
                </PaginationWrapper>
              )}
            </>
          )}

          <StyledDialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <CloseButton onClick={handleClose}><CloseIcon /></CloseButton>
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
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                />
              )}
            </DialogContent>
          </StyledDialog>
        </Container>
      </VideoSection>
    </Box>
  );
}