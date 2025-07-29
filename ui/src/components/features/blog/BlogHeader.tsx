import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

export default function BlogHeader(): React.ReactElement {
  const theme = useTheme();

  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: theme.typography.fontWeightBold,
          color: theme.palette.primary.main,
          mb: 2,
        }}
      >
        Blog
      </Typography>
      <Typography
        variant="h5"
        sx={{
          maxWidth: "600px",
          mx: "auto",
          color: theme.palette.text.secondary,
          opacity: theme.palette.mode === "dark" ? 0.9 : 0.7,
        }}
      >
        Insights on software architecture, cloud technologies, and building
        scalable applications
      </Typography>
    </Box>
  );
} 