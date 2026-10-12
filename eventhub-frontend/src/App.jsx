import "./App.css";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import InfoIcon from "@mui/icons-material/Info";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import EventCards from "./components/EventCards";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
function App() {
  const num = [1, 2, 3, 4, 5];
  return (
    <>
      <Stack spacing={0} sx={{ padding: 5, maxWidth: "100vw" }}>
        <Typography variant="h3">Welcome to the Event hub</Typography>
        <Typography variant="body1">
          Mange and create the event for yourself
        </Typography>
        <Box>
          <Button variant="outlined" startIcon={<AdsClickIcon />}>
            Click me{" "}
          </Button>
          <Button variant="outlined" startIcon={<InfoIcon />}>
            About me{" "}
          </Button>
          <Button variant="outlined" startIcon={<ContactPageIcon />}>
            Contect me{" "}
          </Button>
        </Box>
        <Grid container spacing={2} sx={{ marginTop: 5.78 }}>
          {num.map((item) => (
            <Grid key={item} size={{ xs: 12, sm: 6, md: 4 }}>
              <EventCards title={`Event ${item}`} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </>
  );
}

export default App;
