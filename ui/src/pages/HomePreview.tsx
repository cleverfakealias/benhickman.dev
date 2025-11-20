import { useParams } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useSanityHomePage } from '../hooks/useSanityHomePage';
import HomeHero from '../components/features/home/HomeHero';
import HomeContentSection from '../components/features/home/HomeContentSection';
import { HomeModule } from '../components/features/sanity/types/home';

export default function HomePreview() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { homePage, loading, error } = useSanityHomePage(organizationId || 'benhickman.dev');

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          py: 8,
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Error Loading Home Page
          </Typography>
          <Typography variant="body2">
            {error.message || 'Failed to load home page data'}
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (!homePage) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="info">
          <Typography variant="h6" gutterBottom>
            No Home Page Found
          </Typography>
          <Typography variant="body2">
            No home page has been created for organization: <strong>{organizationId}</strong>
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Create one in Sanity Studio to see it here.
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Render modules in sequence */}
      {homePage.modules.map((module: HomeModule) => {
        switch (module._type) {
          case 'homeHeroModule':
            return <HomeHero key={module._key} module={module} />;
          case 'homeContentSectionModule':
            return <HomeContentSection key={module._key} module={module} />;
          default:
            return null;
        }
      })}
    </Box>
  );
}
