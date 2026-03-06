import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Button, Typography, IconButton, Paper, Box, styled,
  Grid, FormControl, Select, MenuItem, Checkbox, FormControlLabel,
  Chip, useTheme, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions,
  TablePagination, alpha, CircularProgress, FormHelperText,
} from "@mui/material";
import {
  Delete, CloudUpload, Pets as PetsIcon, Add as AddIcon,
  Edit as EditIcon, Visibility as VisibilityIcon, Image as ImageIcon,
} from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import GradientButton from "../../components/ui/GradientButton";
import OutlineButton from "../../components/ui/OutlineButton";
import StyledTextField from "../../components/ui/StyledTextField";
import { Helmet } from "react-helmet-async";
import { useAlert } from "../../components/ui/AlertProvider";

const DropzoneWrapper = styled("div")(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create(["background-color", "border-color"]),
  "&:hover": { borderColor: theme.palette.primary.dark, backgroundColor: theme.palette.action.hover },
  "&.active": { borderColor: theme.palette.primary.main, backgroundColor: theme.palette.action.selected },
}));

const PreviewWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  display: "inline-block",
  marginTop: theme.spacing(1),
  maxWidth: "100%",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  boxShadow: theme.shadows[1],
}));

const RequiredAsterisk = styled("span")(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: 1,
}));

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["blockquote", "code-block"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ],
};

