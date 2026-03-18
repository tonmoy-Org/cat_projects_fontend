import React, { useState, useMemo } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  Button,
  Pagination,
  PaginationItem,
  Snackbar,
  Alert,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  Chip,
  MenuItem,
  Select,
  FormControl,
  useTheme,
  useMediaQuery,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import SectionTile from "../../components/SectionTile";
import { useCart } from "../../context/CartContext";

const PRIMARY_COLOR = "#5C4D91";
const PRIMARY_DARK = "#4A3D75";
const iconColor = "#db89ca";
const primaryColor = "#ff6b6b";

// ── Styled Components ─────────────────────────────────────────────────────────

const ProductSection = styled(Box)({
  backgroundColor: "#ffffff",
  padding: "80px 0",
  width: "100%",
  "@media (max-width: 900px)": { padding: "60px 0" },
  "@media (max-width: 600px)": { padding: "40px 0" },
});

const FilterBar = styled(Box)({
  backgroundColor: "#faf8ff",
  border: "1px solid #ede8f7",
  borderRadius: "12px",
  padding: "20px 24px",
  marginBottom: "36px",
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  alignItems: "center",
  "@media (max-width: 600px)": { padding: "16px", gap: "12px" },
});

const FilterLabel = styled(Typography)({
  fontSize: "13px",
  fontWeight: 600,
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  minWidth: "max-content",
});

const SearchInput = styled(TextField)({
  flex: "1 1 220px",
  minWidth: "200px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "30px",
    backgroundColor: "#fff",
    fontSize: "14px",
    "& fieldset": { borderColor: "#e0d9f5" },
    "&:hover fieldset": { borderColor: PRIMARY_COLOR },
    "&.Mui-focused fieldset": { borderColor: PRIMARY_COLOR },
  },
  "& input": { padding: "9px 14px" },
});

const CategorySelect = styled(Select)({
  borderRadius: "30px",
  backgroundColor: "#fff",
  fontSize: "14px",
  minWidth: "160px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0d9f5" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: PRIMARY_COLOR },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: PRIMARY_COLOR,
  },
  "& .MuiSelect-select": { padding: "9px 14px" },
});

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButton-root": {
    border: "1px solid #e0d9f5",
    borderRadius: "30px !important",
    padding: "5px 16px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#555",
    textTransform: "none",
    marginRight: "6px",
    transition: "all 0.2s ease",
    "&.Mui-selected": {
      backgroundColor: PRIMARY_COLOR,
      color: "#fff",
      borderColor: PRIMARY_COLOR,
      "&:hover": { backgroundColor: PRIMARY_DARK },
    },
    "&:hover": { borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR },
  },
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    "& .MuiToggleButton-root": {
      padding: "4px 10px",
      fontSize: "12px",
      marginRight: "0",
      flex: "1 1 auto",
      minWidth: "70px",
    },
  },
  [theme.breakpoints.down("xs")]: {
    "& .MuiToggleButton-root": {
      padding: "3px 8px",
      fontSize: "11px",
      minWidth: "60px",
    },
  },
}));

const PriceSliderWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  flex: "1 1 200px",
  minWidth: "20px",
  maxWidth: "40%",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "90%",
    flex: "1 1 100%",
    width: "100%",
  },
}));

const PriceInputRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

const PriceInput = styled(TextField)({
  width: "85px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#fff",
    fontSize: "12px",
    "& fieldset": { borderColor: "#e0d9f5" },
    "&:hover fieldset": { borderColor: PRIMARY_COLOR },
    "&.Mui-focused fieldset": { borderColor: PRIMARY_COLOR },
  },
  "& input": {
    padding: "5px 4px",
    textAlign: "center",
    fontWeight: 600,
    color: PRIMARY_COLOR,
    fontSize: "12px",
  },
});

const StyledSlider = styled(Slider)({
  color: PRIMARY_COLOR,
  "& .MuiSlider-thumb": {
    width: "16px",
    height: "16px",
    "&:hover": { boxShadow: `0 0 0 8px rgba(92,77,145,0.1)` },
  },
  "& .MuiSlider-rail": { backgroundColor: "#e0d9f5" },
});

