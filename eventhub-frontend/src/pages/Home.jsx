import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Stack,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CodeIcon from "@mui/icons-material/Code";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import CategoryBox from "../components/home/CategoryBox";
import EventCard from "../components/EventCards";

const events = [
  {
    id: 1,
    title: "Tech Innovation Summit",
    category: "Technology",
    date: "November 15, 2026",
    location: "Lahore, Pakistan",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900",
  },
  {
    id: 2,
    title: "Music & Arts Festival",
    category: "Music",
    date: "November 22, 2026",
    location: "Lahore, Pakistan",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=900",
  },
  {
    id: 3,
    title: "Business Growth Meetup",
    category: "Business",
    date: "December 5, 2026",
    location: "Lahore, Pakistan",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900",
  },
];

const categories = [
  { name: "Technology", icon: <CodeIcon /> },
  { name: "Business", icon: <BusinessCenterIcon /> },
  { name: "Music", icon: <MusicNoteIcon /> },
  { name: "Sports", icon: <SportsBasketballIcon /> },
];

function Home() {
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
          <Box sx={{ maxWidth: "60vw" }}>
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
                href="/events"
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
                href="/register"
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
            <CategoryBox name={category.name} icon={category.icon} />
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            {events.map((event) => (
              <EventCard
                title={event.title}
                id={event.id}
                location={event.location}
                category={event.category}
                date={event.date}
                image={event.image}
              />
            ))}
          </Box>
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
            href="/register"
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
