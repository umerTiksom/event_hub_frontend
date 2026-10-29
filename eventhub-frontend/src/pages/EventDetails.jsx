import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

import api from "../api/axios";
import RegisterEventBox from "../components/RegisterEventBox";

const formatEventDate = (date) => {
  if (!date) return "Date not available";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const normalizeEvent = (result) => {
  const data = result?.event ?? result?.data?.event ?? result?.data ?? result;

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid event data received from the server.");
  }

  const category =
    typeof data.category === "object" && data.category !== null
      ? data.category.name
      : (data.category_name ?? data.category);

  return {
    ...data,
    id: data.id ?? data.event_id,
    title: data.name ?? data.title ?? "Untitled Event",
    description: data.description ?? data.decsription ?? "",
    date: data.date,
    location: data.location,
    category: category ?? "Uncategorized",
    image: data.image_url ?? data.image ?? "",
  };
};

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchEvent = async () => {
      setFetching(true);
      setFetchError("");
      setEvent(null);

      try {
        const response = await api.get(`/events/${encodeURIComponent(id)}`);

        const formattedEvent = normalizeEvent(response.data);

        if (!formattedEvent.id) {
          throw new Error("Event ID is missing from the API response.");
        }

        if (active) {
          setEvent(formattedEvent);
        }
      } catch (error) {
        if (!active) return;

        setFetchError(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Unable to load event details.",
        );
      } finally {
        if (active) {
          setFetching(false);
        }
      }
    };

    if (!id) {
      setFetchError("Event ID is missing.");
      setFetching(false);
    } else {
      fetchEvent();
    }

    return () => {
      active = false;
    };
  }, [id]);

  if (fetching) {
    return (
      <PageState>
        <CircularProgress sx={{ color: "#60a5fa" }} />
        <Typography color="#cbd5e1">Loading event details...</Typography>
      </PageState>
    );
  }

  if (fetchError || !event) {
    return (
      <PageState>
        <Typography variant="h5" fontWeight={700}>
          Unable to Load Event
        </Typography>

        <Alert severity="error">
          {fetchError || "This event is not available."}
        </Alert>

        <Button variant="contained" onClick={() => navigate("/events")}>
          Browse Events
        </Button>
      </PageState>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#000",
        color: "#fff",
        pb: { xs: 5, md: 9 },
      }}
    >
      <Container maxWidth="xl">
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

        {/* Event Banner */}
        <Box
          sx={{
            position: "relative",
            height: { xs: 230, sm: 350, md: 460 },
            overflow: "hidden",
            borderRadius: { xs: 2, md: 4 },
            bgcolor: "#0b3daa",
          }}
        >
          {event.image ? (
            <Box
              component="img"
              src={event.image}
              alt={event.title}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                zIndex: 0,
              }}
            />
          ) : (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                zIndex: 1,
              }}
            >
              <EventAvailableIcon
                sx={{
                  fontSize: { xs: 60, sm: 72, md: 90 },
                  color: "#eaf0f8",
                }}
              />
            </Box>
          )}

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(3,7,18,0.95), transparent 70%)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />

          <Chip
            label={event.category}
            sx={{
              position: "absolute",
              top: { xs: 14, md: 24 },
              left: { xs: 14, md: 24 },
              bgcolor: "#4e82f1",
              color: "#fff",
              fontWeight: 700,
              zIndex: 3,
            }}
          />

          <Typography
            variant="h3"
            sx={{
              position: "absolute",
              bottom: { xs: 18, md: 30 },
              left: { xs: 18, md: 32 },
              right: { xs: 18, md: 32 },
              fontSize: {
                xs: "1.65rem",
                sm: "2.4rem",
                md: "3rem",
              },
              lineHeight: 1.2,
              fontWeight: 800,
              overflowWrap: "anywhere",
              zIndex: 3,
            }}
          >
            {event.title}
          </Typography>
        </Box>

        {/* Event Description and Registration */}
        <Grid
          container
          spacing={{ xs: 3, md: 5 }}
          sx={{ mt: { xs: 1, md: 2 } }}
        >
          <Grid size={{ xs: 12, md: 8 }}>
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
                whiteSpace: "pre-line",
              }}
            >
              {event.description ||
                "More information about this event will be available soon."}
            </Typography>

            <Divider sx={{ borderColor: "#2563eb", my: 4 }} />

            <Typography variant="h6" fontWeight={800} mb={3}>
              Event Information
            </Typography>

            <Stack spacing={3} sx={{ mt: 3 }}>
              <EventInfo
                icon={<CalendarMonthIcon />}
                label="Date"
                value={formatEventDate(event.date)}
              />
              <EventInfo
                icon={<LocationOnIcon />}
                label="Location"
                value={event.location || "Location not available"}
              />

              <EventInfo
                icon={<EventAvailableIcon />}
                label="Category"
                value={event.category}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: "transparent" }}>
            <RegisterEventBox event={event} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function PageState({ children }) {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        bgcolor: "#000",
        color: "#fff",
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      {children}
    </Box>
  );
}

function EventInfo({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box sx={{ color: "#60a5fa", display: "flex", pt: 0.2 }}>{icon}</Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography color="#94a3b8" variant="body2">
          {label}
        </Typography>

        <Typography sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export default EventDetails;
