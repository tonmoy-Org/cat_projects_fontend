import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  alpha,
  useTheme,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useScrollTrigger,
  Slide,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import PetsIcon from "@mui/icons-material/Pets";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArticleIcon from "@mui/icons-material/Article";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import GradientButton from "../components/ui/GradientButton";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../auth/AuthProvider";
import logo from "../public/High-quality logo of.png";
import Footer from "./Footer";

// HideOnScroll component for hiding AppBar on scroll
function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
}

export const PublicLayout = ({ children, title, description }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State for mobile drawer
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // State for user menu
  const [anchorEl, setAnchorEl] = useState(null);
  const userMenuOpen = Boolean(anchorEl);

  // Professional color palette
  const ACTIVE_COLOR = "#43376A"; // Deep purple
  const HOVER_COLOR = alpha("#43376A", 0.08);
  const LIGHT_BG = alpha("#43376A", 0.04);

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate("/login");
  };

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleMobileDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
    handleUserMenuClose();
  };

  const isActive = (path) => location.pathname === path;

  // Navigation items with icons
  const navItems = [
    { label: "Home", path: "/", icon: <HomeIcon fontSize="small" /> },
    { label: "About", path: "/about", icon: <InfoIcon fontSize="small" /> },
    { label: "Cats", path: "/cats", icon: <PetsIcon fontSize="small" /> },
    {
      label: "Product",
      path: "/product",
      icon: <ShoppingBagIcon fontSize="small" />,
    },
    { label: "Blog", path: "/blog", icon: <ArticleIcon fontSize="small" /> },
    {
      label: "Video",
      path: "/videos",
      icon: <VideoLibraryIcon fontSize="small" />,
    },
    {
      label: "Contact",
      path: "/contact",
      icon: <ContactMailIcon fontSize="small" />,
    },
  ];

  // User menu items for authenticated users
  const userMenuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: <PersonIcon fontSize="small" />,
    },
    {
      label: "Logout",
      action: handleLogout,
      icon: <LogoutIcon fontSize="small" />,
    },
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(135deg, ${alpha("#1a1a1a", 1)} 0%, ${alpha("#2d2d2d", 1)} 100%)`
            : `linear-gradient(135deg, ${alpha("#f8fafc", 1)} 0%, ${alpha("#f1f5f9", 1)} 100%)`,
      }}
    >
      {title && description && (
        <Helmet>
          <title>{title} | FatherOfMeow</title>
          <meta name="description" content={description} />
        </Helmet>
      )}

      {/* App Bar with Hide on Scroll */}
      <HideOnScroll>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            boxShadow: "none",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            py: { xs: 0.8, md: 1 },
            px: { xs: 1.5, md: 0 },
          }}
        >
          <Container maxWidth="lg">
            <Toolbar
              disableGutters
              sx={{
                justifyContent: "space-between",
                minHeight: { xs: 56, sm: 64 },
              }}
            >
              {/* Left Side - Mobile Menu Icon (3 bars) */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {isMobile && (
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleMobileDrawerToggle}
                    sx={{
                      color: theme.palette.text.primary,
                      p: 0.5,
                      mr: 1,
                      "&:hover": {
                        backgroundColor: HOVER_COLOR,
                      },
                    }}
                  >
                    <MenuIcon fontSize="medium" />
                  </IconButton>
                )}

                {/* Logo - Visible on mobile next to menu, on desktop as left element */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                    "&:hover": {
                      opacity: 0.9,
                    },
                  }}
                  onClick={() => handleNavigation("/")}
                >
                  <Box
                    component="img"
                    src={logo}
                    alt="FatherOfMeow Logo"
                    sx={{
                      height: 'auto',
                      width: { xs: 100, sm: 150 },
                      display: "block",
                    }}
                  />
                </Box>
              </Box>

              {/* Desktop Navigation Links - Hidden on Mobile */}
              {!isMobile && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {navItems.map((item) => (
                    <Button
                      key={item.label}
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        color: isActive(item.path)
                          ? ACTIVE_COLOR
                          : theme.palette.text.primary,
                        fontSize: "0.9rem",
                        fontWeight: isActive(item.path) ? 600 : 500,
                        textTransform: "none",
                        px: 1.5,
                        py: 0.75,
                        borderRadius: "20px",
                        position: "relative",
                        "&:hover": {
                          color: ACTIVE_COLOR,
                          backgroundColor: HOVER_COLOR,
                        },
                        ...(isActive(item.path) && {
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: 4,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            backgroundColor: ACTIVE_COLOR,
                          },
                        }),
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Box>
              )}

              {/* Right Side - Authentication */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {user ? (
                  <>
                    {/* User Avatar for Desktop */}
                    <IconButton
                      onClick={handleUserMenuClick}
                      size="small"
                      sx={{
                        p: 0,
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                        transition: "transform 0.2s",
                      }}
                    >
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                        sx={{
                          "& .MuiBadge-badge": {
                            backgroundColor: "#4caf50",
                            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: { xs: 36, sm: 38 },
                            height: { xs: 36, sm: 38 },
                            bgcolor: ACTIVE_COLOR,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: `2px solid ${alpha(ACTIVE_COLOR, 0.2)}`,
                          }}
                          src={user?.photoURL}
                        >
                          {getUserInitials()}
                        </Avatar>
                      </Badge>
                    </IconButton>

                    {/* User Menu */}
                    <Menu
                      anchorEl={anchorEl}
                      open={userMenuOpen}
                      onClose={handleUserMenuClose}
                      onClick={handleUserMenuClose}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                      PaperProps={{
                        sx: {
                          mt: 1.5,
                          minWidth: 220,
                          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                          borderRadius: 2,
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          px: 2,
                          py: 1.5,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          background: LIGHT_BG,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, fontSize: "0.9rem" }}
                        >
                          {user?.name || "User"}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", fontSize: "0.75rem" }}
                        >
                          {user?.email}
                        </Typography>
                      </Box>
                      {userMenuItems.map((item) => (
                        <MenuItem
                          key={item.label}
                          onClick={() => {
                            if (item.action) {
                              item.action();
                            } else if (item.path) {
                              navigate(item.path);
                            }
                            handleUserMenuClose();
                          }}
                          sx={{
                            gap: 1.5,
                            py: 1,
                            px: 2,
                            fontSize: "0.85rem",
                            "&:hover": {
                              backgroundColor: HOVER_COLOR,
                            },
                            ...(item.label === "Logout" && {
                              color: theme.palette.error.main,
                              "&:hover": {
                                backgroundColor: alpha(
                                  theme.palette.error.main,
                                  0.08,
                                ),
                              },
                            }),
                            ...(item.label !== "Logout" &&
                              isActive(item.path) && {
                              color: ACTIVE_COLOR,
                              backgroundColor: LIGHT_BG,
                            }),
                          }}
                        >
                          <Box
                            sx={{
                              color:
                                item.label === "Logout"
                                  ? "inherit"
                                  : ACTIVE_COLOR,
                            }}
                          >
                            {item.icon}
                          </Box>
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                              fontSize: "0.85rem",
                              fontWeight: item.label === "Logout" ? 400 : 500,
                            }}
                          />
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  // Sign In Button for Desktop
                  !isMobile && (
                    <GradientButton
                      variant="contained"
                      onClick={() => navigate("/login")}
                      size="small"
                      sx={{
                        fontSize: "0.85rem",
                        py: 0.8,
                        px: 2.5,
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "20px",
                        background: `linear-gradient(135deg, ${ACTIVE_COLOR} 0%, ${alpha(ACTIVE_COLOR, 0.8)} 100%)`,
                        boxShadow: `0 4px 12px ${alpha(ACTIVE_COLOR, 0.3)}`,
                        "&:hover": {
                          background: `linear-gradient(135deg, ${alpha(ACTIVE_COLOR, 0.9)} 0%, ${ACTIVE_COLOR} 100%)`,
                          boxShadow: `0 6px 16px ${alpha(ACTIVE_COLOR, 0.4)}`,
                        },
                      }}
                    >
                      Sign In
                    </GradientButton>
                  )
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer - Left Side with close button */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerClose}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: theme.palette.background.paper,
            backgroundImage: `linear-gradient(135deg, ${alpha(ACTIVE_COLOR, 0.02)} 0%, ${alpha(ACTIVE_COLOR, 0.05)} 100%)`,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Drawer Header with Logo and Close Button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              pb: 1,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
              onClick={() => handleNavigation("/")}
            >
              <Box
                component="img"
                src={logo}
                alt="FatherOfMeow Logo"
                sx={{
                  height: 28,
                  width: "auto",
                }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: ACTIVE_COLOR,
                  letterSpacing: "-0.01em",
                }}
              >
                FatherOfMeow
              </Typography>
            </Box>
            <IconButton
              onClick={handleMobileDrawerClose}
              size="small"
              sx={{
                color: theme.palette.text.primary,
                p: 0.5,
                "&:hover": {
                  backgroundColor: HOVER_COLOR,
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Mobile Navigation Links with icons */}
          <List sx={{ py: 0 }}>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: 1.5,
                    gap: 1.5,
                    ...(isActive(item.path) && {
                      bgcolor: alpha(ACTIVE_COLOR, 0.1),
                      color: ACTIVE_COLOR,
                      "&:hover": {
                        bgcolor: alpha(ACTIVE_COLOR, 0.15),
                      },
                    }),
                    "&:hover": {
                      bgcolor: HOVER_COLOR,
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: isActive(item.path) ? ACTIVE_COLOR : "inherit",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.9rem",
                      fontWeight: isActive(item.path) ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Mobile Authentication Actions */}
          {user ? (
            <>
              <Divider sx={{ my: 1.5 }} />
              <List sx={{ py: 0 }}>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={handleLogout}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      px: 1.5,
                      gap: 1.5,
                      color: theme.palette.error.main,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.error.main, 0.08),
                      },
                    }}
                  >
                    <LogoutIcon sx={{ fontSize: "1.1rem" }} />
                    <ListItemText
                      primary="Logout"
                      primaryTypographyProps={{
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </>
          ) : (
            <Box sx={{ p: 1.5, mt: 1 }}>
              <GradientButton
                fullWidth
                variant="contained"
                onClick={() => {
                  navigate("/login");
                  setMobileDrawerOpen(false);
                }}
                size="small"
                sx={{
                  fontSize: "0.85rem",
                  py: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "20px",
                  background: `linear-gradient(135deg, ${ACTIVE_COLOR} 0%, ${alpha(ACTIVE_COLOR, 0.8)} 100%)`,
                }}
              >
                Sign In
              </GradientButton>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Toolbar spacer to prevent content from hiding behind fixed AppBar */}
      <Toolbar id="back-to-top-anchor" sx={{ minHeight: { xs: 56, sm: 64 } }} />

      {/* Main Content */}
      <Box sx={{ flex: 1, pt: 0 }}>{children}</Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};
