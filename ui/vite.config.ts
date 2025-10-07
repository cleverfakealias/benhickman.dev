import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const keyPath = path.resolve('localhost-key.pem');
  const certPath = path.resolve('localhost.pem');
  const hasLocalCerts = fs.existsSync(keyPath) && fs.existsSync(certPath);

  return {
    plugins: [react()],
    server:
      isDev && hasLocalCerts
        ? {
            https: {
              key: fs.readFileSync(keyPath),
              cert: fs.readFileSync(certPath),
            },
          }
        : {},
    define: {
      // Fix for libraries that expect process.env to be available
      'process.env': {},
      global: 'globalThis',
    },
    optimizeDeps: {
      include: ['@sanity/client'],
    },
  };
});
