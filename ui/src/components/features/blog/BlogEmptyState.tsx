import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

export default function BlogEmptyState(): React.ReactElement {
  return (
    <Grid item xs={12}>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No blog posts yet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Check back soon for insights and updates!
        </Typography>
      </Box>
    </Grid>
  );
}
