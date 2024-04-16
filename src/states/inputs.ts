import { atom } from "recoil";

import type { InputFieldGroup } from "@/constants";

const defaultInputFieldsState = atom({
  key: "defaultInputFields",
  default: [] as Array<InputFieldGroup>,
});

export { defaultInputFieldsState };
