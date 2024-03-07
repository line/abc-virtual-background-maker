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
import { MutableRefObject, useCallback, useEffect, useState } from "react";

function useDragAndDrop(
  ref: MutableRefObject<HTMLElement | null>,
  onDrop: (e: DragEvent) => void,
) {
  const [isDragging, setIsDragging] = useState(false);

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
      onDrop(e);
      setIsDragging(false);
    },
    [onDrop],
  );

  const initDragEvents = useCallback(() => {
    if (ref.current !== null) {
      ref.current.addEventListener("dragenter", handleDragIn);
      ref.current.addEventListener("dragleave", handleDragOut);
      ref.current.addEventListener("dragover", handleDragOver);
      ref.current.addEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop, ref]);

  const resetDragEvents = useCallback(() => {
    if (ref.current !== null) {
      ref.current.removeEventListener("dragenter", handleDragIn);
      ref.current.removeEventListener("dragleave", handleDragOut);
      ref.current.removeEventListener("dragover", handleDragOver);
      ref.current.removeEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop, ref]);

  useEffect(() => {
    initDragEvents();

    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  return {
    isDragging,
  };
}

export default useDragAndDrop;
