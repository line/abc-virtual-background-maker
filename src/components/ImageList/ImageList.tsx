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
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { Alert, AlertButton, ImageButton } from "@/components";
import type { Image } from "@/constants";
import { useDragAndDrop, useDraggableScroll } from "@/hooks";
import {
  customBackgroundsState,
  selectedBackgroundState,
  selectedThemeState,
  themesState,
} from "@/states";
import styles from "./ImageList.module.scss";

const ImageList = () => {
  const themes = useRecoilValue(themesState);
  const selectedTheme = useRecoilValue(selectedThemeState);
  const [selectedBackground, setSelectedBackground] = useRecoilState(
    selectedBackgroundState,
  );
  const [customBackgrounds, setCustomBackgrounds] = useRecoilState(
    customBackgroundsState,
  );
  const draggableElementRef = useRef<HTMLUListElement>(null);
  const { events } = useDraggableScroll(
    draggableElementRef as MutableRefObject<HTMLUListElement>,
  );

  const dragRef = useRef<HTMLLabelElement>(null);
  const [showAlert, setShowAlert] = useState(false);

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

  const handleDrop = (e: DragEvent) => {
    try {
      handleDropCustomImages(e);
    } catch (e) {
      setShowAlert(true);
    }
  };

  const { isDragging } = useDragAndDrop(dragRef, handleDrop);
  const { t } = useTranslation();

  const handleChangeCustomImages = (event: ChangeEvent<HTMLInputElement>) => {
    const src = URL.createObjectURL(
      ((event.target as HTMLInputElement).files as FileList)[0],
    );
    setCustomBackgrounds([...customBackgrounds, { src, theme: "custom" }]);

    return () => URL.revokeObjectURL(src);
  };

  const handleDeleteCustomImage = (src: string) => {
    setCustomBackgrounds([
      ...customBackgrounds.filter((file: { src: string }) => file.src !== src),
    ]);
  };

  useEffect(() => {
    draggableElementRef?.current?.scrollTo(0, 0);
  }, [selectedTheme]);

  return (
    <ul className={styles.images} ref={draggableElementRef} {...events}>
      {themes
        .filter(({ name }) => name === selectedTheme || selectedTheme === "all")
        ?.map((theme) =>
          theme.backgrounds.map((image: Image, index) => (
            <li
              key={index}
              className={
                selectedBackground.src === image.src ? styles.selected : ""
              }
            >
              <ImageButton
                theme={theme.name}
                src={image.src}
                color={image?.fontColor}
                onClick={() =>
                  setSelectedBackground({ theme: theme.name, ...image })
                }
              />
            </li>
          )),
        )}
      {(selectedTheme === "all" || selectedTheme === "custom") && (
        <>
          {customBackgrounds?.map((file: Image, index: number) => (
            <li
              key={index}
              className={
                selectedBackground.src === file.src ? styles.selected : ""
              }
            >
              <ImageButton
                src={file.src}
                onClick={() =>
                  setSelectedBackground({ theme: "custom", src: file.src })
                }
                onClickDelete={() => handleDeleteCustomImage(file.src)}
              />
            </li>
          ))}
          <li>
            {isDragging && <span className={styles.dragging}></span>}
            <label className={styles.file} ref={dragRef}>
              <span className="material-symbols-outlined">add</span>
              <input
                type="file"
                onChange={handleChangeCustomImages}
                accept="image/*"
              />
            </label>
          </li>
        </>
      )}
      {showAlert && (
        <Alert onClose={() => setShowAlert(false)}>
          <strong>{t("alert.uploadOnlyImages")}</strong>
          <p>{t("alert.makeSureImageExtensions")}</p>
          <AlertButton onClick={() => setShowAlert(false)}>
            {t("button.confirm")}
          </AlertButton>
        </Alert>
      )}
    </ul>
  );
};

export default ImageList;
