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
import { useEffect, useState } from "react";
import readmeFile from "~/CONTRIBUTING.md";
import Markdown from "react-markdown";

import styles from "./GuideDialog.module.scss";

interface Props {
  isVisible: boolean;
  onClose: VoidFunction;
}

const GuideDialog = (props: Props) => {
  const { isVisible, onClose } = props;
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(readmeFile)
      .then((response) => response.text())
      .then(setMarkdown);
  }, []);

  if (!isVisible) {
    return <></>;
  }

  return (
    <div className={styles.dim} onClick={onClose}>
      <div className={styles.guide} onClick={(e) => e.stopPropagation()}>
        <div className={styles.markdown}>
          <Markdown disallowedElements={["img"]}>{`${markdown}`}</Markdown>
        </div>
        <button type="button" aria-label="Close guide modal" onClick={onClose}>
          <span className="material-symbols-outlined">cancel</span>
        </button>
      </div>
    </div>
  );
};

export default GuideDialog;
