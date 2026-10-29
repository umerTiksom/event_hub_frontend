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
import axios from "axios";

import PersonOutlineIcon from "@mui/icons-material/Person2Outlined";
import EventIcon from "@mui/icons-material/Event";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    } catch {
      setError("Unable to load your profile.");
      setLoading(false);
    }
  }, [navigate]);

  const loadEvents = async (token, currentUser) => {
    try {
      const response = await axios.get("/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allEvents = Array.isArray(response.data)
        ? response.data
        : response.data.events || [];

      const userEvents = allEvents.filter(
        (event) => String(event.user_id) === String(currentUser.id),
      );

      setEvents(userEvents);
    } catch (err) {
      setError("Could not load created events. Please check your API.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));
    navigate("/login", { replace: true });
  };

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "?";

  if (!user && loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#123780", py: 5 }}>
      <Container maxWidth="md">
        <Typography
          variant="h2"
          fontWeight={800}
          mb={1}
          sx={{ color: "white" }}
        >
          My Profile
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          mb={4}
          sx={{ color: "#fff4", pt: 0.3 }}
        >
          Manage your account and events.
        </Typography>

        <Card sx={{ mb: 3, borderRadius: 3, mt: 4 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Avatar
                sx={{
                  width: 68,
                  height: 68,
                  bgcolor: "#1032a1",
                  fontSize: 28,
                  fontWeight: 800,
                }}
              >
                {userInitial}
              </Avatar>

              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {user.name}
                </Typography>
                <Typography color="text.secondary">EventHub Member</Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonOutlineIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography fontWeight={600}>
                    {user.name || "Not provided"}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <PersonOutlineIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email Address
                  </Typography>
                  <Typography fontWeight={600}>
                    {user.email || "Not provided"}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <PersonOutlineIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography fontWeight={600}>
                    {user.phone_number || "Not provided"}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <EventIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Events Created
                </Typography>
              </Stack>

              <Chip label={events.length} color="primary" />
            </Stack>

            {loading ? (
              <CircularProgress size={26} />
            ) : error ? (
              <Alert severity="warning">{error}</Alert>
            ) : events.length === 0 ? (
              <Typography color="text.secondary">
                You haven't created any events yet.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {events.map((event) => (
                  <Card
                    key={event.id}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    <CardContent>
                      <Typography fontWeight={700}>{event.name}</Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {event.location || "Location not specified"}
                      </Typography>

                      {event.date && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {new Date(event.date).toLocaleString()}
                        </Typography>
                      )}
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

        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Account Settings
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ textTransform: "none", py: 1.2 }}
              >
                Logout
              </Button>

              <Button
                fullWidth
                color="error"
                variant="outlined"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => navigate("/profile/delete-account")}
                sx={{ textTransform: "none", py: 1.2 }}
              >
                Delete Account
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Profile;
