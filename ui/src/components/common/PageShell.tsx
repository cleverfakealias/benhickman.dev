import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { PropsWithChildren } from 'react';

export default function PageShell({ children }: PropsWithChildren) {
  return (
    <Container
      maxWidth="lg"
      sx={{
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 6 },
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, md: 3 },
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
