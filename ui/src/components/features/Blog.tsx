import React, { useEffect, useState } from 'react';
import { fetchPosts } from './sanity/sanityClient';
import BlogSkeleton from './BlogSkeleton';
import { BlogPost } from './sanity/types';
import { Box, Container, Grid2, Typography, useTheme } from '@mui/material';
import BlogCard from './blog/BlogCard';

export default function Blog(): React.ReactElement {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetchPosts()
      .then((posts) => {
        // Ensure posts are sorted newest to oldest
        const sortedPosts = posts.sort((a: BlogPost, b: BlogPost) => {
          const dateA = new Date(a.publishedAt || a._createdAt || 0);
          const dateB = new Date(b.publishedAt || b._createdAt || 0);
          return dateB.getTime() - dateA.getTime(); // Newest first
        });
        setPosts(sortedPosts);
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to load blog posts. Please try again later.');
        setLoading(false);
        console.error('Error fetching posts:', error);
      });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: theme.typography.fontWeightBold,
            color: theme.palette.primary.main,
            mb: 2,
          }}
        >
          Blog
        </Typography>
        <Typography
          variant="h5"
          sx={{
            maxWidth: '600px',
            mx: 'auto',
            color: theme.palette.text.secondary,
            opacity: theme.palette.mode === 'dark' ? 0.9 : 0.7,
          }}
        >
          Insights on software architecture, cloud technologies, and building scalable applications
        </Typography>

        {/* Decorative line */}
        <Box
          sx={{
            mt: 3,
            width: { xs: '100px', md: '150px' },
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: theme.shape.borderRadius,
            mx: 'auto',
          }}
        />
      </Box>

      {/* Blog Posts Grid */}
      <Grid2
        container
        spacing={4}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {loading ? (
          Array.from(new Array(6)).map((_, index) => <BlogSkeleton key={index} />)
        ) : error ? (
          <Grid2 size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="error" gutterBottom>
                {error}
              </Typography>
            </Box>
          </Grid2>
        ) : posts.length === 0 ? (
          <Grid2 size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No blog posts yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Check back soon for insights and updates!
              </Typography>
            </Box>
          </Grid2>
        ) : (
          posts.map((post) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={post.slug.current}>
              <BlogCard post={post} />
            </Grid2>
          ))
        )}
      </Grid2>
    </Container>
  );
}
