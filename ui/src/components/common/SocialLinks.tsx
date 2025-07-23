import React from "react";
import { Typography, Box, Link, useTheme, Fade } from "@mui/material";
import { LinkedIn, GitHub } from "@mui/icons-material";

interface SocialLinksProps {
  showTitle?: boolean;
  centered?: boolean;
  compact?: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  centered = true,
  compact = false,
}) => {
  const theme = useTheme();

  const socialLinks = [
    {
      icon: <LinkedIn />,
      name: "LinkedIn",
      url: "https://linkedin.benhickman.dev",
      color: "#0077b5",
      description: "Professional profile",
    },
    {
      icon: <GitHub />,
      name: "GitHub",
      url: "https://github.benhickman.dev",
      color: "#24292f",
      description: "Code repositories",
    },
  ];

  return (
    <Box sx={{ textAlign: centered ? "center" : "left" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: centered ? "center" : "flex-start",
          gap: compact ? 1.5 : 2,
          flexWrap: "wrap",
        }}
      >
        {socialLinks.map((social, idx) => (
          <Fade in timeout={800 + idx * 200} key={idx}>
            <Box
              component={Link}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                p: compact ? 1.5 : 2,
                borderRadius: "4px",
                textDecoration: "none",
                borderColor: social.color,
                "&:hover": {
                  borderColor: social.color,
                  boxShadow: `0 4px 16px 0 ${social.color}30`,
                },
                ...theme.custom.getSocialStyles(),
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: compact ? 40 : 48,
                  height: compact ? 40 : 48,
                  borderRadius: "50%",
                  background: social.color,
                  mb: compact ? 0.5 : 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                {React.cloneElement(social.icon, {
                  sx: {
                    color: "#fff",
                    fontSize: compact ? 20 : 24,
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
                  },
                })}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  fontSize: compact ? "0.8rem" : "0.85rem",
                }}
              >
                {social.name}
              </Typography>
              {!compact && (
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                    mt: 0.5,
                  }}
                >
                  {social.description}
                </Typography>
              )}
            </Box>
          </Fade>
        ))}
      </Box>
    </Box>
  );
};

export default SocialLinks;