const formats = [
  "header", "bold", "italic", "underline", "strike",
  "list", "bullet", "link", "image", "blockquote",
  "code-block", "color", "background", "align",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function UploadBlog() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { addAlert } = useAlert();

  const BLUE_COLOR = theme.palette.primary.main;
  const RED_COLOR = theme.palette.error.main;
  const GREEN_COLOR = theme.palette.success.main;
  const TEXT_PRIMARY = theme.palette.text.primary;

  const [openModal, setOpenModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // No more upload progress since backend handles it
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [petType, setPetType] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [touchedFields, setTouchedFields] = useState({});
  const [editFormDirty, setEditFormDirty] = useState(false);

  const markDirty = () => { if (modalMode === "edit") setEditFormDirty(true); };

  const { handleSubmit, register, reset, setValue, formState: { errors, isValid } } = useForm({
    mode: "onChange",
    defaultValues: { title: "", excerpt: "" },
  });

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/blogs");
      return response.data.blogs || response.data.data || response.data;
    },
  });

  const paginatedBlogs = blogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  const handleFileChange = useCallback((file) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) { addAlert("error", "File size exceeds 5MB limit"); return; }
    if (!file.type.match("image.*")) { addAlert("error", "Only image files are allowed"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    markDirty();
  }, [modalMode]);

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    markDirty();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => handleFileChange(acceptedFiles[0]),
    onDropRejected: (rejectedFiles) => {
      const file = rejectedFiles[0];
      let message = "File rejected";
      if (file.errors.some(e => e.code === "file-too-large")) message = "File is too large (max 5MB)";
      else if (file.errors.some(e => e.code === "file-invalid-type")) message = "Invalid file type. Please upload an image.";
      addAlert("error", message);
    },
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      markDirty();
    }
  };

  const handleRemoveTag = (tagToRemove) => { setTags(tags.filter(t => t !== tagToRemove)); markDirty(); };

  const resetForm = () => {
    reset();
    setContent(""); setCategory(""); setPetType(""); setIsFeatured(false);
    setTags([]); setTagInput("");
    if (imagePreview && imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(null); setImagePreview(null);
    setTouchedFields({}); setEditFormDirty(false);
  };

  const handleOpenModal = (mode, blog = null) => {
    setModalMode(mode);
    setEditFormDirty(false);
    if (blog) {
      setSelectedBlog(blog);
      setValue("title", blog.title);
      setValue("excerpt", blog.excerpt || "");
      setContent(blog.content);
      setCategory(blog.category);
      setPetType(blog.petType);
      setIsFeatured(blog.isFeatured || false);
      setTags(blog.tags || []);
      if (blog.imageUrl) setImagePreview(blog.imageUrl);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => { setOpenModal(false); setSelectedBlog(null); resetForm(); };
  const handleDeleteClick = (blog) => { setBlogToDelete(blog); setDeleteDialogOpen(true); };
  const handleDeleteConfirm = () => { if (blogToDelete) deleteBlogMutation.mutate(blogToDelete._id); };
  const handleDeleteCancel = () => { setDeleteDialogOpen(false); setBlogToDelete(null); };

  // ✅ Build FormData and POST to backend
  const buildFormData = (data, extraImageUrl = null) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("excerpt", data.excerpt || content.substring(0, 160).replace(/<[^>]*>/g, ""));
    formData.append("content", content);
    formData.append("category", category);
    formData.append("petType", petType);
    formData.append("isFeatured", isFeatured);
    formData.append("tags", JSON.stringify(tags));
    formData.append("author", "Admin");
    formData.append("type", "article");
    if (imageFile) formData.append("image", imageFile); // multer field name: "image"
    return formData;
  };

  const createBlogMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["blogs"] }); addAlert("success", "Blog post created successfully!"); handleCloseModal(); },
    onError: (error) => { addAlert("error", error.response?.data?.message || error.response?.data?.error || "Failed to create blog."); },
  });

  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const response = await axiosInstance.put(`/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["blogs"] }); addAlert("success", "Blog post updated successfully!"); handleCloseModal(); },
    onError: (error) => { addAlert("error", error.response?.data?.message || error.response?.data?.error || "Failed to update blog."); },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (id) => { const response = await axiosInstance.delete(`/blogs/${id}`); return response.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["blogs"] }); addAlert("success", "Blog post deleted successfully!"); setDeleteDialogOpen(false); setBlogToDelete(null); },
    onError: (error) => { addAlert("error", error.response?.data?.error || "Failed to delete blog."); setDeleteDialogOpen(false); setBlogToDelete(null); },
  });

  const onSubmit = async (data) => {
    if (!content || content === "<p><br></p>") { addAlert("error", "Blog content is required."); return; }
    if (!category) { addAlert("error", "Please select a category."); return; }
    if (!petType) { addAlert("error", "Please select a pet type."); return; }
    if (modalMode === "create" && !imageFile) { addAlert("error", "Please select a featured image."); return; }

    const formData = buildFormData(data);

    if (modalMode === "edit" && selectedBlog) {
      updateBlogMutation.mutate({ id: selectedBlog._id, formData });
    } else {
      createBlogMutation.mutate(formData);
    }
  };

  const getCategoryLabel = (value) => {
    const categories = { care: "Care", pet: "Pet", dental: "Dental", surgery: "Surgery", diagnostic: "Diagnostic", safety: "Safety" };
    return categories[value] || value;
  };

  const getPetTypeLabel = (value) => {
    const types = { cat: "Cat", dog: "Dog", bird: "Bird", rabbit: "Rabbit", hamster: "Hamster", fish: "Fish", reptile: "Reptile", other: "Other Pets" };
    return types[value] || value;
  };

  const isSubmitDisabled = () => {
    if (createBlogMutation.isPending || updateBlogMutation.isPending) return true;
    if (modalMode === "create") return !isValid || !content || content === "<p><br></p>" || !category || !petType || !imageFile;
    return !editFormDirty;
  };

  return (
    <Box>
      <Helmet>
        <title>Blog Management - PetCare</title>
        <meta name="description" content="Manage your pet blog posts" />
      </Helmet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 1, backgroundColor: theme.palette.background.paper } }}>
        <DialogTitle sx={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: "1rem", py: 2, px: 3 }}>Confirm Delete</DialogTitle>
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography variant="body2" sx={{ color: TEXT_PRIMARY }}>
            Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <OutlineButton onClick={handleDeleteCancel} size="small" disabled={deleteBlogMutation.isPending}>Cancel</OutlineButton>
          <Button onClick={handleDeleteConfirm} size="small" variant="contained" color="error" disabled={deleteBlogMutation.isPending}>
            {deleteBlogMutation.isPending ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: TEXT_PRIMARY }}>Blog Management</Typography>
          <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>Manage your pet blog posts</Typography>
        </Box>
        <GradientButton variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal("create")} size="small">
          Create New Post
        </GradientButton>
      </Box>

      {/* Blogs Table */}
      <TableContainer component={Paper} elevation={0}
        sx={{ borderRadius: 1, border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: alpha(BLUE_COLOR, 0.05) }}>
              {["Image", "Title", "Category", "Pet Type", "Featured", "Tags"].map(label => (
                <TableCell key={label} sx={{ fontWeight: 600, color: TEXT_PRIMARY, borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>{label}</TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600, color: TEXT_PRIMARY, borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress size={32} sx={{ color: BLUE_COLOR }} /></TableCell></TableRow>
            ) : paginatedBlogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <PetsIcon sx={{ fontSize: 48, color: alpha(TEXT_PRIMARY, 0.2), mb: 1 }} />
                  <Typography variant="body2" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>No blog posts found. Create one to get started.</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedBlogs.map(blog => (
              <TableRow key={blog._id} hover sx={{ "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.03) }, "&:last-child td": { borderBottom: 0 } }}>
                <TableCell sx={{ py: 1 }}>
                  {blog.imageUrl ? (
                    <Box component="img" src={blog.imageUrl} alt={blog.title}
                      sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 0.5, border: `1px solid ${theme.palette.divider}`, cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                      onClick={() => handleOpenModal("view", blog)} />
                  ) : (
                    <Box sx={{ width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: alpha(BLUE_COLOR, 0.05), borderRadius: 0.5, border: `1px dashed ${theme.palette.divider}` }}>
                      <ImageIcon sx={{ fontSize: 24, color: alpha(TEXT_PRIMARY, 0.3) }} />
                    </Box>
                  )}
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>{blog.title}</Typography>
                  {blog.excerpt && <Typography variant="caption" sx={{ display: "block", color: alpha(TEXT_PRIMARY, 0.7) }}>{blog.excerpt.substring(0, 50)}...</Typography>}
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Chip label={getCategoryLabel(blog.category)} size="small" sx={{ fontWeight: 500, fontSize: "0.75rem", height: 24, backgroundColor: alpha(BLUE_COLOR, 0.1), color: BLUE_COLOR }} />
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Chip label={getPetTypeLabel(blog.petType)} size="small" sx={{ fontWeight: 500, fontSize: "0.75rem", height: 24, backgroundColor: alpha(GREEN_COLOR, 0.1), color: GREEN_COLOR }} />
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  {blog.isFeatured
                    ? <Chip label="Featured" size="small" sx={{ fontWeight: 500, fontSize: "0.75rem", height: 24, backgroundColor: alpha(GREEN_COLOR, 0.1), color: GREEN_COLOR }} />
                    : <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.5) }}>No</Typography>}
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {blog.tags?.slice(0, 2).map(tag => <Chip key={tag} label={tag} size="small" sx={{ fontSize: "0.7rem", height: 20 }} />)}
                    {blog.tags?.length > 2 && <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>+{blog.tags.length - 2}</Typography>}
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ py: 1 }}>
                  <IconButton size="small" onClick={() => handleOpenModal("view", blog)} sx={{ color: BLUE_COLOR, mr: 0.5, "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.1) } }} title="View Blog"><VisibilityIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => handleOpenModal("edit", blog)} sx={{ color: BLUE_COLOR, mr: 0.5, "&:hover": { backgroundColor: alpha(BLUE_COLOR, 0.1) } }} title="Edit Blog"><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => handleDeleteClick(blog)} sx={{ color: RED_COLOR, "&:hover": { backgroundColor: alpha(RED_COLOR, 0.1) } }} title="Delete Blog"><Delete fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={blogs.length}
          rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }} />
      </TableContainer>

      {/* Create/Edit/View Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth
        PaperProps={{ sx: { borderRadius: 1, backgroundColor: theme.palette.background.paper, maxHeight: "90vh" } }}>
        <DialogTitle sx={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: "1rem", py: 2, px: 3 }}>
          {modalMode === "create" && "Create New Blog Post"}
          {modalMode === "edit" && "Edit Blog Post"}
          {modalMode === "view" && "View Blog Post"}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ px: 3, py: 2 }}>
            <Grid container spacing={3}>
              {/* Main Content - 8 cols */}
              <Grid size={{ md: 8 }}>
                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ mb: 0.5 }}>
                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Blog Title</Typography>
                    {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                  </Box>
                  <StyledTextField fullWidth size="small" disabled={modalMode === "view"}
                    {...register("title", {
                      ...(modalMode === "create" && { required: "Title is required" }),
                      minLength: { value: 5, message: "Title must be at least 5 characters" },
                      maxLength: { value: 120, message: "Title must not exceed 120 characters" },
                      onChange: markDirty,
                    })}
                    error={!!errors.title} helperText={errors.title?.message} placeholder="Enter blog title" />
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ mb: 0.5 }}>
                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Short Excerpt</Typography>
                    {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                  </Box>
                  <StyledTextField fullWidth size="small" multiline rows={2} disabled={modalMode === "view"}
                    {...register("excerpt", {
                      ...(modalMode === "create" && { required: "Excerpt is required" }),
                      maxLength: { value: 200, message: "Excerpt must not exceed 200 characters" },
                      onChange: markDirty,
                    })}
                    error={!!errors.excerpt} helperText={errors.excerpt?.message} placeholder="Brief summary of your post" />
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Content</Typography>
                    {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                  </Box>
                  <Box sx={{
                    pointerEvents: modalMode === "view" ? "none" : "auto",
                    "& .quill": {
                      "& .ql-toolbar": { borderColor: theme.palette.divider, borderTopLeftRadius: 4, borderTopRightRadius: 4, display: modalMode === "view" ? "none" : "block", backgroundColor: alpha(BLUE_COLOR, 0.02) },
                      "& .ql-container": { borderColor: theme.palette.divider, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, minHeight: 250, fontSize: "0.875rem", backgroundColor: theme.palette.background.paper },
                      "& .ql-editor": { minHeight: 250 },
                    },
                  }}>
                    <ReactQuill value={content} onChange={(value) => { if (modalMode !== "view") { setContent(value); markDirty(); } }}
                      theme="snow" modules={modules} formats={formats}
                      placeholder="Share your pet story, tips, or advice..." readOnly={modalMode === "view"} />
                  </Box>
                </Box>

                {modalMode !== "view" && (
                  <Box sx={{ mb: 2.5 }}>
                    <Box sx={{ mb: 1 }}>
                      <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Featured Image</Typography>
                      {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                    </Box>
                    <DropzoneWrapper {...getRootProps()} className={isDragActive ? "active" : ""}>
                      <input {...getInputProps()} />
                      <CloudUpload sx={{ fontSize: 40, color: BLUE_COLOR, mb: 1 }} />
                      <Typography variant="body2" sx={{ mb: 1, color: TEXT_PRIMARY }}>
                        {isDragActive ? "Drop the image here" : "Drag & drop your image here, or click to select"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: alpha(TEXT_PRIMARY, 0.7) }}>
                        Recommended: 1200x630px • Max: 5MB (JPG, PNG, GIF)
                      </Typography>
                    </DropzoneWrapper>

                    {imagePreview && (
                      <Box sx={{ mt: 2 }}>
                        <PreviewWrapper>
                          <img src={imagePreview} alt="Preview" style={{ width: "100%", maxHeight: 250, objectFit: "cover" }} />
                          <IconButton onClick={handleRemoveImage} size="small"
                            sx={{ position: "absolute", top: 8, right: 8, bgcolor: RED_COLOR, color: "white", "&:hover": { bgcolor: alpha(RED_COLOR, 0.8) } }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </PreviewWrapper>
                      </Box>
                    )}
                  </Box>
                )}

                {modalMode === "view" && selectedBlog?.imageUrl && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: TEXT_PRIMARY }}>Featured Image</Typography>
                    <PreviewWrapper>
                      <img src={selectedBlog.imageUrl} alt={selectedBlog.title} style={{ width: "100%", maxHeight: 250, objectFit: "cover", borderRadius: 4 }} />
                    </PreviewWrapper>
                  </Box>
                )}
              </Grid>

              {/* Settings Panel - 4 cols */}
              <Grid size={{ md: 4 }}>
                <Paper elevation={0} sx={{ p: 2.5, bgcolor: alpha(BLUE_COLOR, 0.02), borderRadius: 1, border: 1, borderColor: theme.palette.divider }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5, color: TEXT_PRIMARY }}>Post Settings</Typography>

                  <Box sx={{ mb: 2.5 }}>
                    <Box sx={{ mb: 0.5 }}>
                      <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Category</Typography>
                      {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                    </Box>
                    <FormControl fullWidth size="small" error={!category && touchedFields.category}>
                      <Select value={category} onChange={(e) => { if (modalMode !== "view") { setCategory(e.target.value); setTouchedFields({ ...touchedFields, category: true }); markDirty(); } }} disabled={modalMode === "view"} displayEmpty>
                        <MenuItem value="" disabled>Select category</MenuItem>
                        <MenuItem value="care">Care</MenuItem>
                        <MenuItem value="pet">Pet</MenuItem>
                        <MenuItem value="dental">Dental</MenuItem>
                        <MenuItem value="surgery">Surgery</MenuItem>
                        <MenuItem value="diagnostic">Diagnostic</MenuItem>
                        <MenuItem value="safety">Safety</MenuItem>
                      </Select>
                      {!category && touchedFields.category && <FormHelperText error>Category is required</FormHelperText>}
                    </FormControl>
                  </Box>

                  <Box sx={{ mb: 2.5 }}>
                    <Box sx={{ mb: 0.5 }}>
                      <Typography component="span" variant="body2" sx={{ fontWeight: 500, color: TEXT_PRIMARY }}>Pet Type</Typography>
                      {modalMode === "create" && <RequiredAsterisk>*</RequiredAsterisk>}
                    </Box>
                    <FormControl fullWidth size="small" error={!petType && touchedFields.petType}>
                      <Select value={petType} onChange={(e) => { if (modalMode !== "view") { setPetType(e.target.value); setTouchedFields({ ...touchedFields, petType: true }); markDirty(); } }} disabled={modalMode === "view"} displayEmpty>
                        <MenuItem value="" disabled>Select pet type</MenuItem>
                        <MenuItem value="cat">Cat</MenuItem>
                        <MenuItem value="dog">Dog</MenuItem>
                        <MenuItem value="bird">Bird</MenuItem>
                        <MenuItem value="rabbit">Rabbit</MenuItem>
                        <MenuItem value="hamster">Hamster</MenuItem>
                        <MenuItem value="fish">Fish</MenuItem>
                        <MenuItem value="reptile">Reptile</MenuItem>
                        <MenuItem value="other">Other Pets</MenuItem>
                      </Select>
                      {!petType && touchedFields.petType && <FormHelperText error>Pet type is required</FormHelperText>}
                    </FormControl>
                  </Box>

                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: TEXT_PRIMARY }}>Tags</Typography>
                    {modalMode !== "view" ? (
                      <>
                        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                          <StyledTextField placeholder="Add tag" size="small" fullWidth value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleAddTag()} />
                          <OutlineButton onClick={handleAddTag} disabled={!tagInput.trim()} size="small">Add</OutlineButton>
                        </Box>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, minHeight: 32 }}>
                          {tags.map(tag => <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} size="small" color="primary" variant="outlined" />)}
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {tags.map(tag => <Chip key={tag} label={tag} size="small" color="primary" variant="outlined" />)}
                      </Box>
                    )}
                  </Box>

                  <FormControlLabel
                    control={<Checkbox checked={isFeatured} onChange={(e) => { if (modalMode !== "view") { setIsFeatured(e.target.checked); markDirty(); } }} color="primary" size="small" disabled={modalMode === "view"} />}
                    label={<Typography variant="body2" sx={{ color: TEXT_PRIMARY }}>Feature this post</Typography>}
                  />
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <OutlineButton onClick={handleCloseModal} size="small">{modalMode === "view" ? "Close" : "Cancel"}</OutlineButton>
            {modalMode !== "view" && (
              <GradientButton type="submit" size="small" disabled={isSubmitDisabled()}>
                {createBlogMutation.isPending || updateBlogMutation.isPending
                  ? <CircularProgress size={18} sx={{ color: "white" }} />
                  : modalMode === "create" ? "Create Post" : "Update Post"}
              </GradientButton>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}