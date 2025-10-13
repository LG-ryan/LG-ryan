import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Frontend: 5173 포트 + 백엔드 프록시(/api → :3000)
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
});
