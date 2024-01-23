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
  MutableRefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

type OptionsType = {
  direction?: "horizontal" | "vertical" | "all";
  decayRate?: number;
  safeDisplacement?: number;
  applyRubberBandEffect?: boolean;
  activeMouseButton?: "Left" | "Middle" | "Right";
  isMounted?: boolean;
};

type ReturnType = {
  events: {
    onMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
  };
};

function useDraggableScroll(
  ref: MutableRefObject<HTMLElement>,
  {
    direction = "vertical",
    decayRate = 0.95,
    safeDisplacement = 10,
    applyRubberBandEffect = false,
    activeMouseButton = "Left",
    isMounted = true,
  }: OptionsType = {},
): ReturnType {
  const internalState = useRef({
    isMouseDown: false,
    isDraggingX: false,
    isDraggingY: false,
    initialMouseX: 0,
    initialMouseY: 0,
    lastMouseX: 0,
    lastMouseY: 0,
    scrollSpeedX: 0,
    scrollSpeedY: 0,
    lastScrollX: 0,
    lastScrollY: 0,
  });

  const isScrollableAlongX = useRef(false);
  const isScrollableAlongY = useRef(false);
  const maxHorizontalScroll = useRef(0);
  const maxVerticalScroll = useRef(0);
  const cursorStyleOfWrapperElement = useRef<string>("");
  const cursorStyleOfChildElements = useRef<Array<string>>([]);
  const transformStyleOfChildElements = useRef<Array<string>>([]);
  const transitionStyleOfChildElements = useRef<Array<string>>([]);
  const rubberBandAnimationTimer = useRef<NodeJS.Timeout>();
  const keepMovingX = useRef<NodeJS.Timeout>();
  const keepMovingY = useRef<NodeJS.Timeout>();
  const timing = (1 / 60) * 1000;

  useLayoutEffect(() => {
    if (isMounted) {
      isScrollableAlongX.current =
        window.getComputedStyle(ref.current).overflowX === "scroll";
      isScrollableAlongY.current =
        window.getComputedStyle(ref.current).overflowY === "scroll";

      maxHorizontalScroll.current =
        ref.current.scrollWidth - ref.current.clientWidth;
      maxVerticalScroll.current =
        ref.current.scrollHeight - ref.current.clientHeight;

      cursorStyleOfWrapperElement.current = window.getComputedStyle(
        ref.current,
      ).cursor;

      cursorStyleOfChildElements.current = [];
      transformStyleOfChildElements.current = [];
      transitionStyleOfChildElements.current = [];

      (ref.current.childNodes as NodeListOf<HTMLOptionElement>).forEach(
        (child: HTMLElement) => {
          cursorStyleOfChildElements.current.push(
            window.getComputedStyle(child).cursor,
          );

          transformStyleOfChildElements.current.push(
            window.getComputedStyle(child).transform === "none"
              ? ""
              : window.getComputedStyle(child).transform,
          );

          transitionStyleOfChildElements.current.push(
            window.getComputedStyle(child).transition === "none"
              ? ""
              : window.getComputedStyle(child).transition,
          );
        },
      );
    }
  }, [isMounted, ref]);

  const runScroll = useCallback(() => {
    const dx = internalState.current.scrollSpeedX * timing;
    const dy = internalState.current.scrollSpeedY * timing;
    const offsetX = ref.current.scrollLeft + dx;
    const offsetY = ref.current.scrollTop + dy;

    if (direction === "horizontal") {
      ref.current.scrollLeft = offsetX;
    } else if (direction === "vertical") {
      ref.current.scrollTop = offsetY;
    } else {
      ref.current.scrollLeft = offsetX;
      ref.current.scrollTop = offsetY;
    }
    internalState.current.lastScrollX = offsetX;
    internalState.current.lastScrollY = offsetY;
  }, [direction, ref, timing]);

  const rubberBandCallback = useCallback(
    (e: MouseEvent) => {
      const dx = e.clientX - internalState.current.initialMouseX;
      const dy = e.clientY - internalState.current.initialMouseY;

      const { clientWidth, clientHeight } = ref.current;

      let displacementX = 0;
      let displacementY = 0;

      if (isScrollableAlongX && isScrollableAlongY) {
        displacementX =
          0.3 *
          clientWidth *
          Math.sign(dx) *
          Math.log10(1.0 + (0.5 * Math.abs(dx)) / clientWidth);
        displacementY =
          0.3 *
          clientHeight *
          Math.sign(dy) *
          Math.log10(1.0 + (0.5 * Math.abs(dy)) / clientHeight);
      } else if (isScrollableAlongX) {
        displacementX =
          0.3 *
          clientWidth *
          Math.sign(dx) *
          Math.log10(1.0 + (0.5 * Math.abs(dx)) / clientWidth);
      } else if (isScrollableAlongY) {
        displacementY =
          0.3 *
          clientHeight *
          Math.sign(dy) *
          Math.log10(1.0 + (0.5 * Math.abs(dy)) / clientHeight);
      }

      (ref.current.childNodes as NodeListOf<HTMLOptionElement>).forEach(
        (child: HTMLElement) => {
          child.style.transform = `translate3d(${displacementX}px, ${displacementY}px, 0px)`;
          child.style.transition = "transform 0ms";
        },
      );
    },
    [ref],
  );

  const recoverChildStyle = useCallback(() => {
    (ref.current.childNodes as NodeListOf<HTMLOptionElement>).forEach(
      (child: HTMLElement, i) => {
        child.style.transform = transformStyleOfChildElements.current[i];
        child.style.transition = transitionStyleOfChildElements.current[i];
      },
    );
  }, [ref]);

  const callbackMomentum = useCallback(() => {
    const minimumSpeedToTriggerMomentum = 0.05;

    keepMovingX.current = setInterval(() => {
      const lastScrollSpeedX = internalState.current.scrollSpeedX;
      const newScrollSpeedX = lastScrollSpeedX * decayRate;
      internalState.current.scrollSpeedX = newScrollSpeedX;

      const isAtLeft = ref.current.scrollLeft <= 0;
      const isAtRight = ref.current.scrollLeft >= maxHorizontalScroll.current;
      const hasReachedHorizontalEdges = isAtLeft || isAtRight;

      runScroll();

      if (
        Math.abs(newScrollSpeedX) < minimumSpeedToTriggerMomentum ||
        internalState.current.isMouseDown ||
        hasReachedHorizontalEdges
      ) {
        internalState.current.scrollSpeedX = 0;
        clearInterval(keepMovingX.current);
      }
    }, timing);

    keepMovingY.current = setInterval(() => {
      const lastScrollSpeedY = internalState.current.scrollSpeedY;
      const newScrollSpeedY = lastScrollSpeedY * decayRate;
      internalState.current.scrollSpeedY = newScrollSpeedY;

      const isAtTop = ref.current.scrollTop <= 0;
      const isAtBottom = ref.current.scrollTop >= maxVerticalScroll.current;
      const hasReachedVerticalEdges = isAtTop || isAtBottom;

      runScroll();

      if (
        Math.abs(newScrollSpeedY) < minimumSpeedToTriggerMomentum ||
        internalState.current.isMouseDown ||
        hasReachedVerticalEdges
      ) {
        internalState.current.scrollSpeedY = 0;
        clearInterval(keepMovingY.current);
      }
    }, timing);

    internalState.current.isDraggingX = false;
    internalState.current.isDraggingY = false;

    if (applyRubberBandEffect) {
      const transitionDurationInMilliseconds = 250;

      (ref.current.childNodes as NodeListOf<HTMLOptionElement>).forEach(
        (child: HTMLElement) => {
          child.style.transform = `translate3d(0px, 0px, 0px)`;
          child.style.transition = `transform ${transitionDurationInMilliseconds}ms`;
        },
      );

      rubberBandAnimationTimer.current = setTimeout(
        recoverChildStyle,
        transitionDurationInMilliseconds,
      );
    }
  }, [
    applyRubberBandEffect,
    decayRate,
    recoverChildStyle,
    ref,
    runScroll,
    timing,
  ]);

  const preventClick = (e: Event) => {
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  const getIsMousePressActive = (buttonsCode: number) => {
    return (
      (activeMouseButton === "Left" && buttonsCode === 1) ||
      (activeMouseButton === "Middle" && buttonsCode === 4) ||
      (activeMouseButton === "Right" && buttonsCode === 2)
    );
  };

  const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    const isMouseActive = getIsMousePressActive(e.buttons);
    if (!isMouseActive) {
      return;
    }

    internalState.current.isMouseDown = true;
    internalState.current.lastMouseX = e.clientX;
    internalState.current.lastMouseY = e.clientY;
    internalState.current.initialMouseX = e.clientX;
    internalState.current.initialMouseY = e.clientY;
  };

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      const isDragging =
        internalState.current.isDraggingX || internalState.current.isDraggingY;

      const dx = internalState.current.initialMouseX - e.clientX;
      const dy = internalState.current.initialMouseY - e.clientY;

      const isMotionIntentional =
        Math.abs(dx) > safeDisplacement || Math.abs(dy) > safeDisplacement;

      const isDraggingConfirmed = isDragging && isMotionIntentional;

      if (isDraggingConfirmed) {
        ref.current.childNodes.forEach((child) => {
          child.addEventListener("click", preventClick);
        });
      } else {
        ref.current.childNodes.forEach((child) => {
          child.removeEventListener("click", preventClick);
        });
      }

      internalState.current.isMouseDown = false;
      internalState.current.lastMouseX = 0;
      internalState.current.lastMouseY = 0;

      ref.current.style.cursor = cursorStyleOfWrapperElement.current;
      (ref.current.childNodes as NodeListOf<HTMLOptionElement>).forEach(
        (child: HTMLElement, i) => {
          child.style.cursor = cursorStyleOfChildElements.current[i];
        },
      );

      if (isDraggingConfirmed) {
        callbackMomentum();
      }
    },
    [callbackMomentum, ref, safeDisplacement],
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!internalState.current.isMouseDown) {
        return;
      }

      e.preventDefault();

      const dx = internalState.current.lastMouseX - e.clientX;
      internalState.current.lastMouseX = e.clientX;

      internalState.current.scrollSpeedX = dx / timing;
      internalState.current.isDraggingX = true;

      const dy = internalState.current.lastMouseY - e.clientY;
      internalState.current.lastMouseY = e.clientY;

      internalState.current.scrollSpeedY = dy / timing;
      internalState.current.isDraggingY = true;

      ref.current.style.cursor = "grabbing";
      (ref.current.childNodes as NodeListOf<HTMLOptionElement>).forEach(
        (child: HTMLElement) => {
          child.style.cursor = "grabbing";
        },
      );

      const isAtLeft = ref.current.scrollLeft <= 0 && isScrollableAlongX;
      const isAtRight =
        ref.current.scrollLeft >= maxHorizontalScroll.current &&
        isScrollableAlongX;
      const isAtTop = ref.current.scrollTop <= 0 && isScrollableAlongY;
      const isAtBottom =
        ref.current.scrollTop >= maxVerticalScroll.current &&
        isScrollableAlongY;
      const isAtAnEdge = isAtLeft || isAtRight || isAtTop || isAtBottom;

      if (isAtAnEdge && applyRubberBandEffect) {
        rubberBandCallback(e);
      }

      runScroll();
    },
    [applyRubberBandEffect, ref, rubberBandCallback, runScroll, timing],
  );

  const handleResize = useCallback(() => {
    maxHorizontalScroll.current =
      ref.current.scrollWidth - ref.current.clientWidth;
    maxVerticalScroll.current =
      ref.current.scrollHeight - ref.current.clientHeight;
  }, [ref]);

  useEffect(() => {
    if (isMounted) {
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("resize", handleResize);
    }
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);

      clearInterval(keepMovingX.current);
      clearInterval(keepMovingY.current);
      clearTimeout(rubberBandAnimationTimer.current);
    };
  }, [
    handleResize,
    isMounted,
    onMouseMove,
    onMouseUp,
    keepMovingX,
    keepMovingY,
    rubberBandAnimationTimer,
  ]);

  return {
    events: {
      onMouseDown,
    },
  };
}

export default useDraggableScroll;
