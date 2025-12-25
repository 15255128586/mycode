import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const ingestTarget =
  process.env.VITE_DOC_INGEST_PROXY_TARGET || "http://127.0.0.1:9100";
const composeTarget =
  process.env.VITE_COMPOSE_PROXY_TARGET || "http://127.0.0.1:8000";
const fileTarget =
  process.env.VITE_FILE_MANAGER_PROXY_TARGET || "http://127.0.0.1:9300";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api/ingest": {
        target: ingestTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ingest/, "/ingest")
      },
      "/api/compose": {
        target: composeTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/compose/, "")
      },
      "/api/files": {
        target: fileTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/files/, "/files")
      }
    }
  }
});
