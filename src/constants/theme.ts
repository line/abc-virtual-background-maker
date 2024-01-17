import { Image, InputFieldGroup } from "@/constants";

export interface Theme {
  name: string;
  backgrounds: Array<Image>;
  inputFields?: Array<InputFieldGroup>;
  isNew?: boolean;
}
