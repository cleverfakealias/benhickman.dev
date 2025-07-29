import React from "react";
import { BlogPost } from "../sanity/types";
import BlogCard from "./BlogCard";
import BlogSkeleton from "./BlogSkeleton";
import BlogEmptyState from "./BlogEmptyState";
import Grid2 from "@mui/material/Grid2";

interface BlogGridProps {
  posts: BlogPost[];
  loading: boolean;
}

export default function BlogGrid({ posts, loading }: BlogGridProps): React.ReactElement {
  if (loading) {
    return (
      <Grid2
        container
        spacing={4}
        direction="row"
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {Array.from(new Array(6)).map((_, index) => (
          <BlogSkeleton key={index} />
        ))}
      </Grid2>
    );
  }

  if (posts.length === 0) {
    return (
      <Grid2
        container
        spacing={4}
        direction="row"
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <BlogEmptyState />
      </Grid2>
    );
  }

return (
  <Grid2 container spacing={4}>
    {posts.map((post) => (
      <Grid2
        key={post.slug.current}
        size={{ xs: 12, sm: 6, md: 4 }}
      >
        <BlogCard post={post} />
      </Grid2>
    ))}
  </Grid2>
);
} 