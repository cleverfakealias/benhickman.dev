import React from 'react';
import { Box, Typography } from '@mui/material';
import { SectionHeading } from './SectionHeading';
import { wrapSx, eyebrowSx, tagSx } from './homeStyles';
import { stackGroups } from './homeContent';

/** Stack band — AI/ML, Languages, Web/Infra rows of capability chips. */
export const StackBand: React.FC = () => (
  <Box component="section" aria-labelledby="stack-heading" sx={{ pb: 'clamp(64px, 9vw, 112px)' }}>
    <Box sx={wrapSx}>
      <SectionHeading id="stack-heading" eyebrow="// stack" title="The whole depth of the stack." />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {stackGroups.map((group, i) => (
          <Box
            key={group.label}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '120px 1fr' },
              gap: { xs: 1.5, sm: 2.25 },
              alignItems: 'start',
              py: 2.25,
              borderTop: i === 0 ? 0 : '1px solid var(--color-border)',
            }}
          >
            <Typography component="p" sx={[eyebrowSx, { pt: '5px' }]}>
              {group.label}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {group.items.map((item) => (
                <Box
                  component="span"
                  key={item}
                  sx={[
                    tagSx,
                    {
                      fontSize: '12.5px',
                      background: 'var(--color-surface)',
                      borderRadius: 'var(--radius-md)',
                      px: '11px',
                      py: '6px',
                    },
                  ]}
                >
                  {item}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);
