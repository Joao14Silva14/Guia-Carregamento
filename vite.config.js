import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Build otimizado: React num ficheiro separado (fica em cache entre publicações)
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    cssMinify: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: { manualChunks: { react: ["react", "react-dom"] } },
    },
  },
});
