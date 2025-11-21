import React from 'react';
import { Box, Container } from '@mui/material';
import HeroBanner from '../components/common/HeroBanner';
import HomeSummary from '../components/features/HomeSummary';
import HomeBlogCTA from '../components/features/HomeBlogCTA';
import { useBlogPosts } from '../hooks/useBlogPosts';

export default function Home(): React.ReactElement {
  const { posts } = useBlogPosts();
  const firstPost = posts && posts.length > 0 ? posts[0] : null;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Box sx={{ mb: { xs: 4, md: 5 } }}>
        <HeroBanner />
      </Box>

      <Box sx={{ mb: { xs: 4, md: 5 } }}>
        <HomeSummary />
      </Box>

      <Box sx={{ mb: { xs: 4, md: 5 } }}>
        <HomeBlogCTA featuredPost={firstPost} />
      </Box>
    </Container>
  );
}
