export interface InputFieldGroup {
  direction?: "column" | "row";
  offset?: { x: string; y: string };
  position:
    | "top-left"
    | "top-center"
    | "top-right"
    | "center-left"
    | "center"
    | "center-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  fields: Array<InputField & ImageField>;
}
export interface InputField {
  label: string;
  fontSize: string;
  fontStyle: string;
  fontColor?: string;
  opacity?: number;
  alignment?: string;
  offset?: { x: string; y: string };
  isRequired?: boolean;
  isVisible?: boolean;
  text?: string;
  tooltip?: string;
}

export interface ImageField {
  image: string;
  imageSize?: {
    width?: string;
    height?: string;
  };
  opacity?: number;
  offset?: { x: string; y: string };
}
