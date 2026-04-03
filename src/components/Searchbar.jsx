import { useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Drawer,
  ClickAwayListener,
  useTheme,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, isMobile }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const debounceTimer = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const ACTIVE_COLOR = "#43376A";

  // Fetch suggestions from API
  const { data: suggestionsData, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['searchSuggestions', debouncedTerm],
    queryFn: async () => {
      if (!debouncedTerm || debouncedTerm.length < 2) return null;
      const response = await axiosInstance.get('/search/suggestions', {
        params: {
          q: debouncedTerm,
          limit: 8,
        },
      });
      console.log(response.data);
      return response.data;
    },
    enabled: debouncedTerm.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Debounce search term for suggestions
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setShowSuggestions(true);
  };

  const handleClear = () => {
    setSearchTerm("");
    setDebouncedTerm("");
    setShowSuggestions(false);
    if (onSearch) {
      onSearch("");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setShowSuggestions(false);
  
    // Use the 'text' property for the URL, 
    // but pass the WHOLE 'suggestion' object in the state
    navigate(`/search?q=${encodeURIComponent(suggestion.text)}`, { 
      state: { result: suggestion } 
    });
  
    setSearchTerm("");
    if (isMobile) setIsSearchOpen(false);
  };

  const handleSubmitSearch = (term) => {
    if (term && term.trim()) {
      // Navigate to search results page
      // navigate(`/search?q=${encodeURIComponent(term)}`);
      setShowSuggestions(false);
      if (isMobile) {
        setIsSearchOpen(false);
      }
    }
  };

  // Suggestions dropdown component
  const SuggestionsDropdown = () => {
    if (!showSuggestions || !searchTerm || searchTerm.length < 2) {
      return null;
    }

    if (suggestionsLoading) {
      return (
        <Box sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100px",
        }}>
          <CircularProgress size={24} sx={{ color: ACTIVE_COLOR }} />
        </Box>
      );
    }

    if (!suggestionsData?.suggestions || suggestionsData.suggestions.length === 0) {
      return (
        <Box sx={{
          p: 2,
          textAlign: "center",
        }}>
          <Typography variant="body2" color="text.secondary">
            No suggestions found
          </Typography>
        </Box>
      );
    }

    return (
      <List sx={{ py: 0 }}>
        {suggestionsData.suggestions.map((suggestion, index) => (
          <ListItem
            key={suggestion.id || `${suggestion.text}-${index}`}
            disablePadding
          >
            <ListItemButton
              onClick={() => handleSuggestionClick(suggestion)}
              sx={{
                py: 0.75,
                px: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                "&:hover": {
                  backgroundColor: alpha(ACTIVE_COLOR, 0.1),
                },
              }}
            >
              {/* Featured Image */}
              {suggestion.image ? (
                <Box
                  component="img"
                  src={suggestion.image}
                  alt={suggestion.text}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    objectFit: "cover",
                    flexShrink: 0,
                    backgroundColor: alpha(ACTIVE_COLOR, 0.05),
                    border: `1px solid ${alpha(ACTIVE_COLOR, 0.1)}`,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: alpha(ACTIVE_COLOR, 0.05),
                    border: `1px solid ${alpha(ACTIVE_COLOR, 0.1)}`,
                    flexShrink: 0,
                  }}
                >
                  <SearchIcon
                    sx={{
                      fontSize: "1.5rem",
                      color: alpha(ACTIVE_COLOR, 0.4),
                    }}
                  />
                </Box>
              )}

              {/* Text Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {suggestion.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.75rem",
                    textTransform: "capitalize",
                    color: alpha(ACTIVE_COLOR, 0.7),
                    display: "block",
                    mt: 0.25,
                  }}
                >
                  {suggestion.type}
                </Typography>
                {suggestion.price && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.7rem",
                      color: theme.palette.text.secondary,
                      display: "block",
                      mt: 0.25,
                    }}
                  >
                    ${suggestion.price}
                  </Typography>
                )}
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  };

  // Mobile Search UI
  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setIsSearchOpen(true)}
          size="small"
          sx={{
            color: theme.palette.text.primary,
            transition: "all 0.2s ease",
            "&:hover": {
              color: ACTIVE_COLOR,
              backgroundColor: alpha(ACTIVE_COLOR, 0.1),
              transform: "scale(1.05)",
            },
          }}
        >
          <SearchIcon sx={{ fontSize: "22px" }} />
        </IconButton>

        <Drawer
          anchor="top"
          open={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.background.paper,
              backdropFilter: "blur(10px)",
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              maxHeight: "90vh",
              overflowY: "auto",
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  border: `1px solid ${alpha(ACTIVE_COLOR, 0.2)}`,
                  borderRadius: "25px",
                  px: 2,
                  py: 0.5,
                  backgroundColor: alpha(ACTIVE_COLOR, 0.02),
                }}
              >
                <SearchIcon sx={{ color: alpha(ACTIVE_COLOR, 0.6), mr: 1 }} />
                <InputBase
                  autoFocus
                  placeholder="Search for cats, products, or articles..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSubmitSearch(searchTerm);
                    }
                  }}
                  fullWidth
                  sx={{
                    fontSize: "0.9rem",
                    "& input": {
                      padding: "10px 0",
                    },
                  }}
                />
                {searchTerm && (
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    sx={{ p: 0.5 }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </Paper>
              <IconButton
                onClick={() => {
                  setIsSearchOpen(false);
                  setShowSuggestions(false);
                }}
                sx={{
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    color: ACTIVE_COLOR,
                    backgroundColor: alpha(ACTIVE_COLOR, 0.1),
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Mobile Suggestions */}
            {showSuggestions && (
              <Paper
                elevation={0}
                sx={{
                  border: `1px solid ${alpha(ACTIVE_COLOR, 0.15)}`,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <SuggestionsDropdown />
              </Paper>
            )}
          </Box>
        </Drawer>
      </>
    );
  }

  // Desktop Search UI
  return (
    <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
      <Box sx={{ position: "relative", width: "fit-content" }}>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            border: `1px solid ${alpha(ACTIVE_COLOR, 0.15)}`,
            borderRadius: "30px",
            px: 1.5,
            py: 0.3,
            backgroundColor: alpha(ACTIVE_COLOR, 0.02),
            transition: "all 0.3s ease",
            width: searchTerm ? "280px" : "220px",
            "&:hover": {
              borderColor: alpha(ACTIVE_COLOR, 0.4),
              backgroundColor: alpha(ACTIVE_COLOR, 0.04),
              width: "280px",
            },
            "&:focus-within": {
              borderColor: ACTIVE_COLOR,
              backgroundColor: alpha(ACTIVE_COLOR, 0.04),
              width: "320px",
            },
          }}
        >
          <SearchIcon sx={{ color: alpha(ACTIVE_COLOR, 0.6), fontSize: "20px" }} />
          <InputBase
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmitSearch(searchTerm);
              }
            }}
            onFocus={() => searchTerm && setShowSuggestions(true)}
            sx={{
              ml: 1,
              flex: 1,
              fontSize: "0.85rem",
              "& input": {
                padding: "8px 0",
              },
            }}
          />
          {searchTerm && (
            <IconButton
              size="small"
              onClick={handleClear}
              sx={{ p: 0.5, ml: 0.5 }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>

        {/* Desktop Suggestions Dropdown */}
        {showSuggestions && (
          <Paper
            elevation={0}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              mt: 0.5,
              maxWidth: "320px",
              zIndex: 1000,
              border: `1px solid ${alpha(ACTIVE_COLOR, 0.15)}`,
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: theme.palette.background.paper,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <SuggestionsDropdown />
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;