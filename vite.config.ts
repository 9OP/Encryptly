import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

const projectRootDir = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@app": resolve(projectRootDir, "/src") },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: false,
    cors: true,
  },
  build: {
    outDir: "dist",
  },
});
