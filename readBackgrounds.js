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
import JSONStream from "JSONStream";
import fs from "fs";
import path from "path";
import config from "./app.config.json" assert { type: "json" };

const __dirname = path.resolve();
const __configFilename = "app.config.json";
const { backgroundsUri: backgroundsUri, themes } = config
const themesOrder = themes.map(({ name }) => name);

function startWriteStream(list) {
  fs.readFile(path.resolve(__dirname, `./${__configFilename}`), (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let config = JSON.parse(data);
      list.forEach((item, index) => {
        config.themes[index].backgrounds = item;
      })
      const transformStream = JSONStream.stringify(false);
      const outputStream = fs.createWriteStream(
        __dirname + `/${__configFilename}`
      );
      transformStream.pipe(outputStream);
      transformStream.write(config);
      transformStream.end();
    }
  });
}

function readDirectory(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (error, files) => {
      error ? reject(error) : resolve(files);
    });
  });
}

async function readEachDirectory(theme) {
  const files = await readDirectory(
    path.resolve(__dirname, `${backgroundsUri}/${theme}`)
  );
  const images = files.filter((value) =>
    value.includes("jpg" || "jpeg" || "png" || "webp" || "gif" )
  );
  return images;
}

async function readEachDirectoryFiles() {
  const imageFiles = (
    await Promise.all(
      themesOrder.map((theme) => {
        return readEachDirectory(theme);
      })
    )
  ).reduce((result, images, index) => {
    const current = images.map((imageFile) => (
      imageFile.split(".")?.[2] ? {
        src: `${themesOrder[index]}/${imageFile}`,
        fontColor: imageFile.split(".")[1],
      } : {
        src: `${themesOrder[index]}/${imageFile}`,
      }));
    return [...result, current];
  }, []);
  return imageFiles;
}

(async () => {
  const backgrounds = await readEachDirectoryFiles();
  startWriteStream(backgrounds);
})();
