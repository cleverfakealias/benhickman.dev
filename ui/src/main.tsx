import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import { Container } from '@mui/material';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Container
      sx={{
        width: '90%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-center',
        alignItems: 'flex-center',
        paddingTop: { xs: 2, md: 3 },
        paddingBottom: { xs: 6, md: 8 }, // Increased bottom padding for footer space
        marginBottom: 0,
        gap: { xs: 2, md: 3 },
      }}
    >
      <App />
    </Container>
  </StrictMode>
);
