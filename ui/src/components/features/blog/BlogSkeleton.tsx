import React from "react";
import { Card, CardContent, Skeleton } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
export default function BlogSkeleton(): React.ReactElement {
  return (
    <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
      <Card sx={{ height: "100%" }}>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <CardContent>
          <Skeleton variant="text" sx={{ fontSize: "1.5rem", mb: 1 }} />
          <Skeleton variant="text" sx={{ mb: 2 }} />
          <Skeleton variant="text" width="60%" />
        </CardContent>
      </Card>
    </Grid2>
  );
}
