import { useState } from "react";
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
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EventCard from "../components/EventCards";
import events from "../data/events.json";

function Events() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(events.map((event) => event.category))];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase());

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

        {/* Search and Category Filter  */}
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

                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#2563eb",
                },
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

        {/* Results Count */}
        <Stack
          direction="column"
          spacing={3}
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
                display: "flex",
                justifyContent: "space-between",
                color: "#bfdbfe",

                bgcolor: "#1e3a8a",

                maxWidth: "10%",
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
                  title={event.title}
                  category={event.category}
                  location={event.location}
                  date={event.date}
                  image={event.image}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
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
      </Container>
    </Box>
  );
}

export default Events;
