import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Typography,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import { AccessTime, Person } from '@mui/icons-material';
import { buildImageUrl } from '../sanity/imageUrl';
import { BlogPost } from '../sanity/types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps): React.ReactElement {
  const theme = useTheme();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Generate optimized image URL for card display
  const imageSrc = buildImageUrl(post.mainImage, {
    width: 400,
    height: 200,
    quality: 80,
  }) || undefined;

  const cardSx = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: theme.transitions.create(['transform', 'box-shadow', 'background'], {
      duration: theme.transitions.duration.standard,
    }),
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 'var(--radius-sm)',
    boxShadow: theme.palette.mode === 'dark' ? theme.shadows[6] : theme.shadows[2],
    overflow: 'hidden',
    position: 'relative',
    '& .MuiCardMedia-root': {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: theme.palette.mode === 'dark' ? theme.shadows[8] : theme.shadows[4],
    },
  };

  return (
    <Card sx={cardSx} data-sanity-edit-target>
      <CardActionArea
        component={Link}
        to={`/blog/post/${post.slug.current}`}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
        data-sanity="post"
        data-sanity-document-id={post._id}
      >
        {post.mainImage && (
          <CardMedia
            component="img"
            height="200"
            image={imageSrc}
            alt={post.mainImage?.alt || post.title || 'Blog image'}
            sx={{
              objectFit: 'cover',
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          />
        )}

        <CardContent sx={{ flexGrow: 1, p: 5 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 3,
              lineHeight: 1.3,
            }}
          >
            {post.title}
          </Typography>

          {post.excerpt && (
            <Typography
              variant="body2"
              sx={{
                mb: 4,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: theme.typography.body2?.lineHeight || 1.5,
                color: theme.palette.text.secondary,
                opacity: theme.palette.mode === 'dark' ? 0.9 : 0.8,
              }}
            >
              {post.excerpt}
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 'auto' }}>
            <Chip
              icon={<AccessTime />}
              label={formatDate(post.publishedAt)}
              size="small"
              variant="outlined"
            />

            {post.estimatedReadingTime && (
              <Chip
                label={`${post.estimatedReadingTime} min read`}
                size="small"
                variant="outlined"
              />
            )}

            {post.author && (
              <Chip icon={<Person />} label={post.author} size="small" variant="outlined" />
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
