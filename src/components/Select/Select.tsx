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
import { FocusEvent, MouseEvent, useEffect, useRef, useState } from "react";

import styles from "./Select.module.scss";

interface Props {
  defaultValue?: string;
  value?: string;
  options: Array<Record<"value" | "name", string>>;
  onChange: (value: string) => void;
}

const Select = (props: Props) => {
  const { defaultValue = "", value, options, onChange } = props;
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLUListElement>(null);

  const handleChange = (
    event: MouseEvent<HTMLButtonElement>,
    value: string,
  ) => {
    event.stopPropagation();
    onChange(value);
    setShowOptions(!showOptions);
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

  return (
    <div className={styles.box}>
      <button
        type="button"
        className={`${styles.button} ${showOptions ? styles.focused : ""}`}
        onClick={() => setShowOptions(!showOptions)}
      >
        {value ?? defaultValue}
        <span className={`material-symbols-outlined ${styles.icon}`}>
          expand_more
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
          {options.map(({ value, name }, index) => (
            <li key={index}>
              <button
                aria-selected={defaultValue === value}
                className={defaultValue === value ? styles.selected : ""}
                onClick={(e) => handleChange(e, value)}
                onBlur={(e) => e.stopPropagation()}
              >
                {name}
                {defaultValue === value && (
                  <span className={`material-symbols-outlined ${styles.check}`}>
                    check
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
