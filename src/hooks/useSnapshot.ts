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
import { useCallback, useState } from "react";
import html2Canvas from "html2canvas";

const useSnapshot = (dom: React.RefObject<HTMLElement>) => {
  const [loading, setLoading] = useState<boolean>(false);

  const saveImage = useCallback(
    async (fileName: string = "image.png") => {
      if (!loading && dom.current) {
        setLoading(true);

        html2Canvas(dom.current)
          .then((blob) => {
            const base64Image = blob.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = fileName;
            link.target = "_blank";
            link.href = base64Image;
            link.click();
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    },
    [dom, loading],
  );

  return {
    saveImage,
    loading,
  };
};

export default useSnapshot;
