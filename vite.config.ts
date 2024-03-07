import fs from "fs";
import path from "path";
import react from "@vitejs/plugin-react";
import copy from "rollup-plugin-copy";
import { defineConfig } from "vite";
import stylelint from "vite-plugin-stylelint";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

import type { Config } from "@/constants/config.ts";
import type { Image } from "@/constants/image.ts";
import config from "./app.config.json";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    stylelint({
      fix: true,
    }),
    copyContributeGuide(),
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

function copyContributeGuide() {
  const { contributeGuide } = config as unknown as Config;
  const targetDirectory = "dist";

  return copy({
    targets: [
      {
        src: contributeGuide,
        dest: targetDirectory,
      },
    ],
    hook: "writeBundle",
  });
}

/**
 * If config has `filesystem` type for `backgroundsUri`, copy local backgrounds path to dist folder
 */
function copyBackgroundsForFileSystem() {
  const { backgroundsUri, themes } = config as unknown as Config;

  if (
    backgroundsUri &&
    backgroundsUri.type === "filesystem" &&
    backgroundsUri.path
  ) {
    const dir = path.resolve();
    const sourceDirectory = backgroundsUri.path;
    const targetDirectory = "dist";
    const order = themes.map(({ name }) => name);
    const filteredOrder = themes
      .filter(({ isHidden }) => !isHidden)
      .map(({ name }) => name);

    const fileContentsArray = readFilesRecursively(sourceDirectory);

    order.map((theme, index) => {
      const isThemeHidden =
        themes.filter(({ name }) => name === theme)[0]?.isHidden ?? false;
      const filteredFileContentsArray = fileContentsArray.filter(
        ({ theme: fileTheme }) => fileTheme === theme,
      );

      themes[index]["backgrounds"] = isThemeHidden
        ? []
        : filteredFileContentsArray.map(({ src, fontColor }) =>
            fontColor ? { src, fontColor } : { src },
          );
    });

    const configJsonPath = path.join(dir, "output.config.json");
    fs.writeFileSync(configJsonPath, JSON.stringify(config, null, 2));

    return copy({
      targets: filteredOrder.map((theme) => ({
        src: path.join(sourceDirectory, theme),
        dest: path.join(targetDirectory, backgroundsUri.path),
      })),
      hook: "writeBundle",
    });
  } else {
    const dir = path.resolve();
    const configJsonPath = path.join(dir, "output.config.json");
    fs.writeFileSync(configJsonPath, JSON.stringify(config, null, 2));
  }
}

function readFilesRecursively(dir: string) {
  const { backgroundsUri, themes } = config as unknown as Config;
  const fileContentsArray: Image[] = [];

  const readFiles = (dir: string) => {
    const files = fs.readdirSync(dir);
    const order = themes
      .filter(({ isHidden = false }) => !isHidden)
      .map(({ name }) => name);
    const sortedFiles = files.sort(
      (a, b) => order.indexOf(a) - order.indexOf(b),
    );

    sortedFiles.forEach((file) => {
      const filePath = path.join(dir, file);
      const theme = dir.replace(path.join(backgroundsUri.path, path.sep), "");

      if (fs.statSync(filePath).isDirectory()) {
        readFiles(filePath);
      } else if (isImageFile(filePath)) {
        const item = file.split(".")?.[2]
          ? {
              theme,
              src: filePath,
              fontColor: file.split(".")[1],
            }
          : {
              theme,
              src: filePath,
            };
        fileContentsArray.push(item);
      }
    });
  };

  readFiles(dir);

  return fileContentsArray;
}

function isImageFile(filePath: string) {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  const extension = path.extname(filePath).toLowerCase();
  return allowedExtensions.includes(extension);
}
