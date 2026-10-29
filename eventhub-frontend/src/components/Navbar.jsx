import { useState, useEffect } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Avatar,
  Tooltip,
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";

import EventIcon from "@mui/icons-material/Event";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const currentPath = location.pathname;
  const isLoggedIn = Boolean(user && localStorage.getItem("token"));

  useEffect(() => {
    const loadUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")) || null);
      } catch {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("authChanged", loadUser);

    return () => {
      window.removeEventListener("authChanged", loadUser);
    };
  }, [location.pathname]);

  const handleMenuOpen = () => {
    setMobileOpen(true);
  };

  const handleMenuClose = () => {
    setMobileOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    handleMenuClose();
    navigate("/login");
  };

  // Get first letter of user's name
  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "?";

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Events", path: "/events" },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return currentPath === "/";
    }

    return currentPath.startsWith(path);
  };

  const navButtonStyles = (path) => ({
    color: isActive(path) ? "white" : "#94a3b8",
    fontWeight: isActive(path) ? 700 : 500,
    textTransform: "none",
    "&:hover": {
      color: "white",
      bgcolor: "rgba(255,255,255,0.06)",
    },
  });

  // User avatar
  const UserAvatar = () => (
    <Tooltip title="View Profile">
      <IconButton
        onClick={() => handleNavigation("/profile")}
        aria-label="Open user profile"
        sx={{ p: 0.5 }}
      >
        <Avatar
          sx={{
            width: 42,
            height: 42,
            bgcolor: "#1032a1",
            color: "white",
            fontWeight: 800,
            border: "2px solid #0f65e7",
            cursor: "pointer",
          }}
        >
          {userInitial}
        </Avatar>
      </IconButton>
    </Tooltip>
  );
  return (
    <>
      <AppBar
        position="sticky"
        elevation={4}
        sx={{
          bgcolor: "#000",
          color: "white",
          borderBottom: "1px solid rgb(52, 51, 51)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 64, md: 76 },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* Logo */}
            <Box
              onClick={() => handleNavigation("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <EventIcon
                sx={{
                  color: "#2563eb",
                  fontSize: { xs: 28, sm: 32 },
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#3b82f6",
                  fontSize: { xs: "1.2rem", sm: "1.4rem" },
                }}
              >
                EventHub
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { md: 1, lg: 2 },
                }}
              >
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    onClick={() => handleNavigation(link.path)}
                    sx={navButtonStyles(link.path)}
                  >
                    {link.label}
                  </Button>
                ))}

                {isLoggedIn ? (
                  <>
                    <UserAvatar />

                    <Button
                      onClick={handleLogout}
                      variant="outlined"
                      sx={{
                        color: "#94a3b8",
                        borderColor: "grey.700",
                        borderRadius: 2,
                        px: 2,
                        textTransform: "none",
                        "&:hover": {
                          color: "white",
                          borderColor: "white",
                        },
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => handleNavigation("/login")}
                      variant="contained"
                      sx={{
                        bgcolor: "#2563eb",
                        borderRadius: 2,
                        px: 2.5,
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: "#1d4ed8",
                        },
                      }}
                    >
                      Login
                    </Button>

                    <Button
                      onClick={() => handleNavigation("/register")}
                      variant="outlined"
                      sx={{
                        color: isActive("/register") ? "white" : "#94a3b8",
                        borderColor: isActive("/register")
                          ? "white"
                          : "grey.700",
                        borderRadius: 2,
                        px: 2.5,
                        textTransform: "none",
                        "&:hover": {
                          color: "white",
                          borderColor: "white",
                        },
                      }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="top"
        open={mobileOpen && isMobile}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              width: "100%",
              height: "100dvh",
              bgcolor: "#000",
              color: "white",
            },
          },
        }}
      >
        <Box
          sx={{
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            p: { xs: 2.5, sm: 4 },
            boxSizing: "border-box",
          }}
        >
          {/* Mobile Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: { xs: 5, sm: 7 },
            }}
          >
            <Box
              onClick={() => handleNavigation("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <EventIcon sx={{ color: "#2563eb", fontSize: 32 }} />

              <Typography
                variant="h6"
                sx={{ color: "#3b82f6", fontWeight: 700 }}
              >
                EventHub
              </Typography>
            </Box>

            <IconButton
              onClick={handleMenuClose}
              sx={{
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
              aria-label="Close navigation menu"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                fullWidth
                onClick={() => handleNavigation(link.path)}
                sx={{
                  justifyContent: "flex-start",
                  color: isActive(link.path) ? "#60a5fa" : "#d1d5db",
                  fontSize: "1.2rem",
                  fontWeight: isActive(link.path) ? 700 : 500,
                  py: 2,
                  px: 2,
                  textTransform: "none",
                  borderRadius: 2,
                  bgcolor: isActive(link.path)
                    ? "rgba(37,99,235,0.15)"
                    : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Mobile Authentication Actions */}
          <Box
            sx={{
              mt: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              pt: 5,
              pb: 2,
            }}
          >
            {isLoggedIn ? (
              <>
                <UserAvatar />

                <Typography
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    overflowWrap: "anywhere",
                  }}
                >
                  {user?.name}
                </Typography>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{
                    color: "white",
                    borderColor: "#4b5563",
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "white",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleNavigation("/login")}
                  sx={{
                    bgcolor: "#2563eb",
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      bgcolor: "#1d4ed8",
                    },
                  }}
                >
                  Login
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleNavigation("/register")}
                  sx={{
                    color: "white",
                    borderColor: "#4b5563",
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