const RefreshButton = styled(IconButton)({
  backgroundColor: "#f0ecfb",
  color: PRIMARY_COLOR,
  padding: "8px",
  marginLeft: "8px",
  "&:hover": {
    backgroundColor: PRIMARY_COLOR,
    color: "#fff",
  },
  "&.Mui-disabled": {
    backgroundColor: "#f0ecfb",
    opacity: 0.5,
  },
});

const ActiveFiltersRow = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  alignItems: "center",
  marginBottom: "20px",
});

const ResultCount = styled(Typography)({
  fontSize: "14px",
  color: "#888",
  marginBottom: "20px",
});

const ProductCard = styled(Box)({
  width: "100%",
  borderRadius: "10px",
  overflow: "hidden",
  cursor: "pointer",
  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.15)" },
  "&:hover .product-image": { transform: "scale(1.05)" },
});

const ImageWrapper = styled(Box)({
  position: "relative",
  width: "100%",
  overflow: "hidden",
});

const ProductImage = styled("img")({
  width: "100%",
  height: "280px",
  objectFit: "cover",
  display: "block",
  transition: "transform 0.5s ease",
  "@media (max-width: 900px)": { height: "240px" },
  "@media (max-width: 600px)": { height: "220px" },
});

const PriceOverlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isVisible",
})(({ isVisible }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
  opacity: isVisible ? 1 : 0,
  visibility: isVisible ? "visible" : "hidden",
  transition: "all 0.3s ease",
  zIndex: 2,
  "@media (max-width: 600px)": { width: "70px", height: "70px" },
}));

const CardBody = styled(Box)({
  padding: "14px 12px 16px",
  textAlign: "center",
});

const ProductName = styled(Typography)({
  fontSize: "16px",
  fontWeight: 600,
  color: "#1a1a1a",
  marginBottom: "6px",
});

const ProductCategory = styled(Typography)({
  fontSize: "13px",
  color: "#888",
  marginBottom: "8px",
});

const ProductPrice = styled(Typography)({
  fontSize: "16px",
  fontWeight: 700,
  color: PRIMARY_COLOR,
  marginBottom: "12px",
});

const AddToCartBtn = styled(Button)({
  backgroundColor: iconColor,
  color: "#fff",
  fontSize: "13px",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: "30px",
  padding: "7px 18px",
  width: "100%",
  gap: "6px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#c96db8",
    boxShadow: "0 4px 12px rgba(219,137,202,0.4)",
  },
});

const ViewCartBtn = styled(Button)({
  backgroundColor: "transparent",
  color: iconColor,
  fontSize: "13px",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: "30px",
  padding: "7px 18px",
  width: "100%",
  gap: "6px",
  border: `2px solid ${iconColor}`,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: iconColor,
    color: "#fff",
    boxShadow: "0 4px 12px rgba(219,137,202,0.4)",
  },
});

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
  minHeight: "400px",
  width: "100%",
});

// ── ProductCardItem ───────────────────────────────────────────────────────────

const ProductCardItem = ({ product, onCardClick, onAddToCart }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToCart(true);
    onAddToCart(product.title);
  };

  const handleViewCart = (e) => {
    e.stopPropagation();
    navigate("/cart");
  };

  return (
    <ProductCard
      onMouseEnter={() => setHoveredId(true)}
      onMouseLeave={() => setHoveredId(false)}
      onClick={() => onCardClick(product)}
    >
      <ImageWrapper>
        <ProductImage
          className="product-image"
          src={product.featuredImage}
          alt={product.title}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
          }}
        />
        <PriceOverlay isVisible={hoveredId}>
          <Typography
            sx={{ fontWeight: 600, fontSize: "20px", color: primaryColor }}
          >
            ৳{product.price}
          </Typography>
        </PriceOverlay>
      </ImageWrapper>
      <CardBody>
        <ProductName>Name : {product.title}</ProductName>
        <ProductCategory>Category : {product.category}</ProductCategory>
        <ProductPrice>Price : ৳ {product.price}</ProductPrice>
        {addedToCart ? (
          <ViewCartBtn variant="outlined" onClick={handleViewCart}>
            <ShoppingCartIcon sx={{ fontSize: "17px" }} />
            View Cart
          </ViewCartBtn>
        ) : (
          <AddToCartBtn onClick={handleAddToCart}>
            <ShoppingCartIcon sx={{ fontSize: "17px" }} />
            Add to Cart
          </AddToCartBtn>
        )}
      </CardBody>
    </ProductCard>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8;

