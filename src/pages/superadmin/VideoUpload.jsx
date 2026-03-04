import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  TextField,
  Button,
  Alert,
  Typography,
  IconButton,
  Paper,
  Box,
  styled,
  Grid,
  Chip,
  Snackbar,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  alpha,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import {
  Delete,
  VideoLibrary as VideoIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  YouTube as YouTubeIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import GradientButton from "../../components/ui/GradientButton";
import OutlineButton from "../../components/ui/OutlineButton";
import StyledTextField from "../../components/ui/StyledTextField";
import { Helmet } from "react-helmet-async";

const isValidYouTubeUrl = (url) => {
  const pattern =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11})(\S*)?$/;
  return pattern.test(url);
};

const getYouTubeVideoId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getYouTubeThumbnail = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

const getYouTubeEmbedUrl = (videoId) => {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
};

const PreviewWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  display: "inline-block",
  marginTop: theme.spacing(1),
  maxWidth: "100%",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  boxShadow: theme.shadows[1],
}));

const VideoPlayerDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: theme.palette.background.default,
    maxWidth: "900px",
    width: "100%",
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: 8,
  top: 8,
  color: theme.palette.grey[500],
  zIndex: 1,
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.2),
  },
}));

const RequiredAsterisk = styled("span")(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: 1,
}));

