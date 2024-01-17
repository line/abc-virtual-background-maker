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
import { useState } from "react";

import styles from "./AlignSelect.module.scss";

interface Props {
  defaultValue?: string;
  value?: string;
  options: Array<Record<"value" | "name", string>>;
  onChange: (value: string) => void;
}

const AlignSelect = (props: Props) => {
  const { defaultValue = "", value, options, onChange } = props;
  const [showOptions, setShowOptions] = useState(false);

  const handleChange = (value: string) => {
    onChange(value);
    setShowOptions(!showOptions);
  };

  return (
    <ul className={styles.aligns}>
      {options.map((option, index) => (
        <li key={index}>
          <button
            aria-selected={(value ?? defaultValue) === option.value}
            className={
              (value ?? defaultValue) === option.value ? styles.selected : ""
            }
            onClick={() => handleChange(option.value)}
          >
            <span className={`material-symbols-outlined ${styles.icon}`}>
              {`format_align_${option.name}`}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default AlignSelect;
