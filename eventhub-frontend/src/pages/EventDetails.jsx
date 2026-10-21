import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

import api from "../api/axios";

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

const fieldStyles = {
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#60a5fa",
  },
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    bgcolor: "#0b1120",
    "& fieldset": {
      borderColor: "#334155",
    },
    "&:hover fieldset": {
      borderColor: "#64748b",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2563eb",
    },
  },
};

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [event, setEvent] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [checkingAuth, setCheckingAuth] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Fetch event details
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

        if (active) setEvent(formattedEvent);
      } catch (error) {
        if (!active) return;

        setFetchError(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Unable to load event details.",
        );
      } finally {
        if (active) setFetching(false);
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

  // Always send unauthenticated users to login
  const redirectToLogin = () => {
    localStorage.removeItem("token");
    setFormOpen(false);
    setCheckingAuth(false);

    navigate("/login", {
      replace: true,
      state: {
        from: `${location.pathname}${location.search}`,
      },
    });
  };

  // Verify token with Rails before opening the form
  const handleRegister = async () => {
    if (!event?.id || checkingAuth || registering || registered) {
      return;
    }

    const token = localStorage.getItem("token");

    // No token means the user is not logged in
    if (!token || !token.trim()) {
      redirectToLogin();
      return;
    }

    setCheckingAuth(true);
    setMessage("");

    try {
      // This endpoint must require authentication in Rails.
      // A successful response confirms that the token is valid.
      await api.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Open the form only after successful server verification
      setFormOpen(true);
    } catch (error) {
      // Invalid token, expired token, or unavailable auth endpoint:
      // do not open the registration form.
      if (
        error.response?.status === 401 ||
        error.response?.status === 403 ||
        error.response?.status === 404
      ) {
        redirectToLogin();
      } else {
        setMessage(
          error.response?.data?.message ||
            "Unable to verify your login. Please try again.",
        );
        setMessageType("error");
      }
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Submit registration
  const submitRegistration = async (e) => {
    e.preventDefault();

    if (registering || !event?.id) return;

    const token = localStorage.getItem("token");

    if (!token || !token.trim()) {
      redirectToLogin();
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phoneNumber = formData.phone_number.trim();

    if (!name || !email || !phoneNumber) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    setRegistering(true);
    setMessage("");

    try {
      const response = await api.post(
        `/events/${encodeURIComponent(event.id)}/registrations`,
        {
          registration: {
            name,
            email,
            phone_number: phoneNumber,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRegistered(true);
      setFormOpen(false);
      setMessage(
        response.data?.message ||
          "You have successfully registered for this event!",
      );
      setMessageType("success");
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 401 || status === 403) {
        redirectToLogin();
        return;
      }

      const errors = Array.isArray(data?.errors)
        ? data.errors
            .map((item) =>
              typeof item === "string"
                ? item
                : Object.values(item ?? {})
                    .flat()
                    .join(", "),
            )
            .join(", ")
        : "";

      setMessage(
        data?.message ||
          data?.error ||
          errors ||
          (status === 409
            ? "You may already be registered for this event."
            : status === 422
              ? "Please check your registration details."
              : "Registration failed. Please try again."),
      );

      setMessageType("error");
    } finally {
      setRegistering(false);
    }
  };

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

        <Box
          sx={{
            position: "relative",
            height: { xs: 230, sm: 350, md: 460 },
            overflow: "hidden",
            borderRadius: { xs: 2, md: 4 },
            bgcolor: "#0b3daa",
          }}
        >
          {/* Event Image */}
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
              color: "#d6d4d4",
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

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                bgcolor: "#031949",
                border: 0,
                borderRadius: 3,
                p: { xs: 2.5, md: 3 },
                position: { md: "sticky" },
                top: { md: 100 },
              }}
            >
              <Typography variant="h6" fontWeight={800} mb={1}>
                Attend This Event
              </Typography>

              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  mb: 3,
                }}
              >
                Join this event and be part of the experience.
              </Typography>

              <Divider sx={{ borderColor: "#2563eb", mb: 3 }} />

              {message && (
                <Alert severity={messageType} sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={checkingAuth || registering || registered}
                startIcon={
                  checkingAuth || registering ? null : <EventAvailableIcon />
                }
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
                    color: "#fff",
                  },
                }}
              >
                {checkingAuth ? (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CircularProgress size={18} color="inherit" />
                    <span>Checking Login...</span>
                  </Stack>
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

      {/* Registration Popup */}
      <Dialog
        open={formOpen}
        onClose={() => {
          if (!registering) setFormOpen(false);
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: "#111827",
            color: "#fff",
            border: "1px solid #1f2937",
            borderRadius: 3,
            backgroundImage: "none",
          },
        }}
      >
        <Box component="form" onSubmit={submitRegistration} noValidate>
          <DialogTitle sx={{ fontWeight: 800, fontSize: "1.35rem" }}>
            Register for Event
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "0.9rem",
                mt: 1,
                overflowWrap: "anywhere",
              }}
            >
              {event.title}
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Typography
              sx={{
                color: "#cbd5e1",
                fontSize: "0.9rem",
                mb: 3,
              }}
            >
              Enter your details to register for this event.
            </Typography>

            {message && messageType === "error" && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            <Stack spacing={2.5}>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                autoComplete="name"
                fullWidth
                required
                disabled={registering}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={fieldStyles}
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                autoComplete="email"
                fullWidth
                required
                disabled={registering}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={fieldStyles}
              />

              <TextField
                label="Phone Number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleFormChange}
                autoComplete="tel"
                fullWidth
                required
                disabled={registering}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={fieldStyles}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              onClick={() => setFormOpen(false)}
              disabled={registering}
              sx={{
                color: "#cbd5e1",
                textTransform: "none",
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={registering}
              sx={{
                bgcolor: "#2563eb",
                px: 2.5,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                "&:hover": {
                  bgcolor: "#1d4ed8",
                },
              }}
            >
              {registering ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress size={18} color="inherit" />
                  <span>Registering...</span>
                </Stack>
              ) : (
                "Submit Registration"
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
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
