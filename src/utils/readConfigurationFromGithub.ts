import { AxiosError, AxiosInstance } from "axios";

import type { Theme } from "@/constants";

export const readConfigurationFromGithub = async (
  githubAxios: AxiosInstance,
  path: string,
) => {
  try {
    const response = await githubAxios.get(`${path}/app.config.json`);
    const jsonData = JSON.parse(atob(response.data.content));
    const themesArray: Array<Theme> = jsonData.themes as Array<Theme>;

    return await readThemes(githubAxios, path, themesArray);
  } catch (error) {
    handleAxiosError(error as AxiosError, `${path}/app.config.json`);
    if (isNotFoundError(error as AxiosError)) {
      return await readThemesFromDirectory(githubAxios, path);
    }
  }
};

const readThemesFromDirectory = async (
  githubAxios: AxiosInstance,
  path: string,
) => {
  try {
    const backgroundsUriPath = path.split("/").at(-1);
    const response = await githubAxios.get(path);
    const themesArray = response.data
      .filter(({ type }: { type: string }) => type === "dir")
      .map(({ name }: { name: string }) => ({
        name,
        backgrounds: [],
      })) as Array<Theme>;

    await Promise.all(
      themesArray.map(async (theme: Theme) => {
        try {
          const themeResponse = await githubAxios.get(`${path}/${theme.name}`);
          themeResponse.data.map(({ path }: { path: string }) => {
            themesArray
              .find(({ name }) => name === theme.name)
              ?.backgrounds.push({
                theme: theme.name,
                src: path.replace(`${backgroundsUriPath}/`, ""),
              });
          });
        } catch (error) {
          handleAxiosError(error as AxiosError, `${path}/${theme.name}`);
        }
      }),
    );

    return await readThemes(githubAxios, path, themesArray);
  } catch (error) {
    handleAxiosError(error as AxiosError, path);
  }
};

const readThemes = async (
  githubAxios: AxiosInstance,
  path: string,
  themesArray: Array<Theme>,
) => {
  await Promise.all(
    themesArray.map(async (theme: Theme) => {
      await Promise.all(
        theme.backgrounds.map(async (background) => {
          try {
            const fontColor = background.src.split(".")?.[2]
              ? background.src.split(".")[1]
              : "";

            const response = await githubAxios.get(`${path}/${background.src}`);
            background.src = `data:image/jpeg;base64,${response.data.content}`;

            if (fontColor) {
              background.fontColor = fontColor;
            }
          } catch (error) {
            handleAxiosError(error as AxiosError, `${path}/${background.src}`);
          }
        }),
      );
    }),
  );

  return themesArray;
};

const handleAxiosError = (error: AxiosError, path: string) => {
  const errorMessage = `Error fetching repository contents for ${path}: ${error.message}`;
  console.error(errorMessage);
};

const isNotFoundError = (error: AxiosError) => {
  return error.response?.status === 404;
};
