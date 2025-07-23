import { Color } from "three";

export type ORB_PROPS_KEYS =
  | "colors"
  | "rotationSpeed"
  | "intensity"
  | "interval"
  | "blendValue"
  | "shadersSpeed"
  | "noise1"
  | "noise2"
  | "distance";

type ORB_PROPS_BASE = {
  [key in Exclude<ORB_PROPS_KEYS, "colors">]: number;
};

export interface ORB_PROPS_TYPE extends ORB_PROPS_BASE {
  colors: Color[];
}
