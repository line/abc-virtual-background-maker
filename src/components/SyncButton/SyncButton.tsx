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

import { useAppConfiguration } from "@/hooks";
import styles from "./SyncButton.module.scss";

const SyncButton = (
  props: Pick<ButtonHTMLAttributes<HTMLButtonElement>, "className">,
) => {
  const { className = "" } = props;
  const { isSyncing, handleClickSync } = useAppConfiguration();
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
