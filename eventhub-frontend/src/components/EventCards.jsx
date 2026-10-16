import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { Chip, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function EventCard({ image, title, category, location, date, id }) {
  const navigate = useNavigate();
  return (
    <>
      <Card
        key={id}
        elevation={0}
        sx={{
          bgcolor: "#111827",
          color: "white",
          border: "1px solid #334155",
          borderRadius: 3,
          overflow: "hidden",
          transition: "0.2s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 30px rgba(15,23,42,0.3)",
          },
        }}
      >
        <CardMedia
          component="img"
          height="210"
          image={image}
          alt={title}
          sx={{ objectFit: "cover" }}
        />

        <CardContent sx={{ p: 2.5 }}>
          <Chip
            label={category}
            size="small"
            sx={{
              bgcolor: "#1e3a8a",
              color: "#bfdbfe",
              fontWeight: 600,
              mb: 2,
            }}
          />

          <Typography
            variant="h6"
            component="h3"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            {title}
          </Typography>

          <Stack spacing={1.5} sx={{ mb: 2.5 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <EventAvailableIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                {date}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnOutlinedIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                {location}
              </Typography>
            </Stack>
          </Stack>

          <Button
            onClick={() => navigate(`/events/${id}`)}
            variant="outlined"
            fullWidth
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: 2,
              py: 1,
              fontWeight: 600,
              color: "#60a5fa",
              borderColor: "#2563eb",
            }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default EventCard;
