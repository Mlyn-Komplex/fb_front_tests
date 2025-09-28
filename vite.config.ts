/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  server: { open: true },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true, // allows using test(), expect(), etc. without imports
    environment: "jsdom", // simulates browser APIs (good for React/Vue testing)
    setupFiles: "./src/tests/setupTests.ts", // optional, for global test setup
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"], // which files to test
    exclude: [
      "node_modules",
      "dist",
      "src/components/ui",
      "src/tests",
      "src/main.tsx",
    ], // files/folders to skip
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
    coverage: {
      provider: "v8", // coverage engine (fast + no deps)
      reporter: ["text", "html"], // generate text + HTML reports
      all: true, // include all files in coverage (not only tested files)
      exclude: [
        "node_modules/**",
        "dist/**",
        "src/tests/**",
        "src/main.tsx",
        "src/components/ui/**",
        "**/*.test.{ts,tsx,js,jsx}",
        "**/*.d.ts",
        "vite.config.ts",
        "vitest.config.ts",
        "eslint.config.js",
        "tailwind.config.js",
        "src/components/typography/**",
        "src/layouts/**",
      ],
    },
  },
});
