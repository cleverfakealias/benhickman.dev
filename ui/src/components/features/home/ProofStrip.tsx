import React from 'react';
import { Box, Typography } from '@mui/material';
import { wrapSx, eyebrowAccentSx } from './homeStyles';
import { proofPoints } from './homeContent';

/** Full-bleed proof strip — three verified, qualitative claims separated by
 *  1px Iron dividers (no fabricated numbers). */
export const ProofStrip: React.FC = () => (
  <Box
    component="section"
    aria-label="Proof points"
    sx={{
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
    }}
  >
    <Box sx={[wrapSx, { px: 0 }]}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        {proofPoints.map((point, i) => (
          <Box
            key={point.key}
            sx={{
              p: 'clamp(24px, 3vw, 30px)',
              px: 'clamp(20px, 5vw, 40px)',
              borderLeft: { md: i === 0 ? 0 : '1px solid var(--color-border)' },
              borderTop: {
                xs: i === 0 ? 0 : '1px solid var(--color-border)',
                md: 0,
              },
            }}
          >
            <Typography component="p" sx={eyebrowAccentSx}>
              {point.key}
            </Typography>
            <Typography
              sx={{ mt: '10px', fontSize: '15px', lineHeight: 1.45, color: 'var(--color-text)' }}
            >
              {point.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);
