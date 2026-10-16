import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

function Navbar() {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        bgcolor: "black",
        color: "white",
        borderBottom: 0.1,
        borderColor: "rgb(52, 51, 51)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ gap: 2, justifyContent: "space-between" }}
        >
          <Box
            component={Link}
            onClick={() => navigate(`/`)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <EventIcon sx={{ color: "#2563eb", fontSize: 32 }} />

            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e40af" }}>
              EventHub
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              component={Link}
              onClick={() => navigate(`/`)}
              sx={{
                color: currentPath === "/" ? "white" : "#94a3b8",
                "&:hover": { color: "white" },
              }}
            >
              Home
            </Button>

            <Button
              component={Link}
              onClick={() => navigate(`/events`)}
              sx={{
                color: currentPath.startsWith("/events") ? "white" : "#94a3b8",
                "&:hover": { color: "white" },
              }}
            >
              Events
            </Button>

            <Button
              component={Link}
              onClick={() => navigate(`/login`)}
              variant="contained"
              sx={{
                bgcolor: "#2563eb",
                borderRadius: 2,
                px: 2,
                "&:hover": { bgcolor: "#1d4ed8" },
              }}
            >
              Login
            </Button>

            <Button
              component={Link}
              onClick={() => navigate(`/register`)}
              variant="outlined"
              sx={{
                color: currentPath === "/register" ? "white" : "#94a3b8",
                borderColor: currentPath === "/register" ? "white" : "grey",
                borderRadius: 2,
                px: 2,
                "&:hover": {
                  color: "white",
                  borderColor: "white",
                },
              }}
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
