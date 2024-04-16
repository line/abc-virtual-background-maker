import { atom } from "recoil";

import type { Theme } from "@/constants";

const themesState = atom({
  key: "themesState",
  default: [] as Array<Theme>,
});

const selectedThemeState = atom({
  key: "selectedThemeState",
  default: "all",
});

export { themesState, selectedThemeState };
