import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  optimizeDeps: { include: ["@araneda/shared"] },
  build: {
    commonjsOptions: { include: [/shared/, /node_modules/] }
  }
});
