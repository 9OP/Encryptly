import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import { dependencies } from './package.json';

const projectRootDir = resolve(__dirname);

const BASE_CHUNKS = {
  // vendor: ['react', 'react-router-dom', 'react-dom', 'swr', 'react-icons'],
  // ui: ['@chakra-ui/react', '@emotion/react'],
  vendor: ['react', 'react-router-dom', 'react-dom'],
};

function renderChunks(deps: Record<string, string>) {
  const chunks = {};
  const alreadySplit = Object.values(BASE_CHUNKS).reduce((acc, l) => acc.concat(l), []);
  Object.keys(deps).forEach((key) => {
    if (alreadySplit.includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      // default settings on build (i.e. fail on error)
      ...eslint(),
      apply: 'build',
    },
    {
      // do not fail on serve (i.e. local development)
      ...eslint({
        failOnWarning: false,
        failOnError: false,
        fix: true,
      }),
      apply: 'serve',
      enforce: 'post',
    },
    // splitVendorChunkPlugin(),
  ],
  // base: "/Encryptly/",
  resolve: {
    alias: { '@app': resolve(projectRootDir, '/src') },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
    cors: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        format: 'esm',
        manualChunks: {
          ...BASE_CHUNKS,
          ...renderChunks(dependencies),
        },
      },
    },
  },
});
