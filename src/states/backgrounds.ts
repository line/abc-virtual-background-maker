import { atom } from "recoil";

import type { Image } from "@/constants";

const selectedBackgroundState = atom({
  key: "selectedBackgroundState",
  default: {
    src: "",
  } as Image,
});

const customBackgroundsState = atom({
  key: "customBackgroundsState",
  default: [] as Array<Image>,
});

export { selectedBackgroundState, customBackgroundsState };
