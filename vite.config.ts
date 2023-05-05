import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import eslint from 'vite-plugin-eslint';
import { dependencies } from './package.json';

const projectRootDir = resolve(__dirname);

function renderChunks(deps: Record<string, string>) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['react', 'react-router-dom', 'react-dom'].includes(key)) return;
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
    splitVendorChunkPlugin(),
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
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom'],
          ...renderChunks(dependencies),
        },
      },
    },
  },
});
