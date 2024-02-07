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
import config from "~/output.config.json";

import { Config } from "@/constants/config";

const { fonts } = config as Config;

export const FontSizes: Record<string, string> = {} as const;
Object.keys(fonts.sizes).forEach(
  (size) => (FontSizes[size] = fonts.sizes[size as keyof typeof fonts.sizes]),
);
export type FontSize = keyof typeof FontSizes;

export const Fonts: Record<string, string> = {} as const;
fonts.styles.forEach((font) => (Fonts[font] = font));
export type Font = keyof typeof Fonts;

export const Alignments = {
  left: "left",
  center: "center",
  right: "right",
};
export type Alignment = keyof typeof Alignments;
