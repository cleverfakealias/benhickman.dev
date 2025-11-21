import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { heroSkills } from './heroSkills';

const HeroBanner: React.FC = () => {
  return (
    <Box component="section" sx={{ position: 'relative', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
        {/* CSS Grid instead of Grid2 */}
        <Box
          sx={{
            display: 'grid',
            alignItems: 'center',
            gap: { xs: 3, md: 6 },
            // two columns at md+, single column on mobile
            gridTemplateColumns: { xs: '1fr', md: 'minmax(420px, 0.95fr) 1.05fr' },
          }}
        >
          {/* Copy first on mobile, second on desktop */}
          <Box
            sx={{
              order: { xs: 1, md: 2 },
              maxWidth: { md: '64ch' },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                fontSize: { xs: 'clamp(2rem, 8vw, 2.6rem)', md: 'clamp(2.4rem, 3.6vw, 3.2rem)' },
                mb: 1.5,
                '&::before': {
                  content: '""',
                  display: 'block',
                  width: '3rem',
                  height: '3px',
                  marginBottom: 'var(--space-2)',
                  backgroundColor: 'var(--color-secondary-hex)',
                  borderRadius: '2px',
                },
              }}
            >
              Systems that scale. Software that lasts.
            </Typography>

            <Typography
              variant="h5"
              sx={{ fontWeight: 500, color: 'var(--color-secondary-hex)', mb: 2 }}
            >
              Cloud architecture, platform engineering, and calm reliability.
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: 'var(--color-text-secondary-hex)', lineHeight: 1.75, mb: 3 }}
            >
              I help teams go from prototype to production with infrastructure that’s cost-aware,
              resilient, and easy to evolve.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Button
                component={Link}
                to="/contact"
                variant="contained"
                size="large"
                sx={{ borderRadius: 'var(--radius-md)' }}
              >
                Let’s design it
              </Button>
              <Button
                component={Link}
                to="/experience"
                variant="outlined"
                size="large"
                sx={{ borderRadius: 'var(--radius-md)' }}
              >
                See experience
              </Button>
            </Box>

            {/* Make proof chips a single row with graceful wrap; small to reduce height */}
            <Box
              component="ul"
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                p: 0,
                m: 0,
                listStyle: 'none',
                color: 'var(--color-text-muted-hex)',
              }}
            >
              {heroSkills.map((t) => (
                <Typography
                  key={t}
                  component="li"
                  sx={{
                    fontSize: '0.9rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    px: 1.1,
                    py: 0.35,
                    background: 'color-mix(in oklch, var(--color-accent) 6%, var(--color-surface))',
                  }}
                >
                  {t}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Media second on mobile, first on desktop */}
          <Box
            sx={{
              order: { xs: 2, md: 1 },
              justifySelf: { md: 'start' },
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 60% 40%, color-mix(in oklch, var(--color-secondary) 8%, transparent) 0%, transparent 70%)',
                opacity: 0.2,
                zIndex: 0,
                pointerEvents: 'none',
              },
            }}
          >
            <Box
              component="img"
              src="/images/working.jpg"
              alt="Architect. Build. Elevate."
              loading="eager"
              fetchPriority="high"
              sx={{
                display: 'block',
                width: '100%',
                height: 'auto',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-2)',
                // keep image from getting too tall → reduces vertical feel
                maxHeight: { md: 420 },
                objectFit: 'cover',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroBanner;
