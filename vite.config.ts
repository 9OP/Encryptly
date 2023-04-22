import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig } from "vite";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";

const projectRootDir = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), chunkSplitPlugin({ strategy: "default" })],
  resolve: {
    alias: { "@app": resolve(projectRootDir, "/src") },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: false,
    cors: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        // Separate node_modules/ from src/
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },
      },
    },
  },
});
