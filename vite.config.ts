import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

import { dependencies } from './package.json';

const projectRootDir = resolve(__dirname);

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
      cache: true,
      output: {
        format: 'esm',
        manualChunks: function manualChunks(id) {
          const chunks = {
            framer: ['framer-motion'],
            ui: ['chakra-ui'],
            react: ['react', 'react-router-dom', 'react-dom'],
          };

          for (const [key, val] of Object.entries(chunks)) {
            if (val.reduce((acc, v) => id.includes(v) || acc, false)) {
              return key;
            }
          }

          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // manualChunks: {
        //   ...BASE_CHUNKS,
        //   ...renderChunks(dependencies),
        // },
      },
    },
  },
});
