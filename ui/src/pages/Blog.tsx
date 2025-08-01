import React from "react";
import { Box, Container } from "@mui/material";
import { useBlogPosts } from "../hooks/useBlogPosts";
import BlogHeader from "../components/features/blog/BlogHeader";
import BlogGrid from "../components/features/blog/BlogGrid";
import GradientDivider from "../components/common/GradientDivider";

export default function Blog(): React.ReactElement {
  const { posts, loading } = useBlogPosts();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <BlogHeader />
      <Box sx={{ mb: 4 }}>
        <GradientDivider />
      </Box>
      <BlogGrid posts={posts} loading={loading} />
    </Container>
  );
}
