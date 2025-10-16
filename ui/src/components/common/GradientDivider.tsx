import React from 'react';
import { Box, useTheme } from '@mui/material';

interface GradientDividerProps {
  width?: string | number | { xs: string | number; md: string | number };
  height?: string | number;
  margin?: string | number;
  gradient?: string;
}

const GradientDivider: React.FC<GradientDividerProps> = ({
  width = { xs: '80%', md: '400px' },
  height = '5px',
  margin = 'auto',
  gradient,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width,
        height,
        background:
          gradient || `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        borderRadius: '4px',
        mx: margin,
      }}
    />
  );
};

export default GradientDivider;
