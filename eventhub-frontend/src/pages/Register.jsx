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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        user: formData,
      });
      setSuccess("Account created successfully!");

      // if we get the token so store it in local storage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      const message = error.response?.data?.error;
      setError(
        Array.isArray(message)
          ? message.join(",")
          : message || error.response?.data?.error,
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
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
                  maxWidth: "10%",
                  maxHeight: "10%",
                  bgcolor: "#d7ddf2",
                  color: "#3157d5",
                  p: 2,
                  borderRadius: 15,
                  display: "flex",
                }}
              >
                <PersonAddAlt1Icon fontSize="large" />
              </Box>

              <Typography variant="h4" fontWeight={800} sx={{ color: "white" }}>
                Create Account
              </Typography>

              <Typography
                textAlign="center"
                sx={{
                  color: "grey",
                }}
              >
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
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{
                    "& input::placeholder": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-root": {
                      color: "black",
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
                  }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  inputProps={{ minLength: 8 }}
                  required
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
                    "&:hover": { bgcolor: "#2445b5" },
                  }}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <Typography textAlign="center" sx={{ color: "gray" }}>
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
    </>
  );
}

export default Register;
