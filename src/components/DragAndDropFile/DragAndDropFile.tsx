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

import { useCallback, useEffect, useRef, useState } from "react";

import { Alert, AlertButton } from "@/components";
import { useAppConfiguration } from "@/hooks";
import locales from "@/locales/common.json";
import styles from "./DragAndDropFile.module.scss";

const DragAndDropFile = () => {
  const { handleChangeCustomImages, handleDropCustomImages } =
    useAppConfiguration();
  const dragRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleDragIn = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOut = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer!.files) {
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        handleDropCustomImages(e);
      } catch (e) {
        setShowAlert(true);
      }
      setIsDragging(false);
    },
    [handleDropCustomImages],
  );

  const initDragEvents = useCallback(() => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener("dragenter", handleDragIn);
      dragRef.current.addEventListener("dragleave", handleDragOut);
      dragRef.current.addEventListener("dragover", handleDragOver);
      dragRef.current.addEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const resetDragEvents = useCallback(() => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener("dragenter", handleDragIn);
      dragRef.current.removeEventListener("dragleave", handleDragOut);
      dragRef.current.removeEventListener("dragover", handleDragOver);
      dragRef.current.removeEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  useEffect(() => {
    initDragEvents();

    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

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
          {locales["alert"]["uploadOnlyImages"]}
          <AlertButton onClick={() => setShowAlert(false)}>
            {locales["button"]["confirm"]}
          </AlertButton>
        </Alert>
      )}
    </label>
  );
};

export default DragAndDropFile;
