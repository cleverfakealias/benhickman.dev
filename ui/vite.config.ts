import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const keyPath = path.resolve('config/certs/localhost-key.pem');
  const certPath = path.resolve('config/certs/localhost.pem');
  const hasLocalCerts = fs.existsSync(keyPath) && fs.existsSync(certPath);

  const analyze = process.env.ANALYZE === '1';

  return {
    plugins: [
      react(),
      ...(analyze
        ? [
            visualizer({
              filename: 'stats.html',
              template: 'treemap',
              gzipSize: true,
              brotliSize: true,
              open: true,
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
      },
    },
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
    },
    build: {
      target: 'esnext',
      cssCodeSplit: true,
      sourcemap: !!process.env.CI,
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
            sanity: ['@sanity/client', '@portabletext/react'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['@sanity/client', '@portabletext/react'],
    },
  };
});
