import fs from "fs";
import path from "path";
import react from "@vitejs/plugin-react";
import copy from "rollup-plugin-copy";
import { defineConfig } from "vite";
import stylelint from "vite-plugin-stylelint";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

import config from "./app.config.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    stylelint({
      fix: true,
    }),
    copyBackgroundsForFileSystem(),
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

/**
 * If config has `filesystem` type for `backgroundsUri`, copy local backgrounds path to dist folder
 */
function copyBackgroundsForFileSystem() {
  if (
    config.backgroundsUri &&
    config.backgroundsUri.type === "filesystem" &&
    config.backgroundsUri.path
  ) {
    const dir = path.resolve();
    const sourceDirectory = config.backgroundsUri.path;
    const targetDirectory = "dist";
    const order = config.themes.map(({ name }) => name);

    const fileContentsArray = readFilesRecursively(sourceDirectory);

    order.map((theme, index) => {
      const filteredFileContentsArray = fileContentsArray.filter(
        ({ theme: fileTheme }) => fileTheme === theme,
      );
      config.themes[index].backgrounds = filteredFileContentsArray;
    });

    const configJsonPath = path.join(dir, "app.config.json");
    fs.writeFileSync(configJsonPath, JSON.stringify(config, null, 2));

    return copy({
      targets: [{ src: sourceDirectory, dest: targetDirectory }],
      hook: "writeBundle",
    });
  }
}

function readFilesRecursively(dir) {
  const fileContentsArray = [];

  const readFiles = (dir) => {
    const files = fs.readdirSync(dir);
    const order = config.themes.map(({ name }) => name);
    const sortedFiles = files.sort(
      (a, b) => order.indexOf(a) - order.indexOf(b),
    );

    sortedFiles.forEach((file) => {
      const filePath = path.join(dir, file);

      if (fs.statSync(filePath).isDirectory()) {
        readFiles(filePath);
      } else if (isImageFile(filePath)) {
        const item = file.split(".")?.[2]
          ? {
              theme: dir.replace(`${config.backgroundsUri.path}/`, ""),
              src: filePath,
              fontColor: file.split(".")[1],
            }
          : {
              theme: dir.replace(`${config.backgroundsUri.path}/`, ""),
              src: filePath,
            };
        fileContentsArray.push(item);
      }
    });
  };

  readFiles(dir);

  return fileContentsArray;
}

function isImageFile(filePath) {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  const extension = path.extname(filePath).toLowerCase();
  return allowedExtensions.includes(extension);
}
