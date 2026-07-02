import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { SectionHeading } from './SectionHeading';
import { wrapSx, cardSx } from './homeStyles';
import { writingTeasers, WRITING_HREF } from './homeContent';

/** Writing teasers — three upcoming pieces from the blog backlog. */
export const WritingTeasers: React.FC = () => (
  <Box component="section" aria-labelledby="writing-heading" sx={{ pb: 'clamp(64px, 9vw, 112px)' }}>
    <Box sx={wrapSx}>
      <SectionHeading id="writing-heading" eyebrow="// writing" title="Notes from the stack." />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        {writingTeasers.map((post) => (
          <Box
            key={post.title}
            component={Link}
            to={WRITING_HREF}
            sx={[
              cardSx,
              {
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                p: 3,
                textDecoration: 'none',
              },
            ]}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-secondary-hex)',
              }}
            >
              {post.meta}
            </Typography>
            <Typography
              component="h3"
              sx={{
                m: 0,
                fontFamily: 'Geist, sans-serif',
                fontWeight: 500,
                fontSize: '17px',
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
                color: 'var(--color-text)',
              }}
            >
              {post.title}
            </Typography>
            <Typography
              component="span"
              sx={{
                mt: 'auto',
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                color: 'var(--color-text-secondary)',
              }}
            >
              read →
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);
