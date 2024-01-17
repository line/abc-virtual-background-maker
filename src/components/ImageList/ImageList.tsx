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
import { MutableRefObject, useEffect, useRef } from "react";
import { themes } from "~/app.config.json";

import { ImageButton } from "@/components";
import { Image } from "@/constants";
import { useAppConfiguration, useDraggableScroll } from "@/hooks";
import styles from "./ImageList.module.scss";

const ImageList = () => {
  const {
    selectedTheme,
    selectedImage,
    handleChangeImage,
    customImages,
    handleChangeCustomImages,
    handleDeleteCustomImage,
  } = useAppConfiguration();
  const draggableElementRef = useRef<HTMLUListElement>(null);
  const { events } = useDraggableScroll(
    draggableElementRef as MutableRefObject<HTMLUListElement>,
  );

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
              className={selectedImage.src === image.src ? styles.selected : ""}
            >
              <ImageButton
                theme={theme.name}
                src={image.src}
                color={image?.fontColor}
                onClick={() => handleChangeImage(theme.name, image)}
              />
            </li>
          )),
        )}
      {(selectedTheme === "all" || selectedTheme === "custom") && (
        <>
          {customImages?.map((file: Image, index) => (
            <li
              key={index}
              className={selectedImage.src === file.src ? styles.selected : ""}
            >
              <ImageButton
                src={file.src}
                onClick={() => handleChangeImage("custom", { src: file.src })}
                onClickDelete={() => handleDeleteCustomImage(file.src)}
              />
            </li>
          ))}
          <li>
            <label className={styles.file}>
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
    </ul>
  );
};

export default ImageList;
