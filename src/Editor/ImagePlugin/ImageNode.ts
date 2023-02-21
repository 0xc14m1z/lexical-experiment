import { ElementNode, NodeKey } from "lexical";
import { SerializedImageNode } from "./SerializedImageNode";

export class ImageNode extends ElementNode {
  __source: string;

  static getType() {
    return "image" as const;
  }

  constructor(source: string, key?: NodeKey) {
    super(key);
    this.__source = source;
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__source, node.__key);
  }

  createDOM(): HTMLImageElement {
    const element = document.createElement("img");
    element.setAttribute("src", this.__source);
    return element;
  }

  updateDOM(): boolean {
    return false;
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      version: 1,
      source: this.__source,
      type: ImageNode.getType(),
    };
  }
}
