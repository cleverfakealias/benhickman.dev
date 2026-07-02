import React from 'react';
import { Box, Typography } from '@mui/material';
import { CtaLink } from './CtaLink';
import { SectionHeading } from './SectionHeading';
import { wrapSx, headingEmSx, SECTION_Y } from './homeStyles';
import { socials, CONTACT_HREF } from './homeContent';

/** Contact CTA — the closing conversion, with a featured-profiles row. */
export const ContactCta: React.FC = () => (
  <Box component="section" aria-labelledby="contact-heading" sx={{ py: SECTION_Y }}>
    <Box sx={[wrapSx, { textAlign: 'center' }]}>
      <SectionHeading
        id="contact-heading"
        centered
        eyebrow="// contact"
        title={
          <>
            Ready to build agents that{' '}
            <Box component="em" sx={headingEmSx}>
              think?
            </Box>
          </>
        }
      />

      <Typography
        sx={{ mt: 2.25, mx: 'auto', maxWidth: 520, color: 'var(--color-text-secondary)' }}
      >
        Tell me about the system — what it should do, where it runs, and what “good” looks like. I
        read every message.
      </Typography>

      <Box sx={{ mt: 3.5, display: 'flex', justifyContent: 'center' }}>
        <CtaLink to={CONTACT_HREF}>Start a conversation</CtaLink>
      </Box>

      <Box
        sx={{
          mt: 3.75,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        {socials.map((social) => (
          <Box
            key={social.name}
            component="a"
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              minHeight: 44,
              px: '16px',
              py: '9px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-pill)',
              transition:
                'color 180ms var(--easing-standard), border-color 180ms var(--easing-standard), background 180ms var(--easing-standard)',
              '&:hover': {
                color: 'var(--color-text)',
                borderColor: 'var(--color-border-hover)',
                borderBottomColor: 'var(--color-border-hover)',
                background: 'var(--color-surface)',
              },
            }}
          >
            {social.name}{' '}
            <Box component="span" aria-hidden="true" sx={{ color: 'var(--color-accent-hex)' }}>
              ↗
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);
