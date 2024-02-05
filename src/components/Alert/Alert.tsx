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

import type {
  ButtonHTMLAttributes,
  KeyboardEvent,
  PropsWithChildren,
} from "react";
import { useCallback, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import styles from "./Alert.module.scss";

interface Props extends PropsWithChildren {
  onClose: VoidFunction;
}

const Alert = (props: Props) => {
  const { onClose, children } = props;

  const dialogRoot = document.getElementsByTagName("body")[0];
  const dialogRef = useRef<HTMLDivElement>(document.createElement("div"));
  const dialogRefCurrent = dialogRef.current;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (dialogRefCurrent && dialogRoot) {
      dialogRoot.appendChild(dialogRefCurrent);

      return () => {
        dialogRoot.removeChild(dialogRefCurrent);
      };
    }
  }, [dialogRefCurrent, dialogRoot]);

  return ReactDOM.createPortal(
    <div
      className={styles.dim}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <span className="material-symbols-outlined">error</span>
        {children}
      </div>
    </div>,
    dialogRefCurrent,
  );
};

export default Alert;

export const AlertButton = ({
  onClick,
  children,
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={styles.button} onClick={onClick}>
    {children}
  </button>
);
