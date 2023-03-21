import { ImageNode } from "./ImageNode";

export function $createImageNode(source: string): ImageNode {
  return new ImageNode(source);
}
