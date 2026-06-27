import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  resolve: {
    alias: {
      "./dist/index.js": fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      "@io-gui/core": fileURLToPath(new URL("./node_modules/@io-gui/core/dist/index.js", import.meta.url)),
      "@io-gui/icons": fileURLToPath(new URL("./node_modules/@io-gui/icons/dist/index.js", import.meta.url)),
      "@io-gui/inputs": fileURLToPath(new URL("./node_modules/@io-gui/inputs/dist/index.js", import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
});
