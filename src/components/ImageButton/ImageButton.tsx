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
import { CSSProperties, useEffect, useState } from "react";

import { EditableImage } from "@/components";
import { InputField, InputFieldGroup, Theme } from "@/constants";
import { useAppConfiguration, useImageColor } from "@/hooks";
import styles from "./ImageButton.module.scss";

const DEFAULT_FONT_STYLE = "LINE Seed";

interface Props {
  theme?: string;
  src: string;
  color?: string;
  onClick: VoidFunction;
  onClickDelete?: VoidFunction;
}

const ImageButton = (props: Props) => {
  const { theme, src, color, onClick, onClickDelete } = props;
  const { themes, defaultInputFields } = useAppConfiguration();
  const { isDarkImage } = useImageColor(src);
  const textColor = color
    ? color
    : isDarkImage === null
      ? "transparent"
      : isDarkImage
        ? "255,255,255"
        : "0,0,0";

  const [inputOptions, setInputOptions] = useState<Record<string, InputField>>(
    {},
  );
  const themeInputFields = (
    themes.filter(({ name }) => name === theme)?.[0] as Theme
  )?.inputFields as Array<InputFieldGroup>;
  const [inputFields, setInputFields] = useState<Array<InputFieldGroup>>(
    themeInputFields ?? defaultInputFields,
  );

  useEffect(() => {
    setInputFields(themeInputFields ?? defaultInputFields);
  }, [defaultInputFields, theme, themeInputFields]);

  useEffect(() => {
    const initialOptions: Record<string, InputField> = {};
    inputFields.map(({ fields }) => {
      fields.map(
        ({ label, fontSize, fontStyle = DEFAULT_FONT_STYLE, text }, index) => {
          initialOptions[label] = {
            label,
            fontStyle,
            fontSize,
            text,
            isVisible: true,
            opacity: index === 0 ? 100 : 60,
          };
        },
      );
    });
    setInputOptions(initialOptions);
  }, [inputFields]);

  return (
    <>
      <button type="button" onClick={onClick} className={styles.button}>
        <EditableImage
          src={src}
          size={{ width: "160", height: "90" }}
          fontColor={textColor}
          inputFields={inputFields}
          inputOptions={inputOptions}
        />
      </button>
      {Boolean(onClickDelete) && (
        <button
          type="button"
          onClick={onClickDelete}
          className={styles.delete}
          aria-label="delete custom image"
          style={
            {
              "--text-color": textColor,
            } as CSSProperties
          }
        >
          <span className="material-symbols-outlined">cancel</span>
        </button>
      )}
    </>
  );
};

export default ImageButton;
