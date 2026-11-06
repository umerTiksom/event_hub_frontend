import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Paper,
  TextField,
  Stack,
  Button,
  Alert,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from "@mui/material";

import { useAuth } from "../context/AuthContext";
import LoginIcon from "@mui/icons-material/Login";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rateLimitSecond, setRateLimitSecond] = useState(0);

  useEffect(() => {
    if (rateLimitSecond <= 0) return;

    const timer = setTimeout(() => {
      setRateLimitSecond((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [rateLimitSecond]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rateLimitSecond > 0 || loading) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        user: formData,
      });

      const token = response.data.token;

      if (!token) {
        setError("Response did not contain an authentication token.");
        return;
      }

      const user = response.data.data?.user;

      login(user, token);

      setSuccess(response.data.message || "Login successful!");

      setTimeout(() => {
        navigate(location.state?.from?.pathname || "/", {
          replace: true,
        });
      }, 500);
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 429) {
        setError("");
        setSuccess("");
        setRateLimitSecond(60);
        return;
      }

      const messages = data?.errors;

      setError(
        Array.isArray(messages)
          ? messages.join(", ")
          : data?.message ||
              data?.error ||
              "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputFieldsStyle = {
    "& .MuiOutlinedInput-root": {
      color: "#273248",
      bgcolor: "#d7ddf2",
      borderRadius: 2,

      "& fieldset": {
        borderColor: "#334155",
      },
      "&:hover fieldset": {
        borderColor: "#64748b",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#3157d5",
      },
    },
    "& input::placeholder": {
      color: "#273248",
      opacity: 1,
    },
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
                justifyContent: "center",
                alignItems: "center",
                mb: 1,
              }}
            >
              <LoginIcon fontSize="large" />
            </Box>

            <Typography variant="h3" fontWeight={800} sx={{ color: "white" }}>
              Welcome Back
            </Typography>

            <Typography textAlign="center" sx={{ color: "grey.400" }}>
              Login to your EventHub Account
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

          {rateLimitSecond > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Too many requests! Please wait{" "}
              <strong>{rateLimitSecond} seconds</strong> before trying again.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                placeholder="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={rateLimitSecond > 0}
                sx={inputFieldsStyle}
              />

              <TextField
                fullWidth
                placeholder="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={rateLimitSecond > 0}
                sx={inputFieldsStyle}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          sx={{ color: "#273248" }}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || rateLimitSecond > 0}
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: "#3157d5",
                  fontWeight: 700,
                  "&:hover": {
                    bgcolor: "#2445b5",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#475569",
                    color: "#ffffff",
                  },
                }}
              >
                {rateLimitSecond > 0
                  ? `Try again in ${rateLimitSecond}s`
                  : loading
                    ? "Logging in..."
                    : "Login"}
              </Button>

              <Stack direction="row" justifyContent="center" spacing={1}>
                <Typography sx={{ color: "grey.400" }}>
                  Forgot your password?
                </Typography>

                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  underline="hover"
                  sx={{
                    color: "#8ba7ff",
                    fontWeight: 600,
                  }}
                >
                  Forgot Password
                </MuiLink>
              </Stack>

              <Typography textAlign="center" sx={{ color: "grey.400" }}>
                Don't have an account?
                <MuiLink
                  component={Link}
                  to="/register"
                  underline="hover"
                  sx={{
                    color: "#8ba7ff",
                    fontWeight: 600,
                    px: 1,
                  }}
                >
                  Register
                </MuiLink>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
