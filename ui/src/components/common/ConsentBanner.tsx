import React, { useEffect, useState } from 'react';
import { useConsent } from '../../hooks/useConsent';
import { Button, Box, Typography, useTheme, Link, Slide } from '@mui/material';

const ConsentBanner: React.FC = () => {
  const { isBannerOpen, setConsent, setSettingsOpen } = useConsent();
  const theme = useTheme();

  // Internal state for delayed render to allow animation
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isBannerOpen) {
      // Small timeout to ensure mount before transition
      const timer = setTimeout(() => setShow(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isBannerOpen]);

  if (!isBannerOpen && !show) return null;

  return (
    <Slide direction="up" in={show} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          left: '50%',
          transform: 'translateX(-50%) !important', // Override Slide transform interactions if needed, but Slide usually handles it.
          // Slide adds transform, so we might need a wrapper or handle positioning carefully.
          // Actually, standard Slide works best if the element it moves is the one being positioned.
          // But 'left: 50%' + 'translateX(-50%)' centering conflicts with Slide's transform.
          // Better approach: Centered container that simply Fades/Slides up.
          zIndex: 1400, // Toast/Snackbar level
          width: { xs: 'calc(100% - 32px)', sm: 'auto' },
          maxWidth: '600px',
          minWidth: { sm: '500px' },
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            bgcolor: 'background.paper', // Or specific dark hue if desired, using theme var
            color: 'text.primary',
            borderRadius: 'xl', // rounded-2xl roughly
            boxShadow: theme.shadows[8],
            // Glassmorphism
            background: `color-mix(in srgb, ${theme.palette.background.paper}, transparent 10%)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.divider}`,
            p: 2,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
          }}
        >
          {/* Left: Text */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.5 }}>
              We use cookies to improve this site and measure traffic. Choose what you’re okay with.
              <Link
                component="button"
                variant="body2"
                onClick={() => setSettingsOpen(true)}
                sx={{
                  ml: 1,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  color: 'text.primary',
                  opacity: 0.8,
                }}
              >
                Privacy & cookie settings
              </Link>
            </Typography>
          </Box>

          {/* Right: Actions */}
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              width: { xs: '100%', md: 'auto' },
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
            }}
          >
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              onClick={() => setConsent('denied')} // Map "Reject" to denied
              sx={{
                borderColor: 'divider',
                textTransform: 'none',
                minWidth: '80px',
                '&:hover': {
                  borderColor: 'text.primary',
                  bgcolor: 'action.hover',
                },
              }}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              disableElevation
              onClick={() => setConsent('granted')} // Map "Accept" to granted
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                minWidth: '100px',
              }}
            >
              Accept all
            </Button>
          </Box>
        </Box>
      </Box>
    </Slide>
  );
};

export default ConsentBanner;
