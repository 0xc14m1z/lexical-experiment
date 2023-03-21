import { EditorConfig, LexicalEditor, NodeKey } from "lexical";
import { DecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";

import { SerializedImageNode } from "./SerializedImageNode";
import { ImageComponent } from "./ImageComponent";

export class ImageNode extends DecoratorBlockNode {
  __source: string;

  static getType() {
    return "customImage" as const;
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      version: 1,
      type: ImageNode.getType(),
      source: this.__source,
    };
  }

  constructor(source: string, key?: NodeKey) {
    super("center", key);
    this.__source = source;
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__source, node.__key);
  }

  createDOM() {
    return document.createElement("span");
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