export default function VideoUpload() {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const BLUE_COLOR = theme.palette.primary.main;
  const BLUE_DARK = theme.palette.primary.dark || theme.palette.primary.main;
  const RED_COLOR = theme.palette.error.main;
  const GREEN_COLOR = theme.palette.success.main;
  const TEXT_PRIMARY = theme.palette.text.primary;

  const [openModal, setOpenModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [alerts, setAlerts] = useState([]);
  const [urlError, setUrlError] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      url: "",
      title: "",
    },
  });

  const watchUrl = watch("url");
  const watchTitle = watch("title");

  React.useEffect(() => {
    if (watchUrl) {
      if (isValidYouTubeUrl(watchUrl)) {
        const id = getYouTubeVideoId(watchUrl);
        setVideoId(id);
        setThumbnailPreview(getYouTubeThumbnail(id));
        setUrlError(false);
      } else {
        setVideoId(null);
        setThumbnailPreview(null);
      }
    } else {
      setVideoId(null);
      setThumbnailPreview(null);
    }
  }, [watchUrl]);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const response = await axiosInstance.get("/videos");
      return response.data.videos || response.data.data || response.data;
    },
  });

  const paginatedVideos = videos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const addAlert = (severity, message) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, severity, message, open: true }]);
  };

  const handleCloseAlert = (id) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, open: false } : alert,
      ),
    );
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 300);
  };

  const resetForm = () => {
    reset();
    setThumbnailPreview(null);
    setVideoId(null);
    setUrlError(false);
  };

  const handleOpenModal = (mode, video = null) => {
    setModalMode(mode);
    if (video) {
      setSelectedVideo(video);
      setValue("title", video.title);
      setValue("url", video.url);
      setThumbnailPreview(getYouTubeThumbnail(getYouTubeVideoId(video.url)));
      setVideoId(getYouTubeVideoId(video.url));
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedVideo(null);
    resetForm();
  };

  const handleOpenPlayer = (video) => {
    setCurrentVideo(video);
    setPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setPlayerOpen(false);
    setCurrentVideo(null);
  };

  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (videoToDelete) {
      deleteVideoMutation.mutate(videoToDelete._id);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setVideoToDelete(null);
  };

  const createVideoMutation = useMutation({
    mutationFn: async (videoData) => {
      const response = await axiosInstance.post("/videos", videoData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      addAlert("success", "Video added successfully!");
      handleCloseModal();
    },
    onError: (error) => {
      addAlert(
        "error",
        error.response?.data?.message ||
        "Failed to add video. Please try again.",
      );
    },
  });

  const updateVideoMutation = useMutation({
    mutationFn: async ({ id, videoData }) => {
      const response = await axiosInstance.put(`/videos/${id}`, videoData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      addAlert("success", "Video updated successfully!");
      handleCloseModal();
    },
    onError: (error) => {
      addAlert(
        "error",
        error.response?.data?.message ||
        "Failed to update video. Please try again.",
      );
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/videos/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      addAlert("success", "Video deleted successfully!");
      setDeleteDialogOpen(false);
      setVideoToDelete(null);
    },
    onError: (error) => {
      addAlert(
        "error",
        error.response?.data?.message ||
        "Failed to delete video. Please try again.",
      );
      setDeleteDialogOpen(false);
      setVideoToDelete(null);
    },
  });

  const onSubmit = async (data) => {
    if (!isValidYouTubeUrl(data.url)) {
      setUrlError(true);
      addAlert("error", "Please enter a valid YouTube URL.");
      return;
    }

    const videoData = {
      url: data.url,
      title: data.title || `YouTube Video ${new Date().toLocaleDateString()}`,
    };

    if (modalMode === "edit" && selectedVideo) {
      updateVideoMutation.mutate({ id: selectedVideo._id, videoData });
    } else {
      createVideoMutation.mutate(videoData);
    }
  };

  return (
    <Box>
      <Helmet>
        <title>Video Management - PetCare</title>
        <meta name="description" content="Manage your YouTube videos" />
      </Helmet>

      {/* Video Player Dialog */}
      <VideoPlayerDialog
        open={playerOpen}
        onClose={handleClosePlayer}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <CloseButton onClick={handleClosePlayer} size="small">
            <CloseIcon />
          </CloseButton>
          {currentVideo && (
            <Box
              sx={{
                position: "relative",
                paddingBottom: "56.25%", // 16:9 aspect ratio
                height: 0,
                overflow: "hidden",
              }}
            >
              <iframe
                src={getYouTubeEmbedUrl(getYouTubeVideoId(currentVideo.url))}
                title={currentVideo.title}
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
            </Box>
          )}
        </DialogContent>
      </VideoPlayerDialog>

      {/* Alerts */}
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={alert.open}
          autoHideDuration={6000}
          onClose={() => handleCloseAlert(alert.id)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => handleCloseAlert(alert.id)}
            severity={alert.severity}
            variant="filled"
            sx={{
              width: "100%",
              boxShadow: 3,
            }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      ))}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: TEXT_PRIMARY,
            fontWeight: 600,
            fontSize: "0.95rem",
            py: 1.5,
            px: 2,
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ px: 2, py: 2 }}>
          <Typography variant="body2" sx={{ color: TEXT_PRIMARY }}>
            Are you sure you want to delete "{videoToDelete?.title}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: 2,
            py: 1.5,
          }}
        >
          <OutlineButton
            onClick={handleDeleteCancel}
            size="small"
            sx={{ fontSize: "0.8rem", py: 0.4, px: 1.5 }}
            disabled={deleteVideoMutation.isPending}
          >
            Cancel
          </OutlineButton>
          <Button
            onClick={handleDeleteConfirm}
            size="small"
            variant="contained"
            color="error"
            sx={{ fontSize: "0.8rem", py: 0.4, px: 1.5 }}
            disabled={deleteVideoMutation.isPending}
          >
            {deleteVideoMutation.isPending ? (
              <CircularProgress size={16} sx={{ color: "white" }} />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: TEXT_PRIMARY,
            }}
          >
            Video Management
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}
          >
            Manage your YouTube videos
          </Typography>
        </Box>
        <GradientButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal("create")}
          size="small"
        >
          Add New Video
        </GradientButton>
      </Box>

      {/* Videos Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: alpha(BLUE_COLOR, 0.05),
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  py: 1.5,
                }}
              >
                Thumbnail
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  py: 1.5,
                }}
              >
                Title
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  py: 1.5,
                }}
              >
                Video ID
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  py: 1.5,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} sx={{ color: BLUE_COLOR }} />
                </TableCell>
              </TableRow>
            ) : paginatedVideos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Box>
                    <VideoIcon
                      sx={{
                        fontSize: 48,
                        color: alpha(TEXT_PRIMARY, 0.2),
                        mb: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}
                    >
                      No videos found. Add one to get started.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedVideos.map((video) => {
                const videoId = getYouTubeVideoId(video.url);
                return (
                  <TableRow
                    key={video._id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: alpha(BLUE_COLOR, 0.03),
                      },
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    <TableCell sx={{ py: 1 }}>
                      <Box
                        component="img"
                        src={getYouTubeThumbnail(videoId)}
                        alt={video.title}
                        sx={{
                          width: 100,
                          height: 56,
                          objectFit: "cover",
                          borderRadius: 0.5,
                          border: `1px solid ${theme.palette.divider}`,
                          cursor: "pointer",
                          transition: "opacity 0.2s",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                        onClick={() => handleOpenPlayer(video)}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        {video.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Chip
                        label={videoId}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          height: 24,
                          backgroundColor: alpha(RED_COLOR, 0.1),
                          color: RED_COLOR,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => window.open(video.url, "_blank")}
                        sx={{
                          color: RED_COLOR,
                          mr: 0.5,
                          "&:hover": {
                            backgroundColor: alpha(RED_COLOR, 0.1),
                          },
                        }}
                        title="Open in YouTube"
                      >
                        <YouTubeIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenPlayer(video)}
                        sx={{
                          color: BLUE_COLOR,
                          mr: 0.5,
                          "&:hover": {
                            backgroundColor: alpha(BLUE_COLOR, 0.1),
                          },
                        }}
                        title="Play Video"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenModal("edit", video)}
                        sx={{
                          color: BLUE_COLOR,
                          mr: 0.5,
                          "&:hover": {
                            backgroundColor: alpha(BLUE_COLOR, 0.1),
                          },
                        }}
                        title="Edit Video"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(video)}
                        sx={{
                          color: RED_COLOR,
                          "&:hover": {
                            backgroundColor: alpha(RED_COLOR, 0.1),
                          },
                        }}
                        title="Delete Video"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={videos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        />
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: TEXT_PRIMARY,
            fontWeight: 600,
            fontSize: "1rem",
            py: 2,
            px: 3,
          }}
        >
          {modalMode === "create" && "Add New Video"}
          {modalMode === "edit" && "Edit Video"}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ px: 3, py: 2 }}>
            <Grid container spacing={2.5}>
              <Grid size={{ md: 12 }} item>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    YouTube URL
                  </Typography>
                  <RequiredAsterisk>*</RequiredAsterisk>
                </Box>
                <StyledTextField
                  fullWidth
                  size="small"
                  disabled={modalMode === "view"}
                  {...register("url", {
                    required: "URL is required",
                    validate: {
                      validUrl: (value) =>
                        isValidYouTubeUrl(value) || "Please enter a valid YouTube URL",
                    },
                  })}
                  error={!!errors.url}
                  helperText={errors.url?.message}
                  placeholder="https://www.youtube.com/watch?v=..."
                  sx={{
                    '& .MuiFormHelperText-root': {
                      fontSize: '0.75rem',
                      mt: 0.5,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ md: 12 }}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    Video Title
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{ color: alpha(TEXT_PRIMARY, 0.5), ml: 1 }}
                  >
                    (Optional)
                  </Typography>
                </Box>
                <StyledTextField
                  fullWidth
                  size="small"
                  disabled={modalMode === "view"}
                  {...register("title", {
                    maxLength: {
                      value: 100,
                      message: "Title must not exceed 100 characters",
                    },
                  })}
                  error={!!errors.title}
                  helperText={
                    errors.title?.message || (
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ color: alpha(TEXT_PRIMARY, 0.5) }}
                      >
                        If not provided, a default title will be used
                      </Typography>
                    )
                  }
                  placeholder="Enter video title"
                  sx={{
                    '& .MuiFormHelperText-root': {
                      fontSize: '0.75rem',
                      mt: 0.5,
                    },
                  }}
                />
              </Grid>

              {thumbnailPreview && (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      mb: 1,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    Preview
                  </Typography>
                  <PreviewWrapper>
                    <Box
                      component="img"
                      src={thumbnailPreview}
                      alt="Video thumbnail"
                      sx={{
                        width: "100%",
                        maxHeight: 200,
                        objectFit: "cover",
                        borderRadius: 0.5,
                      }}
                    />
                    {videoId && (
                      <Chip
                        label={`ID: ${videoId}`}
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          left: 8,
                          backgroundColor: alpha("#000", 0.7),
                          color: "white",
                          fontSize: "0.7rem",
                          height: 20,
                        }}
                      />
                    )}
                  </PreviewWrapper>
                </Grid>
              )}
            </Grid>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <OutlineButton
              onClick={handleCloseModal}
              size="small"
            >
              Cancel
            </OutlineButton>
            <GradientButton
              type="submit"
              size="small"
              disabled={
                createVideoMutation.isPending ||
                updateVideoMutation.isPending ||
                !isValid ||
                (modalMode === "edit" && !isDirty)
              }
            >
              {createVideoMutation.isPending ||
                updateVideoMutation.isPending ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : modalMode === "create" ? (
                "Add Video"
              ) : (
                "Update Video"
              )}
            </GradientButton>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}