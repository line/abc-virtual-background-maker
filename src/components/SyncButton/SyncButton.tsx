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
import { ButtonHTMLAttributes, useCallback, useState } from "react";
import config from "~/output.config.json";
import axios, { AxiosError } from "axios";
import { useSetRecoilState } from "recoil";

import type { Config, Theme } from "@/constants";
import { selectedBackgroundState, themesState } from "@/states";
import { readConfigurationFromGithub } from "@/utils";
import styles from "./SyncButton.module.scss";

// Create a custom axios instance with default headers
const githubAxios = axios.create({
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  },
});

const SyncButton = (
  props: Pick<ButtonHTMLAttributes<HTMLButtonElement>, "className">,
) => {
  const { className = "" } = props;
  const { themes, backgroundsUri } = config as unknown as Config;

  const [isSyncing, setIsSyncing] = useState(false);
  const setThemes = useSetRecoilState(themesState);
  const setSelectedBackground = useSetRecoilState(selectedBackgroundState);

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

  const handleClickSync = useCallback(() => {
    setIsSyncing(true);
    backgroundsUri && resetThemes(backgroundsUri.path, backgroundsUri.type);
    const timer = setTimeout(() => {
      setIsSyncing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [backgroundsUri, resetThemes]);

  return (
    <button
      type="button"
      className={`${styles.button} ${
        isSyncing ? styles.spin : ""
      } ${className}`}
      onClick={handleClickSync}
      aria-label="Sync themes background images"
    >
      <span className="material-symbols-outlined">sync</span>
    </button>
  );
};

export default SyncButton;
