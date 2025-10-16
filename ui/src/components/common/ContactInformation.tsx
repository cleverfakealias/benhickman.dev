import React from 'react';
import { Typography, Box, useTheme, Paper } from '@mui/material';
import SocialLinks from './SocialLinks';

const ContactInformation: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      {/* Call to Action Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 4,
          background:
            theme.palette.mode === 'dark'
              ? `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`
              : `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.palette.mode === 'dark' ? theme.shadows[6] : theme.shadows[3],
          transition: theme.transitions.create(['box-shadow', 'transform'], {
            duration: theme.transitions.duration.standard,
          }),
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: theme.palette.mode === 'dark' ? theme.shadows[8] : theme.shadows[4],
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: theme.typography.fontWeightMedium,
            color: theme.palette.primary.main,
            mb: 2,
          }}
        >
          Let's Work Together
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
            maxWidth: '600px',
            mx: 'auto',
            pb: 2,
          }}
        >
          Whether you have a project in mind, want to discuss collaboration opportunities, or just
          want to connect, I'd love to hear from you. Feel free to reach out through any of the
          channels below!
        </Typography>

        <SocialLinks />
      </Paper>
    </Box>
  );
};

export default ContactInformation;
