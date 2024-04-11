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
import { CSSProperties, useEffect, useRef } from "react";
import config from "~/output.config.json";
import { useTranslation } from "react-i18next";

import {
  DownloadButton,
  Editor,
  ImageList,
  SyncButton,
  ThemeMenu,
} from "@/components";
import { Config } from "@/constants/config";
import { AppProvider, useMediaQuery, useSnapshot, useTitle } from "@/hooks";
import styles from "./App.module.scss";

function App() {
  const { keyColor, title } = config as unknown as Config;
  const imageAreaRef = useRef<HTMLDivElement>(null);
  const { saveImage, loading } = useSnapshot(imageAreaRef);
  const { logo, text } = title;
  const changeTitle = useTitle();
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const { t } = useTranslation();

  useEffect(() => {
    changeTitle(text);
  }, [changeTitle, text]);

  return (
    <AppProvider>
      <div
        style={
          {
            "--key-color": `rgb(${
              prefersDark ? keyColor.dark : keyColor.light
            })`,
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
    </AppProvider>
  );
}

export default App;
