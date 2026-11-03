import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RestorePageIcon from "@mui/icons-material/RestorePage";
function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            minHeight: "100vh",
          }}
        >
          <Stack
            direction="column"
            spacing={2}
            sx={{
              minHeight: "70vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box>
              <RestorePageIcon
                sx={{
                  color: "#1d4ed8",
                  fontSize: { xs: "5rem", sm: "8rem" },
                }}
              />
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: "white",
                maxWidth: { xs: "70vw", sm: "100vw" },
              }}
            >
              <span style={{ color: "#1d4ed8" }}>404</span> Page not found
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mt: 3,
                fontSize: { xs: "1.3rem" },
                maxWidth: { xs: "70vw", sm: "100vw" },
                color: "white",
              }}
            >
              The content you enter is not available at our wite plase try again
              with the current imputs
            </Typography>
            <Button
              sx={{
                bgcolor: "#1d4ed8",
                color: "white",
                p: { xs: 1, sm: 2 },
                fontWeight: 400,
                "&:hover": {
                  bgcolor: "#0131b5",
                },
              }}
              onClick={() => navigate("/")}
            >
              Back to home
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default NotFound;
