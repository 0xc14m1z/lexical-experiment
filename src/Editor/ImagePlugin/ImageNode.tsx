import { ReactNode } from "react";
import { DecoratorNode, EditorConfig, LexicalEditor, NodeKey } from "lexical";

import { SerializedImageNode } from "./SerializedImageNode";
import { ImageComponent } from "./ImageComponent";

export class ImageNode extends DecoratorNode<ReactNode> {
  __source: string;

  static getType() {
    return "customImage" as const;
  }

  constructor(source: string, key?: NodeKey) {
    super(key);
    this.__source = source;
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__source, node.__key);
  }

  createDOM() {
    return document.createElement("div");
  }

  updateDOM() {
    return false;
  }

  exportJSON(): SerializedImageNode {
    return {
      version: 1,
      source: this.__source,
      type: ImageNode.getType(),
    };
  }

  decorate(_editor: LexicalEditor, config: EditorConfig) {
    return (
      <ImageComponent
        source={this.__source}
        nodeKey={this.__key}
        editorConfig={config}
      />
    );
  }
}
