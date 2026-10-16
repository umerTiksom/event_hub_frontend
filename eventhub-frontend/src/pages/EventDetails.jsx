import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Grid,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

import events from "../data/events.json";

const API_BASE_URL = "http://localhost:3000";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [registered, setRegistered] = useState(false);

  const event = events.find((item) => item.id === Number(id));

  const formattedDate = event?.date
    ? new Date(`${event.date}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not available";

  // Register for Event
  const handleRegister = async () => {
    const token = localStorage.getItem("token");

    // If the user is not logged in, redirect to Login
    if (!token) {
      navigate("/login", {
        state: { from: location.pathname },
      });
      return;
    }

    if (!event || loading || registered) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/events/${event.id}/registrations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Registration failed. Please try again.",
        );
      }

      setRegistered(true);
      setMessage("You have successfully registered for this event!");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error.message || "Unable to connect to the server. Please try again.",
      );
      setMessageType("error");
    } finally {
      // Stop the loading wheel after the API responds
      setLoading(false);
    }
  };

  // Event Not Found
  if (!event) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#000",
          px: 2,
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
            Event Not Found
          </Typography>

          <Typography sx={{ color: "#94a3b8" }} textAlign="center">
            This event does not exist or is no longer available.
          </Typography>

          <Button variant="contained" onClick={() => navigate("/events")}>
            Browse Events
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#000",
        color: "white",
        pb: { xs: 5, md: 9 },
      }}
    >
      <Container maxWidth="xl">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/events")}
          sx={{
            color: "#cbd5e1",
            mt: { xs: 2, md: 4 },
            mb: 3,
            "&:hover": {
              color: "#60a5fa",
              bgcolor: "#111827",
            },
          }}
        >
          Back to Events
        </Button>

        {/* Event Hero Image */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 230, sm: 350, md: 460 },
            overflow: "hidden",
            borderRadius: { xs: 2, md: 4 },
            bgcolor: "#111827",
          }}
        >
          <Box
            component="img"
            src={event.image}
            alt={event.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(3,7,18,0.9), transparent 65%)",
            }}
          />

          <Chip
            label={event.category}
            sx={{
              position: "absolute",
              top: { xs: 14, md: 24 },
              left: { xs: 14, md: 24 },
              bgcolor: "#2563eb",
              color: "white",
              fontWeight: 700,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 18, md: 30 },
              left: { xs: 18, md: 32 },
              right: { xs: 18, md: 32 },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: {
                  xs: "1.65rem",
                  sm: "2.4rem",
                  md: "3rem",
                },
                lineHeight: 1.2,
                fontWeight: 800,
                overflowWrap: "anywhere",
              }}
            >
              {event.title}
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        <Grid
          container
          spacing={{ xs: 3, md: 5 }}
          sx={{ mt: { xs: 1, md: 2 } }}
        >
          {/* Left Side: Event Information */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: "1.3rem", md: "1.6rem" },
                }}
              >
                About This Event
              </Typography>

              <Typography
                sx={{
                  color: "#cbd5e1",
                  lineHeight: 1.9,
                  overflowWrap: "anywhere",
                }}
              >
                {event.description ||
                  "More information about this event will be available soon."}
              </Typography>

              <Divider sx={{ borderColor: "#1f2937", my: 4 }} />

              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                Event Information
              </Typography>

              <Stack spacing={3}>
                {/* Date */}
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <CalendarMonthIcon sx={{ color: "#60a5fa" }} />

                  <Box>
                    <Typography color="#94a3b8" variant="body2">
                      Date
                    </Typography>

                    <Typography sx={{ fontWeight: 600 }}>
                      {formattedDate}
                    </Typography>
                  </Box>
                </Stack>

                {/* Location */}
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <LocationOnIcon sx={{ color: "#60a5fa" }} />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography color="#94a3b8" variant="body2">
                      Location
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {event.location || "Location not available"}
                    </Typography>
                  </Box>
                </Stack>

                {/* Category */}
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <EventAvailableIcon sx={{ color: "#60a5fa" }} />

                  <Box>
                    <Typography color="#94a3b8" variant="body2">
                      Category
                    </Typography>

                    <Typography sx={{ fontWeight: 600 }}>
                      {event.category}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Grid>

          {/* Right Side: Registration Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                bgcolor: "#111827",
                border: "1px solid #1f2937",
                borderRadius: 3,
                p: { xs: 2.5, md: 3 },
                position: { md: "sticky" },
                top: { md: 100 },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Attend This Event
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  mb: 3,
                }}
              >
                Join this event and be part of the experience.
              </Typography>

              <Divider sx={{ borderColor: "#334155", mb: 3 }} />

              {/* Success or Error Message */}
              {message && (
                <Alert severity={messageType} sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}

              {/* Registration Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || registered}
                startIcon={loading ? null : <EventAvailableIcon />}
                onClick={handleRegister}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "#2563eb",
                  "&:hover": {
                    bgcolor: "#1d4ed8",
                  },
                  "&.Mui-disabled": {
                    bgcolor: registered ? "#166534" : "#334155",
                    color: "white",
                  },
                }}
              >
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                    }}
                  >
                    <CircularProgress
                      size={22}
                      thickness={5}
                      sx={{ color: "white" }}
                    />

                    <span>Registering...</span>
                  </Box>
                ) : registered ? (
                  "Registered Successfully"
                ) : (
                  "Register for Event"
                )}
              </Button>

              <Typography
                variant="caption"
                sx={{
                  color: "#94a3b8",
                  display: "block",
                  textAlign: "center",
                  mt: 2,
                }}
              >
                Login is required to register
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default EventDetails;
