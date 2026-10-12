import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function EventCard(props) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        image="https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600"
        alt="Live music event"
      />

      <CardContent>
        <Typography variant="h5" component="div">
          {props.title ? props.title : "unknown event"}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Location: Lahore
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Enjoy live music with friends and family.
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small">View Details</Button>
        <Button size="small" variant="contained">
          Register
        </Button>
      </CardActions>
    </Card>
  );
}

export default EventCard;
