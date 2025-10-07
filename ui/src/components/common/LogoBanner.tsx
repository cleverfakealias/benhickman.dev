import React from 'react';
import { Box } from '@mui/material';

const LogoBanner: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 'auto',
        padding: 2,
      }}
    >
      <img
        src="/images/facebook_cover_photo_1.png"
        alt="logo"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </Box>
  );
};

export default LogoBanner;
