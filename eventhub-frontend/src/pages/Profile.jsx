import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import PersonOutlineIcon from "@mui/icons-material/Person2Outlined";
import EventIcon from "@mui/icons-material/Event";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import GroupIcon from "@mui/icons-material/Group";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";

import api from "../api/axios";
import Loading from "../components/Loading";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Created events states
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Enrolled events states
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [loadingEnrolled, setLoadingEnrolled] = useState(true);
  const [enrolledError, setEnrolledError] = useState("");

  // Check authentication and load both event sections
  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!savedUser || !token) {
        navigate("/login", { replace: true });
        return;
      }

      setUser(savedUser);
      loadEvents(token, savedUser);
      loadEnrolledEvents(token);
    } catch (err) {
      console.error("Profile Error:", err);

      setError("Unable to load your profile.");
      setLoading(false);
      setLoadingEnrolled(false);
    }
  }, [navigate]);

  // Fetch all created events
  const loadEvents = async (token, currentUser) => {
    try {
      setError("");

      // First page fetch
      const firstResponse = await api.get("/events", {
        params: { page: 1 },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const firstData = firstResponse.data;

      let allEvents = Array.isArray(firstData)
        ? firstData
        : firstData?.data || [];

      const totalPages = firstData?.pagination?.total_pages || 1;

      // Fetch remaining pages
      if (totalPages > 1) {
        const remainingRequests = [];

        for (let page = 2; page <= totalPages; page++) {
          remainingRequests.push(
            api.get("/events", {
              params: { page },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          );
        }

        const remainingResponses = await Promise.all(remainingRequests);

        remainingResponses.forEach((response) => {
          const pageEvents = Array.isArray(response.data)
            ? response.data
            : response.data?.data || [];

          allEvents = [...allEvents, ...pageEvents];
        });
      }

      // Filter events created by current user
      const userEvents = allEvents.filter(
        (event) => String(event.user_id) === String(currentUser.id),
      );

      setEvents(userEvents);
    } catch (err) {
      console.error("Created Events Error:", err);

      setError(
        err.response?.data?.message ||
          "Could not load created events. Please check your API.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch events in which current user is enrolled
  const loadEnrolledEvents = async (token) => {
    try {
      setEnrolledError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch current user's registrations
      const response = await api.get("/me/registrations", { headers });

      const registrations = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      // Fetch event details for each registration
      const eventRequests = registrations.map(async (registration) => {
        try {
          const eventResponse = await api.get(
            `/events/${registration.event_id}`,
            { headers },
          );

          const eventData =
            eventResponse.data?.event ??
            eventResponse.data?.data?.event ??
            eventResponse.data?.data ??
            eventResponse.data;

          return eventData;
        } catch (err) {
          console.error(`Unable to load event ${registration.event_id}:`, err);

          return null;
        }
      });

      const eventsData = await Promise.all(eventRequests);

      // Remove failed or empty event responses
      setEnrolledEvents(eventsData.filter(Boolean));
    } catch (err) {
      console.error("Enrolled Events Error:", err);
      console.log("Status:", err.response?.status);
      console.log("Response:", err.response?.data);
      console.error("Enrolled Events Error:", err);

      setEnrolledError(
        err.response?.data?.message || "Unable to load enrolled events.",
      );
    } finally {
      setLoadingEnrolled(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login", { replace: true });
  };

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "?";

  if (!user && loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#141b2a",
        py: 5,
      }}
    >
      <Container maxWidth="xl">
        {/* Profile Heading */}
        <Typography
          variant="h2"
          mb={1}
          sx={{
            fontWeight: 800,
            color: "#3b82f6",
          }}
        >
          My Profile
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          mb={4}
          sx={{
            color: "rgba(255, 255, 255, 0.56)",
            pt: 0.3,
          }}
        >
          Manage your account and events.
        </Typography>

        {/* User Profile */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            mt: 4,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Avatar
                sx={{
                  width: 68,
                  height: 68,
                  bgcolor: "#3b82f6",
                  fontSize: 28,
                  fontWeight: 800,
                }}
              >
                {userInitial}
              </Avatar>

              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {user.name.toUpperCase()}
                </Typography>

                <Typography sx={{ color: "rgba(57, 56, 56, 0.6)" }}>
                  EventHub Member
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3, pt: 2 }} />

            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonOutlineIcon color="primary" />

                <Box>
                  <Typography variant="caption" sx={{ color: "#3b82f6" }}>
                    Full Name
                  </Typography>

                  <Typography sx={{ fontWeight: 600 }}>
                    {user.name || "Not provided"}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <PersonOutlineIcon color="primary" />

                <Box>
                  <Typography variant="caption" sx={{ color: "#3b82f6" }}>
                    Email Address
                  </Typography>

                  <Typography sx={{ fontWeight: 600 }}>
                    {user.email || "Not provided"}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <PersonOutlineIcon color="primary" />

                <Box>
                  <Typography variant="caption" sx={{ color: "#3b82f6" }}>
                    Phone Number
                  </Typography>

                  <Typography sx={{ fontWeight: 600 }}>
                    {user.phone_number || "Not provided"}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Created Events */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <EventIcon color="primary" sx={{ pt: 0.6 }} />

                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Events Created
                </Typography>
              </Stack>

              <Chip label={events.length} color="primary" />
            </Stack>

            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 3,
                }}
              >
                <CircularProgress size={26} />
              </Box>
            ) : error ? (
              <Alert severity="warning">{error}</Alert>
            ) : events.length === 0 ? (
              <Typography color="textSecondary" sx={{ py: 2 }}>
                You haven't created any events yet.
              </Typography>
            ) : (
              <Stack spacing={2} sx={{ mt: 2 }}>
                {events.map((event) => (
                  <Card
                    key={event.id}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    <CardContent>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        sx={{ justifyContent: "space-between" }}
                        alignItems={{
                          xs: "flex-start",
                          sm: "center",
                        }}
                        spacing={2}
                      >
                        {/* Event Details */}
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>
                            {event.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mt: 1 }}
                          >
                            {event.location || "Location not specified"}
                          </Typography>

                          {event.date && (
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ mt: 0.5 }}
                            >
                              {new Date(event.date).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>

                        {/* Event Actions */}
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => navigate(`/events/${event.id}/edit`)}
                          >
                            Edit
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            Delete
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            startIcon={<GroupIcon />}
                            onClick={() =>
                              navigate(`/events/${event.id}/members`)
                            }
                          >
                            Members
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}

            <Button
              sx={{ mt: 3, textTransform: "none" }}
              onClick={() => navigate("/events")}
            >
              Browse Events
            </Button>
          </CardContent>
        </Card>

        {/* Enrolled Events */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <LocalActivityIcon color="success" sx={{ pt: 0.6 }} />

                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Enrolled Events
                </Typography>
              </Stack>

              <Chip label={enrolledEvents.length} color="success" />
            </Stack>

            {loadingEnrolled ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 3,
                }}
              >
                <Loading size="24" />
              </Box>
            ) : enrolledError ? (
              <Alert severity="warning">{enrolledError}</Alert>
            ) : enrolledEvents.length === 0 ? (
              <Typography color="textSecondary" sx={{ py: 2 }}>
                You haven't enrolled in any events yet.
              </Typography>
            ) : (
              <Stack spacing={2} sx={{ mt: 2 }}>
                {enrolledEvents.map((event) => (
                  <Card
                    key={event.id}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    <CardContent>
                      <Stack
                        sx={{
                          justifyContent: "space-between",
                        }}
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{
                          xs: "flex-start",
                          sm: "center",
                        }}
                        spacing={2}
                      >
                        {/* Enrolled Event Details */}
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>
                            {event.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mt: 1 }}
                          >
                            {event.location || "Location not specified"}
                          </Typography>

                          {event.date && (
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ mt: 0.5 }}
                            >
                              {new Date(event.date).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>

                        {/* View Event */}
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          View Event
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ py: 4 }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  textTransform: "none",
                  py: 1.2,
                }}
              >
                Logout
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Profile;
