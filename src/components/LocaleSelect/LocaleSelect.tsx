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
import { FocusEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Locales } from "@/constants/locale";
import styles from "./LocaleSelect.module.scss";

const LocaleSelect = () => {
  const { i18n } = useTranslation();
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLUListElement>(null);

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
    setShowOptions(false);
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!optionsRef?.current?.contains(event.relatedTarget)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    if (showOptions) {
      optionsRef?.current?.focus();
    } else {
      optionsRef?.current?.blur();
    }
  }, [showOptions]);

  if (Locales.length <= 1) {
    return <></>;
  }

  return (
    <div className={styles.box}>
      <button
        type="button"
        className={`${styles.button} ${showOptions ? styles.focused : ""}`}
        onClick={() => setShowOptions(!showOptions)}
      >
        <span className={`material-symbols-outlined ${styles.icon}`}>
          language
        </span>
      </button>
      {showOptions && (
        <ul
          className={styles.options}
          ref={optionsRef}
          tabIndex={0}
          onFocus={(e) => {
            e.stopPropagation();
          }}
          onBlur={handleBlur}
        >
          {Locales.map((locale, index) => {
            const isSelected = locale === i18n.language;
            const languageNames = new Intl.DisplayNames([locale], {
              type: "language",
            });

            return (
              <li key={index}>
                <button
                  type="button"
                  aria-selected={isSelected}
                  className={isSelected ? styles.selected : ""}
                  onClick={() => handleChange(locale)}
                  onBlur={(e) => e.stopPropagation()}
                >
                  {languageNames.of(locale)}
                  {isSelected && (
                    <span
                      className={`material-symbols-outlined ${styles.check}`}
                    >
                      check
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LocaleSelect;
