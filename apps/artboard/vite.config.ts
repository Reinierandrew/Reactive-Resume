/// <reference types='vitest' />

import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  base: "/artboard/",

  cacheDir: "../../node_modules/.vite/artboard",

  build: {
    sourcemap: true,
    emptyOutDir: true,
  },

  server: {
    host: true,
    port: 6173,
    fs: { allow: [searchForWorkspaceRoot(process.cwd())] },
  },

  plugins: [
    react(),
    nxViteTsPaths(),
    nodePolyfills({
      // Exclude modules that cause issues
      exclude: ["fs"],
      // Include only what's needed
      include: ["path", "url"],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],

  optimizeDeps: {
    esbuildOptions: {
      // Polyfill Node.js modules for browser compatibility
      define: {
        global: "globalThis",
      },
    },
    // Include sanitize-html for proper CommonJS handling
    include: ["sanitize-html", "react", "react-dom"],
  },

  resolve: {
    alias: {
      "@/artboard/": `${searchForWorkspaceRoot(process.cwd())}/apps/artboard/src/`,
    },
  },

  // Define Node.js globals for browser compatibility
  define: {
    global: "globalThis",
    "process.env": "{}",
  },
});
