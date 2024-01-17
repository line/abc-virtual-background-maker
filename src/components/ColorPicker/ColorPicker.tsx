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
import { ChangeEvent, InputHTMLAttributes, useRef, useState } from "react";

import styles from "./ColorPicker.module.scss";

interface Props
  extends Pick<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  defaultValue?: string;
}

const ColorPicker = (props: Props) => {
  const { defaultValue = "", onChange } = props;
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    onChange?.(event);
  };

  return (
    <label className={styles.picker}>
      <span
        className={styles.color}
        style={{ backgroundColor: selectedValue ?? defaultValue }}
      />
      {selectedValue ?? defaultValue}{" "}
      <span className={`material-symbols-outlined ${styles.icon}`}>
        expand_more
      </span>
      <input ref={inputRef} type="color" onChange={handleChange} />
    </label>
  );
};

export default ColorPicker;
