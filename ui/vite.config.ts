import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync("localhost-key.pem"),
      cert: fs.readFileSync("localhost.pem"),
    },
  },
  define: {
    // Fix for libraries that expect process.env to be available
    "process.env": {},
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["@sanity/client"],
  },
});