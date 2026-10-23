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
  Button,
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

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalCount: 0,
    totalPages: 0,
  });

  // Fetch events from Rails API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page: 1,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (selectedCategory !== "All") {
          params.category = selectedCategory;
        }

        const response = await api.get("/events", { params });

        console.log("Rails API Response:", response.data);

        // Rails returns { status, data, pagination }
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        const formattedEvents = data.map((event) => ({
          ...event,
          id: event.id ?? event.event_id,
          title: event.title ?? event.name ?? "",
          name: event.name ?? event.title ?? "",
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

        setEvents(formattedEvents);

        setPagination({
          currentPage: response.data.pagination?.current_page ?? 1,
          totalCount: response.data.pagination?.total_count ?? data.length,
          totalPages: response.data.pagination?.total_pages ?? 1,
        });

        console.log("Fetched Events:", formattedEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);

        setError(
          err.response?.data?.message ||
            "Events load nahi ho sake. Please try again.",
        );

        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search, selectedCategory]);

  // Generate category options from fetched events
  const categories = [
    "All",
    ...new Set(
      events
        .map((event) => event.category)
        .filter((category) => category && category !== "Uncategorized"),
    ),
  ];

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
  };

  return (
    <Box
      sx={{
        bgcolor: "black",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Page Heading */}
        <Stack spacing={1} sx={{ mb: 4 }} direction="column">
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
            sx={{
              pt: 2,

              maxWidth: 600,
              fontWeight: 400,
            }}
          >
            Discover workshops, meetups, and exciting events. Find your next
            learning opportunity with EventHub.
          </Typography>

          <Button
            sx={{
              bgcolor: "#022653",
              p: { sm: 3, md: 2 },
              color: "rgb(183, 183, 183)",
              fontWeight: 700,
              maxWidth: "sm",
            }}
          >
            Create new event
          </Button>
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
            placeholder="Search by event name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                bgcolor: "#151e30",
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "#334155",
                },
                "&:hover fieldset": {
                  borderColor: "#475569",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2563eb",
                },
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
                "& fieldset": {
                  borderColor: "#334155",
                },
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
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
          /* Error State */
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="error" variant="h6" sx={{ mb: 2 }}>
              {error}
            </Typography>

            <Chip
              label="Retry"
              clickable
              onClick={() => {
                setSearch((previous) => previous);
                // Trigger a fresh request even when search is unchanged
                window.location.reload();
              }}
              sx={{
                color: "white",
                bgcolor: "#1e3a8a",
              }}
            />
          </Box>
        ) : (
          <>
            {/* Results Count */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Showing {events.length} of {pagination.totalCount}{" "}
                {pagination.totalCount === 1 ? "event" : "events"}
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
            {events.length > 0 ? (
              <Grid container spacing={3}>
                {events.map((event) => (
                  <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <EventCard
                      id={event.id}
                      title={event.title}
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
                <SearchIcon
                  sx={{
                    fontSize: 48,
                    color: "#64748b",
                    mb: 1,
                  }}
                />

                <Typography variant="h5" fontWeight={700} gutterBottom>
                  No events found
                </Typography>

                <Typography sx={{ color: "#94a3b8", mb: 2 }}>
                  Try another search term or select a different category.
                </Typography>

                <Chip
                  label="Clear filters"
                  clickable
                  onClick={clearFilters}
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
