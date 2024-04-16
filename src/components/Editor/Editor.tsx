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
  FocusEvent,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import {
  AlignSelect,
  ColorPicker,
  EditableImage,
  GuideDialog,
  LocaleSelect,
  OpacityRange,
  Select,
  TextButton,
  ToggleOption,
} from "@/components";
import {
  Alignment,
  Alignments,
  Font,
  Fonts,
  FontSize,
  FontSizes,
  InputField,
  InputFieldGroup,
  Theme,
} from "@/constants";
import { useImageColor } from "@/hooks";
import { IconGithub } from "@/icons";
import {
  defaultInputFieldsState,
  selectedBackgroundState,
  selectedThemeState,
  themesState,
} from "@/states";
import { convertRgbToHex } from "@/utils";
import styles from "./Editor.module.scss";

const DEFAULT_FONT_STYLE = "LINE Seed";

const Editor = forwardRef<HTMLDivElement>((_, ref) => {
  const selectedTheme = useRecoilValue(selectedThemeState);
  const selectedBackground = useRecoilValue(selectedBackgroundState);
  const defaultInputFields = useRecoilValue(defaultInputFieldsState);
  const { src, fontColor, theme } = selectedBackground;
  const themes = useRecoilValue(themesState);
  const { isDarkImage } = useImageColor(src);
  const [dragKey, setDragKey] = useState("");
  const [guideVisible, setGuideVisible] = useState(false);
  const [isImageFlip, setIsImageFlip] = useState(false);
  const [initialColor, setInitialColor] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const focusedAreaRef = useRef<HTMLUListElement>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement>>({});
  const [inputOptions, setInputOptions] = useState<Record<string, InputField>>(
    {},
  );
  const initialInputFields =
    ((themes.filter(({ name }) => name === theme)?.[0] as Theme)
      ?.inputFields as Array<InputFieldGroup>) ?? defaultInputFields;
  const [inputFields, setInputFields] =
    useState<Array<InputFieldGroup>>(initialInputFields);
  const { t } = useTranslation();

  const handleClickGithub = () => {
    window.open(
      "https://www.github.com/line/abc-virtual-background-maker",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleClickInput = (label: string) => {
    setInputOptions((prevState) => {
      return {
        ...prevState,
        [label]: {
          ...prevState[label],
          isVisible: !prevState[label]?.isVisible,
        },
      };
    });
  };

  const handleFocusInput = (event: FocusEvent<HTMLDivElement>) => {
    setFocusedInput(
      event.currentTarget.getElementsByTagName("span")[0].textContent ?? "",
    );
  };

  const handleBlurInput = (event: FocusEvent<HTMLDivElement>) => {
    if (
      !event.relatedTarget ||
      !focusedAreaRef.current?.contains(event.relatedTarget)
    ) {
      setFocusedInput("");
      focusedAreaRef.current?.blur();
    }
  };

  const handleReset = useCallback(() => {
    if (inputRefs?.current) {
      const date = new Date();
      setDragKey(date.toLocaleString());
    }
    const initialOptions: Record<string, InputField> = {};
    inputFields.map(({ fields }) => {
      fields.map(
        (
          { label, fontSize, fontStyle = DEFAULT_FONT_STYLE, text, tooltip },
          index,
        ) => {
          initialOptions[label] = {
            label,
            fontStyle,
            fontSize,
            text,
            tooltip,
            isVisible: true,
            opacity: index === 0 ? 100 : 60,
          };
        },
      );
    });
    setInputOptions(initialOptions);
  }, [inputFields]);

  const handleChangeFontStyle = (style: Font) => {
    setInputOptions((prevState) => {
      return {
        ...prevState,
        [focusedInput]: {
          ...prevState[focusedInput],
          fontStyle: style,
        },
      };
    });
    inputRefs.current[focusedInput].focus();
  };

  const handleChangeFontSize = (size: FontSize) => {
    setInputOptions((prevState) => {
      return {
        ...prevState,
        [focusedInput]: {
          ...prevState[focusedInput],
          fontSize: size,
        },
      };
    });
    inputRefs.current[focusedInput].focus();
  };

  const handleChangeFontColor = (color: string) => {
    setInputOptions((prevState) => {
      return {
        ...prevState,
        [focusedInput]: {
          ...prevState[focusedInput],
          fontColor: color,
        },
      };
    });
    inputRefs.current[focusedInput].focus();
  };

  const handleChangeOpacity = (opacity: number) => {
    setInputOptions((prevState) => {
      return {
        ...prevState,
        [focusedInput]: {
          ...prevState[focusedInput],
          opacity,
        },
      };
    });
    inputRefs.current[focusedInput].focus();
  };

  const handleChangeAlignment = (align: Alignment) => {
    setInputOptions((prevState) => {
      return {
        ...prevState,
        [focusedInput]: {
          ...prevState[focusedInput],
          alignment: align,
        },
      };
    });
  };

  useEffect(() => {
    setInputFields(initialInputFields);
  }, [initialInputFields]);

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

  useEffect(() => {
    handleReset();
  }, [handleReset, selectedTheme]);

  return (
    <>
      <div className={styles.edit}>
        <div className={styles.inner}>
          <EditableImage
            dragKey={dragKey}
            ref={ref}
            isEditable
            isImageDroppable={selectedTheme === "custom"}
            isImageFlip={isImageFlip}
            src={src}
            fontColor={fontColor}
            inputRefs={inputRefs}
            inputFields={inputFields}
            inputOptions={inputOptions}
            focusedInput={focusedInput}
            handleFocusInput={handleFocusInput}
            handleBlurInput={handleBlurInput}
          />
        </div>
        <div className={styles.buttons}>
          <TextButton
            icon={<span className="material-symbols-outlined">help</span>}
            onClick={() => setGuideVisible(true)}
          >
            {t("button.contribute")}
          </TextButton>
          <TextButton icon={<IconGithub />} onClick={handleClickGithub}>
            {t("button.github")}
          </TextButton>
        </div>
      </div>
      <div className={styles.side}>
        {focusedInput ? (
          <>
            <h3>{focusedInput}</h3>
            <ul
              ref={focusedAreaRef}
              onFocus={() => inputRefs.current[focusedInput].focus()}
              tabIndex={0}
            >
              <li className={styles.custom}>
                <strong>{t("option.font")}</strong>
                <Select
                  defaultValue={inputOptions?.[focusedInput]?.fontStyle}
                  value={inputOptions?.[focusedInput]?.fontStyle}
                  onChange={(style) => handleChangeFontStyle(style as Font)}
                  options={(Object.keys(Fonts) as Array<Font>).map((size) => ({
                    name: size,
                    value: size,
                  }))}
                />
              </li>
              <li className={styles.custom}>
                <strong>{t("option.size")}</strong>
                <Select
                  defaultValue={inputOptions?.[focusedInput]?.fontSize}
                  value={inputOptions?.[focusedInput]?.fontSize}
                  onChange={(size) => handleChangeFontSize(size as FontSize)}
                  options={(Object.keys(FontSizes) as Array<FontSize>).map(
                    (size) => ({
                      name: size,
                      value: size,
                    }),
                  )}
                />
              </li>
              <li className={styles.custom}>
                <strong>{t("option.color")}</strong>
                <ColorPicker
                  defaultValue={
                    inputOptions?.[focusedInput]?.fontColor ??
                    convertRgbToHex(initialColor ?? "")
                  }
                  onChange={(e) => handleChangeFontColor(e.target.value)}
                />
              </li>
              <li className={styles.custom}>
                <strong>{t("option.opacity")}</strong>
                <OpacityRange
                  defaultValue={inputOptions?.[focusedInput]?.opacity}
                  onChange={(e) => handleChangeOpacity(Number(e.target.value))}
                />
              </li>
              <li className={styles.custom}>
                <strong>{t("option.alignment")}</strong>
                <AlignSelect
                  defaultValue={
                    inputOptions?.[focusedInput]?.alignment ?? "left"
                  }
                  value={inputOptions?.[focusedInput]?.alignment}
                  onChange={(alignment) =>
                    handleChangeAlignment(alignment as Alignment)
                  }
                  options={(Object.keys(Alignments) as Array<Alignment>).map(
                    (alignment) => ({
                      name: alignment,
                      value: alignment,
                    }),
                  )}
                />
              </li>
            </ul>
          </>
        ) : (
          <>
            <h3>{t("option.text")}</h3>
            {inputFields.map(({ fields }, index) => (
              <ul key={index}>
                {fields.map(
                  ({ label, isRequired }, index) =>
                    label && (
                      <li key={index}>
                        <ToggleOption
                          label={label}
                          isRequired={isRequired}
                          isSelected={Boolean(inputOptions[label]?.isVisible)}
                          onClick={() => handleClickInput(label)}
                        />
                      </li>
                    ),
                )}
              </ul>
            ))}
            <h3>{t("option.image")}</h3>
            <ul>
              <li>
                <ToggleOption
                  label={
                    <>
                      <span className="material-symbols-outlined">flip</span>
                      {t("option.flip")}
                    </>
                  }
                  isSelected={isImageFlip}
                  onClick={() => setIsImageFlip(!isImageFlip)}
                />
              </li>
              <li>
                <TextButton
                  icon={
                    <span className="material-symbols-outlined">
                      reset_image
                    </span>
                  }
                  onClick={handleReset}
                  className={styles.reset}
                >
                  {t("option.reset")}
                </TextButton>
              </li>
            </ul>
          </>
        )}
        <LocaleSelect />
      </div>
      <GuideDialog
        isVisible={guideVisible}
        onClose={() => setGuideVisible(false)}
      />
    </>
  );
});

export default Editor;
