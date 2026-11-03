import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography,
  Chip,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupsIcon from "@mui/icons-material/Groups";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

import api from "../api/axios";

function EventMembers() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await api.get(`/events/${id}/registrations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (active) {
          setMembers(response.data?.members || []);
          setTotalMembers(response.data?.total_members || 0);
        }
      } catch (err) {
        console.error("Event Members Error:", err.response?.data || err);

        if (active) {
          setError(
            err.response?.data?.message || "Unable to load event members.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchMembers();

    return () => {
      active = false;
    };
  }, [id, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#141b2a",
        py: 5,
      }}
    >
      <Container maxWidth="xl">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/events/${id}`)}
          sx={{
            color: "#fff",
            mb: 3,
            "&:hover": {
              bgcolor: "#263449",
            },
          }}
        >
          Back to Event
        </Button>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <GroupsIcon
              sx={{
                color: "#60a5fa",
                fontSize: { sm: 40, xs: 35 },
              }}
            />

            <Typography variant="h4" sx={{ color: "white", fontWeight: 800 }}>
              Event Members
            </Typography>
          </Stack>

          {!loading && !error && (
            <Chip
              label={`${totalMembers} Members`}
              color="primary"
              sx={{
                mt: {
                  xs: 1,
                  sm: 0.5,
                },
                ml: {
                  xs: 0,
                  sm: 2,
                },
              }}
            />
          )}
        </Stack>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 6,
            }}
          >
            <CircularProgress sx={{ color: "#60a5fa" }} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : members.length === 0 ? (
          <Card sx={{ borderRadius: 3, mt: 3 }}>
            <CardContent sx={{ py: 5, textAlign: "center" }}>
              <GroupsIcon
                sx={{
                  fontSize: 55,
                  color: "#64748b",
                  mb: 2,
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                No Members Yet
              </Typography>

              <Typography color="text.secondary">
                No users have registered for this event yet.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2} sx={{ mt: 4 }}>
            {members.map((member) => (
              <Card
                key={member.registration_id}
                sx={{
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                  >
                    <Avatar
                      sx={{
                        width: 55,
                        height: 55,
                        bgcolor: "#2563eb",
                        fontSize: 22,
                        fontWeight: 700,
                      }}
                    >
                      {member.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h6" fontWeight={700}>
                        {member.name || "Unknown User"}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mt: 1 }}
                      >
                        <EmailOutlinedIcon
                          sx={{ fontSize: 18, color: "#64748b" }}
                        />

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ overflowWrap: "anywhere" }}
                        >
                          {member.email || "Email not available"}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mt: 0.8 }}
                      >
                        <PhoneOutlinedIcon
                          sx={{ fontSize: 18, color: "#64748b" }}
                        />

                        <Typography variant="body2" color="text.secondary">
                          {member.phone_number || "Phone not available"}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

export default EventMembers;
