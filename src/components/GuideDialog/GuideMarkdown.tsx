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
import config from "~/app.config.json";
import Markdown from "react-markdown";

import type { Config } from "@/constants";
import styles from "./GuideDialog.module.scss";

const GuideMarkdown = () => {
  const { contributeGuide } = config as unknown as Config;
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(contributeGuide)
      .then((response) => response.text())
      .then(setMarkdown);
  }, [contributeGuide]);

  return (
    <div className={styles.markdown}>
      <Markdown disallowedElements={["img"]}>{`${markdown}`}</Markdown>
    </div>
  );
};

export default GuideMarkdown;
