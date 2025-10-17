import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import HeroBanner from '../components/common/HeroBanner';
import HomeSummary from '../components/features/HomeSummary';
import BlogCard from '../components/features/blog/BlogCard';
import { BlogPost } from '../components/features/sanity/types';

interface HomeWrapperProps {
  mockPosts?: BlogPost[];
  showMockData?: boolean;
}

/**
 * Wrapper component for Home that allows injecting mock data for Storybook
 */
export default function HomeWrapper({
  mockPosts = [],
  showMockData = false,
}: HomeWrapperProps): React.ReactElement {
  const [firstPost, setFirstPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (showMockData && mockPosts.length > 0) {
      // Use mock data for Storybook
      const sorted = mockPosts.sort(
        (a: BlogPost, b: BlogPost) =>
          new Date(b.publishedAt || b._createdAt || '').getTime() -
          new Date(a.publishedAt || a._createdAt || '').getTime()
      );
      if (sorted[0]) setFirstPost(sorted[0]);
    } else if (!showMockData) {
      // Use real API call for production (will likely fail in Storybook)
      import('../components/features/sanity/sanityClient').then(({ fetchPosts }) => {
        fetchPosts().then((posts) => {
          if (posts && posts.length > 0) {
            const sorted = posts.sort(
              (a: BlogPost, b: BlogPost) =>
                new Date(b.publishedAt || b._createdAt || '').getTime() -
                new Date(a.publishedAt || a._createdAt || '').getTime()
            );
            if (sorted[0]) setFirstPost(sorted[0]);
          }
        });
      });
    }
  }, [mockPosts, showMockData]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <HeroBanner />
      <div
        style={{
          display: 'flex',
          gap: 32,
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          minHeight: 400,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 320,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {firstPost && <BlogCard post={firstPost} />}
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 320,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        </div>
      </div>
      <HomeSummary />
    </Container>
  );
}
