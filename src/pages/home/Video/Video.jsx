import { useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogContent,
  styled,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axios";
import SectionTile from "../../../components/SectionTile";

const VideoSection = styled(Box)({
  backgroundColor: "#ffffff",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  py: 6,
});

const VideoCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  border: "1px solid #f0f0f0",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    "& .play-icon": {
      opacity: 1,
      transform: "translate(-50%, -50%) scale(1)",
    },
    "& .video-thumbnail": {
      transform: "scale(1.05)",
    },
  },
}));

const ThumbnailWrapper = styled(Box)({
  position: "relative",
  overflow: "hidden",
  paddingTop: "56.25%",
  backgroundColor: "#f5f5f5",
});

const VideoThumbnail = styled("img")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.5s ease",
});

const PlayButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) scale(0.8)",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  opacity: 0,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#ffffff",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "48px",
    color: theme.palette.primary.main,
  },
}));

const VideoTitle = styled(Typography)({
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: 1.4,
  marginBottom: "8px",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const VideoMeta = styled(Typography)({
  color: "#999",
  fontSize: "13px",
});

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    width: "90vw",
    maxWidth: "1200px",
    height: "80vh",
    backgroundColor: "#000",
    position: "relative",
  },
  "& .MuiDialogContent-root": {
    padding: 0,
    backgroundColor: "#000",
  },
});

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: "10px",
  right: "10px",
  zIndex: 10,
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  "&:hover": {
    backgroundColor: "#ffffff",
  },
});

// Simple date formatter without date-fns
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

// Function to extract YouTube video ID from URL
const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Function to get YouTube thumbnail
const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeId(url);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : "https://via.placeholder.com/640x360?text=No+Thumbnail";
};

// Function to get embed URL
const getEmbedUrl = (url) => {
  const videoId = getYouTubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
};

export default function Video() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [open, setOpen] = useState(false);

  const {
    data: videos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const response = await axiosInstance.get("/videos");
      return response.data.data || response.data.videos || response.data || [];
    },
  });

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVideo(null);
  };

  if (isLoading) {
    return (
      <VideoSection sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Typography textAlign="center">Loading videos...</Typography>
        </Container>
      </VideoSection>
    );
  }

  if (error) {
    return (
      <VideoSection sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Typography textAlign="center" color="error">
            Error loading videos: {error.message}
          </Typography>
        </Container>
      </VideoSection>
    );
  }

  return (
    <Box>
      <SectionTile
        bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1.jpg"
        subtitle="Our Services"
        title="What We Offer"
        icon={true}
        iconClass="flaticon-custom-icon"
      />
      <VideoSection sx={{ py: { xs: 5, md: 12 } }}>
        <Container maxWidth="lg">
          {videos.length === 0 ? (
            <Typography textAlign="center" variant="h6" color="text.secondary">
              No videos found
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {videos.map((video) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={video._id}>
                  <VideoCard onClick={() => handleVideoClick(video)}>
                    <ThumbnailWrapper>
                      <VideoThumbnail
                        src={getYouTubeThumbnail(video.url)}
                        alt={video.title}
                        className="video-thumbnail"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/640x360?text=Video+Thumbnail";
                        }}
                      />
                      <PlayButton className="play-icon">
                        <PlayCircleOutlineIcon />
                      </PlayButton>
                    </ThumbnailWrapper>
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <VideoTitle>{video.title}</VideoTitle>
                      <VideoMeta>{formatDate(video.createdAt)}</VideoMeta>
                    </CardContent>
                  </VideoCard>
                </Grid>
              ))}
            </Grid>
          )}

          <StyledDialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
          >
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
                    height: "100%",
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
