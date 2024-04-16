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
  CSSProperties,
  FocusEvent,
  forwardRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { Alert, AlertButton, DragAndDropFile, TextInput } from "@/components";
import {
  Alignment,
  Font,
  FontSize,
  InputField,
  InputFieldGroup,
} from "@/constants";
import { useDragAndDrop, useElementSize, useImageColor } from "@/hooks";
import {
  customBackgroundsState,
  defaultInputFieldsState,
  selectedThemeState,
} from "@/states";
import { convertHexToRgb } from "@/utils";
import styles from "./EditableImage.module.scss";

interface Props {
  dragKey?: string;
  src: string;
  size?: {
    width: string;
    height: string;
  };
  fontColor?: string;
  inputRefs?: MutableRefObject<Record<string, HTMLInputElement>>;
  inputFields: Array<InputFieldGroup>;
  inputOptions: Record<string, InputField>;
  isEditable?: boolean;
  isImageDroppable?: boolean;
  isImageFlip?: boolean;
  focusedInput?: string;
  handleFocusInput?: (event: FocusEvent<HTMLDivElement>) => void;
  handleBlurInput?: (event: FocusEvent<HTMLDivElement>) => void;
}

const EditableImage = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    dragKey,
    src,
    size,
    fontColor,
    inputRefs,
    inputFields,
    inputOptions,
    isEditable,
    isImageFlip,
    isImageDroppable,
    focusedInput,
    handleFocusInput,
    handleBlurInput,
  } = props;
  const { isDarkImage } = useImageColor(src);
  const [imageRef, { width: imageWidth }] = useElementSize();
  const [initialColor, setInitialColor] = useState("");
  const defaultInputFields = useRecoilValue(defaultInputFieldsState);
  const selectedTheme = useRecoilValue(selectedThemeState);
  const [customBackgrounds, setCustomBackgrounds] = useRecoilState(
    customBackgroundsState,
  );
  const [showAlert, setShowAlert] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
  const placeholderImage =
    "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

  useEffect(() => {
    setInitialColor(
      fontColor
        ? fontColor
        : isDarkImage === null
          ? "transparent"
          : isDarkImage
            ? "255,255,255"
            : "0,0,0",
    );
  }, [fontColor, isDarkImage]);

  const getAlignItems = (direction: string, position: string) => {
    if (direction === "row") {
      return "center";
    } else {
      if (
        position === "top-right" ||
        position === "center-right" ||
        position === "bottom-right"
      ) {
        return "flex-end";
      } else if (
        position === "top-left" ||
        position === "center-left" ||
        position === "bottom-left"
      ) {
        return "flex-start";
      } else {
        return "center";
      }
    }
  };

  return (
    <div
      ref={ref}
      className={`${styles.image} ${isImageFlip ? styles.flip : ""}`}
      style={
        {
          "--text-scale": (imageWidth / 1104).toFixed(2),
        } as CSSProperties
      }
    >
      {selectedTheme === "custom" && !src ? (
        <DragAndDropFile />
      ) : isImageDroppable ? (
        <div ref={dragRef} className={styles.drop}>
          {isDragging && <span className={styles.dragging}></span>}
          <img
            src={src ?? placeholderImage}
            alt=""
            ref={imageRef}
            width={size?.width ?? 1152}
            height={size?.width ?? 648}
            className={styles.preview}
          />
        </div>
      ) : (
        <>
          <img
            src={src ?? placeholderImage}
            alt=""
            ref={imageRef}
            width={size?.width ?? 1152}
            height={size?.width ?? 648}
            className={styles.preview}
            loading={size ? "lazy" : "eager"}
          />
        </>
      )}
      {inputFields.map(({ direction, offset, position, fields }, index) => {
        const inputFieldGroupDirection =
          direction ?? defaultInputFields[index]?.direction ?? "column";
        const inputFieldGroupPosition =
          position ?? defaultInputFields[index]?.position ?? "top-left";
        return (
          <ul
            key={index}
            className={`${styles.inputs} ${styles[position]}`}
            style={{
              flexDirection: direction,
              alignItems: getAlignItems(
                inputFieldGroupDirection,
                inputFieldGroupPosition,
              ),
              transform: offset ? `translate(${offset.x},${offset.y})` : "",
              pointerEvents: isEditable ? "auto" : "none",
            }}
          >
            {fields.map(
              (
                {
                  label,
                  fontSize,
                  fontStyle,
                  offset,
                  text,
                  opacity = 100,
                  image,
                  imageSize,
                },
                index,
              ) => {
                const fontColorRgb = convertHexToRgb(
                  inputOptions[label]?.fontColor ?? "",
                );
                if (!label) {
                  return (
                    <li key={index}>
                      <img
                        src={image}
                        alt=""
                        style={{
                          transform: offset
                            ? `translate(${offset.x},${offset.y})`
                            : "",
                          width: imageSize?.width,
                          height: imageSize?.height,
                          opacity: opacity,
                        }}
                        width={imageSize?.width}
                        height={imageSize?.height}
                      />
                    </li>
                  );
                }
                return (
                  inputOptions[label]?.isVisible && (
                    <li
                      key={index}
                      style={{
                        transform: offset
                          ? `translate(${offset.x},${offset.y})`
                          : "",
                      }}
                    >
                      <TextInput
                        dragKey={dragKey}
                        ref={(ref) =>
                          ref && inputRefs && (inputRefs.current[label] = ref)
                        }
                        color={
                          fontColorRgb
                            ? `rgba(${fontColorRgb.r},${fontColorRgb.g},${
                                fontColorRgb.b
                              },${
                                (inputOptions[label].opacity ?? opacity) * 0.01
                              })`
                            : `rgba(${initialColor},${
                                (inputOptions[label].opacity ?? opacity) * 0.01
                              })`
                        }
                        size={
                          (inputOptions[label].fontSize ?? fontSize) as FontSize
                        }
                        style={
                          (inputOptions[label].fontStyle ?? fontStyle) as Font
                        }
                        alignment={inputOptions[label].alignment as Alignment}
                        label={label}
                        defaultValue={text ?? ""}
                        tooltip={inputOptions[label]?.tooltip}
                        isFocused={focusedInput === label}
                        onFocus={handleFocusInput}
                        onBlur={handleBlurInput}
                      />
                    </li>
                  )
                );
              },
            )}
          </ul>
        );
      })}
      {showAlert && (
        <Alert onClose={() => setShowAlert(false)}>
          <strong>{t("alert.uploadOnlyImages")}</strong>
          <p>{t("alert.makeSureImageExtensions")}</p>
          <AlertButton onClick={() => setShowAlert(false)}>
            {t("button.confirm")}
          </AlertButton>
        </Alert>
      )}
    </div>
  );
});

export default EditableImage;
