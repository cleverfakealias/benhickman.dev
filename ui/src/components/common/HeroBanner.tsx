import React from "react";
import { Typography, Box, useTheme, Paper, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccentBar from "./AccentBar";

const HeroBanner: React.FC = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 4 },
        background: theme.custom.gradients.hero[theme.palette.mode],
        boxShadow: theme.custom.shadows.card[theme.palette.mode],
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        position: "relative",
        overflow: "hidden",
        transition: theme.custom.transitions.smooth,
        "&:hover": {
          boxShadow: theme.custom.shadows.card.hover[theme.palette.mode],
        },
      }}
    >
      {/* Top accent bar */}
      <AccentBar />

      {/* Logo Section */}
      <Box
        sx={{
          flex: "0 0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <img
          src="/images/ABE.png"
          alt="ABE - Architect, Build, Elevate"
          style={{
            maxWidth: "300px",
            width: "100%",
            height: "auto",
            filter:
              theme.palette.mode === "dark"
                ? "brightness(1.1)"
                : "brightness(0.9)",
            transition: theme.custom.transitions.standard,
            boxShadow: theme.custom.shadows.social[theme.palette.mode],
            borderRadius: "4px",
          }}
        />
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          textAlign: { xs: "center", md: "left" },
          maxWidth: { xs: "100%", md: "600px" },
          zIndex: 1,
        }}
      >
        <Typography
          variant="h5"
          component="p"
          sx={{
            mb: 3,
            lineHeight: 1.6,
            color: theme.palette.text.primary,
            fontWeight: 400,
            fontSize: { xs: "1.1rem", md: "1.3rem" },
          }}
        >
          I architect cloud-native systems, build reliable software, and elevate
          ideas into scalable, secure applications.
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{
            color: theme.palette.text.secondary,
            fontStyle: "italic",
            lineHeight: 1.5,
            fontSize: { xs: "1rem", md: "1.1rem" },
          }}
        >
          My mission is to turn complexity into clarity—delivering solutions
          that are efficient, maintainable, and built to grow.
        </Typography>

        {/* Call-to-action button */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          endIcon={<ArrowForwardIcon />}
          sx={{
            mt: 4,
            px: 4,
            fontSize: { xs: "1rem", md: "1.1rem" },
            transition: theme.custom.transitions.standard,
          }}
          href="/contact"
        >
          Let's Connect
        </Button>
      </Box>
    </Paper>
  );
};

export default HeroBanner;
