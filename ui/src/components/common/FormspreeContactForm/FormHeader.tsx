import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const FormHeader: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: theme.typography.fontWeightBold,
          color: theme.palette.primary.main,
        }}
      >
        Get in Touch
      </Typography>
      <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
        I'd love to hear from you! Fill out the form below and I'll get back
        to you as soon as possible.
      </Typography>
    </Box>
  );
};

export default FormHeader;
