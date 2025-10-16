import React from 'react';
import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import AccentBar from '../common/AccentBar';

const HomeSummary: React.FC = () => {
  const theme = useTheme();
  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 900,
        mx: 'auto',
        my: 6,
        px: 2,
        py: { xs: 3, md: 5 },
        position: 'relative',
        overflow: 'hidden',
        boxShadow: (theme) => (theme.palette.mode === 'dark' ? theme.shadows[4] : theme.shadows[2]),
      }}
    >
      <AccentBar />
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={7}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                color: (theme) => theme.palette.text.primary,
                lineHeight: 1.7,
              }}
            >
              Growing up, technology was always part of my life. From playing Nintendo as a young
              child to taking apart and reassembling my family's Gateway computer, my curiosity for
              how things worked was insatiable.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                color: (theme) => theme.palette.text.secondary,
                lineHeight: 1.7,
              }}
            >
              I started my career in technical support and eventually became a supervisor at a
              dot-com startup. In this role I was immersed in web development and email hosting in
              the Real Estate industry. Now, I'm working on an enterprise software engineering team
              at a global Saas company. I work on numerous microservices and user interfaces in
              multiple languages.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: (theme) => theme.palette.text.primary,
                lineHeight: 1.7,
              }}
            >
              Over the years, I've become proficient in Python, Typescript/Javascript, and Java. I
              thrive on solving complex problems. I'm constantly learning and adapting to new
              technologies, and I'm excited about the possibility of transitioning to an Architect
              role in the future where I am able to leverage my skills in cloud systems and
              development.
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          <Box sx={{ width: '100%', height: '100%' }}>
            <img
              src={'/images/windingroad.jpeg'}
              alt="Winding Road"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                minHeight: 320,
                maxHeight: 600,
                borderRadius: 0,
                boxShadow: theme.palette.mode === 'dark' ? theme.shadows[6] : theme.shadows[3],
                display: 'block',
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HomeSummary;
