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
  ChangeEvent,
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import config from "~/app.config.json";

import { Image } from "@/constants";

interface ContextProps {
  selectedTheme: string;
  selectedImage: Image;
  customImages: Array<Image>;
  handleChangeTheme: (theme: string) => void;
  handleChangeImage: (theme: string, image: Image) => void;
  handleDropCustomImages: (event: DragEvent) => void;
  handleChangeCustomImages: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDeleteCustomImage: (src: string) => void;
}

export const AppContext = createContext<ContextProps>({
  customImages: [],
  selectedTheme: "all",
  selectedImage: config.themes[0].backgrounds[0],
  handleChangeTheme: () => {},
  handleChangeImage: () => {},
  handleDropCustomImages: () => {},
  handleChangeCustomImages: () => {},
  handleDeleteCustomImage: () => {},
});

export const AppProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [selectedImage, setSelectedImage] = useState({
    theme: config.themes[0].name,
    ...config.themes[0].backgrounds[0],
  });
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [customImages, setCustomImages] = useState<Array<Image>>([]);

  const handleDropCustomImages = (event: DragEvent) => {
    const src = URL.createObjectURL(
      ((event.dataTransfer as DataTransfer).files as FileList)[0],
    );
    setCustomImages([...customImages, { src, theme: "custom" }]);

    return () => URL.revokeObjectURL(src);
  };

  const handleChangeCustomImages = (event: ChangeEvent<HTMLInputElement>) => {
    const src = URL.createObjectURL(
      ((event.target as HTMLInputElement).files as FileList)[0],
    );
    setCustomImages([...customImages, { src, theme: "custom" }]);

    return () => URL.revokeObjectURL(src);
  };

  const handleDeleteCustomImage = (src: string) => {
    setCustomImages([...customImages.filter((file) => file.src !== src)]);
  };

  const handleChangeTheme = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handleChangeImage = (theme: string, image: Image) => {
    setSelectedImage({ theme, ...image });
  };

  useEffect(() => {
    if (selectedTheme === "custom") {
      handleChangeImage(
        "custom",
        customImages?.length > 0
          ? customImages[customImages.length - 1]
          : { src: "" },
      );
    }
  }, [selectedTheme, customImages]);

  return (
    <AppContext.Provider
      value={{
        customImages,
        selectedTheme,
        selectedImage,
        handleChangeTheme,
        handleChangeImage,
        handleDropCustomImages,
        handleChangeCustomImages,
        handleDeleteCustomImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
