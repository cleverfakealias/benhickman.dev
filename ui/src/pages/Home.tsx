import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import HeroBanner from '../components/common/HeroBanner';
import HomeSummary from '../components/features/HomeSummary';
import HomeBlogCTA from '../components/features/HomeBlogCTA';
import { fetchPosts } from '../components/features/sanity/sanityClient';
import { BlogPost } from '../components/features/sanity/types';

export default function Home(): React.ReactElement {
  const [firstPost, setFirstPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPosts().then((posts) => {
      if (posts && posts.length > 0) {
        const sorted = posts.sort(
          (a: BlogPost, b: BlogPost) =>
            new Date(b.publishedAt || b._createdAt || '').getTime() -
            new Date(a.publishedAt || a._createdAt || '').getTime()
        );
        setFirstPost(sorted[0]);
      }
    });
  }, []);

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