const Product = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Filter state ───────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stock, setStock] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const [priceInitialized, setPriceInitialized] = useState(false);

  // ── Fetch all products once ────────────────────────────────────────────────
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products-all-filter"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products?limit=1000`);
      return response.data;
    },
  });

  const allProducts = data?.data || [];

  // Get unique categories from the data
  const categoryOptions = useMemo(() => {
    if (!allProducts.length) return ["All"];

    // Extract unique categories, filter out empty/null values, and sort
    const uniqueCategories = [
      ...new Set(
        allProducts
          .map((product) => product.category)
          .filter((category) => category && category.trim() !== ""),
      ),
    ].sort();

    return ["All", ...uniqueCategories];
  }, [allProducts]);

  // Initialize price range from real data
  React.useEffect(() => {
    if (allProducts.length > 0 && !priceInitialized) {
      const prices = allProducts.map((p) => Number(p.price) || 0);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setPriceRange([min, max]);
      setMinInput(String(min));
      setMaxInput(String(max));
      setPriceInitialized(true);
    }
  }, [allProducts, priceInitialized]);

  // Update price range when data refreshes
  React.useEffect(() => {
    if (allProducts.length > 0 && priceInitialized) {
      const prices = allProducts.map((p) => Number(p.price) || 0);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setPriceRange([min, max]);
      setMinInput(String(min));
      setMaxInput(String(max));
    }
  }, [allProducts]);

  const priceMin = priceInitialized
    ? Math.floor(Math.min(...allProducts.map((p) => Number(p.price) || 0)))
    : 0;
  const priceMax = priceInitialized
    ? Math.ceil(Math.max(...allProducts.map((p) => Number(p.price) || 0)))
    : 10000;

  // ── Refresh function ───────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();

      // Reset all filters to default
      setSearch("");
      setCategory("All");
      setStock("all");

      // Reset price filter to default values based on refreshed data
      if (allProducts.length > 0) {
        const prices = allProducts.map((p) => Number(p.price) || 0);
        const min = Math.floor(Math.min(...prices));
        const max = Math.ceil(Math.max(...prices));
        setPriceRange([min, max]);
        setMinInput(String(min));
        setMaxInput(String(max));
      }

      setSnackbar({
        open: true,
        message: "Data refreshed and filters reset successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to refresh data",
        severity: "error",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // ── Sync slider → inputs ───────────────────────────────────────────────────
  const handleSliderChange = (_, val) => {
    setPriceRange(val);
    setMinInput(String(val[0]));
    setMaxInput(String(val[1]));
  };

  const handleMinInput = (e) => {
    const raw = e.target.value;
    setMinInput(raw);
    const num = Number(raw);
    if (!isNaN(num) && num >= priceMin && num <= priceRange[1]) {
      setPriceRange([num, priceRange[1]]);
    }
  };

  const handleMaxInput = (e) => {
    const raw = e.target.value;
    setMaxInput(raw);
    const num = Number(raw);
    if (!isNaN(num) && num <= priceMax && num >= priceRange[0]) {
      setPriceRange([priceRange[0], num]);
    }
  };

  // ── Filter logic ───────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Search: title
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!product.title?.toLowerCase().includes(q)) return false;
      }
      // Category
      if (category !== "All") {
        if (product.category?.toLowerCase() !== category.toLowerCase())
          return false;
      }
      // Stock
      if (stock === "instock" && !product.inStock) return false;
      if (stock === "outofstock" && product.inStock) return false;
      // Price
      const price = Number(product.price) || 0;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      return true;
    });
  }, [allProducts, search, category, stock, priceRange]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  React.useEffect(() => {
    setPage(1);
  }, [search, category, stock, priceRange]);

  const handlePageChange = (_, value) => {
    setPage(value);
    window.scrollTo({
      top: document.getElementById("products-section")?.offsetTop - 100,
      behavior: "smooth",
    });
  };

  const handleProductClick = (product) => {
    navigate(`/shop/${product.title_id}`);
  };

  const handleAddToCart = (productName) => {
    setSnackbar({
      open: true,
      message: `${productName} added to cart!`,
      severity: "success",
    });
  };

  // ── Active filter chips ────────────────────────────────────────────────────
  const activeFilters = [];
  if (search.trim())
    activeFilters.push({ label: `"${search}"`, key: "search" });
  if (category !== "All")
    activeFilters.push({ label: `Category: ${category}`, key: "category" });
  if (stock !== "all")
    activeFilters.push({
      label: stock === "instock" ? "In Stock" : "Out of Stock",
      key: "stock",
    });
  if (
    priceInitialized &&
    (priceRange[0] !== priceMin || priceRange[1] !== priceMax)
  )
    activeFilters.push({
      label: `৳${priceRange[0]} – ৳${priceRange[1]}`,
      key: "price",
    });

  const clearFilter = (key) => {
    if (key === "search") setSearch("");
    if (key === "category") setCategory("All");
    if (key === "stock") setStock("all");
    if (key === "price") {
      setPriceRange([priceMin, priceMax]);
      setMinInput(String(priceMin));
      setMaxInput(String(priceMax));
    }
  };

  const clearAll = () => {
    setSearch("");
    setCategory("All");
    setStock("all");
    setPriceRange([priceMin, priceMax]);
    setMinInput(String(priceMin));
    setMaxInput(String(priceMax));
  };

  if (isLoading) {
    return (
      <Box>
        <SectionTile
          bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/2.jpg"
          subtitle="Pet Shop"
          title="Our products"
          icon={true}
          iconClass="flaticon-custom-icon"
        />
        <ProductSection>
          <Container maxWidth="lg">
            <LoadingContainer>
              <CircularProgress sx={{ color: PRIMARY_COLOR }} />
            </LoadingContainer>
          </Container>
        </ProductSection>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <SectionTile
          bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/2.jpg"
          subtitle="Pet Shop"
          title="Our products"
          icon={true}
          iconClass="flaticon-custom-icon"
        />
        <ProductSection>
          <Container maxWidth="lg">
            <Typography textAlign="center" color="error">
              Error loading products: {error.message}
            </Typography>
          </Container>
        </ProductSection>
      </Box>
    );
  }

  return (
    <Box>
      <SectionTile
        bgImage="https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/2.jpg"
        subtitle="Pet Shop"
        title="Our products"
        icon={true}
        iconClass="flaticon-custom-icon"
      />
      <ProductSection id="products-section">
        <Container maxWidth="lg">
          {/* ── Filter Bar ── */}
          <FilterBar>
            {/* Row 1: Search + Category */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                width: "100%",
                alignItems: "center",
              }}
            >
              <SearchInput
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: "18px", color: "#aaa" }} />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <CloseIcon
                        sx={{
                          fontSize: "16px",
                          color: "#aaa",
                          cursor: "pointer",
                        }}
                        onClick={() => setSearch("")}
                      />
                    </InputAdornment>
                  ) : null,
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FilterLabel>Category</FilterLabel>
                <FormControl size="small">
                  <CategorySelect
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    displayEmpty
                  >
                    {categoryOptions.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </CategorySelect>
                </FormControl>
              </Box>
            </Box>

            {/* Row 2: Stock + Price */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                width: "100%",
                alignItems: "center",
              }}
            >
              {/* Stock */}
              <Box
                sx={{
                  display: "flex",
                  paddingTop: "40px",
                  alignItems: "center",
                  gap: "10px",
                  "@media (max-width: 600px)": {
                    paddingTop: "10px",
                  },
                }}
              >
                <FilterLabel>Stock</FilterLabel>
                <StyledToggleButtonGroup
                  value={stock}
                  exclusive
                  onChange={(_, val) => {
                    if (val) setStock(val);
                  }}
                  size="small"
                >
                  <ToggleButton value="all">All</ToggleButton>
                  <ToggleButton value="instock">In Stock</ToggleButton>
                  <ToggleButton value="outofstock">Out of Stock</ToggleButton>
                </StyledToggleButtonGroup>
              </Box>

              {/* Price */}
              {priceInitialized && priceMin !== priceMax && (
                <PriceSliderWrapper>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <FilterLabel>
                      <FilterListIcon
                        sx={{
                          fontSize: "14px",
                          mr: "4px",
                          verticalAlign: "middle",
                        }}
                      />
                      Price Range
                    </FilterLabel>
                    <Tooltip title="Refresh data & reset filters">
                      <RefreshButton
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        size="small"
                      >
                        <RefreshIcon
                          sx={{
                            fontSize: "18px",
                            animation: isRefreshing
                              ? "spin 1s linear infinite"
                              : "none",
                          }}
                        />
                      </RefreshButton>
                    </Tooltip>
                  </Box>
                  <PriceInputRow>
                    <PriceInput
                      size="small"
                      value={minInput}
                      onChange={handleMinInput}
                      inputProps={{
                        type: "number",
                        min: priceMin,
                        max: priceRange[1],
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography
                              sx={{
                                fontSize: "11px",
                                color: PRIMARY_COLOR,
                                fontWeight: 700,
                              }}
                            >
                              ৳
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Typography sx={{ fontSize: "12px", color: "#aaa" }}>
                      –
                    </Typography>
                    <PriceInput
                      size="small"
                      value={maxInput}
                      onChange={handleMaxInput}
                      inputProps={{
                        type: "number",
                        min: priceRange[0],
                        max: priceMax,
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography
                              sx={{
                                fontSize: "11px",
                                color: PRIMARY_COLOR,
                                fontWeight: 700,
                              }}
                            >
                              ৳
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <StyledSlider
                      value={priceRange}
                      onChange={handleSliderChange}
                      min={priceMin}
                      max={priceMax}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(v) => `৳${v}`}
                      sx={{ flex: 1 }}
                    />
                  </PriceInputRow>
                </PriceSliderWrapper>
              )}
            </Box>
          </FilterBar>

          {/* ── Active filter chips ── */}
          {activeFilters.length > 0 && (
            <ActiveFiltersRow>
              <Typography sx={{ fontSize: "13px", color: "#888", mr: "4px" }}>
                Active:
              </Typography>
              {activeFilters.map((f) => (
                <Chip
                  key={f.key}
                  label={f.label}
                  size="small"
                  onDelete={() => clearFilter(f.key)}
                  sx={{
                    backgroundColor: "#f0ecfb",
                    color: PRIMARY_COLOR,
                    fontWeight: 600,
                    fontSize: "12px",
                    "& .MuiChip-deleteIcon": { color: PRIMARY_COLOR },
                  }}
                />
              ))}
              <Button
                size="small"
                onClick={clearAll}
                sx={{
                  fontSize: "12px",
                  color: "#aaa",
                  textTransform: "none",
                  ml: "4px",
                }}
              >
                Clear all
              </Button>
            </ActiveFiltersRow>
          )}

          {/* ── Result count ── */}
          <ResultCount>
            Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
            products
          </ResultCount>

          {/* ── Grid ── */}
          {paginatedProducts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: "60px" }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No products match your filters
              </Typography>
              <Button
                onClick={clearAll}
                sx={{
                  color: PRIMARY_COLOR,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Clear filters
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
                {paginatedProducts.map((product) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product._id}>
                    <ProductCardItem
                      product={product}
                      onCardClick={handleProductClick}
                      onAddToCart={handleAddToCart}
                    />
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
      </ProductSection>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Add keyframe animation for spinning refresh icon */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default Product;
