import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
  },
  plugins: [react(), tsconfigPaths()],
  define: {
    global: {},
  },
  server: {
    // allowedHosts: ["d00c-103-110-255-223.ngrok-free.app"],
    proxy: {
      "/api/": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
