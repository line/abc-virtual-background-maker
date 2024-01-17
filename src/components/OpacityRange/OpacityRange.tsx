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
  CSSProperties,
  InputHTMLAttributes,
  useRef,
  useState,
} from "react";

import styles from "./OpacityRange.module.scss";

interface Props
  extends Pick<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  defaultValue?: number;
}

const OpacityRange = (props: Props) => {
  const { defaultValue = 100, onChange } = props;
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(Number(event.target.value));
    onChange?.(event);
  };

  return (
    <label className={styles.opacity}>
      <span className={styles.number}>{selectedValue ?? defaultValue}</span>
      <input
        ref={inputRef}
        type="range"
        min={0}
        max={100}
        value={selectedValue ?? defaultValue}
        onChange={handleChange}
        onFocus={(e) => e.stopPropagation()}
        style={
          {
            "--percentage": `${selectedValue ?? defaultValue}%`,
          } as CSSProperties
        }
      />
    </label>
  );
};

export default OpacityRange;
