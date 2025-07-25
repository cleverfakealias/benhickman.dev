import React from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Chip, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { AccessTime, Person } from "@mui/icons-material";
import imageUrlBuilder from "./sanity/imageUrl";
import { BlogPost } from "./sanity/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  const theme = useTheme();
  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "Recently";

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.95) 100%)"
            : "linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(65, 42, 145, 0.10)",
        overflow: "hidden",
        position: "relative",
        "& .MuiCardMedia-root": {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/blog/post/${post.slug.current}`}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        {post.mainImage && (
          <CardMedia
            component="img"
            height="200"
            image={(() => {
              const builder = imageUrlBuilder(post.mainImage);
              if (
                "width" in builder &&
                typeof builder.width === "function"
              ) {
                return builder.width(400).height(200).url();
              }
              return builder.url();
            })()}
            alt={post.mainImage.alt || post.title}
            sx={{
              objectFit: "cover",
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          />
        )}
        <CardContent sx={{ flexGrow: 1, p: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 2,
              lineHeight: 1.3,
            }}
          >
            {post.title}
          </Typography>
          {post.excerpt && (
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: theme.typography.body2?.lineHeight || 1.5,
                color: theme.palette.text.secondary,
                opacity: theme.palette.mode === "dark" ? 0.9 : 0.8,
              }}
            >
              {post.excerpt}
            </Typography>
          )}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: "auto" }}>
            <Chip icon={<AccessTime />} label={formatDate(post.publishedAt)} size="small" variant="outlined" />
            {post.estimatedReadingTime && (
              <Chip label={`${post.estimatedReadingTime} min read`} size="small" variant="outlined" />
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