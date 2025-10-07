import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';

interface SuccessScreenProps {
  onSendAnother: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ onSendAnother }) => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: theme.typography.fontWeightBold,
          color: theme.palette.primary.main,
        }}
      >
        Thank You!
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Your message has been successfully sent. I will get back to you soon.
      </Typography>
      <Button
        variant="contained"
        sx={{
          mt: 3,
          px: 5,
          py: 1.5,
          borderRadius: '4px',
          fontWeight: theme.typography.fontWeightBold,
          fontSize: theme.typography.body1?.fontSize,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: theme.palette.getContrastText(theme.palette.primary.main),
          boxShadow: theme.custom.shadows.button.dark,
          '&:hover': {
            background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark || theme.palette.secondary.main} 100%)`,
          },
        }}
        onClick={onSendAnother}
      >
        Send Another Message
      </Button>
    </Box>
  );
};

export default SuccessScreen;
