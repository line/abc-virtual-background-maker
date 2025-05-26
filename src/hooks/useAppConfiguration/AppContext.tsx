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
import { ChangeEvent, createContext, MouseEvent } from "react";

import { Image, InputFieldGroup, Theme } from "@/constants";

interface ContextProps {
  themes: Array<Theme>;
  selectedTheme: string;
  selectedImage: Image;
  customImages: Array<Image>;
  defaultInputFields: Array<InputFieldGroup>;
  isSyncing: boolean;
  handleClickSync: (event: MouseEvent<HTMLButtonElement>) => void;
  handleChangeTheme: (theme: string) => void;
  handleChangeImage: (theme: string, image: Image) => void;
  handleDropCustomImages: (event: DragEvent) => void;
  handleChangeCustomImages: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDeleteCustomImage: (src: string) => void;
}

export const AppContext = createContext<ContextProps>({
  themes: [],
  customImages: [],
  selectedTheme: "all",
  selectedImage: {
    src: "",
  },
  defaultInputFields: [],
  isSyncing: false,
  handleClickSync: () => {},
  handleChangeTheme: () => {},
  handleChangeImage: () => {},
  handleDropCustomImages: () => {},
  handleChangeCustomImages: () => {},
  handleDeleteCustomImage: () => {},
});
