import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react(), visualizer({ open: true, gzipSize: true })],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@mui")) return "mui";
            if (id.includes("react") || id.includes("react-dom"))
              return "react-vendor";
            if (id.includes("axios")) return "axios";
            if (id.includes("moment")) return "moment"; // عزل moment في chunk منفصل
            return "vendor";
          }
        },
      },
    },
    // إضافة هذه الخيارات لتحسين التوافق
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@mui/material", "axios", "moment"],
    esbuildOptions: {
      target: "esnext",
    },
  },
});
