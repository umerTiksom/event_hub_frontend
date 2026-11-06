import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";

import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import api from "../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputFieldsStyle = {
    "& .MuiOutlinedInput-root": {
      color: "#273248",
      bgcolor: "#d7ddf2",
      borderRadius: 2,
      "& fieldset": {
        borderColor: "#334155",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot_password", {
        email,
      });

      setSuccess(
        response.data.message ||
          "If your email exists, a reset link has been sent.",
      );

      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send reset link. Please try again.",
      );
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
          <Stack spacing={2} alignItems="center">
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
              }}
            >
              <EmailIcon fontSize="large" />
            </Box>

            <Typography variant="h4" sx={{ color: "white", fontWeight: 800 }}>
              Forgot Password?
            </Typography>

            <Typography textAlign="center" sx={{ color: "grey.300" }}>
              Enter your registered email address. We will send you a password
              reset link.
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 3 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                placeholder="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                sx={inputFieldsStyle}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  bgcolor: "#3157d5",
                  borderRadius: 2,
                  fontWeight: 700,
                  "&:hover": {
                    bgcolor: "#2445b5",
                  },
                }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <Button
                component={Link}
                to="/login"
                startIcon={<ArrowBackIcon />}
                sx={{ color: "#8ba7ff" }}
              >
                Back to Login
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ForgotPassword;
