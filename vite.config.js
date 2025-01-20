import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-redirects",
      writeBundle() {
        const redirectsPath = path.resolve(
          new URL(".", import.meta.url).pathname,
          "_redirects"
        );
        const distRedirectsPath = path.resolve(
          new URL(".", import.meta.url).pathname,
          "dist/_redirects"
        );

        // Check if the _redirects file exists before copying
        if (fs.existsSync(redirectsPath)) {
          fs.copyFileSync(redirectsPath, distRedirectsPath);
        } else {
          console.warn("No _redirects file found, skipping copy.");
        }
      },
    },
  ],
  esbuild: {
    target: "esnext", // Target modern JavaScript environments
  },
  build: {
    target: "esnext",
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks(id) {
          // This will ensure dynamic imports don't conflict with statically imported modules
          if (id.includes("react-icons")) {
            return "react-icons"; // Create a separate chunk for react-icons
          }
          if (id.includes("axios")) {
            return "axios"; // Create a separate chunk for axios
          }
          if (id.includes(".mp3")) {
            return "assets"; // Group assets like .mp3 files in a separate chunk
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "@fullcalendar/core",
      "@fullcalendar/react",
      "@fullcalendar/daygrid",
      "@fullcalendar/timegrid",
      "@fullcalendar/interaction",
    ],
  },
});
