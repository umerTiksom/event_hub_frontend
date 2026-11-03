import { CircularProgress } from "@mui/material";
function Loading() {
  return (
    <CircularProgress
      size="3rem"
      aria-label="Loading…"
      sx={{ color: "#14519b" }}
    />
  );
}

export default Loading;
