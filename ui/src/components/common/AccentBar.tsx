import React from 'react';
import { Box, useTheme } from '@mui/material';

interface AccentBarProps {
  height?: number | string;
  borderRadius?: number | string;
  sx?: object;
}

// Usage: AccentBar always has sharp corners for a modern, squared look.
const AccentBar: React.FC<AccentBarProps> = ({ height = 8, sx = {} }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height,
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #7C4DFF, #448AFF)'
            : 'linear-gradient(90deg, #412A91, #002B5C)',
        opacity: 0.9,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        zIndex: 2,
        ...sx,
      }}
    />
  );
};

export default AccentBar;
