import React from 'react';
import { Box, Typography } from '@mui/material';
import { eyebrowSx } from './homeStyles';

interface SectionHeadingProps {
  /** Lowercase `// comment-style` eyebrow. */
  eyebrow: string;
  /** Section title; may contain an italic-serif `<em>` accent. */
  title: React.ReactNode;
  /** id for the rendered `<h2>` so its section can be `aria-labelledby` it. */
  id?: string;
  /** Center the heading block (contact section). */
  centered?: boolean;
}

/** Eyebrow + display `<h2>` pair used by the Home page sections. */
export const SectionHeading: React.FC<SectionHeadingProps> = ({ eyebrow, title, id, centered }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1.75,
      mb: 5,
      maxWidth: 680,
      ...(centered && { mx: 'auto', alignItems: 'center', textAlign: 'center' }),
    }}
  >
    <Typography component="p" sx={eyebrowSx}>
      {eyebrow}
    </Typography>
    <Typography component="h2" variant="h2" id={id}>
      {title}
    </Typography>
  </Box>
);
