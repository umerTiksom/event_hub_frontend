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

import { Link, useSearchParams, useNavigate } from "react-router-dom";
import LockResetIcon from "@mui/icons-material/LockReset";
import api from "../api/axios";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token || !email) {
      setError("Invalid password reset link.");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/reset_password", {
        email,
        token,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      setSuccess(response.data.message || "Password reset successfully!");

      setFormData({
        password: "",
        password_confirmation: "",
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (err) {
      const messages = err.response?.data?.errors;

      setError(
        Array.isArray(messages)
          ? messages.join(", ")
          : err.response?.data?.message ||
              "Unable to reset password. Please try again.",
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
              <LockResetIcon fontSize="large" />
            </Box>

            <Typography variant="h4" fontWeight={800} sx={{ color: "white" }}>
              Reset Password
            </Typography>

            <Typography textAlign="center" sx={{ color: "grey.400" }}>
              Enter your new password below.
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
                placeholder="New Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                sx={inputFieldsStyle}
              />

              <TextField
                fullWidth
                placeholder="Confirm New Password"
                name="password_confirmation"
                type="password"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                autoComplete="new-password"
                sx={inputFieldsStyle}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || !!success}
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
                {loading ? "Updating..." : "Reset Password"}
              </Button>

              <Button component={Link} to="/login" sx={{ color: "#8ba7ff" }}>
                Back to Login
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ResetPassword;
