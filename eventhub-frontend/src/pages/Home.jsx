import { useEffect, useState } from "react";

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CodeIcon from "@mui/icons-material/Code";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";

import CategoryBox from "../components/home/CategoryBox";
import EventCard from "../components/EventCards";
import api from "../api/axios";

const categories = [
  { name: "Technology", icon: <CodeIcon /> },
  { name: "Business", icon: <BusinessCenterIcon /> },
  { name: "Music", icon: <MusicNoteIcon /> },
  { name: "Sports", icon: <SportsBasketballIcon /> },
];

function Home() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch featured events from Rails API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch the first page of events
        const response = await api.get("/events", {
          params: { page: 1 },
        });

        // Rails response: { status, data, pagination }
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        // Convert Rails event fields to EventCard props
        const formattedEvents = data.map((event) => ({
          ...event,
          id: event.id ?? event.event_id,
          title: event.title ?? event.name ?? "",
          description: event.description ?? "",
          category:
            typeof event.category === "string"
              ? event.category
              : (event.category?.name ??
                event.category_name ??
                "Uncategorized"),
          location: event.location ?? "",
          date: event.date ?? "",
          image: event.image ?? event.image_url ?? "",
        }));

        // Display only 3 events on Home
        setEvents(formattedEvents.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch Home events:", err);

        setError(
          err.response?.data?.message ||
            "Events load nahi ho sake. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Box
      sx={{
        bgcolor: "black",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(120deg, #000149 0%, #0e1326 60%, #285be5 100%)",
          color: "white",
          py: { xs: 8, md: 20 },
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ maxWidth: { xs: "100%", md: "60vw" } }}>
            <Chip
              label="Discover | Connect | Experience."
              sx={{
                mb: 3,
                color: "#bfdbfe",
                bgcolor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.5rem", md: "6rem" },
                lineHeight: 1.08,
              }}
            >
              Find Your Next
              <Box component="span" sx={{ color: "#60a5fa" }}>
                {" "}
                Great Experience
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                fontSize: { xs: "1rem", md: "1.15rem" },
                lineHeight: 1.8,
                py: 4,
                mb: 4,
                maxWidth: 550,
              }}
            >
              Discover exciting events, meet new people, and create
              unforgettable memories. Your next experience starts here with
              EventHub.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                onClick={() => navigate("/events")}
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: "#2563eb",
                  py: 2,
                  px: 4,
                  borderRadius: 10,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#0d38ad" },
                }}
              >
                Explore Events
              </Button>

              <Button
                onClick={() => navigate("/register")}
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "#64748b",
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Join EventHub
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="xl" sx={{ py: 7 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 750, mb: 1, color: "white" }}
        >
          Explore Categories
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            mb: 4,
            color: "grey",
            maxWidth: { sm: "100%", md: "45vw" },
            py: 3,
          }}
        >
          Discover events that match your interests. Browse through a variety of
          categories to find exciting experiences, connect with like-minded
          people, and explore opportunities that inspire you.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {categories.map((category) => (
            <CategoryBox
              key={category.name}
              name={category.name}
              icon={category.icon}
              onClick={() =>
                navigate(
                  `/events?category=${encodeURIComponent(category.name)}`,
                )
              }
            />
          ))}
        </Box>
      </Container>

      {/* Featured Events Section */}
      <Box sx={{ py: 7 }}>
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              mb: 4,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 750,
                  mb: 1,
                  color: "white",
                }}
              >
                Featured Events
              </Typography>

              <Typography variant="subtitle1" sx={{ color: "gray" }}>
                Discover experiences worth adding to your calendar.
              </Typography>
            </Box>

            <Button
              onClick={() => navigate("/events")}
              endIcon={<ArrowForwardIcon />}
              sx={{
                fontWeight: 650,
                color: "#2563eb",
                px: 3,
                textDecoration: "none",
                alignSelf: { xs: "flex-start", sm: "center" },
                "&:hover": {
                  textDecoration: "underline",
                  textUnderlineOffset: "5px",
                  backgroundColor: "transparent",
                },
              }}
            >
              View All Events
            </Button>
          </Stack>

          {/* Loading, Error and Events */}
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 8,
              }}
            >
              <CircularProgress sx={{ color: "#60a5fa" }} />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>

              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                sx={{ color: "white", borderColor: "#64748b" }}
              >
                Retry
              </Button>
            </Box>
          ) : events.length > 0 ? (
            <Grid container spacing={3}>
              {events.map((event) => (
                <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <EventCard
                    id={event.id}
                    title={event.title}
                    description={event.description}
                    location={event.location}
                    category={event.category}
                    date={event.date}
                    image={event.image}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              sx={{
                color: "#94a3b8",
                textAlign: "center",
                py: 6,
              }}
            >
              No events available right now.
            </Typography>
          )}
        </Container>
      </Box>

      {/* Call To Action */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box
          sx={{
            background:
              "linear-gradient(120deg, #000149 0%, #0e1326 60%, #285be5 100%)",
            color: "white",
            borderRadius: 4,
            p: { xs: 4, md: 7 },
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 750,
              mb: 2,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
            }}
          >
            Be Part of Something Amazing
          </Typography>

          <Typography
            sx={{
              color: "#cbd5e1",
              maxWidth: 600,
              mx: "auto",
              mb: 3,
              lineHeight: 1.8,
            }}
          >
            Join EventHub to discover upcoming events and connect with people
            who share your interests.
          </Typography>

          <Button
            onClick={() => navigate("/register")}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: "#2563eb",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 650,
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#0f172a",
          color: "#cbd5e1",
          py: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          © 2026 EventHub. Discover experiences that bring us together.
        </Typography>
      </Box>
    </Box>
  );
}

export default Home;
