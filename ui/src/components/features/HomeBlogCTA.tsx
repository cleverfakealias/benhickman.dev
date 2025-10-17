import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import BlogCard from './blog/BlogCard';
import { BlogPost } from './sanity/types';

interface HomeBlogCTAProps {
  featuredPost?: BlogPost | null;
}

const HomeBlogCTA: React.FC<HomeBlogCTAProps> = ({ featuredPost }) => {
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
            Latest from the blog
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
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          }}
        >
          <Box sx={{ order: { xs: 1, md: 1 }, maxWidth: { md: '70ch' } }}>
            <Typography
              variant="body1"
              sx={{ mb: 3, lineHeight: 1.75, color: 'var(--color-text)' }}
            >
              I write about cloud architecture, platform engineering, and the practical side of
              building resilient systems. Lessons learned, patterns that work, and the occasional
              deep dive into solving real problems.
            </Typography>

            <Button
              component={Link}
              to="/blog"
              variant="contained"
              size="large"
              sx={{
                fontWeight: 600,
                background: 'var(--color-accent-hex)',
                color: 'var(--color-accent-contrast-hex)',
                border: '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                textTransform: 'none',
                px: 3,
                py: 1.25,
                boxShadow: 'none',
                transition: 'all 150ms var(--easing-emphasized)',
                '&:hover': {
                  background:
                    'color-mix(in oklch, var(--color-accent) 92%, var(--color-secondary) 8%)',
                  transform: 'translateY(-1px)',
                  boxShadow: 'var(--shadow-1)',
                },
              }}
            >
              Read all posts
            </Button>
          </Box>

          {/* Featured blog post card */}
          <Box
            sx={{
              order: { xs: 2, md: 2 },
              justifySelf: { md: 'end' },
              width: '100%',
            }}
          >
            {featuredPost ? (
              <BlogCard post={featuredPost} />
            ) : (
              <Box
                sx={{
                  background: 'var(--color-bg)',
                  border: '1px dashed var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" sx={{ color: 'var(--color-text-muted-hex)' }}>
                  No posts yet
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomeBlogCTA;
