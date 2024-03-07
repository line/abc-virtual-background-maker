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
  useEffect,
  useRef,
  useState,
} from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

import { Tooltip } from "@/components";
import { Alignment, Font, FontSize, FontSizes } from "@/constants";
import { useElementSize } from "@/hooks";
import styles from "./TextInput.module.scss";

const defaultPosition = { x: 0, y: 0 };

interface Props {
  dragKey?: string;
  size: FontSize;
  color?: string;
  style?: Font;
  alignment?: Alignment;
  label: string;
  tooltip?: string;
  defaultValue?: string;
  isFocused?: boolean;
  onFocus?: (event: FocusEvent<HTMLDivElement>) => void;
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
}

const TextInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    dragKey,
    size,
    color,
    style,
    alignment = "left",
    label,
    defaultValue,
    tooltip,
    isFocused,
    onFocus,
    onBlur,
  } = props;
  const [textRef, { width }, handleSize] = useElementSize();
  const dragRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [dragPosition, setDragPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);

  const placeholder = label.charAt(0).toUpperCase() + label.slice(1);

  const handleResetDragPosition = () => {
    dragRef.current?.setAttribute("style", "transform: translate(0,0)");
    setDragPosition(defaultPosition);
  };

  const handleStart = () => {
    setIsDragging(true);
  };

  const handleStop = (_: DraggableEvent, data: DraggableData) => {
    setDragPosition({ x: data.x, y: data.y });
    setIsDragging(false);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      onBlur?.(event);
    }
  };

  useEffect(() => {
    handleSize();
  }, [handleSize, size, style]);

  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  useEffect(() => {
    handleResetDragPosition();
  }, [dragKey]);

  return (
    <div
      className={`${styles.wrapper} ${styles[alignment]}`}
      style={
        {
          "--font-size": FontSizes[size],
          "--text-color": color,
        } as CSSProperties
      }
    >
      <Draggable
        defaultClassNameDragging={styles.dragging}
        nodeRef={dragRef}
        disabled={window?.innerWidth < 768}
        defaultPosition={defaultPosition}
        position={dragPosition}
        onStart={handleStart}
        onStop={handleStop}
      >
        <div
          ref={dragRef}
          className={`${styles.box} ${isFocused ? styles.focused : ""}`}
          onFocus={onFocus}
          onBlur={handleBlur}
        >
          <label
            style={{ width: `${Math.min(width, 1000)}px` }}
            className={`${styles.label} ${isFocused ? styles.visible : ""}`}
          >
            <input
              ref={ref}
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              style={{
                fontFamily: `'${style}', 'LINE Seed', 'LINE Seed KR', serif`,
              }}
              autoComplete={"new-password"}
              aria-autocomplete={"none"}
              list={"autocomplete-off"}
            />
          </label>
          <span className={styles.tag}>{label}</span>
        </div>
      </Draggable>
      <span
        ref={textRef}
        className={`${styles["overlay-text"]} ${
          !isFocused ? styles.visible : ""
        }`}
        style={{
          fontFamily: `'${style}', 'LINE Seed', 'LINE Seed KR', serif`,
          transform: `${dragRef?.current?.style.transform}`,
        }}
        aria-hidden
      >
        {value?.length === 0 ? placeholder : value}
      </span>
      <Tooltip
        visible={Boolean(isFocused && tooltip) && !isDragging}
        style={{ transform: `${dragRef?.current?.style.transform}` }}
      >
        {tooltip}
      </Tooltip>
    </div>
  );
});

export default TextInput;
