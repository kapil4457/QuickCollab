import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
const env = loadEnv(mode, process.cwd(), "");
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: env.VITE_API_BASE_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
