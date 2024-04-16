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
import { CSSProperties, useCallback, useEffect, useRef } from "react";
import config from "~/output.config.json";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

import {
  DownloadButton,
  Editor,
  ImageList,
  SyncButton,
  ThemeMenu,
} from "@/components";
import type { Config, Theme } from "@/constants";
import { useMediaQuery, useSnapshot, useTitle } from "@/hooks";
import {
  customBackgroundsState,
  defaultInputFieldsState,
  selectedBackgroundState,
  selectedThemeState,
  themesState,
} from "@/states";
import { readConfigurationFromGithub } from "@/utils";
import styles from "./App.module.scss";

// Create a custom axios instance with default headers
const githubAxios = axios.create({
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  },
});

function App() {
  const { keyColor, title, themes, backgroundsUri, defaultInputFields } =
    config as unknown as Config;
  const imageAreaRef = useRef<HTMLDivElement>(null);
  const { saveImage, loading } = useSnapshot(imageAreaRef);
  const { logo, text } = title;
  const changeTitle = useTitle();
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const { t } = useTranslation();

  const setThemes = useSetRecoilState(themesState);
  const selectedTheme = useRecoilValue(selectedThemeState);
  const customBackgrounds = useRecoilValue(customBackgroundsState);
  const setSelectedBackground = useSetRecoilState(selectedBackgroundState);
  const setDefaultInputFields = useSetRecoilState(defaultInputFieldsState);

  const resetThemes = useCallback(
    async (path: string, type: string) => {
      const lowerCasedType = type.trim().toLowerCase();

      switch (lowerCasedType) {
        case "filesystem":
        case "cdn":
          setThemes(
            themes.filter(({ isHidden = false }) => !isHidden) as Array<Theme>,
          );
          setSelectedBackground((themes[0] as Theme)?.backgrounds[0] ?? []);
          break;
        case "github":
          try {
            const themes = await readConfigurationFromGithub(githubAxios, path);
            if (themes) {
              setThemes(themes.filter(({ isHidden = false }) => !isHidden));
              setSelectedBackground(themes[0].backgrounds[0]);
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
    [setSelectedBackground, setThemes, themes],
  );

  useEffect(() => {
    backgroundsUri && resetThemes(backgroundsUri.path, backgroundsUri.type);
  }, [backgroundsUri, resetThemes]);

  useEffect(() => {
    if (selectedTheme === "custom") {
      setSelectedBackground({
        theme: "custom",
        src:
          customBackgrounds?.length <= 0
            ? ""
            : customBackgrounds[customBackgrounds.length - 1].src,
      });
    }
  }, [selectedTheme, customBackgrounds, setSelectedBackground]);

  useEffect(() => {
    setDefaultInputFields(defaultInputFields);
  }, [defaultInputFields, setDefaultInputFields]);

  useEffect(() => {
    changeTitle(text);
  }, [changeTitle, text]);

  return (
    <div
      style={
        {
          "--key-color": `rgb(${prefersDark ? keyColor.dark : keyColor.light})`,
        } as CSSProperties
      }
    >
      <div className={styles.bar}>
        <h1 className={styles.logo}>
          <img src={logo} alt={text} width={255} height={20} />
        </h1>
        <DownloadButton
          onClick={() => {
            saveImage("abc-virtual-background.png");
          }}
          isLoading={loading}
        />
      </div>
      <div className={styles.content}>
        <nav className={styles.navigation}>
          <h2>
            {t("title.theme")} <SyncButton />
          </h2>
          <div>
            <ThemeMenu />
            <ImageList />
          </div>
        </nav>
        <Editor ref={imageAreaRef} />
      </div>
    </div>
  );
}

export default App;
