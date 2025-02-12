import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enables global test functions like test(), expect(), etc.
    environment: "jsdom", // Simulates a browser environment for React components
    setupFiles: "./test/setup.ts", // Optional: Add a setup file for global configurations
  },
});
