import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import api from "../api/axios";

function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    date: null,
    category_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch event and categories
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [eventResponse, categoryResponse] = await Promise.all([
          api.get(`/events/${id}`, { headers }),
          api.get("/categories"),
        ]);

        if (!active) return;

        // Event response normalize karo
        const eventData =
          eventResponse.data?.event ??
          eventResponse.data?.data?.event ??
          eventResponse.data?.data ??
          eventResponse.data;

        const categoryData = Array.isArray(categoryResponse.data)
          ? categoryResponse.data
          : categoryResponse.data?.data || [];

        setCategories(categoryData);

        // Existing event details form mein set karo
        setFormData({
          name: eventData.name || "",
          description: eventData.description || eventData.decsription || "",
          location: eventData.location || "",
          date: eventData.date ? dayjs(eventData.date) : null,
          category_id: eventData.category_id
            ? String(eventData.category_id)
            : "",
        });
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message || "Unable to load event details.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [id, navigate]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle date changes
  const handleDateChange = (newDate) => {
    setFormData((previous) => ({
      ...previous,
      date: newDate,
    }));
  };

  // Update event
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !formData.date ||
      !formData.category_id
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!dayjs(formData.date).isValid()) {
      setError("Please select a valid event date.");
      return;
    }

    if (formData.date.isBefore(dayjs(), "day")) {
      setError("Event date cannot be in the past.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before updating an event.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.patch(
        `/events/${id}`,
        {
          event: {
            name: formData.name.trim(),
            description: formData.description.trim(),
            location: formData.location.trim(),
            date: formData.date.format("YYYY-MM-DD"),
            category_id: Number(formData.category_id),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess(response.data?.message || "Event updated successfully!");

      navigate("/profile");
    } catch (err) {
      console.error("Update Event Error:", err.response?.data || err);

      const responseErrors = err.response?.data?.errors;

      setError(
        Array.isArray(responseErrors)
          ? responseErrors.join(", ")
          : err.response?.data?.message ||
              "Something went wrong while updating the event.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !formData.name && !formData.description) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">{error}</Alert>

        <Button sx={{ mt: 2 }} onClick={() => navigate("/profile")}>
          Back to Profile
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(120deg, #000149 0%, #0e1326 60%, #285be5 100%)",
        color: "white",
        py: 3,
      }}
    >
      <Container maxWidth="xl">
        <Box>
          <Typography
            variant="h3"
            sx={{
              color: "white",
              fontWeight: 700,
              letterSpacing: 0.1,
            }}
          >
            Edit Event
          </Typography>

          <Typography
            variant="overline"
            sx={{
              color: "rgba(255, 255, 255, 0.51)",
              fontSize: "0.9rem",
            }}
          >
            Update your event information.
          </Typography>
        </Box>

        <Card
          sx={{
            width: "100%",
            p: 2,
            mt: 3,
            borderRadius: 4,
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#2563eb",
                py: 3,
              }}
            >
              Update Event Details
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack direction="column" spacing={4} sx={{ py: 3 }}>
                <TextField
                  name="name"
                  label="Event Name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                <TextField
                  name="description"
                  label="Event Description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  required
                />

                <TextField
                  name="location"
                  label="Event Location"
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Event Date"
                    value={formData.date}
                    onChange={handleDateChange}
                    minDate={dayjs().startOf("day")}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                      },
                    }}
                  />
                </LocalizationProvider>

                <FormControl fullWidth required>
                  <InputLabel id="category-label">Category</InputLabel>

                  <Select
                    labelId="category-label"
                    name="category_id"
                    value={formData.category_id}
                    label="Category"
                    onChange={handleChange}
                    disabled={categories.length === 0}
                  >
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <MenuItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No categories available</MenuItem>
                    )}
                  </Select>
                </FormControl>

                <Stack direction="row" spacing={2}>
                  <Button
                    type="submit"
                    disabled={submitting}
                    sx={{
                      bgcolor: "#3973ee",
                      color: "white",
                      p: { xs: 1, sm: 2 },
                      maxWidth: { xs: "70%", sm: "30%" },
                      opacity: 0.9,
                      "&:hover": {
                        bgcolor: "#0f55eb",
                        opacity: 1,
                      },
                    }}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => navigate("/profile")}
                    sx={{ textTransform: "none" }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default EditEvent;
