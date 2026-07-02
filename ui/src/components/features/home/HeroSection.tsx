import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import { CtaLink } from './CtaLink';
import { wrapSx, headingEmSx, eyebrowSx, kbdSx, SECTION_Y, GUTTER } from './homeStyles';
import { WORK_HREF, CONTACT_HREF, CMDK_PLACEHOLDER } from './homeContent';

const blink = keyframes({ '50%': { opacity: 0 } });

/** Agentic hero — eyebrow, the signature ⌘K bar, display headline, lede,
 *  availability row, and the primary/secondary CTAs. */
export const HeroSection: React.FC = () => (
  <Box
    component="section"
    aria-labelledby="hero-heading"
    sx={{
      position: 'relative',
      overflow: 'hidden',
      pt: 'clamp(56px, 9vh, 112px)',
      pb: SECTION_Y,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(900px, 120%)',
        height: 600,
        background: 'radial-gradient(closest-side, rgba(230,81,0,0.08), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      },
    }}
  >
    <Box sx={[wrapSx, { position: 'relative', zIndex: 1, maxWidth: 920, px: GUTTER }]}>
      <Typography component="p" sx={eyebrowSx}>
        // agentic engineering{' '}
        <Box
          component="b"
          aria-hidden="true"
          sx={{ color: 'var(--color-accent-hex)', fontWeight: 500 }}
        >
          {'>'}_
        </Box>
      </Typography>

      {/* Signature ⌘K bar — the live "ask my work" agent lands in Phase 5; until
          then this is a keyboard-focusable, clearly-labeled coming-soon trigger. */}
      <Box
        component="button"
        type="button"
        aria-label="Ask my work — command menu, coming soon"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          width: '100%',
          maxWidth: 560,
          mt: '22px',
          mb: '30px',
          p: '15px 16px',
          textAlign: 'left',
          cursor: 'pointer',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--color-text-secondary)',
          transition:
            'border-color 180ms var(--easing-standard), background 180ms var(--easing-standard)',
          '&:hover': {
            borderColor: 'var(--color-border-hover)',
            background: 'var(--color-surface-2)',
          },
          '&:focus-visible': {
            outline: '2px solid var(--color-accent-hex)',
            outlineOffset: '2px',
          },
        }}
      >
        <Box
          component="span"
          aria-hidden="true"
          sx={{
            color: 'var(--color-accent-hex)',
            fontFamily: 'var(--font-mono)',
            fontSize: '15px',
          }}
        >
          ⌘K
        </Box>
        <Box
          component="span"
          sx={{
            flex: 1,
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            color: 'var(--color-text-muted)',
          }}
        >
          {CMDK_PLACEHOLDER}
          <Box
            component="span"
            aria-hidden="true"
            sx={{
              color: 'var(--color-accent-hex)',
              animation: `${blink} 1.1s steps(1) infinite`,
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          >
            _
          </Box>
        </Box>
        <Box component="span" aria-hidden="true" sx={{ display: 'inline-flex' }}>
          <Box component="kbd" sx={kbdSx}>
            ↵
          </Box>
        </Box>
      </Box>

      <Typography
        component="h1"
        variant="h1"
        id="hero-heading"
        sx={{
          fontSize: 'clamp(2.75rem, 9vw, 5.5rem)',
          lineHeight: 1.02,
          letterSpacing: '-0.035em',
        }}
      >
        Agents that{' '}
        <Box component="em" sx={headingEmSx}>
          ship,
        </Box>
        <br />
        built from the model up.
      </Typography>

      <Typography
        sx={{
          mt: 3,
          maxWidth: 620,
          fontSize: 'clamp(16px, 2.4vw, 20px)',
          lineHeight: 1.62,
          color: 'var(--color-text-secondary)',
        }}
      >
        I build production agentic systems — tool-calling, permission tiers, confidence gating —
        then go a layer deeper: training, fine-tuning, and right-sizing the models they run on.
        Enterprise-tested. Self-hostable, end to end.
      </Typography>

      {/* Availability row */}
      <Box
        sx={{
          mt: 3.5,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '10px 14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12.5px',
          color: 'var(--color-text-secondary)',
        }}
      >
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <Box
            component="span"
            aria-hidden="true"
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--color-accent-hex)',
              boxShadow: '0 0 0 4px rgba(230,81,0,0.14)',
            }}
          />
          open to senior AI roles + select consulting
        </Box>
        <Box component="span" aria-hidden="true" sx={{ color: 'var(--color-border)' }}>
          ·
        </Box>
        <Box component="span">remote</Box>
        <Box component="span" aria-hidden="true" sx={{ color: 'var(--color-border)' }}>
          ·
        </Box>
        <Box component="span">full-stack AI: model → agent → UI</Box>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <CtaLink to={CONTACT_HREF}>Start a conversation</CtaLink>
        <CtaLink to={WORK_HREF} variant="ghost">
          See the work →
        </CtaLink>
      </Box>
    </Box>
  </Box>
);
