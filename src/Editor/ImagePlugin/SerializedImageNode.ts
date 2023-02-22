import { ImageNode } from "./ImageNode";

export interface SerializedImageNode {
  version: number;
  source: string;
  type: ReturnType<(typeof ImageNode)["getType"]>;
}
