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
import { useCallback, useEffect, useState } from "react";
import quantize, { ColorMap, RgbPixel } from "quantize";

const CHANNELS = 4;
const FORMATS = { rgb: "rgb", hex: "hex" };
const DEFAULT_SETTINGS = {
  colors: 5,
  cors: true,
  windowSize: 50,
  format: FORMATS.rgb,
};

function useImageColor(src: string, _settings = {}) {
  const settings = { ...DEFAULT_SETTINGS, ..._settings };
  const [colors, setColors] = useState<Array<string | Array<number>>>([]);
  const [isDarkImage, setIsDarkImage] = useState<boolean | null>(null);

  const chunk = useCallback(
    (original: Uint8ClampedArray, chunkSize = 4) => {
      const data = [];

      for (
        let i = 0;
        i < original.length;
        i += chunkSize * settings.windowSize
      ) {
        data.push(original.slice(i, i + chunkSize));
      }

      return data;
    },
    [settings.windowSize],
  );

  const mapToHex = useCallback(
    (values: Array<number>) =>
      `#${values
        .map((i) => {
          const h = i.toString(16);
          return h.length < 2 ? `0${h}` : h;
        })
        .join("")}`,
    [],
  );

  if (!Object.keys(FORMATS).includes(settings.format)) {
    throw new Error("Invalid output format");
  }

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const img = document.createElement("img");

    const context = canvas.getContext("2d");

    if (settings.cors) {
      img.setAttribute("crossOrigin", "");
    }

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      if (context) {
        context.drawImage(img, 0, 0);
        const { data } = context.getImageData(
          0,
          0,
          img.naturalWidth,
          img.naturalHeight,
        );
        const colorMap: ColorMap = quantize(
          chunk(data, CHANNELS) as unknown as Array<RgbPixel>,
          settings.colors,
        ) as ColorMap;
        const palette = colorMap && colorMap.palette();
        setColors(
          settings.format === FORMATS.rgb ? palette : palette.map(mapToHex),
        );
      }
    };

    img.src = src;
  }, [src, settings.cors, settings.colors, settings.format, chunk, mapToHex]);

  useEffect(() => {
    if (colors?.[0]) {
      const colorRgb = colors[0];
      const r: number = parseFloat(
        typeof colorRgb[0] === "string" ? colorRgb[0] : `${colorRgb[0]}`,
      );
      const g: number = parseFloat(
        typeof colorRgb[1] === "string" ? colorRgb[1] : `${colorRgb[1]}`,
      );
      const b: number = parseFloat(
        typeof colorRgb[2] === "string" ? colorRgb[2] : `${colorRgb[2]}`,
      );

      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      setIsDarkImage(luminance < 150);
    }
  }, [colors]);

  return { colors, isDarkImage };
}

export default useImageColor;
