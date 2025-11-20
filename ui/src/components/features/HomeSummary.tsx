import React from 'react';
import { Box, Typography } from '@mui/material';

const HomeSummary: React.FC = () => {
  return (
    <Box component="section">
      {/* Card shell */}
      <Box
        sx={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-1)',
          borderRadius: 'var(--radius-lg)',
          p: { xs: 3, md: 5 },
        }}
      >
        {/* Section heading with copper underline */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography
            component="h2"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.01em',
              fontSize: { xs: '1.35rem', md: '1.6rem' },
              color: 'var(--color-text)',
            }}
          >
            About my work
          </Typography>
          <Box
            sx={{
              mt: 1,
              width: { xs: '64px', md: '92px' },
              height: '3px',
              borderRadius: '2px',
              backgroundColor: 'var(--color-secondary-hex)', // copper
            }}
          />
        </Box>

        {/* Content grid */}
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 3, md: 5 },
            alignItems: 'center',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
          }}
        >
          <Box sx={{ order: { xs: 1, md: 1 }, maxWidth: { md: '70ch' } }}>
            <Typography
              variant="body1"
              sx={{ mb: 2, lineHeight: 1.75, color: 'var(--color-text)' }}
            >
              Technology has been the through-line of my life. What began as curiosity became a
              career in building systems that help organizations move faster and make better
              decisions. I’ve spent years bridging business goals with technical strategy,
              translating complexity into clarity.
            </Typography>

            <Typography
              variant="body1"
              sx={{ mb: 2, lineHeight: 1.75, color: 'var(--color-text-secondary-hex)' }}
            >
              My experience spans from early dot-com operations to leading enterprise software
              initiatives in the SaaS space. I’ve designed cloud architectures, modernized legacy
              platforms, and helped teams scale securely through automation, observability, and
              thoughtful design.
            </Typography>

            <Typography variant="body1" sx={{ lineHeight: 1.75, color: 'var(--color-text)' }}>
              I work across the stack using TypeScript, Python and Java to deliver measurable outcomes:
              systems that are stable, cost-efficient, and built to evolve. My focus is on aligning
              engineering excellence with real business value.
            </Typography>
          </Box>

          {/* Media second; fixed aspect ratio so the card doesn’t grow vertically */}
          <Box
            sx={{
              order: { xs: 2, md: 2 },
              justifySelf: { md: 'end' },
              width: '100%',
              maxWidth: { md: 520 },
            }}
          >
            <Box
              component="img"
              src="/images/windingroad.jpeg"
              alt="Winding road through Minnesota hills"
              sx={{
                display: 'block',
                width: '100%',
                aspectRatio: '16 / 9',
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-2)',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomeSummary;
