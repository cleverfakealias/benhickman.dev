import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { PropsWithChildren } from 'react';

export default function PageShell({ children }: PropsWithChildren) {
  return (
    <Container
      maxWidth="lg"
      sx={{
        px: 5,
        py: 6,
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
