import { Box, Button, Typography, Container, useTheme, useMediaQuery } from '@mui/material';
import { HomeHeroModule } from '../sanity/types/home';
import { buildImageUrl } from '../sanity/imageUrl';

interface HomeHeroProps {
  module: HomeHeroModule;
}

export default function HomeHero({ module }: HomeHeroProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Select appropriate image based on breakpoint
  const imageAsset = isMobile
    ? module.media.mobile
    : isTablet && module.media.tablet
      ? module.media.tablet
      : module.media.desktop;

  // Use Sanity's image URL builder for optimized, high-quality images
  const imageUrl = buildImageUrl(imageAsset?.image?.asset, { width: 1200, quality: 90 });
  const lqip = imageAsset?.image?.asset?.metadata?.lqip;

  // Map layout to flex direction
  const isMediaLeft = module.layout === 'media-left';
  const isContentOnly = module.layout === 'content-only';

  // Map emphasis to background color
  const bgColorMap = {
    brand: 'var(--color-primary-main)',
    neutral: 'var(--color-surface-container)',
    surface: 'var(--color-surface)',
  };

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
            backgroundColor: bgColorMap[module.emphasis] || bgColorMap.brand,
            color:
              module.emphasis === 'brand' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: isMediaLeft ? 'row-reverse' : 'row',
              },
              gap: { xs: 4, md: 8 },
              alignItems: 'center',
              minHeight: { md: '60vh' },
              p: { xs: 4, md: 6 },
            }}
          >
            {/* Content Column */}
            <Box sx={{ flex: 1 }}>
              {module.eyebrow && (
                <Typography
                  variant="overline"
                  sx={{
                    display: 'block',
                    mb: 1,
                    opacity: 0.8,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                  }}
                >
                  {module.eyebrow}
                </Typography>
              )}
              <Typography
                variant="h1"
                sx={{
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                }}
              >
                {module.headline}
              </Typography>
              {module.lede && (
                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    opacity: 0.9,
                    maxWidth: '600px',
                  }}
                >
                  {module.lede}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant={module.primaryCta.style === 'primary' ? 'contained' : 'outlined'}
                  href={module.primaryCta.href}
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                  }}
                >
                  {module.primaryCta.label}
                </Button>
                {module.secondaryCta && (
                  <Button
                    variant={module.secondaryCta.style === 'primary' ? 'contained' : 'outlined'}
                    href={module.secondaryCta.href}
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    {module.secondaryCta.label}
                  </Button>
                )}
              </Box>
            </Box>

            {/* Media Column */}
            {!isContentOnly && imageUrl && (
              <Box
                sx={{
                  flex: 1,
                  position: 'relative',
                  width: '100%',
                  maxWidth: { xs: '100%', md: '540px' },
                }}
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt={imageAsset.alt}
                  loading="eager"
                  fetchPriority="high"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: 3,
                    display: 'block',
                    backgroundColor: lqip || 'var(--color-surface-container)',
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
