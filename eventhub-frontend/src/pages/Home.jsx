import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CodeIcon from "@mui/icons-material/Code";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import CategoryBox from "../components/home/CategoryBox";
import EventCard from "../components/EventCards";
import events from "../data/events.json";

const categories = [
  { name: "Technology", icon: <CodeIcon /> },
  { name: "Business", icon: <BusinessCenterIcon /> },
  { name: "Music", icon: <MusicNoteIcon /> },
  { name: "Sports", icon: <SportsBasketballIcon /> },
];

function Home() {
  const navigate = useNavigate();
  return (
    <Box sx={{ bgcolor: "black", minHeight: "100vh", minWidth: "100vw" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(120deg, #000149 0%, #0e1326 60%, #285be5 100%)",
          color: "white",
          py: { xs: 8, md: 20 },
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ maxWidth: { xs: "100dvw", md: "60vw" } }}>
            <Chip
              label="Discover | Connect | Experience."
              sx={{
                mb: 3,
                color: "#bfdbfe",
                bgcolor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.5rem", md: "6rem" },
                lineHeight: 1.08,
              }}
            >
              Find Your Next
              <Box component="span" sx={{ color: "#60a5fa" }}>
                {" "}
                Great Experience
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                fontSize: { xs: "1rem", md: "1.15rem" },
                lineHeight: 1.8,
                py: 4,
                mb: 4,
                maxWidth: 550,
              }}
            >
              Discover exciting events, meet new people, and create
              unforgettable memories. Your next experience starts here with
              EventHub.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                onClick={() => navigate(`/events`)}
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: "#2563eb",
                  py: 2,
                  px: 4,
                  borderRadius: 10,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#0d38ad" },
                }}
              >
                Explore Events
              </Button>

              <Button
                onClick={() => navigate(`/register`)}
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "#64748b",
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Join EventHub
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
      {/* Categories Section */}
      <Container maxWidth="xl" sx={{ py: 7 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 750, mb: 1, color: "white" }}
        >
          Explore Categories
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            mb: 4,
            color: "grey",
            maxWidth: { sm: "100vw", md: "45vw" },
            py: 3,
          }}
        >
          Discover events that match your interests. Browse through a variety of
          categories to find exciting experiences, connect with like-minded
          people, and explore opportunities that inspire you.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {categories.map((category) => (
            <CategoryBox
              name={category.name}
              icon={category.icon}
              onClick={() => navigate(`/events`)}
            />
          ))}
        </Box>
      </Container>
      {/* Featured Events Section */}

      <Box sx={{ py: 7 }}>
        <Container maxWidth="xl">
          {/* Featured Events Heading */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              mb: 4,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 750,
                  mb: 1,
                  color: "white",
                }}
              >
                Featured Events
              </Typography>

              <Typography variant="subtitle1" sx={{ color: "gray" }}>
                Discover experiences worth adding to your calendar.
              </Typography>
            </Box>

            <Button
              href="/events"
              endIcon={<ArrowForwardIcon />}
              sx={{
                fontWeight: 650,
                color: "#2563eb",
                px: 7,
                textDecoration: "none",

                "&:hover": {
                  textDecoration: "underline",
                  textUnderlineOffset: "5px",
                  backgroundColor: "transparent",
                },
              }}
            >
              View All Events
            </Button>
          </Stack>

          {/* Events Cards */}

          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <EventCard
                  title={event.title}
                  id={event.id}
                  location={event.location}
                  category={event.category}
                  date={event.date}
                  image={event.image}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* Call To Action */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box
          sx={{
            background:
              "linear-gradient(120deg, #000149 0%, #0e1326 60%, #285be5 100%)",
            color: "white",
            borderRadius: 4,
            p: { xs: 4, md: 7 },
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 750,
              mb: 2,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
            }}
          >
            Be Part of Something Amazing
          </Typography>

          <Typography
            sx={{
              color: "#cbd5e1",
              maxWidth: 600,
              mx: "auto",
              mb: 3,
              lineHeight: 1.8,
            }}
          >
            Join EventHub to discover upcoming events and connect with people
            who share your interests.
          </Typography>

          <Button
            onClick={() => navigate(`/register`)}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: "#2563eb",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 650,
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Container>
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#0f172a",
          color: "#cbd5e1",
          py: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          © 2026 EventHub. Discover experiences that bring us together.
        </Typography>
      </Box>
    </Box>
  );
}

export default Home;
