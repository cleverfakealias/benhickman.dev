import { Box, Button, Typography, Container } from '@mui/material';
import { PortableText } from '@portabletext/react';
import { HomeContentSectionModule } from '../sanity/types/home';
import urlFor from '../sanity/imageUrl';

interface HomeContentSectionProps {
  module: HomeContentSectionModule;
}

export default function HomeContentSection({ module }: HomeContentSectionProps) {
  const isFullWidth = module.layout === 'full-width';
  const isContentRight = module.layout === 'content-right';

  const imageBuilder = module.media?.image?.asset ? urlFor(module.media.image.asset) : null;
  const imageUrl =
    imageBuilder && 'width' in imageBuilder
      ? (
          imageBuilder as {
            width: (w: number) => { quality: (q: number) => { url: () => string } };
          }
        )
          .width(800)
          .quality(90)
          .url()
      : module.media?.image?.asset?.url || '';
  const imageAlt = module.media?.alt || '';
  const lqip = module.media?.image?.asset?.metadata?.lqip;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              md: isFullWidth ? 'column' : isContentRight ? 'row-reverse' : 'row',
            },
            gap: { xs: 4, md: 8 },
            alignItems: isFullWidth ? 'center' : 'flex-start',
            textAlign: isFullWidth ? 'center' : 'left',
          }}
        >
          {/* Content Column */}
          <Box sx={{ flex: 1, maxWidth: isFullWidth ? '800px' : 'none' }}>
            <Typography
              variant="h2"
              sx={{
                mb: 3,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontWeight: 700,
                color: 'var(--color-on-surface)',
              }}
            >
              {module.headline}
            </Typography>
            <Box
              sx={{
                mb: 4,
                color: 'var(--color-on-surface-variant)',
                '& p': {
                  mb: 2,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  lineHeight: 1.7,
                },
                '& h2, & h3, & h4': {
                  mt: 3,
                  mb: 2,
                  fontWeight: 600,
                },
                '& ul, & ol': {
                  pl: 3,
                  mb: 2,
                },
                '& li': {
                  mb: 1,
                },
                '& a': {
                  color: 'var(--color-primary-main)',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: 'var(--color-primary-dark)',
                  },
                },
              }}
            >
              <PortableText value={module.body as never} />
            </Box>
            {module.cta && (
              <Button
                variant={
                  module.cta.style === 'primary'
                    ? 'contained'
                    : module.cta.style === 'secondary'
                      ? 'outlined'
                      : 'text'
                }
                href={module.cta.href}
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                {module.cta.label}
              </Button>
            )}
          </Box>

          {/* Media Column */}
          {!isFullWidth && imageUrl && (
            <Box
              sx={{
                flex: 1,
                position: 'relative',
                width: '100%',
                maxWidth: { xs: '100%', md: '480px' },
              }}
            >
              <Box
                component="img"
                src={imageUrl}
                alt={imageAlt}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 2,
                  display: 'block',
                  backgroundColor: lqip || 'var(--color-surface-container)',
                }}
              />
              {module.media?.caption && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 1,
                    color: 'var(--color-on-surface-variant)',
                    fontStyle: 'italic',
                  }}
                >
                  {module.media.caption}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
