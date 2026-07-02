import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import { Link } from 'react-router-dom';
import type { Theme } from '@mui/material';
import type { SystemStyleObject } from '@mui/system';
import { SectionHeading } from './SectionHeading';
import { wrapSx, cardSx, tagSx, SECTION_Y } from './homeStyles';
import { featuredProjects, moreWork, WORK_HREF, type BentoSpan } from './homeContent';

const traceln = keyframes({
  '0%, 8%': { opacity: 0.45 },
  '14%, 30%': { opacity: 1, color: 'var(--color-text)' },
  '60%, 100%': { opacity: 0.45 },
});

// Bento footprint per span keyword: flagship 2×2, tall 1×2, small 1×1.
const spanSx: Record<BentoSpan, SystemStyleObject<Theme>> = {
  big: {
    gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 2' },
    gridRow: { md: 'span 2' },
  },
  tall: { gridRow: { md: 'span 2' } },
  small: {},
};

// Card layout local to the bento; the Obsidian surface + hover lift come from
// the shared `cardSx` primitive, composed via the sx array on each card.
const cardLayoutSx: SystemStyleObject<Theme> = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: 1.75,
  minHeight: 180,
  p: 3,
  overflow: 'hidden',
};

/** Featured work bento — VERIFIED projects only, asymmetric grid, with the
 *  flagship card carrying an animated agent-loop trace. */
export const FeaturedWork: React.FC = () => (
  <Box component="section" aria-labelledby="work-heading" sx={{ py: SECTION_Y }}>
    <Box sx={wrapSx}>
      <SectionHeading
        id="work-heading"
        eyebrow="// selected work"
        title="Agents, models, and the tools between them."
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        }}
      >
        {featuredProjects.map((project) => (
          <Box
            key={project.name}
            component="article"
            sx={[cardSx, cardLayoutSx, spanSx[project.span]]}
          >
            {project.spanTag && (
              <Box
                component="span"
                aria-hidden="true"
                sx={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10.5px',
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-muted)',
                }}
              >
                {project.spanTag}
              </Box>
            )}

            {project.badge && (
              <Box
                component="span"
                sx={{
                  alignSelf: 'flex-start',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10.5px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-secondary-hex)',
                  border: '1px solid rgba(136,158,72,0.4)',
                  borderRadius: 'var(--radius-pill)',
                  px: '9px',
                  py: '3px',
                }}
              >
                {project.badge}
              </Box>
            )}

            <Typography
              component="h3"
              sx={{
                m: 0,
                fontFamily: 'Geist, sans-serif',
                fontWeight: 500,
                fontSize: '19px',
                letterSpacing: '-0.01em',
                color: 'var(--color-text)',
              }}
            >
              {project.name}
            </Typography>

            <Typography
              sx={{ fontSize: '14.5px', lineHeight: 1.5, color: 'var(--color-text-secondary)' }}
            >
              {project.description}
            </Typography>

            {project.trace && (
              <Box
                aria-hidden="true"
                sx={{
                  mt: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '7px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12.5px',
                }}
              >
                {project.trace.map((step, i) => (
                  <Box
                    key={step}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: 'var(--color-text-secondary)',
                      opacity: 0.45,
                      animation: `${traceln} 6s var(--easing-standard) ${i * 0.9}s infinite`,
                      '@media (prefers-reduced-motion: reduce)': {
                        animation: 'none',
                        opacity: 1,
                        color: 'var(--color-text)',
                      },
                    }}
                  >
                    <Box component="span" sx={{ color: 'var(--color-accent-hex)' }}>
                      ›
                    </Box>
                    {step}
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', mt: 'auto' }}>
              {project.tags.map((tag) => (
                <Box component="span" key={tag} sx={tagSx}>
                  {tag}
                </Box>
              ))}
            </Box>
          </Box>
        ))}

        {/* "All work" link card — spans two columns at the bottom of the bento. */}
        <Box
          sx={[
            cardSx,
            cardLayoutSx,
            {
              gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 2' },
              justifyContent: 'center',
              '&:hover .arrow': { transform: 'translateX(4px)' },
            },
          ]}
        >
          <Box
            component={Link}
            to={WORK_HREF}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--color-text)',
              textDecoration: 'none',
              '&:hover': { borderBottomColor: 'transparent' },
            }}
          >
            All work{' '}
            <Box
              component="span"
              className="arrow"
              aria-hidden="true"
              sx={{
                color: 'var(--color-accent-hex)',
                transition: 'transform 180ms var(--easing-standard)',
              }}
            >
              →
            </Box>
          </Box>
          <Typography
            sx={{
              mt: '8px',
              fontSize: '14.5px',
              lineHeight: 1.5,
              color: 'var(--color-text-secondary)',
            }}
          >
            {moreWork.join(' · ')}
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
);
