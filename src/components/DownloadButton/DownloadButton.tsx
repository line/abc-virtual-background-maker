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
import { ButtonHTMLAttributes } from "react";

import { Loading } from "@/components";
import locales from "@/locales/common.json";
import styles from "./DownloadButton.module.scss";

interface Props
  extends Pick<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "disabled" | "onClick"
  > {
  isLoading: boolean;
}

const DownloadButton = (props: Props) => {
  const { isLoading, disabled, onClick } = props;

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`${styles.button} ${disabled ? styles.disabled : ""}`}
      onClick={onClick}
    >
      <span className={styles.icon}>
        {isLoading ? (
          <Loading />
        ) : (
          <span className="material-symbols-outlined">download</span>
        )}
      </span>
      <span className={styles.text}>{locales["button"]["download"]}</span>
    </button>
  );
};

export default DownloadButton;
