import { Card, Box, Typography } from "@mui/material";
function CategoryBox({ name, icon }) {
  return (
    <>
      <Card
        elevation={0}
        sx={{
          p: 2.5,
          bgcolor: "#2563eb",
          borderRadius: 3,
          textAlign: "center",
          transition: "0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
          },
        }}
      >
        <Box
          sx={{
            color: "white",
            width: 52,
            height: 52,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",

            "& .MuiSvgIcon-root": { fontSize: 42 },
          }}
        >
          {icon}
        </Box>

        <Typography
          fontWeight={650}
          sx={{
            color: "white",
            fontSize: "1.2rem",
          }}
        >
          {name}
        </Typography>
      </Card>
    </>
  );
}

export default CategoryBox;
