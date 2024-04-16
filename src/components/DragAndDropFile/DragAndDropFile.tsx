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

import { ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

import { Alert, AlertButton } from "@/components";
import { useDragAndDrop } from "@/hooks";
import { customBackgroundsState } from "@/states";
import styles from "./DragAndDropFile.module.scss";

const DragAndDropFile = () => {
  const dragRef = useRef<HTMLInputElement>(null);
  const [showAlert, setShowAlert] = useState(false);
  const handleDrop = (e: DragEvent) => {
    try {
      handleDropCustomImages(e);
    } catch (e) {
      setShowAlert(true);
    }
  };
  const { isDragging } = useDragAndDrop(dragRef, handleDrop);
  const { t } = useTranslation();
  const [customBackgrounds, setCustomBackgrounds] = useRecoilState(
    customBackgroundsState,
  );

  const handleChangeCustomImages = (event: ChangeEvent<HTMLInputElement>) => {
    const src = URL.createObjectURL(
      ((event.target as HTMLInputElement).files as FileList)[0],
    );
    setCustomBackgrounds([...customBackgrounds, { src, theme: "custom" }]);

    return () => URL.revokeObjectURL(src);
  };

  const handleDropCustomImages = (event: DragEvent) => {
    const file = ((event.dataTransfer as DataTransfer).files as FileList)[0];
    const src = URL.createObjectURL(file);

    if (file.type.includes("image")) {
      setCustomBackgrounds([...customBackgrounds, { src, theme: "custom" }]);
    } else {
      throw new Error("FileNotAcceptable");
    }
    return () => URL.revokeObjectURL(src);
  };

  return (
    <label className={styles.file}>
      {isDragging && <span className={styles.dragging}></span>}
      <span className={`material-symbols-outlined ${styles.icon}`}>
        add_photo_alternate
      </span>
      <span>Drag and Drop</span>
      <input
        type="file"
        onChange={handleChangeCustomImages}
        accept="image/*"
        ref={dragRef}
      />
      {showAlert && (
        <Alert onClose={() => setShowAlert(false)}>
          <strong>{t("alert.uploadOnlyImages")}</strong>
          <p>{t("alert.makeSureImageExtensions")}</p>
          <AlertButton onClick={() => setShowAlert(false)}>
            {t("button.confirm")}
          </AlertButton>
        </Alert>
      )}
    </label>
  );
};

export default DragAndDropFile;
