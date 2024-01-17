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
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

import { IconToggle } from "@/icons";
import styles from "./ToggleOption.module.scss";

interface Props
  extends Pick<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "disabled" | "onClick"
  > {
  label: ReactNode;
  isSelected: boolean;
  isRequired?: boolean;
}

const ToggleOption = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { label, isSelected, isRequired, disabled, onClick } = props;

  return (
    <div className={styles.option}>
      <p className={isRequired ? styles.required : ""}>{label}</p>
      <button
        ref={ref}
        disabled={disabled || isRequired}
        aria-label={isSelected ? "toggle on" : "toggle off"}
        aria-pressed={isSelected}
        onClick={onClick}
      >
        <IconToggle />
      </button>
    </div>
  );
});

export default ToggleOption;
