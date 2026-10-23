import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        user: formData,
      });

      setSuccess(response.data.message || "Account created successfully!");

      // Registration par token generate ya store nahi hoga.
      // User ko login page par redirect karein.
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      const responseData = error.response?.data;

      const errors = responseData?.errors;
      const message = responseData?.message;

      if (Array.isArray(errors)) {
        setError(errors.join(", "));
      } else {
        setError(
          message ||
            responseData?.error ||
            error.message ||
            "Registration failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        py: 5,
        bgcolor: "black",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            bgcolor: "#1e253c",
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
          }}
        >
          <Stack spacing={1} alignItems="center" sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#d7ddf2",
                color: "#3157d5",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonAddAlt1Icon fontSize="large" />
            </Box>

            <Typography variant="h4" fontWeight={800} sx={{ color: "white" }}>
              Create Account
            </Typography>

            <Typography textAlign="center" sx={{ color: "grey.400" }}>
              Join EventHub and discover amazing events.
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
                sx={fieldStyles}
              />

              <TextField
                fullWidth
                placeholder="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                sx={fieldStyles}
              />

              <TextField
                fullWidth
                placeholder="Phone Number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                autoComplete="tel"
                required
                sx={fieldStyles}
              />

              <TextField
                fullWidth
                placeholder="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                slotProps={{
                  htmlInput: {
                    minLength: 8,
                  },
                }}
                required
                sx={fieldStyles}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<PersonAddAlt1Icon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: "#3157d5",
                  fontWeight: 700,
                  "&:hover": {
                    bgcolor: "#2445b5",
                  },
                }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              <Typography textAlign="center" sx={{ color: "grey.400" }}>
                Already have an account?{" "}
                <MuiLink component={Link} to="/login" underline="hover">
                  Login
                </MuiLink>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

const fieldStyles = {
  "& input": {
    color: "black",
  },
  "& input::placeholder": {
    color: "black",
    opacity: 1,
  },
  "& .MuiOutlinedInput-root": {
    bgcolor: "#c2cbdd",
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
};

export default Register;
