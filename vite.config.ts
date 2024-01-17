import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import stylelint from "vite-plugin-stylelint";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    stylelint({
      fix: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/styles/_mixin.scss" as *;`,
      },
    },
  },
  assetsInclude: ["**/*.md"],
});
