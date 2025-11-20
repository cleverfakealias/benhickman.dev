import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import { updateMetaTags } from './config/domainConfig';
import { enableVisualEditing } from '@sanity/visual-editing';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Update meta tags based on domain
updateMetaTags();

// Enable Sanity visual editing for presentation mode
// Only enable if loaded in an iframe (Presentation mode)
if (window.parent !== window) {
  enableVisualEditing({
    zIndex: 999999,
  });
}
