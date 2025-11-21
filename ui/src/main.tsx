import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import { updateMetaTags } from './config/domainConfig';
import { enableVisualEditing } from '@sanity/visual-editing';
import { shouldEnableVisualEditing } from './utils/sanityPreview';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Update meta tags based on domain
updateMetaTags();

// Enable Sanity visual editing for presentation mode
// Security: Only enable if in a trusted Sanity Studio iframe with verified origin
if (shouldEnableVisualEditing()) {
  enableVisualEditing({
    zIndex: 999999,
  });
}
