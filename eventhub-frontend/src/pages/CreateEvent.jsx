import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
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

function CreateEvent() {
  const navigate = useNavigate();
  const initialFormData = {
    name: "",
    description: "",
    location: "",
    date: null,
    category_id: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch categories from Rails API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");

        const categoryData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        setCategories(categoryData);
      } catch (err) {
        console.error("Categories error:", err);
        setError("Unable to load categories. Please try again.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date changes
  const handleDateChange = (newDate) => {
    setFormData((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

  // Submit event
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Required field validation
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

    // Date validation
    if (!dayjs(formData.date).isValid()) {
      setError("Please select a valid event date.");
      return;
    }

    if (formData.date.isBefore(dayjs(), "day")) {
      setError("Event date cannot be in the past.");
      return;
    }

    // Authentication
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before creating an event.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post(
        "/events",
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

      setSuccess(response.data.message || "Event created successfully!");

      // Reset form
      setFormData(initialFormData);
      navigate("/events");
    } catch (err) {
      console.error("Create event error:", err);

      const responseErrors = err.response?.data?.errors;

      setError(
        Array.isArray(responseErrors)
          ? responseErrors.join(", ")
          : err.response?.data?.message ||
              "Something went wrong while creating the event.",
      );
    } finally {
      setSubmitting(false);
    }
  };

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
            Create New Event
          </Typography>

          <Typography
            variant="overline"
            sx={{
              color: "rgba(255, 255, 255, 0.51)",
              fontSize: "0.9rem",
            }}
          >
            Get ready to bring people together. Fill out the info below to
            launch your event!
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
              Register New Event
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
                    disabled={loadingCategories || categories.length === 0}
                  >
                    {loadingCategories ? (
                      <MenuItem disabled>Loading categories...</MenuItem>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No categories available</MenuItem>
                    )}
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  disabled={submitting || loadingCategories}
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
                    "Create Event"
                  )}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default CreateEvent;
