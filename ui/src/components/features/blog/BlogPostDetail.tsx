import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug } from '../sanity/sanityClient';
import imageUrlBuilder from '../sanity/imageUrl';
import { BlogPost } from '../sanity/types';
import { Container, Typography, Box, Chip, Button, useTheme, Skeleton, Paper } from '@mui/material';
import { ArrowBack, AccessTime, Person } from '@mui/icons-material';
import BlogBody from './BlogBody';

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!slug) {
      setError('No post slug provided');
      setLoading(false);
      return;
    }

    getPostBySlug(slug)
      .then((data: BlogPost) => {
        if (!data) {
          setError('Post not found');
        } else {
          setPost(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
        setLoading(false);
      });
  }, [slug]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="text" sx={{ fontSize: '3rem', mb: 2 }} />
        <Skeleton variant="text" width="60%" sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ mb: 3 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          {error || 'Post not found'}
        </Typography>
        <Button
          component={Link}
          to="/blog"
          startIcon={<ArrowBack />}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Back to Blog
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Back to Blog Button */}
      <Button
        component={Link}
        to="/blog"
        startIcon={<ArrowBack />}
        sx={{ mb: 3, color: theme.palette.text.secondary }}
      >
        Back to Blog
      </Button>

      {/* Article Header */}
      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        {/* Featured Image */}
        {post.mainImage && (
          <Box
            component="img"
            src={(() => {
              const builder = imageUrlBuilder(post.mainImage);
              if ('width' in builder && typeof builder.width === 'function') {
                return builder.width(800).height(400).url();
              }
              return builder.url();
            })()}
            alt={post.mainImage.alt || post.title}
            sx={{
              width: '100%',
              height: { xs: '250px', md: '400px' },
              objectFit: 'cover',
              borderRadius: '4px', // Match other cards/images for consistency
              mb: 3,
            }}
          />
        )}

        {/* Title */}
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            fontSize: { xs: '2rem', md: '3rem' },
            lineHeight: 1.2,
            mb: 3,
          }}
        >
          {post.title}
        </Typography>

        {/* Meta Information */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          <Chip icon={<AccessTime />} label={formatDate(post.publishedAt)} variant="outlined" />

          {post.estimatedReadingTime && (
            <Chip label={`${post.estimatedReadingTime} min read`} variant="outlined" />
          )}

          {post.author && <Chip icon={<Person />} label={post.author} variant="outlined" />}
        </Box>

        {/* Decorative line */}
        <Box
          sx={{
            width: '100%',
            height: '2px',
            background: theme.custom.gradients.primary,
            borderRadius: theme.shape.borderRadius,
            mb: 4,
          }}
        />
      </Paper>

      {/* Article Content with Paper background */}
      <Paper elevation={1} sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Box
          sx={{
            '& .blog-content': {
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: theme.palette.text.primary,
              '& p': {
                marginBottom: 2,
                color: theme.palette.text.primary,
                opacity: theme.palette.mode === 'dark' ? 0.9 : 1,
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                color: theme.palette.text.primary,
                marginTop: 3,
                marginBottom: 2,
              },
              '& blockquote': {
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                paddingLeft: 2,
                marginLeft: 0,
                fontStyle: 'italic',
                opacity: theme.palette.mode === 'dark' ? 0.9 : 0.8,
              },
            },
          }}
        >
          {post.body && <BlogBody content={post.body} />}
        </Box>
      </Paper>

      {/* Footer */}
      <Box
        sx={{
          mt: 6,
          pt: 4,
          borderTop: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <Button
          component={Link}
          to="/blog"
          variant="outlined"
          size="large"
          startIcon={<ArrowBack />}
        >
          Back to All Posts
        </Button>
      </Box>
    </Container>
  );
};

export default BlogPostDetail;
