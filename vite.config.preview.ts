import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  root: "./preview",
  base: "/antd-data-table/",
  build: {
    outDir: "../demo-dist",
  },
});