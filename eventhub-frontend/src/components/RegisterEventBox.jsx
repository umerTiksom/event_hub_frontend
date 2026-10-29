import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import api from "../api/axios";

const fieldStyles = {
  "& .MuiInputLabel-root": {
    color: "#ffffff",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#60a5fa",
  },
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    bgcolor: "#0b1120",
    "& fieldset": {
      borderColor: "#d8d9da",
    },
    "&:hover fieldset": {
      borderColor: "#64748b",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2563eb",
    },
  },
};

function RegisterEventBox({ event }) {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Verify login with the Rails API before opening the form
  const handleRegister = async () => {
    if (!event?.id || checkingAuth || registering || registered) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token?.trim()) {
      redirectToLogin();
      return;
    }

    setCheckingAuth(true);
    setMessage("");

    try {
      await api.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormOpen(true);
    } catch (error) {
      const status = error.response?.status;

      if (status === 401 || status === 403 || status === 404) {
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

  // Submit event registration to the Rails API
  const submitRegistration = async (e) => {
    e.preventDefault();

    if (registering || !event?.id) return;

    const token = localStorage.getItem("token");

    if (!token?.trim()) {
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  return (
    <>
      {/* Attend This Event Card */}
      <Box
        sx={{
          bgcolor: "#031949",
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
          ) : registering ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <CircularProgress size={18} color="inherit" />
              <span>Registering...</span>
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

      {/* Registration Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => {
          if (!registering) setFormOpen(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <Box
          component="form"
          onSubmit={submitRegistration}
          noValidate
          sx={{
            background:
              "linear-gradient(120deg, #000149 0%, #02359a 60%, #92750a 100%)",
            color: "white",
          }}
        >
          <DialogTitle sx={{ fontWeight: 800, fontSize: "1.35rem" }}>
            Register for Event
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "1.2rem",
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
                fontSize: "1.2rem",
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
              {registering ? "Registering..." : "Submit Registration"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

export default RegisterEventBox;
