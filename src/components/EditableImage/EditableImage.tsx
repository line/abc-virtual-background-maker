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
  useState,
} from "react";
import { backgroundsUri, defaultInputFields } from "~/app.config.json";

import { DragAndDropFile, TextInput } from "@/components";
import {
  Alignment,
  Font,
  FontSize,
  InputField,
  InputFieldGroup,
} from "@/constants";
import { useElementSize, useImageColor } from "@/hooks";
import { convertHexToRgb } from "@/utils";
import styles from "./EditableImage.module.scss";

interface Props {
  dragKey?: string;
  selectedTheme?: string;
  src: string;
  fontColor?: string;
  inputRefs?: MutableRefObject<Record<string, HTMLInputElement>>;
  inputFields: Array<InputFieldGroup>;
  inputOptions: Record<string, InputField>;
  isEditable?: boolean;
  isImageFlip?: boolean;
  focusedInput?: string;
  handleFocusInput?: (event: FocusEvent<HTMLDivElement>) => void;
  handleBlurInput?: (event: FocusEvent<HTMLDivElement>) => void;
}

const EditableImage = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    dragKey,
    src,
    fontColor,
    inputRefs,
    inputFields,
    inputOptions,
    isEditable,
    isImageFlip,
    focusedInput,
    handleFocusInput,
    handleBlurInput,
  } = props;
  const imageSrc = src
    ? src.includes("blob:")
      ? src
      : `${backgroundsUri}/${src}`
    : "";
  const { isDarkImage } = useImageColor(imageSrc);
  const [imageRef, { width: imageWidth }] = useElementSize();
  const [initialColor, setInitialColor] = useState("");

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
      {imageSrc ? (
        <img src={imageSrc} alt="" ref={imageRef} width={1152} height={648} />
      ) : (
        <DragAndDropFile />
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
                { label, fontSize, fontStyle, offset, text, opacity = 100 },
                index,
              ) => {
                const fontColorRgb = convertHexToRgb(
                  inputOptions[label]?.fontColor ?? "",
                );
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
    </div>
  );
});

export default EditableImage;
