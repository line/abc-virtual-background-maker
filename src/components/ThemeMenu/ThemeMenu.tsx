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

import { useAppConfiguration } from "@/hooks";
import styles from "./ThemeMenu.module.scss";

const ThemeMenu = () => {
  const {
    themes,
    customImages,
    selectedTheme,
    handleChangeTheme,
    handleChangeImage,
  } = useAppConfiguration();

  const handleChangeDefaultImage = (theme: string) => {
    if (theme === "all") {
      handleChangeImage(themes[0].name, themes[0].backgrounds[0]);
    } else if (theme === "custom") {
      handleChangeImage("custom", customImages?.[0] ?? { src: "" });
    } else {
      handleChangeImage(
        themes.filter(({ name: themeName }) => themeName === theme)[0].name,
        themes.filter(({ name: themeName }) => themeName === theme)[0]
          .backgrounds[0],
      );
    }
  };

  return (
    <ul className={styles.chips}>
      {[
        { name: "all", isNew: false },
        ...themes,
        { name: "custom", isNew: false },
      ].map(({ name, isNew }, index) => (
        <li key={index}>
          <button
            type="button"
            className={selectedTheme === name ? styles.selected : ""}
            onClick={() => {
              handleChangeTheme(name);
              handleChangeDefaultImage(name);
            }}
          >
            {name}
            {isNew && (
              <span className="material-symbols-outlined">fiber_new</span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ThemeMenu;
