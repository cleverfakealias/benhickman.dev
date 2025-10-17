import React from 'react';
import { Container } from '@mui/material';
import { useBlogPosts } from '../hooks/useBlogPosts';
import BlogHeader from '../components/features/blog/BlogHeader';
import BlogGrid from '../components/features/blog/BlogGrid';

export default function Blog(): React.ReactElement {
  const { posts, loading } = useBlogPosts();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <BlogHeader />
      <BlogGrid posts={posts} loading={loading} />
    </Container>
  );
}
