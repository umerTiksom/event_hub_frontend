import { useEffect, useState } from "react";

import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EventCard from "../components/EventCards";
import api from "../api/axios";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch events from Rails API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/events");

        // API direct array ya { events: [...] } return kar sakti hai
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.events || [];

        // Rails fields ko existing React EventCard ke format mein convert karo
        const formattedEvents = data.map((event) => ({
          ...event,
          id: event.id ?? event.event_id,
          title: event.title ?? event.name ?? "",
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

        setEvents(formattedEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);
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

  // Categories API events se generate hongi
  const categories = [
    "All",
    ...new Set(
      events
        .map((event) => event.category)
        .filter((category) => category && category !== "Uncategorized"),
    ),
  ];

  // Search aur category filtering
  const filteredEvents = events.filter((event) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ bgcolor: "black", color: "white", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Page Heading */}
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography
            variant="subtitle2"
            sx={{ color: "#60a5fa", fontWeight: 700 }}
          >
            DISCOVER & CONNECT
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "4rem" },
            }}
          >
            Explore Events
          </Typography>

          <Typography
            variant="h6"
            sx={{ paddingTop: 2, color: "#94a3b8", maxWidth: 600 }}
          >
            Discover workshops, meetups, and exciting events. Find your next
            learning opportunity with EventHub.
          </Typography>
        </Stack>

        {/* Search and Category Filter */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by event name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#94a3b8",
                bgcolor: "#151e30",
                borderRadius: 2,
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#475569" },
                "&.Mui-focused fieldset": { borderColor: "#2563eb" },
              },
              "& input::placeholder": {
                color: "#94a3b8",
                opacity: 1,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{
              minWidth: { xs: "100%", sm: 200 },
              "& .MuiOutlinedInput-root": {
                color: "white",
                bgcolor: "#111827",
                borderRadius: 2,
                "& fieldset": { borderColor: "#334155" },
              },
              "& .MuiSvgIcon-root": { color: "white" },
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#60a5fa" }} />
          </Box>
        ) : error ? (
          /* Error State */
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="error" variant="h6">
              {error}
            </Typography>

            <Chip
              label="Retry"
              clickable
              onClick={() => window.location.reload()}
              sx={{
                mt: 2,
                color: "white",
                bgcolor: "#1e3a8a",
              }}
            />
          </Box>
        ) : (
          <>
            {/* Results Count */}
            <Stack
              direction="column"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Showing {filteredEvents.length}{" "}
                {filteredEvents.length === 1 ? "event" : "events"}
              </Typography>

              {selectedCategory !== "All" && (
                <Chip
                  label={selectedCategory}
                  onDelete={() => setSelectedCategory("All")}
                  sx={{
                    color: "#bfdbfe",
                    bgcolor: "#1e3a8a",
                  }}
                />
              )}
            </Stack>

            {/* Event Cards */}
            {filteredEvents.length > 0 ? (
              <Grid container spacing={3}>
                {filteredEvents.map((event) => (
                  <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <EventCard
                      id={event.id}
                      title={event.name}
                      description={event.description}
                      category={event.category}
                      location={event.location}
                      date={event.date}
                      image={event.image}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              /* No Events Found */
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  px: 2,
                  border: "1px solid #334155",
                  borderRadius: 3,
                  bgcolor: "#111827",
                }}
              >
                <SearchIcon sx={{ fontSize: 48, color: "#64748b", mb: 1 }} />

                <Typography variant="h5" fontWeight={700} gutterBottom>
                  No events found
                </Typography>

                <Typography sx={{ color: "#94a3b8", mb: 2 }}>
                  Try another search term or select a different category.
                </Typography>

                <Chip
                  label="Clear filters"
                  clickable
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default Events;
