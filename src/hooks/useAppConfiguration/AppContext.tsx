/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import {
  ChangeEvent,
  createContext,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import config from "~/output.config.json";
import axios, { AxiosError } from "axios";

import { Image, InputFieldGroup, Theme } from "@/constants";
import { Config } from "@/constants/config";
import { readConfigurationFromGithub } from "@/utils";

// Create a custom axios instance with default headers
const githubAxios = axios.create({
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  },
});

interface ContextProps {
  themes: Array<Theme>;
  selectedTheme: string;
  selectedImage: Image;
  customImages: Array<Image>;
  defaultInputFields: Array<InputFieldGroup>;
  isSyncing: boolean;
  handleClickSync: (event: MouseEvent<HTMLButtonElement>) => void;
  handleChangeTheme: (theme: string) => void;
  handleChangeImage: (theme: string, image: Image) => void;
  handleDropCustomImages: (event: DragEvent) => void;
  handleChangeCustomImages: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDeleteCustomImage: (src: string) => void;
}

export const AppContext = createContext<ContextProps>({
  themes: [],
  customImages: [],
  selectedTheme: "all",
  selectedImage: {
    src: "",
  },
  defaultInputFields: [],
  isSyncing: false,
  handleClickSync: () => {},
  handleChangeTheme: () => {},
  handleChangeImage: () => {},
  handleDropCustomImages: () => {},
  handleChangeCustomImages: () => {},
  handleDeleteCustomImage: () => {},
});

export const AppProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const {
    backgroundsUri,
    defaultInputFields,
    themes: configThemes,
  } = config as unknown as Config;
  const [themes, setThemes] = useState<Array<Theme>>([]);
  const [selectedImage, setSelectedImage] = useState<Image>({
    src: "",
  });
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [customImages, setCustomImages] = useState<Array<Image>>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const resetThemes = useCallback(
    async (path: string, type: string) => {
      const lowerCasedType = type.trim().toLowerCase();
      switch (lowerCasedType) {
        case "filesystem":
        case "cdn":
          setThemes(
            configThemes.filter(
              ({ isHidden = false }) => !isHidden,
            ) as Array<Theme>,
          );
          setSelectedImage((configThemes[0] as Theme)?.backgrounds[0] ?? []);
          break;
        case "github":
          try {
            const themes = await readConfigurationFromGithub(githubAxios, path);
            if (themes) {
              setThemes(themes.filter(({ isHidden = false }) => !isHidden));
              setSelectedImage(themes[0].backgrounds[0]);
            }
          } catch (error) {
            console.error(
              `Error reading configuration from github:`,
              (error as AxiosError).message,
            );
          }
          break;
        default:
          console.warn("Unknown type:", type);
      }
    },
    [configThemes],
  );

  const handleDropCustomImages = (event: DragEvent) => {
    const file = ((event.dataTransfer as DataTransfer).files as FileList)[0];
    const src = URL.createObjectURL(file);

    if (file.type.includes("image")) {
      setCustomImages([...customImages, { src, theme: "custom" }]);
    } else {
      throw new Error("FileNotAcceptable");
    }
    return () => URL.revokeObjectURL(src);
  };

  const handleChangeCustomImages = (event: ChangeEvent<HTMLInputElement>) => {
    const src = URL.createObjectURL(
      ((event.target as HTMLInputElement).files as FileList)[0],
    );
    setCustomImages([...customImages, { src, theme: "custom" }]);

    return () => URL.revokeObjectURL(src);
  };

  const handleDeleteCustomImage = (src: string) => {
    setCustomImages([...customImages.filter((file) => file.src !== src)]);
  };

  const handleChangeTheme = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handleChangeImage = (theme: string, image: Image) => {
    setSelectedImage({ theme, ...image });
  };

  const handleClickSync = useCallback(() => {
    setIsSyncing(true);
    backgroundsUri && resetThemes(backgroundsUri.path, backgroundsUri.type);
    const timer = setTimeout(() => {
      setIsSyncing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [backgroundsUri, resetThemes]);

  useEffect(() => {
    backgroundsUri && resetThemes(backgroundsUri.path, backgroundsUri.type);
  }, [backgroundsUri, resetThemes]);

  useEffect(() => {
    if (selectedTheme === "custom") {
      handleChangeImage(
        "custom",
        customImages?.length > 0
          ? customImages[customImages.length - 1]
          : { src: "" },
      );
    }
  }, [selectedTheme, customImages]);

  return (
    <AppContext.Provider
      value={{
        themes,
        customImages,
        selectedTheme,
        selectedImage,
        defaultInputFields: defaultInputFields as Array<InputFieldGroup>,
        isSyncing,
        handleClickSync,
        handleChangeTheme,
        handleChangeImage,
        handleDropCustomImages,
        handleChangeCustomImages,
        handleDeleteCustomImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
