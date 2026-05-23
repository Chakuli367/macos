// @ts-nocheck

import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// ----------------------------------------------------------------------

const PORT = 3039;

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  server: { port: PORT, host: true },
  preview: {
    port: PORT,
    host: true,
    allowedHosts: ['one234-2893.onrender.com'], // <-- allow Render host
  },
  esbuild: {
    // ignore all TS errors
    logOverride: {
      'tsconfig-paths': 'silent',
      'ts-error': 'silent',
    },
  },
});